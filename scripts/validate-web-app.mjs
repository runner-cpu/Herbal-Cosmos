import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const issue = (code, message) => ({ code, message });
const REQUIRED_FILES = [
  'index.html',
  '404.html',
  'manifest.webmanifest',
  'sw.js',
  'assets/js/core/app-shell.js'
];

export const RESOURCE_LIMITS = Object.freeze({
  'assets/vendor/echarts.min.js': 1_100_000,
  // The curated layer now carries 902 audited cards. The catalog index remains
  // lazy-loaded in chunks; this budget covers the expanded evidence layer only.
  'assets/js/data/expanded.generated.js': 850_000,
  'assets/js/core/runtime.js': 100_000
});
export const HANDWRITTEN_MODULE_LIMIT = 40_000;
export const PRECACHE_LIMIT = 2_500_000;

function read(baseDir, relativePath) {
  try { return fs.readFileSync(path.join(baseDir, relativePath), 'utf8'); }
  catch { return ''; }
}

function fileBytes(baseDir, relativePath) {
  try { return fs.statSync(path.join(baseDir, relativePath)).size; }
  catch { return -1; }
}

function walkJavaScript(directory, baseDir, result = []) {
  if (!fs.existsSync(directory)) return result;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walkJavaScript(absolute, baseDir, result);
    else if (/\.(?:js|mjs)$/i.test(entry.name)) result.push(path.relative(baseDir, absolute).replaceAll('\\', '/'));
  }
  return result;
}

