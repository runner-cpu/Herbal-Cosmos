import test from 'node:test';
import assert from 'node:assert/strict';
import { extractLegacyCandidates } from '../scripts/restore-legacy-candidates.mjs';

test('legacy catalog becomes auditable review candidates without approval', () => {
  const source = `window.HERB_CATALOG = [
    {"name":"川芎","source":"open-index"},
    {"name":"出现面色苍白","source":"classic-text"}
  ];`;
  const result = extractLegacyCandidates(source, 'abc123');
  assert.deepEqual(result.candidates.map(item => item.raw), ['川芎', '出现面色苍白']);
  assert.equal(result.candidates.every(item => item.reviewReasons.includes('legacy-candidate-unverified')), true);
  assert.match(result.candidates[0].sourceLocation, /^git:abc123:data\/herb-catalog\.js:/);
});
