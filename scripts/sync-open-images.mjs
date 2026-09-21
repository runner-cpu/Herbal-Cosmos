import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const indexPath = path.join(root, 'index.html');
const allowedLicenses = 'by,by-sa,cc0,pdm';
const blockedWords = /capsule|supplement|bottle|packaging|product|pills|powder extract|logo|clipart|vector|advert|tea bag/i;

const queryOverrides = {
  shudi: 'Rehmannia glutinosa prepared root',
  shigao: 'gypsum mineral crystal',
  fuling: 'Wolfiporia extensa fungus',
  chenpi: 'Citrus reticulata dried peel',
  ganjiang: 'Zingiber officinale dried ginger root',
  fengmi: 'natural honey honeycomb',
  xingren: 'Prunus armeniaca kernel',
  taoren: 'Prunus persica kernel',
  jingmi: 'Oryza sativa rice grain',
  zhuru: 'bamboo inner shavings traditional medicine',
  baibiandou: 'Lablab purpureus white seed',
  jineijin: 'chicken gizzard lining traditional medicine',
  mangxiao: 'mirabilite mineral crystal',
  ejiao: 'ejiao donkey hide gelatin',
  ruxiang: 'Boswellia sacra resin frankincense',
  moyao: 'Commiphora myrrha resin myrrh',
  banlangen: 'Isatis indigotica root',
  daqingye: 'Isatis indigotica leaf',
  tianhuafen: 'Trichosanthes kirilowii root',
  gualou: 'Trichosanthes kirilowii fruit',
  qingpi: 'Citrus reticulata unripe fruit',
  zhiqiao: 'Citrus aurantium mature fruit',
  zhishi: 'Citrus aurantium young fruit',
  puhuang: 'Typha angustifolia pollen flower spike',
  haijinsha: 'Lygodium japonicum spores fern',
  xinyi: 'Magnolia biondii flower bud'
};

const heritageQueries = {
  zhenjiu: {name: '针灸', query: 'traditional Chinese acupuncture treatment'},
  paozhi: {name: '中药炮制技艺', query: 'traditional Chinese herbal medicine preparation pharmacy'},
  yuyu: {name: '藏医药浴法', query: 'Tibetan medicine herbal bath culture'},
  zhenfa: {name: '中医诊法', query: 'traditional Chinese medicine pulse diagnosis'},
  yangsheng: {name: '中医养生', query: 'Chinese qigong health exercise traditional'},
  tongrentang: {name: '同仁堂中医药文化', query: 'Tongrentang Beijing traditional Chinese pharmacy'}
};

const html = await fs.readFile(indexPath, 'utf8');
const start = html.indexOf('const HERBS = [');
const end = html.indexOf('// 本草图像系统', start);
if (start < 0 || end < 0) throw new Error('Unable to locate HERBS data block');
const source = html.slice(start + 'const HERBS = '.length, end).trim().replace(/;$/, '');
const herbs = Function(`"use strict"; return (${source});`)();

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const clean = value => String(value || '').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, ' ');

