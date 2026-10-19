import { generateKeyPairSync } from 'node:crypto';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { signCatalog, verifyCatalog, updateCatalog } from './content-publisher.mjs';
const pair = generateKeyPairSync('ed25519');
const now = '2026-10-16T00:00:00Z';
const candidate = { kind:'skill', id:'skills/make-deck', revision:1, minVoyagerVersion:'2026.10.16',
  payload:{target:'skills/make-deck/a.json',sha256:'a'.repeat(64),length:12,mediaType:'application/json'},
  title:'Make deck', summary:'Make a deck.', sourceCommit:'a'.repeat(40), publishedAt:now,
  testedAgainst:['2026.10.16'], requiredCapabilities:[], dependencies:[], suggestedSkills:[], tags:[],outcomes:[],prerequisites:[] };
test('real signing verifies bytes and binds namespaces', () => {
 const catalog=updateCatalog(undefined,'skills',{entries:[candidate],now,action:'refresh'});
 const envelope=signCatalog(catalog,'skills',pair.privateKey,'fixture');
 assert.deepEqual(verifyCatalog(envelope,'skills',pair.publicKey,'fixture'),catalog);
 assert.throws(()=>verifyCatalog(envelope,'techniques',pair.publicKey,'fixture'));
 assert.throws(()=>verifyCatalog({...envelope,payload:Buffer.from('{}').toString('base64')},'skills',pair.publicKey,'fixture'));
});
test('unchanged skill bytes retain revision while metadata renews', () => {
 const first=updateCatalog(undefined,'skills',{entries:[candidate],now,action:'refresh'});
 const second=updateCatalog(first,'skills',{entries:[{...candidate,sourceCommit:'b'.repeat(40),publishedAt:'2026-10-16T01:00:00Z'}],now:'2026-10-16T01:00:00Z',action:'refresh'});
 assert.equal(second.entries.length,1); assert.equal(second.catalogSequence,2);
 assert.deepEqual(second.entries[0],first.entries[0]);
 assert.deepEqual(second.releases[0].channels,['nightly']);
});
test('changed compatibility publishes a new revision and retains history', () => {
 const first=updateCatalog(undefined,'skills',{entries:[candidate],now,action:'refresh'});
 const next=updateCatalog(first,'skills',{entries:[{...candidate,minVoyagerVersion:'2026.10.17'}],now,action:'refresh'});
 assert.deepEqual(next.entries.map(entry=>entry.revision),[1,2]);
});
test('stable needs overnight plus explicit evidence, promotes identical bytes', () => {
 const first=updateCatalog(undefined,'skills',{entries:[candidate],now,action:'refresh'});
 assert.throws(()=>updateCatalog(first,'skills',{now,action:'promote',refs:['skills/make-deck@1'],evidence:'checked'}));
 assert.throws(()=>updateCatalog(first,'skills',{now:'2026-10-17T00:00:00Z',action:'promote',refs:['skills/make-deck@1']}));
 const promoted=updateCatalog(first,'skills',{now:'2026-10-17T00:00:00Z',action:'promote',refs:['skills/make-deck@1'],evidence:'minimum and current runtime report'});
 assert.deepEqual(promoted.entries,first.entries); assert.deepEqual(promoted.releases[0].channels,['nightly','stable']);
 const early=updateCatalog(first,'skills',{now,action:'promote',refs:['skills/make-deck@1'],evidence:'checked',override:'owner order'});
 assert.deepEqual(early.entries,first.entries); assert.deepEqual(early.releases[0].channels,['nightly','stable']);
});
test('revocation is monotonic and revoked revisions cannot be promoted', () => {
 const first=updateCatalog(undefined,'skills',{entries:[candidate],now,action:'refresh'});
 const revoked=updateCatalog(first,'skills',{now:'2026-10-17T00:00:00Z',action:'revoke',refs:['skills/make-deck@1'],reason:'regression'});
 assert.equal(revoked.catalogSequence,2); assert.equal(revoked.revoked.length,1);
 assert.throws(()=>updateCatalog(revoked,'skills',{now:'2026-10-18T00:00:00Z',action:'promote',refs:['skills/make-deck@1'],evidence:'checked'}));
 assert.throws(()=>updateCatalog(revoked,'skills',{now:'2026-10-18T00:00:00Z',action:'promote',refs:['skills/make-deck@1'],evidence:'checked',override:'owner order'}));
});
test('rejects unsafe target paths and namespace contamination', () => {
 assert.throws(()=>updateCatalog(undefined,'skills',{entries:[{...candidate,payload:{...candidate.payload,target:'skills/../secret'}}],now,action:'refresh'}));
 assert.throws(()=>updateCatalog(undefined,'techniques',{entries:[candidate],now,action:'refresh'}));
});

