import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'assets', 'js', 'pages', 'cosmos-engine.js'), 'utf8');
const sandbox = { window: {} };
const factory = new Function('window', source + '\nreturn window.HerbalCosmosEngine;');
const engine = factory(sandbox.window);

test('cosmos engine exposes four readings with distinct colour functions', () => {
  assert.deepEqual(engine.READING_MODES, ['category', 'geography', 'nature', 'ethnic']);
  assert.equal(engine.DEFAULT_READING, 'category');
  assert.equal(engine.colorForReading({ cat: '补虚药' }, 'category', { categoryColor: () => '#111111' }), '#111111');
  assert.equal(engine.colorForReading({ cat: '补虚药' }, 'category', { uniform: true }), engine.UNIFORM_COLOR);
  assert.equal(engine.colorForReading({ qi: '大寒' }, 'nature'), engine.QI_COLORS['大寒']);
  assert.notEqual(engine.colorForReading({ qi: '大寒' }, 'nature'), engine.colorForReading({ qi: '大热' }, 'nature'));
});

test('geography reading groups provinces into regions and keeps missing origin explicit', () => {
  assert.equal(engine.regionOf(['西藏']), '青藏');
  assert.equal(engine.regionOf(['青海']), '青藏');
  assert.equal(engine.regionOf(['新疆', '甘肃']), '西北');
  assert.equal(engine.regionOf(['内蒙古']), '北方');
  assert.equal(engine.regionOf(['云南']), '西南');
  assert.equal(engine.regionOf(['广东']), '东南');
  assert.equal(engine.regionOf([]), 'unknown');
  assert.equal(engine.regionOf(['云南', '广东']), 'multiple');
  assert.deepEqual(engine.regionsOf(['广东', '云南', '广东']), ['西南', '东南']);
  assert.equal(engine.colorForReading({ origin: ['云南', '广东'] }, 'geography'), engine.UNIFORM_COLOR);
  assert.equal(engine.regionOf(['未收录省区']), 'unknown');
  assert.equal(engine.colorForReading({ origin: [] }, 'geography'), engine.REGION_COLORS.unknown);
});

test('ethnic reading brightens only herbs with an approved correspondence id', () => {
  const ids = new Set(['open-1']);
  assert.equal(engine.colorForReading({ id: 'open-1' }, 'ethnic', { ethnicIds: ids }), engine.ETHNIC_COLOR);
  assert.equal(engine.colorForReading({ id: 'open-2' }, 'ethnic', { ethnicIds: ids }), engine.DIM_COLOR);
  assert.equal(engine.colorForReading({ id: 'open-2' }, 'ethnic', { ethnicIds: null }), engine.DIM_COLOR);
});

test('particle budget keeps the documented mobile cap and scales with device class', () => {
  assert.deepEqual(engine.particleBudget({ mobile: true, cores: 8, dpr: 3 }), { dust: 1500 });
  assert.deepEqual(engine.particleBudget({ mobile: false, cores: 4, dpr: 1 }), { dust: 1500 });
  assert.deepEqual(engine.particleBudget({ mobile: false, cores: 8, dpr: 2 }), { dust: 6000 });
  assert.deepEqual(engine.particleBudget({ mobile: false, cores: 6, dpr: 1 }), { dust: 3600 });
  const mobile = engine.particleBudget({ mobile: true, cores: 8, dpr: 3 });
  assert.ok(902 + mobile.dust <= 2500, 'mobile particle total must stay within the 2500 cap');
  const desktop = engine.particleBudget({ mobile: false, cores: 8, dpr: 2 });
  assert.ok(902 + desktop.dust > 2500, 'desktop keeps the richer dust layer');
});

test('depth and reveal helpers stay bounded and monotonic', () => {
  assert.equal(engine.depthBlur(0), 0);
  assert.equal(engine.depthBlur(300), 1);
  assert.equal(engine.depthBlur(900), 1);
  assert.equal(engine.depthBlur(-150), 0.5);
  assert.equal(engine.dustReveal(0), 0);
  assert.equal(engine.dustReveal(engine.REVEAL.dustMs), 1);
  assert.equal(engine.dustReveal(99999), 1);
  const total = 902;
  assert.equal(engine.starReveal(0, total, 0), 0);
  assert.equal(engine.starReveal(total - 1, total, engine.REVEAL.dustMs + engine.REVEAL.starMs), 1);
  const early = engine.starReveal(0, total, engine.REVEAL.dustMs + 10);
  const late = engine.starReveal(total - 1, total, engine.REVEAL.dustMs + engine.REVEAL.starMs * 0.9);
  assert.ok(late > early, 'later stars reveal after earlier ones');
});

test('glow sprite and colour helpers are defensive outside a browser document', () => {
  assert.equal(engine.createGlowSprite('#FFAA00', 2), null);
  assert.equal(engine.hexWithAlpha('#FFAA00', 0.5), 'rgba(255,170,0,0.5)');
  assert.equal(engine.hexWithAlpha('not-a-colour', 0.5), 'not-a-colour');
  assert.equal(engine.supported(), false);
});

test('legend copy covers every reading without inventing categories', () => {
  const geography = engine.legendFor('geography');
  assert.ok(geography.some(item => item.label === '青藏'));
  assert.ok(geography.some(item => item.label === '无分布记录'));
  const nature = engine.legendFor('nature');
  assert.equal(nature.length, Object.keys(engine.QI_COLORS).length);
  const ethnic = engine.legendFor('ethnic');
  assert.deepEqual(ethnic.map(item => item.label), ['有对照线索', '未标注']);
  assert.deepEqual(engine.legendFor('category', { categories: [{ name: '补虚', color: '#abc' }] }), [{ label: '补虚', color: '#abc' }]);
});
