import test from 'node:test';
import assert from 'node:assert/strict';
import { rankFormulaHerbs, countFormulaRoles, buildMeridianEffectFlow, buildFoodUsageMatrix } from '../assets/js/lib/insight-aggregates.mjs';

test('formula herb ranking counts each herb once per formula', () => {
  const ranked = rankFormulaHerbs([
    { id: 'a', herbs: [['gancao'], ['gancao'], ['guizhi']] },
    { id: 'b', herbs: [['gancao']] }
  ]);
  assert.deepEqual(ranked.slice(0, 2), [{ id: 'gancao', count: 2 }, { id: 'guizhi', count: 1 }]);
});

test('formula roles are grouped by formula and role', () => {
  const result = countFormulaRoles([
    { id: 'a', name: '方一', herbs: [['gancao', '9g', '君'], ['guizhi', '6g', '臣']] },
    { id: 'b', name: '方二', herbs: [['gancao', '3g', '君']] }
  ]);
  assert.deepEqual(result.roles, ['君', '臣', '佐', '使']);
  assert.deepEqual(result.formulas[0], { id: 'a', name: '方一', 君: 1, 臣: 1, 佐: 0, 使: 0 });
});

test('meridian effect flow expands one link per observed herb relationship', () => {
  const flow = buildMeridianEffectFlow([{ id: 'x', meridian: ['肺', '脾'], cat: '补气' }]);
  assert.deepEqual(flow.links, [{ source: '肺经', target: '补气', value: 1 }, { source: '脾经', target: '补气', value: 1 }]);
});

test('food usage matrix counts flavor and usage dimensions', () => {
  const matrix = buildFoodUsageMatrix([{ flavor: '甘平', use: '煮粥 / 泡茶', tag: '滋补' }, { flavor: '甘平', use: '煮粥', tag: '滋补' }]);
  assert.deepEqual(matrix.find(cell => cell.flavor === '甘平' && cell.use === '煮粥'), { flavor: '甘平', use: '煮粥', count: 2 });
  assert.deepEqual(matrix.find(cell => cell.flavor === '甘平' && cell.use === '泡茶'), { flavor: '甘平', use: '泡茶', count: 1 });
});
