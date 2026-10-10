import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const sandbox = {};
vm.runInNewContext(fs.readFileSync(new URL('../assets/js/pages/cosmos-layout.js', import.meta.url), 'utf8'), sandbox);
const layout = sandbox.HerbalCosmosLayout;
const plain = value => JSON.parse(JSON.stringify(value));
const R = layout.SPHERE.radius;

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
// to smear every card over one identical ring segment.
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
  const selected = layout.selectedPositions(result, 'a');
  assert.deepEqual(plain(selected.find(n => n.id === 'a')), { id: 'a', category: '清热药', x: 0, y: 0, z: -R });
  assert.equal(result.nodes.length, selected.length);
});

test('every card sits on the surface of one sphere centred on the origin', () => {
  const built = layout.build(corpus(), []);
  for (const node of built.nodes) {
    const distance = Math.hypot(node.x, node.y, node.z);
    assert.ok(Math.abs(distance - R) < 1e-6, node.id + ' is ' + distance + ' from the core, expected ' + R);
  }
});

test('constellations spread over the whole sphere instead of packing one hemisphere', () => {
  // 分组轴按黄金角撒在球面上：这条性质决定「旋转时总有新的星座转过来」，
  // 而不是全部挤在正面、转到背面就空无一物。
  const list = [];
  for (let g = 0; g < 24; g += 1) for (let i = 0; i < 8; i += 1) list.push({ id: 'g' + g + '-' + i, cat: '类' + g });
  const built = layout.build(list, []);
  assert.equal(built.clusters.length, 24);
  const meanY = built.clusters.reduce((sum, cap) => sum + cap.axis.y, 0) / built.clusters.length;
  assert.ok(Math.abs(meanY) < 0.15, 'the axes must not lean to one pole: mean y is ' + meanY);
  const front = built.clusters.filter(cap => cap.axis.z > 0).length;
  const back = built.clusters.length - front;
  assert.ok(front >= 6 && back >= 6, 'both hemispheres must be inhabited: ' + front + ' front / ' + back + ' back');
  // 每个分组的大小一致，所以这条断言只跟铺点方式有关，与卡片数无关。
  const spacing = built.clusters.map(cap => cap.count).every(count => count === 8);
  assert.ok(spacing, 'this corpus is deliberately even');
});

test('a constellation covers an equal share of the sky for every card it holds', () => {
  const built = layout.build(corpus(), []);
  assert.equal(built.clusters.length, 4);
  // 球冠面积 = 2πR²(1 − cosθ)，所以「面积与卡片数成正比」等价于 sin²θ/count 恒定。
  const share = built.clusters.map(cap => Math.sin(cap.radius) ** 2 / cap.count);
  const spread = Math.max(...share) / Math.min(...share);
  assert.ok(spread < 1.02, 'spherical area per card must be constant; got ' + spread);
  const big = built.clusters.find(c => c.key === '清热药');
  const small = built.clusters.find(c => c.key === '养阴药');
  assert.ok(big.radius > small.radius * 5, 'a 200-card group must cover far more sky than a one-card group');
  assert.ok(big.radius < Math.PI / 2, 'a group must never swallow a whole hemisphere: ' + big.radius);
});

test('neighbouring constellations keep an angular gap and their cards stay inside them', () => {
  const built = layout.build(corpus(), []);
  for (let i = 0; i < built.clusters.length; i += 1) {
    for (let j = i + 1; j < built.clusters.length; j += 1) {
      const a = built.clusters[i], b = built.clusters[j];
      const dot = a.axis.x * b.axis.x + a.axis.y * b.axis.y + a.axis.z * b.axis.z;
      const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
      assert.ok(angle >= a.radius + b.radius, a.key + ' overlaps ' + b.key + ': ' + angle + ' < ' + (a.radius + b.radius));
    }
  }
  const byKey = new Map(built.clusters.map(cap => [cap.key, cap]));
  for (const node of built.nodes) {
    const cap = byKey.get(node.category);
    const unit = { x: node.x / R, y: node.y / R, z: node.z / R };
    const dot = unit.x * cap.axis.x + unit.y * cap.axis.y + unit.z * cap.axis.z;
    const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
    assert.ok(angle <= cap.radius + 1e-6, node.id + ' escaped the ' + node.category + ' cap');
  }
});

test('neighbouring cards keep a legible minimum distance on the sphere', () => {
  const built = layout.build(corpus(), []);
  let closest = Infinity;
  for (let i = 0; i < built.nodes.length; i += 1) {
    for (let j = i + 1; j < built.nodes.length; j += 1) {
      const a = built.nodes[i], b = built.nodes[j];
      closest = Math.min(closest, Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z));
    }
  }
  // The sunflower keeps every pair at least this far apart on the sphere; the
  // old radial layout reached 0.26 units, which is one pixel of overlap.
  assert.ok(closest > 6, 'closest pair is ' + closest + ' units; must stay above 6');
});

test('a one-card group stays a dot on the sphere instead of claiming a cap', () => {
  const built = layout.build(corpus(), []);
  const cap = built.clusters.find(c => c.key === '养阴药');
  const card = built.nodes.find(n => n.id === 'single');
  assert.equal(cap.count, 1);
  assert.ok(cap.radius < 0.2, 'a one-card group must stay a dot: ' + cap.radius);
  const unit = { x: card.x / R, y: card.y / R, z: card.z / R };
  const dot = unit.x * cap.axis.x + unit.y * cap.axis.y + unit.z * cap.axis.z;
  assert.ok(Math.acos(Math.max(-1, Math.min(1, dot))) < 0.2, 'the single card must sit on its own axis');
});

test('the camera fits the whole sphere so no reading can push cards off screen', () => {
  const box = layout.bounds(layout.build(corpus(), []).nodes, 1.06);
  assert.equal(Math.round(box.radius), R);
  assert.equal(Math.round(box.spanX), Math.round(2 * R * 1.06));
  assert.equal(box.spanX, box.spanY, 'a sphere needs a square frame, not a wide one');
  // 竖直方向同样被框住：水平支撑不再是唯一约束，两极也必须留在画面内。
  const tall = layout.bounds([{ id: 'pole', x: 0, y: R, z: 0 }], 1);
  assert.equal(Math.round(tall.spanY), 2 * R);
  assert.equal(Math.round(tall.spanX), 2 * R);
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

test('travel targets are unit axes that sit on the sphere', () => {
  const built = layout.build(corpus(), []);
  for (const cap of built.clusters) {
    // 摄像机靠一次绕 Y 轴旋转把目标轴转到正前方，所以轴必须是单位向量，
    // 而锚点必须落在同一条轴上、且就在球面上。
    assert.ok(Math.abs(Math.hypot(cap.axis.x, cap.axis.y, cap.axis.z) - 1) < 1e-6, cap.key + ' axis must be a unit vector');
    assert.ok(Math.abs(Math.hypot(cap.x, cap.y, cap.z) - R) < 1e-6, cap.key + ' anchor must sit on the sphere');
    const dot = (cap.axis.x * cap.x + cap.axis.y * cap.y + cap.axis.z * cap.z) / R;
    assert.ok(Math.abs(dot - 1) < 1e-6, cap.key + ' anchor must point along its own axis');
  }
});
