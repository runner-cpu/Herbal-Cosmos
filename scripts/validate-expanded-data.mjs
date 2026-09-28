import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { verifyImagePolicy } from './image-policy.mjs';
import { buildDataCoverage, hasCompleteFacts } from '../assets/js/lib/data-coverage.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const issue = (code, message) => ({ code, message });
const readJson = (file, baseDir = root) => JSON.parse(fs.readFileSync(path.join(baseDir, file), 'utf8'));

export function loadExpanded(baseDir = root) {
  const window = {};
  const context = vm.createContext({ window, console, encodeURIComponent });
  for (const file of ['assets/js/data/food-medicine.generated.js', 'assets/js/data/featured.js', 'assets/js/data/expanded.generated.js']) {
    vm.runInContext(fs.readFileSync(path.join(baseDir, file), 'utf8'), context, { filename: file });
  }
  return window;
}

export function validateExpandedData({ baseDir = root } = {}) {
  const issues = [];
  let data;
  try { data = loadExpanded(baseDir); } catch (error) {
    issues.push(issue('generated-load', error.message));
    return { ok: false, issues, summary: {} };
  }
  const herbs = Array.isArray(data.HERBS) ? data.HERBS : [];
  const formulas = Array.isArray(data.FORMULAS) ? data.FORMULAS : [];
  const syndromes = Array.isArray(data.ZHENGS) ? data.ZHENGS : [];
  const foods = Array.isArray(data.FOOD_MEDICINE_DIRECTORY) ? data.FOOD_MEDICINE_DIRECTORY : [];
  const measured = buildDataCoverage(herbs);
  if (measured.featuredCards < 780) issues.push(issue('featured-count', 'knowledge cards ' + measured.featuredCards + ' < 780'));
  if (formulas.length < 50) issues.push(issue('formula-count', 'formulas ' + formulas.length + ' < 50'));
  if (syndromes.length < 30) issues.push(issue('syndrome-count', 'syndromes ' + syndromes.length + ' < 30'));
  if (foods.length !== 106) issues.push(issue('food-count', 'food directory ' + foods.length + ' != 106'));

  const ids = new Set();
  for (const herb of herbs) {
    if (!herb?.id || ids.has(herb.id)) issues.push(issue('herb-id', 'duplicate or missing herb id: ' + (herb?.id || '(empty)')));
    ids.add(herb?.id);
    for (const field of ['name', 'source', 'note']) if (!String(herb?.[field] || '').trim()) issues.push(issue('herb-field', (herb?.id || '(unknown)') + ' missing ' + field));
    if (herb.kind !== 'formula-material' && !hasCompleteFacts(herb)) issues.push(issue('herb-facts', herb.name + ': incomplete knowledge card'));
    if (herb.placeholder !== !Boolean(herb.image)) issues.push(issue('image-state', herb.name + ': incorrect placeholder state'));
  }
  for (const formula of formulas) {
    if (!formula?.id || !formula.name || !Array.isArray(formula.herbs) || !formula.herbs.length) issues.push(issue('formula-shape', (formula?.id || '(unknown)') + ' is incomplete'));
    for (const row of formula.herbs || []) {
      if (!Array.isArray(row) || !ids.has(row[0])) issues.push(issue('formula-herb-ref', formula.id + ': unresolved herb reference ' + row?.[0]));
      if (!String(row?.[1] || '').trim() || !String(row?.[2] || '').trim()) issues.push(issue('formula-herb-fields', formula.id + ': incomplete dose/role row'));
    }
  }
  const coverage = readJson('reports/data-coverage.json', baseDir);
  for (const [key, value] of Object.entries(measured)) {
    if (coverage[key] !== value || data.HERBAL_DATA_COVERAGE?.[key] !== value) issues.push(issue('coverage-report', key + ': generated coverage does not match runtime'));
  }
  if (coverage.featured !== herbs.length || coverage.formulas !== formulas.length || coverage.syndromes !== syndromes.length) issues.push(issue('coverage-report', 'reports/data-coverage.json does not match generated runtime counts'));
  const imageManifest = readJson('data/sources/herb-images.json', baseDir);
  const imagePolicy = verifyImagePolicy({ baseDir, manifest: imageManifest, herbs });
  for (const message of imagePolicy.errors) issues.push(issue('runtime-image-manifest', message));
  if (coverage.sourcedImages !== imagePolicy.runtimeImages) issues.push(issue('coverage-report', `reports/data-coverage.json sourcedImages ${coverage.sourcedImages} != runtime ${imagePolicy.runtimeImages}`));
  return { ok: issues.length === 0, issues, summary: { featured: herbs.length, formulas: formulas.length, syndromes: syndromes.length, food: foods.length, sourcedImages: herbs.filter(h => h.image).length, manifestImages: Object.keys(imageManifest.images || {}).length } };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateExpandedData();
  console.log('Expanded validation: ' + (result.summary.featured || 0) + ' cards, ' + (result.summary.formulas || 0) + ' formulas, ' + (result.summary.syndromes || 0) + ' syndromes, ' + (result.summary.food || 0) + ' foods, ' + (result.summary.sourcedImages || 0) + ' card images, ' + (result.summary.manifestImages || 0) + ' searched images, ' + result.issues.length + ' issue(s)');
  for (const item of result.issues) console.error(item.code + ': ' + item.message);
  if (!result.ok) process.exitCode = 1;
}
