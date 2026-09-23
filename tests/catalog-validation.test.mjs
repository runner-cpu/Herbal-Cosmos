import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateCatalog } from '../scripts/validate-catalog.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fixture() {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-validation-'));
  fs.mkdirSync(path.join(baseDir, 'data'), { recursive: true });
  fs.cpSync(path.join(root, 'data', 'sources'), path.join(baseDir, 'data', 'sources'), { recursive: true });
  fs.cpSync(path.join(root, 'data', 'catalog'), path.join(baseDir, 'data', 'catalog'), { recursive: true });
  fs.copyFileSync(path.join(root, 'data', 'herb-catalog.js'), path.join(baseDir, 'data', 'herb-catalog.js'));
  fs.mkdirSync(path.join(baseDir, 'reports'), { recursive: true });
  fs.copyFileSync(path.join(root, 'reports', 'catalog-review.json'), path.join(baseDir, 'reports', 'catalog-review.json'));
  return baseDir;
}

function writeCatalog(baseDir, entries) {
  fs.writeFileSync(path.join(baseDir, 'data', 'herb-catalog.js'),
    'window.HERB_CATALOG = ' + JSON.stringify(entries, null, 2) + ';\n');
}

test('generated output passes and surfaces review entries without failing', () => {
  const result = validateCatalog({ baseDir: root });
  assert.equal(result.ok, true, result.issues.map(issue => issue.message).join('\n'));
  assert.equal(result.review.length, 10);
  assert.ok(result.summary.reviewCount > 0);
});

test('a noisy candidate in approved output fails validation', () => {
  const baseDir = fixture();
  try {
    writeCatalog(baseDir, [{ id: 'herb-noisy', name: '出现面色苍白', aliases: [], sourceRefs: [] }]);
    const result = validateCatalog({ baseDir });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(issue => issue.code === 'approved-noise'));
  } finally {
    fs.rmSync(baseDir, { recursive: true, force: true });
  }
});

test('duplicate canonical or alias IDs fail validation', () => {
  const baseDir = fixture();
  try {
    writeCatalog(baseDir, [
      { id: 'herb-duplicate', name: '川楝子', aliases: ['川楝'], sourceRefs: [] },
      { id: 'herb-duplicate', name: '川芎', aliases: ['川楝'], sourceRefs: [] }
    ]);
    const result = validateCatalog({ baseDir });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(issue => issue.code === 'duplicate-id'));
    assert.ok(result.issues.some(issue => issue.code === 'duplicate-name'));
  } finally {
    fs.rmSync(baseDir, { recursive: true, force: true });
  }
});

test('a missing chunk listed in the manifest fails validation', () => {
  const baseDir = fixture();
  try {
    const manifestPath = path.join(baseDir, 'data', 'catalog', 'manifest.js');
    const source = fs.readFileSync(manifestPath, 'utf8').replace('\"c00\"', '\"c99\"');
    fs.writeFileSync(manifestPath, source);
    const result = validateCatalog({ baseDir });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(issue => issue.code === 'missing-chunk'));
  } finally {
    fs.rmSync(baseDir, { recursive: true, force: true });
  }
});
