import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTheme, nextTheme } from '../assets/js/components/theme.js';
import { contextLinks, viewedIds } from '../assets/js/components/context-bar.js';
import { serializeFavorites } from '../assets/js/components/saved-drawer.js';
import { filterApproved } from '../assets/js/components/search.js';
import { stampText } from '../assets/js/components/stamp.js';
import { foodCardModel, foodMatrixData, cultureSelection, homeChapterState } from '../assets/js/pages/home.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('theme state cycles through day, night and ink and migrates the former classic theme', () => {
  assert.equal(normalizeTheme('night'), 'night');
  assert.equal(normalizeTheme('classic'), 'ink', 'legacy classic values preserve the古籍 theme');
  assert.equal(normalizeTheme('ink'), 'ink');
  assert.equal(normalizeTheme('unknown'), 'day');
  assert.equal(nextTheme('day'), 'night');
  assert.equal(nextTheme('night'), 'ink');
  assert.equal(nextTheme('ink'), 'day');
});

test('context links expose four distinct navigation targets', () => {
  const links = contextLinks({ id: 'gancao' });
  assert.deepEqual(links, [
    { href: '#/home?focus=star&id=gancao', label: '星图定位' },
    { href: '#/qiwei?herb=gancao', label: '性味归经' },
    { href: '#/formula?herb=gancao', label: '配伍网络' },
    { href: '#/herb?id=gancao', label: '知识卡' }
  ]);
});

test('viewed history keeps unique herb ids in visit order', () => {
  assert.deepEqual(viewedIds(['gancao', 'renshen'], 'gancao'), ['renshen', 'gancao']);
});

test('saved export has a stable auditable schema', () => {
  const json = serializeFavorites(['gancao'], [{ id: 'gancao', name: '甘草' }], new Date('2026-09-24T00:00:00.000Z'));
  assert.deepEqual(json, { schemaVersion: 1, exportedAt: '2026-09-24T00:00:00.000Z', herbs: [{ id: 'gancao', name: '甘草' }] });
});

test('search only returns approved catalog entries', () => {
  const rows = filterApproved([{ name: '甘草' }, { name: '噪声', status: 'review' }, { name: '川芎', status: 'approved' }]);
  assert.deepEqual(rows.map(row => row.name), ['甘草', '川芎']);
});

test('stamp text uses the canonical name and qi/wei pair', () => {
  assert.deepEqual(stampText({ name: '甘草', qi: '平', wei: '甘' }), { seal: '甘草', meta: '平·甘' });
});

test('shell gives each cultural act a route and consolidates secondary collections', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const asset of ['assets/css/components.css', 'assets/js/components/theme.js', 'assets/js/components/context-bar.js', 'assets/js/components/saved-drawer.js']) assert.ok(html.includes(asset));
  assert.equal(html.includes('<a href="#/saved" data-route-link="saved"'), false);
  assert.equal(html.includes('id="navMore"'), false);
  for (const route of ['intro', 'home', 'herbs', 'qiwei', 'formula', 'heritage', 'learn']) assert.match(html, new RegExp('href="#/'+route+'" data-route-link="'+route+'"'));
  assert.ok(html.includes('data-route="learn"'), 'learning lab is a standalone page');
  assert.equal(html.includes('data-route="zheng"'), false);
  assert.match(html, /id="formulaZhengView"/);
  assert.ok(html.includes('data-route="heritage"'), 'heritage has its own collection route');
  assert.equal(html.includes('id="homeFoodStrip"'), false, 'food content belongs to heritage');
  assert.ok(html.includes('id="collectionCoverage"'), 'collection boundaries remain accessible on demand');
  assert.ok(!html.includes('id="home-learning"'), 'home no longer hosts the learning workbench');
  assert.ok(html.includes('href="#/learn"'), 'nav exposes the learning lab');
});

test('home food matrix aggregates flavor and use dimensions', () => {
  assert.deepEqual(foodMatrixData([{ flavor: '甘平', tag: '滋补' }, { flavor: '甘平', tag: '滋补' }, { flavor: '辛温', tag: '散寒' }]), [
    { flavor: '甘平', use: '滋补', count: 2 },
    { flavor: '辛温', use: '散寒', count: 1 }
  ]);
  assert.equal(cultureSelection([1, 2, 3, 4]).length, 3);
  assert.equal(cultureSelection([1, 2, 3, 4], true).length, 4);
});

test('food overview keeps unaudited properties out of the matrix and never borrows another herb image', () => {
  assert.deepEqual(foodMatrixData([
    { flavor: '甘平', tag: '滋补', enriched: true },
    { flavor: '未录入', tag: '属性未录入', enriched: false }
  ]), [{ flavor: '甘平', use: '滋补', count: 1 }]);
  assert.deepEqual(foodCardModel({ name: '丁香', flavor: '未录入', use: '目录收载', enriched: false }, [
    { id: 'renshen', name: '人参', image: 'images/herbs/renshen.jpg' }
  ]), { name: '丁香', detail: '目录收载 · 生活用法待补充', href: null, image: null, herb: null });
});

test('home chapter state exposes the concise four-section reading path', () => {
  assert.deepEqual(homeChapterState(0), { index: 0, label: '文化导览', progress: '1 / 4', ratio: 25 });
  assert.deepEqual(homeChapterState(99), { index: 3, label: '项目来源', progress: '4 / 4', ratio: 100 });
  assert.deepEqual(homeChapterState(-4), { index: 0, label: '文化导览', progress: '1 / 4', ratio: 25 });
});
