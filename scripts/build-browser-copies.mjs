import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const BROWSER_COPY_PAIRS = Object.freeze([
  ['assets/js/components/stamp.js', 'assets/js/components/stamp.browser.js'],
  ['assets/js/components/context-bar.js', 'assets/js/components/context-bar.browser.js'],
  ['assets/js/components/search.js', 'assets/js/components/search.browser.js'],
  ['assets/js/components/saved-drawer.js', 'assets/js/components/saved-drawer.browser.js'],
  ['assets/js/components/theme.js', 'assets/js/components/theme.browser.js'],
  ['assets/js/pages/home.js', 'assets/js/pages/home.browser.js'],
  ['assets/js/pages/cross-navigation.js', 'assets/js/pages/cross-navigation.browser.js'],
  ['assets/js/pages/cosmos.js', 'assets/js/pages/cosmos.browser.js'],
  ['assets/js/core/catalog-loader.js', 'assets/js/core/catalog-loader.browser.js']
]);

const SUPPORTED_EXPORT = /^[ \t]*export\s+(?=(?:async\s+)?function\b|class\b|const\b|let\b|var\b)/gm;
const UNSUPPORTED_EXPORT = /^[ \t]*export\s+(?:default\b|\{|\*)/gm;

export function generateBrowserCopy(source) {
  const text = String(source).replace(/\r\n?/g, '\n');
  const unsupported = [...text.matchAll(UNSUPPORTED_EXPORT)].map(match => match[0].trim());
  if (unsupported.length) throw new Error('Unsupported export form in browser copy source: ' + unsupported.join(' | '));
  return text.replace(SUPPORTED_EXPORT, match => match.slice(0, match.indexOf('export')));
}

export function buildBrowserCopies({ baseDir = root, check = false, pairs = BROWSER_COPY_PAIRS } = {}) {
  const drifted = [];
  const written = [];
  const errors = [];
  for (const [sourceRelative, browserRelative] of pairs) {
    const sourcePath = path.join(baseDir, sourceRelative);
    const browserPath = path.join(baseDir, browserRelative);
    let generated;
    try {
      generated = generateBrowserCopy(fs.readFileSync(sourcePath, 'utf8'));
    } catch (error) {
      errors.push(sourceRelative + ': ' + error.message);
      continue;
    }
    const current = fs.existsSync(browserPath) ? fs.readFileSync(browserPath, 'utf8').replace(/\r\n?/g, '\n') : '';
    if (current === generated) continue;
    drifted.push(browserRelative.replaceAll('\\', '/'));
    if (!check) {
      fs.mkdirSync(path.dirname(browserPath), { recursive: true });
      fs.writeFileSync(browserPath, generated, 'utf8');
      written.push(browserRelative.replaceAll('\\', '/'));
    }
  }
  return { ok: drifted.length === 0 && errors.length === 0, drifted, written, errors };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check');
  const result = buildBrowserCopies({ check });
  if (result.errors.length) {
    console.error('Browser copy generation failed:');
    result.errors.forEach(error => console.error('- ' + error));
    process.exitCode = 1;
  } else if (check && result.drifted.length) {
    console.error('Browser runtime copies are stale:');
    result.drifted.forEach(file => console.error('- ' + file));
    process.exitCode = 1;
  } else if (check) {
    console.log('Browser runtime copies: in sync');
  } else {
    console.log(result.written.length ? 'Updated browser runtime copies:\n' + result.written.map(file => '- ' + file).join('\n') : 'Browser runtime copies: already in sync');
  }
}
