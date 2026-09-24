import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkInlineRuntime } from '../scripts/check-inline-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('refactored page references external CSS and runtime modules in order', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const result = checkInlineRuntime({ baseDir: root, html });
  assert.equal(result.ok, true, result.issues.join('\n'));
  assert.ok(result.references.indexOf('assets/css/site.css') < result.references.indexOf('assets/js/data/featured.js'));
  assert.ok(result.references.indexOf('assets/js/data/featured.js') < result.references.indexOf('assets/js/core/runtime.js'));
});

test('checker rejects a large inline runtime block', () => {
  const html = '<html><head><style>' + 'x'.repeat(5000) + '</style></head><body><script>' + 'y'.repeat(5000) + '</script></body></html>';
  const result = checkInlineRuntime({ baseDir: root, html, maxInlineBytes: 1024 });
  assert.equal(result.ok, false);
  assert.ok(result.issues.some(issue => issue.includes('inline')));
});

test('route/store/chart globals are not duplicated in HTML', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const result = checkInlineRuntime({ baseDir: root, html });
  assert.equal(result.duplicates.length, 0, result.duplicates.join('\n'));
});

test('extracted CSS keeps root-relative image references reachable', () => {
  const css = fs.readFileSync(path.join(root, 'assets', 'css', 'site.css'), 'utf8');
  assert.match(css, /url\(['"]\.\.\/\.\.\/images\/herbs\/renshen\.jpg['"]\)/);
  assert.ok(fs.existsSync(path.join(root, 'images', 'herbs', 'renshen.jpg')));
});

test('full catalog is not a first-paint script dependency', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.equal(html.includes('data/herb-catalog.js'), false);
  assert.ok(html.includes('assets/js/core/catalog-loader.js'));
});
