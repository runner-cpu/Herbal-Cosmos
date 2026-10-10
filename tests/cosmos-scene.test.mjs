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
    // The halo is one pre-rendered sprite stamped per constellation, so the test
    // has to give the module the tiniest document that can produce a 2D context.
    sandbox.document = {
      createElement: () => ({ width: 0, height: 0, getContext: () => ({ createRadialGradient: () => ({ addColorStop: () => {} }), fillRect: () => {}, fillStyle: '' }) })
    };
  }
  // 场景模块先读几何模块发布的球面半径（与页面加载顺序一致），所以两者一起跑。
  new Function('window', 'document', layout + '\n' + scene)(window, sandbox.document);
  return window.HerbalCosmosScene;
}

test('the scene module owns every word the engine used to declare itself', () => {
  const vocabulary = loadScene();
  const owned = [
    'REGION_OF_PROVINCE', 'REGION_COLORS', 'QI_COLORS', 'UNIFORM_COLOR', 'ETHNIC_COLOR', 'DIM_COLOR',
    'NO_REGION', 'CLUSTER_ALL', 'READING_MODES', 'READING_LABELS', 'CLUSTER_LABELS', 'DEFAULT_READING',
    'GLOW_SIZE', 'GLOW_ALPHA_BY_THEME', 'DEPTH_RANGE', 'FOV', 'SPHERE_RADIUS', 'SPHERE_EXTENT', 'BACK_FADE',
    'CORE_SCALE', 'HALO_SCALE',
    'REVEAL', 'TRAIL_SAME', 'TRAIL_CROSS',
    'FRAME_MARGIN', 'FRAME_PAD', 'FRAME_MAX', 'FLY_MS', 'TRAVEL_LIMIT'
  ];
  for (const key of owned) assert.ok(key in vocabulary, key + ' must live in the scene vocabulary');
  for (const fn of ['hexWithAlpha', 'regionOf', 'regionsOf', 'clusterOf', 'colorForReading', 'legendFor', 'particleBudget', 'depthBlur', 'nearness', 'backFade', 'dustReveal', 'starReveal', 'createGlowSprite', 'supported', 'drawConstellationHalos', 'drawConstellationLabels', 'constellationsWithCards']) {
    assert.equal(typeof vocabulary[fn], 'function', fn + ' must be exported by the scene module');
  }
  // 引擎不能再偷偷自己声明一份：重复的常量会让两处定义悄悄漂移。
  assert.equal(/const REGION_OF_PROVINCE = Object\.freeze/.test(engine), false);
  assert.equal(/const QI_COLORS = Object\.freeze/.test(engine), false);
  assert.equal(/const REVEAL = Object\.freeze/.test(engine), false);
  // 球面半径只有一个来源：场景从几何模块读，引擎从场景读。
  assert.match(scene, /const SPHERE_RADIUS = root\.HerbalCosmosLayout\?\.SPHERE\?\.radius/);
  assert.equal(/SPHERE_RADIUS = 240/.test(scene), false, '半径不能再写死一份');
});

