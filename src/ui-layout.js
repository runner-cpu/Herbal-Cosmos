/* World layout for 本草宇宙 · 百子万象.
 * Kept separate from the evidence renderer so the discovery surfaces can
 * evolve without coupling them to trace data.  All views are intentionally
 * data-driven: adding a herb to a habitat immediately adds one drawer.
 */

import { icon } from './icons.js?v=redesign-v1-20261020-1';

const HABITATS = [
  { id: 'forest', name: '山林根境', short: '山林', note: '根茎、树皮与深林药香', tint: '#a97852', glyph: 'root' },
  { id: 'meadow', name: '草甸原野', short: '草甸', note: '叶片、全草与风中茎脉', tint: '#79956c', glyph: 'leaf' },
  { id: 'flower', name: '花野芳香', short: '花野', note: '花蕾、花冠与芳香挥发', tint: '#b58b93', glyph: 'flower' },
  { id: 'fruit', name: '果实种籽', short: '果实', note: '果皮、种仁与成熟信号', tint: '#c58e50', glyph: 'fruit' },
  { id: 'wetland', name: '水泽湿地', short: '水泽', note: '水生、湿地与清润根茎', tint: '#638e92', glyph: 'water' },
  { id: 'fungus', name: '菌木阴翳', short: '菌木', note: '菌核、木本与阴翳生态', tint: '#75677d', glyph: 'fungus' },
];

const HABITAT_ALIASES = {
  forest: ['山林根境', '山林', 'forest', 'mountain', 'shanlin'],
  meadow: ['草甸原野', '草甸', 'meadow', 'grassland', 'caodian'],
  flower: ['花野芳香', '花野', 'flower', 'aromatic', 'huaye'],
  fruit: ['果实种籽', '果实', 'fruit', 'seed', 'guoshi'],
  wetland: ['水泽湿地', '水泽', 'wetland', 'water', 'shuize'],
  fungus: ['菌木阴翳', '菌木', 'fungus', 'shade', 'junmu'],
};

const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

export function habitatDefs() { return HABITATS; }

export function habitatFor(item = {}) {
  const raw = String(item.habitat || item.habitatLabel || item.ecology || '').toLowerCase();
  const explicit = HABITATS.find((habitat) => HABITAT_ALIASES[habitat.id].some((alias) => raw === alias.toLowerCase() || raw.includes(alias.toLowerCase())));
  if (explicit) return explicit;
  const part = `${item.partUsed || ''} ${item.nameZh || ''}`;
  if (/菌|灵芝|茯苓|木/.test(part)) return HABITATS[5];
  if (/花|芳|蕾/.test(part)) return HABITATS[2];
  if (/果|籽|仁|皮/.test(part)) return HABITATS[3];
  if (/水|泽|藕|荷|泽泻/.test(part)) return HABITATS[4];
  if (/叶|全草|薄荷|艾/.test(part)) return HABITATS[1];
  return HABITATS[0];
}

function glyph(habitat) {
  return `<span class="habitat-glyph habitat-glyph-${esc(habitat.id)}" style="--habitat-tint:${esc(habitat.tint)}" aria-hidden="true">${icon(habitat.glyph)}</span>`;
}

function countFor(data, habitatId) {
  return data.herbs.herbs.filter((item) => habitatFor(item).id === habitatId).length;
}

export function renderCosmosHeader(state = {}) {
  const active = state.view || 'home';
  const links = [
    ['home', '宇宙首页'],
    ['cabinet', '百子柜'],
    ['planet', '粒子星球'],
    ['trace', '一味档案'],
    ['library', '资料库'],
    ['curation', '项目说明'],
  ];
  return `<header class="cosmos-header site-header"><a class="cosmos-brand brand" href="#home" data-view="home" aria-label="回到本草宇宙首页"><span class="cosmos-mark" aria-hidden="true">${icon('seal')}</span><span><strong>本草宇宙 · 百子万象</strong><small>HERBAL COSMOS · FIELD ATLAS</small></span></a><nav class="cosmos-nav main-nav" aria-label="主导航">${links.map(([id, label]) => `<button class="nav-button ${active === id ? 'active' : ''}" data-view="${id}"${active === id ? ' aria-current="page"' : ''}>${label}</button>`).join('')}</nav><span class="cosmos-header-note header-note">一味一星 · 一柜一境</span></header>`;
}

function floatingParticles() {
  return Array.from({ length: 22 }, (_, index) => `<i class="cosmos-particle particle-${index + 1}" aria-hidden="true"></i>`).join('');
}

