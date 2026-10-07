import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REQUIRED_ASSETS = [
  'assets/css/site.css',
  'assets/css/components.css',
  'assets/css/home.css',
  'assets/js/lib/echarts-loader.js',
  'assets/js/data/food-medicine.generated.js',
  'assets/js/data/featured.js',
  'assets/js/data/expanded.bootstrap.js',
  'assets/js/data/expanded.chunk-00.js',
  'assets/js/data/expanded.chunk-01.js',
  'assets/js/data/expanded.chunk-02.js',
  'assets/js/data/expanded.chunk-03.js',
  'assets/js/data/expanded.chunk-04.js',
  'assets/js/data/expanded.chunk-05.js',
  'assets/js/data/expanded.chunk-06.js',
  'assets/js/data/expanded.chunk-07.js',
  'assets/js/data/expanded.chunk-08.js',
  'assets/js/data/expanded.generated.js',
  'assets/js/core/field-utils.js',
  'assets/js/core/runtime.js',
  'assets/js/components/stamp.browser.js',
  'assets/js/components/context-bar.browser.js',
  'assets/js/components/search.browser.js',
  'assets/js/components/saved-drawer.browser.js',
  'assets/js/components/theme.browser.js',
  'assets/js/pages/home.browser.js',
  'assets/js/lib/insight-aggregates.browser.js',
  'assets/js/lib/learn-modules.js',
  'assets/js/lib/data-coverage.browser.js',
  'assets/js/charts/insights.js',
  'assets/js/pages/cross-navigation.browser.js',
  'assets/js/pages/cosmos.browser.js',
  'assets/js/core/catalog-loader.browser.js',
  'assets/js/beautify.js',
  'assets/js/core/app-shell.js'
];
const DEFINITION_NAMES = ['store', 'chartManager', 'routes'];

function byteLength(value) {
  return new TextEncoder().encode(value).byteLength;
}

function attributeValue(attributes, name) {
  const match = String(attributes || '').match(new RegExp('(?<![\\w-])' + name + '\\s*=\\s*["\']([^"\']+)["\']', 'i'));
  return match ? match[1] : null;
}

function documentReferences(markup) {
  const references = [];
  for (const match of markup.matchAll(/<link\b([^>]*)>/gi)) {
    const attributes = match[1] || '';
    const rel = (attributeValue(attributes, 'rel') || '').trim().toLowerCase();
    const href = attributeValue(attributes, 'href');
    if (rel === 'stylesheet' && href) references.push({ asset: href, index: match.index });
  }
  for (const match of markup.matchAll(/<script\b([^>]*)>/gi)) {
    const src = attributeValue(match[1], 'src');
    if (src) references.push({ asset: src, index: match.index });
  }
  return references.sort((a, b) => a.index - b.index);
}

export function checkInlineRuntime({ baseDir = root, html, maxInlineBytes = 2048, requiredAssets = REQUIRED_ASSETS } = {}) {
  const source = html ?? fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');
  const markup = source.replace(/<!--[\s\S]*?-->/g, '');
  const issues = [];
  const documentAssets = documentReferences(markup);
  const references = [];
  const positions = [];
  for (const asset of requiredAssets) {
    const reference = documentAssets.find(item => item.asset === asset);
    if (!reference) {
      issues.push(`missing external asset reference: ${asset}`);
    } else {
      references.push(reference);
      positions.push(reference.index);
      if (!fs.existsSync(path.join(baseDir, asset))) issues.push(`referenced asset does not exist: ${asset}`);
    }
  }
  if (positions.length > 1) {
    const documentOrder = [...positions].sort((a, b) => a - b);
    if (positions.some((position, i) => position !== documentOrder[i])) {
      issues.push(`external asset order must be ${requiredAssets.join(' -> ')}`);
    }
  }

  const inlineStyles = [...markup.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)];
  for (const match of inlineStyles) {
    if (byteLength(match[1]) > maxInlineBytes) issues.push(`inline style block exceeds ${maxInlineBytes} bytes`);
  }
  const inlineScripts = [...markup.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match => !attributeValue(match[1], 'src'));
  for (const match of inlineScripts) {
    if (byteLength(match[2]) > maxInlineBytes) issues.push(`inline runtime script exceeds ${maxInlineBytes} bytes`);
  }

  const duplicates = [];
  for (const name of DEFINITION_NAMES) {
    const count = [...source.matchAll(new RegExp(`\\b(?:const|let|var)\\s+${name}\\b`, 'g'))].length;
    if (count > 1) duplicates.push(`duplicate inline definition: ${name} (${count})`);
  }
  return { ok: issues.length === 0, issues, duplicates, references: references.map(item => item.asset) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = checkInlineRuntime();
  if (result.ok) console.log('Inline runtime check: 0 issues');
  else {
    for (const issue of result.issues) console.error(issue);
    process.exitCode = 1;
  }
}
