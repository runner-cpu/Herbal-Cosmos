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
  assert.ok(html.indexOf('assets/vendor/echarts.min.js') > html.indexOf('</main>'));
  assert.ok(html.indexOf('assets/vendor/echarts.min.js') < html.indexOf('assets/js/core/runtime.js'));
  assert.ok(result.references.indexOf('assets/js/core/catalog-loader.js') < result.references.indexOf('assets/js/core/app-shell.js'));
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
  assert.ok(html.includes('assets/js/core/catalog-loader.js'));
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
