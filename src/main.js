import { relationExplorer } from './relations.js';

const ROOT = './src/data/curated/';
const state = { view: 'home', herbId: 'herb-artemisia-annua', stage: 'specimen', nodeId: 'herb-artemisia-annua', query: '', libraryType: 'all', compareId: '', cabinetFilter: 'all' };
let data = null;

function applyHash() {
  const value = window.location.hash.replace(/^#/, '');
  if (['home', 'trace', 'library'].includes(value)) state.view = value;
}

const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const find = (list, id) => list.find((item) => item.id === id);
const herbs = () => data.herbs.herbs;
const selectedHerb = () => find(herbs(), state.herbId) || herbs()[0];
const anchors = () => data.anchors.anchors;
const sources = () => data.sources.sources;
const sourceList = (ids = []) => ids.map((id) => sources().find((source) => source.id === id)).filter(Boolean);
const firstFormula = (id) => data.formulas.formulas.find((formula) => formula.composition.includes(id));
const firstAnchor = (id, kind) => anchors().find((anchor) => anchor.relatedEntityIds.includes(id) && (!kind || anchor.kind === kind));
const specimenFor = (id) => data.specimens.specimens.find((item) => item.herbId === id);

function specimenLab(item) {
  const specimen = specimenFor(item.id);
  if (!specimen) {
    return `<section class="specimen-lab"><div class="specimen-stage specimen-empty" aria-label="${esc(item.nameZh)}暂未建立结构化标本"><div class="empty-specimen-mark">待补</div><span class="stage-hint">本轮精选目录暂未建模</span></div><div class="specimen-copy"><span class="panel-label">3D SPECIMEN LAB</span><h3>${esc(item.nameZh)}的识别线索</h3><p>这味本草已经进入证据链，但结构化标本仍在补录。先查看右侧身份资料和来源，再回到相似药材辨别器。</p><div class="specimen-boundary">暂不生成默认模型，避免把其他物种的形态误套到当前本草。</div></div></section>`;
  }
  return `<section class="specimen-lab"><div class="specimen-stage" data-specimen-stage tabindex="0" role="img" aria-label="可拖动旋转的${esc(item.nameZh)}结构化标本"><div class="specimen-model shape-${esc(specimen.shape)}" data-specimen-model><span class="model-layer layer-a"></span><span class="model-layer layer-b"></span><span class="model-layer layer-c"></span><span class="model-label">${esc(specimen.label)}</span></div><span class="stage-axis axis-x"></span><span class="stage-axis axis-y"></span><span class="stage-hint">拖动旋转 · 方向键微调</span></div><div class="specimen-copy"><span class="panel-label">3D SPECIMEN LAB</span><h3>${esc(item.nameZh)}的识别线索</h3><p>把平面名称变成可以观察的结构。这个标本是根据公开植物志和药典描述生成的交互模型，不是照片，也不替代专业鉴定。</p><ul>${specimen.cues.map((cue) => `<li>${esc(cue)}</li>`).join('')}</ul><div class="specimen-boundary">${esc(specimen.boundary)}</div></div></section>`;
}

function compareLab() {
  const options = data.comparisons.comparisons;
  const currentMatch = options.find((item) => item.left.id === state.herbId || item.right.id === state.herbId);
  const selected = options.find((item) => item.id === state.compareId) || (!state.compareId ? currentMatch : null);
  const selectOptions = `<option value="" ${selected ? '' : 'selected'}>请选择一组相似药材</option>${options.map((option) => `<option value="${option.id}" ${option.id === selected?.id ? 'selected' : ''}>${esc(option.title)}</option>`).join('')}`;
  const renderSide = (side, active) => `<div class="compare-side ${active ? 'current' : ''}"><div class="compare-silhouette shape-${esc(side.shape)}"><span class="model-layer layer-a"></span><span class="model-layer layer-b"></span></div><span class="compare-tag">${active ? '当前选择' : '对照对象'}</span><h3>${esc(side.nameZh)}</h3><p>${esc(side.latin)}</p><b>${esc(side.part)}</b></div>`;
  const body = selected ? `<div class="compare-grid">${renderSide(selected.left, selected.left.id === state.herbId)}<div class="compare-divider">VS</div>${renderSide(selected.right, selected.right.id === state.herbId)}<div class="compare-differences"><span>三条关键差异</span><ol>${selected.differences.map((difference) => `<li>${esc(difference)}</li>`).join('')}</ol><div class="boundary-box"><span>识别边界</span><p>${esc(selected.boundary)}</p></div><h3>共同来源</h3>${renderSources(selected.sourceIds)}</div></div>` : '<div class="compare-empty"><strong>先选择一组相似药材</strong><p>当前本草暂时没有直接对照组；从下拉菜单选择一组，查看基原、部位和形态差异。</p></div>';
  return `<section class="compare-lab"><div class="compare-heading"><div><span class="panel-label">LOOK-ALIKE CHECK</span><h2>相似药材，差别在哪里？</h2><p>先看形态，再回到基原和药用部位。相似不等于可以替代。</p></div><label class="compare-select">选择一组对照<select data-compare-select>${selectOptions}</select></label></div>${body}</section>`;
}

function chainFor(item) {
  const classic = firstAnchor(item.id, 'classical-text') || {
    id: `anchor-gap-classic-${item.id}`,
    titleZh: '文献锚点待补',
    period: '精选数据待补充',
    kind: 'evidence-gap',
    summary: '当前精选目录没有把这味本草与一个独立的古典文本锚点直接相连。',
    boundary: '这是目录缺口提示，不代表历史上不存在相关记载。',
    sourceIds: item.sourceIds,
    relatedEntityIds: [item.id],
  };
  const formula = firstFormula(item.id) || {
    id: `formula-gap-${item.id}`,
    nameZh: '关系待补证',
    textualOrigin: '方剂目录待扩展',
    composition: [],
    relationLabel: '当前精选目录没有收录包含此本草的方剂组成关系。',
    evidenceStatus: 'catalog-gap',
    boundary: '这是目录缺口提示，不代表历史上不存在相关方剂记录。',
    sourceIds: item.sourceIds,
  };
  const echo = firstAnchor(item.id, 'modern-research-history') || {
    id: `anchor-gap-modern-${item.id}`,
    titleZh: '研究史待补',
    period: '精选数据待补充',
    kind: 'evidence-gap',
    summary: '当前精选目录没有把这味本草与一条现代研究史单独建模。',
    boundary: '这是目录缺口提示，不代表不存在现代研究。',
    sourceIds: item.sourceIds,
    relatedEntityIds: [item.id],
  };
  return [
    { id: item.id, stage: 'specimen', number: '01', label: '识形', title: item.nameZh, meta: item.scientificName, kind: 'herb', payload: item },
    { id: classic.id, stage: 'classic', number: '02', label: '读典', title: classic.titleZh, meta: classic.period, kind: 'anchor', payload: classic },
    { id: formula.id, stage: 'formula', number: '03', label: '看关系', title: formula.nameZh, meta: formula.textualOrigin, kind: 'formula', payload: formula },
    { id: echo.id, stage: 'echo', number: '04', label: '留回响', title: echo.titleZh, meta: echo.period, kind: 'anchor', payload: echo },
  ];
}

function detailFor(node) {
  if (node.kind === 'herb') {
    const item = node.payload;
    return { eyebrow: '植物身份 · 01', title: item.nameZh, subtitle: item.scientificName, lead: item.identitySummary, facts: [['科属', item.family], ['药用部位', item.partUsed], ['证据状态', item.evidenceStatus]], boundary: item.boundary, sourceIds: item.sourceIds, sourceRefs: item.sourceRefs };
  }
  if (node.kind === 'formula') {
    const item = node.payload;
    const names = item.composition.map((id) => find(herbs(), id)?.nameZh).filter(Boolean).join(' · ');
    return { eyebrow: '方剂文本 · 03', title: item.nameZh, subtitle: item.textualOrigin, lead: item.relationLabel, facts: [['组成节点', names], ['证据状态', item.evidenceStatus]], boundary: item.boundary, sourceIds: item.sourceIds, sourceRefs: item.sourceRefs };
  }
  const item = node.payload;
  const isGap = item.kind === 'evidence-gap';
  return { eyebrow: `${isGap ? '目录缺口' : '文化锚点'} · ${node.number}`, title: item.titleZh, subtitle: item.period, lead: item.summary, facts: [['类型', item.kind], ['关联本草', item.relatedEntityIds.map((id) => find(herbs(), id)?.nameZh || id).join(' · ')]], boundary: item.boundary, sourceIds: item.sourceIds, sourceRefs: item.sourceRefs };
}

function renderSources(ids, refs = []) {
  return `<div class="source-stack">${sourceList(ids).map((source) => { const ref = refs.find((entry) => entry.sourceId === source.id); const locator = ref?.locator || source.locator; return `<a class="source-row" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer"><span><b>${esc(source.title)}</b><small>${esc(source.publisher)} · ${esc(locator)}</small></span><span class="source-arrow">↗</span></a>`; }).join('')}</div>`;
}

function relationMap(item) {
  return relationExplorer({
    herbs: herbs(),
    formulas: data.formulas.formulas,
    anchors: anchors(),
    sources: sources(),
    relations: data.relations.relations,
  }, { focusId: item.id, activeRelationId: state.relationFocus, maxRelations: 24 });
}

function header() {
  return `<header class="site-header"><a class="brand" href="#home" data-view="home" aria-label="返回百子柜首页"><span class="brand-seal">一</span><span><strong>本草宇宙</strong><small>HERBAL COSMOS · TRACE</small></span></a><nav class="main-nav" aria-label="主导航"><button class="nav-button ${state.view === 'home' ? 'active' : ''}" data-view="home">百子柜</button><button class="nav-button ${state.view === 'trace' ? 'active' : ''}" data-view="trace">一味档案</button><button class="nav-button ${state.view === 'library' ? 'active' : ''}" data-view="library">拓展资料库</button></nav><span class="header-note">一味之证 / 研究版</span></header>`;
}

const CABINET_FILTERS = [
  ['all', '全部'],
  ['root', '根 · 根茎'],
  ['flower', '花 · 花蕾'],
  ['fruit', '果 · 果皮'],
  ['leaf', '叶 · 地上'],
  ['fungus', '菌核'],
];

function cabinetCategory(item) {
  const text = `${item.partUsed || ''} ${item.nameZh || ''}`;
  if (/菌核/.test(text)) return 'fungus';
  if (/花|花蕾|头状/.test(text)) return 'flower';
  if (/果|果皮/.test(text)) return 'fruit';
  if (/根|根茎|块茎/.test(text)) return 'root';
  return 'leaf';
}

function cabinetGlyph(item) {
  const category = cabinetCategory(item);
  const letter = category === 'root' ? '根' : category === 'flower' ? '花' : category === 'fruit' ? '果' : category === 'fungus' ? '菌' : '叶';
  return `<span class="drawer-glyph glyph-${category}" aria-hidden="true"><i></i><b>${letter}</b></span>`;
}

function cabinetSection() {
  const featured = herbs();
  const filtered = featured.filter((item) => state.cabinetFilter === 'all' || cabinetCategory(item) === state.cabinetFilter);
  const selected = selectedHerb();
  const selectedCategory = cabinetCategory(selected);
  const selectedIndex = featured.findIndex((item) => item.id === selected.id) + 1;
  const filterButtons = CABINET_FILTERS.map(([value, label]) => `<button class="cabinet-filter ${state.cabinetFilter === value ? 'active' : ''}" data-cabinet-filter="${value}" aria-pressed="${state.cabinetFilter === value}">${label}<span>${value === 'all' ? featured.length : featured.filter((item) => cabinetCategory(item) === value).length}</span></button>`).join('');
  const drawers = filtered.map((item) => {
    const index = featured.indexOf(item) + 1;
    const active = item.id === selected.id;
    return `<button class="cabinet-drawer ${active ? 'active' : ''}" data-cabinet-drawer data-herb="${item.id}" style="--drawer-order:${index}" aria-label="打开${esc(item.nameZh)}档案" aria-pressed="${active}"><span class="drawer-number">${String(index).padStart(2, '0')}</span>${cabinetGlyph(item)}<span class="drawer-name">${esc(item.nameZh)}</span><span class="drawer-latin">${esc(item.pinyin)}</span><span class="drawer-handle"><i></i><em>取阅</em></span></button>`;
  }).join('');
  return `<section class="cabinet-hero" id="cabinet" aria-labelledby="cabinet-title"><div class="cabinet-intro"><div><p class="kicker">THE HERBAL CABINET · 01</p><h1 id="cabinet-title">先抽出一味，<br /><em>再读它的来处。</em></h1><p class="cabinet-lead">把十六味精选本草放回一面数字百子柜。拖动不需要模型，点击一格就能抽出它的植物身份、形态线索和证据链。</p></div><div class="cabinet-meta"><span class="cabinet-meta-mark">百</span><div><b>本草柜 · 甲辑</b><small>16 味精品 · 公开来源重检</small></div></div></div><div class="cabinet-toolbar"><div class="cabinet-filters" role="toolbar" aria-label="按药用部位筛选">${filterButtons}</div><span class="cabinet-status"><i></i>当前抽出：<b>${esc(selected.nameZh)}</b></span></div><div class="cabinet-body"><div class="cabinet-rack" aria-label="十六味精选本草抽屉墙"><div class="rack-crown"><span>本草百子柜</span><small>精选条目 · 点击抽屉</small></div><div class="drawer-grid">${drawers || '<p class="cabinet-empty">这一类暂未收录，换一个部位看看。</p>'}</div><div class="rack-foot"><span>一味一证 · 每格都有出处</span><span>01 — ${String(featured.length).padStart(2, '0')}</span></div></div><aside class="cabinet-card" aria-live="polite"><div class="cabinet-card-top"><span>已抽出 · ${String(selectedIndex).padStart(2, '0')}</span><span class="cabinet-card-type">${selectedCategory}</span></div><div class="cabinet-card-glyph">${cabinetGlyph(selected)}</div><p class="cabinet-card-kicker">${esc(selected.pinyin)} · ${esc(selected.family)}</p><h2>${esc(selected.nameZh)}</h2><p class="cabinet-card-latin">${esc(selected.scientificName)}</p><p class="cabinet-card-summary">${esc(selected.identitySummary)}</p><dl class="cabinet-card-facts"><div><dt>药用部位</dt><dd>${esc(selected.partUsed)}</dd></div><div><dt>证据状态</dt><dd>${esc(selected.evidenceStatus)}</dd></div></dl><div class="cabinet-card-actions"><button class="primary-button compact" data-view="trace" data-herb="${selected.id}">打开一味档案 <span>↗</span></button><button class="quiet-button" data-cabinet-reset>回到第一格</button></div><p class="cabinet-card-boundary">${esc(selected.boundary)}</p></aside></div><div class="cabinet-extension"><div><span class="section-index">02 / BEYOND THE CABINET</span><h2>柜里是精选，柜外是完整目录。</h2><p>想继续查找方剂、典籍和来源，进入开放资料库；全部内容都可以回到公开出处。</p></div><button class="text-button" data-view="library">打开拓展资料库 →</button></div></section>`;
}

function home() {
  const chain = chainFor(selectedHerb());
  const featured = herbs().slice(0, 6);
  const relationMap = relationExplorer({ herbs: herbs(), formulas: data.formulas.formulas, anchors: anchors(), sources: sources(), relations: data.relations.relations }, { focusId: selectedHerb().id, activeRelationId: state.relationFocus, maxRelations: 14 });
  return `<main class="home-view">${cabinetSection()}<section class="home-relation" aria-label="本草证据关系星图"><div class="section-heading"><div><span class="section-index">02 / FOLLOW THE EVIDENCE</span><h2>从抽屉，走到一张关系星图</h2></div><button class="text-button" data-view="trace">打开一味档案 →</button></div>${relationMap}</section><section class="hero hero-secondary"><div class="hero-copy"><p class="kicker">EVIDENCE TRACE · 03</p><h2>一味本草，<br /><em>怎样留下证据？</em></h2><p class="hero-lead">从抽屉里的植物身份，到典籍里的名字，再到一张方剂和一段现代研究史。把复杂的知识拆成一条可以亲手追踪的路径。</p><div class="hero-actions"><button class="primary-button" data-view="trace" data-start>进入一味档案 <span>↗</span></button><button class="text-button" data-view="library">打开拓展资料库</button></div><div class="hero-footnote"><span class="status-dot"></span> 公开来源 · 文化与植物学阅读 · 不提供医疗建议</div></div><div class="hero-trace" aria-label="四层证据链预览"><div class="trace-caption"><span>一条证据链</span><span>READ THE TRACE</span></div><div class="mini-chain">${chain.map((node, index) => `<div class="mini-node ${index === 0 ? 'selected' : ''}"><span class="mini-number">${node.number}</span><strong>${esc(node.label)}</strong><b>${esc(node.title)}</b><small>${esc(node.meta)}</small></div>${index < chain.length - 1 ? '<span class="mini-link" aria-hidden="true">→</span>' : ''}`).join('')}</div><div class="trace-baseline"><span>植物实体</span><span>文献记录</span><span>组成关系</span><span>当代回响</span></div></div></section><section class="home-proof"><div><span class="section-index">04 / WHY</span><h2>先认清对象，<br />再谈它的故事。</h2></div><p>本草名称可能指植物、部位、炮制品或历史称呼。追踪台把这些层次拆开，用户每点击一次，都能看到它从哪份资料来、能说明什么、不能说明什么。</p><div class="proof-stats"><div><strong>${herbs().length}</strong><span>味重新检索本草</span></div><div><strong>${data.relations.relations.length}</strong><span>条有来源关系</span></div><div><strong>${sources().length}</strong><span>个公开来源入口</span></div></div></section><section class="featured-strip"><div class="section-heading"><div><span class="section-index">05 / START WITH A SPECIMEN</span><h2>从一株具体的草木开始</h2></div><button class="text-button" data-view="trace">打开完整追踪台 →</button></div><div class="specimen-row">${featured.map((item, index) => `<button class="specimen-chip ${index === 0 ? 'first' : ''}" data-herb="${item.id}" data-view="trace"><span class="chip-mark">${esc(item.nameZh.slice(0, 1))}</span><span><b>${esc(item.nameZh)}</b><small>${esc(item.scientificName)}</small></span><span class="chip-arrow">↗</span></button>`).join('')}</div></section></main>`;
}

function trace() {
  const item = selectedHerb();
  const chain = chainFor(item);
  const node = chain.find((entry) => entry.id === state.nodeId) || chain[0];
  const detail = detailFor(node);
  const evidenceMap = relationMap(item);
  const query = state.query.trim().toLowerCase();
  const list = herbs().filter((entry) => !query || `${entry.nameZh} ${entry.pinyin} ${entry.scientificName}`.toLowerCase().includes(query));
  return `<main class="trace-view"><div class="page-intro"><div><p class="kicker">TRACE WORKBENCH · ${esc(item.nameZh)}</p><h1>追踪一味本草的来处</h1><p>点击中间的四个节点，把“植物—典籍—方剂—回响”拆成可核查的关系。</p></div><div class="intro-actions"><button class="quiet-button" data-view="home">← 返回开始</button><button class="quiet-button" data-compare>相似药材辨别</button><button class="primary-button compact" data-share>生成关系海报</button></div></div><div class="workbench"><aside class="herb-panel"><div class="panel-label"><span>SELECT A SPECIMEN</span><b>${herbs().length} 味</b></div><label class="search-box"><span>⌕</span><input data-herb-search value="${esc(state.query)}" placeholder="搜索本草名称或学名" /></label><div class="herb-list">${list.map((entry) => `<button class="herb-item ${entry.id === item.id ? 'active' : ''}" data-herb="${entry.id}" data-view="trace"><span class="herb-index">${String(herbs().indexOf(entry) + 1).padStart(2, '0')}</span><span><b>${esc(entry.nameZh)}</b><small>${esc(entry.pinyin)} · ${esc(entry.partUsed)}</small></span><span class="herb-dot"></span></button>`).join('') || '<p class="empty-copy">没有找到这味本草。试试输入中文名。</p>'}</div><div class="panel-boundary">精选数据由公开来源重新检索整理。完整资料在资料库中按需加载。</div></aside><section class="chain-panel">${specimenLab(item)}<div class="chain-toolbar"><div><span class="panel-label">EVIDENCE CHAIN</span><h2>${esc(item.nameZh)} <i>${esc(item.scientificName)}</i></h2></div><div class="stage-tabs" role="tablist" aria-label="证据链阶段">${chain.map((entry) => `<button role="tab" aria-selected="${entry.stage === state.stage}" class="stage-tab ${entry.stage === state.stage ? 'active' : ''}" data-stage="${entry.stage}" data-node="${entry.id}"><span>${entry.number}</span>${esc(entry.label)}</button>`).join('')}</div></div><div class="chain-canvas"><div class="chain-line"></div><div class="chain-nodes">${chain.map((entry) => `<button class="chain-node ${entry.id === node.id ? 'active' : ''} ${entry.stage === state.stage ? 'focus' : ''}" data-node="${entry.id}" data-stage="${entry.stage}"><span class="node-number">${entry.number}</span><span class="node-core">${entry.kind === 'herb' ? esc(item.nameZh.slice(0, 1)) : entry.kind === 'formula' ? '方' : '文'}</span><span class="node-label">${esc(entry.label)}</span><strong>${esc(entry.title)}</strong><small>${esc(entry.meta)}</small></button>`).join('')}</div><div class="chain-legend"><span><i class="legend-dot verified"></i>来源直接支持</span><span><i class="legend-dot contextual"></i>文化语境</span><span>点击节点查看证据</span></div></div><div class="chain-note"><span class="note-mark">!</span><p>这条线只表达资料中明确写出的关系。空间距离和节点大小不代表药效、重要性或推荐程度。</p></div>${evidenceMap}</section><aside class="evidence-panel"><div class="evidence-top"><span class="panel-label">EVIDENCE DRAWER</span><span class="evidence-status">${detail.sourceIds.length} 个来源</span></div><div class="evidence-body"><p class="kicker">${esc(detail.eyebrow)}</p><h2>${esc(detail.title)}</h2><p class="evidence-subtitle">${esc(detail.subtitle)}</p><p class="evidence-lead">${esc(detail.lead)}</p><div class="fact-list">${detail.facts.map(([label, value]) => `<div><span>${esc(label)}</span><b>${esc(value)}</b></div>`).join('')}</div><div class="boundary-box"><span>阅读边界</span><p>${esc(detail.boundary)}</p></div><h3>来源入口</h3>${renderSources(detail.sourceIds, detail.sourceRefs || [])}</div></aside></div>${state.compareOpen ? compareLab() : ''}</main>`;
}

function library() {
  const query = state.query.trim().toLowerCase();
  const items = [...herbs().map((item) => ({ type: '本草', title: item.nameZh, meta: item.scientificName, body: item.identitySummary, sourceIds: item.sourceIds })), ...data.formulas.formulas.map((item) => ({ type: '方剂', title: item.nameZh, meta: item.textualOrigin, body: item.relationLabel, sourceIds: item.sourceIds })), ...anchors().map((item) => ({ type: '文化锚点', title: item.titleZh, meta: item.period, body: item.summary, sourceIds: item.sourceIds }))].filter((item) => (state.libraryType === 'all' || item.type === state.libraryType) && (!query || `${item.title} ${item.meta} ${item.body}`.toLowerCase().includes(query)));
  return `<main class="library-view"><div class="page-intro library-intro"><div><p class="kicker">OPEN LIBRARY · SOURCE FIRST</p><h1>资料库</h1><p>完整目录按实体、关系和来源分层。这里可以查找内容，但每一条事实都要回到公开出处。</p></div><button class="quiet-button" data-view="trace">← 回到追踪台</button></div><div class="library-toolbar"><label class="search-box wide"><span>⌕</span><input data-library-search value="${esc(state.query)}" placeholder="搜索本草、方剂、典籍或来源关键词" /></label><div class="filter-tabs">${['all', '本草', '方剂', '文化锚点'].map((value) => `<button class="filter-tab ${state.libraryType === value ? 'active' : ''}" data-library-type="${value}">${value === 'all' ? '全部' : value}</button>`).join('')}</div></div><div class="library-summary"><span>当前结果 <b>${items.length}</b></span><span>数据集 ${esc(data.herbs.datasetId)}</span><span>重新检索于 ${esc(data.herbs.researchedAt)}</span></div><div class="library-grid">${items.map((item) => `<article class="library-item"><div class="library-item-top"><span class="type-tag">${esc(item.type)}</span><span class="item-count">${item.sourceIds.length} 来源</span></div><h2>${esc(item.title)}</h2><p class="library-meta">${esc(item.meta)}</p><p>${esc(item.body)}</p><details><summary>查看来源</summary>${renderSources(item.sourceIds)}</details></article>`).join('') || '<div class="empty-state"><strong>没有匹配项</strong><p>换一个关键词，或清除筛选重新浏览。</p></div>'}</div></main>`;
}

function render() {
  if (!data) return;
  const content = state.view === 'trace' ? trace() : state.view === 'library' ? library() : home();
  document.querySelector('#app').innerHTML = `${header()}${content}<footer class="site-footer"><span>本草宇宙 · 一味之证</span><span>无需账号 · 无遥测 · 资料用于文化与植物学阅读，不构成医疗建议</span><span>数据集 ${esc(data.herbs.datasetId)}</span></footer><dialog class="share-dialog" id="shareDialog"><button class="dialog-close" data-close-dialog aria-label="关闭">×</button><p class="kicker">RELATION POSTER</p><h2>${esc(selectedHerb().nameZh)}的证据链</h2><p>把本次阅读中的四个节点保存为一张可分享的 SVG 海报。</p><div class="poster-preview"><span>${esc(selectedHerb().nameZh)}</span><b>植物 → 典籍 → 方剂 → 回响</b><small>本草宇宙 · ${esc(data.herbs.researchedAt)}</small></div><button class="primary-button" data-download-poster>下载 SVG 海报</button></dialog>`;
}

function posterSvg(item) {
  const nodes = chainFor(item);
  const texts = nodes.map((node, index) => `<text x="${75 + index * 225}" y="190" fill="#151718" font-size="26" font-family="serif">${node.title.replace(/[&<>]/g, '')}</text><text x="${75 + index * 225}" y="220" fill="#7d7469" font-size="14" font-family="sans-serif">${node.label}</text>`).join('');
  const links = nodes.slice(0, -1).map((_, index) => `<path d="M ${125 + index * 225} 150 H ${275 + index * 225}" stroke="#b54a3a" stroke-width="2" stroke-dasharray="4 8"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="420" viewBox="0 0 1000 420"><rect width="1000" height="420" fill="#f5f0e8"/><rect x="34" y="34" width="932" height="352" fill="none" stroke="#c8bfb2"/><text x="80" y="95" fill="#b54a3a" font-size="13" font-family="sans-serif" letter-spacing="3">HERBAL COSMOS · TRACE</text><text x="80" y="140" fill="#151718" font-size="42" font-family="serif">${item.nameZh.replace(/[&<>]/g, '')} 的一条证据链</text>${links}${texts}<text x="80" y="330" fill="#7d7469" font-size="13" font-family="sans-serif">公开来源重新检索 · ${data.herbs.researchedAt} · 仅用于文化与植物学阅读</text></svg>`;
}

function bind() {
  const app = document.querySelector('#app');
  app.addEventListener('click', (event) => {
    const view = event.target.closest('[data-view]');
    const herbButton = event.target.closest('[data-herb]');
    const cabinetDrawer = event.target.closest('[data-cabinet-drawer]');
    const cabinetFilter = event.target.closest('[data-cabinet-filter]');
    const relationNode = event.target.closest('[data-relation-node]');
    const relationEdge = event.target.closest('[data-relation-id]');
    const node = event.target.closest('[data-node]');
    const stage = event.target.closest('[data-stage]');
    const filter = event.target.closest('[data-library-type]');
    if (cabinetDrawer) { state.herbId = cabinetDrawer.dataset.herb; state.nodeId = state.herbId; state.stage = 'specimen'; state.compareId = ''; render(); return; }
    if (cabinetFilter) {
      state.cabinetFilter = cabinetFilter.dataset.cabinetFilter;
      const visible = herbs().filter((entry) => state.cabinetFilter === 'all' || cabinetCategory(entry) === state.cabinetFilter);
      if (visible.length && !visible.some((entry) => entry.id === state.herbId)) {
        state.herbId = visible[0].id;
        state.nodeId = state.herbId;
        state.stage = 'specimen';
      }
      render();
      return;
    }
    if (event.target.closest('[data-cabinet-reset]')) { state.herbId = herbs()[0].id; state.nodeId = state.herbId; state.stage = 'specimen'; state.cabinetFilter = 'all'; render(); return; }
    if (relationNode) {
      const id = relationNode.dataset.relationNode;
      const herb = find(herbs(), id);
      if (herb) {
        state.herbId = herb.id;
        state.nodeId = herb.id;
        state.stage = 'specimen';
      } else {
        const nextChain = chainFor(selectedHerb());
        const chainNode = nextChain.find((entry) => entry.id === id);
        const formula = data.formulas.formulas.find((entry) => entry.id === id && entry.composition.includes(state.herbId));
        if (chainNode) {
          state.nodeId = chainNode.id;
          state.stage = chainNode.stage;
        } else if (formula) {
          state.nodeId = formula.id;
          state.stage = 'formula';
        } else {
          const source = sources().find((entry) => entry.id === id);
          if (source?.url) { window.open(source.url, '_blank', 'noopener,noreferrer'); return; }
        }
      }
      state.view = 'trace';
      state.relationFocus = '';
      render();
      return;
    }
    if (relationEdge) {
      state.relationFocus = relationEdge.dataset.relationId;
      render();
      document.querySelector('[data-relation-explorer]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (view) { state.view = view.dataset.view; if (herbButton) { state.herbId = herbButton.dataset.herb; state.compareId = ''; } if (state.view === 'trace') { state.nodeId = state.herbId; state.stage = 'specimen'; } state.query = ''; if (window.location.hash !== `#${state.view}`) history.pushState({ view: state.view }, '', `#${state.view}`); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (herbButton) { state.herbId = herbButton.dataset.herb; state.compareId = ''; state.view = 'trace'; state.nodeId = state.herbId; state.stage = 'specimen'; render(); return; }
    if (stage) { state.stage = stage.dataset.stage; state.nodeId = stage.dataset.node; render(); return; }
    if (node) { state.nodeId = node.dataset.node; state.stage = node.dataset.stage; render(); return; }
    if (filter) { state.libraryType = filter.dataset.libraryType; render(); return; }
    if (event.target.closest('[data-compare]')) { state.compareOpen = true; render(); document.querySelector('.compare-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (event.target.closest('[data-share]')) { document.querySelector('#shareDialog')?.showModal(); return; }
    if (event.target.closest('[data-close-dialog]')) { document.querySelector('#shareDialog')?.close(); return; }
    if (event.target.closest('[data-download-poster]')) { const blob = new Blob([posterSvg(selectedHerb())], { type: 'image/svg+xml' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `本草关系海报-${selectedHerb().nameZh}.svg`; link.click(); URL.revokeObjectURL(url); return; }
  });
  window.addEventListener('popstate', () => { applyHash(); state.query = ''; state.compareOpen = false; render(); });
  app.addEventListener('change', (event) => { if (event.target.matches('[data-compare-select]')) { state.compareId = event.target.value; state.compareOpen = true; render(); document.querySelector('.compare-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
  app.addEventListener('input', (event) => { if (event.target.matches('[data-herb-search], [data-library-search]')) { state.query = event.target.value; render(); const input = document.querySelector(`[data-${state.view === 'library' ? 'library' : 'herb'}-search]`); input?.focus(); input?.setSelectionRange(state.query.length, state.query.length); } });
  app.addEventListener('pointerdown', (event) => { const stage = event.target.closest('[data-specimen-stage]'); const model = stage?.querySelector('[data-specimen-model]'); if (!stage || !model) return; stage.setPointerCapture?.(event.pointerId); const startX = event.clientX; const startY = event.clientY; const baseX = Number(model.dataset.rx || 0); const baseY = Number(model.dataset.ry || 0); const move = (moveEvent) => { model.dataset.rx = baseX + (moveEvent.clientY - startY) * -0.35; model.dataset.ry = baseY + (moveEvent.clientX - startX) * 0.45; model.style.setProperty('--rx', `${model.dataset.rx}deg`); model.style.setProperty('--ry', `${model.dataset.ry}deg`); }; const up = () => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerup', up); }; stage.addEventListener('pointermove', move); stage.addEventListener('pointerup', up, { once: true }); });
  app.addEventListener('keydown', (event) => {
    const relationTarget = event.target.closest('[data-relation-node], [data-relation-id]');
    if (relationTarget && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      relationTarget.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return;
    }
    const stage = event.target.closest('[data-specimen-stage]');
    const model = stage?.querySelector('[data-specimen-model]');
    if (!stage || !model || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const rx = Number(model.dataset.rx || -12) + (event.key === 'ArrowUp' ? -8 : event.key === 'ArrowDown' ? 8 : 0);
    const ry = Number(model.dataset.ry || -22) + (event.key === 'ArrowLeft' ? -10 : event.key === 'ArrowRight' ? 10 : 0);
    model.dataset.rx = rx;
    model.dataset.ry = ry;
    model.style.setProperty('--rx', `${rx}deg`);
    model.style.setProperty('--ry', `${ry}deg`);
  });
}

async function boot() {
  applyHash();
  const files = ['sources.json', 'herbs.json', 'formulas.json', 'cultural-anchors.json', 'relations.json', 'specimens.json', 'comparisons.json'];
  const values = await Promise.all(files.map((file) => fetch(`${ROOT}${file}`).then((response) => { if (!response.ok) throw new Error(`${file}: ${response.status}`); return response.json(); })));
  data = { sources: values[0], herbs: values[1], formulas: values[2], anchors: values[3], relations: values[4], specimens: values[5], comparisons: values[6] };
  render();
  bind();
}

boot().catch((error) => { document.querySelector('#app').innerHTML = `<main class="error-screen"><span class="loading-mark">!</span><h1>资料暂时无法打开</h1><p>${esc(error.message)}。请检查网络或重新加载页面。</p><button class="primary-button" onclick="location.reload()">重新加载</button></main>`; });
