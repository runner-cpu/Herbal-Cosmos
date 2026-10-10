import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

/* 星图由三支 classic script 组装：几何（cosmos-layout）、场景词汇
   （cosmos-scene）、引擎（cosmos-engine）。引擎直接解构词汇表，所以顺序、
   预缓存与产物上限都是可测的契约，不能只靠人工记忆。 */
const scene = read('assets/js/pages/cosmos-scene.js');
const engine = read('assets/js/pages/cosmos-engine.js');
const layout = read('assets/js/pages/cosmos-layout.js');
const html = read('index.html');
const worker = read('sw.js');

function loadScene({ withDocument = false } = {}) {
  const window = {};
  const sandbox = { window };
  if (withDocument) {
    // The halo is one pre-rendered sprite stamped per island, so the test has to
    // give the module the tiniest document that can produce a 2D context.
    sandbox.document = {
      createElement: () => ({ width: 0, height: 0, getContext: () => ({ createRadialGradient: () => ({ addColorStop: () => {} }), fillRect: () => {}, fillStyle: '' }) })
    };
  }
  new Function('window', 'document', scene)(window, sandbox.document);
  return window.HerbalCosmosScene;
}

test('the scene module owns every word the engine used to declare itself', () => {
  const vocabulary = loadScene();
  const owned = [
    'REGION_OF_PROVINCE', 'REGION_COLORS', 'QI_COLORS', 'UNIFORM_COLOR', 'ETHNIC_COLOR', 'DIM_COLOR',
    'NO_REGION', 'CLUSTER_ALL', 'READING_MODES', 'READING_LABELS', 'CLUSTER_LABELS', 'DEFAULT_READING',
    'GLOW_SIZE', 'GLOW_ALPHA_BY_THEME', 'DEPTH_RANGE', 'FOV', 'REVEAL', 'TRAIL_SAME', 'TRAIL_CROSS',
    'FRAME_MARGIN', 'FRAME_PAD', 'FRAME_MAX', 'FLY_MS', 'TRAVEL_LIMIT'
  ];
  for (const key of owned) assert.ok(key in vocabulary, key + ' must live in the scene vocabulary');
  for (const fn of ['hexWithAlpha', 'regionOf', 'regionsOf', 'clusterOf', 'colorForReading', 'legendFor', 'particleBudget', 'depthBlur', 'dustReveal', 'starReveal', 'createGlowSprite', 'supported', 'drawIslandHalos', 'drawIslandCaptions', 'islandsWithCards']) {
    assert.equal(typeof vocabulary[fn], 'function', fn + ' must be exported by the scene module');
  }
  // 引擎不能再偷偷自己声明一份：重复的常量会让两处定义悄悄漂移。
  assert.equal(/const REGION_OF_PROVINCE = Object\.freeze/.test(engine), false);
  assert.equal(/const QI_COLORS = Object\.freeze/.test(engine), false);
  assert.equal(/const REVEAL = Object\.freeze/.test(engine), false);
});

test('the engine refuses to run without its vocabulary, and re-exports it unchanged', () => {
  assert.throws(() => new Function('window', engine)({}), /HerbalCosmosScene must be loaded before cosmos-engine\.js/);
  const window = {};
  new Function('window', scene + '\n' + engine)(window);
  const api = window.HerbalCosmosEngine;
  const vocabulary = window.HerbalCosmosScene;
  for (const key of ['REGION_OF_PROVINCE', 'QI_COLORS', 'CLUSTER_LABELS', 'REVEAL', 'GLOW_ALPHA_BY_THEME']) {
    assert.equal(api[key], vocabulary[key], key + ' must be the same object the scene module published');
  }
  assert.equal(api.TRAVEL_LIMIT, vocabulary.TRAVEL_LIMIT);
  assert.equal(api.FRAME_MAX, vocabulary.FRAME_MAX);
});

test('every assembly order the page needs is declared in index.html, scene before engine', () => {
  const order = [...html.matchAll(/<script[^>]*src="(assets\/js\/pages\/cosmos[^"?]*)(?:\?[^"]*)?"/g)].map(match => match[1]);
  const layoutAt = order.indexOf('assets/js/pages/cosmos-layout.js');
  const sceneAt = order.indexOf('assets/js/pages/cosmos-scene.js');
  const engineAt = order.indexOf('assets/js/pages/cosmos-engine.js');
  assert.ok(layoutAt >= 0 && sceneAt >= 0 && engineAt >= 0, 'all three classic scripts must be declared: ' + order.join(', '));
  assert.ok(layoutAt < sceneAt && sceneAt < engineAt, 'layout -> scene -> engine is the only valid order; got ' + order.join(' -> '));
});