test('complete schema rejects missing technique media filenames before history admission', () => {
 const technique={...candidate,kind:'technique',id:'techniques/demo',payload:{...candidate.payload,target:'techniques/demo/1.md',mediaType:'text/markdown'},slug:'demo',sourceUrl:'https://voyager.so/blog/demo',cardTitle:'Demo',starterText:'Make something',media:{poster:{url:'https://cdn.moda.app/voyager/demo.webp',sha256:'b'.repeat(64),length:123,mediaType:'image/webp'}},assets:[]};
 assert.throws(()=>updateCatalog(undefined,'techniques',{entries:[technique],now,action:'refresh'}));
 const valid={...technique,media:{poster:{...technique.media.poster,filename:'demo.webp'}}};
 assert.equal(updateCatalog(undefined,'techniques',{entries:[valid],now,action:'refresh'}).entries.length,1);
});

test('emergency revocation ignores broken exports and rejects unprocessed references', async () => {
 const { mkdtemp, mkdir, writeFile, readFile, rm }=await import('node:fs/promises');
 const { join }=await import('node:path');
 const { tmpdir }=await import('node:os');
 const { publishContent }=await import('./content-publisher.mjs');
 const root=await mkdtemp(join(tmpdir(),'voy-publish-'));
 const trust={publicKey:pair.publicKey.export({type:'spki',format:'pem'}),keyId:'fixture'};
 const options={root,privateKey:pair.privateKey.export({type:'pkcs8',format:'pem'}),action:'revoke',refs:['skills/make-deck@1'],reason:'regression',now:'2026-10-17T00:00:00Z',techniquesUrl:'https://must-not-fetch.invalid/export'};
 try {
  await mkdir(join(root,'content/v1/skills'),{recursive:true});
  await mkdir(join(root,'content/candidates'),{recursive:true});
  const original=signCatalog(updateCatalog(undefined,'skills',{entries:[candidate],now,action:'refresh'}),'skills',pair.privateKey,'fixture');
  await writeFile(join(root,'content/v1/skills/catalog.json'),JSON.stringify(original));
  await writeFile(join(root,'content/candidates/skills.json'),'malformed');
  await assert.rejects(publishContent({...options,refs:['skill/make-deck@1']},trust),/namespace-qualified/);
  assert.deepEqual(JSON.parse(await readFile(join(root,'content/v1/skills/catalog.json'))),original);
  await publishContent(options,trust);
  const result=verifyCatalog(JSON.parse(await readFile(join(root,'content/v1/skills/catalog.json'))),'skills',pair.publicKey,'fixture');
  assert.equal(result.revoked[0].reason,'regression');
  assert.equal(result.catalogSequence,2);
 } finally { await rm(root,{recursive:true,force:true}); }
});

