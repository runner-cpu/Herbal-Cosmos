import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildBrowserCopies, generateBrowserCopy } from '../scripts/build-browser-copies.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pairs = [
  'components/stamp',
  'components/context-bar',
  'components/search',
  'components/saved-drawer',
  'components/theme',
  'pages/home',
  'pages/formula-directory',
  'pages/cross-navigation',
  'pages/cosmos',
  'pages/apothecary',
  'core/catalog-loader'
];

function expectedBrowserCopy(relativePath) {
  return fs.readFileSync(path.join(root, 'assets/js', relativePath + '.js'), 'utf8')
    .replace(/\r\n?/g, '\n')
    .replace(/^export\s+/gm, '');
}

test('every browser copy byte-matches its deterministic source transform', () => {
  for (const relativePath of pairs) {
    const browserPath = path.join(root, 'assets/js', relativePath + '.browser.js');
    assert.equal(
      fs.readFileSync(browserPath, 'utf8'),
      expectedBrowserCopy(relativePath),
      relativePath + '.browser.js drifted from its source module'
    );
  }
});

test('browser copy transform strips only top-level declaration exports and emits LF', () => {
  const source = 'export const value = 1;\r\n  export const nestedText = "kept";\r\nexport async function read() { return value; }\r\n/* export const commented = 0; */\r\nconst text = `export const inTemplate = 0;`\r\n';
  assert.equal(
    generateBrowserCopy(source),
    'const value = 1;\n  const nestedText = "kept";\nasync function read() { return value; }\n/* export const commented = 0; */\nconst text = `export const inTemplate = 0;`\n'
  );
});

test('browser copy transform rejects unsupported export forms', () => {
  assert.throws(() => generateBrowserCopy('export default function x() {}\n'), /Unsupported export/);
  assert.throws(() => generateBrowserCopy('export { value };\n'), /Unsupported export/);
  assert.throws(() => generateBrowserCopy('export * from "./other.js";\n'), /Unsupported export/);
});

test('browser copy check reports drift without writing files', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'herbal-browser-copies-'));
  try {
    const source = path.join(fixture, 'sample.js');
    const browser = path.join(fixture, 'sample.browser.js');
    fs.writeFileSync(source, 'export const value = 1;\r\n');
    fs.writeFileSync(browser, 'const stale = true;\n');
    const result = buildBrowserCopies({ baseDir: fixture, check: true, pairs: [['sample.js', 'sample.browser.js']] });
    assert.deepEqual(result.drifted, ['sample.browser.js']);
    assert.equal(fs.readFileSync(browser, 'utf8'), 'const stale = true;\n');
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('browser copy builder exposes a clean non-writing check', () => {
  const result = spawnSync(process.execPath, ['scripts/build-browser-copies.mjs', '--check'], {
    cwd: root,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, [result.stdout, result.stderr].filter(Boolean).join('\n'));
});

test('package scripts keep browser-copy generation separate from data builds', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts['build:browser'], 'node scripts/build-browser-copies.mjs');
  assert.equal(pkg.scripts['check:browser-copies'], 'node scripts/build-browser-copies.mjs --check');
  assert.equal(pkg.scripts['build:data'].includes('build:browser'), false);
});
