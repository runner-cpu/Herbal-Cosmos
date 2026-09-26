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

test('别名目标未获准时保留原名并进入 review', () => {
  const incompleteAuthority = buildAuthority({
    canonicalNames: ['川楝子'],
    aliases: { 皂角针: '皂角刺' },
    variants: {}
  });

  assert.deepEqual(classifyCandidate('皂角针', incompleteAuthority), {
    canonicalName: '皂角针', aliases: [], status: 'review', reviewReasons: ['not-in-authority']
  });
});

test('有公开记录的名称可进入 searchable，仍保留来源分层', () => {
  const documented = buildAuthority({ canonicalNames: [], documentedNames: ['丁香'], aliases: {}, variants: {} });
  assert.deepEqual(classifyCandidate('丁香', documented), {
    canonicalName: '丁香', aliases: [], status: 'approved', reviewReasons: []
  });
});

test('无来源的历史短语不会被软放行', () => {
  const empty = buildAuthority({ canonicalNames: [], documentedNames: [], aliases: {}, variants: {} });
  assert.equal(classifyCandidate('两个', empty).status, 'review');
  assert.equal(classifyCandidate('则治其本', empty).status, 'review');
});

test('有来源的乱码占位符仍进入 review', () => {
  const documented = buildAuthority({
    canonicalNames: [],
    documentedNames: ['???', '?§?', '川§子', '川\uFFFD子', '川\u0007子'],
    aliases: {},
    variants: {}
  });

  for (const name of ['???', '?§?', '川§子', '川\uFFFD子', '川\u0007子']) {
    const result = classifyCandidate(name, documented);
    assert.equal(result.status, 'review', JSON.stringify(name));
    assert.ok(result.reviewReasons.includes('corrupt-label'), JSON.stringify(name));
  }
});
