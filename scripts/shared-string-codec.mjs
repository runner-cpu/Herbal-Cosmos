/** Emit JSON-equivalent JavaScript literals with repeated long strings shared. */
export function serializeSharedStrings(payload) {
  const counts=new Map();
  const visit=value=>{
    if(typeof value==='string' && value.length>40)counts.set(value,(counts.get(value)||0)+1);
    else if(Array.isArray(value))value.forEach(visit);
    else if(value && typeof value==='object')Object.values(value).forEach(visit);
  };
  visit(payload);
  const strings=[...counts].filter(([,count])=>count>1).map(([value])=>value);
  const ids=new Map(strings.map((value,index)=>[value,index]));
  const encode=value=>{
    if(typeof value==='string' && ids.has(value))return 'sharedStrings['+ids.get(value)+']';
    if(Array.isArray(value))return '['+value.map(encode).join(',')+']';
    if(value && typeof value==='object')return '{'+Object.entries(value).map(([key,item])=>JSON.stringify(key)+':'+encode(item)).join(',')+'}';
    return JSON.stringify(value);
  };
  return 'const sharedStrings='+JSON.stringify(strings)+';\nconst data='+encode(payload)+';';
}
