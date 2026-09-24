import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { favoriteCount } from '../assets/js/components/saved-drawer.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('favorite badge count ignores duplicate and invalid ids', () => {
  assert.equal(favoriteCount(['gouqi', 'gouqi', '', null, 'renshen']), 2);
});

test('shell ships complete metadata without external font or partial EN toggle', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<meta property="og:title"/);
  assert.match(html, /<meta property="og:image"/);
  assert.match(html, /<link rel="icon"[^>]+assets\/icons\/favicon\.svg/);
  assert.equal(/miaoda\.feishu\.cn|fonts\.googleapis\.com/.test(html), false);
  assert.equal(html.includes('id="languageToggle"'), false);
  assert.match(html, /id="searchResults"[^>]+aria-live="polite"/);
});

test('dynamic collection counts start in a loading state instead of zero', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /data-catalog-count[^>]*>—</);
  assert.match(html, /id="catalogAtlasCount"[^>]*>—</);
  assert.match(html, /data-featured-count[^>]*>—</);
  assert.match(html, /data-food-count[^>]*>—</);
});

test('catalog and saved empty states provide a real next action', () => {
  const runtime = fs.readFileSync(path.join(root, 'assets/js/core/runtime.js'), 'utf8');
  const drawer = fs.readFileSync(path.join(root, 'assets/js/components/saved-drawer.js'), 'utf8');
  assert.match(runtime, /data-switch-featured/);
  assert.match(runtime, /去精品层浏览/);
  assert.match(drawer, /href="#\/herbs"/);
});