export function renderCosmosHome(data) {
  const total = data.herbs.herbs.length;
  const habitatCount = HABITATS.filter((habitat) => countFor(data, habitat.id) > 0).length;
  const sourceCount = data.sources?.sources?.length || 0;
  return `<main class="cosmos-home" aria-labelledby="cosmos-home-title"><section class="cosmos-landing"><div class="cosmos-noise" aria-hidden="true"></div><div class="cosmos-orbit orbit-a" aria-hidden="true"></div><div class="cosmos-orbit orbit-b" aria-hidden="true"></div><div class="cosmos-particles" aria-hidden="true">${floatingParticles()}</div><div class="cosmos-landing-copy"><p class="kicker">A LIVING HERBAL ATLAS · 2026</p><h1 id="cosmos-home-title">本草宇宙<br /><em>百子万象</em></h1><p class="cosmos-lead">把六类生境、千年名字和今天仍在生长的 ${total} 味草木，放进一座可以亲手探索的宇宙。</p><div class="cosmos-stats" aria-label="本草宇宙目录规模"><span><b>${total}</b> 味已入星</span><span><b>${habitatCount || 6}</b> 类主生境</span><span><b>${sourceCount}</b> 个公开来源</span></div></div><div class="cosmos-entries" aria-label="选择探索入口"><button class="cosmos-entry entry-cabinet" data-view="cabinet"><span class="entry-index">01 / DAY SIDE</span><span class="entry-visual entry-visual-cabinet" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="entry-copy"><strong>百子柜</strong><small>按生境抽出一味本草</small></span><span class="entry-arrow">↗</span></button><button class="cosmos-entry entry-planet" data-view="planet"><span class="entry-index">02 / NIGHT SIDE</span><span class="entry-visual entry-visual-planet" aria-hidden="true"><i></i><i></i><i></i></span><span class="entry-copy"><strong>粒子星球</strong><small>旋转、放大，寻找一味星光</small></span><span class="entry-arrow">↗</span></button></div><p class="cosmos-scroll-cue"><span></span> 选择一扇入口，开始漫游</p></section><section class="cosmos-manifesto"><div><span class="section-index">THE WORLD IN TWO MOVEMENTS</span><h2>昼间读生境，<br /><em>夜间读关系。</em></h2></div><p>百子柜把本草放回它们生长的地方；粒子星球把它们之间的线索汇成一颗可旋转的星球。两个入口各自有完整舞台，共同组成一张能继续扩展的本草地图。</p><button class="text-button" data-view="library">去资料库看全量目录 →</button></section>${storyAnchors(data)}<section class="cosmos-route-map" aria-labelledby="cosmos-route-title"><div class="cosmos-route-heading"><span class="section-index">A MAP OF THE EXPERIENCE</span><h2 id="cosmos-route-title">四个入口，四种读法。</h2><p>首页负责告诉你从哪里开始；进入之后，每个页面只解决一个清晰的问题。</p></div><div class="cosmos-route-grid"><button class="cosmos-route-card route-card-cabinet" data-view="cabinet"><span class="route-card-index">01</span><strong>百子柜</strong><p>按山林、草甸、花野等生境，把本草放回它们生长的地方。</p><small>找一味 · 抽一格</small><i>↗</i></button><button class="cosmos-route-card route-card-planet" data-view="planet"><span class="route-card-index">02</span><strong>粒子星球</strong><p>让 ${total} 味本草成为一颗可旋转的星球，在全量目录里寻找关系。</p><small>看全量 · 找星光</small><i>↗</i></button><button class="cosmos-route-card route-card-trace" data-view="trace"><span class="route-card-index">03</span><strong>一味档案</strong><p>从植物身份走到典籍、方剂和研究史，把一条证据链读完整。</p><small>读来处 · 看边界</small><i>↗</i></button><button class="cosmos-route-card route-card-library" data-view="library"><span class="route-card-index">04</span><strong>资料库</strong><p>按名称、生境、形态和深度筛选全部数据，回到公开来源。</p><small>查资料 · 可追溯</small><i>↗</i></button></div></section></main>`;
}

/**
 * Three sourced facts that place the herbals in a wider story: what the
 * tradition became outside the book. Every line links to the public record
 * that states it; nothing here asserts efficacy.
 */
