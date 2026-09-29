import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {buildDataCoverage, hasCompleteFacts} from '../assets/js/lib/data-coverage.mjs';
import {serializeSharedStrings} from './shared-string-codec.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const DATA_VERSION=7;
const DATA_DATE='2026-09-29';
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const optional=file=>fs.existsSync(path.join(root,file))?read(file):{};
const byName=(a,b)=>a.name<b.name?-1:a.name>b.name?1:0;
const idFor=name=>'open-'+createHash('sha256').update(name).digest('hex').slice(0,12);
export function loadBaseData(base=root){
  const window={};const context=vm.createContext({window,console,encodeURIComponent});
  vm.runInContext(fs.readFileSync(path.join(base,'assets/js/data/food-medicine.generated.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(path.join(base,'assets/js/data/featured.js'),'utf8'),context);
  return {window,context};
}
export function buildExpandedData(){
  const {window}=loadBaseData();
  const facts=read('data/sources/open-herb-facts.json').herbs;
  const photos=optional('data/sources/herb-images.json').images||{};
  const formulaSource=optional('data/sources/formulas-expanded.json');
  const syndromeSource=optional('data/sources/syndromes-expanded.json');
  const sourceFormulas=Array.isArray(formulaSource)?formulaSource:(formulaSource.formulas||formulaSource.entries||[]);
  const sourceSyndromes=Array.isArray(syndromeSource)?syndromeSource:(syndromeSource.syndromes||syndromeSource.entries||[]);
  const foodDirectory=read('data/sources/food-medicine-106.json');
  const foodNotices=new Map((foodDirectory.notices||[]).map(notice=>[notice.id,notice]));
  const foodEntries=Array.isArray(foodDirectory.entries)?foodDirectory.entries:[];
  const foodNames=new Set(foodEntries.flatMap(x=>[x.name,x.name.replace(/（.*$/, '')]));
  const baseNames=new Set(window.HERBS.map(h=>h.name));
  const factByName=new Map(facts.map(h=>[h.name,h]));
  const aliasTargets=new Map();
  for(const h of facts)for(const a of h.aliases||[]){if(!aliasTargets.has(a))aliasTargets.set(a,new Set());aliasTargets.get(a).add(h.name);}
  const resolveFact=name=>factByName.get(name)||((aliasTargets.get(name)?.size===1)?factByName.get([...aliasTargets.get(name)][0]):null);
  const additions=[];const enrichments={};
  function imageFields(name){const p=photos[name];return p ? {image:p.file,imageAlt:p.alt,imageCredit:{author:p.author,license:p.license,url:p.sourceUrl},imageLicenseUrl:p.licenseUrl,placeholder:false}:{};}
  const emptyImageFields={image:null,imageAlt:'',imageCredit:null,imageLicenseUrl:'',placeholder:true};
  function addFact(h){
    if(!h||baseNames.has(h.name)||additions.some(x=>x.name===h.name))return;
    additions.push({...h,id:idFor(h.name),food:foodNames.has(h.name),factStatus:hasCompleteFacts(h)?'complete':'partial',...emptyImageFields,...imageFields(h.name)});
  }
  for(const h of window.HERBS){
    const f=resolveFact(h.name);
    enrichments[h.id]={
      ...(f?{origin:f.origin,sourceRefs:f.sourceRefs,distributionSourceRefs:f.sourceRefs,taxonomy:f.taxonomy,aliases:f.aliases,sourceRecord:f.sourceRecord,factStatus:hasCompleteFacts(f)?'complete':'partial'}:{factStatus:'legacy'}),
      ...emptyImageFields,
      ...imageFields(h.name)
    };
  }
  facts.filter(h=>!baseNames.has(h.name))
    .sort((a,b)=>Number(Boolean(photos[b.name]))-Number(Boolean(photos[a.name]))||byName(a,b))
    .forEach(addFact);
  // Keep official food-directory names discoverable even when the compact
  // nomenclature snapshot has no matching property record. These rows are
  // deliberately marked directory-only: they prove list membership, not qi,
  // wei, meridian, efficacy, taxonomy or a usable image.
  const knownNames=new Set([...baseNames,...facts.map(h=>h.name),...additions.map(h=>h.name)]);
  const directoryOnly=[];
  for(const entry of foodEntries){
    const name=String(entry?.name||'').trim();
    if(!name || knownNames.has(name) || knownNames.has(name.replace(/（.*$/, ''))) continue;
    const notice=foodNotices.get(entry.notice);
    const sourceUrl=notice?.officialUrl||'';
    const row={
      id:idFor('food-directory:'+name), name, pinyin:'', latin:'', qi:'未录入', wei:'未录入', meridian:[],
      cat:'目录条目', eff:'目录收载；性味、归经与功效待补', food:true, source:'foodDirectory',
      sourceRefs:sourceUrl?[sourceUrl]:[], distributionSourceRefs:sourceUrl?[sourceUrl]:[],
      sourceRecord:notice?{title:notice.title,url:sourceUrl,notice:notice.id}:entry.notice||'',
      note:'国家食药物质目录收载；此条仅说明目录身份，不推断药性或日常用法。',
      origin:[], aliases:Array.isArray(entry.aliases)?entry.aliases:[], kind:'directory-only', factStatus:'partial',
      image:null, imageAlt:'', imageCredit:null, imageLicenseUrl:'', placeholder:true
    };
    additions.push(row); directoryOnly.push(row); knownNames.add(name);
  }
  const idByName=new Map(window.HERBS.concat(additions).map(h=>[h.name,h.id]));
  const formulaAliases={'麦门冬':'麦冬','生地':'生地黄','代赭石':'赭石','旋复花':'旋覆花'};
  const formulaMaterials=[];
  const resolveIngredient=(ingredient,formula)=>{
    const name=formulaAliases[ingredient.name]||ingredient.name;
    if(idByName.has(name))return idByName.get(name);
    const fact=resolveFact(name);
    if(fact){addFact(fact);const id=idByName.get(fact.name)||idFor(fact.name);idByName.set(fact.name,id);idByName.set(name,id);return id;}
    const material={id:idFor(name),name,pinyin:'',latin:'',qi:'未录入',wei:'未录入',meridian:[],cat:'原方物料',eff:'原文组成物料；未单独录入药性',food:false,source:'classicalFormula',sourceRefs:formula.sourceRefs||[],note:'保留原方用名，不将未分品种、炮制或非药材物料推断为其他药材。',origin:[],kind:'formula-material',factStatus:'material',placeholder:true,image:null,imageAlt:'',imageCredit:null,imageLicenseUrl:''};
    additions.push(material);formulaMaterials.push(name);idByName.set(name,material.id);return material.id;
  };
  const formulas=sourceFormulas.map(f=>({...f,herbs:f.herbs.map(h=>[resolveIngredient(h,f),h.dose||'原文未标注',h.role||'未标注']),doseBasis:f.doseBasis||'原方文本单位；不换算为现代处方剂量'}));
  const payload={herbs:additions,enrichments,formulas,syndromes:sourceSyndromes};
  const runtimeHerbs=window.HERBS.map(h=>({...h,...enrichments[h.id]})).concat(additions);
  const coverage=buildDataCoverage(runtimeHerbs);
  const code=[
    '/* Generated by scripts/build-expanded-data.mjs; versioned facts and image credits. */',
    '(function(){',
    serializeSharedStrings(payload),
    'const old=new Set(HERBS.map(h=>h.id));',
    'for(const h of HERBS)Object.assign(h,data.enrichments[h.id]||{});',
    'for(const h of data.herbs)if(!old.has(h.id)){HERBS.push(h);old.add(h.id);}',
    'for(const f of data.formulas)if(!FORMULAS.some(x=>x.id===f.id))FORMULAS.push(f);',
    'for(const z of data.syndromes)if(!ZHENGS.some(x=>x.id===z.id))ZHENGS.push(z);',
    "Object.assign(SOURCE_MAP,{openMateria:{label:'公开本草资料',badge:'cha'},classicalFormula:{label:'原方文献',badge:'gray'},foodDirectory:{label:'国家食药物质目录',badge:'celadon'}});",
    'Object.assign(window,{HERBS,FORMULAS,ZHENGS,SOURCE_MAP});',
    'window.HERBAL_DATA_COVERAGE='+JSON.stringify(coverage)+';',
    "window.HERBAL_DATA_VERSION={version:"+DATA_VERSION+",date:'"+DATA_DATE+"',records:HERBS.length,featured:"+coverage.featuredCards+",featuredCards:"+coverage.featuredCards+",directoryOnly:"+coverage.directoryOnlyCount+",formulas:FORMULAS.length,syndromes:ZHENGS.length};",
    '})();',''
  ].join('\n');
  fs.writeFileSync(path.join(root,'assets/js/data/expanded.generated.js'),code);
  const featuredCards=runtimeHerbs.filter(h=>!['formula-material','directory-only'].includes(h.kind));
  const summary={version:DATA_VERSION,date:DATA_DATE,featured:coverage.featuredCards,...coverage,baseCards:window.HERBS.length,additionalCards:additions.filter(h=>!['formula-material','directory-only'].includes(h.kind)).length,directoryOnlyCards:directoryOnly.length,formulas:window.FORMULAS.length+formulas.length,syndromes:window.ZHENGS.length+sourceSyndromes.length,sourcedImages:coverage.imageBacked,missingImages:featuredCards.filter(h=>!h.image).map(h=>h.name),sourcedNewImages:additions.filter(h=>!['formula-material','directory-only'].includes(h.kind)&&h.image).length,missingNewImages:featuredCards.filter(h=>!h.image).map(h=>h.name),formulaMaterials};
  fs.writeFileSync(path.join(root,'reports/data-coverage.json'),JSON.stringify(summary,null,2)+'\n');
  console.log(JSON.stringify({...summary,missingNewImages:summary.missingNewImages.length}));
  return summary;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildExpandedData();
