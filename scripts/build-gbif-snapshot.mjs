import { mkdir, readFile, writeFile } from 'node:fs/promises';
import https from 'node:https';

const root = new URL('..', import.meta.url);
const herbs = JSON.parse(await readFile(new URL('src/data/curated/herbs.json', root), 'utf8')).herbs;
const cacheDir = new URL('.tmp/gbif-cache/', root);
const output = new URL('src/data/generated/gbif-snapshot.json', root);
const refresh = process.argv.includes('--refresh');
const concurrency = 4;
const maxRecords = 300;
const queryBase = {
  country: 'CN',
  hasCoordinate: 'true',
  hasGeospatialIssue: 'false',
  occurrenceStatus: 'PRESENT',
  limit: String(maxRecords),
};
const acceptedLicenses = new Set(['CC0_1_0', 'CC_BY_4_0']);
const sourceUrl = 'https://www.gbif.org/';

await mkdir(cacheDir, { recursive: true });
await mkdir(new URL('src/data/generated/', root), { recursive: true });

function requestJson(url, attempts = 4) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Herbal-Cosmos/1.0 (open biodiversity atlas; contact via repository)',
        Accept: 'application/json',
        Connection: 'close',
      },
      timeout: 45000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        requestJson(new URL(res.headers.location, url), attempts).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`GBIF HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
        catch (error) { reject(error); }
      });
    });
    req.on('timeout', () => req.destroy(new Error('GBIF request timeout')));
    req.on('error', (error) => {
      if (attempts <= 1) { reject(error); return; }
      setTimeout(() => requestJson(url, attempts - 1).then(resolve, reject), 900 * (5 - attempts));
    });
  });
}

function licenseCode(value = '') {
  if (/publicdomain\/zero|CC0/i.test(value)) return 'CC0_1_0';
  if (/licenses\/by\/4\.0|CC_BY_4_0/i.test(value)) return 'CC_BY_4_0';
  return '';
}

function representativeUrl(record) {
  return record.occurrenceID || record.references || (record.key ? `https://www.gbif.org/occurrence/${record.key}` : sourceUrl);
}

function aggregate(records, precision) {
  const cells = new Map();
  for (const record of records) {
    const lat = Number(record.decimalLatitude);
    const lon = Number(record.decimalLongitude);
    const license = licenseCode(record.license);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !acceptedLicenses.has(license)) continue;
    const south = Math.floor(lat / precision) * precision;
    const west = Math.floor(lon / precision) * precision;
    const key = `${south.toFixed(4)}:${west.toFixed(4)}`;
    if (!cells.has(key)) {
      cells.set(key, {
        lat: Number((south + precision / 2).toFixed(4)),
        lon: Number((west + precision / 2).toFixed(4)),
        south: Number(south.toFixed(4)),
        west: Number(west.toFixed(4)),
        north: Number((south + precision).toFixed(4)),
        east: Number((west + precision).toFixed(4)),
        count: 0,
        licenses: new Set(),
        occurrenceUrl: representativeUrl(record),
        representativeKey: record.key || null,
      });
    }
    const cell = cells.get(key);
    cell.count += 1;
    cell.licenses.add(license);
  }
  return [...cells.values()].map((cell) => ({ ...cell, licenses: [...cell.licenses].sort() }));
}

function summarise(records, totalCount, precision) {
  const cells = aggregate(records, precision);
  const sum = cells.reduce((total, cell) => total + cell.count, 0);
  const centroid = sum ? [
    Number((cells.reduce((total, cell) => total + cell.lon * cell.count, 0) / sum).toFixed(4)),
    Number((cells.reduce((total, cell) => total + cell.lat * cell.count, 0) / sum).toFixed(4)),
  ] : null;
  const bounds = cells.length ? [
    [Math.min(...cells.map((cell) => cell.west)), Math.min(...cells.map((cell) => cell.south))],
    [Math.max(...cells.map((cell) => cell.east)), Math.max(...cells.map((cell) => cell.north))],
  ] : null;
  return { cells, centroid, bounds, licenses: [...new Set(cells.flatMap((cell) => cell.licenses))].sort() };
}

