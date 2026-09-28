import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildDataCoverage } from '../assets/js/lib/data-coverage.mjs';
import { loadExpanded } from '../scripts/validate-expanded-data.mjs';

test('coverage excludes original formula materials and does not treat source labels as evidence', () => {
  const base = { qi:'温', wei:'辛', cat:'解表药', eff:'资料分类', source:'cp2020', meridian:['肺'] };
  const coverage = buildDataCoverage([base, {...base, image:'photo.jpg', sourceRefs:['https://example.org/row/1']}, {kind:'formula-material', source:'classic'}]);
  assert.equal(coverage.featuredCards, 2);
  assert.equal(coverage.formulaMaterialCount, 1);
  assert.equal(coverage.completeFacts, 2);
  assert.equal(coverage.sourceCovered, 1);
  assert.equal(coverage.imageCoverageRatio, 0.5);
});

test('expanded runtime and generated coverage agree at the staged target', () => {
  const data = loadExpanded();
  const report = JSON.parse(fs.readFileSync(new URL('../reports/data-coverage.json', import.meta.url), 'utf8'));
  const measured = buildDataCoverage(data.HERBS);
  assert.ok(measured.featuredCards >= 780);
  assert.equal(measured.completeFacts, measured.featuredCards);
  assert.equal(measured.imageBacked + measured.placeholder, measured.featuredCards);
  for (const [key,value] of Object.entries(measured)) assert.equal(report[key], value, key);
  assert.equal(data.HERBAL_DATA_VERSION.featuredCards, measured.featuredCards);
});