function storyAnchors(data) {
  const source = (id) => data?.sources?.sources?.find((entry) => entry.id === id);
  const nobel = source('S005');
  const gangmu = source('S011');
  const icd = source('S014');
  const link = (entry, label) => (entry ? `<a href="${esc(entry.url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>` : '');
  return `<section class="cosmos-story" aria-labelledby="cosmos-story-title"><div class="cosmos-story-heading"><span class="section-index">BEYOND THE BOOK</span><h2 id="cosmos-story-title">这部草木志，<br /><em>后来走到了哪里。</em></h2><p>三条公开记录，把本草放回它真实发生过的历史与当代语境。每条都可点开原始来源核对。</p></div><ul class="cosmos-story-list"><li><span class="story-year">1596</span><div><b>《本草纲目》刊行</b><p>李时珍汇辑前代本草与地方物产，成书于明代万历年间；此后数百年间被反复翻刻、引述与考订，成为本草知识接续书写的关键节点。</p>${link(gangmu, '原文索引')}</div></li><li><span class="story-year">2015</span><div><b>青蒿素与诺贝尔奖</b><p>屠呦呦因青蒿素研究获诺贝尔生理学或医学奖；诺奖事实页把这条线索追溯到传统文献中的青蒿记载。植物、提取物与药物需要分开理解。</p>${link(nobel, '诺奖官方事实页')}</div></li><li><span class="story-year">ICD-11</span><div><b>传统医学进入国际分类</b><p>世界卫生组织在 ICD-11 中设置传统医学章节，供成员国可选使用与双重编码；WHO 同时说明，该章节不评判、也不背书任何传统医学实践的有效性。</p>${link(icd, 'WHO 官方说明')}</div></li></ul><p class="cosmos-story-note">以上为公开记录，用于文化阅读，不构成医疗建议。关于《本草纲目》只陈述刊行与流传，未引用任何未经核实的世界遗产名录主张。</p></section>`;
}

function morphologies(items) {
  const values = new Map();
  items.forEach((item) => {
    const morphology = shapeLabel(item);
    values.set(morphology, (values.get(morphology) || 0) + 1);
  });
  return [...values.entries()].sort((a, b) => b[1] - a[1]);
}

function shapeLabel(item = {}) {
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const excluded = new Set([item.habitatLabel, '深度条目', '拓展目录', '精选条目', '目录条目']);
  return tags.find((tag) => tag && !excluded.has(tag)) || item.form || item.partUsed || '形态待补';
}

function herbImage(data, item, className = '') {
  const image = data?.images?.images?.find((entry) => entry.herbId === item?.id && entry.status === 'ready');
  if (!image) return `<span class="drawer-image drawer-image-missing" aria-hidden="true">${icon('image')}</span>`;
  const size = image.width && image.height ? ` width="${image.width}" height="${image.height}"` : '';
  return `<span class="drawer-image ${className}" data-image-open="${esc(item.id)}"><img src="${esc(image.path)}" alt="${esc(item.nameZh)}植物照片"${size} loading="lazy" decoding="async" /></span>`;
}

function drawer(data, item, index, selected) {
  const habitat = habitatFor(item);
  const tags = Array.isArray(item.tags) ? item.tags.slice(0, 2) : [];
  return `<button class="habitat-drawer ${selected ? 'is-selected' : ''}" data-cabinet-drawer data-herb="${esc(item.id)}" aria-pressed="${selected}" aria-label="${selected ? '已抽出' : '抽出'}${esc(item.nameZh)}档案"><span class="drawer-cavity" aria-hidden="true"></span><span class="drawer-side-depth" aria-hidden="true"></span><span class="drawer-index">${String(index + 1).padStart(2, '0')}</span>${herbImage(data, item)}${glyph(habitat)}<span class="drawer-copy"><strong>${esc(item.nameZh)}</strong><small>${esc(item.pinyin || item.scientificName || '')}</small></span><span class="drawer-tags">${tags.map((tag) => `<em>${esc(tag)}</em>`).join('')}</span><span class="drawer-pull" aria-hidden="true"><i></i><small>${selected ? '已抽出' : '抽出'}</small></span></button>`;
}

