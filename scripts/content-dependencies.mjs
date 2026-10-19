const key = entry => `${entry.id}@${entry.revision}`;

/** Resolve one coherent stable skill set, including optional-looking suggested skills the UI offers. */
export function requireStableDependencies(catalogs, refs) {
  const revoked = new Set(catalogs.flatMap(catalog => catalog.revoked.map(key)));
  const stable = new Set(catalogs.flatMap(catalog => catalog.releases.filter(release => release.channels.includes('stable')).map(key)));
  const entries = catalogs.flatMap(catalog => catalog.entries);
  const candidates = new Map();
  for (const entry of entries) {
    if (!stable.has(key(entry)) || revoked.has(key(entry))) continue;
    candidates.set(entry.id, [...(candidates.get(entry.id) ?? []), entry].sort((a, b) => b.revision - a.revision));
  }
  for (const ref of refs) {
    const root = entries.find(entry => key(entry) === ref);
    if (!root || !stable.has(ref) || revoked.has(ref)) throw new Error(`Promoted revision is not stable: ${ref}`);
    const dependencies = [...root.dependencies, ...(root.suggestedSkills ?? []).map(skill => ({ id: skill.id, minRevision: 1 }))];
    if (!resolve(dependencies, candidates, new Map([[root.id, root]]), new Set([root.id])).next().value)
      throw new Error(`Stable dependencies unavailable for ${ref}: ${dependencies.map(dep => dep.id).join(', ')}`);
  }
}

function* resolve(dependencies, candidates, selected, visiting, index = 0) {
  const dependency = dependencies[index];
  if (!dependency) { yield selected; return; }
  if (visiting.has(dependency.id) || visiting.size >= 64) return;
  const existing = selected.get(dependency.id);
  const options = existing ? [existing] : candidates.get(dependency.id) ?? [];
  for (const entry of options) {
    if (entry.revision < dependency.minRevision || entry.revision >= (dependency.maxRevisionExclusive ?? Infinity)) continue;
    const children = existing ? [] : [...entry.dependencies, ...(entry.suggestedSkills ?? []).map(skill => ({ id: skill.id, minRevision: 1 }))];
    for (const resolved of resolve(children, candidates, new Map([...selected, [entry.id, entry]]), new Set([...visiting, entry.id])))
      yield* resolve(dependencies, candidates, resolved, visiting, index + 1);
  }
}
