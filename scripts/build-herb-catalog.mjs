import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sharedStrings = path.join(root, '.tmp-herb-map-unzip', 'xl', 'sharedStrings.xml');
const classicalDir = path.join(root, '.tmp-classics');
const output = path.join(root, 'data', 'herb-catalog.js');

const decodeXml = value => value
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&#10;|&#xA;/gi, '\n')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

const textFromXml = value => decodeXml(value.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

const excluded = /(?:丸|散|汤|膏|丹|片|胶囊|注射液|颗粒|口服液|滴丸|栓|冲剂|疗法|治疗|穴位|取穴|针刺|针灸|推拿|熏洗|静脉|滴注|加减|方见|可选|选用|用药|服用|水煎|煎服|冲服|外敷|贴敷|茶饮|保健|复方|中成药|成药|胶|酒剂|酊|露|油|霜|乳膏|软膏|贴膏|注射|粉针|糖浆|合剂|口服|药液|制剂|维生素|片剂|颗粒剂)/;
const dose = /(?:\d+(?:\.\d+)?\s*(?:克|g|毫克|mg|两|钱|枚|片|粒|分)|[（(][^）)]*[）)])/gi;

function cleanName(raw) {
  let name = raw.replace(/\uFEFF/g, '').replace(/\s+/g, '').replace(dose, '');
  name = name.replace(/[，。；：:,.、/\\+＝=“”‘’"'·…]/g, '');
  name = name.replace(/^(?:生|炙|制|炒|焦|酒|盐|醋|蜜|麸|煅|煨|炮|姜|米|清|蒸|烫|煎|水飞|净|去皮|去心|去芦|去核)+/, '');
  name = name.replace(/(?:等|各|为|加|减|配伍|用于|主治|治疗)$/g, '');
  if (!name || excluded.test(name)) return '';
  if (!/^[\u3400-\u9fff]{2,8}$/.test(name)) return '';
  if (/^(?:药材|中药|中草药|植物|动物|矿物|食品|饮片|本品|药物|药品)$/.test(name)) return '';
  return name;
}

const names = new Map();
function add(name, source, note) {
  const cleaned = cleanName(name);
  if (!cleaned) return;
  if (!names.has(cleaned)) names.set(cleaned, { name: cleaned, source, note });
}

if (fs.existsSync(sharedStrings)) {
  const xml = fs.readFileSync(sharedStrings, 'utf8');
  for (const match of xml.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
    add(textFromXml(match[1]), 'lin-haust/TCM-Prescription-Recommendation', '来自药材编号对应表的名称索引，未在本项目补齐四气、五味、归经与功效字段。');
  }
}

if (fs.existsSync(classicalDir)) {
  for (const file of fs.readdirSync(classicalDir)) {
    if (!file.endsWith('.txt')) continue;
    const source = file.includes('神农') ? 'yasenstar/Chinese_Medicine · 神农本草经' : 'yasenstar/Chinese_Medicine · 本草部类文本';
    const lines = fs.readFileSync(path.join(classicalDir, file), 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const value = line.trim();
      if (!value || /^(?:上|中|下).{0,3}$/.test(value)) continue;
      add(value, source, '来自开源古典本草文本的名称索引，现代药材对应关系仍需逐条核校。');
    }
  }
}

const items = [...names.values()]
  .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  .map((item, index) => ({
    id: `catalog-${String(index + 1).padStart(5, '0')}`,
    name: item.name,
    source: item.source,
    status: 'catalog-only',
    note: item.note
  }));

const banner = `/* Generated from open-source name indexes. Do not treat catalog-only entries as complete clinical records. */\n`;
fs.writeFileSync(output, `${banner}window.HERB_CATALOG = ${JSON.stringify(items, null, 2)};\n`, 'utf8');
console.log(`Generated ${items.length} catalog entries at ${output}`);