async function getJson(url, attempt = 0) {
  const response = await fetch(url, {headers: {'User-Agent': 'HerbalCosmos/2.0 (open-image-attribution)'}});
  if ((response.status === 429 || response.status >= 500) && attempt < 4) {
    await wait(1000 * (attempt + 1));
    return getJson(url, attempt + 1);
  }
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function scoreResult(result, query) {
  const title = clean(result.title);
  const terms = clean(query).split(' ').filter(word => word.length > 2);
  let score = terms.reduce((sum, word) => sum + (title.includes(word) ? 4 : 0), 0);
  if (result.source === 'inaturalist') score += 7;
  if (result.source === 'wikimedia') score += 6;
  if (result.source === 'flickr') score += 2;
  if (['cc0', 'pdm'].includes(result.license)) score += 3;
  if (blockedWords.test(result.title || '')) score -= 30;
  if ((result.width || 0) >= 800 && (result.height || 0) >= 600) score += 2;
  return score;
}

async function searchImage(query, usedIds) {
  const endpoint = new URL('https://api.openverse.org/v1/images/');
  endpoint.searchParams.set('q', query);
  endpoint.searchParams.set('page_size', '12');
  endpoint.searchParams.set('license', allowedLicenses);
  const payload = await getJson(endpoint);
  const ranked = (payload.results || [])
    .filter(item => item.thumbnail && item.id && !usedIds.has(item.id))
    .map(item => ({item, score: scoreResult(item, query)}))
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.score >= 6 ? ranked[0].item : null;
}

async function download(item, outputPath) {
  const response = await fetch(item.thumbnail, {headers: {'User-Agent': 'HerbalCosmos/2.0'}});
  if (!response.ok) throw new Error(`thumbnail ${response.status}`);
  const type = response.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error(`unexpected content type ${type}`);
  await fs.mkdir(path.dirname(outputPath), {recursive: true});
  await fs.writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
}

function attribution(kind, id, name, query, item, file) {
  return {
    kind,
    id,
    name,
    query,
    file,
    matchedTitle: item.title || '',
    creator: item.creator || 'Unknown',
    creatorUrl: item.creator_url || '',
    license: String(item.license || '').toUpperCase(),
    licenseVersion: item.license_version || '',
    licenseUrl: item.license_url || '',
    source: item.source || item.provider || '',
    provider: item.provider || '',
    landingUrl: item.foreign_landing_url || item.detail_url || item.url || '',
    originalUrl: item.url || '',
    openverseId: item.id,
    retrievedAt: new Date().toISOString()
  };
}

const manifest = [];
const missing = [];
const usedIds = new Set();

for (const [index, herb] of herbs.entries()) {
  const query = queryOverrides[herb.id] || herb.latin || `${herb.name} Chinese medicinal herb`;
  try {
    let item = await searchImage(query, usedIds);
    if (!item && herb.name) item = await searchImage(`${herb.name} ${herb.latin || ''}`, usedIds);
    if (!item) {
      missing.push({kind: 'herb', id: herb.id, name: herb.name, query});
    } else {
      usedIds.add(item.id);
      const relative = `images/herbs/${herb.id}.jpg`;
      await download(item, path.join(root, relative));
      manifest.push(attribution('herb', herb.id, herb.name, query, item, relative));
    }
  } catch (error) {
    missing.push({kind: 'herb', id: herb.id, name: herb.name, query, error: error.message});
  }
  if ((index + 1) % 10 === 0) console.log(`herbs ${index + 1}/${herbs.length}`);
  await wait(140);
}

for (const [id, entry] of Object.entries(heritageQueries)) {
  try {
    const item = await searchImage(entry.query, usedIds);
    if (!item) {
      missing.push({kind: 'heritage', id, name: entry.name, query: entry.query});
    } else {
      usedIds.add(item.id);
      const relative = `images/heritage/${id}.jpg`;
      await download(item, path.join(root, relative));
      manifest.push(attribution('heritage', id, entry.name, entry.query, item, relative));
    }
  } catch (error) {
    missing.push({kind: 'heritage', id, name: entry.name, query: entry.query, error: error.message});
  }
  await wait(140);
}

await fs.mkdir(path.join(root, 'data'), {recursive: true});
await fs.writeFile(path.join(root, 'data', 'image-sources.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  policy: 'Openverse search; only CC BY, CC BY-SA, CC0 and public-domain-marked results are accepted.',
  assets: manifest,
  missing
}, null, 2) + '\n');

const table = [
  '# 图片来源与开放许可清单',
  '',
  '> 图片通过 Openverse 检索并落地到本仓库，仅接受 CC BY、CC BY-SA、CC0 或公共领域标记。图片用于文化科普与原植物识别，不能替代药材性状或显微鉴定。',
  '',
  '| 对象 | 匹配标题 | 来源 | 作者 | 许可 |',
  '|---|---|---|---|---|',
  ...manifest.map(item => `| ${item.name} | [${String(item.matchedTitle).replaceAll('|', '\\|')}](${item.landingUrl}) | ${item.source} | ${String(item.creator).replaceAll('|', '\\|')} | [${item.license}${item.licenseVersion ? ` ${item.licenseVersion}` : ''}](${item.licenseUrl || item.landingUrl}) |`)
];
if (missing.length) {
  table.push('', '## 尚待补图', '', ...missing.map(item => `- ${item.name} (${item.id}): ${item.query}${item.error ? ` - ${item.error}` : ''}`));
}
await fs.writeFile(path.join(root, 'IMAGE_SOURCES.md'), table.join('\n') + '\n');
console.log(`complete: ${manifest.length} attributed assets, ${missing.length} missing`);