export function renderHabitatCabinet(data, state = {}) {
  const herbs = data.herbs.herbs;
  const activeId = state.cabinetHabitat || 'forest';
  const activeHabitat = HABITATS.find((habitat) => habitat.id === activeId) || HABITATS[0];
  const habitatItems = herbs.filter((item) => habitatFor(item).id === activeHabitat.id);
  const activeMorph = state.cabinetMorphology || 'all';
  const visible = habitatItems.filter((item) => activeMorph === 'all' || shapeLabel(item).includes(activeMorph));
  // A drawer is open only after the reader pulls one. Deriving the selection
  // from the first visible drawer made the cabinet look permanently clicked on
  // load and left 青蒿 hanging open before anyone touched the wall.
  const picked = Boolean(state.cabinetPicked);
  const selected = picked ? visible.find((item) => item.id === state.herbId) || null : null;
  const morphs = morphologies(habitatItems);
  const habitatButtons = HABITATS.map((habitat) => `<button class="habitat-zone ${habitat.id === activeHabitat.id ? 'is-active' : ''}" data-cabinet-habitat="${habitat.id}" aria-pressed="${habitat.id === activeHabitat.id}"><span class="zone-number">${String(HABITATS.indexOf(habitat) + 1).padStart(2, '0')}</span>${glyph(habitat)}<span><strong>${esc(habitat.name)}</strong><small>${esc(habitat.note)}</small></span><b>${countFor(data, habitat.id)}</b></button>`).join('');
  const morphologyButtons = [['all', '全部形态', habitatItems.length], ...morphs.map(([label, count]) => [label, label, count])].map(([value, label, count]) => `<button class="morphology-tab ${activeMorph === value ? 'is-active' : ''}" data-cabinet-morphology="${esc(value)}" aria-pressed="${activeMorph === value}">${esc(label)} <b>${count}</b></button>`).join('');
  const selectedHabitat = selected ? habitatFor(selected) : activeHabitat;
  const selectedShape = selected ? shapeLabel(selected) : '';
  const comparison = selected ? (data.comparisons?.comparisons || []).find((entry) => entry.left?.id === selected.id || entry.right?.id === selected.id) : null;
  return `<main class="cabinet-page" aria-labelledby="cabinet-page-title"><div class="cabinet-page-intro"><div><p class="kicker">THE DAY SIDE · HABITAT CABINET</p><h1 id="cabinet-page-title">一面百子柜，<br /><em>六种生境。</em></h1><p>先按本草生长的地方进入，再以形态子类收拢视线。每一味只归入一个主柜，标签记录它的部位、形态与文化线索。</p></div><div class="cabinet-index">${icon('cabinet')}<small>HABITAT<br />INDEX</small></div></div><div class="cabinet-console"><section class="cabinet-wall" aria-label="六类生境百子柜"><div class="habitat-zones">${habitatButtons}</div><div class="cabinet-stage"><div class="cabinet-stage-header"><div><span class="section-index">${String(HABITATS.indexOf(activeHabitat) + 1).padStart(2, '0')} / ${esc(activeHabitat.short)}</span><h2>${esc(activeHabitat.name)}</h2><p>${esc(activeHabitat.note)} · ${habitatItems.length} 味入柜</p></div><div class="cabinet-stage-key"><i></i><span>点击或向左抽出一格</span></div></div><div class="morphology-tabs" role="toolbar" aria-label="按形态子类筛选">${morphologyButtons}</div><div class="drawer-shelf">${visible.length ? visible.map((item, index) => drawer(data, item, index, item.id === selected?.id)).join('') : '<p class="cabinet-empty">这一类形态还在补录，换一枚标签继续探索。</p>'}</div><div class="shelf-foot"><span>主生境唯一归属 · 标签可叠加</span><span>${visible.length} / ${habitatItems.length} 可见</span></div></div></section><aside class="cabinet-reading ${selected ? '' : 'cabinet-reading-idle'}">${selected ? `<div class="reading-kicker"><span>DRAWER OPEN</span><b>${String(herbs.indexOf(selected) + 1).padStart(3, '0')}</b></div>${herbImage(data, selected, 'reading-image')}<div class="reading-mark">${glyph(selectedHabitat)}</div><p class="reading-habitat">${esc(selectedHabitat.name)} · ${esc(selectedShape)}</p><h2>${esc(selected.nameZh)}</h2><p class="reading-latin">${esc(selected.scientificName || '')}</p><p class="reading-summary">${esc(selected.identitySummary || selected.summary || '这味本草的深度档案正在补录。')}</p><dl>${[['药用部位', selected.partUsed || '待补'], ['数据状态', selected.catalogStatus || selected.evidenceStatus || '精选'], ['标签', Array.isArray(selected.tags) ? selected.tags.join(' · ') : '形态 · 生境']].map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><div class="reading-actions"><button class="primary-button compact" data-view="trace" data-herb="${esc(selected.id)}">打开一味档案 <span>↗</span></button>${comparison ? `<button class="compare-link" data-compare-herb="${esc(selected.id)}">相似药材辨别 <span>${esc(comparison.title)} ↗</span></button>` : ''}<button class="quiet-button" data-cabinet-reset>重置视线</button></div><p class="reading-boundary">${esc(selected.boundary || '资料用于文化与植物学阅读，不构成医疗建议。')}</p><p class="sr-only" role="status">已抽出${esc(selected.nameZh)}，${esc(selectedHabitat.name)}，${esc(selectedShape)}</p>` : `<div class="reading-idle-mark">${icon('cabinet')}</div><p class="kicker">CABINET CLOSED</p><h2>还没有抽出抽屉。</h2><p>从左边选一处生境，再从柜格里抽出一味本草。右侧会同步显示它的部位、标签和阅读边界。</p><ol><li>生境决定这一柜收哪一类草木</li><li>形态标签把整柜收拢到几格</li><li>抽出的那一格才会亮起并打开档案</li></ol>`}</aside></div><div class="cabinet-page-footer"><span>本草宇宙 · 百子万象</span><span>从一处生境，进入一味证据</span><button class="text-button" data-view="planet">夜间去粒子星球 →</button></div></main>`;
}
