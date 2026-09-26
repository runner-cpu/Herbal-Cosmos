/** Import compact bibliographic facts, never clinical prose, from pinned public records. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { extractTaxa } from './herb-source-utils.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const digest = text => createHash('sha256').update(text).digest('hex');
export async function readSnapshot(file) {
  const raw = await fs.readFile(file, 'utf8');
  const envelope = JSON.parse(raw);
  const bytes = envelope.encoding === 'base64' ? Buffer.from(envelope.content, 'base64') : Buffer.from(raw);
  return { data: JSON.parse(bytes.toString('utf8')), sha256: digest(bytes), bytes: bytes.length };
}
export async function saveSource(name, data) {
  const target = path.join(root, 'data/sources', name);
  await fs.writeFile(target, JSON.stringify(data, null, 2) + '\n', 'utf8');
  return target;
}
// Source-specific transformations are intentionally explicit and reviewed.
// Input text is never evaluated, and unknown property values stay unknown.
const DATE = '2026-09-26';
const KDHR_REV = '50f0eb294766a11536907a4f7273e0d1235d34a1';
const TCM_REV = 'b0c619683f7263811e6027e1f5dff73be6362284';
const TCM_URL = `https://github.com/owlet0605/TCM_KG/blob/${TCM_REV}/TCM_KG-DataBuilder/originData/data/tcmData.json`;
const PROVINCES = ['北京','天津','河北','山西','内蒙古','辽宁','吉林','黑龙江','上海','江苏','浙江','安徽','福建','江西','山东','河南','湖北','湖南','广东','广西','海南','重庆','四川','贵州','云南','西藏','陕西','甘肃','青海','宁夏','新疆','台湾','香港','澳门'];
const CATEGORIES = ['解表药','清热药','泻下药','祛风湿药','化湿药','利水渗湿药','温里药','理气药','消食药','驱虫药','止血药','活血化瘀药','化痰止咳平喘药','安神药','平肝息风药','开窍药','补虚药','收涩药','涌吐药','杀虫止痒药','拔毒生肌药'];
export function factualHerb(row, index) {
  const name = String(row['中药名'] || '').trim();
  const properties = row['性味'] || '';
  const effectText = row['功效作用'] || '';
  const classification = effectText.split('属').slice(1).join('属');
  let cat = CATEGORIES.find(value => classification.includes(value));
  if (!cat) cat = CATEGORIES.find(value => classification.includes(value.replace(/药$/, '')));
  if (!cat && /补益|补气|补阳|补阴|补血/.test(classification)) cat = '补虚药';
  const qi = (properties.match(/(?:性|气)[^寒热温凉平]{0,1}(大寒|微寒|大热|微温|寒|热|温|凉|平)/) || properties.match(/(大寒|微寒|大热|微温|寒|热|温|凉|平)/))?.[1] || '未录入';
  const wei = [...new Set((properties.match(/味([^，。；]+)/)?.[1] || properties.split(/[，。；]/)[0] || '').match(/[酸苦甘辛咸淡涩]/g) || [])].join('、') || '未录入';
  const meridian = [...new Set(Array.from(String(row['归经'] || '').matchAll(/(心包|三焦|大肠|小肠|膀胱|肺|脾|胃|肝|肾|胆|心)经/g), m => m[1]))];
  const distribution = row['产地分布'] || '';
  // A mention in habitat prose is a distribution observation, not a 道地 certification.
  const regionText = distribution.split(/分布于|分布在|产于/).slice(1).join('；');
  const origin = PROVINCES.filter(value => regionText.includes(value) && !new RegExp('除[^。]*' + value).test(regionText));
  const taxonomy = extractTaxa(row)[0] || '';
  const aliases = (row['别名'] || '').split(/[、，,；;。]/).map(x=>x.trim()).filter(x=>x && x!==name && /^[\p{Script=Han}·]{1,8}$/u.test(x));
  const category = cat || '未分类';
  return { name, pinyin: row['拼音'] || '', latin: taxonomy || String(row['英文名'] || '').replace(/[。.]$/, ''), taxonomy, qi, wei, meridian, cat: category, eff: category === '未分类' ? '传统分类未录入' : `传统分类：${category}`, aliases, origin, source:'openMateria', sourceRecord:`data[${index}]`, sourceRefs:[TCM_URL], note: /有毒/.test(properties) ? '原资料注明有毒，需专业鉴定与炮制；仅供本草科普。' : '公开本草资料整理；植物来源、性味与归经按原记录转录，仅供科普。' };
}

export async function importSources({ medicalFile, namesFile, licenseFile }) {
  const medical = await readSnapshot(medicalFile);
  if (!Array.isArray(medical.data.data) || medical.data.data.length < 800) throw new Error('Incomplete botanical source snapshot');
  const envelope = JSON.parse(await fs.readFile(namesFile, 'utf8'));
  const csvBytes = Buffer.from(envelope.content, 'base64');
  const lines = csvBytes.toString('utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  if (lines[0] !== 'index:ID,herbName,:LABEL') throw new Error('Unexpected KDHR schema');
  const entries = lines.slice(1).map((line, i) => {
    const match = /^(HN\d+),([^,]+),herb$/.exec(line);
    if (!match) throw new Error('Malformed herb entity at line ' + (i + 2));
    return { name:match[2], sourceRefs:['kdhr:' + match[1]], sourceLine:i+2 };
  });
  if (entries.length !== 9152) throw new Error('Pinned KDHR snapshot row count changed');
  await saveSource('open-name-index.json', { schemaVersion:1,sourceRevision:DATE, source:{id:'kdhr',title:'KDHR 药材实体表',repositoryRevision:KDHR_REV,url:`https://github.com/Rao-Yulong/KDHR/blob/${KDHR_REV}/KG/entity/herbID.csv`,license:'Apache-2.0',sha256:digest(csvBytes),rows:entries.length}, entries });
  const herbs = medical.data.data.map(factualHerb);
  await saveSource('open-herb-facts.json', { schemaVersion:1,sourceRevision:DATE, source:{id:'tcmkg',title:'公开中药材资料结构化记录',repositoryRevision:TCM_REV,url:TCM_URL,upstream:'http://www.zhongyoo.com/name/',sha256:medical.sha256,rows:herbs.length,scope:'Only compact nomenclatural, taxonomic and traditional classification facts are transcribed; clinical prose, dosing advice and efficacy research claims are not reproduced. This is not a pharmacopoeia verification.'},herbs });
  await fs.mkdir(path.join(root,'data/licenses'),{recursive:true});
  await fs.copyFile(licenseFile,path.join(root,'data/licenses/KDHR-Apache-2.0.txt'));
  console.log(`Imported ${entries.length} source-indexed names and ${herbs.length} factual herb records`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args=Object.fromEntries(process.argv.slice(2).reduce((a,v,i,all)=> i%2===0 ? a.concat([[v.replace(/^--/,''),all[i+1]]]):a,[]));
  if (!args.medical || !args.names || !args.license) throw new Error('Usage: --medical snapshot.json --names github-contents.json --license LICENSE');
  await importSources({medicalFile:args.medical,namesFile:args.names,licenseFile:args.license});
}
