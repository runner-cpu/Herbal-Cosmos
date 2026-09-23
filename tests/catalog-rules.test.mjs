import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAuthority, classifyCandidate, splitCandidate } from '../assets/js/lib/catalog-rules.mjs';

const authority = buildAuthority({
  canonicalNames: ['川楝子', '川芎', '皂角刺', '泽泻', '沙参'],
  aliases: { 皂角针: '皂角刺' },
  variants: { 川棟子: '川楝子', 川萼: '川芎', 皂角剌: '皂角刺' }
});

test('已核验异体字归并到规范名并保留 alias', () => {
  assert.deepEqual(classifyCandidate('皂角剌', authority), {
    canonicalName: '皂角刺', aliases: ['皂角剌'], status: 'approved', reviewReasons: []
  });
});

test('症状句和含等条目进入 review', () => {
  assert.equal(classifyCandidate('出现面色苍白', authority).status, 'review');
  assert.equal(classifyCandidate('皂角刺等脓肿破溃', authority).status, 'review');
});

test('只拆明确分隔符，不猜分无分隔复合名', () => {
  assert.deepEqual(splitCandidate('泽泻、沙参'), ['泽泻', '沙参']);
  assert.equal(classifyCandidate('泽泻沙参', authority).status, 'review');
});