test('the scene vocabulary is precached so the offline shell can still paint the sky', () => {
  assert.match(worker, /'\.\/assets\/js\/pages\/cosmos-layout\.js'/);
  assert.match(worker, /'\.\/assets\/js\/pages\/cosmos-scene\.js'/);
  assert.match(worker, /'\.\/assets\/js\/pages\/cosmos-engine\.js'/);
  const at = key => worker.indexOf("'./" + key + "'");
  assert.ok(at('assets/js/pages/cosmos-scene.js') > at('assets/js/pages/cosmos-layout.js'), 'precache order should mirror the load order');
  assert.ok(at('assets/js/pages/cosmos-engine.js') > at('assets/js/pages/cosmos-scene.js'), 'precache order should mirror the load order');
});

test('the island captions are drawn from data labels and live counts, not invented copy', () => {
  const vocabulary = loadScene();
  const drawn = [];
  const ctx = {
    font: '', textAlign: '', textBaseline: '', globalAlpha: 1, fillStyle: '',
    measureText: text => ({ width: String(text).length * 7 }),
    fillRect: () => {}, fillText: text => drawn.push({ text, alpha: ctx.globalAlpha, fill: ctx.fillStyle }), beginPath: () => {}, arc: () => {}, fill: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} })
  };
  const entries = [
    { island: { key: '青藏', count: 49 }, shown: 49, sx: 40, sy: 60, radius: 40 },
    { island: { key: '无分布记录', count: 288 }, shown: 12, sx: 900, sy: 20, radius: 90 }
  ];
  vocabulary.drawIslandCaptions(ctx, entries, 1000, 400, { labelOf: island => vocabulary.CLUSTER_LABELS[island.key] || island.key, activeKey: '青藏', focused: true });
  assert.equal(drawn.length, 2);
  assert.equal(drawn[0].text, '青藏 49');
  assert.equal(drawn[1].text, '未录分布 12', 'the caption must use the live shown count, not the total');
  assert.ok(drawn[0].alpha > drawn[1].alpha, 'the travelled-to island stays brighter than the rest');
  // 名录必须水平收进画布，否则最外侧的星团名字会被裁掉。
  for (const call of drawn) assert.ok(call.text.length > 0);
});

test('the island captions report the frame they painted, not just that they ran', () => {
  const vocabulary = loadScene();
  const ctx = {
    font: '', textAlign: '', textBaseline: '', globalAlpha: 1, fillStyle: '',
    measureText: text => ({ width: String(text).length * 7 }),
    fillRect: () => {}, fillText: () => {}
  };
  const painted = vocabulary.drawIslandCaptions(ctx, [
    { island: { key: '青藏', count: 49 }, shown: 49, sx: 40, sy: 60, radius: 40 },
    { island: { key: '无分布记录', count: 288 }, shown: 12, sx: 9000, sy: -40, radius: 90 }
  ], 1000, 400, { labelOf: island => vocabulary.CLUSTER_LABELS[island.key] || island.key, activeKey: '青藏', focused: true });
  assert.equal(painted.length, 2);
  assert.deepEqual(painted.map(entry => entry.label), ['青藏 49', '未录分布 12']);
  assert.deepEqual(painted.map(entry => entry.key), ['青藏', '无分布记录']);
  assert.deepEqual(painted.map(entry => entry.active), [true, false]);
  // 屏幕外的岛必须被收进画布：名录坐标就是最终落笔坐标，可以据此断言没有被裁掉。
  for (const entry of painted) {
    assert.ok(entry.x >= 26 && entry.x <= 1000 - 26, entry.label + ' must stay inside the canvas: x=' + entry.x);
    assert.ok(entry.y >= 14 && entry.y <= 400 - 6, entry.label + ' must stay inside the canvas: y=' + entry.y);
    assert.ok(entry.width > 0);
  }
});

test('island names are only offered for groups that still have cards on screen', () => {
  const vocabulary = loadScene();
  const anchors = [
    { island: { key: '清热药' }, sx: 0, sy: 0, radius: 40 },
    { island: { key: '补虚药' }, sx: 50, sy: 0, radius: 30 },
    { island: { key: '开窍药' }, sx: 90, sy: 0, radius: 10 }
  ];
  const shown = [
    { id: 'a', cluster: '清热药' }, { id: 'b', cluster: '清热药' },
    { id: 'c', cluster: '补虚药' }
  ];
  const entries = vocabulary.islandsWithCards(anchors, shown);
  assert.deepEqual(entries.map(entry => [entry.island.key, entry.shown]), [['清热药', 2], ['补虚药', 1]]);
  // 一张卡都没筛出来的分组不能上榜：名录报的数量必须是真正画在屏幕上的数量。
  assert.equal(entries.some(entry => entry.island.key === '开窍药'), false);
  assert.deepEqual(vocabulary.islandsWithCards(anchors, []), []);
});

