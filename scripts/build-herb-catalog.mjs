import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildAuthority, classifyCandidate } from '../assets/js/lib/catalog-rules.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function stable(value) { if (Array.isArray(value)) return value.map(stable); if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])); return value; }
function hash(value) { return createHash('sha256').update(value).digest('hex'); }
function compare(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
function uniqueSorted(values = []) { return [...new Set(values.filter(Boolean))].sort(compare); }

export function buildCatalog({ candidates = [], authority }) {
  if (!authority || !authority.canonicalNames) throw new TypeError('authority is required');
  const approvedMap = new Map(); const reviewMap = new Map();
  for (const candidate of candidates) {
    const input = typeof candidate === 'string' ? { raw: candidate } : (candidate || {});
    const raw = String(input.raw ?? input.name ?? '').trim(); if (!raw) continue;
    const classified = classifyCandidate(raw, authority);
    const sourceRefs = uniqueSorted(input.sourceRefs || []);
    const suppliedReasons = Array.isArray(input.reviewReasons) ? input.reviewReasons : [];
    if (classified.status === 'approved' && !suppliedReasons.length) {
      const name = classified.canonicalName;
      const existing = approvedMap.get(name) || { id: 'herb-' + hash(name).slice(0, 12), name, aliases: [], sourceRefs: [] };
      existing.aliases = uniqueSorted(existing.aliases.concat(classified.aliases));
      existing.sourceRefs = uniqueSorted(existing.sourceRefs.concat(sourceRefs)); approvedMap.set(name, existing); continue;
    }
    const existing = reviewMap.get(raw) || { id: 'review-' + hash(raw).slice(0, 12), name: raw, aliases: [], sourceRefs: [], reviewReasons: [] };
    existing.sourceRefs = uniqueSorted(existing.sourceRefs.concat(sourceRefs));
    existing.reviewReasons = uniqueSorted(existing.reviewReasons.concat(classified.reviewReasons, suppliedReasons));
    if (input.sourceLocation) existing.sourceLocation = input.sourceLocation; reviewMap.set(raw, existing);
  }
  const approved = [...approvedMap.values()].sort((a, b) => compare(a.name, b.name));
  const review = [...reviewMap.values()].sort((a, b) => compare(a.name, b.name));
  return { approved, review, stats: { candidateCount: candidates.length, approvedCount: approved.length, reviewCount: review.length } };
}

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function loadSources(base = root) {
  const dir = path.join(base, 'data', 'sources');
  const manifest = readJson(path.join(dir, 'source-manifest.json')); const pharma = readJson(path.join(dir, 'pharmacopoeia-2020-materials.json'));
  const aliases = readJson(path.join(dir, 'classic-aliases.json')); const variants = readJson(path.join(dir, 'character-variants.json')); const raw = readJson(path.join(dir, 'raw-candidates.json'));
  const authority = buildAuthority({ canonicalNames: pharma.canonicalNames, aliases: aliases.aliases, variants: variants.variants });
  authority.sourceRefs = new Map(pharma.entries.map(entry => [entry.canonicalName, entry.sourceRefs || []]));
  const admitted = pharma.entries.map(entry => ({ raw: entry.canonicalName, sourceRefs: entry.sourceRefs || [] }));
  return { manifest, authority, candidates: admitted.concat(raw.candidates) };
}

function writeArtifacts(result, sourceRevision, authorityHash, base = root) {
  const dataDir = path.join(base, 'data'); const catalogDir = path.join(dataDir, 'catalog'); const reportsDir = path.join(base, 'reports');
  fs.mkdirSync(catalogDir, { recursive: true }); fs.mkdirSync(reportsDir, { recursive: true });
  const approved = result.approved.map(item => ({ ...item, sourceRefs: uniqueSorted(item.sourceRefs.concat(result.authorityRefs?.get(item.name) || [])) }));
  const chunks = []; for (let i = 0; i < approved.length; i += 120) chunks.push(approved.slice(i, i + 120));
  const chunkIds = chunks.map((_, i) => 'c' + String(i).padStart(2, '0')); const banner = '/* Generated deterministically from data/sources. */\n';
  fs.writeFileSync(path.join(dataDir, 'herb-catalog.js'), banner + 'window.HERB_CATALOG = ' + JSON.stringify(approved, null, 2) + ';\n', 'utf8');
  for (let i = 0; i < chunks.length; i++) { const id = chunkIds[i]; const body = 'window.__HERB_CATALOG_CHUNKS__ = window.__HERB_CATALOG_CHUNKS__ || {};\n' + 'window.__HERB_CATALOG_CHUNKS__[' + JSON.stringify(id) + '] = ' + JSON.stringify(chunks[i]) + ';\n'; fs.writeFileSync(path.join(catalogDir, 'chunk-' + id + '.js'), banner + body, 'utf8'); }
  const manifest = { approvedCount: approved.length, reviewCount: result.review.length, chunks: chunkIds, sourceRevision, authorityHash };
  fs.writeFileSync(path.join(catalogDir, 'manifest.js'), banner + 'window.HERB_CATALOG_MANIFEST = ' + JSON.stringify(manifest, null, 2) + ';\n', 'utf8');
  fs.writeFileSync(path.join(reportsDir, 'catalog-review.json'), JSON.stringify({ sourceRevision, review: result.review, stats: result.stats }, null, 2) + '\n', 'utf8');
}

export function buildFromSources(base = root) {
  const loaded = loadSources(base); const result = buildCatalog({ candidates: loaded.candidates, authority: loaded.authority }); result.authorityRefs = loaded.authority.sourceRefs;
  const authorityHash = hash(JSON.stringify(stable({ canonicalNames: [...loaded.authority.canonicalNames].sort(compare), aliases: Object.fromEntries([...loaded.authority.aliases.entries()].sort()), variants: Object.fromEntries([...loaded.authority.variants.entries()].sort()) })));
  writeArtifacts(result, loaded.manifest.sourceRevision, authorityHash, base); return result;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) { const result = buildFromSources(root); console.log('Generated ' + result.approved.length + ' approved and ' + result.review.length + ' review entries'); }