test('the engine refuses to run without its vocabulary, and re-exports it unchanged', () => {
  assert.throws(() => new Function('window', engine)({}), /HerbalCosmosScene must be loaded before cosmos-engine\.js/);
  const window = {};
  new Function('window', layout + '\n' + scene + '\n' + engine)(window);
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

test('nearness reads one ball of cards, not two overlapping sheets', () => {
  const vocabulary = loadScene();
  const R = vocabulary.SPHERE_RADIUS;
  // 正对观众的极点最近、球背面的极点最远，两侧严格单调。
  assert.equal(vocabulary.nearness(-R), 1);
  assert.equal(vocabulary.nearness(0), 0.5);
  assert.equal(vocabulary.nearness(R), 0);
  assert.ok(vocabulary.nearness(-R * 0.5) > vocabulary.nearness(R * 0.5));
  assert.equal(vocabulary.nearness(9999), 0, '远处必须夹到 0，而不是负数');
  // 压暗只压到 BACK_FADE，背面仍是可读的背景，不是消失；但也要真的压下去，
  // 否则加色混合下球的前后一样亮，「一颗球」就只剩轮廓。
  assert.equal(Math.round(vocabulary.backFade(-R) * 1000) / 1000, 1);
  assert.equal(Math.round(vocabulary.backFade(R) * 1000) / 1000, vocabulary.BACK_FADE);
  const middle = vocabulary.backFade(0);
  assert.ok(middle > vocabulary.BACK_FADE && middle < 1);
  assert.ok(vocabulary.BACK_FADE > 0.15, '背面的卡片必须仍然看得见');
  assert.ok(vocabulary.BACK_FADE < 0.3, '背面必须明显暗于正面，否则球读成一片光是平的');
});

test('a card is drawn as a particle with a halo, and the halo stays smaller than the card spacing', () => {
  const vocabulary = loadScene();
  // 光晕半径 = 核心 × HALO_SCALE，核心半径 = 卡径 × CORE_SCALE。粒子必须真的
  // 落在画面上：球面铺了 902 张卡，光晕一旦和邻居一样大，加色混合会把它们糊成
  // 一整片亮斑，球就读不出「一颗颗粒子」，只剩一团雾。
  assert.ok(vocabulary.CORE_SCALE > 0 && vocabulary.CORE_SCALE <= 1.2, 'CORE_SCALE 必须是一个真正的粒子半径');
  assert.ok(vocabulary.HALO_SCALE > 1 && vocabulary.HALO_SCALE <= 2, '光晕要大于核心才叫光晕');
  assert.ok(vocabulary.HALO_SCALE <= 2, '光晕超过核的两倍就会盖住隔壁卡片');
  assert.match(engine, /const core = Math\.max\(1\.2, star\.size \* star\.persp \* scale \* CORE_SCALE\)/);
  assert.match(engine, /ctx\.arc\(star\.screenX, star\.screenY, core, 0, Math\.PI \* 2\)/);
});

test('the star map stays inside its own projection depth at the default framing', () => {
  const vocabulary = loadScene();
  // 投影的 zr 是粒子旋转后的深度坐标，球面上它落在 [-R, R] 里：最近的正面
  // zr=-R（透视放大），最远的背面 zr=+R（透视缩小），都留在 DEPTH_RANGE 之内，
  // 所以整颗球都画得出来，没有一半被剔除边界切掉。
  assert.ok(vocabulary.SPHERE_RADIUS < vocabulary.DEPTH_RANGE, '球背面不能被剔除边界裁掉');
  assert.ok(vocabulary.FOV > vocabulary.SPHERE_RADIUS, '球面不能越过相机，否则透视分母会变号');
  // 透视轮廓比几何半径大：取景必须用前者，否则球的两极会被裁掉。
  assert.ok(vocabulary.SPHERE_EXTENT > vocabulary.SPHERE_RADIUS);
  const expected = vocabulary.SPHERE_RADIUS * vocabulary.FOV / Math.sqrt(vocabulary.FOV ** 2 - vocabulary.SPHERE_RADIUS ** 2);
  assert.ok(Math.abs(vocabulary.SPHERE_EXTENT - expected) < 1e-9, 'the silhouette must be the projected limb, got ' + vocabulary.SPHERE_EXTENT);
});

test('the constellation labels are drawn from data labels and live counts, not invented copy', () => {
  const vocabulary = loadScene();
  const drawn = [];
  const ctx = {
    font: '', textAlign: '', textBaseline: '', globalAlpha: 1, fillStyle: '',
    measureText: text => ({ width: String(text).length * 7 }),
    fillRect: () => {}, fillText: (text, x, y) => drawn.push({ text, x, y, alpha: ctx.globalAlpha, fill: ctx.fillStyle })
  };
  const entries = [
    { island: { key: '青藏', count: 49 }, shown: 49, sx: 40, sy: 60, radius: 40, fade: 1 },
    { island: { key: '无分布记录', count: 288 }, shown: 12, sx: 900, sy: 20, radius: 90, fade: 0.4 }
  ];
  vocabulary.drawConstellationLabels(ctx, entries, 1000, 400, { labelOf: cap => vocabulary.CLUSTER_LABELS[cap.key] || cap.key, activeKey: '青藏', focused: true });
  assert.equal(drawn.length, 2);
  assert.equal(drawn[0].text, '青藏 49');
  assert.equal(drawn[1].text, '未录分布 12', 'the label must use the live shown count, not the total');
  assert.ok(drawn[0].alpha > drawn[1].alpha, 'the travelled-to constellation stays brighter than the rest');
});

test('the constellation labels report the frame they painted, not just that they ran', () => {
  const vocabulary = loadScene();
  const ctx = {
    font: '', textAlign: '', textBaseline: '', globalAlpha: 1, fillStyle: '',
    measureText: text => ({ width: String(text).length * 7 }),
    fillRect: () => {}, fillText: () => {}
  };
  const painted = vocabulary.drawConstellationLabels(ctx, [
    { island: { key: '青藏', count: 49 }, shown: 49, sx: 40, sy: 60, radius: 40, fade: 1 },
    { island: { key: '无分布记录', count: 288 }, shown: 12, sx: 9000, sy: -40, radius: 90, fade: 0.2 }
  ], 1000, 400, { labelOf: cap => vocabulary.CLUSTER_LABELS[cap.key] || cap.key, activeKey: '青藏', focused: true });
  assert.equal(painted.length, 2);
  assert.deepEqual(painted.map(entry => entry.label), ['青藏 49', '未录分布 12']);
  assert.deepEqual(painted.map(entry => entry.key), ['青藏', '无分布记录']);
  assert.deepEqual(painted.map(entry => entry.active), [true, false]);
  // 屏幕外的星座必须被收进画布：名牌坐标就是最终落笔坐标，可以据此断言没有被裁掉。
  for (const entry of painted) {
    assert.ok(entry.x >= 26 && entry.x <= 1000 - 26, entry.label + ' must stay inside the canvas: x=' + entry.x);
    assert.ok(entry.y >= 14 && entry.y <= 400 - 6, entry.label + ' must stay inside the canvas: y=' + entry.y);
    assert.ok(entry.width > 0);
  }
});

test('constellation names are only offered for groups that still have cards on screen', () => {
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
  const entries = vocabulary.constellationsWithCards(anchors, shown);
  assert.deepEqual(entries.map(entry => [entry.island.key, entry.shown]), [['清热药', 2], ['补虚药', 1]]);
  // 一张卡都没筛出来的分组不能上榜：名牌报的数量必须是真正画在屏幕上的数量。
  assert.equal(entries.some(entry => entry.island.key === '开窍药'), false);
  assert.deepEqual(vocabulary.constellationsWithCards(anchors, []), []);
});

test('overlapping plaques are lifted instead of written on top of each other', () => {
  const vocabulary = loadScene();
  const ctx = {
    font: '', textAlign: '', textBaseline: '', globalAlpha: 1, fillStyle: '',
    measureText: text => ({ width: String(text).length * 7 }),
    fillRect: () => {}, fillText: () => {}
  };
  // 两块星座挨得极近：球面排布保证球冠不重叠，但名牌挂在球冠外沿，
  // 边界情况仍会把两块牌子叠在一起。
  const painted = vocabulary.drawConstellationLabels(ctx, [
    { island: { key: '活血化瘀药' }, shown: 80, sx: 300, sy: 200, radius: 20, fade: 1 },
    { island: { key: '养阴药' }, shown: 1, sx: 305, sy: 202, radius: 20, fade: 1 }
  ], 1019, 470, { labelOf: cap => cap.key });
  assert.equal(painted.length, 2);
  for (let i = 0; i < painted.length; i++) for (let j = i + 1; j < painted.length; j++) {
    const a = painted[i], b = painted[j];
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    assert.ok(dx >= a.width / 2 + b.width / 2 + 10 || dy >= 17, a.label + ' must not sit on top of ' + b.label);
  }
});

test('the travelled-to constellation keeps the top slot when plaques collide', () => {
  const vocabulary = loadScene();
  const ctx = {
    font: '', textAlign: '', textBaseline: '', globalAlpha: 1, fillStyle: '',
    measureText: text => ({ width: String(text).length * 7 }),
    fillRect: () => {}, fillText: () => {}
  };
  const painted = vocabulary.drawConstellationLabels(ctx, [
    { island: { key: '养阴药' }, shown: 1, sx: 300, sy: 200, radius: 20, fade: 1 },
    { island: { key: '活血化瘀药' }, shown: 80, sx: 305, sy: 202, radius: 20, fade: 1 }
  ], 1019, 470, { labelOf: cap => cap.key, activeKey: '养阴药', focused: true });
  const active = painted.find(entry => entry.key === '养阴药');
  const other = painted.find(entry => entry.key === '活血化瘀药');
  assert.equal(active.active, true);
  assert.equal(other.active, false);
  assert.ok(active.y !== other.y, 'the passive plaque gives way: ' + active.y + ' vs ' + other.y);
});

test('constellation halos scale with the group and dim instead of vanishing when one is chosen', () => {
  const vocabulary = loadScene({ withDocument: true });
  // drawImage is the only painting call the halo pass makes, and the image is
  // the module's own pre-rendered sprite: nothing here can measure text or build
  // a gradient, which is the whole point of the optimisation.
  const ctx = {
    globalAlpha: 1, fillStyle: '',
    drawImage: (image, x, y, width) => { ctx.painted.push({ image: Boolean(image), x, y, width, alpha: ctx.globalAlpha }); }
  };
  const anchors = [
    { island: { key: 'a' }, sx: 0, sy: 0, radius: 4, fade: 1 },
    { island: { key: 'b' }, sx: 100, sy: 0, radius: 120, fade: 1 }
  ];
  ctx.painted = [];
  vocabulary.drawConstellationHalos(ctx, anchors, () => 1);
  assert.equal(ctx.painted.length, 2);
  for (const stamp of ctx.painted) assert.ok(stamp.image, 'the halo must reuse the pre-rendered sprite');
  assert.deepEqual(ctx.painted.map(stamp => stamp.width / 2), [16, 162], 'a tiny group keeps a legible minimum halo and a wide one scales');
  assert.equal(ctx.globalAlpha, 1, 'the halo pass restores the shared alpha');

  ctx.painted = [];
  vocabulary.drawConstellationHalos(ctx, [{ island: { key: 'a' }, sx: 0, sy: 0, radius: 10, fade: 1 }], () => 0.35);
  assert.equal(ctx.painted.length, 1);
  assert.ok(ctx.painted[0].alpha < 1, 'a de-emphasised constellation keeps a dimmer halo rather than losing it');
  assert.equal(ctx.globalAlpha, 1, 'the halo pass restores the shared alpha after dimming too');

  ctx.painted = [];
  vocabulary.drawConstellationHalos(ctx, anchors, () => 0);
  assert.equal(ctx.painted.length, 0, 'a constellation at zero emphasis is not drawn at all');

  // 转到球背面的星座光晕跟着压暗，与名牌的规则一致。
  ctx.painted = [];
  vocabulary.drawConstellationHalos(ctx, [{ island: { key: 'c' }, sx: 0, sy: 0, radius: 20, fade: vocabulary.BACK_FADE }], () => 1);
  assert.ok(ctx.painted[0].alpha < 0.16, 'a far-side halo must be dimmer than a front-side one');
});