test('overlapping plaques are lifted instead of written on top of each other', () => {
  const vocabulary = loadScene();
  const ctx = {
    font: '', textAlign: '', textBaseline: '', globalAlpha: 1, fillStyle: '',
    measureText: text => ({ width: String(text).length * 7 }),
    fillRect: () => {}, fillText: () => {}
  };
  // 两座岛在屏幕上几乎重合：岛屿排布保证卡片不重叠，但名录挂在岛的外沿，
  // 边界情况仍会把两块牌子叠在一起。
  const painted = vocabulary.drawIslandCaptions(ctx, [
    { island: { key: '活血化瘀药' }, shown: 80, sx: 300, sy: 200, radius: 20 },
    { island: { key: '养阴药' }, shown: 1, sx: 305, sy: 202, radius: 20 }
  ], 1019, 470, { labelOf: island => island.key });
  assert.equal(painted.length, 2);
  for (let i = 0; i < painted.length; i++) for (let j = i + 1; j < painted.length; j++) {
    const a = painted[i], b = painted[j];
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    assert.ok(dx >= a.width / 2 + b.width / 2 + 10 || dy >= 17, a.label + ' must not sit on top of ' + b.label);
  }
  const report = [];
  for (const entry of painted) {
    report.push(entry.label);
    assert.ok(entry.y >= 14 && entry.y <= 464, entry.label + ' must keep its plate inside the canvas: y=' + entry.y);
    assert.ok(entry.x - entry.width / 2 - 5 >= 0 && entry.x + entry.width / 2 + 5 <= 1019, entry.label + ' must keep its plate inside the canvas: x=' + entry.x);
  }
  assert.deepEqual(report.sort(), ['养阴药 1', '活血化瘀药 80']);
});

test('the travelled-to island keeps the top slot when plaques collide', () => {
  const vocabulary = loadScene();
  const ctx = {
    font: '', textAlign: '', textBaseline: '', globalAlpha: 1, fillStyle: '',
    measureText: text => ({ width: String(text).length * 7 }),
    fillRect: () => {}, fillText: () => {}
  };
  const painted = vocabulary.drawIslandCaptions(ctx, [
    { island: { key: '养阴药' }, shown: 1, sx: 300, sy: 200, radius: 20 },
    { island: { key: '活血化瘀药' }, shown: 80, sx: 305, sy: 202, radius: 20 }
  ], 1019, 470, { labelOf: island => island.key, activeKey: '养阴药', focused: true });
  // 观众正在看的岛先落位，所以它拿到没有被动过的原始位置。
  const active = painted.find(entry => entry.key === '养阴药');
  const other = painted.find(entry => entry.key === '活血化瘀药');
  assert.equal(active.active, true);
  assert.equal(other.active, false);
  assert.ok(active.y !== other.y, 'the passive plaque gives way: ' + active.y + ' vs ' + other.y);
});

test('island halos scale with the island and dim instead of vanishing when one is chosen', () => {
  const vocabulary = loadScene({ withDocument: true });
  // drawImage is the only painting call the halo pass makes, and the image is
  // the module's own pre-rendered sprite: nothing here can measure text or build
  // a gradient, which is the whole point of the optimisation.
  const ctx = {
    globalAlpha: 1, fillStyle: '',
    drawImage: (image, x, y, width) => { ctx.painted.push({ image: Boolean(image), x, y, width, alpha: ctx.globalAlpha }); }
  };
  const anchors = [
    { island: { key: 'a' }, sx: 0, sy: 0, radius: 4 },
    { island: { key: 'b' }, sx: 100, sy: 0, radius: 120 }
  ];
  ctx.painted = [];
  vocabulary.drawIslandHalos(ctx, anchors, () => 1);
  assert.equal(ctx.painted.length, 2);
  for (const stamp of ctx.painted) assert.ok(stamp.image, 'the halo must reuse the pre-rendered sprite');
  assert.deepEqual(ctx.painted.map(stamp => stamp.width / 2), [18, 180], 'a tiny island keeps a legible minimum halo and a wide one scales');
  assert.equal(ctx.globalAlpha, 1, 'the halo pass restores the shared alpha');

  ctx.painted = [];
  vocabulary.drawIslandHalos(ctx, [{ island: { key: 'a' }, sx: 0, sy: 0, radius: 10 }], () => 0.35);
  assert.equal(ctx.painted.length, 1);
  assert.ok(ctx.painted[0].alpha < 1, 'a de-emphasised island keeps a dimmer halo rather than losing it');
  assert.equal(ctx.globalAlpha, 1, 'the halo pass restores the shared alpha after dimming too');

  ctx.painted = [];
  vocabulary.drawIslandHalos(ctx, anchors, () => 0);
  assert.equal(ctx.painted.length, 0, 'an island at zero emphasis is not drawn at all');
});
