import fs from 'node:fs';
import path from 'node:path';
import { buildAuthority, classifyCandidate } from '../assets/js/lib/catalog-rules.mjs';

export function loadCatalogSources(base) {
  const dir=path.join(base,'data/sources');
  const read=name=>JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
  const optional=name=>fs.existsSync(path.join(dir,name))?read(name):{};
  const manifest=read('source-manifest.json');
  const pharma=read('pharmacopoeia-2020-materials.json');
  const aliasSource=read('classic-aliases.json');
  const variants=read('character-variants.json');
  const index=optional('open-name-index.json');
  const facts=optional('open-herb-facts.json');
  const raw=read('raw-candidates.json');
  const records=[...(index.entries||[]),...(facts.herbs||[]).map((h,i)=>({name:h.name,sourceRefs:['tcmkg:row-'+(i+1)]}))];
  const aliases={...aliasSource.aliases};
  const canonicalFacts=new Set((facts.herbs||[]).map(h=>h.name));
  const targets=new Map();
  for(const h of facts.herbs||[])for(const a of h.aliases||[]){
    if(canonicalFacts.has(a))continue;
    if(!targets.has(a))targets.set(a,new Set());
    targets.get(a).add(h.name);
  }
  for(const [alias,choices] of targets)if(choices.size===1)aliases[alias]=[...choices][0];
  const authority=buildAuthority({canonicalNames:pharma.canonicalNames,documentedNames:records.map(x=>x.name),aliases,variants:variants.variants});
  authority.sourceRefs=new Map();
  const remember=(name,refs=[])=>{const current=authority.sourceRefs.get(name)||[];authority.sourceRefs.set(name,[...new Set(current.concat(refs))].sort());};
  for(const entry of pharma.entries)remember(entry.canonicalName,entry.sourceRefs);
  for(const entry of records){const c=classifyCandidate(entry.name,authority);if(c.status==='approved')remember(c.canonicalName,entry.sourceRefs);}
  for(const [alias,target] of Object.entries(aliases)){
    const h=(facts.herbs||[]).find(h=>h.name===target);
    if(h)remember(target,['tcmkg:row-'+((facts.herbs||[]).indexOf(h)+1)]);
  }
  const candidates=[...pharma.entries.map(x=>({raw:x.canonicalName,sourceRefs:x.sourceRefs})),...records.map(x=>({raw:x.name,sourceRefs:x.sourceRefs})),...raw.candidates];
  return {manifest,authority,candidates,index,facts};
}
