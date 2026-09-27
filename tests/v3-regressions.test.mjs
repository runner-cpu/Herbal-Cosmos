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
  assert.match(html, /id="searchResults"[^>]+role="listbox"/);
  assert.doesNotMatch(html, /id="searchResults"[^>]+aria-live=/);
  assert.match(html, /id="searchStatus"[^>]+role="status"[^>]+aria-live="polite"/);
});

test('shell publishes install, sharing, structured-data, and privacy metadata', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /rel="canonical" href="https:\/\/runner-cpu\.github\.io\/Herbal-Cosmos\/"/);
  assert.match(html, /name="robots" content="index,follow,max-image-preview:large"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /rel="manifest" href="manifest\.webmanifest"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /无账号/);
  assert.match(html, /无遥测/);
  assert.match(html, /清除浏览器数据后不可恢复/);
});

test('manifest and branded 404 retain project-relative navigation', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
  assert.equal(manifest.start_url, './#/home');
  assert.equal(manifest.scope, './');
  assert.equal(manifest.display, 'standalone');
  const notFound = fs.readFileSync(path.join(root, '404.html'), 'utf8');
  assert.match(notFound, /\.\/#\/home/);
  assert.match(notFound, /\.\/#\/herbs/);
  assert.match(notFound, /\.\/#\/formula/);
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

test('mixed-source herb views use source-aware classification language', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const runtime = fs.readFileSync(path.join(root, 'assets/js/core/runtime.js'), 'utf8');

  assert.equal(html.includes('<th>功效</th>'), false);
  assert.equal(html.includes('功效类别'), false);
  assert.equal(html.includes('归经 → 功效流向'), false);
  assert.match(html, /<th>资料摘要<\/th>/);
  assert.match(html, /归经 → 资料分类流向/);
  assert.match(runtime, /const herbEfficacyLabel\s*=\s*.*openMateria.*资料分类.*功效/);
  assert.ok((runtime.match(/herbEfficacyLabel\(h\)/g) || []).length >= 2);
  assert.equal(runtime.includes('<b>功效</b> ${esc(h.eff)}'), false);
});
