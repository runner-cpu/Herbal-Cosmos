import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

test('bulk herb images and catalog chunks stay out of precache', () => {
  const literal = sw.match(/const\s+PRECACHE_URLS\s*=\s*Object\.freeze\((\[[\s\S]*?\])\);/);
  assert.ok(literal, 'literal PRECACHE_URLS array is required');
  assert.doesNotMatch(literal[1], /images\/herbs|data\/catalog\/chunk-/);
  assert.match(sw, /MAX_IMAGE_ENTRIES\s*=\s*120/);
  assert.match(sw, /MAX_CATALOG_ENTRIES\s*=\s*45/);
});

test('waiting worker activates only after explicit approval', () => {
  assert.match(sw, /event\.data\?\.type\s*===\s*['"]SKIP_WAITING['"]/);
  assert.match(sw, /self\.skipWaiting\(\)/);
  const installBlock = sw.match(/addEventListener\(['"]install['"][\s\S]*?\n\}\);/);
  assert.ok(installBlock, 'install handler is required');
  assert.doesNotMatch(installBlock[0], /skipWaiting/);
});

test('runtime caches are bounded and cross-origin requests are ignored', () => {
  assert.match(sw, /trimCache\(cacheName,\s*maximum\)/);
  assert.match(sw, /staleWhileRevalidate\(request,\s*IMAGE_CACHE,\s*MAX_IMAGE_ENTRIES/);
  assert.match(sw, /staleWhileRevalidate\(request,\s*CATALOG_CACHE,\s*MAX_CATALOG_ENTRIES/);
  assert.match(sw, /url\.origin\s*!==\s*self\.location\.origin/);
  assert.match(sw, /request\.method\s*!==\s*['"]GET['"]/);
});
