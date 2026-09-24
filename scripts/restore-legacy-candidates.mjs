import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultRevision = '318a5fe356d8a25be5ad48be33d20bd2b39e4dee';

function parseLegacyArray(source) {
  const start = source.indexOf('[');
  const end = source.lastIndexOf(']');
  if (start < 0 || end < start) throw new Error('legacy catalog array not found');
  return JSON.parse(source.slice(start, end + 1));
}

export function extractLegacyCandidates(source, revision = defaultRevision) {
  const entries = parseLegacyArray(source);
  const lines = source.split(/\r?\n/);
  let cursor = 0;
  const candidates = entries.map(entry => {
    const marker = `\"name\": ${JSON.stringify(entry.name)}`;
    let lineIndex = lines.findIndex((line, index) => index >= cursor && line.includes(marker));
    if (lineIndex < 0) lineIndex = lines.findIndex(line => line.includes(marker));
    cursor = Math.max(cursor, lineIndex + 1);
    const sourceRef = String(entry.source || '').includes('yasenstar') ? 'legacy-classic-text' : 'legacy-open-name-index';
    return {
      raw: entry.name,
      sourceRefs: [sourceRef],
      sourceLocation: `git:${revision}:data/herb-catalog.js:${Math.max(1, lineIndex + 1)}`,
      reviewReasons: ['legacy-candidate-unverified']
    };
  });
  return { schemaVersion: 1, sourceRevision: revision, candidateCount: candidates.length, candidates };
}

function cli() {
  const revision = process.argv[2] || defaultRevision;
  const output = path.resolve(process.argv[3] || path.join(root, 'data/sources/raw-candidates.json'));
  const source = execFileSync('git', ['show', `${revision}:data/herb-catalog.js`], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  const restored = extractLegacyCandidates(source, revision);
  fs.writeFileSync(output, JSON.stringify(restored, null, 2) + '\n', 'utf8');
  console.log(`Restored ${restored.candidateCount} legacy candidates to ${path.relative(root, output)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) cli();
