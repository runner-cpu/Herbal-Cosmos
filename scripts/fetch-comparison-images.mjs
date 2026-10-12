import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

const root = new URL('..', import.meta.url);
const manifestUrl = new URL('src/data/curated/comparisons.json', root);
const imageDir = new URL('src/assets/comparisons/', root);
const queries = {
  'external-qingpi': 'Citrus reticulata',
  'external-shanyinhua': 'Lonicera macranthoides',
  'external-cangzhu': 'Atractylodes lancea',
  'external-dangshen': 'Codonopsis pilosula',
};

await mkdir(imageDir, { recursive: true });
const comparisons = JSON.parse(await readFile(manifestUrl, 'utf8'));

async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(25_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.json();
}

async function fetchImage(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(35_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status} for image`);
  return { bytes: Buffer.from(await response.arrayBuffer()), type: response.headers.get('content-type') || '' };
}

function extension(url, contentType) {
  const type = contentType.split(';')[0].split('/')[1];
  if (type === 'jpeg') return '.jpg';
  if (['png', 'webp', 'jpg'].includes(type)) return `.${type}`;
  const pathExt = extname(new URL(url).pathname).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(pathExt) ? pathExt.replace('.jpeg', '.jpg') : '.jpg';
}

for (const [sideId, query] of Object.entries(queries)) {
  const data = await fetchJson(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(query)}&per_page=8`);
  const taxon = data.results?.find((entry) => entry.default_photo?.medium_url && entry.name?.toLowerCase() === query.toLowerCase())
    || data.results?.find((entry) => entry.default_photo?.medium_url && query.toLowerCase().split(' ').every((part) => entry.name?.toLowerCase().includes(part)))
    || data.results?.find((entry) => entry.default_photo?.medium_url);
  if (!taxon) throw new Error(`No iNaturalist photo found for ${sideId}`);
  const photo = taxon.default_photo;
  const image = await fetchImage(photo.medium_url);
  if (image.bytes.length < 2_000) throw new Error(`Image too small for ${sideId}`);
  const ext = extension(photo.medium_url, image.type);
  const filename = `${sideId}${ext}`;
  await writeFile(new URL(filename, imageDir), image.bytes);
  const entry = {
    status: 'ready',
    path: `./src/assets/comparisons/${filename}`,
    sourceUrl: photo.medium_url,
    occurrenceUrl: `https://www.inaturalist.org/taxa/${taxon.id}`,
    dataset: 'iNaturalist taxon photo',
    creator: photo.attribution || '',
    rightsHolder: '',
    license: photo.license_code ? `https://creativecommons.org/licenses/${photo.license_code.replace(/^cc-/, '')}/4.0/` : '',
  };
  for (const comparison of comparisons.comparisons) {
    for (const side of [comparison.left, comparison.right]) if (side.id === sideId) side.image = entry;
  }
  console.log(`${sideId}: ${taxon.name} · ${filename}`);
}

await writeFile(manifestUrl, `${JSON.stringify(comparisons, null, 2)}\n`);
