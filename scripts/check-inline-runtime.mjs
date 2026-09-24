import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REQUIRED_ASSETS = [
  'assets/css/site.css',
  'assets/css/components.css',
  'assets/js/data/featured.js',
  'assets/js/components/stamp.js',
  'assets/js/components/context-bar.js',
  'assets/js/components/search.js',
  'assets/js/components/saved-drawer.js',
  'assets/js/core/runtime.js',
  'assets/js/components/theme.js',
  'assets/js/pages/home.js',
  'assets/js/charts/insights.js',
  'assets/js/pages/cross-navigation.js',
  'assets/js/pages/cosmos.js',
  'assets/js/core/catalog-loader.js'
];
const DEFINITION_NAMES = ['store', 'chartManager', 'routes'];

function byteLength(value) {
  return new TextEncoder().encode(value).byteLength;
}

export function checkInlineRuntime({ baseDir = root, html, maxInlineBytes = 2048 } = {}) {
  const source = html ?? fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');
  const issues = [];
  const references = [];
  for (const asset of REQUIRED_ASSETS) {
    const index = source.indexOf(asset);
    if (index < 0) {
      issues.push(`missing external asset reference: ${asset}`);
    } else {
      references.push({ asset, index });
      if (!fs.existsSync(path.join(baseDir, asset))) issues.push(`referenced asset does not exist: ${asset}`);
    }
  }
  const ordered = references.map(item => item.asset);
  if (ordered.length === REQUIRED_ASSETS.length && ordered.some((asset, i) => asset !== REQUIRED_ASSETS[i])) {
    issues.push(`external asset order must be ${REQUIRED_ASSETS.join(' -> ')}`);
  }

  const inlineStyles = [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)];
  for (const match of inlineStyles) {
    if (byteLength(match[1]) > maxInlineBytes) issues.push(`inline style block exceeds ${maxInlineBytes} bytes`);
  }
  const inlineScripts = [...source.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of inlineScripts) {
    if (byteLength(match[1]) > maxInlineBytes) issues.push(`inline runtime script exceeds ${maxInlineBytes} bytes`);
  }

  const duplicates = [];
  for (const name of DEFINITION_NAMES) {
    const count = [...source.matchAll(new RegExp(`\\b(?:const|let|var)\\s+${name}\\b`, 'g'))].length;
    if (count > 1) duplicates.push(`duplicate inline definition: ${name} (${count})`);
  }
  return { ok: issues.length === 0, issues, duplicates, references: references.sort((a, b) => a.index - b.index).map(item => item.asset) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = checkInlineRuntime();
  if (result.ok) console.log('Inline runtime check: 0 issues');
  else {
    for (const issue of result.issues) console.error(issue);
    process.exitCode = 1;
  }
}
