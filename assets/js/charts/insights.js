/* 兼容 file:// 直开：lib 以普通脚本先行加载并挂全局 */
const lib=window.HerbalInsightLib||{};
const { rankFormulaHerbs, countFormulaRoles, buildMeridianEffectFlow, buildFoodUsageMatrix, buildCooccurrenceMatrix, buildRoleDoseDistribution, buildProvinceDistribution, buildFactCompletenessMatrix } = lib;
const buildDataCoverage=(window.HerbalDataCoverageLib||{}).buildDataCoverage;
const colors=['#B23A2E','#C8A24A','#6B9E8A','#4A6A80'];
const chartMap=new Map(), observers=new Map();
const escHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const knownValue=value=>typeof value==='string'&&value.trim()&&!/^(?:未录入|未分类|暂无|未知)$/.test(value.trim());
const herbs=()=>(window.HERBS||[]).filter(h=>!['formula-material','directory-only'].includes(h.kind)), formulas=()=>window.FORMULAS||[];
const herbNameOf=id=>{
  const match=(window.HERBS||[]).find(item=>item.id===id);
  if(match?.name) return match.name;
  const catalog=(window.HERB_CATALOG||[]).find(entry=>entry.id===id||entry.name===id);
  return catalog?.name||id;
};
const link=(kind,id)=>'<a href="#/'+kind+'?'+(kind==='herb'?'id':'f')+'='+encodeURIComponent(id)+'">'+escHtml((kind==='herb'?(window.HERBS||[]):formulas()).find(item=>item.id===id)?.name||'名称待考')+'</a>';
function disposeInsights(){chartMap.forEach(instance=>instance.dispose());chartMap.clear();observers.forEach(observer=>observer.disconnect());observers.clear();}
function chart(id,hasData=true){
 const el=document.getElementById(id);if(!el)return null;
 chartMap.get(id)?.dispose();observers.get(id)?.disconnect();chartMap.delete(id);observers.delete(id);el.replaceChildren();
 if(!hasData||typeof echarts==='undefined'){el.innerHTML='<p class="chart-empty" role="status">'+(hasData?'图表组件暂未加载，请刷新重试。':'当前资料没有可用于此图的记录，缺失字段未计入统计。')+'</p>';return null;}
 const p=palette(),instance=echarts.init(el),describe=()=>window.HerbalChartManager?.describe(el);instance.on('rendered',describe);instance.setOption({animation:!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,aria:{enabled:true},tooltip:{backgroundColor:p.card,borderColor:p.line,textStyle:{color:p.text}}});describe();chartMap.set(id,instance);
 if(typeof ResizeObserver!=='undefined'){const ro=new ResizeObserver(()=>{if(!instance.isDisposed())instance.resize();});ro.observe(el);observers.set(id,ro);}return instance;
}
function palette(){const s=getComputedStyle(document.body),token=(name,fallback)=>s.getPropertyValue(name).trim()||fallback;return {text:token('--ink','#1D2C25'),muted:token('--ink-2','#56665B'),line:token('--line','#D5DBCF'),card:token('--card','#FBFBF5'),accent:token('--qing-3',colors[2]),series:[token('--cinnabar',colors[0]),token('--phase-earth',colors[1]),token('--qing-3',colors[2]),document.body.classList.contains('night')?'#9AB8C6':colors[3]]};}
function countStyle(count,max,p){const helper=window.HerbalFivePhases,color=helper?.mixColor(p.card,p.accent,count/Math.max(1,max))||p.accent;return {itemStyle:{color},label:{color:helper?.contrastText(color)||p.text}};}
function culturalNote(id,text){const container=document.getElementById(id);if(!container)return;let note=document.querySelector('[data-chart-cultural-note="'+id+'"]');if(!note){note=document.createElement('p');note.className='chart-cultural-note';note.dataset.chartCulturalNote=id;container.insertAdjacentElement('afterend',note);}note.textContent=text;}
function inspect(id,title,body){const el=document.getElementById(id);if(el){el.innerHTML='<h3>'+escHtml(title)+'</h3>'+body;el.classList.add('has-selection');}}
function renderChartSummary(id,title,rows){
 const container=document.getElementById(id);if(!container)return;
 document.querySelector('.chart-summary[data-chart-summary-for="'+id+'"]')?.remove();
 if(!rows?.length)return;
 const details=document.createElement('details');details.className='chart-summary';details.dataset.chartSummaryFor=id;
 const heading=document.createElement('summary');heading.textContent=title;
 const list=document.createElement('ol');rows.slice(0,8).forEach(row=>{const item=document.createElement('li');item.textContent=row;list.append(item);});
 details.append(heading,list);container.insertAdjacentElement('afterend',details);
}
function access(id,label,rows,select){const el=document.getElementById(id);if(!el)return;el.innerHTML='<label>'+escHtml(label)+'<select><option value="">选择一项查看记录</option>'+rows.map((row,i)=>'<option value="'+i+'">'+escHtml(row.label)+'</option>').join('')+'</select></label>';el.querySelector('select').onchange=e=>{if(e.target.value!=='')select(rows[Number(e.target.value)]);};}
function bars(id,rows,select){const p=palette(),c=chart(id,rows.length>0);c?.setOption({tooltip:{trigger:'axis',confine:true},grid:{left:82,right:35,top:14,bottom:28},xAxis:{type:'value',minInterval:1,axisLabel:{color:p.muted},splitLine:{lineStyle:{color:p.line}}},yAxis:{type:'category',data:rows.map(r=>r.name||herbNameOf(r.id)),axisLabel:{color:p.text,fontSize:11}},dataZoom:rows.length>18?[{type:'slider',yAxisIndex:0,right:0,start:Math.max(0,100-1800/rows.length),end:100,width:12}]:[],series:[{type:'bar',data:rows.map(r=>r.count),itemStyle:{color:p.accent},label:{show:true,position:'right',color:p.text}}]});c?.on('click',e=>select(rows[e.dataIndex]));return c;}
function renderFormulaInsights(){
 const p=palette(),rankedTop=rankFormulaHerbs(formulas(),window.HERBS||[]).slice(0,12),ranked=[...rankedTop].reverse();
 bars('formulaFrequencyChart',ranked,r=>{location.hash='#/formula?herb='+encodeURIComponent(r.id);});
 renderChartSummary('formulaFrequencyChart','文字摘要：'+formulas().length+' 首方剂中的高频药材',rankedTop.map(row=>(row.name||row.id)+'：出现于 '+row.count+' 首方剂'));
 const roles=countFormulaRoles(formulas()),roleChart=chart('formulaRolesChart',roles.formulas.length>0);
 roleChart?.setOption({tooltip:{trigger:'axis',confine:true},legend:{textStyle:{color:p.muted}},grid:{left:40,right:18,top:42,bottom:100},dataZoom:[{type:'slider',bottom:4,height:18,start:0,end:Math.min(100,1200/Math.max(1,formulas().length))}],xAxis:{type:'category',data:roles.formulas.map(f=>f.name),axisLabel:{color:p.muted,rotate:45,fontSize:10}},yAxis:{type:'value',minInterval:1,axisLabel:{color:p.muted},splitLine:{lineStyle:{color:p.line}}},series:roles.roles.map((role,i)=>({name:role,type:'bar',stack:'roles',data:roles.formulas.map(f=>f[role]),itemStyle:{color:p.series[i]}}))});
 culturalNote('formulaRolesChart','君、臣、佐、使借用古代秩序语汇描述组方角色。这里读的是收录方剂的明确标注，柱高表示组成条数，不表示疗效、剂量大小或处方建议。');
 renderChartSummary('formulaRolesChart','文字摘要：'+roles.formulas.length+' 首方剂的角色标注',roles.roles.map(role=>role+'药：'+roles.formulas.reduce((sum,formula)=>sum+(formula[role]||0),0)+' 条组成记录'));
 roleChart?.on('click',e=>{location.hash='#/formula?f='+encodeURIComponent(roles.formulas[e.dataIndex].id);});
 const matrix=buildCooccurrenceMatrix(formulas(),window.HERBS||[]);
 const name=id=>matrix.items.find(item=>item.id===id)?.name||id;
 const pairName=cell=>name(cell.a)+(cell.a===cell.b?'':' × '+name(cell.b));
 const showPair=cell=>inspect('cooccurrenceEvidence',pairName(cell),'<p>共同出现于 '+cell.count+' 首方剂；同方重复只计一次。共现不代表配伍推荐。</p><div class="evidence-links">'+cell.formulaIds.map(id=>link('formula',id)).join('')+'</div>');
 const heatmap=chart('formulaCooccurrenceChart',matrix.items.length>0);
 const maxPairCount=Math.max(1,...matrix.cells.map(cell=>cell.count));
 heatmap?.setOption({tooltip:{confine:true,formatter:e=>escHtml(pairName(matrix.cells[e.dataIndex]))+'<br>'+e.value[2]+' / '+formulas().length+' 首样本方剂 · 点击查看'},grid:{left:75,right:16,top:12,bottom:115},xAxis:{type:'category',data:matrix.items.map(r=>r.name||r.id),axisLabel:{color:p.muted,rotate:55,fontSize:10}},yAxis:{type:'category',data:matrix.items.map(r=>r.name||r.id),axisLabel:{color:p.text,fontSize:10}},visualMap:{min:0,max:maxPairCount,orient:'horizontal',left:'center',bottom:0,textStyle:{color:p.muted},inRange:{color:[p.card,p.accent]}},series:[{type:'heatmap',data:matrix.cells.map(cell=>({value:[matrix.items.findIndex(r=>r.id===cell.a),matrix.items.findIndex(r=>r.id===cell.b),cell.count],...countStyle(cell.count,maxPairCount,p)})),label:{show:true,formatter:e=>e.value[2]||''},itemStyle:{borderColor:p.card,borderWidth:1}}]});
 heatmap?.on('click',e=>showPair(matrix.cells[e.dataIndex]));
 const pairs=matrix.cells.filter(c=>c.count&&c.a!==c.b&&c.a.localeCompare(c.b)<0).sort((a,b)=>b.count-a.count);
 renderChartSummary('formulaCooccurrenceChart','文字摘要：高频药材对的同方次数',pairs.map(cell=>pairName(cell)+'：共同出现于 '+cell.count+' 首方剂'));
 access('cooccurrenceAccess','按药材对查看共同方剂',pairs.map(cell=>({label:pairName(cell)+' · '+cell.count+' 方',cell})),r=>showPair(r.cell));if(pairs[0])showPair(pairs[0]);
 const dose=buildRoleDoseDistribution(formulas()),groups=dose.groups.filter(g=>g.box),note=document.getElementById('doseCoverage');
 if(note)note.textContent='纳入 n='+dose.included+' 条明确克数且有角色的记录；排除 '+dose.excluded.unitOrRange+' 条非克数、区间或缺失剂量，'+dose.excluded.unassignedRole+' 条角色未标注。保留原载剂量，不作单位换算或用药建议。';
 const showDose=g=>inspect('doseEvidence',g.role+'药 · n='+g.samples.length,'<p>箱体为第 25–75 百分位，中线为中位数；须线为 1.5 倍四分位距内实测值，散点为离群记录。</p><div class="dose-records">'+g.samples.map(s=>'<div>'+link('formula',s.formulaId)+'<span>'+link('herb',s.herbId)+'</span><b>'+escHtml(s.dose)+'</b></div>').join('')+'</div>');
 const box=chart('formulaDoseChart',dose.included>0);
 box?.setOption({tooltip:{confine:true,formatter:e=>e.seriesType==='scatter'?escHtml(e.data.sample.formulaName)+' · '+e.value[1]+'g':groups[e.dataIndex].role+'药 · n='+groups[e.dataIndex].samples.length+'<br>中位数 '+Number(groups[e.dataIndex].box[2].toFixed(2))+'g'},grid:{left:52,right:20,top:34,bottom:54},xAxis:{type:'category',data:groups.map(g=>g.role+' (n='+g.samples.length+')'),axisLabel:{color:p.text}},yAxis:{type:'value',name:'克（g）',nameTextStyle:{color:p.muted},axisLabel:{color:p.muted},splitLine:{lineStyle:{color:p.line}}},series:[{type:'boxplot',data:groups.map((g,i)=>({value:g.box,itemStyle:{color:p.series[i]+'55',borderColor:p.series[i]}})),boxWidth:[24,65]},{type:'scatter',symbolSize:9,itemStyle:{color:p.series[0]},data:groups.flatMap((g,i)=>g.outliers.map(sample=>({value:[i,sample.value],sample})))}]});
 box?.on('click',e=>showDose(groups[e.seriesType==='scatter'?e.value[0]:e.dataIndex]));
 renderChartSummary('formulaDoseChart','文字摘要：'+dose.included+' 条明确角色与克数记录',groups.map(group=>group.role+'药：n='+group.samples.length+'，中位数 '+Number(group.box[2].toFixed(2))+' 克，离群记录 '+group.outliers.length+' 条'));
 access('doseAccess','按角色查看剂量原记录',groups.map(group=>({label:group.role+'药 · n='+group.samples.length,group})),r=>showDose(r.group));if(groups[0])showDose(groups[0]);
}
function renderProvinceInsight(){
 const data=buildProvinceDistribution(herbs()),note=document.getElementById('provinceCoverage');
 if(note)note.textContent='共 '+data.covered+' 味记有省级分布，'+data.missing+' 味未录入而未计数。一药多省各计一次；这是来源文献的分布记载，不是道地产区认证或产量统计。';
 const show=r=>inspect('provinceEvidence',r.province+' · '+r.count+' 味记录','<p>点击名称查看原始资料与分布字段。</p><div class="evidence-links">'+r.herbIds.map(id=>link('herb',id)).join('')+'</div>');
 bars('provinceDistributionChart',data.provinces.map(r=>({...r,name:r.province})).reverse(),show);
 renderChartSummary('provinceDistributionChart','文字摘要：'+data.covered+' 味有省级分布记录',data.provinces.map(row=>row.province+'：'+row.count+' 味记录'));
 access('provinceAccess','选择省级分布记录',data.provinces.map(row=>({label:row.province+' · '+row.count+' 味',row})),r=>show(r.row));if(data.provinces[0])show(data.provinces[0]);
}
function renderCompletenessInsight(){
 const p=palette(),data=buildFactCompletenessMatrix(herbs(),12),el=document.getElementById('factCompletenessChart');
 const note=document.getElementById('completenessCoverage');
 if(note)note.textContent='覆盖 '+data.total+' 味知识卡；每个色块是该分类中已有记录的数量，点击后按分类筛选。';
 const show=(row,featureIndex=null)=>{
   const title=featureIndex===null?row.category:row.category+' · '+data.features[featureIndex];
   const ids=featureIndex===null?row.ids:row.ids.filter(id=>{const herb=herbs().find(item=>item.id===id);if(!herb)return false;return [Boolean(herb.image),Array.isArray(herb.meridian)&&herb.meridian.length>0,Array.isArray(herb.origin)&&herb.origin.some(knownValue),knownValue(herb.taxonomy),[herb.sourceRefs,herb.distributionSourceRefs].some(refs=>Array.isArray(refs)&&refs.some(ref=>/^https?:\/\//.test(ref)))][featureIndex];});
   inspect('factCompletenessEvidence',title,'<p>'+escHtml(ids.length)+' 味记录已满足该项；空白字段继续保留为空。</p><div class="evidence-links">'+ids.slice(0,48).map(id=>link('herb',id)).join('')+'</div>');
 };
 const c=chart('factCompletenessChart',data.rows.length>0);
 const maxCoverage=Math.max(1,...data.rows.flatMap(row=>row.values));
 c?.setOption({tooltip:{confine:true,formatter:e=>{const value=e.value||[];const row=data.rows[value[1]];const feature=data.features[value[0]];return escHtml(row.category)+' · '+escHtml(feature)+'<br>'+value[2]+' / '+row.total+' 味有记录 · 点击筛选';}},grid:{left:86,right:24,top:12,bottom:54},xAxis:{type:'category',data:data.features,axisLabel:{color:p.muted,fontSize:11}},yAxis:{type:'category',data:data.categories,axisLabel:{color:p.text,fontSize:11}},visualMap:{min:0,max:maxCoverage,orient:'horizontal',left:'center',bottom:2,textStyle:{color:p.muted},inRange:{color:[p.card,p.accent]}},series:[{type:'heatmap',data:data.rows.flatMap((row,rowIndex)=>row.values.map((value,featureIndex)=>({value:[featureIndex,rowIndex,value],...countStyle(value,maxCoverage,p)}))),label:{show:true,formatter:e=>e.value[2]||''},itemStyle:{borderColor:p.card,borderWidth:2}}]});
 c?.on('click',e=>{const row=data.rows[e.value[1]],featureIndex=e.value[0];show(row,featureIndex);location.hash='#/herbs?cat='+encodeURIComponent(row.category);});
 access('factCompletenessAccess','按传统分类查看完整度记录',data.rows.map(row=>({label:row.category+' · '+row.total+' 味',row})),r=>{show(r.row);location.hash='#/herbs?cat='+encodeURIComponent(r.row.category);});
 if(data.rows[0])show(data.rows[0]);
 renderChartSummary('factCompletenessChart','文字摘要：资料字段覆盖情况',data.rows.map(row=>row.category+'：'+row.values.map((value,index)=>data.features[index]+' '+value+'/'+row.total).join('、')));
}
function renderMeridianEffectInsight(){
 const p=palette(),flow=buildMeridianEffectFlow(herbs()),c=chart('meridianEffectChart',flow.links.length>0);
 c?.setOption({tooltip:{confine:true},series:[{type:'sankey',data:flow.nodes,links:flow.links,left:25,right:25,top:15,bottom:15,nodeWidth:13,nodeGap:8,emphasis:{focus:'adjacency'},lineStyle:{color:'gradient',opacity:.36},label:{color:p.text,fontSize:10},itemStyle:{borderColor:p.card,borderWidth:1,color:p.accent}}]});
 culturalNote('meridianEffectChart','归经是传统医药理解药性作用趋向的语言。此图使用全馆藏样本，不随上方类别筛选；连线表示资料中同时记录的归经与功效分类，一味多经可形成多条连线，不是人体解剖图或疗效推断。');
 c?.on('click',e=>{const d=e.data,match=herbs().filter(h=>e.dataType==='edge'?(h.meridian||[]).some(m=>m.replace(/经$/,'')===d.source.replace(/经$/,''))&&h.cat===d.target:h.cat===d.name||(h.meridian||[]).some(m=>m.replace(/经$/,'')===d.name.replace(/经$/,'')));inspect('meridianEvidence',e.dataType==='edge'?d.source+' → '+d.target:d.name,'<div class="evidence-links">'+match.map(h=>link('herb',h.id)).join('')+'</div>');});
 const ranked=[...flow.links].sort((a,b)=>b.value-a.value||a.source.localeCompare(b.source,'zh-CN'));
 renderChartSummary('meridianEffectChart','文字摘要：'+herbs().length+' 味精品卡的归经与资料分类流向',ranked.map(row=>row.source+' → '+row.target+'：'+row.value+' 味药材'));
}
function renderFoodUsageInsight(){
 if(!document.getElementById('foodUsageChart'))return;
 const p=palette(),directory=window.FOODS||[],foods=directory.filter(food=>food.enriched!==false&&knownValue(food.flavor)&&knownValue(food.use||food.tag)),cells=buildFoodUsageMatrix(foods),flavors=[...new Set(cells.map(c=>c.flavor))],uses=[...new Set(cells.map(c=>c.use))],max=Math.max(1,...cells.map(cell=>cell.count));
 chart('foodUsageChart',cells.length>0)?.setOption({tooltip:{confine:true,formatter:e=>{const cell=cells[e.dataIndex],semantic=window.HerbalFivePhases?.flavorMeta(cell.flavor);return escHtml(cell.flavor)+' × '+escHtml(cell.use)+' · '+cell.count+' 种'+(semantic?.phase?'<br>传统对应：'+escHtml(window.HerbalFivePhases.flavorLabel(semantic.flavor)): '<br>保留原载复合性味，不强配五行');}},grid:{left:80,right:18,top:20,bottom:95},xAxis:{type:'category',data:uses,axisLabel:{color:p.muted,rotate:35,fontSize:9}},yAxis:{type:'category',data:flavors,axisLabel:{color:p.muted,fontSize:10}},series:[{type:'heatmap',data:cells.map(cell=>({value:[uses.indexOf(cell.use),flavors.indexOf(cell.flavor),cell.count],...(window.HerbalFivePhases?.flavorStyle(cell.flavor,cell.count,max)||countStyle(cell.count,max,p))})),label:{show:true,formatter:e=>e.value[2]||''},itemStyle:{borderWidth:1}}]});
 let legend=document.getElementById('foodUsageLegend');if(!legend){legend=document.createElement('div');legend.id='foodUsageLegend';legend.className='chart-semantic-legend';document.getElementById('foodUsageChart').insertAdjacentElement('afterend',legend);}window.HerbalFivePhases?.renderFlavorLegend(legend,{note:'目录共 '+directory.length+' 种；此图仅展示 '+foods.length+' 种已有性味与生活用法的记录。一物多用可分别计数。复合性味保留原文、以灰色示意，不强配单一五行；颜色仅帮助读图。'});
 const ranked=[...cells].sort((a,b)=>b.count-a.count||a.flavor.localeCompare(b.flavor,'zh-CN'));
 renderChartSummary('foodUsageChart','文字摘要：'+foods.length+' 种食药物质的性味与用法',ranked.map(row=>row.flavor+' × '+row.use+'：'+row.count+' 种'));
}
let scheduled=0;
function renderCoverageInsight(){
 const data=buildDataCoverage(window.HERBS||[]),p=palette(),total=data.featuredCards;
 const rows=[{name:'完整来源事实',count:data.completeFacts,filter:'complete'},{name:'部分字段记录',count:data.partialFacts,filter:'partial'},{name:'开放图片',count:data.imageBacked,filter:'images'},{name:'逐行来源',count:data.sourceCovered,filter:'sources'}];
 const go=row=>{location.hash='#/herbs?mode=featured&coverage='+row.filter;};
 const c=chart('homeCoverageChart',total>0);
 c?.setOption({tooltip:{trigger:'axis',confine:true,formatter:items=>{const row=rows[items[0].dataIndex];return row.name+'：'+row.count+' / '+total+' 张卡<br>覆盖 '+(row.count/total*100).toFixed(1)+'% · 点击查看记录';}},grid:{left:68,right:30,top:8,bottom:28},xAxis:{type:'value',max:total,minInterval:1,axisLabel:{color:p.muted},splitLine:{lineStyle:{color:p.line}}},yAxis:{type:'category',inverse:true,data:rows.map(r=>r.name),axisLabel:{color:p.text}},series:[{name:'已记录',type:'bar',stack:'coverage',barMaxWidth:22,data:rows.map(r=>r.count),itemStyle:{color:p.accent},label:{show:true,position:'insideRight',color:window.HerbalFivePhases?.contrastText(p.accent)||p.text}},{name:'待补充',type:'bar',stack:'coverage',data:rows.map(r=>total-r.count),itemStyle:{color:p.line}}]});
 c?.on('click',event=>go(rows[event.dataIndex]));
 const note=document.getElementById('homeCoverageNote');if(note)note.textContent='当前 n='+total+' 张知识卡的四类覆盖指标；图片、来源和地区字段可重叠，不相加。空白字段不会被推断。';
 const summary=document.getElementById('homeCoverageSummary');if(summary)summary.textContent='完整来源事实 '+data.completeFacts+' 张 · 部分字段记录 '+data.partialFacts+' 张 · 既有基础卡 '+data.legacyFacts+' 张 · 开放图片 '+data.imageBacked+' 张 · 逐行来源 '+data.sourceCovered+' 张。四类覆盖指标均以 n='+total+' 为分母，既有基础卡为历史分层信息，不与覆盖指标相加。';
 const controls=document.getElementById('homeCoverageControls');if(controls)controls.innerHTML=rows.map(r=>'<a href="#/herbs?mode=featured&coverage='+r.filter+'">'+r.name+' '+r.count+' ↗</a>').join('')+'<a href="#/herbs?mode=featured&coverage=missing-image">图片待补 '+data.placeholder+' ↗</a>';
 renderChartSummary('homeCoverageChart','文字摘要：知识卡资料覆盖情况',rows.map(r=>r.name+'：'+r.count+' / '+total+' 张'));
}
function renderRoute(){
 cancelAnimationFrame(scheduled);disposeInsights();
 scheduled=requestAnimationFrame(()=>{
  const route=document.querySelector('.page.active')?.dataset.route;
  if(!['formula','qiwei','herbs','home','heritage'].includes(route))return;
  const needsChart=()=>{
   if(route==='formula')return new URLSearchParams(location.hash.split('?')[1]||'').get('view')==='stats';
   if(route==='home')return Boolean(document.getElementById('collectionCoverage')?.open);
   if(route==='heritage')return Boolean(document.getElementById('foodUsageChart'));
   return true;
  };
  if(!needsChart())return;
  const expectedHash=location.hash,activeRoute=()=>document.querySelector('.page.active')?.dataset.route;
  const run=()=>{
   if(location.hash!==expectedHash||activeRoute()!==route||!needsChart())return;
   if(route==='formula')renderFormulaInsights();
   if(route==='qiwei')renderMeridianEffectInsight();
   if(route==='herbs'){renderProvinceInsight();renderCompletenessInsight();}
   if(route==='home')renderCoverageInsight();
   if(route==='heritage')renderFoodUsageInsight();
  };
  if(typeof echarts==='undefined'&&typeof window.ensureEcharts==='function'){window.ensureEcharts().then(run).catch(run);}else run();
 });
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderRoute,{once:true});else renderRoute();
 window.addEventListener('herbal:route',renderRoute);window.addEventListener('herbal:theme',renderRoute);window.addEventListener('pagehide',disposeInsights);
 document.addEventListener('toggle',event=>{if(event.target.id==='collectionCoverage')renderRoute();},true);
 window.HerbalInsights={renderFormulaInsights,renderMeridianEffectInsight,renderFoodUsageInsight,renderProvinceInsight,renderCompletenessInsight,renderCoverageInsight,dispose:disposeInsights};window.__HERBAL_DEBUG__=window.__HERBAL_DEBUG__||{};window.__HERBAL_DEBUG__.insightCounts=()=>({charts:chartMap.size,observers:observers.size});
}
