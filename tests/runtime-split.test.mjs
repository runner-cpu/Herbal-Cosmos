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
  assert.ok(html.indexOf('assets/js/lib/echarts-loader.js') > html.indexOf('</main>'));
  assert.ok(html.indexOf('assets/js/lib/echarts-loader.js') < html.indexOf('assets/js/core/runtime.js'));
  assert.equal(html.includes('assets/vendor/echarts.min.js'), false, 'ECharts bundle must be loaded on demand, not via a script tag');
  assert.ok(result.references.indexOf('assets/js/core/catalog-loader.browser.js') < result.references.indexOf('assets/js/core/app-shell.js'));
  for (const reference of result.references.filter(asset => /^assets\/js\/(?:components|pages|core\/catalog-loader)/.test(asset))) {
    assert.match(reference, /\.browser\.js$/, reference + ' must be a browser runtime copy');
  }
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
  const match = css.match(/url\(['"]\.\.\/\.\.\/(images\/herbs\/open\/[^'"]+)['"]\)/);
  assert.ok(match, 'expected a root-relative open-license herb image');
  assert.ok(fs.existsSync(path.join(root, ...match[1].split('/'))));
});

test('full catalog is not a first-paint script dependency', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.equal(html.includes('data/herb-catalog.js'), false);
  assert.ok(html.includes('assets/js/core/catalog-loader.browser.js'));
});

test('runtime discovery ignores source-module paths mentioned outside script tags', () => {
  const html = '<link rel="stylesheet" href="assets/css/site.css">' +
    '<link rel="stylesheet" href="assets/css/components.css">' +
    '<!-- assets/js/components/theme.js -->' +
    '<script src="assets/js/components/theme.browser.js"></script>';
  const result = checkInlineRuntime({ baseDir: root, html });
  assert.ok(result.references.includes('assets/js/components/theme.browser.js'));
  assert.equal(result.references.includes('assets/js/components/theme.js'), false);
});

test('runtime discovery ignores commented tags, data-src, and non-stylesheet links', () => {
  const html = '<!-- <script src="package.json"></script> -->' +
    '<script data-src="package.json"></script>' +
    '<link rel="preload" href="package.json">' +
    '<script src = "assets/js/components/theme.browser.js" ></script>';
  const result = checkInlineRuntime({ baseDir: root, html });
  assert.deepEqual(result.references, ['assets/js/components/theme.browser.js']);
  assert.equal(result.ok, false, 'fixture omits the other required assets on purpose');
});

test('runtime discovery reports reversed document order', () => {
  const html = '<script defer src="assets/js/core/app-shell.js"></script>' +
    '<script defer src="assets/js/core/runtime.js"></script>';
  const result = checkInlineRuntime({ baseDir: root, html });
  assert.ok(result.issues.some(issue => issue.startsWith('external asset order must be')));
});

test('expanded evidence is published as bounded ordered chunks', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const chunks = fs.readdirSync(path.join(root, 'assets/js/data'))
    .filter(file => /^expanded\.chunk-\d+\.js$/.test(file))
    .sort();
  assert.equal(chunks.length, 9);
  let previous = html.indexOf('assets/js/data/expanded.bootstrap.js');
  assert.ok(previous >= 0);
  for (const file of chunks) {
    const marker = 'assets/js/data/' + file;
    const index = html.indexOf(marker);
    assert.ok(index > previous, marker + ' must load after the previous data layer');
    assert.ok(fs.statSync(path.join(root, 'assets/js/data', file)).size < 110_000, marker + ' exceeds the bounded chunk budget');
    previous = index;
  }
  assert.ok(html.indexOf('assets/js/data/expanded.generated.js') > previous);
});
