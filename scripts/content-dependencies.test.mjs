import assert from 'node:assert/strict';
import { test } from 'node:test';
import { requireStableDependencies } from './content-dependencies.mjs';
const skill = (id, revision = 1, dependencies = []) => ({ id: `skills/${id}`, revision, dependencies, suggestedSkills: [] });
const technique = { id: 'techniques/demo', revision: 2, dependencies: [], suggestedSkills: [{ id: 'skills/a' }] };
const catalog = (entries, nightly = [], revoked = []) => ({ entries, releases: entries.map(entry => ({ id: entry.id, revision: entry.revision, channels: nightly.includes(entry.id) ? ['nightly'] : ['stable'] })), revoked });
const check = (entries, nightly, revoked) => requireStableDependencies([catalog(entries, nightly, revoked)], ['techniques/demo@2']);
test('rejects missing, nightly-only and revoked suggested skills', () => {
  assert.throws(() => check([technique]), /dependencies unavailable/);
  assert.throws(() => check([technique, skill('a')], ['skills/a']), /dependencies unavailable/);
  assert.throws(() => check([technique, skill('a')], [], [{ id: 'skills/a', revision: 1 }]), /dependencies unavailable/);
  check([technique, skill('a')]);
});
test('resolves bounded transitive dependencies and rejects cycles', () => {
  const a = skill('a', 1, [{ id: 'skills/b', minRevision: 2, maxRevisionExclusive: 3 }]);
  assert.throws(() => check([technique, a, skill('b')]), /dependencies unavailable/);
  assert.throws(() => check([technique, a, skill('b', 3)]), /dependencies unavailable/);
  check([technique, a, skill('b', 2)]);
  assert.throws(() => check([technique, a, skill('b', 2, [{ id: 'skills/a', minRevision: 1 }])]), /dependencies unavailable/);
});
test('backtracks sibling constraints instead of accepting conflicting revisions', () => {
  const root = { ...technique, suggestedSkills: [], dependencies: [{ id: 'skills/a', minRevision: 1 }, { id: 'skills/b', minRevision: 1 }] };
  const a = skill('a', 1, [{ id: 'skills/c', minRevision: 1 }]);
  const b = skill('b', 1, [{ id: 'skills/c', minRevision: 1, maxRevisionExclusive: 2 }]);
  check([root, a, b, skill('c', 1), skill('c', 2)]);
  assert.throws(() => check([root, a, b, skill('c', 2)]), /dependencies unavailable/);
});
