import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const sandbox = {};
vm.runInNewContext(fs.readFileSync(new URL('../assets/js/pages/cosmos-layout.js', import.meta.url), 'utf8'), sandbox);
const layout = sandbox.HerbalCosmosLayout;
const plain = value => JSON.parse(JSON.stringify(value));

const herbs = [
  { id: 'a', cat: '清热药', origin: ['云南', '广东'] },
  { id: 'b', cat: '补虚药' },
  { id: 'c', cat: '补虚药' },
  { id: 'material', kind: 'formula-material' },
  { id: 'directory', kind: 'directory-only' }
];
const formulas = [{ id: 'f', herbs: [['a', '1', '君'], ['b', '2', '臣'], ['missing', '', '佐']] }];

// A synthetic corpus with a deliberately lopsided category split: one group is
// an order of magnitude larger than the smallest, which is the shape that used
// to smear every card over an identical disk.
function corpus() {
  const list = [];
  for (let i = 0; i < 200; i += 1) list.push({ id: 'big-' + i, cat: '清热药', origin: ['广东'] });
  for (let i = 0; i < 60; i += 1) list.push({ id: 'mid-' + i, cat: '补虚药', origin: ['云南'] });
  for (let i = 0; i < 12; i += 1) list.push({ id: 'small-' + i, cat: '开窍药' });
  list.push({ id: 'single', cat: '养阴药' });
  return list;
}

test('one stable position per knowledge card, independent of record order and metadata', () => {
  const first = layout.build(herbs, formulas);
  const second = layout.build([...herbs].reverse().map(h => ({ ...h, origin: ['西藏'], qi: '大热' })), formulas);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.equal(first.nodes.length, 3);
  assert.equal(new Set(first.nodes.map(n => n.id)).size, 3);
  first.nodes.forEach(n => {
    assert.ok([n.x, n.y, n.z].every(Number.isFinite));
    assert.deepEqual(Object.keys(n).sort(), ['category', 'id', 'x', 'y', 'z']);
  });
});

test('typed formula edges reference only actual, selectable ingredients', () => {
  const result = layout.build(herbs, formulas);
  assert.equal(JSON.stringify(result.edges), JSON.stringify([{ source: 'f', target: 'a', type: 'ingredient', formulaId: 'f' }, { source: 'f', target: 'b', type: 'ingredient', formulaId: 'f' }]));
  assert.equal(JSON.stringify(layout.relations(result, 'a')), JSON.stringify({ formulas: ['f'], ids: ['b'] }));
  assert.equal(layout.relations(result, 'c').ids.length, 0);
  assert.equal(layout.selectedPositions(result, 'a').find(n => n.id === 'a').x, 0);
  assert.equal(result.nodes.length, layout.selectedPositions(result, 'a').length);
});

test('an island holds one card in the same area as a group of two hundred', () => {
  const built = layout.build(corpus(), []);
  assert.equal(built.clusters.length, 4);
  const density = built.clusters.map(cluster => (Math.PI * cluster.radius * cluster.radius) / cluster.count);
  const spread = Math.max(...density) / Math.min(...density);
  // Islands are sized from a shared floor, so every group lands on one density.
  assert.ok(spread < 1.02, 'island area per card must be constant; got ' + spread);
  const big = built.clusters.find(c => c.key === '清热药');
  const small = built.clusters.find(c => c.key === '养阴药');
  assert.ok(big.radius > small.radius * 10, 'a 200-card group must be far wider than a one-card group');
});

test('no two islands overlap and every card lands inside its own island', () => {
  const built = layout.build(corpus(), []);
  const byKey = new Map(built.clusters.map(c => [c.key, c]));
  for (let i = 0; i < built.clusters.length; i += 1) {
    for (let j = i + 1; j < built.clusters.length; j += 1) {
      const a = built.clusters[i], b = built.clusters[j];
      assert.ok(Math.hypot(b.x - a.x, b.y - a.y) >= a.radius + b.radius, a.key + ' overlaps ' + b.key);
    }
  }
  for (const node of built.nodes) {
    const island = byKey.get(node.category);
    const reach = Math.hypot(node.x - island.x, node.z / 0.694 - island.y);
    assert.ok(reach <= island.radius + 1e-6, node.id + ' escaped ' + node.category);
  }
});

test('neighbouring cards keep a legible minimum distance in the layout plane', () => {
  const built = layout.build(corpus(), []);
  let closest = Infinity;
  for (let i = 0; i < built.nodes.length; i += 1) {
    for (let j = i + 1; j < built.nodes.length; j += 1) {
      const a = built.nodes[i], b = built.nodes[j];
      closest = Math.min(closest, Math.hypot(b.x - a.x, b.z - a.z));
    }
  }
  // The sunflower keeps every pair at least this far apart; the old radial
  // layout reached 0.26 units, which is one pixel of overlap on screen.
  assert.ok(closest > 6, 'closest pair is ' + closest + ' units; must stay above 6');
});

test('the camera fit follows how much room the reading actually uses', () => {
  const wide = layout.bounds(layout.build(corpus(), []).nodes, 1.18);
  const tiny = layout.bounds([{ id: 'only', category: '养阴药', x: 4, y: -2, z: 3 }], 1.18);
  assert.ok(Number.isFinite(wide.spanX) && Number.isFinite(wide.spanY) && wide.spanX > 0 && wide.spanY > 0);
  assert.ok(tiny.spanX < wide.spanX && tiny.spanY < wide.spanY, 'a one-card sky must be framed tighter');
  const square = layout.bounds([{ id: 'a', x: 0, y: 0, z: 100 }], 1);
  assert.equal(Math.round(square.spanX), 200, 'horizontal support survives rotation');
});

test('the literature-distribution reading regroups the same cards into recorded regions', () => {
  const built = layout.build(corpus(), []);
  const region = layout.regionLayout(built.nodes, node => (node.category === '开窍药' ? '青藏' : '不存在的区'));
  const keys = plain(region.clusters.map(c => c.key)).sort();
  assert.deepEqual(keys, ['无分布记录', '青藏']);
  assert.equal(region.nodes.length, built.nodes.length);
  assert.equal(layout.regionPositions(built.nodes, () => '西北').length, built.nodes.length);
  const unknown = region.clusters.find(c => c.key === '无分布记录');
  assert.equal(unknown.count, built.clusters.filter(c => c.key !== '开窍药').reduce((sum, c) => sum + c.count, 0));
});

test('a one-card island stays a dot rather than claiming the shared floor alone', () => {
  const built = layout.build(corpus(), []);
  const single = built.clusters.find(c => c.key === '养阴药');
  const card = built.nodes.find(n => n.id === 'single');
  assert.equal(Math.hypot(card.x - single.x, card.z / 0.694 - single.y) < 1e-9, true);
});
