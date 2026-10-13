import { relationExplorer } from './relations.js';
import { renderCosmosHeader, renderCosmosHome, renderHabitatCabinet, habitatFor } from './ui-layout.js?v=interactions-v1-20261013';
import { particlePlanetMarkup, mountParticlePlanet } from './planet.js?v=interactions-v1-20261013';

const ROOT = './src/data/curated/';
// Keep the catalog cache key independent from the application shell. GitHub Pages
// can retain a previously fetched JSON response even after the JS bundle updates.
const DATA_VERSION = 'interactions-v1-20261013';
const state = {
  view: 'home',
  herbId: 'herb-artemisia-annua',
  stage: 'specimen',
  nodeId: 'herb-artemisia-annua',
  query: '',
  libraryType: 'all',
  libraryHabitat: 'all',
  libraryDepth: 'all',
  compareId: '',
  compareOpen: false,
  cabinetFilter: 'all',
  cabinetHabitat: 'forest',
  cabinetMorphology: 'all',
  imageQuizOpen: false,
  imageQuizId: '',
  imageQuizOptions: [],
  imageQuizAnswered: false,
  imageQuizSelected: '',
  imageQuizScore: 0,
};
let data = null;
let disposePlanet = null;

function applyHash() {
  const value = window.location.hash.replace(/^#/, '');
  if (['home', 'cabinet', 'planet', 'trace', 'library'].includes(value)) state.view = value;
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
const imageFor = (item) => item?.image || data?.images?.images?.find((entry) => entry.herbId === item?.id && entry.status === 'ready');
const imageTarget = (id) => find(herbs(), id) || data?.comparisons?.comparisons?.flatMap((comparison) => [comparison.left, comparison.right]).find((side) => side?.id === id);
const herbImage = (item, className = '', loading = 'lazy') => {
  const image = imageFor(item);
  if (!image) return `<div class="herb-image herb-image-missing ${className}" aria-label="${esc(item?.nameZh || '本草')}图片待补"><span>本</span></div>`;
  return `<figure class="herb-image ${className}" data-image-open="${esc(item.id)}" tabindex="0" role="button" aria-label="放大查看${esc(item.nameZh)}照片"><img src="${esc(image.path)}" alt="${esc(item.nameZh)}植物照片" loading="${loading}" decoding="async" /><figcaption>${esc(image.creator || image.dataset || 'GBIF 公开观测')} · 点击放大</figcaption></figure>`;
};

function imageLightboxCard(item) {
  const image = imageFor(item);
  if (!image) return `<div class="image-lightbox-card"><button class="dialog-close" data-image-close aria-label="关闭图片">×</button><div class="image-lightbox-empty"><span>本</span><p>这味本草暂时没有可用图片。</p></div></div>`;
  const sourceLink = image.sourceUrl || image.occurrenceUrl;
  return `<div class="image-lightbox-card"><button class="dialog-close" data-image-close aria-label="关闭图片">×</button><div class="image-lightbox-visual"><img class="image-lightbox-image" src="${esc(image.path)}" alt="${esc(item.nameZh)}植物照片大图" /><p class="image-lightbox-caption">${esc(image.creator || image.dataset || '公开植物观测')} · ${esc(image.license || '许可信息待补')}</p></div><aside class="image-lightbox-meta"><p class="kicker">FIELD IMAGE · SOURCE CARD</p><h2>${esc(item.nameZh)}</h2><p class="image-lightbox-latin">${esc(item.scientificName || '')}</p><dl><div><dt>拍摄/上传</dt><dd>${esc(image.creator || image.rightsHolder || '未标注')}</dd></div><div><dt>数据集</dt><dd>${esc(image.dataset || '公开植物观测')}</dd></div><div><dt>许可</dt><dd>${esc(image.license || '页面未标注许可')}</dd></div></dl><div class="image-lightbox-links">${sourceLink ? `<a href="${esc(sourceLink)}" target="_blank" rel="noopener noreferrer">查看原始照片 ↗</a>` : ''}${image.occurrenceUrl ? `<a href="${esc(image.occurrenceUrl)}" target="_blank" rel="noopener noreferrer">查看观测记录 ↗</a>` : ''}</div><p class="image-lightbox-boundary">照片用于形态初识与资料阅读，不替代专业鉴定；来源与许可信息随公开记录保留。</p></aside></div>`;
}

function specimenLab(item) {
  const specimen = specimenFor(item.id);
  if (!specimen) {
    return `<section class="specimen-lab"><div class="specimen-stage specimen-empty" aria-label="${esc(item.nameZh)}植物照片">${herbImage(item, 'specimen-photo', 'eager')}<span class="stage-hint">公开植物观测 · 可用于形态初识</span></div><div class="specimen-copy"><span class="panel-label">FIELD IMAGE · 识形照片</span><h3>${esc(item.nameZh)}的识别线索</h3><p>先用植物照片建立形态直觉，再结合基原、部位和公开来源核对身份。照片用于初步识别，不替代专业鉴定。</p><div class="specimen-boundary">当前条目暂无结构化交互标本，已保留公开观测图片作为视觉入口。</div></div></section>`;
  }
  return `<section class="specimen-lab"><div class="specimen-stage" data-specimen-stage tabindex="0" role="img" aria-label="可拖动旋转的${esc(item.nameZh)}结构化标本"><div class="specimen-model shape-${esc(specimen.shape)}" data-specimen-model><span class="model-layer layer-a"></span><span class="model-layer layer-b"></span><span class="model-layer layer-c"></span><span class="model-label">${esc(specimen.label)}</span></div><span class="stage-axis axis-x"></span><span class="stage-axis axis-y"></span><span class="stage-hint">拖动旋转 · 方向键微调</span></div><div class="specimen-copy"><span class="panel-label">3D SPECIMEN LAB · FIELD IMAGE</span>${herbImage(item, 'specimen-inline-image')}<h3>${esc(item.nameZh)}的识别线索</h3><p>把平面名称变成可以观察的结构。这个标本是根据公开植物志和药典描述生成的交互模型，旁侧照片来自公开植物观测，用于交叉核对形态。</p><ul>${specimen.cues.map((cue) => `<li>${esc(cue)}</li>`).join('')}</ul><div class="specimen-boundary">${esc(specimen.boundary)}</div></div></section>`;
}

function compareLab() {
  const options = data.comparisons.comparisons;
  const currentMatch = options.find((item) => item.left.id === state.herbId || item.right.id === state.herbId);
  const selected = options.find((item) => item.id === state.compareId) || (!state.compareId ? currentMatch : null);
  const selectOptions = `<option value="" ${selected ? '' : 'selected'}>请选择一组相似药材</option>${options.map((option) => `<option value="${option.id}" ${option.id === selected?.id ? 'selected' : ''}>${esc(option.title)}</option>`).join('')}`;
  const renderSide = (side, active) => {
    const herb = find(herbs(), side.id);
    const photo = herb ? herbImage(herb, 'compare-image', 'eager') : side.image?.status === 'ready' ? `<figure class="herb-image compare-image" data-image-open="${esc(side.id)}" tabindex="0" role="button" aria-label="放大查看${esc(side.nameZh)}照片"><img src="${esc(side.image.path)}" alt="${esc(side.nameZh)}植物照片" loading="eager" decoding="async" /><figcaption>${esc(side.image.creator || side.image.dataset || '公开植物观测')} · 点击放大</figcaption></figure>` : `<div class="compare-image compare-image-missing" aria-label="${esc(side.nameZh)}照片待补"><span>本</span><small>照片待补</small></div>`;
    return `<div class="compare-side ${active ? 'current' : ''}">${photo}<div class="compare-silhouette shape-${esc(side.shape)}" aria-hidden="true"><span class="model-layer layer-a"></span><span class="model-layer layer-b"></span></div><span class="compare-tag">${active ? '当前选择' : '对照对象'}</span><h3>${esc(side.nameZh)}</h3><p>${esc(side.latin)}</p><b>${esc(side.part)}</b></div>`;
  };
  const body = selected ? `<div class="compare-grid">${renderSide(selected.left, selected.left.id === state.herbId)}<div class="compare-divider">VS</div>${renderSide(selected.right, selected.right.id === state.herbId)}<div class="compare-differences"><span>三条关键差异</span><ol>${selected.differences.map((difference) => `<li>${esc(difference)}</li>`).join('')}</ol><div class="boundary-box"><span>识别边界</span><p>${esc(selected.boundary)}</p></div><h3>共同来源</h3>${renderSources(selected.sourceIds)}</div></div>` : '<div class="compare-empty"><strong>先选择一组相似药材</strong><p>当前本草暂时没有直接对照组；从下拉菜单选择一组，查看基原、部位和形态差异。</p></div>';
  return `<section class="compare-lab"><div class="compare-heading"><div><span class="panel-label">LOOK-ALIKE CHECK</span><h2>相似药材，差别在哪里？</h2><p>先看形态，再回到基原和药用部位。相似不等于可以替代。</p></div><label class="compare-select">选择一组对照<select data-compare-select>${selectOptions}</select></label></div>${body}</section>`;
}

function shuffle(items) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
}

function startImageQuiz() {
  const pool = shuffle(herbs());
  const answer = pool[0];
  const options = [answer, ...pool.slice(1, 4)].sort(() => Math.random() - 0.5);
  state.imageQuizId = answer.id;
  state.imageQuizOptions = options.map((item) => item.id);
  state.imageQuizAnswered = false;
  state.imageQuizSelected = '';
}

function imageQuiz() {
  if (!state.imageQuizId || !state.imageQuizOptions.length) startImageQuiz();
  const answer = find(herbs(), state.imageQuizId) || herbs()[0];
  const answered = state.imageQuizAnswered;
  const selected = state.imageQuizSelected;
  return `<section class="image-quiz" aria-labelledby="image-quiz-title"><div class="image-quiz-heading"><div><span class="panel-label">FIELD IMAGE QUIZ · 看图识本草</span><h2 id="image-quiz-title">只看形态，猜一味本草</h2><p>先观察叶、花、果和生境线索，再回到学名、部位与证据核对。每轮从 120 味目录中抽取。</p></div><div class="image-quiz-score"><b>${state.imageQuizScore}</b><span>答对</span></div></div><div class="image-quiz-grid"><div class="image-quiz-photo">${herbImage(answer, 'quiz-image', 'eager')}<span class="image-quiz-blind">${answered ? '答案已揭晓' : '名称隐藏 · 点击照片可放大看来源'}</span></div><div class="image-quiz-options"><p class="image-quiz-prompt">这张照片对应哪一味本草？</p>${state.imageQuizOptions.map((id) => { const option = find(herbs(), id); const isCorrect = id === answer.id; const isSelected = id === selected; const status = answered && isCorrect ? 'correct' : answered && isSelected ? 'wrong' : ''; return `<button class="quiz-option ${status}" data-image-quiz-answer="${esc(id)}" aria-pressed="${isSelected}" ${answered ? 'disabled' : ''}><span>${String(state.imageQuizOptions.indexOf(id) + 1).padStart(2, '0')}</span>${esc(option?.nameZh || '未命名')}</button>`; }).join('')}<div class="image-quiz-result ${answered ? 'is-visible' : ''}" aria-live="polite">${answered ? `<strong>${selected === answer.id ? '识别正确 · 观察到位' : '再观察一轮 · 先记住关键形态'}</strong><p>答案：${esc(answer.nameZh)} · ${esc(answer.scientificName || '')} · ${esc(answer.partUsed || '药用部位待补')} · ${esc(answer.habitatLabel || '生境待补')}</p><button class="primary-button compact" data-image-quiz-next>下一味 ↗</button>` : '<span>选择一个答案，看看你是否抓住了形态线索。</span>'}</div></div></div></section>`;
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
  return renderCosmosHeader(state);
}

function home() {
  return renderCosmosHome(data);
}

function cabinetPage() {
  return renderHabitatCabinet(data, state);
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
  const habitatLabels = [...new Set(herbs().map((item) => item.habitatLabel).filter(Boolean))];
  const herbItems = herbs().map((item) => ({ type: '本草', title: item.nameZh, meta: item.scientificName, body: item.identitySummary, sourceIds: item.sourceIds, habitat: item.habitatLabel || '', depth: item.depthLevel || '', tags: item.tags || [], part: item.partUsed || '', herb: item }));
  const items = [...herbItems, ...data.formulas.formulas.map((item) => ({ type: '方剂', title: item.nameZh, meta: item.textualOrigin, body: item.relationLabel, sourceIds: item.sourceIds, habitat: '', depth: '', tags: [], part: '' })), ...anchors().map((item) => ({ type: '文化锚点', title: item.titleZh, meta: item.period, body: item.summary, sourceIds: item.sourceIds, habitat: '', depth: '', tags: [], part: '' }))].filter((item) => (state.libraryType === 'all' || item.type === state.libraryType) && (state.libraryHabitat === 'all' || item.habitat === state.libraryHabitat) && (state.libraryDepth === 'all' || item.depth === state.libraryDepth) && (!query || `${item.title} ${item.meta} ${item.body} ${item.habitat} ${item.part} ${item.tags.join(' ')} ${sourceList(item.sourceIds).map((source) => `${source.title} ${source.publisher} ${source.locator}`).join(' ')}`.toLowerCase().includes(query)));
  const habitatOptions = `<option value="all">全部生境</option>${habitatLabels.map((label) => `<option value="${esc(label)}" ${state.libraryHabitat === label ? 'selected' : ''}>${esc(label)}</option>`).join('')}`;
  const depthOptions = `<option value="all">全部深度</option><option value="deep" ${state.libraryDepth === 'deep' ? 'selected' : ''}>深度条目 · 16</option><option value="overview" ${state.libraryDepth === 'overview' ? 'selected' : ''}>拓展条目 · 104</option>`;
  return `<main class="library-view"><div class="page-intro library-intro"><div><p class="kicker">OPEN LIBRARY · 120 HERBS / SOURCE FIRST</p><h1>资料库</h1><p>从六类生境进入全量目录，再按形态、部位和深度级别收拢视线。每一条事实都保留公开来源和阅读边界。</p></div><div class="intro-actions"><button class="quiet-button" data-view="trace">← 回到一味档案</button><button class="primary-button compact" data-image-quiz-open>${state.imageQuizOpen ? '收起看图识本草' : '看图识本草 ↗'}</button></div></div><div class="library-toolbar"><label class="search-box wide"><span>⌕</span><input data-library-search value="${esc(state.query)}" placeholder="搜索本草、方剂、学名、形态或来源关键词" /></label><div class="filter-tabs">${['all', '本草', '方剂', '文化锚点'].map((value) => `<button class="filter-tab ${state.libraryType === value ? 'active' : ''}" data-library-type="${value}">${value === 'all' ? '全部' : value}</button>`).join('')}</div><div class="library-selects"><label>生境<select data-library-habitat>${habitatOptions}</select></label><label>深度<select data-library-depth>${depthOptions}</select></label></div></div><div class="library-summary"><span>当前结果 <b>${items.length}</b></span><span>全量本草 <b>${herbs().length}</b></span><span>数据集 ${esc(data.herbs.datasetId)}</span><span>重新检索于 ${esc(data.herbs.researchedAt)}</span></div>${state.imageQuizOpen ? imageQuiz() : ''}<div class="library-grid">${items.map((item) => `<article class="library-item">${item.herb ? herbImage(item.herb, 'library-image') : ''}<div class="library-item-top"><span class="type-tag">${esc(item.type)}</span><span class="item-count">${item.sourceIds.length} 来源</span></div><h2>${esc(item.title)}</h2><p class="library-meta">${esc(item.meta)}</p>${item.habitat ? `<div class="library-facets"><span>${esc(item.habitat)}</span><span>${esc(item.depth === 'deep' ? '深度条目' : '拓展条目')}</span><span>${esc(item.part)}</span></div>` : ''}<p>${esc(item.body)}</p>${item.tags.length ? `<p class="library-tags">${item.tags.slice(0, 4).map((tag) => `<span>${esc(tag)}</span>`).join('')}</p>` : ''}<details><summary>查看来源</summary>${renderSources(item.sourceIds)}</details></article>`).join('') || '<div class="empty-state"><strong>没有匹配项</strong><p>换一个关键词，或清除筛选重新浏览。</p></div>'}</div></main>`;
}

function render() {
  if (!data) return;
  disposePlanet?.();
  disposePlanet = null;
  const content = state.view === 'trace' ? trace() : state.view === 'library' ? library() : state.view === 'cabinet' ? cabinetPage() : state.view === 'planet' ? planet() : home();
  document.querySelector('#app').innerHTML = `${header()}${content}<footer class="site-footer"><span>本草宇宙 · 百子万象</span><span>无需账号 · 无遥测 · 资料用于文化与植物学阅读，不构成医疗建议</span><span>${esc(data.herbs.catalogStats?.total || herbs().length)} 味目录 · ${esc(data.herbs.datasetId)}</span></footer><dialog class="share-dialog" id="shareDialog"><button class="dialog-close" data-close-dialog aria-label="关闭">×</button><p class="kicker">RELATION POSTER</p><h2>${esc(selectedHerb().nameZh)}的证据链</h2><p>把本次阅读中的四个节点保存为一张可分享的 SVG 海报。</p><div class="poster-preview"><span>${esc(selectedHerb().nameZh)}</span><b>植物 → 典籍 → 方剂 → 回响</b><small>本草宇宙 · ${esc(data.herbs.researchedAt)}</small></div><button class="primary-button" data-download-poster>下载 SVG 海报</button></dialog><dialog class="image-lightbox" id="imageLightbox" aria-label="本草照片来源"><div class="image-lightbox-card"><button class="dialog-close" data-image-close aria-label="关闭图片">×</button><div class="image-lightbox-empty"><span>✦</span><p>点击任意本草照片查看大图与来源。</p></div></div></dialog>`;
  if (state.view === 'planet') {
    disposePlanet = mountParticlePlanet(document.querySelector('[data-planet-root]'), herbs(), {
      activeHabitat: state.planetHabitat || 'all',
      selectedId: state.planetHerbId || '',
      onSelect: (item) => { state.planetHerbId = item.id; },
      onTrace: (item) => { state.herbId = item.id; state.view = 'trace'; state.nodeId = item.id; state.stage = 'specimen'; render(); },
      onFilter: (value) => { state.planetHabitat = value; },
      onSearch: (value) => { state.query = value; },
    });
  }
}

function planet() {
  return particlePlanetMarkup({ items: herbs(), activeHabitat: state.planetHabitat || 'all', query: state.query || '', selectedId: state.planetHerbId || '' });
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
    const imageOpen = event.target.closest('[data-image-open]');
    if (imageOpen) {
      const target = imageTarget(imageOpen.dataset.imageOpen);
      const dialog = document.querySelector('#imageLightbox');
      if (target && dialog) { dialog.innerHTML = imageLightboxCard(target); dialog.showModal(); }
      return;
    }
    if (event.target.closest('[data-image-close]')) { document.querySelector('#imageLightbox')?.close(); return; }
    if (event.target.id === 'imageLightbox') { event.target.close(); return; }
    if (event.target.closest('[data-image-quiz-open]')) {
      state.imageQuizOpen = !state.imageQuizOpen;
      if (state.imageQuizOpen && !state.imageQuizId) startImageQuiz();
      render();
      if (state.imageQuizOpen) document.querySelector('.image-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const quizAnswer = event.target.closest('[data-image-quiz-answer]');
    if (quizAnswer && !state.imageQuizAnswered) {
      state.imageQuizSelected = quizAnswer.dataset.imageQuizAnswer;
      state.imageQuizAnswered = true;
      if (state.imageQuizSelected === state.imageQuizId) state.imageQuizScore += 1;
      render();
      document.querySelector('.image-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (event.target.closest('[data-image-quiz-next]')) {
      startImageQuiz();
      render();
      document.querySelector('.image-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const view = event.target.closest('[data-view]');
    const herbButton = event.target.closest('[data-herb]');
    const cabinetDrawer = event.target.closest('[data-cabinet-drawer]');
    const cabinetFilter = event.target.closest('[data-cabinet-filter]');
    const habitatZone = event.target.closest('[data-cabinet-habitat]');
    const morphologyTab = event.target.closest('[data-cabinet-morphology]');
    const relationNode = event.target.closest('[data-relation-node]');
    const relationEdge = event.target.closest('[data-relation-id]');
    const compareHerb = event.target.closest('[data-compare-herb]');
    const node = event.target.closest('[data-node]');
    const stage = event.target.closest('[data-stage]');
    const filter = event.target.closest('[data-library-type]');
    if (cabinetDrawer) { state.herbId = cabinetDrawer.dataset.herb; state.nodeId = state.herbId; state.stage = 'specimen'; state.compareId = ''; render(); return; }
    if (compareHerb) { state.herbId = compareHerb.dataset.compareHerb; state.nodeId = state.herbId; state.stage = 'specimen'; state.view = 'trace'; state.compareOpen = true; state.compareId = ''; if (window.location.hash !== '#trace') history.pushState({ view: 'trace' }, '', '#trace'); render(); document.querySelector('.compare-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (habitatZone) {
      state.cabinetHabitat = habitatZone.dataset.cabinetHabitat;
      state.cabinetMorphology = 'all';
      const first = herbs().find((entry) => habitatFor(entry).id === state.cabinetHabitat);
      if (first) { state.herbId = first.id; state.nodeId = first.id; state.stage = 'specimen'; }
      render();
      return;
    }
    if (morphologyTab) { state.cabinetMorphology = morphologyTab.dataset.cabinetMorphology; render(); return; }
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
    if (event.target.closest('[data-cabinet-reset]')) { state.herbId = herbs()[0].id; state.nodeId = state.herbId; state.stage = 'specimen'; state.cabinetFilter = 'all'; state.cabinetHabitat = habitatFor(herbs()[0]).id; state.cabinetMorphology = 'all'; render(); return; }
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
    if (view) { const previousView = state.view; state.view = view.dataset.view; if (herbButton) { state.herbId = herbButton.dataset.herb; state.compareId = ''; } if (state.view === 'trace') { state.nodeId = state.herbId; state.stage = 'specimen'; } if (state.view === 'cabinet' && previousView !== 'cabinet') { state.cabinetHabitat = habitatFor(selectedHerb()).id; state.cabinetMorphology = 'all'; } state.query = ''; if (window.location.hash !== `#${state.view}`) history.pushState({ view: state.view }, '', `#${state.view}`); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
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
  app.addEventListener('change', (event) => {
    if (event.target.matches('[data-compare-select]')) { state.compareId = event.target.value; state.compareOpen = true; render(); document.querySelector('.compare-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (event.target.matches('[data-library-habitat]')) { state.libraryHabitat = event.target.value; render(); return; }
    if (event.target.matches('[data-library-depth]')) { state.libraryDepth = event.target.value; render(); }
  });
  app.addEventListener('input', (event) => { if (event.target.matches('[data-herb-search], [data-library-search]')) { state.query = event.target.value; render(); const input = document.querySelector(`[data-${state.view === 'library' ? 'library' : 'herb'}-search]`); input?.focus(); input?.setSelectionRange(state.query.length, state.query.length); } });
  app.addEventListener('pointerdown', (event) => { const stage = event.target.closest('[data-specimen-stage]'); const model = stage?.querySelector('[data-specimen-model]'); if (!stage || !model) return; stage.setPointerCapture?.(event.pointerId); const startX = event.clientX; const startY = event.clientY; const baseX = Number(model.dataset.rx || 0); const baseY = Number(model.dataset.ry || 0); const move = (moveEvent) => { model.dataset.rx = baseX + (moveEvent.clientY - startY) * -0.35; model.dataset.ry = baseY + (moveEvent.clientX - startX) * 0.45; model.style.setProperty('--rx', `${model.dataset.rx}deg`); model.style.setProperty('--ry', `${model.dataset.ry}deg`); }; const up = () => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerup', up); }; stage.addEventListener('pointermove', move); stage.addEventListener('pointerup', up, { once: true }); });
  app.addEventListener('keydown', (event) => {
    const imageOpen = event.target.closest('[data-image-open]');
    if (imageOpen && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      const target = imageTarget(imageOpen.dataset.imageOpen);
      const dialog = document.querySelector('#imageLightbox');
      if (target && dialog) { dialog.innerHTML = imageLightboxCard(target); dialog.showModal(); }
      return;
    }
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
  const files = ['sources.json', 'herbs.json', 'formulas.json', 'cultural-anchors.json', 'relations.json', 'specimens.json', 'comparisons.json', 'herb-images.json'];
  const values = await Promise.all(files.map((file) => fetch(`${ROOT}${file}?v=${DATA_VERSION}`, { cache: 'reload' }).then((response) => { if (!response.ok) throw new Error(`${file}: ${response.status}`); return response.json(); })));
  data = { sources: values[0], herbs: values[1], formulas: values[2], anchors: values[3], relations: values[4], specimens: values[5], comparisons: values[6], images: values[7] };
  const imageMap = new Map(data.images.images.map((entry) => [entry.herbId, entry]));
  data.herbs.herbs.forEach((herb) => { herb.image = imageMap.get(herb.id) || null; });
  render();
  bind();
}

boot().catch((error) => { document.querySelector('#app').innerHTML = `<main class="error-screen"><span class="loading-mark">!</span><h1>资料暂时无法打开</h1><p>${esc(error.message)}。请检查网络或重新加载页面。</p><button class="primary-button" onclick="location.reload()">重新加载</button></main>`; });
