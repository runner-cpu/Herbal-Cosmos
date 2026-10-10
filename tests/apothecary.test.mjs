import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { categoryChips, categoryTally, drawerSummary, matchHerbs } from '../assets/js/pages/apothecary.js';

const read = relativePath => fs.readFileSync(new URL('../' + relativePath, import.meta.url), 'utf8');

const sandbox = {};
vm.runInNewContext(read('assets/js/pages/apothecary-layout.js'), sandbox);
const layout = sandbox.HerbalApothecaryLayout;
const { DRAWER, LAYOUTS } = layout;
const pitchX = DRAWER.width + DRAWER.gapX;
const pitchY = DRAWER.height + DRAWER.gapY;
// 沙箱里造出来的对象跨 realm，原型不同，deepEqual 会把同构当成不等。
const plain = value => JSON.parse(JSON.stringify(value));
const shape = grid => grid.columns + '×' + grid.rows;

test('the drawer wall picks the layout whose aspect matches the canvas aspect', () => {
  // 横屏 1440×641 落在 16×9；竖屏 9:16 要换到 8×18，否则整柜只占画面中间一条。
  assert.equal(shape(layout.layoutFor(144, 1440 / 641)), '16×9');
  assert.equal(shape(layout.layoutFor(144, 9 / 16)), '8×18');
  assert.equal(shape(layout.layoutFor(144, 3.2)), '18×8');
  for (const aspect of [.4, .5625, .75, 1, 1.6, 2.25, 3.2]) {
    const picked = layout.layoutFor(144, aspect);
    assert.ok(picked.columns * picked.rows >= 144, 'layout must seat every drawer at aspect ' + aspect);
    const wall = (picked.columns * pitchX) / (picked.rows * pitchY);
    for (const [columns, rows] of LAYOUTS) {
      if (columns * rows < 144) continue;
      const other = (columns * pitchX) / (rows * pitchY);
      assert.ok(
        Math.abs(Math.log(wall / Math.max(.2, aspect))) <= Math.abs(Math.log(other / Math.max(.2, aspect))),
        'layoutFor(' + aspect + ') must not be beaten by ' + columns + '×' + rows
      );
    }
  }
  // 本草数少于格子数时，多出来的格子留在末行，不压缩本草。
  assert.equal(shape(layout.layoutFor(100, 2.25)), '16×9');
  assert.equal(shape(layout.layoutFor(1, 2.25)), '16×9');
  assert.ok(layout.layoutFor(1, 2.25).columns * layout.layoutFor(1, 2.25).rows >= 1);
});

test('drawer positions are deterministic, evenly pitched and centred on the wall', () => {
  const grid = { columns: 16, rows: 9 };
  const first = layout.drawerPosition(0, grid);
  assert.deepEqual(plain(layout.drawerPosition(0, grid)), plain(first));
  // 行序自上而下：第一行在最上，最后一行在最下。
  const last = layout.drawerPosition(143, grid);
  assert.ok(last.y < first.y, 'later rows sit lower on screen');
  assert.equal(+last.x.toFixed(6), +(-first.x).toFixed(6), 'the last cell closes the grid on the opposite edge');
  // 相邻格正好差一个节距，跨行也一样。
  assert.equal(+(layout.drawerPosition(1, grid).x - first.x).toFixed(6), +pitchX.toFixed(6));
  assert.equal(+(layout.drawerPosition(16, grid).y - first.y).toFixed(6), +(-pitchY).toFixed(6));
  assert.equal(+(layout.drawerPosition(32, grid).y - first.y).toFixed(6), +(-2 * pitchY).toFixed(6));
  // 整墙关于原点对称，相机才不会偏心。
  const left = layout.drawerPosition(0, grid).x, right = layout.drawerPosition(15, grid).x;
  assert.equal(+(left + right).toFixed(6), 0);
  const top = layout.drawerPosition(0, grid).y, bottom = layout.drawerPosition(128, grid).y;
  assert.equal(+(top + bottom).toFixed(6), 0);
});

