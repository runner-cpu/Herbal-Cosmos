/* 兼容 file:// 直开：lib 以普通脚本先行加载并挂全局 */
const lib=window.HerbalInsightLib||{};
const { rankFormulaHerbs, countFormulaRoles, buildMeridianEffectFlow, buildFoodUsageMatrix, buildCooccurrenceMatrix, buildRoleDoseDistribution, buildProvinceDistribution, buildFactCompletenessMatrix } = lib;
const buildDataCoverage=(window.HerbalDataCoverageLib||{}).buildDataCoverage;
const colors=['#B23A2E','#C8A24A','#6B9E8A','#4A6A80'];
const chartMap=new Map(), observers=new Map();
const escHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const knownValue=value=>typeof value==='string'&&value.trim()&&!/^(?:未录入|未分类|暂无|未知)$/.test(value.trim());
const herbs=()=>(window.HERBS||[]).filter(h=>h.kind!=='formula-material'), formulas=()=>window.FORMULAS||[];
const herbNameOf=id=>{
  const match=(window.HERBS||[]).find(item=>item.id===id);
  if(match?.name) return match.name;
  const catalog=(window.HERB_CATALOG||[]).find(entry=>entry.id===id||entry.name===id);
  return catalog?.name||id;
};
const link=(kind,id)=>'<a href="#/'+kind+'?'+(kind==='herb'?'id':'f')+'='+encodeURIComponent(id)+'">'+escHtml((kind==='herb'?herbs():formulas()).find(item=>item.id===id)?.name||id)+'</a>';
function disposeInsights(){chartMap.forEach(instance=>instance.dispose());chartMap.clear();observers.forEach(observer=>observer.disconnect());observers.clear();}
function chart(id,hasData=true){
 const el=document.getElementById(id);if(!el)return null;
 chartMap.get(id)?.dispose();observers.get(id)?.disconnect();chartMap.delete(id);observers.delete(id);el.replaceChildren();
 if(!hasData||typeof echarts==='undefined'){el.innerHTML='<p class="chart-empty" role="status">'+(hasData?'图表组件暂未加载，请刷新重试。':'当前资料没有可用于此图的记录，缺失字段未计入统计。')+'</p>';return null;}
 const instance=echarts.init(el),describe=()=>window.HerbalChartManager?.describe(el);instance.on('rendered',describe);instance.setOption({animation:!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,aria:{enabled:true}});describe();chartMap.set(id,instance);
 if(typeof ResizeObserver!=='undefined'){const ro=new ResizeObserver(()=>{if(!instance.isDisposed())instance.resize();});ro.observe(el);observers.set(id,ro);}return instance;
}
function palette(){const s=getComputedStyle(document.body);return {text:s.getPropertyValue('--ink').trim(),muted:s.getPropertyValue('--ink-2').trim(),line:s.getPropertyValue('--line').trim(),card:s.getPropertyValue('--card').trim()};}
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
function bars(id,rows,select){const p=palette(),c=chart(id,rows.length>0);c?.setOption({tooltip:{trigger:'axis',confine:true},grid:{left:82,right:35,top:14,bottom:28},xAxis:{type:'value',minInterval:1,axisLabel:{color:p.muted},splitLine:{lineStyle:{color:p.line}}},yAxis:{type:'category',data:rows.map(r=>r.name||herbNameOf(r.id)),axisLabel:{color:p.text,fontSize:11}},dataZoom:rows.length>18?[{type:'slider',yAxisIndex:0,right:0,start:Math.max(0,100-1800/rows.length),end:100,width:12}]:[],series:[{type:'bar',data:rows.map(r=>r.count),itemStyle:{color:colors[2]},label:{show:true,position:'right',color:p.text}}]});c?.on('click',e=>select(rows[e.dataIndex]));return c;}
function renderFormulaInsights(){
 const p=palette(),rankedTop=rankFormulaHerbs(formulas(),herbs()).slice(0,12),ranked=[...rankedTop].reverse();
 bars('formulaFrequencyChart',ranked,r=>{location.hash='#/formula?herb='+encodeURIComponent(r.id);});
 renderChartSummary('formulaFrequencyChart','文字摘要：'+formulas().length+' 首方剂中的高频药材',rankedTop.map(row=>(row.name||row.id)+'：出现于 '+row.count+' 首方剂'));
 const roles=countFormulaRoles(formulas()),roleChart=chart('formulaRolesChart',roles.formulas.length>0);
 roleChart?.setOption({tooltip:{trigger:'axis',confine:true},legend:{textStyle:{color:p.muted}},grid:{left:40,right:18,top:42,bottom:100},dataZoom:[{type:'slider',bottom:4,height:18,start:0,end:Math.min(100,1200/Math.max(1,formulas().length))}],xAxis:{type:'category',data:roles.formulas.map(f=>f.name),axisLabel:{color:p.muted,rotate:45,fontSize:10}},yAxis:{type:'value',minInterval:1,axisLabel:{color:p.muted},splitLine:{lineStyle:{color:p.line}}},series:roles.roles.map((role,i)=>({name:role,type:'bar',stack:'roles',data:roles.formulas.map(f=>f[role]),itemStyle:{color:colors[i]}}))});
 renderChartSummary('formulaRolesChart','文字摘要：'+roles.formulas.length+' 首方剂的角色标注',roles.roles.map(role=>role+'药：'+roles.formulas.reduce((sum,formula)=>sum+(formula[role]||0),0)+' 条组成记录'));
 roleChart?.on('click',e=>{location.hash='#/formula?f='+encodeURIComponent(roles.formulas[e.dataIndex].id);});
 const matrix=buildCooccurrenceMatrix(formulas(),herbs());
 const name=id=>matrix.items.find(item=>item.id===id)?.name||id;
 const pairName=cell=>name(cell.a)+(cell.a===cell.b?'':' × '+name(cell.b));
 const showPair=cell=>inspect('cooccurrenceEvidence',pairName(cell),'<p>共同出现于 '+cell.count+' 首方剂；同方重复只计一次。共现不代表配伍推荐。</p><div class="evidence-links">'+cell.formulaIds.map(id=>link('formula',id)).join('')+'</div>');
 const heatmap=chart('formulaCooccurrenceChart',matrix.items.length>0);
 heatmap?.setOption({tooltip:{confine:true,formatter:e=>escHtml(pairName(matrix.cells[e.dataIndex]))+'<br>'+e.value[2]+' 首方剂 · 点击查看'},grid:{left:75,right:16,top:12,bottom:115},xAxis:{type:'category',data:matrix.items.map(r=>r.name||r.id),axisLabel:{color:p.muted,rotate:55,fontSize:10}},yAxis:{type:'category',data:matrix.items.map(r=>r.name||r.id),axisLabel:{color:p.text,fontSize:10}},visualMap:{min:0,max:Math.max(1,...matrix.cells.map(c=>c.count)),orient:'horizontal',left:'center',bottom:0,textStyle:{color:p.muted},inRange:{color:[p.card,'#9AB9A8','#316952']}},series:[{type:'heatmap',data:matrix.cells.map(c=>[matrix.items.findIndex(r=>r.id===c.a),matrix.items.findIndex(r=>r.id===c.b),c.count]),label:{show:true,color:p.text,formatter:e=>e.value[2]||''},itemStyle:{borderColor:p.card,borderWidth:1}}]});
 heatmap?.on('click',e=>showPair(matrix.cells[e.dataIndex]));
 const pairs=matrix.cells.filter(c=>c.count&&c.a!==c.b&&c.a.localeCompare(c.b)<0).sort((a,b)=>b.count-a.count);
 renderChartSummary('formulaCooccurrenceChart','文字摘要：高频药材对的同方次数',pairs.map(cell=>pairName(cell)+'：共同出现于 '+cell.count+' 首方剂'));
 access('cooccurrenceAccess','按药材对查看共同方剂',pairs.map(cell=>({label:pairName(cell)+' · '+cell.count+' 方',cell})),r=>showPair(r.cell));if(pairs[0])showPair(pairs[0]);
 const dose=buildRoleDoseDistribution(formulas()),groups=dose.groups.filter(g=>g.box),note=document.getElementById('doseCoverage');
 if(note)note.textContent='纳入 n='+dose.included+' 条明确克数且有角色的记录；排除 '+dose.excluded.unitOrRange+' 条非克数、区间或缺失剂量，'+dose.excluded.unassignedRole+' 条角色未标注。保留原载剂量，不作单位换算或用药建议。';
 const showDose=g=>inspect('doseEvidence',g.role+'药 · n='+g.samples.length,'<p>箱体为第 25–75 百分位，中线为中位数；须线为 1.5 倍四分位距内实测值，散点为离群记录。</p><div class="dose-records">'+g.samples.map(s=>'<div>'+link('formula',s.formulaId)+'<span>'+link('herb',s.herbId)+'</span><b>'+escHtml(s.dose)+'</b></div>').join('')+'</div>');
 const box=chart('formulaDoseChart',dose.included>0);
 box?.setOption({tooltip:{confine:true,formatter:e=>e.seriesType==='scatter'?escHtml(e.data.sample.formulaName)+' · '+e.value[1]+'g':groups[e.dataIndex].role+'药 · n='+groups[e.dataIndex].samples.length+'<br>中位数 '+Number(groups[e.dataIndex].box[2].toFixed(2))+'g'},grid:{left:52,right:20,top:34,bottom:54},xAxis:{type:'category',data:groups.map(g=>g.role+' (n='+g.samples.length+')'),axisLabel:{color:p.text}},yAxis:{type:'value',name:'克（g）',nameTextStyle:{color:p.muted},axisLabel:{color:p.muted},splitLine:{lineStyle:{color:p.line}}},series:[{type:'boxplot',data:groups.map((g,i)=>({value:g.box,itemStyle:{color:colors[i]+'55',borderColor:colors[i]}})),boxWidth:[24,65]},{type:'scatter',symbolSize:9,itemStyle:{color:colors[0]},data:groups.flatMap((g,i)=>g.outliers.map(sample=>({value:[i,sample.value],sample})))}]});
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
 c?.setOption({tooltip:{confine:true,formatter:e=>{const value=e.value||[];const row=data.rows[e.data[1]];const feature=data.features[e.data[0]];return escHtml(row.category)+' · '+escHtml(feature)+'<br>'+value[2]+' / '+row.total+' 味有记录 · 点击筛选';}},grid:{left:86,right:24,top:12,bottom:54},xAxis:{type:'category',data:data.features,axisLabel:{color:p.muted,fontSize:11}},yAxis:{type:'category',data:data.categories,axisLabel:{color:p.text,fontSize:11}},visualMap:{min:0,max:Math.max(1,...data.rows.flatMap(row=>row.values)),orient:'horizontal',left:'center',bottom:2,textStyle:{color:p.muted},inRange:{color:[p.card,'#B7D0BE','#3C7862']}},series:[{type:'heatmap',data:data.rows.flatMap((row,rowIndex)=>row.values.map((value,featureIndex)=>[featureIndex,rowIndex,value])),label:{show:true,color:p.text,formatter:e=>e.value[2]||''},itemStyle:{borderColor:p.card,borderWidth:2}}]});
 c?.on('click',e=>{const row=data.rows[e.value[1]],featureIndex=e.value[0];show(row,featureIndex);location.hash='#/herbs?cat='+encodeURIComponent(row.category);});
 access('factCompletenessAccess','按传统分类查看完整度记录',data.rows.map(row=>({label:row.category+' · '+row.total+' 味',row})),r=>{show(r.row);location.hash='#/herbs?cat='+encodeURIComponent(r.row.category);});
 if(data.rows[0])show(data.rows[0]);
 renderChartSummary('factCompletenessChart','文字摘要：资料字段覆盖情况',data.rows.map(row=>row.category+'：'+row.values.map((value,index)=>data.features[index]+' '+value+'/'+row.total).join('、')));
}
function renderMeridianEffectInsight(){
 const p=palette(),flow=buildMeridianEffectFlow(herbs()),c=chart('meridianEffectChart',flow.links.length>0);
 c?.setOption({tooltip:{confine:true},series:[{type:'sankey',data:flow.nodes,links:flow.links,left:25,right:25,top:15,bottom:15,nodeWidth:13,nodeGap:8,emphasis:{focus:'adjacency'},lineStyle:{color:'gradient',opacity:.36},label:{color:p.text,fontSize:10},itemStyle:{borderColor:p.card,borderWidth:1,color:colors[2]}}]});
 c?.on('click',e=>{const d=e.data,match=herbs().filter(h=>e.dataType==='edge'?(h.meridian||[]).some(m=>m.replace(/经$/,'')===d.source.replace(/经$/,''))&&h.cat===d.target:h.cat===d.name||(h.meridian||[]).some(m=>m.replace(/经$/,'')===d.name.replace(/经$/,'')));inspect('meridianEvidence',e.dataType==='edge'?d.source+' → '+d.target:d.name,'<div class="evidence-links">'+match.map(h=>link('herb',h.id)).join('')+'</div>');});
 const ranked=[...flow.links].sort((a,b)=>b.value-a.value||a.source.localeCompare(b.source,'zh-CN'));
 renderChartSummary('meridianEffectChart','文字摘要：'+herbs().length+' 味精品卡的归经与资料分类流向',ranked.map(row=>row.source+' → '+row.target+'：'+row.value+' 味药材'));
}
function renderFoodUsageInsight(){
 const p=palette(),foods=window.FOODS||[],cells=buildFoodUsageMatrix(foods),flavors=[...new Set(cells.map(c=>c.flavor))],uses=[...new Set(cells.map(c=>c.use))];
 chart('foodUsageChart',cells.length>0)?.setOption({tooltip:{confine:true,formatter:e=>escHtml(flavors[e.value[1]])+' × '+escHtml(uses[e.value[0]])+' · '+e.value[2]+' 种'},grid:{left:80,right:30,top:20,bottom:70},xAxis:{type:'category',data:uses,axisLabel:{color:p.muted,rotate:35,fontSize:9}},yAxis:{type:'category',data:flavors,axisLabel:{color:p.muted,fontSize:9}},visualMap:{min:0,max:Math.max(1,...cells.map(c=>c.count)),orient:'horizontal',left:'center',bottom:4,inRange:{color:[p.card,colors[1],colors[0]]},textStyle:{color:p.muted}},series:[{type:'heatmap',data:cells.map(c=>[uses.indexOf(c.use),flavors.indexOf(c.flavor),c.count]),label:{show:true,color:p.text},itemStyle:{borderColor:p.card,borderWidth:2}}]});
 const ranked=[...cells].sort((a,b)=>b.count-a.count||a.flavor.localeCompare(b.flavor,'zh-CN'));
 renderChartSummary('foodUsageChart','文字摘要：'+foods.length+' 种食药物质的性味与用法',ranked.map(row=>row.flavor+' × '+row.use+'：'+row.count+' 种'));
}
let scheduled=0;
function renderCoverageInsight(){
 const data=buildDataCoverage(window.HERBS||[]),p=palette(),total=data.featuredCards;
 const rows=[{name:'完整来源事实',count:data.completeFacts,filter:'complete'},{name:'部分字段记录',count:data.partialFacts,filter:'partial'},{name:'开放图片',count:data.imageBacked,filter:'images'},{name:'逐行来源',count:data.sourceCovered,filter:'sources'}];
 const go=row=>{location.hash='#/herbs?mode=featured&coverage='+row.filter;};
 const c=chart('homeCoverageChart',total>0);
 c?.setOption({tooltip:{trigger:'axis',confine:true,formatter:items=>{const row=rows[items[0].dataIndex];return row.name+'：'+row.count+' / '+total+' 张卡<br>覆盖 '+(row.count/total*100).toFixed(1)+'% · 点击查看记录';}},grid:{left:68,right:30,top:8,bottom:28},xAxis:{type:'value',max:total,minInterval:1,axisLabel:{color:p.muted},splitLine:{lineStyle:{color:p.line}}},yAxis:{type:'category',inverse:true,data:rows.map(r=>r.name),axisLabel:{color:p.text}},series:[{name:'已记录',type:'bar',stack:'coverage',barMaxWidth:22,data:rows.map(r=>r.count),itemStyle:{color:colors[2]},label:{show:true,position:'insideRight',color:'#132D22'}},{name:'待补充',type:'bar',stack:'coverage',data:rows.map(r=>total-r.count),itemStyle:{color:p.line}}]});
 c?.on('click',event=>go(rows[event.dataIndex]));
 const note=document.getElementById('homeCoverageNote');if(note)note.textContent='当前 '+total+' 张知识卡按完整、部分与既有基础卡分层；图片、来源和地区字段可重叠，不相加。空白字段不会被推断。';
 const summary=document.getElementById('homeCoverageSummary');if(summary)summary.textContent='完整来源事实 '+data.completeFacts+' 张，部分字段记录 '+data.partialFacts+' 张，既有基础卡 '+data.legacyFacts+' 张；开放图片 '+data.imageBacked+' 张，逐行来源 '+data.sourceCovered+' 张。';
 const controls=document.getElementById('homeCoverageControls');if(controls)controls.innerHTML=rows.map(r=>'<a href="#/herbs?mode=featured&coverage='+r.filter+'">'+r.name+' '+r.count+' ↗</a>').join('')+'<a href="#/herbs?mode=featured&coverage=missing-image">图片待补 '+data.placeholder+' ↗</a>';
 renderChartSummary('homeCoverageChart','文字摘要：知识卡资料覆盖情况',rows.map(r=>r.name+'：'+r.count+' / '+total+' 张'));
}
function renderRoute(){cancelAnimationFrame(scheduled);disposeInsights();scheduled=requestAnimationFrame(()=>{const route=document.querySelector('.page.active')?.dataset.route;if(route==='formula'&&!document.getElementById('formulaNetworkView')?.hidden)renderFormulaInsights();if(route==='qiwei')renderMeridianEffectInsight();if(route==='herbs'){renderProvinceInsight();renderCompletenessInsight();}if(route==='home'){renderFoodUsageInsight();renderCoverageInsight();}});}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderRoute,{once:true});else renderRoute();
 window.addEventListener('herbal:route',renderRoute);window.addEventListener('herbal:theme',renderRoute);window.addEventListener('pagehide',disposeInsights);
 window.HerbalInsights={renderFormulaInsights,renderMeridianEffectInsight,renderFoodUsageInsight,renderProvinceInsight,renderCompletenessInsight,dispose:disposeInsights};window.__HERBAL_DEBUG__=window.__HERBAL_DEBUG__||{};window.__HERBAL_DEBUG__.insightCounts=()=>({charts:chartMap.size,observers:observers.size});
}
