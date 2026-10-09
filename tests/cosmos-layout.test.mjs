import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const sandbox = {};
vm.runInNewContext(fs.readFileSync(new URL('../assets/js/pages/cosmos-layout.js', import.meta.url), 'utf8'), sandbox);
const layout = sandbox.HerbalCosmosLayout;
const herbs = [{ id: 'a', cat: '清热药', origin: ['云南', '广东'] }, { id: 'b', cat: '补虚药' }, { id: 'c', cat: '补虚药' }, { id: 'material', kind: 'formula-material' }, { id: 'directory', kind: 'directory-only' }];
const formulas = [{ id: 'f', herbs: [['a', '1', '君'], ['b', '2', '臣'], ['missing', '', '佐']] }];
test('one stable position per knowledge card, independent of record order and metadata', () => {
  const first = layout.build(herbs, formulas);
  const second = layout.build([...herbs].reverse().map(h => ({ ...h, origin: ['西藏'], qi: '大热' })), formulas);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.equal(first.nodes.length, 3);
  assert.equal(new Set(first.nodes.map(n => n.id)).size, 3);
  first.nodes.forEach(n => { assert.ok([n.x, n.y, n.z].every(Number.isFinite)); assert.deepEqual(Object.keys(n).sort(), ['category', 'id', 'x', 'y', 'z']); });
});
test('typed formula edges reference only actual, selectable ingredients', () => {
  const result = layout.build(herbs, formulas);
  assert.equal(JSON.stringify(result.edges), JSON.stringify([{ source: 'f', target: 'a', type: 'ingredient', formulaId: 'f' }, { source: 'f', target: 'b', type: 'ingredient', formulaId: 'f' }]));
  assert.equal(JSON.stringify(layout.relations(result, 'a')), JSON.stringify({ formulas: ['f'], ids: ['b'] }));
  assert.equal(layout.relations(result, 'c').ids.length, 0);
  assert.equal(layout.selectedPositions(result, 'a').find(n => n.id === 'a').x, 0);
  assert.equal(result.nodes.length, layout.selectedPositions(result, 'a').length);
});