test('wall span counts every pitch and the camera distance frames both axes', () => {
  const span = layout.wallSpan({ columns: 16, rows: 9 });
  assert.equal(+span.x.toFixed(6), +(16 * pitchX).toFixed(6));
  assert.equal(+span.y.toFixed(6), +(9 * pitchY).toFixed(6));
  // 每个比例都配上它自己那一档网格再取景，正好检验二者是否彼此贴合。
  for (const aspect of [.4, .5625, .75, 1, 1.6, 2.25, 3.2]) {
    const grid = layout.layoutFor(144, aspect);
    const wall = layout.wallSpan(grid);
    const distance = layout.frameDistance(wall.x, wall.y, aspect);
    const halfFov = Math.tan((layout.FOV * Math.PI) / 360);
    const visibleY = 2 * halfFov * distance;
    const visibleX = visibleY * aspect;
    assert.ok(visibleX >= wall.x, 'aspect ' + aspect + ' must show the whole wall width');
    assert.ok(visibleY >= wall.y, 'aspect ' + aspect + ' must show the whole wall height');
    // 也不能离得太远：两方向的余量都要落在 1.15–1.7 之间（1.12 取景余量 + 0.78 外框
    // 决定了这个量级），否则整柜会在某一方向上缩成画面中间一小块。
    const ratios = [visibleX / wall.x, visibleY / wall.y];
    assert.ok(Math.min(...ratios) >= 1.15, 'aspect ' + aspect + ' frames the wall too loose: ' + JSON.stringify(ratios));
    assert.ok(Math.max(...ratios) <= 1.7, 'aspect ' + aspect + ' wastes frame margin: ' + JSON.stringify(ratios));
  }
  // 极扁画布按 0.2 兜底，不能因为 aspect→0 让距离发散。
  assert.equal(layout.frameDistance(span.x, span.y, .05), layout.frameDistance(span.x, span.y, .2));
  assert.equal(layout.frameDistance(span.x, span.y, 0), layout.frameDistance(span.x, span.y, .2));
  for (const aspect of [.05, .2, 1, 4]) {
    const distance = layout.frameDistance(span.x, span.y, aspect);
    assert.ok(Number.isFinite(distance) && distance > 0, 'aspect ' + aspect + ' must give a finite camera distance');
  }
});

test('arrow keys move within the visible grid instead of a hardcoded row length', () => {
  const grid = { columns: 16, rows: 9 };
  assert.equal(layout.moveIndex(16, 'ArrowUp', grid, 144), 0);
  assert.equal(layout.moveIndex(16, 'ArrowDown', grid, 144), 32);
  assert.equal(layout.moveIndex(0, 'ArrowUp', grid, 144), 0, 'the top row stops at row 0');
  assert.equal(layout.moveIndex(0, 'ArrowLeft', grid, 144), 0, 'left edge stops instead of wrapping');
  assert.equal(layout.moveIndex(15, 'ArrowRight', grid, 144), 15, 'right edge stops instead of wrapping');
  assert.equal(layout.moveIndex(143, 'ArrowDown', grid, 144), 143, 'incomplete last row stops at the last drawer');
  assert.equal(layout.moveIndex(2, 'ArrowDown', grid, 34), 18, 'partial grids still step one row');
  assert.equal(layout.moveIndex(30, 'ArrowDown', grid, 34), 30, 'a row that does not exist stops');
  // 竖屏换档后步长跟着列数变，写死 12 的旧实现会在这里错位。
  const portrait = layout.layoutFor(144, 9 / 16);
  assert.equal(layout.moveIndex(0, 'ArrowDown', portrait, 144), portrait.columns);
  assert.equal(layout.moveIndex(1, 'ArrowDown', portrait, 144), 1 + portrait.columns);
  assert.equal(layout.moveIndex(-1, 'ArrowDown', grid, 144), -1);
  assert.equal(layout.moveIndex(144, 'ArrowUp', grid, 144), 144);
  assert.equal(layout.moveIndex(4, 'PageDown', grid, 144), 4, 'unhandled keys leave the selection alone');
});

