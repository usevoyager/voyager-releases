import { createHash, createPrivateKey, createPublicKey, sign, verify } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { PUBLIC_KEY, KEY_ID } from './content-public-key.mjs';
import { Schema } from 'effect';
import { ContentCatalog, ContentRevision } from './content-schema.mjs';

const MAX_BYTES = 8 * 1024 * 1024;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const safePath = value => typeof value === 'string' && value.length <= 512 && value.split('/').every(part => /^[a-zA-Z0-9_.-]+$/.test(part) && part !== '.' && part !== '..' && !part.endsWith('.') && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part));
const referenceKey = entry => `${entry.id}@${entry.revision}`;
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function signingBytes(namespace, keyId, payload) {
  return Buffer.concat([Buffer.from(`voyager-content:v1:${namespace}:${keyId}\0`), payload]);
}
export function signCatalog(catalog, namespace, privateKey, keyId = KEY_ID) {
  const payload = Buffer.from(JSON.stringify(catalog));
  if (payload.length > MAX_BYTES / 2) throw new Error('Catalog too large.');
  return { schemaVersion: 1, keyId, payload: payload.toString('base64'),
    signature: sign(null, signingBytes(namespace, keyId, payload), privateKey).toString('base64') };
}
export function verifyCatalog(envelope, namespace, publicKey = PUBLIC_KEY, keyId = KEY_ID) {
  if (envelope.schemaVersion !== 1 || envelope.keyId !== keyId || typeof envelope.payload !== 'string' || typeof envelope.signature !== 'string') throw new Error('Unsupported catalog envelope.');
  const bytes = Buffer.from(envelope.payload, 'base64');
  const signature = Buffer.from(envelope.signature, 'base64');
  if (bytes.length > MAX_BYTES / 2 || bytes.toString('base64') !== envelope.payload || signature.length !== 64 || signature.toString('base64') !== envelope.signature || !verify(null, signingBytes(namespace, keyId, bytes), publicKey, signature)) throw new Error('Invalid catalog signature.');
  return requireCatalog(JSON.parse(bytes.toString('utf8')), namespace);
}
function requireCatalog(value, namespace) {
  Schema.decodeUnknownSync(ContentCatalog)(value);
  if (value.schemaVersion !== 1 || !Number.isSafeInteger(value.catalogSequence) || value.catalogSequence < 1 || !Array.isArray(value.entries) || !Array.isArray(value.releases) || !Array.isArray(value.revoked) || value.entries.length > 10000 || !Number.isFinite(Date.parse(value.publishedAt)) || !(Date.parse(value.expiresAt) > Date.parse(value.publishedAt))) throw new Error('Invalid catalog.');
  const keys = new Set();
  for (const entry of value.entries) {
    requireEntry(entry, namespace);
    if (keys.has(referenceKey(entry))) throw new Error('Duplicate revision.');
    keys.add(referenceKey(entry));
  }
  for (const release of value.releases) {
    if (!keys.has(referenceKey(release)) || !Array.isArray(release.channels) || !release.channels.length || release.channels.some(channel => !['nightly','stable'].includes(channel)) || !Number.isFinite(Date.parse(release.nightlyPublishedAt))) throw new Error('Invalid release membership.');
  }
  for (const revoked of value.revoked) if (!revoked.id?.startsWith(namespace + '/') || !Number.isSafeInteger(revoked.revision) || revoked.revision < 1 || !revoked.reason || !Number.isFinite(Date.parse(revoked.revokedAt))) throw new Error('Invalid revocation.');
  return value;
}
function requireEntry(entry, namespace) {
  Schema.decodeUnknownSync(ContentRevision)(entry);
  if (entry.kind !== (namespace === 'skills' ? 'skill' : 'technique') || !new RegExp(`^${namespace}/[a-z0-9]+(?:-[a-z0-9]+)*$`).test(entry.id) || !Number.isSafeInteger(entry.revision) || entry.revision < 1 || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(entry.minVoyagerVersion) || !safePath(entry.payload?.target) || !entry.payload.target.startsWith(namespace + '/') || !/^[a-f0-9]{64}$/.test(entry.payload.sha256) || !Number.isSafeInteger(entry.payload.length) || entry.payload.length < 1 || entry.payload.length > MAX_BYTES / 2 || !entry.title || !entry.summary || !/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/.test(entry.sourceCommit) || !Number.isFinite(Date.parse(entry.publishedAt))) throw new Error(`Invalid ${namespace} candidate.`);
  if (namespace === 'techniques') {
    for (const item of [entry.media?.poster, entry.media?.preview, entry.media?.video, ...(entry.assets ?? [])].filter(Boolean)) {
      const url = new URL(item.url);
      if (url.origin !== 'https://cdn.moda.app' || !url.pathname.startsWith('/voyager/') || url.username || url.password || !/^[a-f0-9]{64}$/.test(item.sha256) || !Number.isSafeInteger(item.length) || item.length < 1) throw new Error('Invalid technique media.');
    }
    if (!entry.media?.poster || !entry.slug || !entry.cardTitle) throw new Error('Technique display fields missing.');
  }
}
async function fetchBytes(url, expectedLength) {
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30000) });
  if (!response.ok || !response.body) throw new Error(`Content fetch failed: ${response.status}`);
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > (expectedLength ?? MAX_BYTES)) throw new Error('Content exceeds declared bounds.');
    chunks.push(chunk);
  }
  if (expectedLength !== undefined && size !== expectedLength) throw new Error('Content length mismatch.');
  return Buffer.concat(chunks);
}
async function readOptional(path) {
  return readFile(path).catch(error => { if (error.code === 'ENOENT') return undefined; throw error; });
}
async function installImmutable(root, target, bytes, expected) {
  if (!safePath(target) || bytes.length !== expected.length || hash(bytes) !== expected.sha256) throw new Error('Payload integrity mismatch.');
  const path = join(root, target);
  const previous = await readOptional(path);
  if (previous) { if (!previous.equals(bytes)) throw new Error('Immutable payload would change.'); return; }
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, bytes, { flag: 'wx' });
}
function comparable(entry) {
  const { revision, sourceCommit, publishedAt, ...content } = entry;
  return content;
}
export function updateCatalog(previous, namespace, input) {
  const entries = [...(previous?.entries ?? [])];
  const releases = [...(previous?.releases ?? [])];
  const revoked = [...(previous?.revoked ?? [])];
  for (const candidate of [...(input.entries ?? [])].sort((a,b) => a.id.localeCompare(b.id) || a.revision-b.revision)) {
    requireEntry(candidate, namespace);
    if (namespace === 'techniques') {
      const existing = entries.find(entry => referenceKey(entry) === referenceKey(candidate));
      if (existing) { if (!same(existing, candidate)) throw new Error('Published technique revision changed.'); continue; }
      if (entries.some(entry => entry.id === candidate.id && entry.revision >= candidate.revision)) throw new Error('Technique revisions must increase.');
      entries.push(candidate);
      releases.push({ id: candidate.id, revision: candidate.revision, channels: ['nightly'], nightlyPublishedAt: input.now });
      continue;
    }
    const history = entries.filter(entry => entry.id === candidate.id).sort((a,b) => b.revision-a.revision);
    if (history[0] && same(comparable(history[0]), comparable(candidate))) continue;
    const entry = { ...candidate, revision: (history[0]?.revision ?? 0) + 1, publishedAt: input.now };
    entries.push(entry);
    releases.push({ id: entry.id, revision: entry.revision, channels: ['nightly'], nightlyPublishedAt: input.now });
  }
  if (input.action === 'promote') {
    if (!input.evidence?.trim() || !input.refs?.length) throw new Error('Promotion needs exact revisions and minimum/current-runtime evidence.');
    for (const ref of input.refs) {
      const index = releases.findIndex(release => referenceKey(release) === ref);
      const release = releases[index];
      if (!release || revoked.some(item => referenceKey(item) === ref) || Date.parse(input.now) - Date.parse(release.nightlyPublishedAt) < 12*60*60*1000) throw new Error(`Revision not eligible after nightly observation: ${ref}`);
      releases[index] = { ...release, channels: ['nightly', 'stable'] };
    }
  }
  if (input.action === 'revoke') {
    if (!input.reason?.trim() || !input.refs?.length) throw new Error('Revocation requires exact revisions and reason.');
    for (const ref of input.refs) {
      const entry = entries.find(entry => referenceKey(entry) === ref);
      if (!entry) throw new Error(`Unknown revision: ${ref}`);
      if (!revoked.some(item => referenceKey(item) === ref)) revoked.push({ id: entry.id, revision: entry.revision, reason: input.reason, revokedAt: input.now });
    }
  }
  return requireCatalog({ schemaVersion: 1, catalogSequence: (previous?.catalogSequence ?? 0) + 1,
    publishedAt: input.now, expiresAt: new Date(Date.parse(input.now) + 7*24*60*60*1000).toISOString(), entries, releases, revoked }, namespace);
}
export async function publishContent(options, trust = { publicKey: PUBLIC_KEY, keyId: KEY_ID }) {
  const key = createPrivateKey(options.privateKey);
  if (key.asymmetricKeyType !== 'ed25519' || createPublicKey(key).export({ type:'spki', format:'pem' }) !== trust.publicKey) throw new Error('Signing key does not match the pinned production public key.');
  const root = join(options.root, 'content/v1');
  const now = options.now ?? new Date().toISOString();
  if (!['refresh','promote','revoke'].includes(options.action)) throw new Error('Unknown publication action.');
  if (options.action !== 'refresh' && (!options.refs?.length || options.refs.some(ref => !/^(skills|techniques)\/[a-z0-9]+(?:-[a-z0-9]+)*@[1-9]\d*$/.test(ref)))) throw new Error('Exact namespace-qualified revision references required.');
  const planned = [];
  for (const namespace of ['skills', 'techniques']) {
    const existing = await readOptional(join(root, namespace, 'catalog.json'));
    const previous = existing ? verifyCatalog(JSON.parse(existing), namespace, trust.publicKey, trust.keyId) : undefined;
    let entries = [];
    // Emergency operations use only previously authenticated state: upstream outages cannot block them.
    if (options.action === 'refresh') {
      try {
        const candidates = namespace === 'skills'
          ? await readOptional(join(options.root, 'content/candidates/skills.json'))
          : options.techniquesUrl ? await fetchBytes(options.techniquesUrl) : undefined;
        if (candidates) {
          const exported = JSON.parse(candidates);
          if (exported.schemaVersion !== 1 || !Array.isArray(exported.entries)) throw new Error('Invalid content export.');
          for (const entry of exported.entries) {
            requireEntry(entry, namespace);
            const stored = await readOptional(join(root, entry.payload.target));
            const bytes = stored ?? (namespace === 'skills'
              ? await readFile(join(root, entry.payload.target))
              : await fetchBytes(`https://voyager.so/techniques/export/${entry.payload.target.slice('techniques/'.length)}`, entry.payload.length));
            await installImmutable(root, entry.payload.target, bytes, entry.payload);
          }
          // Validate the complete revision update before admitting any candidate to the signed history.
          updateCatalog(previous, namespace, { entries: exported.entries, now, action:'refresh' });
          entries = exported.entries;
        }
      } catch (error) {
        console.warn(`${namespace} candidate import rejected; renewing previous authenticated state:`, error.message);
      }
    }
    const refs = options.refs?.filter(ref => ref.startsWith(namespace + '/'));
    const next = updateCatalog(previous, namespace, { entries, now, action: refs?.length ? options.action : 'refresh', refs, evidence: options.evidence, reason: options.reason });
    planned.push({ namespace, catalog:next, envelope:signCatalog(next, namespace, key, trust.keyId) });
  }
  // Both namespaces validate before either pointer is written; Git publishes all files in one commit.
  for (const item of planned) {
    await mkdir(join(root,item.namespace),{recursive:true});
    await writeFile(join(root,item.namespace,'catalog.json'),JSON.stringify(item.envelope)+'\n');
  }
  const audit=planned.map(item=>({namespace:item.namespace,sequence:item.catalog.catalogSequence,revisions:item.catalog.entries.length}));
  await mkdir(join(options.root, 'content/audit'), { recursive: true });
  await writeFile(join(options.root, 'content/audit', `${now.replaceAll(':','-')}.json`), JSON.stringify({ action: options.action, refs: options.refs ?? [], evidence: options.evidence ?? null, reason: options.reason ?? null, actor: process.env.GITHUB_ACTOR ?? 'local', sourceRun: process.env.GITHUB_RUN_ID ?? null, catalogs: audit }, null, 2) + '\n');
  return audit;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { values } = parseArgs({ options: { action: {type:'string',default:'refresh'}, refs:{type:'string'}, evidence:{type:'string'}, reason:{type:'string'}, techniques:{type:'string'} } });
  if (!['refresh','promote','revoke'].includes(values.action)) throw new Error('Unknown action.');
  if (values.techniques && values.techniques !== 'https://voyager.so/techniques/export.json') throw new Error('Only the reviewed website export is accepted.');
  console.log(JSON.stringify(await publishContent({ root: process.cwd(), privateKey: process.env.VOYAGER_CONTENT_SIGNING_KEY, action: values.action, refs: values.refs?.split(',').filter(Boolean), evidence: values.evidence, reason: values.reason, techniquesUrl: values.techniques })));
}
