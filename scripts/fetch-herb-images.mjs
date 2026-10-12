import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = new URL('..', import.meta.url);
const catalogUrl = new URL('src/data/curated/herbs.json', root);
const imageDir = new URL('src/assets/herbs/', root);
const manifestUrl = new URL('src/data/curated/herb-images.json', root);
const api = 'https://api.gbif.org/v1/occurrence/search';
const retrievedAt = new Date().toISOString().slice(0, 10);
const concurrency = 6;
const fallbackNames = {
  'herb-guoshi-08': ['Amomum tsao-ko', 'Lanxangia tsao-ko'],
  'herb-shuize-06': ['Sargassum pallidum'],
  'herb-junmu-06': ['Boswellia sacra'],
};

const catalog = JSON.parse(await readFile(catalogUrl, 'utf8'));
await mkdir(imageDir, { recursive: true });

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function fetchJson(url, attempts = 3) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(25_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      await sleep(500 * (attempt + 1));
    }
  }
  throw lastError;
}

async function fetchBytes(url, attempts = 3) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(35_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { bytes: Buffer.from(await response.arrayBuffer()), contentType: response.headers.get('content-type') || '' };
    } catch (error) {
      lastError = error;
      await sleep(500 * (attempt + 1));
    }
  }
  throw lastError;
}

function mediaUrl(url) {
  if (!url) return '';
  return url.replace(/\/original\.(jpe?g|png|webp)$/i, '/medium.$1');
}

function extension(url, contentType = '') {
  const fromType = contentType.split(';')[0].split('/')[1];
  if (fromType === 'jpeg') return '.jpg';
  if (['png', 'webp', 'jpg'].includes(fromType)) return `.${fromType}`;
  const fromUrl = extname(new URL(url).pathname).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(fromUrl) ? fromUrl.replace('.jpeg', '.jpg') : '.jpg';
}

async function findImage(herb) {
  const url = `${api}?scientificName=${encodeURIComponent(herb.scientificName)}&media_type=StillImage&limit=30`;
  const data = await fetchJson(url);
  for (const record of data.results || []) {
    const media = (record.media || []).find((entry) => entry.type === 'StillImage' && entry.identifier);
    if (!media) continue;
    const imageUrl = mediaUrl(media.identifier);
    try {
      const file = await fetchBytes(imageUrl);
      if (file.bytes.length < 2_000) continue;
      const ext = extension(imageUrl, file.contentType);
      return {
        bytes: file.bytes,
        ext,
        sourceUrl: media.identifier,
        occurrenceUrl: record.references || `https://www.gbif.org/occurrence/${record.key}`,
        gbifKey: record.key,
        dataset: record.datasetName || 'GBIF occurrence media',
        creator: media.creator || record.recordedBy || '',
        rightsHolder: media.rightsHolder || '',
        license: media.license || record.license || '',
      };
    } catch {
      // Try the next observation when a particular image host is unavailable.
    }
  }
  // GBIF occasionally keeps an older synonym in the catalog. iNaturalist's
  // taxon endpoint supplies the accepted name's default photo in that case.
  const queries = [herb.scientificName, ...(fallbackNames[herb.id] || [])];
  let taxonData = null;
  let taxon = null;
  for (const query of queries) {
    const taxonUrl = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(query)}&per_page=5`;
    const candidate = await fetchJson(taxonUrl);
    taxon = candidate.results?.find((entry) => entry.default_photo?.medium_url);
    if (taxon) { taxonData = candidate; break; }
  }
  const photo = taxon?.default_photo;
  if (!photo?.medium_url || !taxonData) return null;
  const file = await fetchBytes(photo.medium_url);
  if (file.bytes.length < 2_000) return null;
  return {
    bytes: file.bytes,
    ext: extension(photo.medium_url, file.contentType),
    sourceUrl: photo.medium_url,
    occurrenceUrl: `https://www.inaturalist.org/taxa/${taxon.id}`,
    gbifKey: '',
    dataset: 'iNaturalist taxon photo',
    creator: photo.attribution || '',
    rightsHolder: '',
    license: photo.license_code ? `https://creativecommons.org/licenses/${photo.license_code.replace(/^cc-/, '')}/4.0/` : '',
  };
}

const manifest = { datasetId: 'herbal-cosmos-herb-images-v1', researchedAt: retrievedAt, provider: 'GBIF occurrence media', images: [] };
let cursor = 0;
async function worker() {
  while (true) {
    const index = cursor;
    cursor += 1;
    if (index >= catalog.herbs.length) return;
    const herb = catalog.herbs[index];
    try {
      const found = await findImage(herb);
      if (!found) {
        console.warn(`[${index + 1}/${catalog.herbs.length}] no image: ${herb.nameZh} (${herb.scientificName})`);
        manifest.images.push({ herbId: herb.id, nameZh: herb.nameZh, status: 'missing' });
        continue;
      }
      const fileName = `${herb.id}${found.ext}`;
      await writeFile(new URL(fileName, imageDir), found.bytes);
      manifest.images.push({
        herbId: herb.id,
        nameZh: herb.nameZh,
        status: 'ready',
        path: `./src/assets/herbs/${fileName}`,
        sourceUrl: found.sourceUrl,
        occurrenceUrl: found.occurrenceUrl,
        gbifKey: found.gbifKey,
        dataset: found.dataset,
        creator: found.creator,
        rightsHolder: found.rightsHolder,
        license: found.license,
      });
      console.log(`[${index + 1}/${catalog.herbs.length}] ${herb.nameZh}`);
    } catch (error) {
      console.warn(`[${index + 1}/${catalog.herbs.length}] failed: ${herb.nameZh} — ${error.message}`);
      manifest.images.push({ herbId: herb.id, nameZh: herb.nameZh, status: 'failed', error: error.message });
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));
manifest.images.sort((a, b) => catalog.herbs.findIndex((herb) => herb.id === a.herbId) - catalog.herbs.findIndex((herb) => herb.id === b.herbId));
manifest.summary = {
  total: manifest.images.length,
  ready: manifest.images.filter((entry) => entry.status === 'ready').length,
  missing: manifest.images.filter((entry) => entry.status !== 'ready').length,
};
await writeFile(manifestUrl, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Saved ${manifest.summary.ready}/${manifest.summary.total} herb images to src/assets/herbs/.`);
