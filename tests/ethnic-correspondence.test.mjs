import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateEthnicData } from '../scripts/validate-ethnic-data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fixture(entries, options = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'herbal-ethnic-'));
  fs.mkdirSync(path.join(dir, 'assets', 'js', 'data'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'reports'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'assets', 'js', 'data', 'featured.js'),
    "const HERBS = [{ id: 'gancao', name: '甘草', kind: 'featured' }];\nif (typeof window !== 'undefined') window.HERBS = HERBS;\n");
  fs.writeFileSync(path.join(dir, 'assets', 'js', 'data', 'ethnic-correspondence.js'),
    'window.ETHNIC_CORRESPONDENCE = ' + JSON.stringify(options.raw ?? entries, null, 2) + ';\n');
  return dir;
}

const approvedEntry = {
  herbId: 'gancao',
  herbName: '甘草',
  systems: ['common'],
  note: '在多个民族医药文献中均有记载。',
  source: { title: '示例来源', url: 'https://example.org/source' },
  status: 'approved'
};

test('an approved entry with a source passes and is reported by system', () => {
  const dir = fixture([approvedEntry]);
  try {
    const result = validateEthnicData({ baseDir: dir });
    assert.equal(result.ok, true, result.issues.join('\n'));
    assert.equal(result.report.approved, 1);
    assert.equal(result.report.review, 0);
    assert.equal(result.report.bySystem.common, 1);
    assert.equal(result.report.approvedEntries[0].source.url, 'https://example.org/source');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a missing source downgrades to review instead of failing the gate', () => {
  const dir = fixture([{ ...approvedEntry, source: { title: '', url: '' } }]);
  try {
    const result = validateEthnicData({ baseDir: dir });
    assert.equal(result.ok, true, result.issues.join('\n'));
    assert.equal(result.report.approved, 0);
    assert.equal(result.report.review, 1);
    assert.equal(result.report.reviewEntries[0].reason, 'missing source url');
    assert.equal(result.warnings.length, 1);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a non-https source cannot be approved', () => {
  const dir = fixture([{ ...approvedEntry, source: { title: 'x', url: 'http://example.org/source' } }]);
  try {
    const result = validateEthnicData({ baseDir: dir });
    assert.equal(result.report.approved, 0);
    assert.equal(result.report.review, 1);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('unknown herb ids fail the gate', () => {
  const dir = fixture([{ ...approvedEntry, herbId: 'not-a-herb' }]);
  try {
    const result = validateEthnicData({ baseDir: dir });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(issue => issue.startsWith('unknown herbId')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a mismatched herb name fails the gate', () => {
  const dir = fixture([{ ...approvedEntry, herbName: '人参' }]);
  try {
    const result = validateEthnicData({ baseDir: dir });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(issue => issue.includes('herbName mismatch')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('unknown systems and empty system lists fail the gate', () => {
  const unknown = fixture([{ ...approvedEntry, systems: ['martian'] }]);
  const empty = fixture([{ ...approvedEntry, systems: [] }]);
  try {
    assert.ok(validateEthnicData({ baseDir: unknown }).issues.some(issue => issue.includes('unknown system')));
    assert.ok(validateEthnicData({ baseDir: empty }).issues.some(issue => issue.includes('non-empty array')));
  } finally {
    fs.rmSync(unknown, { recursive: true, force: true });
    fs.rmSync(empty, { recursive: true, force: true });
  }
});

test('treatment claims in the note fail the gate', () => {
  const dir = fixture([{ ...approvedEntry, note: '该药材可治愈多种疾病。' }]);
  try {
    const result = validateEthnicData({ baseDir: dir });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(issue => issue.includes('treatment claim')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('duplicate herb and system combinations fail the gate', () => {
  const dir = fixture([approvedEntry, { ...approvedEntry, note: '重复条目。' }]);
  try {
    const result = validateEthnicData({ baseDir: dir });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(issue => issue.includes('duplicate')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('the shipped correspondence keeps every entry honest about its source', () => {
  const result = validateEthnicData();
  assert.equal(result.ok, true, result.issues.join('\n'));
  assert.ok(result.report.total > 0, 'shipped data must contain candidate entries');
  assert.equal(result.report.approved + result.report.review, result.report.total);
  for (const entry of result.report.approvedEntries) {
    assert.match(entry.source.url, /^https:\/\//, entry.herbName + ' must carry an https source');
  }
});
