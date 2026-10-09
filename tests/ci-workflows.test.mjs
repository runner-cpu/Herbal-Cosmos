import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const quality = fs.readFileSync(path.join(root, '.github/workflows/catalog-quality.yml'), 'utf8');
const smoke = fs.readFileSync(path.join(root, '.github/workflows/pages-smoke.yml'), 'utf8');

test('quality workflow is least-privilege and verifies generated browser copies', () => {
  assert.match(quality, /permissions:\s*\n\s*contents:\s*read/);
  assert.match(quality, /concurrency:/);
  assert.match(quality, /timeout-minutes:/);
  assert.match(quality, /npm run build:browser/);
  assert.match(quality, /npm run check:browser-copies/);
  assert.match(quality, /git diff --exit-code -- assets\/js\/.*\.browser\.js/);
  assert.match(quality, /test:browser:compat/);
});

test('pages smoke waits for gh-pages and verifies the deployed shell version', () => {
  assert.match(smoke, /branches:\s*\[gh-pages\]/);
  assert.match(smoke, /permissions:\s*\n\s*contents:\s*read/);
  assert.match(smoke, /https:\/\/runner-cpu\.github\.io\/Herbal-Cosmos\//);
  assert.match(smoke, /expanded\.generated\.js/);
  assert.match(smoke, /HERBAL_DATA_VERSION/);
  assert.match(smoke, /uses:\s*actions\/checkout@v4/);
  assert.match(smoke, /CACHE_VERSION/);
  assert.equal(smoke.includes('herbal-cosmos-v'), false, 'smoke must read the version from sw.js instead of hard-coding it');
});
