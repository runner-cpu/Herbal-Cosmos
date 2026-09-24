import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTheme, nextTheme } from '../assets/js/components/theme.js';
import { contextLinks, viewedIds } from '../assets/js/components/context-bar.js';
import { serializeFavorites } from '../assets/js/components/saved-drawer.js';
import { filterApproved } from '../assets/js/components/search.js';
import { stampText } from '../assets/js/components/stamp.js';
import { foodMatrixData, cultureSelection } from '../assets/js/pages/home.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('theme state is limited to day, night and classic', () => {
  assert.equal(normalizeTheme('classic'), 'classic');
  assert.equal(normalizeTheme('unknown'), 'day');
  assert.equal(nextTheme('day'), 'night');
  assert.equal(nextTheme('night'), 'classic');
  assert.equal(nextTheme('classic'), 'day');
});

test('context links expose four real navigation targets', () => {
  const links = contextLinks({ id: 'gancao' });
  assert.deepEqual(links.map(link => link.href), [
    '#/home?focus=star&id=gancao',
    '#/qiwei?herb=gancao',
    '#/formula?herb=gancao',
    '#/herb?id=gancao'
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

test('shell references component modules and removes saved route from navigation', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const asset of ['assets/css/components.css', 'assets/js/components/theme.js', 'assets/js/components/context-bar.js', 'assets/js/components/saved-drawer.js']) assert.ok(html.includes(asset));
  assert.equal(html.includes('<a href="#/saved" data-route-link="saved"'), false);
});

test('home food matrix aggregates flavor and use dimensions', () => {
  assert.deepEqual(foodMatrixData([{ flavor: '甘平', tag: '滋补' }, { flavor: '甘平', tag: '滋补' }, { flavor: '辛温', tag: '散寒' }]), [
    { flavor: '甘平', use: '滋补', count: 2 },
    { flavor: '辛温', use: '散寒', count: 1 }
  ]);
  assert.equal(cultureSelection([1, 2, 3, 4]).length, 3);
  assert.equal(cultureSelection([1, 2, 3, 4], true).length, 4);
});