async function enrich(herb) {
  const cacheFile = new URL(`${herb.id}.json`, cacheDir);
  let payload;
  if (!refresh) {
    try { payload = JSON.parse(await readFile(cacheFile, 'utf8')); } catch {}
  }
  if (!payload) {
    const params = new URLSearchParams({ ...queryBase, scientificName: herb.scientificName });
    params.append('license', 'CC0_1_0');
    params.append('license', 'CC_BY_4_0');
    payload = await requestJson(`https://api.gbif.org/v1/occurrence/search?${params}`);
    await writeFile(cacheFile, JSON.stringify(payload), 'utf8');
  }
  const records = (payload.results || []).filter((record) => acceptedLicenses.has(licenseCode(record.license)) && Number.isFinite(record.decimalLatitude) && Number.isFinite(record.decimalLongitude));
  const totalCount = Number(payload.count || 0);
  if (!records.length) {
    return {
      id: herb.id,
      nameZh: herb.nameZh,
      scientificName: herb.scientificName,
      status: 'no-records',
      recordCount: totalCount,
      sampledRecordCount: 0,
      gridCellCount: 0,
      precisionDegrees: 0.5,
      centroid: null,
      bounds: null,
      licenses: [],
      cells: [],
    };
  }
  let precision = 0.5;
  let summary = summarise(records, totalCount, precision);
  if (summary.cells.length < 3) {
    precision = 1;
    summary = summarise(records, totalCount, precision);
  }
  return {
    id: herb.id,
    nameZh: herb.nameZh,
    scientificName: herb.scientificName,
    status: 'available',
    recordCount: totalCount,
    sampledRecordCount: records.length,
    gridCellCount: summary.cells.length,
    precisionDegrees: precision,
    centroid: summary.centroid,
    bounds: summary.bounds,
    licenses: summary.licenses,
    cells: summary.cells.map(({ south, west, north, east, ...cell }) => cell),
  };
}

const results = [];
let index = 0;
async function worker() {
  while (index < herbs.length) {
    const herb = herbs[index++];
    try {
      const result = await enrich(herb);
      results.push(result);
      console.log(`${String(results.length).padStart(3, '0')}/${herbs.length} ${herb.nameZh} ${result.status} ${result.gridCellCount} cells`);
    } catch (error) {
      console.error(`FAILED ${herb.nameZh}: ${error.message}`);
      throw error;
    }
  }
}
await Promise.all(Array.from({ length: concurrency }, () => worker()));
results.sort((a, b) => herbs.findIndex((herb) => herb.id === a.id) - herbs.findIndex((herb) => herb.id === b.id));
const available = results.filter((item) => item.status === 'available');
const snapshot = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: {
    name: 'GBIF occurrence search',
    url: sourceUrl,
    citation: 'GBIF.org occurrence download/search, accessed 2026-10-21.',
  },
  query: {
    country: 'CN',
    hasCoordinate: true,
    hasGeospatialIssue: false,
    occurrenceStatus: 'PRESENT',
    licenses: [...acceptedLicenses].sort(),
    maxRecordsPerHerb: maxRecords,
    aggregation: '0.5 degree grid; sparse records fall back to 1 degree',
  },
  disclaimers: [
    '开放观测记录不代表药用分布或药效证据。',
    '网格点不是药材资源储量，也不代表推荐采集地点。',
    '记录数量受公众观测、许可过滤和抽样上限影响，不能据此比较物种稀缺程度。',
  ],
  summary: {
    totalHerbs: results.length,
    availableHerbs: available.length,
    noRecordHerbs: results.length - available.length,
    sampledRecords: available.reduce((sum, item) => sum + item.sampledRecordCount, 0),
    gridCells: available.reduce((sum, item) => sum + item.gridCellCount, 0),
  },
  herbs: results,
};
await writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(`Wrote ${output.pathname} (${snapshot.summary.availableHerbs}/${snapshot.summary.totalHerbs} herbs, ${snapshot.summary.gridCells} cells)`);
