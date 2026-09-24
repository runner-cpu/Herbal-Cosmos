import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAuthority, classifyCandidate } from '../assets/js/lib/catalog-rules.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const issue = (code, message, file) => ({ code, message, ...(file ? { file } : {}) });
function readJson(file, issues) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { issues.push(issue('invalid-json', file + ': ' + error.message, file)); return null; }
}
function readGenerated(file, key, issues) {
  try {
    const window = {};
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window }, { filename: file });
    if (!(key in window)) throw new Error('missing window.' + key);
    return window[key];
  } catch (error) { issues.push(issue('invalid-js', file + ': ' + error.message, file)); return null; }
}
function loadAuthority(baseDir, issues) {
  const dir = path.join(baseDir, 'data', 'sources');
  const pharma = readJson(path.join(dir, 'pharmacopoeia-2020-materials.json'), issues) || {};
  const aliases = readJson(path.join(dir, 'classic-aliases.json'), issues) || {};
  const variants = readJson(path.join(dir, 'character-variants.json'), issues) || {};
  return buildAuthority({ canonicalNames: pharma.canonicalNames || [], aliases: aliases.aliases || {}, variants: variants.variants || {} });
}
function validateEntries(entries, authority, issues) {
  if (!Array.isArray(entries)) { issues.push(issue('invalid-catalog', 'approved catalog must be an array')); return; }
  const ids = new Set(); const labels = new Set();
  entries.forEach((entry, index) => {
    const where = 'approved[' + index + ']';
    if (!entry || typeof entry !== 'object') { issues.push(issue('invalid-entry', where + ' is not an object')); return; }
    if (entry.status !== 'approved') issues.push(issue('invalid-status', where + ' must have status approved'));
    if (!entry.id || typeof entry.id !== 'string') issues.push(issue('missing-id', where + ' has no id'));
    else if (ids.has(entry.id)) issues.push(issue('duplicate-id', where + ' duplicates id ' + entry.id));
    else ids.add(entry.id);
    if (!entry.name || typeof entry.name !== 'string') { issues.push(issue('missing-name', where + ' has no canonical name')); return; }
    const classified = classifyCandidate(entry.name, authority);
    if (classified.status !== 'approved') issues.push(issue('approved-noise', where + ' ' + entry.name + ' is not approved: ' + classified.reviewReasons.join(', ')));
    if (labels.has(entry.name)) issues.push(issue('duplicate-name', where + ' duplicates name ' + entry.name));
    labels.add(entry.name);
    if (!Array.isArray(entry.aliases)) issues.push(issue('invalid-aliases', where + '.aliases must be an array'));
    for (const alias of entry.aliases || []) {
      if (typeof alias !== 'string' || !alias.trim()) issues.push(issue('invalid-alias', where + ' contains an empty alias'));
      else if (labels.has(alias)) issues.push(issue('duplicate-name', where + ' duplicates canonical/alias ' + alias));
      else labels.add(alias);
    }
  });
}
function validateChunks(baseDir, entries, manifest, issues) {
  const dir = path.join(baseDir, 'data', 'catalog');
  const listed = Array.isArray(manifest?.chunks) ? manifest.chunks : [];
  if (!Array.isArray(manifest?.chunks)) issues.push(issue('invalid-manifest', 'manifest.chunks must be an array'));
  const chunkEntries = [];
  for (const id of listed) {
    if (typeof id !== 'string' || !/^c\d{2}$/.test(id)) { issues.push(issue('invalid-chunk-id', 'invalid chunk id ' + String(id))); continue; }
    const file = path.join(dir, 'chunk-' + id + '.js');
    if (!fs.existsSync(file)) { issues.push(issue('missing-chunk', 'manifest lists missing ' + path.relative(baseDir, file), file)); continue; }
    const chunks = readGenerated(file, '__HERB_CATALOG_CHUNKS__', issues) || {};
    if (!Array.isArray(chunks[id])) { issues.push(issue('invalid-chunk', file + ' does not define an array for ' + id, file)); continue; }
    chunkEntries.push(...chunks[id]);
  }
  const listedFiles = new Set(listed.filter(id => typeof id === 'string').map(id => 'chunk-' + id + '.js'));
  if (fs.existsSync(dir)) for (const file of fs.readdirSync(dir)) if (/^chunk-c\d{2}\.js$/.test(file) && !listedFiles.has(file)) issues.push(issue('stale-chunk', file + ' is not listed in manifest', path.join(dir, file)));
  const expected = new Set((entries || []).map(entry => entry?.id).filter(Boolean));
  const actual = new Set(chunkEntries.map(entry => entry?.id).filter(Boolean));
  for (const id of expected) if (!actual.has(id)) issues.push(issue('chunk-missing-entry', 'catalog entry ' + id + ' is absent from chunks'));
  for (const id of actual) if (!expected.has(id)) issues.push(issue('chunk-extra-entry', 'chunk entry ' + id + ' is absent from approved catalog'));
  if (manifest && Number.isInteger(manifest.approvedCount) && manifest.approvedCount !== (entries || []).length) issues.push(issue('manifest-count', 'manifest approvedCount ' + manifest.approvedCount + ' != catalog ' + (entries || []).length));
}
function validateImages(baseDir, issues) {
  const file = path.join(baseDir, 'data', 'image-sources.json');
  if (!fs.existsSync(file)) return;
  const source = readJson(file, issues); if (!source || !Array.isArray(source.assets)) return;
  for (const asset of source.assets) {
    if (!asset?.file || typeof asset.file !== 'string') continue;
    const target = path.resolve(baseDir, asset.file);
    if (!target.startsWith(path.resolve(baseDir) + path.sep) || !fs.existsSync(target)) issues.push(issue('missing-image', 'referenced local image is missing: ' + asset.file, file));
  }
}
export function validateCatalog({ baseDir = root } = {}) {
  const issues = [];
  const catalog = readGenerated(path.join(baseDir, 'data', 'herb-catalog.js'), 'HERB_CATALOG', issues) || [];
  const manifest = readGenerated(path.join(baseDir, 'data', 'catalog', 'manifest.js'), 'HERB_CATALOG_MANIFEST', issues);
  const reportFile = path.join(baseDir, 'reports', 'catalog-review.json');
  const report = readJson(reportFile, issues) || {};
  validateEntries(catalog, loadAuthority(baseDir, issues), issues);
  validateChunks(baseDir, catalog, manifest, issues); validateImages(baseDir, issues);
  const review = Array.isArray(report.review) ? report.review : [];
  if (!Array.isArray(report.review)) issues.push(issue('invalid-review-report', 'review report must contain a review array', reportFile));
  review.forEach((entry, index) => { if (entry?.status !== 'review') issues.push(issue('invalid-review-status', 'review[' + index + '] must have status review', reportFile)); });
  if (manifest && Number.isInteger(manifest.reviewCount) && manifest.reviewCount !== review.length) issues.push(issue('manifest-review-count', 'manifest reviewCount ' + manifest.reviewCount + ' != report ' + review.length));
  return { ok: issues.length === 0, issues, review, summary: { approvedCount: catalog.length, reviewCount: review.length, issueCount: issues.length } };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateCatalog();
  console.log('Catalog validation: ' + result.summary.approvedCount + ' approved, ' + result.summary.reviewCount + ' review, ' + result.summary.issueCount + ' issue(s)');
  if (result.review.length) { console.log('Review candidates (reported, not treated as approved):'); for (const item of result.review) console.log('- ' + item.name + ': ' + ((item.reviewReasons || []).join(', ') || 'needs review')); }
  if (result.issues.length) { for (const item of result.issues) console.error(item.code + ': ' + item.message); process.exitCode = 1; }
}
