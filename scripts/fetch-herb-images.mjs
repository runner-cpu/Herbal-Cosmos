/** Reproducible searched-image import. No credentials, generated images or fuzzy species substitutions. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { extractTaxa } from './herb-source-utils.mjs';
import { verifyImagePolicy } from './image-policy.mjs';
import { loadExpanded } from './validate-expanded-data.mjs';
export { extractTaxa } from './herb-source-utils.mjs';

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name, fallback) => { const i = args.indexOf(name); return i < 0 ? fallback : args[i + 1]; };
const input = path.resolve(root, option('--input', '.tmp-v3/tcmData.json'));
const manifestPath = path.join(root, 'data/sources/herb-images.json');
const cacheDir = path.resolve(root, option('--cache', '.tmp-v3/image-cache'));
const concurrency = Math.min(3, Math.max(1, Number(option('--concurrency', '3'))));
const maxRows = Number(option('--limit', '0'));
const userAgent = 'HerbalCosmos/4.0 (educational botanical reference; open-license images)';
const sha256 = value => createHash('sha256').update(value).digest('hex');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const stripHtml = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const norm = value => String(value).toLowerCase().replace(/\s+/g, ' ').trim();
const sourceCommit = 'b0c619683f7263811e6027e1f5dff73be6362284';
let commonsResumeAt = 0;

async function http(url, attempt = 0) {
  try {
    if (process.platform === 'win32' && option('--transport', 'powershell') === 'powershell') {
      const script = `$ErrorActionPreference='Stop'; [Console]::OutputEncoding=[System.Text.Encoding]::UTF8; $ProgressPreference='SilentlyContinue'; try { $r=Invoke-WebRequest -UseBasicParsing -Uri $env:HERB_IMAGE_URL -Headers @{'User-Agent'=$env:HERB_IMAGE_UA} -TimeoutSec 25; @{body=[Convert]::ToBase64String($r.RawContentStream.ToArray());contentType=[string]$r.Headers['Content-Type'];status=200} | ConvertTo-Json -Compress } catch { @{status=[int]$_.Exception.Response.StatusCode;error=$_.Exception.Message} | ConvertTo-Json -Compress }`;
      const { stdout } = await run('powershell.exe', ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', script], { env: { ...process.env, HERB_IMAGE_URL: String(url), HERB_IMAGE_UA: userAgent }, maxBuffer: 12 * 1024 * 1024, timeout: 35000, windowsHide: true });
      const response = JSON.parse(stdout.replace(/^\uFEFF/, ''));
      if (response.status !== 200) throw Object.assign(new Error(`HTTP ${response.status}: ${response.error}`), { status: response.status });
      return { bytes: Buffer.from(response.body, 'base64'), contentType: response.contentType };
    }
    const response = await fetch(url, { headers: { 'User-Agent': userAgent }, signal: AbortSignal.timeout(25000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { bytes: Buffer.from(await response.arrayBuffer()), contentType: response.headers.get('content-type') || '' };
  } catch (error) {
    if (error.status === 429 && String(url).includes('commons.wikimedia.org')) { commonsResumeAt = Date.now() + 180000; throw error; }
    if (attempt < 1) { await wait(1800 * (attempt + 1)); return http(url, attempt + 1); }
    throw new Error(String(error.stderr || error.message).replace(/\s+/g, ' ').slice(-300));
  }
}

async function json(url) {
  const target = path.join(cacheDir, `${sha256(String(url))}.json`);
  try { return JSON.parse(await fs.readFile(target, 'utf8')); } catch {}
  const response = await http(url);
  const data = JSON.parse(response.bytes.toString('utf8').replace(/^\uFEFF/, ''));
  if (data.error) throw new Error(data.error.info || JSON.stringify(data.error));
  await fs.writeFile(target, JSON.stringify(data));
  return data;
}

function commonsLicense(meta) {
  const label = stripHtml(meta.LicenseShortName?.value);
  const url = stripHtml(meta.LicenseUrl?.value);
  if (/^CC BY(?:-SA)? [1-4]\.0$/i.test(label) && /creativecommons\.org\/licenses\/by(?:-sa)?\//.test(url)) return { license: label, licenseUrl: url };
  if (/^CC0(?: 1\.0)?$/i.test(label)) return { license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' };
  if (/^Public domain$/i.test(label)) return { license: 'Public domain', licenseUrl: url || 'https://creativecommons.org/publicdomain/mark/1.0/' };
  return null;
}

async function commonsCandidates(taxon) {
  if (Date.now() < commonsResumeAt) return [];
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.search = new URLSearchParams({ action: 'query', format: 'json', generator: 'categorymembers', gcmtitle: `Category:${taxon}`, gcmtype: 'file', gcmlimit: '24', prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '400', iiurlheight: '400' });
  const data = await json(url);
  const result = [];
  for (const page of Object.values(data.query?.pages || {})) {
    const info = page.imageinfo?.[0];
    const meta = info?.extmetadata || {};
    const categories = stripHtml(meta.Categories?.value).split('|');
    const license = commonsLicense(meta);
    const author = stripHtml(meta.Artist?.value);
    if (!info?.thumburl || !license || !author || !/\.(?:jpe?g|png)$/i.test(page.title)) continue;
    if (!categories.some(c => norm(c) === norm(taxon))) continue;
    if (/distribution|map|diagram|illustration|drawing|herbarium|[ _]MHNT|specimen|scan|stamp|painting|logo|chemical|chromosome|cultivation area|flower diagram|wood section|microscope/i.test(page.title)) continue;
    const words = taxon.split(' ');
    const otherSpecies = [...page.title.matchAll(new RegExp(`${words[0]}[ _]+([a-z-]+)`, 'g'))].some(m => m[1] !== words[1]);
    if (otherSpecies) continue;
    let score = norm(page.title).includes(norm(taxon)) ? 20 : 5;
    if (/flower|fruit|leaf|leaves|habit|plant|branch/i.test(page.title)) score += 2;
    if (/seedling|seed|bud|wood|stump|dead/i.test(page.title)) score -= 3;
    result.push({ provider: 'Wikimedia Commons', taxon, depicts: taxon, sourceUrl: info.descriptionurl, author, ...license, downloadUrl: info.thumburl, matchedTitle: page.title, matchMethod: 'exact Commons species category', matchEvidence: `https://commons.wikimedia.org/wiki/Category:${encodeURIComponent(taxon.replaceAll(' ', '_'))}`, score });
  }
  return result.sort((a, b) => b.score - a.score).slice(0, 3);
}

function inatPhoto(photo, taxon, sourceUrl, matchMethod, authorFallback) {
  const licenses = { 'cc-by': ['CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/'], 'cc-by-sa': ['CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/'], cc0: ['CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/'] };
  const license = licenses[photo?.license_code];
  if (!license || !photo.url) return null;
  const attributionAuthor = stripHtml(photo.attribution).replace(/^\(c\) /, '').replace(/, (?:some|all|no) rights reserved.*$/, '');
  const uploader = authorFallback ? `${authorFallback} (iNaturalist uploader)` : '';
  const author = photo.attribution_name || (/^no rights reserved/.test(attributionAuthor) ? uploader : attributionAuthor) || uploader;
  if (!author) return null;
  return { provider: 'iNaturalist', taxon: taxon.name, depicts: taxon.name, sourceUrl, author, license: license[0], licenseUrl: license[1], attribution: photo.attribution || '', downloadUrl: photo.medium_url || photo.url.replace(/\/(?:square|small)\./, '/medium.'), matchedTitle: taxon.name, matchMethod, matchEvidence: `https://www.inaturalist.org/taxa/${taxon.id}`, photoId: photo.id };
}

async function inatCandidates(name) {
  const data = await json(`https://api.inaturalist.org/v1/taxa?${new URLSearchParams({ q: name, rank: 'species', per_page: '5' })}`);
  const taxon = (data.results || []).find(t => t.is_active && (norm(t.name) === norm(name) || norm(t.matched_term) === norm(name)));
  if (!taxon) return [];
  const match = norm(taxon.name) === norm(name) ? 'exact iNaturalist taxon' : `iNaturalist indexed synonym: ${name}`;
  const candidate = inatPhoto(taxon.default_photo, taxon, `https://www.inaturalist.org/photos/${taxon.default_photo?.id}`, match);
  if (candidate) return [candidate];
  const observations = await json(`https://api.inaturalist.org/v1/observations?${new URLSearchParams({ taxon_id: String(taxon.id), photos: 'true', photo_license: 'cc-by,cc-by-sa,cc0', quality_grade: 'research', per_page: '4', order_by: 'votes' })}`);
  return (observations.results || []).filter(o => o.taxon?.id === taxon.id && o.quality_grade === 'research').flatMap(o => (o.photos || []).map(p => inatPhoto(p, taxon, o.uri || `https://www.inaturalist.org/observations/${o.id}`, `${match}; research-grade observation`, o.user?.name || o.user?.login)).filter(Boolean)).slice(0, 3);
}

async function download(candidate) {
  const key = sha256(candidate.sourceUrl + candidate.downloadUrl).slice(0, 14);
  const response = await http(candidate.downloadUrl);
  if (response.bytes.length > 1800000 || response.bytes.length < 250) throw new Error('thumbnail size outside 250–1,800,000 bytes');
  const b = response.bytes;
  const extension = b[0] === 0xff && b[1] === 0xd8 ? 'jpg' : b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'png' : b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' ? 'webp' : null;
  if (!extension || !/^image\//i.test(response.contentType)) throw new Error('download is not a supported raster image');
  const file = `images/herbs/open/${candidate.taxon.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${key}.${extension}`;
  await fs.writeFile(path.join(root, file), b);
  const { score, ...metadata } = candidate;
  return { ...metadata, file, sha256: sha256(b), bytes: b.length, retrievedAt: new Date().toISOString() };
}

async function verify(manifest) {
  const result = verifyImagePolicy({ baseDir: root, manifest, herbs: loadExpanded(root).HERBS });
  console.log(JSON.stringify({ ...result, exclusions: manifest.exclusions?.length || 0 }, null, 2));
  if (result.errors.length) process.exitCode = 1;
}

async function main() {
  if (args.includes('--verify')) return verify(JSON.parse(await fs.readFile(manifestPath, 'utf8')));
  const inputRaw = await fs.readFile(input, 'utf8');
  const inputData = JSON.parse(inputRaw);
  const rows = inputData.data || inputData;
  const sourceRows = maxRows ? rows.slice(0, maxRows) : rows;
  if (args.includes('--dry-run')) { console.log(JSON.stringify({ sourceRecords: rows.length, recordsWithTaxa: rows.filter(r => extractTaxa(r).length).length, uniqueTaxa: new Set(rows.flatMap(extractTaxa)).size, candidates: sourceRows.map(r => ({ name: r['中药名'], taxa: extractTaxa(r) })) }, null, 2)); return; }
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.mkdir(path.join(root, 'images/herbs/open'), { recursive: true });
  let previous = { images: {} };
  try { previous = JSON.parse(await fs.readFile(manifestPath, 'utf8')); } catch {}
  const authorsToRepair = Object.values(previous.images || {}).filter(i => i.author === 'no rights reserved');
  if (authorsToRepair.length) {
    for (const file of await fs.readdir(cacheDir)) {
      if (!file.endsWith('.json')) continue;
      const cached = JSON.parse(await fs.readFile(path.join(cacheDir, file), 'utf8'));
      for (const observation of cached.results || []) {
        if (!observation.user) continue;
        for (const image of authorsToRepair) if (image.sourceUrl === observation.uri) image.author = `${observation.user.name || observation.user.login} (iNaturalist uploader)`;
      }
    }
  }
  const manifest = { version: 1, policy: 'Searched photographs only. Exact source species/category or indexed taxonomic synonym; CC BY, CC BY-SA, CC0 or public domain. Source-organism reference, not proof of the harvested medicinal part.', source: { upstream: `https://github.com/owlet0605/TCM_KG/blob/${sourceCommit}/TCM_KG-DataBuilder/originData/data/tcmData.json`, commit: sourceCommit, sha256: sha256(inputRaw), origin: 'zhongyoo.com records mirrored by TCM_KG' }, images: previous.images || {}, exclusions: [] };
  const resolved = new Map();
  for (const image of Object.values(manifest.images)) resolved.set(image.sourceTaxon || image.taxon, Promise.resolve(image));
  let completed = 0;
  let writeQueue = Promise.resolve();
  const save = () => { const body = JSON.stringify({ ...manifest, updatedAt: new Date().toISOString() }, null, 2) + '\n'; writeQueue = writeQueue.then(() => fs.writeFile(manifestPath, body)); return writeQueue; };
  async function find(taxon) {
    if (resolved.has(taxon)) return resolved.get(taxon);
    const promise = (async () => {
      for (const search of [commonsCandidates, inatCandidates]) {
        try { for (const candidate of await search(taxon)) { try { return { ...(await download(candidate)), sourceTaxon: taxon }; } catch (error) { console.log(`download unavailable ${taxon}: ${error.message.slice(0, 80)}`); } } } catch (error) { console.log(`search unavailable ${taxon}: ${error.message.slice(0, 80)}`); }
      }
      return null;
    })();
    resolved.set(taxon, promise);
    return promise;
  }
  let next = 0;
  async function worker() {
    while (next < sourceRows.length) {
      const row = sourceRows[next++];
      const name = String(row['中药名'] || '').trim();
      const taxa = extractTaxa(row);
      if (!manifest.images[name]) {
        let image = null;
        for (const taxon of taxa) { image = await find(taxon); if (image) break; }
        if (image) { manifest.images[name] = { ...image, alt: `${name}的来源生物参考图：${image.taxon}。本图不代表药材的采收部位或炮制形态。`, sourceRowName: name, sourceRowHash: sha256(JSON.stringify(row)) }; }
        else manifest.exclusions.push({ name, taxa, reason: taxa.length ? 'No exact-subject photograph with an accepted open license was retrieved.' : 'No unambiguous botanical/zoological binomial in source, or non-biological material.' });
      }
      completed++;
      if (completed % 15 === 0) { await save(); console.log(`processed ${completed}/${sourceRows.length}; attributed records ${Object.keys(manifest.images).length}; exclusions ${manifest.exclusions.length}`); }
      await wait(100);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  await save();
  const esc = value => String(value).replaceAll('|', '\|').replaceAll('\n', ' ');
  const lines = ['# V4 searched-image sources', '', `Source snapshot: TCM_KG ${sourceCommit}; original descriptive source: zhongyoo.com.`, '', 'These are searched, openly licensed photographs of a source organism. They do not establish the identity of a harvested medicinal part, processing state, clinical indication or safety. Species aliases are accepted only when indexed by the image provider. Minerals and records without an unambiguous source taxon remain excluded. Runtime cards reference only entries in this manifest; earlier images without complete open-license metadata are excluded from runtime and replaced by placeholders.', '', `Coverage: ${Object.keys(manifest.images).length} source records; ${new Set(Object.values(manifest.images).map(i => i.file)).size} local image files. Remaining exclusions: ${manifest.exclusions.length}.`, '', 'Reproduce: `node scripts/fetch-herb-images.mjs --input .tmp-v3/tcmData.json`; Windows uses PowerShell HTTP and other platforms use Node fetch. Limit concurrency to three; the importer caches API responses, retries once with backoff and resumes from the manifest. `--limit 30` creates a small working batch. `--verify` checks attribution fields, local files and SHA-256 hashes.', '', 'License terms are linked per image. CC BY-SA files retain their share-alike license. Thumbnails are resized source photographs; no image-generation service is used. Attribution strings are retained verbatim in the JSON where supplied, along with source URLs, download URLs, taxonomic evidence and content hashes.', '', '| 药材名称 | 图像物种 | 作者 | 许可 | 来源 |', '|---|---|---|---|---|', ...Object.entries(manifest.images).sort(([a], [b]) => a.localeCompare(b, 'zh-CN')).map(([name, i]) => `| ${esc(name)} | ${esc(i.taxon)} | ${esc(i.author)} | [${esc(i.license)}](${i.licenseUrl}) | [${esc(i.provider)}](${i.sourceUrl}) |`), '', '## Explicit exclusions', '', ...manifest.exclusions.map(e => `- ${e.name}: ${e.taxa.join('; ') || 'no exact source taxon'} — ${e.reason}`)];
  await fs.writeFile(path.join(root, 'IMAGE_SOURCES_V4.md'), lines.join('\n') + '\n');
  await verify(manifest);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