test('technique embeddings reuse signed vectors, embed only new revisions and never block publishing', async () => {
 const { recommendationsFor, techniqueText, MODEL, DIMENSIONS }=await import('./content-embeddings.mjs');
 const technique=slug=>({...candidate,kind:'technique',id:`techniques/${slug}`,payload:{...candidate.payload,target:`techniques/${slug}/1.md`,mediaType:'text/markdown'},slug,sourceUrl:`https://voyager.so/blog/${slug}`,cardTitle:slug,starterText:'Make something',tags:['makes:video','for:video-editors'],outcomes:['A rough cut.'],media:{poster:{url:`https://cdn.moda.app/voyager/${slug}.webp`,sha256:'b'.repeat(64),length:123,mediaType:'image/webp',filename:'poster.webp'}},assets:[]});
 const calls=[];
 const embed=async texts=>{ calls.push(texts); return texts.map((_,index)=>Array.from({length:DIMENSIONS},(_,axis)=>axis===index%DIMENSIONS?2:0)); };
 const first=updateCatalog(undefined,'techniques',{entries:[technique('cut-trailer')],now,action:'refresh'});
 const recommendations=await recommendationsFor(first,undefined,{featured:['techniques/cut-trailer','techniques/gone'],embed});
 assert.equal(recommendations.model,MODEL);
 assert.deepEqual(Object.keys(recommendations.vectors),['techniques/cut-trailer@1']);
 assert.deepEqual(Object.keys(recommendations.onboarding.make).sort(),['ai-video','explainer','footage']);
 assert.equal(Object.keys(recommendations.onboarding.role).length,5);
 assert.deepEqual(recommendations.featured,['techniques/cut-trailer']);
 assert.match(calls[0][0],/Makes: video\nFor: video editors\nOutcomes: A rough cut\./);
 assert.equal(calls[0][0],techniqueText(technique('cut-trailer')));
 const vector=Buffer.from(recommendations.vectors['techniques/cut-trailer@1'],'base64');
 assert.equal(vector.length,DIMENSIONS*4); assert.equal(vector.readFloatLE(0),1);
 // Signed, then verified with the app's schema.
 const signed=verifyCatalog(signCatalog({...first,recommendations},'techniques',pair.privateKey,'fixture'),'techniques',pair.publicKey,'fixture');
 assert.deepEqual(signed.recommendations,recommendations);
 // A new revision embeds alone; the unchanged one keeps its signed vector.
 const second=updateCatalog(signed,'techniques',{entries:[technique('cut-trailer'),technique('grade-log')],now:'2026-10-16T06:00:00Z',action:'refresh'});
 const next=await recommendationsFor(second,signed.recommendations,{embed});
 assert.equal(calls[1].length,1+8); assert.equal(calls[1][0],techniqueText(technique('grade-log')));
 assert.equal(next.vectors['techniques/cut-trailer@1'],recommendations.vectors['techniques/cut-trailer@1']);
 // Failures and a missing key carry the previous block forward, dropping departed revisions.
 const revoked=updateCatalog(second,'techniques',{now:'2026-10-17T00:00:00Z',action:'revoke',refs:['techniques/grade-log@1'],reason:'regression'});
 for (const options of [{embed:async()=>{ throw new Error('503'); }},{}]) {
  const carried=await recommendationsFor(revoked,next,options);
  assert.deepEqual(carried.vectors,{'techniques/cut-trailer@1':recommendations.vectors['techniques/cut-trailer@1']});
  assert.deepEqual(carried.onboarding,next.onboarding);
 }
 assert.equal(await recommendationsFor(first,undefined,{embed:async()=>{ throw new Error('no key'); }}),undefined);
 // Vectors from another model are never mixed in.
 const other=await recommendationsFor(second,{...next,model:'other/model'},{embed});
 assert.equal(calls.at(-1).length,2+8); assert.ok(other.vectors['techniques/grade-log@1']);
});

test('emergency operations carry signed technique vectors forward without embedding', async () => {
 const { mkdtemp, mkdir, writeFile, readFile, rm }=await import('node:fs/promises');
 const { join }=await import('node:path');
 const { tmpdir }=await import('node:os');
 const { publishContent }=await import('./content-publisher.mjs');
 const root=await mkdtemp(join(tmpdir(),'voy-publish-'));
 const trust={publicKey:pair.publicKey.export({type:'spki',format:'pem'}),keyId:'fixture'};
 const slug='cut-trailer';
 const technique={...candidate,kind:'technique',id:`techniques/${slug}`,payload:{...candidate.payload,target:`techniques/${slug}/1.md`,mediaType:'text/markdown'},slug,sourceUrl:`https://voyager.so/blog/${slug}`,cardTitle:'Cut',starterText:'Make something',media:{poster:{url:'https://cdn.moda.app/voyager/a.webp',sha256:'b'.repeat(64),length:123,mediaType:'image/webp',filename:'poster.webp'}},assets:[]};
 const vector=Buffer.alloc(8).toString('base64');
 const recommendations={model:'openai/text-embedding-3-small',dimensions:512,vectors:{'techniques/cut-trailer@1':vector},onboarding:{role:{founder:vector},make:{footage:vector}},featured:[]};
 try {
  await mkdir(join(root,'content/v1/techniques'),{recursive:true});
  await writeFile(join(root,'content/v1/techniques/catalog.json'),JSON.stringify(signCatalog({...updateCatalog(undefined,'techniques',{entries:[technique],now,action:'refresh'}),recommendations},'techniques',pair.privateKey,'fixture')));
  await writeFile(join(root,'content/featured.json'),JSON.stringify(['techniques/cut-trailer']));
  await publishContent({root,privateKey:pair.privateKey.export({type:'pkcs8',format:'pem'}),action:'revoke',refs:['techniques/cut-trailer@1'],reason:'regression',now:'2026-10-17T00:00:00Z',embed:async()=>{ throw new Error('must not embed'); }},trust);
  const result=verifyCatalog(JSON.parse(await readFile(join(root,'content/v1/techniques/catalog.json'))),'techniques',pair.publicKey,'fixture');
  assert.equal(result.revoked.length,1);
  assert.deepEqual(result.recommendations.vectors,{});
  assert.deepEqual(result.recommendations.onboarding,recommendations.onboarding);
  const skills=JSON.parse(Buffer.from(JSON.parse(await readFile(join(root,'content/v1/skills/catalog.json'))).payload,'base64'));
  assert.equal(skills.recommendations,undefined);
 } finally { await rm(root,{recursive:true,force:true}); }
});
