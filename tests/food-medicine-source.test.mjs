import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('food-medicine authority contains 106 unique official directory items', () => {
  const source = JSON.parse(fs.readFileSync(path.join(root, 'data/sources/food-medicine-106.json'), 'utf8'));
  assert.equal(source.entries.length, 106);
  assert.equal(new Set(source.entries.map(item => item.name)).size, 106);
  assert.deepEqual(Object.fromEntries(Object.entries(Object.groupBy(source.entries, item => item.notice)).map(([notice, rows]) => [notice, rows.length])), {
    'nhc-2002-51': 87,
    'nhc-2019-8': 6,
    'nhc-2023-9': 9,
    'nhc-2024-4': 4
  });
  for (const name of ['丁香', '当归', '党参', '地黄', '化橘红']) assert.ok(source.entries.some(item => item.name === name));
  assert.equal(source.notices.every(item => item.officialUrl.startsWith('https://')), true);
});

test('browser food directory is generated from the audited source', () => {
  const script = fs.readFileSync(path.join(root, 'assets/js/data/food-medicine.generated.js'), 'utf8');
  const sandbox = {};
  Function('window', script)(sandbox);
  assert.equal(sandbox.FOOD_MEDICINE_DIRECTORY.length, 106);
  assert.equal(sandbox.FOOD_MEDICINE_REVISION, '2024-08-26');
});

test('featured runtime exposes all 106 items and keeps unsourced properties explicit', () => {
  const directory = fs.readFileSync(path.join(root, 'assets/js/data/food-medicine.generated.js'), 'utf8');
  const featured = fs.readFileSync(path.join(root, 'assets/js/data/featured.js'), 'utf8');
  const sandbox = {};
  Function('window', directory + '\n' + featured)(sandbox);
  assert.equal(sandbox.FOODS.length, 106);
  assert.equal(sandbox.FOODS.some(item => item.name === '核桃仁'), false);
  const unsourced = sandbox.FOODS.find(item => item.name === '丁香');
  assert.equal(unsourced.flavor, '未录入');
  assert.equal(unsourced.enriched, false);
  assert.ok(sandbox.FOODS.find(item => item.name === '枸杞子').enriched);
});