test('the renderer reads the shared grid instead of carrying its own copy', () => {
  const bundle = read('assets/vendor/apothecary-webgl.js');
  assert.match(bundle, /HerbalApothecaryLayout/, 'the drawer wall must consume the shared layout contract');
  const html = read('index.html');
  const layoutTag = html.indexOf('assets/js/pages/apothecary-layout.js');
  const pageTag = html.indexOf('assets/js/pages/apothecary.browser.js');
  assert.ok(layoutTag > 0, 'index.html must load the shared layout module');
  assert.ok(layoutTag < pageTag, 'the shared grid must load before the drawer page script');
  // 渲染层不能自己再抄一份行列表：两份数就会各自漂移。
  assert.doesNotMatch(read('assets/js/pages/apothecary-webgl.js'), /\[\[16,\s*9\]/, 'layout table belongs to apothecary-layout.js only');
  assert.match(read('sw.js'), /'\.\/assets\/js\/pages\/apothecary-layout\.js'/, 'the shared module must be precached for offline use');
});

test('drawer summary keeps card facts separate from position and links to the real card', () => {
  const summary = drawerSummary({ id: 'gancao', name: '甘草', qi: '平', wei: '甘', meridian: ['心', '肺'], cat: '补虚药', origin: ['内蒙古', '新疆'] });
  assert.equal(summary.name, '甘草');
  assert.equal(summary.attrs, '平 · 甘 ｜ 归经 心、肺 ｜ 资料分类 补虚药');
  assert.equal(summary.note, '分布记录 内蒙古、新疆');
  assert.equal(summary.href, '#/herb?id=gancao');
  const sparse = drawerSummary({ id: 'a b', name: '未录' });
  assert.equal(sparse.attrs, '');
  assert.equal(sparse.note, '');
  assert.equal(sparse.href, '#/herb?id=a%20b');
  assert.deepEqual(drawerSummary(null), { name: '—', attrs: '', note: '', href: '#/herbs' });
  assert.deepEqual(drawerSummary({}), { name: '—', attrs: '', note: '', href: '#/herbs' });
});

test('search matches name, pinyin, latin and aliases, and filters by category', () => {
  const herbs = [
    { name: '人参', pinyin: 'renshen', latin: 'Panax ginseng', aliases: ['棒槌'], cat: '补虚药' },
    { name: '甘草', pinyin: 'gancao', latin: 'Glycyrrhiza uralensis', cat: '补虚药' },
    { name: '麻黄', pinyin: 'mahuang', aliases: ['龙沙'], cat: '解表药' }
  ];
  assert.deepEqual(matchHerbs(herbs, '', ''), [0, 1, 2]);
  assert.deepEqual(matchHerbs(herbs, '甘草', ''), [1]);
  assert.deepEqual(matchHerbs(herbs, 'PANAX', ''), [0], 'latin is matched case-insensitively');
  assert.deepEqual(matchHerbs(herbs, '龙沙', ''), [2], 'aliases are searchable');
  assert.deepEqual(matchHerbs(herbs, '  renshen  ', ''), [0], 'whitespace is trimmed');
  assert.deepEqual(matchHerbs(herbs, '', '补虚药'), [0, 1]);
  assert.deepEqual(matchHerbs(herbs, '甘草', '解表药'), [], 'keyword and category must both hold');
  assert.deepEqual(matchHerbs(herbs, '不存在', ''), []);
  assert.deepEqual(matchHerbs(undefined, '', ''), []);
});

test('category tally orders by size, caps the chip row and names unrecorded rows', () => {
  const herbs = [
    ...Array(5).fill({ cat: '补虚药' }), ...Array(3).fill({ cat: '清热药' }),
    ...Array(3).fill({ cat: '解表药' }), { cat: '' }, { cat: '解表药' }
  ];
  assert.deepEqual(categoryTally(herbs, 3), [{ name: '补虚药', count: 5 }, { name: '解表药', count: 4 }, { name: '清热药', count: 3 }]);
  // 并列时按名称排序，标签行才稳定。
  assert.deepEqual(categoryTally([{ cat: 'b' }, { cat: 'a' }], 2).map(item => item.name), ['a', 'b']);
  assert.deepEqual(categoryTally([{ cat: '' }], 6), [{ name: '未录类别', count: 1 }]);
  assert.ok(categoryTally(herbs, 2).length === 2);
  assert.deepEqual(categoryTally([], 6), []);
  const markup = categoryChips(categoryTally(herbs, 3));
  assert.match(markup, /data-apothecary-chip="" aria-pressed="true">全部</);
  assert.match(markup, /data-apothecary-chip="补虚药"/);
  assert.match(markup, /资料分类|补虚药<b>5<\/b>/);
  assert.equal(categoryChips([]), '');
  // 分类名进 DOM 属性前必须转义，否则资料里一个引号就能改写标签行。
  assert.doesNotMatch(categoryChips([{ name: '"><img src=x>', count: 1 }]), /<img/);
});

test('a drawer keeps its card reachable while the wall rebuilds and degrades', () => {
  const html = read('index.html');
  assert.match(html, /id="apothecaryRoot"/, 'the drawer wall mounts into a dedicated host');
  assert.match(html, /rel="stylesheet" href="assets\/css\/apothecary\.css\?v=cultural-v\d+"/);
  const css = read('assets/css/apothecary.css');
  // 关掉 3D 时画布必须真的消失，不能留一块空白骗人说有柜子。
  assert.match(css, /\.apothecary-stage\[data-mode="flat"\]\s*#apothecaryCanvas\s*\{\s*display:\s*none/);
  assert.match(css, /prefers-reduced-motion/);
  const page = read('assets/js/pages/apothecary.js');
  assert.match(page, /stage\.dataset\.mode = 'flat'/, 'an unsupported device must fall back, not pretend');
  assert.match(page, /本草图鉴可/, 'the fallback must name a real alternative');
  assert.match(page, /#\/herb\?id=/, 'the readout must link to the actual knowledge card');
});
