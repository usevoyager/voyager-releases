// Publish-time technique embeddings for Voyager's on-device recommendations (VOY-442).
// The app ranks locally from these vectors; it never embeds text or calls a server.
export const MODEL = 'openai/text-embedding-3-small';
export const DIMENSIONS = 512;

// What each onboarding answer wants to make, phrased like technique descriptions so the
// vectors land near the techniques that serve it. "other" is never embedded.
export const ONBOARDING = {
  role: {
    founder: 'A startup founder who wants launch videos, product demos with the real app on screen, announcement videos and short ads that explain what the product does.',
    marketer: 'A marketer who wants video ads, social media videos, vertical videos, product campaigns, voiceovers and on-brand promotional content in several formats.',
    designer: 'A designer who wants to animate posters, illustrations and graphics into motion design, title sequences, social graphics and polished visual pieces.',
    editor: 'A video editor who wants to turn recorded footage into rough cuts and montages, grade color, stabilize shots, add captions, clean dialogue and finish edits in DaVinci Resolve.',
    studio: 'A creative studio or agency producing client work: commercials, product films, 3D renders, motion graphics, scored videos and polished campaign pieces.',
  },
  make: {
    explainer: 'Explainer and product videos: product demos with the real app on screen, animated charts from data, screen recording callouts, technical explainers and launch announcements with motion graphics.',
    footage: 'Editing my own footage: find the best moments in recorded video, cut a rough cut or montage, grade log footage, stabilize, slow motion, captions, vertical crops and clean noisy dialogue.',
    'ai-video': 'AI-generated video: generate cinematic shots, characters and animated scenes from prompts and images, AI product ads, keyframe-timed reveals and imagined worlds.',
  },
};

const referenceKey = entry => `${entry.id}@${entry.revision}`;

/** The text embedded for one technique revision: its card, summary, tags and outcomes. */
export function techniqueText(entry) {
  const tags = ['makes', 'for', 'tool'].map(kind => [kind, entry.tags.filter(tag => tag.startsWith(kind + ':')).map(tag => tag.slice(kind.length + 1).replaceAll('-', ' '))]).filter(([, values]) => values.length);
  return [
    entry.title,
    entry.cardTitle,
    entry.summary,
    ...tags.map(([kind, values]) => `${{ makes: 'Makes', for: 'For', tool: 'Tools' }[kind]}: ${values.join(', ')}`),
    ...(entry.outcomes.length ? [`Outcomes: ${entry.outcomes.join(' ')}`] : []),
  ].join('\n');
}

/** Base64 of a little-endian Float32Array, L2-normalized. */
export function encodeVector(values) {
  const norm = Math.hypot(...values) || 1;
  const bytes = Buffer.alloc(values.length * 4);
  values.forEach((value, index) => bytes.writeFloatLE(value / norm, index * 4));
  return bytes.toString('base64');
}

export function openAIEmbedder(apiKey, fetchImpl = fetch) {
  return async texts => {
    const response = await fetchImpl('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODEL.slice('openai/'.length), dimensions: DIMENSIONS, input: texts }),
      signal: AbortSignal.timeout(60000),
    });
    if (!response.ok) throw new Error(`Embedding request failed: ${response.status}`);
    const body = await response.json();
    return [...body.data].sort((a, b) => a.index - b.index).map(item => item.embedding);
  };
}

/**
 * The catalog's recommendations block. Unchanged revisions reuse the previous signed vectors;
 * only new revisions (and the short onboarding texts) are embedded. Without an embedder, or when
 * it fails, the previous vectors carry forward so publishing is never blocked by embeddings.
 */
export async function recommendationsFor(catalog, previous, { featured = [], embed } = {}) {
  const revoked = new Set(catalog.revoked.map(referenceKey));
  const live = catalog.entries.filter(entry => !revoked.has(referenceKey(entry)));
  const carried = previous?.model === MODEL && previous?.dimensions === DIMENSIONS ? previous : undefined;
  const vectors = Object.fromEntries(live.filter(entry => carried?.vectors[referenceKey(entry)]).map(entry => [referenceKey(entry), carried.vectors[referenceKey(entry)]]));
  let onboarding = carried?.onboarding;
  if (embed) {
    try {
      const missing = live.filter(entry => !vectors[referenceKey(entry)]);
      const answers = ['role', 'make'].flatMap(kind => Object.entries(ONBOARDING[kind]).map(([id, text]) => ({ kind, id, text })));
      const embedded = await embed([...missing.map(techniqueText), ...answers.map(answer => answer.text)]);
      if (embedded.length !== missing.length + answers.length || embedded.some(values => values.length !== DIMENSIONS)) throw new Error('Embedding response shape mismatch.');
      missing.forEach((entry, index) => { vectors[referenceKey(entry)] = encodeVector(embedded[index]); });
      onboarding = { role: {}, make: {} };
      answers.forEach((answer, index) => { onboarding[answer.kind][answer.id] = encodeVector(embedded[missing.length + index]); });
    } catch (error) {
      console.warn('Technique embeddings unavailable; carrying forward previous vectors:', error.message);
    }
  }
  if (!onboarding && !Object.keys(vectors).length) return undefined;
  const ids = new Set(live.map(entry => entry.id));
  return { model: MODEL, dimensions: DIMENSIONS, vectors, onboarding: onboarding ?? { role: {}, make: {} }, featured: featured.filter(id => ids.has(id)) };
}