function parsePrecache(serviceWorker) {
  const match = serviceWorker.match(/const\s+PRECACHE_URLS\s*=\s*Object\.freeze\((\[[\s\S]*?\])\);/);
  if (!match) return [];
  return [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map(item => item[1]);
}

function normalizeLocalReference(value) {
  const raw = String(value || '').trim();
  if (!raw || raw.startsWith('#') || raw.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(raw)) return '';
  const withoutFragment = raw.split('#')[0].split('?')[0];
  if (!withoutFragment || withoutFragment === '.' || withoutFragment === './') return 'index.html';
  return decodeURIComponent(withoutFragment.replace(/^\.\//, '').replace(/^\//, ''));
}

function collectDocumentAssets(html) {
  const values = [];
  for (const match of html.matchAll(/<(?:script|img)\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) values.push(match[1]);
  for (const match of html.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) values.push(match[1]);
  return values;
}

function hasTag(html, expression) {
  return expression.test(html);
}

export function validateWebApp({ baseDir = root } = {}) {
  const issues = [];
  const seenFiles = new Set();
  const add = (code, message) => issues.push(issue(code, message));
  const noteFile = relativePath => { if (fileBytes(baseDir, relativePath) >= 0) seenFiles.add(relativePath); };

  for (const relativePath of REQUIRED_FILES) {
    const bytes = fileBytes(baseDir, relativePath);
    if (bytes <= 0) add('required-file', relativePath + ' is missing or empty');
    else seenFiles.add(relativePath);
  }

  const html = read(baseDir, 'index.html');
  const headEnd = html.search(/<\/head\s*>/i);
  const echartsIndex = html.indexOf('assets/vendor/echarts.min.js');
  const runtimeIndex = html.indexOf('assets/js/core/runtime.js');
  if (echartsIndex < 0 || runtimeIndex < 0 || headEnd < 0 || echartsIndex < headEnd || echartsIndex > runtimeIndex) {
    add('echarts-order', 'ECharts must load after </head> and before assets/js/core/runtime.js');
  }

  const metadata = [
    ['canonical', /<link\b[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/runner-cpu\.github\.io\/Herbal-Cosmos\/["']/i],
    ['robots', /<meta\b[^>]*name=["']robots["'][^>]*content=["']index,follow,max-image-preview:large["']/i],
    ['referrer', /<meta\b[^>]*name=["']referrer["'][^>]*content=["']strict-origin-when-cross-origin["']/i],
    ['color-scheme', /<meta\b[^>]*name=["']color-scheme["'][^>]*content=["']light dark["']/i],
    ['manifest', /<link\b[^>]*rel=["']manifest["'][^>]*href=["']manifest\.webmanifest["']/i],
    ['twitter-card', /<meta\b[^>]*name=["']twitter:card["'][^>]*content=["']summary_large_image["']/i],
    ['twitter-title', /<meta\b[^>]*name=["']twitter:title["']/i],
    ['twitter-description', /<meta\b[^>]*name=["']twitter:description["']/i],
    ['twitter-image', /<meta\b[^>]*name=["']twitter:image["']/i],
    ['og-image-type', /<meta\b[^>]*property=["']og:image:type["'][^>]*content=["']image\/jpeg["']/i],
    ['og-image-width', /<meta\b[^>]*property=["']og:image:width["'][^>]*content=["']333["']/i],
    ['og-image-height', /<meta\b[^>]*property=["']og:image:height["'][^>]*content=["']500["']/i],
    ['og-image-alt', /<meta\b[^>]*property=["']og:image:alt["']/i],
    ['json-ld', /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?EducationalApplication[\s\S]*?<\/script>/i]
  ];
  for (const [name, expression] of metadata) if (!hasTag(html, expression)) add('metadata-' + name, 'index.html is missing ' + name + ' metadata');

  if (!html.includes('不构成医疗建议')) add('medical-boundary', 'index.html must retain the medical-advice boundary');
  for (const copy of ['无账号', '无遥测', '清除浏览器数据后不可恢复']) {
    if (!html.includes(copy)) add('privacy-copy', 'index.html is missing privacy copy: ' + copy);
  }

  const externalRuntime = [
    ...html.matchAll(/<script\b[^>]*\bsrc=["'](https?:\/\/[^"']+)["']/gi),
    ...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["'](https?:\/\/[^"']+)["']/gi)
  ];
  if (externalRuntime.length) add('external-runtime', 'index.html contains an external runtime script or stylesheet');

  for (const reference of collectDocumentAssets(html)) {
    const relativePath = normalizeLocalReference(reference);
    if (!relativePath) continue;
    const resolved = path.resolve(baseDir, relativePath);
    if (!resolved.startsWith(path.resolve(baseDir) + path.sep) && resolved !== path.resolve(baseDir, 'index.html')) {
      add('asset-path', 'resource escapes project root: ' + reference);
    } else if (fileBytes(baseDir, relativePath) < 0) {
      add('asset-missing', 'index.html references missing resource: ' + relativePath);
    } else seenFiles.add(relativePath);
  }

  let manifest = null;
  const manifestText = read(baseDir, 'manifest.webmanifest');
  if (manifestText) {
    try { manifest = JSON.parse(manifestText); }
    catch (error) { add('manifest-json', 'manifest.webmanifest is invalid JSON: ' + error.message); }
  }
  if (manifest) {
    if (manifest.start_url !== './#/home') add('manifest-start', 'manifest start_url must be ./#/home');
    if (manifest.scope !== './') add('manifest-scope', 'manifest scope must be ./');
    if (manifest.display !== 'standalone') add('manifest-display', 'manifest display must be standalone');
    if (!/^#[0-9a-f]{6}$/i.test(manifest.theme_color || '') || !/^#[0-9a-f]{6}$/i.test(manifest.background_color || '')) add('manifest-color', 'manifest colors must be six-digit hex values');
    if (!Array.isArray(manifest.icons) || !manifest.icons.length) add('manifest-icons', 'manifest must contain at least one icon');
    for (const icon of manifest.icons || []) {
      const iconPath = normalizeLocalReference(icon.src);
      if (!iconPath || fileBytes(baseDir, iconPath) <= 0) add('manifest-icon-file', 'manifest icon is missing: ' + String(icon.src || ''));
      else seenFiles.add(iconPath);
    }
  }

  for (const [relativePath, limit] of Object.entries(RESOURCE_LIMITS)) {
    const bytes = fileBytes(baseDir, relativePath);
    if (bytes < 0) add('resource-missing', relativePath + ' is missing');
    else {
      seenFiles.add(relativePath);
      if (bytes > limit) add('resource-budget', relativePath + ' is ' + bytes + ' bytes; limit is ' + limit);
    }
  }

  const handwritten = walkJavaScript(path.join(baseDir, 'assets', 'js'), baseDir)
    .filter(relativePath => relativePath !== 'assets/js/core/runtime.js' && !relativePath.startsWith('assets/js/data/'));
  for (const relativePath of handwritten) {
    const bytes = fileBytes(baseDir, relativePath);
    seenFiles.add(relativePath);
    if (bytes > HANDWRITTEN_MODULE_LIMIT) add('module-budget', relativePath + ' is ' + bytes + ' bytes; limit is ' + HANDWRITTEN_MODULE_LIMIT);
  }

  const serviceWorker = read(baseDir, 'sw.js');
  const precacheUrls = parsePrecache(serviceWorker);
  if (serviceWorker && !precacheUrls.length) add('precache-list', 'sw.js must expose a literal PRECACHE_URLS array');
  if (precacheUrls.some(value => /(?:images\/herbs|data\/catalog\/chunk-)/.test(value))) add('precache-bulk', 'precache must not contain herb images or catalog chunks');
  let precacheBytes = 0;
  const precacheFiles = new Set();
  for (const value of precacheUrls) {
    const relativePath = normalizeLocalReference(value);
    if (!relativePath || precacheFiles.has(relativePath)) continue;
    precacheFiles.add(relativePath);
    const bytes = fileBytes(baseDir, relativePath);
    if (bytes < 0) add('precache-missing', 'sw.js precaches a missing file: ' + relativePath);
    else { precacheBytes += bytes; seenFiles.add(relativePath); }
  }
  if (precacheBytes > PRECACHE_LIMIT) add('precache-budget', 'precache is ' + precacheBytes + ' bytes; limit is ' + PRECACHE_LIMIT);

  const notFound = read(baseDir, '404.html');
  for (const destination of ['./#/home', './#/herbs', './#/formula']) {
    if (notFound && !notFound.includes(destination)) add('404-link', '404.html is missing recovery link ' + destination);
  }

  return { ok: issues.length === 0, issues, summary: { precacheBytes, checkedFiles: seenFiles.size } };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateWebApp();
  console.log('Web app validation: ' + result.summary.checkedFiles + ' files, ' + result.summary.precacheBytes + ' precached bytes, ' + result.issues.length + ' issue(s)');
  for (const item of result.issues) console.error(item.code + ': ' + item.message);
  if (!result.ok) process.exitCode = 1;
}
