import { rankFormulaHerbs, countFormulaRoles, buildMeridianEffectFlow, buildFoodUsageMatrix } from '../lib/insight-aggregates.mjs';

const colors = ['#B23A2E', '#C8A24A', '#6B9E8A', '#4A6A80'];
const chartMap = new Map();

function chart(id) {
  const element = document.getElementById(id);
  if (!element || typeof echarts === 'undefined') return null;
  chartMap.get(id)?.dispose?.();
  const instance = echarts.init(element);
  chartMap.set(id, instance);
  return instance;
}
function palette() {
  const style = getComputedStyle(document.body);
  return { text: style.getPropertyValue('--ink').trim(), muted: style.getPropertyValue('--ink-2').trim(), line: style.getPropertyValue('--line').trim(), card: style.getPropertyValue('--card').trim() };
}

export function renderFormulaInsights() {
  const formulas = window.FORMULAS || [];
  const herbs = window.HERBS || [];
  const p = palette();
  const ranked = rankFormulaHerbs(formulas, herbs).slice(0, 12).reverse();
  const frequency = chart('formulaFrequencyChart');
  frequency?.setOption({ tooltip:{trigger:'axis',confine:true}, grid:{left:72,right:28,top:15,bottom:28}, xAxis:{type:'value',axisLabel:{color:p.muted},splitLine:{lineStyle:{color:p.line}}}, yAxis:{type:'category',data:ranked.map(item=>item.name||item.id),axisLabel:{color:p.text}}, series:[{type:'bar',data:ranked.map(item=>item.count),itemStyle:{color:colors[1],borderRadius:[0,5,5,0]},label:{show:true,position:'right',color:p.text}}] });
  const counted = countFormulaRoles(formulas);
  const roles = chart('formulaRolesChart');
  roles?.setOption({ tooltip:{trigger:'axis',axisPointer:{type:'shadow'},confine:true}, legend:{top:0,textStyle:{color:p.muted}}, grid:{left:70,right:18,top:42,bottom:90}, xAxis:{type:'category',data:counted.formulas.map(item=>item.name),axisLabel:{color:p.muted,rotate:42,fontSize:9}}, yAxis:{type:'value',axisLabel:{color:p.muted},splitLine:{lineStyle:{color:p.line}}}, series:counted.roles.map((role,index)=>({name:role,type:'bar',stack:'roles',data:counted.formulas.map(item=>item[role]),itemStyle:{color:colors[index]}})) });
}

export function renderMeridianEffectInsight() {
  const p = palette();
  const flow = buildMeridianEffectFlow(window.HERBS || []);
  const instance = chart('meridianEffectChart');
  instance?.setOption({ tooltip:{trigger:'item',confine:true}, series:[{type:'sankey',data:flow.nodes,links:flow.links,left:25,right:25,top:15,bottom:15,nodeWidth:13,nodeGap:8,emphasis:{focus:'adjacency'},lineStyle:{color:'gradient',opacity:.36},label:{color:p.text,fontSize:10},itemStyle:{borderColor:p.card,borderWidth:1,color:colors[2]}}] });
}

export function renderFoodUsageInsight() {
  const p = palette();
  const cells = buildFoodUsageMatrix(window.FOODS || []);
  const flavors = [...new Set(cells.map(cell=>cell.flavor))];
  const uses = [...new Set(cells.map(cell=>cell.use))];
  const values = cells.map(cell=>[uses.indexOf(cell.use),flavors.indexOf(cell.flavor),cell.count]);
  const instance = chart('foodUsageChart');
  instance?.setOption({ tooltip:{position:'top',formatter:item=>flavors[item.value[1]]+' × '+uses[item.value[0]]+'<br><b>'+item.value[2]+'</b> 种'}, grid:{left:80,right:30,top:20,bottom:70}, xAxis:{type:'category',data:uses,axisLabel:{color:p.muted,rotate:35,fontSize:9},splitArea:{show:true}}, yAxis:{type:'category',data:flavors,axisLabel:{color:p.muted,fontSize:9},splitArea:{show:true}}, visualMap:{min:0,max:Math.max(1,...cells.map(cell=>cell.count)),calculable:false,orient:'horizontal',left:'center',bottom:4,inRange:{color:['#EFE7D6','#C8A24A','#B23A2E']},textStyle:{color:p.muted}}, series:[{type:'heatmap',data:values,label:{show:true,color:p.text},itemStyle:{borderColor:p.card,borderWidth:2}}] });
}

function renderRoute() {
  const route = location.hash.replace(/^#\/?/, '').split('?')[0] || 'home';
  requestAnimationFrame(() => {
    if (route === 'formula') renderFormulaInsights();
    if (route === 'qiwei') renderMeridianEffectInsight();
    if (route === 'food') renderFoodUsageInsight();
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderRoute, { once:true }); else renderRoute();
  window.addEventListener('hashchange', renderRoute);
  window.addEventListener('herbal:theme', renderRoute);
  window.HerbalInsights = { renderFormulaInsights, renderMeridianEffectInsight, renderFoodUsageInsight };
}
