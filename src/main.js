import { relationExplorer } from './relations.js?v=planet-layout-v5-20261022-1';
import { renderCosmosHeader, renderCosmosHome, renderHabitatCabinet, cabinetReadingMarkup, cabinetMorphologyMarkup, habitatFor } from './ui-layout.js?v=planet-layout-v5-20261022-1';
import { icon } from './icons.js?v=planet-layout-v5-20261022-1';

const ROOT = './src/data/curated/';
// Keep the catalog cache key independent from the application shell. GitHub Pages
// can retain a previously fetched JSON response even after the JS bundle updates.
const DATA_VERSION = 'planet-layout-v5-20261022-1';
const state = {
  view: 'home',
  routeMiss: '',
  herbId: 'herb-artemisia-annua',
  stage: 'specimen',
  nodeId: 'herb-artemisia-annua',
  query: '',
  libraryType: 'all',
  libraryHabitat: 'all',
  libraryDepth: 'all',
  libraryLimit: 24,
  compareId: '',
  compareOpen: false,
  relationFocus: '',
  cabinetHabitat: 'forest',
  cabinetMorphology: 'all',
  cabinetPicked: false,
  planetHabitat: 'all',
  planetHerbId: '',
  planetQuery: '',
  atlasHerbId: 'herb-artemisia-annua',
  atlasHabitat: 'all',
  atlasQuery: '',
  imageQuizOpen: false,
  imageQuizId: '',
  imageQuizOptions: [],
  imageQuizAnswered: false,
  imageQuizSelected: '',
  imageQuizScore: 0,
};
let data = null;
let disposePlanet = null;
let disposePlanetEngine = null;
let disposeAtlas = null;
let viewGeneration = 0;
let atlasGeneration = 0;
let searchTimer = 0;
let planetModule = null;
let atlasModule = null;
let planetModulePromise = null;
let atlasModulePromise = null;
let disposeApothecary = null;
let hallEngine = null;

async function loadPlanetModule() {
  if (planetModule) return planetModule;
  planetModulePromise ??= import(new URL('./planet.js?v=planet-layout-v5-20261022-1', import.meta.url).href)
    .then((module) => { planetModule = module; return module; })
    .catch((error) => { planetModulePromise = null; throw error; });
  return planetModulePromise;
}

async function loadAtlasModule() {
  if (atlasModule) return atlasModule;
  atlasModulePromise ??= import(new URL('./atlas.js?v=planet-layout-v5-20261022-1', import.meta.url).href)
    .then((module) => { atlasModule = module; return module; })
    .catch((error) => { atlasModulePromise = null; throw error; });
  return atlasModulePromise;
}
const VIEW_IDS = ['home', 'cabinet', 'planet', 'atlas', 'trace', 'library', 'curation'];

function applyHash() {
  const value = window.location.hash.replace(/^#/, '');
  const [route, search = ''] = value.split('?');
  const params = new URLSearchParams(search);
  if (!value || VIEW_IDS.includes(route)) {
    state.view = route || 'home';
    if (state.view === 'atlas') {
      const requested = params.get('herb');
      if (requested && data) state.atlasHerbId = find(herbs(), requested)?.id || state.atlasHerbId;
    }
    state.routeMiss = '';
    return;
  }
  // Unknown deep links used to fail silently: the page just stayed wherever it
  // was. Fall back to the home route and keep the bad segment so render() can
  // explain what happened.
  state.routeMiss = value;
  state.view = 'home';
  // Normalise the address bar so a reload does not replay the same dead link.
  history.replaceState({ view: 'home' }, '', '#home');
}

function atlasHash(id = state.atlasHerbId) {
  const herb = find(herbs(), id)?.id;
  return herb ? `#atlas?herb=${encodeURIComponent(herb)}` : '#atlas';
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
const herbImage = (item, className = '', loading = 'lazy', options = {}) => {
  const { interactive = true, alt = `${item?.nameZh || '本草'}植物照片` } = options;
  const image = imageFor(item);
  if (!image) return `<div class="herb-image herb-image-missing ${className}" aria-label="${esc(item?.nameZh || '本草')}图片待补">${icon('image')}</div>`;
  // Intrinsic dimensions keep the grid from reflowing while photos decode.
  const size = image.width && image.height ? ` width="${image.width}" height="${image.height}"` : '';
  if (!interactive) return `<figure class="herb-image ${className}"><img src="${esc(image.path)}" alt="${esc(alt)}"${size} loading="${loading}" decoding="async" /><figcaption>${esc(image.creator || image.dataset || 'GBIF 公开观测')}</figcaption></figure>`;
  return `<figure class="herb-image ${className}" data-image-open="${esc(item.id)}" tabindex="0" role="button" aria-label="放大查看${esc(item.nameZh)}照片"><img src="${esc(image.path)}" alt="${esc(alt)}"${size} loading="${loading}" decoding="async" /><figcaption>${esc(image.creator || image.dataset || 'GBIF 公开观测')} · 点击放大</figcaption></figure>`;
};

function imageLightboxCard(item) {
  const image = imageFor(item);
  if (!image) return `<div class="image-lightbox-card"><button class="dialog-close" data-image-close aria-label="关闭图片">${icon('close')}</button><div class="image-lightbox-empty">${icon('image')}<p>这味本草暂时没有可用图片。</p></div></div>`;
  const sourceLink = image.sourceUrl || image.occurrenceUrl;
  // The same GBIF/iNaturalist observation can legitimately document several
  // medicinal parts of one species. Say so instead of pretending each herb
  // has its own field photo.
  const observationKey = image.occurrenceUrl || image.sourceUrl || image.path;
  const sharedWith = data.images.images
    .filter((entry) => entry.status === 'ready' && entry.herbId !== item.id && (entry.occurrenceUrl || entry.sourceUrl || entry.path) === observationKey)
    .map((entry) => find(herbs(), entry.herbId)?.nameZh || data.comparisons.comparisons.flatMap((comparison) => [comparison.left, comparison.right]).find((side) => side?.id === entry.herbId)?.nameZh)
    .filter(Boolean);
  const reuseNote = sharedWith.length
    ? `<p class="image-lightbox-reuse">同一条公开观测也用于 ${sharedWith.map((name) => esc(name)).join('、')}：它们属于同一物种的不同药用部位，照片展示原植物，不区分饮片形态。</p>`
    : '';
  return `<div class="image-lightbox-card"><button class="dialog-close" data-image-close aria-label="关闭图片">${icon('close')}</button><div class="image-lightbox-visual"><img class="image-lightbox-image" src="${esc(image.path)}" alt="${esc(item.nameZh)}植物照片大图"${image.width && image.height ? ` width="${image.width}" height="${image.height}"` : ''} /><p class="image-lightbox-caption">${esc(image.creator || image.dataset || '公开植物观测')} · ${esc(image.license || '许可信息待补')}</p></div><aside class="image-lightbox-meta"><p class="kicker">FIELD IMAGE · SOURCE CARD</p><h2>${esc(item.nameZh)}</h2><p class="image-lightbox-latin">${esc(item.scientificName || '')}</p><dl><div><dt>拍摄/上传</dt><dd>${esc(image.creator || image.rightsHolder || '未标注')}</dd></div><div><dt>数据集</dt><dd>${esc(image.dataset || '公开植物观测')}</dd></div><div><dt>许可</dt><dd>${esc(image.license || '页面未标注许可')}</dd></div></dl><div class="image-lightbox-links">${sourceLink ? `<a href="${esc(sourceLink)}" target="_blank" rel="noopener noreferrer">查看原始照片 ↗</a>` : ''}${image.occurrenceUrl ? `<a href="${esc(image.occurrenceUrl)}" target="_blank" rel="noopener noreferrer">查看观测记录 ↗</a>` : ''}</div>${reuseNote}<p class="image-lightbox-boundary">照片用于形态初识与资料阅读，不替代专业鉴定；来源与许可信息随公开记录保留。</p></aside></div>`;
}

function specimenLab(item) {
  const specimen = specimenFor(item.id);
  if (!specimen) {
    return `<section class="specimen-lab"><div class="specimen-stage specimen-empty" aria-label="${esc(item.nameZh)}植物照片">${herbImage(item, 'specimen-photo', 'eager')}<span class="stage-hint">公开植物观测 · 可用于形态初识</span></div><div class="specimen-copy"><span class="panel-label">FIELD IMAGE · 识形照片</span><h2>${esc(item.nameZh)}的识别线索</h2><p>先用植物照片建立形态直觉，再结合基原、部位和公开来源核对身份。照片用于初步识别，不替代专业鉴定。</p><div class="specimen-boundary">当前条目暂无结构化交互标本，已保留公开观测图片作为视觉入口。</div></div></section>`;
  }
  return `<section class="specimen-lab"><div class="specimen-stage" data-specimen-stage tabindex="0" role="img" aria-label="可拖动旋转的${esc(item.nameZh)}结构化标本"><div class="specimen-model shape-${esc(specimen.shape)}" data-specimen-model><span class="model-layer layer-a"></span><span class="model-layer layer-b"></span><span class="model-layer layer-c"></span><span class="model-label">${esc(specimen.label)}</span></div><span class="stage-axis axis-x"></span><span class="stage-axis axis-y"></span><span class="stage-hint">拖动旋转 · 方向键微调</span></div><div class="specimen-copy"><span class="panel-label">3D SPECIMEN LAB · FIELD IMAGE</span>${herbImage(item, 'specimen-inline-image')}<h2>${esc(item.nameZh)}的识别线索</h2><p>把平面名称变成可以观察的结构。这个标本是根据公开植物志和药典描述生成的交互模型，旁侧照片来自公开植物观测，用于交叉核对形态。</p><ul>${specimen.cues.map((cue) => `<li>${esc(cue)}</li>`).join('')}</ul><div class="specimen-boundary">${esc(specimen.boundary)}</div></div></section>`;
}

function compareLab() {
  const options = data.comparisons.comparisons;
  const currentMatch = options.find((item) => item.left.id === state.herbId || item.right.id === state.herbId);
  const selected = options.find((item) => item.id === state.compareId) || (!state.compareId ? currentMatch : null);
  const selectOptions = `<option value="" ${selected ? '' : 'selected'}>请选择一组相似药材</option>${options.map((option) => `<option value="${option.id}" ${option.id === selected?.id ? 'selected' : ''}>${esc(option.title)}</option>`).join('')}`;
  const renderSide = (side, active) => {
    const herb = find(herbs(), side.id);
    const photo = herb ? herbImage(herb, 'compare-image', 'eager') : side.image?.status === 'ready' ? `<figure class="herb-image compare-image" data-image-open="${esc(side.id)}" tabindex="0" role="button" aria-label="放大查看${esc(side.nameZh)}照片"><img src="${esc(side.image.path)}" alt="${esc(side.nameZh)}植物照片"${side.image.width && side.image.height ? ` width="${side.image.width}" height="${side.image.height}"` : ''} loading="eager" decoding="async" /><figcaption>${esc(side.image.creator || side.image.dataset || '公开植物观测')} · 点击放大</figcaption></figure>` : `<div class="compare-image compare-image-missing" aria-label="${esc(side.nameZh)}照片待补">${icon('image')}<small>照片待补</small></div>`;
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
  const options = shuffle([answer, ...pool.slice(1, 4)]);
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
  return `<section class="image-quiz" aria-labelledby="image-quiz-title"><div class="image-quiz-heading"><div><span class="panel-label">FIELD IMAGE QUIZ · 看图识本草</span><h2 id="image-quiz-title">只看形态，猜一味本草</h2><p>先观察叶、花、果和生境线索，再回到学名、部位与证据核对。每轮从 120 味目录中抽取。</p></div><div class="image-quiz-score"><b>${state.imageQuizScore}</b><span>答对</span></div></div><div class="image-quiz-grid"><div class="image-quiz-photo">${herbImage(answer, 'quiz-image', 'eager', { interactive: false, alt: '待识别的本草植物照片' })}<span class="image-quiz-blind">${answered ? '答案已揭晓' : '名称隐藏 · 先观察叶、花、果与生境'}</span></div><div class="image-quiz-options"><p class="image-quiz-prompt">这张照片对应哪一味本草？</p>${state.imageQuizOptions.map((id) => { const option = find(herbs(), id); const isCorrect = id === answer.id; const isSelected = id === selected; const status = answered && isCorrect ? 'correct' : answered && isSelected ? 'wrong' : ''; return `<button class="quiz-option ${status}" data-image-quiz-answer="${esc(id)}" aria-pressed="${isSelected}" ${answered ? 'disabled' : ''}><span>${String(state.imageQuizOptions.indexOf(id) + 1).padStart(2, '0')}</span>${esc(option?.nameZh || '未命名')}</button>`; }).join('')}<div class="image-quiz-result ${answered ? 'is-visible' : ''}" aria-live="polite">${answered ? `<strong>${selected === answer.id ? '识别正确 · 观察到位' : '再观察一轮 · 先记住关键形态'}</strong><p>答案：${esc(answer.nameZh)} · ${esc(answer.scientificName || '')} · ${esc(answer.partUsed || '药用部位待补')} · ${esc(answer.habitatLabel || '生境待补')}</p><button class="primary-button compact" data-image-quiz-next>下一味 ↗</button>` : '<span>选择一个答案，看看你是否抓住了形态线索。</span>'}</div></div></div></section>`;
}

function chainFor(item) {
  const classic = firstAnchor(item.id, 'classical-text');
  const formula = firstFormula(item.id);
  const echo = firstAnchor(item.id, 'modern-research-history');
  // Only real records become chain nodes. Padding a chain with invented
  // "待补" nodes made every herb look like it had four verified steps.
  const nodes = [
    { id: item.id, stage: 'specimen', number: '01', label: '识形', title: item.nameZh, meta: item.scientificName, kind: 'herb', payload: item },
  ];
  if (classic) nodes.push({ id: classic.id, stage: 'classic', number: '02', label: '读典', title: classic.titleZh, meta: classic.period, kind: 'anchor', payload: classic });
  if (formula) nodes.push({ id: formula.id, stage: 'formula', number: '03', label: '看关系', title: formula.nameZh, meta: formula.textualOrigin, kind: 'formula', payload: formula });
  if (echo) nodes.push({ id: echo.id, stage: 'echo', number: '04', label: '留回响', title: echo.titleZh, meta: echo.period, kind: 'anchor', payload: echo });
  // Renumber so a two-node chain reads 01 / 02 instead of 01 / 04.
  return nodes.map((node, index) => ({ ...node, number: String(index + 1).padStart(2, '0') }));
}

/** Recorded steps a herb does not yet link to, shown as an honest coverage note. */
function chainGaps(item) {
  const gaps = [];
  if (!firstAnchor(item.id, 'classical-text')) gaps.push('典籍锚点');
  if (!firstFormula(item.id)) gaps.push('方剂组成');
  if (!firstAnchor(item.id, 'modern-research-history')) gaps.push('研究史节点');
  return gaps;
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
  return { eyebrow: `文化锚点 · ${node.number}`, title: item.titleZh, subtitle: item.period, lead: item.summary, facts: [['类型', item.kind], ['关联本草', item.relatedEntityIds.map((id) => find(herbs(), id)?.nameZh || id).join(' · ')]], boundary: item.boundary, sourceIds: item.sourceIds, sourceRefs: item.sourceRefs };
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
  const gaps = chainGaps(item);
  const gapNote = gaps.length ? `<p class="chain-gap-note"><b>只列出已登记的关系</b>这味本草当前还没有${esc(gaps.join('、'))}档案，因此这里只展示 ${chain.length} 个节点，不用占位节点补足。缺口不等于历史上不存在相关记载。</p>` : '';
  const query = state.query.trim().toLowerCase();
  const list = herbs().filter((entry) => !query || `${entry.nameZh} ${entry.pinyin} ${entry.scientificName}`.toLowerCase().includes(query));
  return `<main class="trace-view"><div class="page-intro"><div><p class="kicker">TRACE WORKBENCH · ${esc(item.nameZh)}</p><h1>追踪一味本草的来处</h1><p>沿“植物 · 典籍 · 方剂 · 回响”逐段核对，只有已登记的关系才会出现在链条上。</p></div><div class="intro-actions"><button class="quiet-button" data-view="home">← 返回开始</button><button class="quiet-button" data-compare>相似药材辨别</button><button class="primary-button compact" data-share>生成关系海报</button></div></div><div class="workbench"><aside class="herb-panel"><div class="panel-label"><span>SELECT A SPECIMEN</span><b>${herbs().length} 味</b></div><label class="search-box"><span aria-hidden="true">${icon('search')}</span><input data-herb-search value="${esc(state.query)}" placeholder="搜索本草名称或学名" aria-label="按名称或学名搜索本草" /></label><div class="herb-list">${list.map((entry) => `<button class="herb-item ${entry.id === item.id ? 'active' : ''}" data-herb="${entry.id}" data-view="trace"><span class="herb-index">${String(herbs().indexOf(entry) + 1).padStart(2, '0')}</span><span><b>${esc(entry.nameZh)}</b><small>${esc(entry.pinyin)} · ${esc(entry.partUsed)}</small></span><span class="herb-dot"></span></button>`).join('') || '<p class="empty-copy">没有找到这味本草。试试输入中文名。</p>'}</div><div class="panel-boundary">精选数据由公开来源重新检索整理。完整资料在资料库中按需加载。</div></aside><section class="chain-panel">${specimenLab(item)}<div class="chain-toolbar"><div><span class="panel-label">EVIDENCE CHAIN</span><h2>${esc(item.nameZh)} <i>${esc(item.scientificName)}</i></h2></div><div class="stage-tabs" role="tablist" aria-label="证据链阶段">${chain.map((entry) => `<button role="tab" aria-selected="${entry.stage === state.stage}" class="stage-tab ${entry.stage === state.stage ? 'active' : ''}" data-stage="${entry.stage}" data-node="${entry.id}"><span>${entry.number}</span>${esc(entry.label)}</button>`).join('')}</div></div><div class="chain-canvas" style="--chain-count:${chain.length}"><div class="chain-line"></div><div class="chain-nodes">${chain.map((entry) => `<button class="chain-node ${entry.id === node.id ? 'active' : ''} ${entry.stage === state.stage ? 'focus' : ''}" data-node="${entry.id}" data-stage="${entry.stage}"><span class="node-number">${entry.number}</span><span class="node-core">${icon(entry.kind === 'formula' ? 'formula' : entry.stage === 'echo' ? 'echo' : entry.stage === 'classic' ? 'book' : 'leaf')}</span><span class="node-label">${esc(entry.label)}</span><strong>${esc(entry.title)}</strong><small>${esc(entry.meta)}</small></button>`).join('')}</div><div class="chain-legend"><span><i class="legend-dot verified"></i>来源直接支持</span><span><i class="legend-dot contextual"></i>文化语境</span><span>点击节点查看证据</span></div></div><div class="chain-note"><span class="note-mark">${icon('info')}</span><p>这条线只表达资料中明确写出的关系。空间距离和节点大小不代表药效、重要性或推荐程度。</p></div>${gapNote}${evidenceMap}</section><aside class="evidence-panel"><div class="evidence-top"><span class="panel-label">EVIDENCE DRAWER</span><span class="evidence-status">${detail.sourceIds.length} 个来源</span></div><div class="evidence-body"><p class="kicker">${esc(detail.eyebrow)}</p><h2>${esc(detail.title)}</h2><p class="evidence-subtitle">${esc(detail.subtitle)}</p><p class="evidence-lead">${esc(detail.lead)}</p><div class="fact-list">${detail.facts.map(([label, value]) => `<div><span>${esc(label)}</span><b>${esc(value)}</b></div>`).join('')}</div><div class="boundary-box"><span>阅读边界</span><p>${esc(detail.boundary)}</p></div><h3>来源入口</h3>${renderSources(detail.sourceIds, detail.sourceRefs || [])}</div></aside></div>${state.compareOpen ? compareLab() : ''}</main>`;
}

function libraryCard(item, featured = false) {
  const depthLabel = item.depth === 'deep' ? '深度档案' : item.type === '本草' ? '拓展目录' : item.type;
  return `<article class="library-item ${featured ? 'library-item-featured' : 'library-item-extended'}">${item.herb ? herbImage(item.herb, 'library-image') : `<div class="library-abstract-mark" aria-hidden="true">${icon(item.type === '方剂' ? 'formula' : 'book')}</div>`}<div class="library-item-top"><span class="type-tag">${esc(item.type)}</span><span class="item-count">${item.sourceIds.length} 来源</span></div><h3>${esc(item.title)}</h3><p class="library-meta">${esc(item.meta)}</p>${item.habitat ? `<div class="library-facets"><span>${esc(item.habitat)}</span><span>${esc(depthLabel)}</span><span>${esc(item.part)}</span></div>` : ''}<p>${esc(item.body)}</p>${item.tags.length ? `<p class="library-tags">${item.tags.slice(0, 4).map((tag) => `<span>${esc(tag)}</span>`).join('')}</p>` : ''}<details><summary>查看来源</summary>${renderSources(item.sourceIds)}</details></article>`;
}

function library() {  const query = state.query.trim().toLowerCase();
  const habitatLabels = [...new Set(herbs().map((item) => item.habitatLabel).filter(Boolean))];
  const herbItems = herbs().map((item) => ({ type: '本草', title: item.nameZh, meta: item.scientificName, body: item.identitySummary, sourceIds: item.sourceIds, habitat: item.habitatLabel || '', depth: item.depthLevel || '', tags: item.tags || [], part: item.partUsed || '', herb: item }));
  const allItems = [...herbItems, ...data.formulas.formulas.map((item) => ({ type: '方剂', title: item.nameZh, meta: item.textualOrigin, body: item.relationLabel, sourceIds: item.sourceIds, habitat: '', depth: '', tags: [], part: '' })), ...anchors().map((item) => ({ type: '文化锚点', title: item.titleZh, meta: item.period, body: item.summary, sourceIds: item.sourceIds, habitat: '', depth: '', tags: [], part: '' }))];
  const items = allItems.filter((item) => (state.libraryType === 'all' || item.type === state.libraryType) && (state.libraryHabitat === 'all' || item.habitat === state.libraryHabitat) && (state.libraryDepth === 'all' || item.depth === state.libraryDepth) && (!query || `${item.title} ${item.meta} ${item.body} ${item.habitat} ${item.part} ${item.tags.join(' ')} ${sourceList(item.sourceIds).map((source) => `${source.title} ${source.publisher} ${source.locator}`).join(' ')}`.toLowerCase().includes(query)));
  const featured = items.filter((item) => item.type === '本草' && item.depth === 'deep');
  const featuredCatalog = herbItems.filter((item) => item.depth === 'deep');
  const expanded = items.filter((item) => !(item.type === '本草' && item.depth === 'deep'));
  const expandedAllowance = Math.max(0, state.libraryLimit - featured.length);
  const visibleExpanded = expanded.slice(0, expandedAllowance);
  const hasMore = visibleExpanded.length < expanded.length;
  const habitatOptions = `<option value="all">全部生境</option>${habitatLabels.map((label) => `<option value="${esc(label)}" ${state.libraryHabitat === label ? 'selected' : ''}>${esc(label)}</option>`).join('')}`;
  const depthOptions = `<option value="all">全部深度</option><option value="deep" ${state.libraryDepth === 'deep' ? 'selected' : ''}>深度条目 · 16</option><option value="overview" ${state.libraryDepth === 'overview' ? 'selected' : ''}>拓展条目 · 104</option>`;
  const quickHabitats = habitatLabels.map((label) => { const count = featuredCatalog.filter((item) => item.habitat === label).length; return `<button class="library-habitat-chip ${state.libraryHabitat === label ? 'is-active' : ''}" data-library-quick-habitat="${esc(label)}" aria-pressed="${state.libraryHabitat === label}"><span>${esc(label)}</span><b>${count}</b></button>`; }).join('');
  const noResults = !featured.length && !expanded.length ? '<div class="empty-state"><strong>没有匹配项</strong><p>换一个关键词，或清除筛选重新浏览。</p></div>' : '';
  return `<main class="library-view" aria-labelledby="library-title"><div class="page-intro library-intro"><div><p class="kicker">OPEN LIBRARY · 16 FEATURED / 104 EXPANDED</p><h1 id="library-title">先读精品，再查全量。</h1><p>先从 16 味深度档案进入本草的形态、生境和证据，再把筛选器打开到 104 味拓展目录。资料库保留全量数据，但让第一次进入的人先看到最有解释力的部分。</p></div><div class="intro-actions"><button class="quiet-button" data-view="trace">← 回到一味档案</button><button class="primary-button compact" data-image-quiz-open>${state.imageQuizOpen ? '收起看图识本草' : '看图识本草 ↗'}</button></div></div><div class="library-proof"><div><b>16</b><span>味深度档案</span></div><div><b>104</b><span>味拓展目录</span></div><div><b>6</b><span>类主生境</span></div><div class="library-proof-note">每一张卡片都保留照片、来源和阅读边界。</div></div><div class="library-featured-index"><div><span class="panel-label">FEATURED HABITATS</span><h2>先按生境找到一组精品。</h2></div><div class="library-habitat-chips"><button class="library-habitat-chip ${state.libraryHabitat === 'all' ? 'is-active' : ''}" data-library-quick-habitat="all" aria-pressed="${state.libraryHabitat === 'all'}"><span>全部精品</span><b>${featured.length}</b></button>${quickHabitats}</div></div><div class="library-toolbar"><label class="search-box wide"><span aria-hidden="true">${icon('search')}</span><input data-library-search value="${esc(state.query)}" placeholder="搜索本草、方剂、学名、形态或来源关键词" aria-label="搜索资料库全部条目" /></label><div class="filter-tabs" role="group" aria-label="按条目类型筛选">${['all', '本草', '方剂', '文化锚点'].map((value) => `<button class="filter-tab ${state.libraryType === value ? 'active' : ''}" data-library-type="${value}" aria-pressed="${state.libraryType === value}">${value === 'all' ? '全部' : value}</button>`).join('')}</div><div class="library-selects"><label>生境<select data-library-habitat>${habitatOptions}</select></label><label>深度<select data-library-depth>${depthOptions}</select></label></div></div><div class="library-summary"><span>当前结果 <b>${items.length}</b></span><span>精品结果 <b>${featured.length}</b></span><span>拓展及关联 <b>${expanded.length}</b></span><span>重新检索于 ${esc(data.herbs.researchedAt)}</span></div>${state.imageQuizOpen ? imageQuiz() : ''}${featured.length ? `<section class="library-section library-featured-section" aria-labelledby="library-featured-title"><div class="library-section-heading"><div><span class="section-index">01 / DEEP ARCHIVE</span><h2 id="library-featured-title">16 味精品图谱</h2><p>从形态与生境进入，再回到一味档案读完整证据链。</p></div><span class="library-section-count">${featured.length} / 16</span></div><div class="library-grid library-featured-grid">${featured.map((item) => libraryCard(item, true)).join('')}</div></section>` : ''}${expanded.length ? `<section class="library-section library-expanded-section" aria-labelledby="library-expanded-title"><div class="library-section-heading"><div><span class="section-index">02 / OPEN CATALOG</span><h2 id="library-expanded-title">拓展目录与关联资料</h2><p>拓展本草与关联资料按 16 条分批展开，搜索和生境筛选始终作用于全量结果。</p></div><span class="library-section-count">已展示 ${visibleExpanded.length} / ${expanded.length}</span></div><div class="library-grid library-expanded-grid">${visibleExpanded.map((item) => libraryCard(item)).join('')}</div>${hasMore ? `<div class="library-more"><button type="button" class="quiet-button" data-library-more>再加载 16 条 <span>${expanded.length - visibleExpanded.length} 条待显示</span></button></div>` : ''}</section>` : ''}${noResults}</main>`;
}

/**
 * Project statement page. Judges and first-time readers need one place that
 * states what the object is, how it is built, and what it deliberately does
 * not claim. Counts are computed from the dataset so the page cannot drift.
 */
/**
 * Track, audience, differentiation and verification blocks for the project
 * statement. They live beside curation() so the page stays one readable unit:
 * the competition brief asks for a clear target audience, a stated difference
 * from existing work, and materials a judge can actually verify.
 */
function curationTrack(meta) {
  return `<section class="curation-block curation-block-wide"><span class="section-index">01 / POSITION</span><h2>为什么用“宇宙”讲本草</h2><p>本草是一套被连续书写了约两千年的知识系统：同一株草被不同朝代命名、校补、入方，又被现代的植物学与药典重新定位。单篇图文很难让人看见这种“层层叠加”的结构。</p><p>所以这里不按时间轴排布，而把 ${meta.herbCount} 味本草放进三种可切换的读法：百子药堂按生境归位，粒子星球把目录与关系聚成一颗可旋转的 3D 地球，生境地图再把 GBIF 开放观测落回中国底图。同一味本草在不同读法里位置不同，读者可以对照着理解“它长在哪里”“它被谁记录”和“它被谁引用”。</p></section><section class="curation-block curation-block-wide"><span class="section-index">02 / TRACK</span><h2>与赛道要求怎么对应</h2><p>本作品报名 2026 年第十四届全国大学生数字媒体科技作品及创意竞赛「科技+创意，讲好中国故事」作品赛项，对应两个参赛方向：</p><ul class="curation-track"><li><b>01 中华优秀传统文化数字化表达</b><span>把本草典籍、生境知识与药用部位组织成可探索的空间和可核对的证据链，而不是把古籍原文平铺成网页。</span></li><li><b>04 面向国际传播的数字内容</b><span>界面保留英文标注与英文摘要，植物名称使用拉丁学名，事实陈述直接链接公开来源，减少文化符号的简单翻译。</span></li></ul><p>选题落点：一部被连续书写约两千年的本草知识系统，今天仍然可以被查找、被核对、被继续书写。</p></section>`;
}

function curationAudience() {
  return `<section class="curation-block curation-block-wide"><span class="section-index">06 / AUDIENCE</span><h2>谁在什么场景里使用</h2><p>四类场景都不需要账号，也不依赖后端：</p><ol class="curation-scenes"><li><b>高校通识与中医药文化课程</b><span>教师用「一味档案」做 15 分钟案例课，学生沿证据链逐条点开来源，练习区分植物身份、历史语境与现代研究。</span></li><li><b>中学生物、语文、历史跨学科项目</b><span>「看图识本草」做课堂导入，「百子药堂」练习按生境分类；图片自带来源卡，可以直接讲版权与证据。</span></li><li><b>博物馆、图书馆与校园展陈</b><span>作为触屏导览或展后延伸阅读：静态站点可离线部署，无账号、无遥测、无自动播放音频。</span></li><li><b>国际传播与文化交流</b><span>海外读者可以从拉丁学名和英文摘要进入，再沿公开来源核对，不要求先接受一套文化叙事。</span></li></ol></section>`;
}

function curationDifference() {
  return `<section class="curation-block curation-block-wide"><span class="section-index">07 / DIFFERENCE</span><h2>和既有做法差在哪里</h2><p>同类作品常见四种做法，本项目逐一给出不同的处理：</p><dl class="curation-diff"><div><dt>条目式图鉴，以功效描述为主</dt><dd>改为空间化探索加证据链：先按生境找到它，再逐段核对它被谁记录、被谁引用。</dd></div><div><dt>知识图谱追求「全连接」</dt><dd>只画已登记的关系，缺口用文字说明，不用占位节点补足；节点大小和距离不代表药效或重要性。</dd></div><div><dt>文化展示停留在符号拼贴</dt><dd>生境分类、植物学身份、历史语境三层分开标注，传统分类与现代研究不互相替代。</dd></div><div><dt>交互以卡片列表为主</dt><dd>抽屉向左前方抽出的 Z 轴动作、带大气层的 3D 地球、开放观测地图与完整键盘目录共用一份数据，并各自保留降级路径。</dd></div></dl></section>`;
}

function curationVerify(meta) {
  return `<section class="curation-block curation-block-wide"><span class="section-index">10 / VERIFY</span><h2>评委可以怎么核验</h2><ul class="curation-check"><li><code>npm run build</code><span>校验入口文件、8 份策展 JSON、${meta.herbCount} 味 GBIF 快照、许可与网格字段、Natural Earth 与星球纹理；再用 esbuild 生成本地 3D 引擎与动效运行时，并复制 MapLibre 资产。</span></li><li><code>npm test</code><span>自动检查 ${meta.herbCount} 味目录与 ${meta.deepCount} 味深度档案的完整性、来源引用与 locator、图片文件、关系图来源、GBIF 许可白名单与聚合字段、前端降级路径与减少动态效果规则。</span></li><li><code>npm run serve</code><span>用任意静态服务器打开同一份产物；在线地图不可用时自动切到本地 Natural Earth 或 Canvas 网格，不依赖应用后端。</span></li><li><code>${meta.version}</code><span>同一个版本串同时出现在 HTML 的 CSS/JS 引用、模块 import、GBIF 与地图请求中，便于确认看到的是同一版。</span></li><li><b>材料</b><span>README 记录体验重点、依赖、许可与数据边界；四分钟演示脚本在 docs/competition-presentation.md，交接与提交检查清单在 docs/team-handoff.md。代码、数据与文档都在同一仓库里，可按提交记录追溯。</span></li></ul></section>`;
}

function curationAiUse() {
  return `<section class="curation-block curation-block-wide"><span class="section-index">11 / AI USE</span><h2>AI 工具使用说明</h2><p>按竞赛对人工智能工具使用情况的披露要求，如实说明如下，供报名模板勾选时对照：</p><ul class="curation-ai"><li><b>站点运行时</b><span>不调用任何生成式模型，也不向第三方发送读者数据；所有页面、检索和可视化都在浏览器本地完成。</span></li><li><b>内容生产</b><span>本草名称、学名、药用部位、生境与来源均来自公开文献和数据库，逐条登记 locator；站点不使用 AI 生成的图片或虚构条目。</span></li><li><b>开发辅助</b><span>开发阶段使用 AI 编程助手辅助代码重构、样式调试和文档草拟；所有改动经人工核对后提交，并由构建脚本、测试与双端截图复核。</span></li><li><b>边界</b><span>AI 不参与医学判断，不生成剂量、处方或疗效结论；页面中的阅读边界由人工撰写并保留来源入口。</span></li></ul></section>`;
}

function curationAbstract() {
  return `<section class="curation-abstract" aria-labelledby="curation-abstract-title"><span class="panel-label">ABSTRACT · EN</span><h2 id="curation-abstract-title">A dependency-free atlas of 120 Chinese medicinal herbs.</h2><p>Herbal Cosmos organizes one dataset through two spatial grammars: a day-side habitat cabinet for finding a herb by where it grows, and a night-side particle planet for reading relations. Every entry carries a scientific name, a medicinal part, a habitat and a reading boundary. Every claim links to a public source; missing records are shown as gaps instead of placeholders. The site runs without frameworks, accounts or telemetry, works from any static server, and falls back to a text catalog when Canvas is unavailable.</p></section>`;
}

function curation() {
  const herbCount = herbs().length;
  const deepCount = herbs().filter((item) => item.depthLevel === 'deep').length;
  const overviewCount = herbCount - deepCount;
  const sourceCount = sources().length;
  const anchorCount = anchors().length;
  const formulaCount = data.formulas.formulas.length;
  const relationCount = data.relations.relations.length;
  const comparisonCount = data.comparisons.comparisons.length;
  const specimenCount = data.specimens.specimens.length;
  const withClassic = herbs().filter((item) => firstAnchor(item.id, 'classical-text')).length;
  const withFormula = herbs().filter((item) => firstFormula(item.id)).length;
  const withResearch = herbs().filter((item) => firstAnchor(item.id, 'modern-research-history')).length;
  const licences = [...new Set(data.images.images.map((entry) => entry.license).filter(Boolean))];
  const version = 'planet-layout-v5-20261022-1';
  return `<main class="curation-view" aria-labelledby="curation-title"><div class="page-intro"><div><p class="kicker">PROJECT NOTES · 项目说明</p><h1 id="curation-title">把一部草木志，<br />做成可以漫游的空间。</h1><p>这一页写给第一次打开网站的人：它是什么、面向谁、和同类作品差在哪里、怎么被做出来、哪些话有来源、哪些地方还不足。所有数字都从当前数据集实时计算。</p></div><div class="intro-actions"><button class="quiet-button" data-view="home">← 回到首页</button><button class="primary-button compact" data-view="trace">直接读一味档案 ↗</button></div></div><div class="curation-grid">${curationTrack({ herbCount })}<section class="curation-block"><span class="section-index">03 / DATA</span><h2>三层数据，三种精度</h2><p>站点不做“全部同等可信”的暗示，而是把精度分层写出来：</p><dl class="curation-facts"><div><dt>深度档案</dt><dd>${deepCount} 味：逐条来源定位到药典条目或植物志物种处理页，配识形台与相似药材对照。</dd></div><div><dt>目录条目</dt><dd>${overviewCount} 味：保留学名、科属、部位、生境和来源入口，用于检索与全量浏览。</dd></div><div><dt>关系与方剂</dt><dd>${relationCount} 条关系、${formulaCount} 个方剂、${anchorCount} 个文化锚点、${comparisonCount} 组相似药材、${specimenCount} 个结构化标本，全部登记来源。</dd></div><div><dt>公开来源</dt><dd>${sourceCount} 个：药典、Flora of China、NCBI Taxonomy、POWO、Chinese Text Project、WHO、Nobel Prize 等公开入口。</dd></div></dl><p class="curation-note">图片来自公开植物观测记录（iNaturalist / GBIF 等），逐张保留作者、数据集、许可与观测页链接，可在灯箱内点开核对。</p></section><section class="curation-block"><span class="section-index">04 / BUILD</span><h2>分级渲染，一条命令验证</h2><p>页面仍是原生 ES Modules 与静态 JSON，没有 React、Vue 这类前端框架；但视觉层按需加载真正使用的库：Three.js 与 @takram/three-atmosphere 只在粒子星球进入 3D 阶段后加载，MapLibre 只在生境地图接入地图时加载，AutoAnimate 只绑定列表重排与详情切换。</p><p>地图依次尝试 OpenFreeMap 在线底图、本地 Natural Earth 和 Canvas 聚合点；星球依次尝试 WebGPU 大气散射、WebGL2 地球纹理和 Canvas 2D 粒子。任一高阶能力不可用时保留完整目录与交互，不留下空白舞台。</p><p>构建脚本校验八份策展 JSON、120 味 GBIF 快照、许可与网格字段、Natural Earth 和星球纹理，再用 esbuild 生成本地 vendor 产物。运行时不依赖第三方 CDN；任何人都可以用任意静态服务器打开同一份产物。</p><p class="curation-note">制作工具：手写 HTML/CSS/JavaScript、Three.js、@takram/three-atmosphere、MapLibre GL、AutoAnimate、esbuild、Node.js、Playwright 与 Lighthouse。第三方图片、地图数据与观测记录分别保留作者、许可和数据边界。</p></section><section class="curation-block"><span class="section-index">05 / ACCESS</span><h2>没有鼠标也能读完</h2><p>键盘可达的焦点环覆盖全站；粒子星球提供可展开的文本目录，读屏会播报选择与筛选结果；抽屉、灯箱、海报弹窗都能用 Esc 关闭；对比度按 WCAG AA 校核过；系统开启“减少动态效果”后，漂浮粒子、连线动画和惯性旋转都会停止。</p><p>当 WebGPU 与 WebGL2 不可用时，星球保留 Canvas 2D 粒子引擎；连 Canvas 也不可用时，再降级为 ${herbCount} 味的可滚动文本目录。生境地图同样保留本地底图与离线网格，读屏会播报图层状态和筛选结果。</p></section>${curationAudience()}${curationDifference()}<section class="curation-block curation-block-wide"><span class="section-index">08 / WALKTHROUGH</span><h2>四分钟能看完什么</h2><ol class="curation-steps"><li><b>首页 30 秒</b><span>看三种入口的分工：百子药堂、3D 星球、开放观测地图，再读“后来走到了哪里”三条公开记录。</span></li><li><b>百子药堂 60 秒</b><span>按生境抽一格，看抽屉抽出、右侧档案同步更新；再用形态标签收拢视线。</span></li><li><b>一味档案 60 秒</b><span>拖动识形台，看证据链只剩已登记节点，点开右侧来源逐条核对。</span></li><li><b>粒子星球 40 秒</b><span>拖动真实地球、缩放云层与大气，点击粒子查看本草，或展开键盘目录与生境筛选。</span></li><li><b>生境地图 50 秒</b><span>切换生境与物种，看 GBIF 网格聚类、记录统计和许可入口，再读读图边界。</span></li></ol></section><section class="curation-block curation-block-wide"><span class="section-index">09 / LIMITS</span><h2>我们还没有做到的部分</h2><p>把不足写在这里，比让读者自己发现更诚实：</p><ul class="curation-limits"><li><b>证据链长度不均</b>：${herbCount} 味中，只有 ${withClassic} 味登记了古典文本锚点、${withFormula} 味登记了方剂组成、${withResearch} 味登记了现代研究史节点。缺口用一段说明写清楚，不用占位节点补足。</li><li><b>图片是物种级而非药材级</b>：照片来自对应的植物学名观测，展示的是原植物，不是饮片或炮制品；同一物种的不同药用部位会共用同一张观测照片，灯箱里保留了原始观测链接。</li><li><b>古籍定位仍是入口级</b>：Chinese Text Project 的条目目前定位到书名与检索方式，尚未逐卷逐页校对。</li><li><b>没有医疗建议</b>：全站不提供剂量、处方、替代治疗或个体化建议；传统分类与现代研究分层标注，不互相替代。</li><li><b>GIS 只表达开放观测</b>：GBIF 点位经过许可、地理质量和国家范围筛选后聚合为 0.5° 或 1° 网格，只保留网格中心；记录密度受公众观测活动影响，不代表药用分布、资源储量或推荐采集地。</li></ul></section>${curationVerify({ herbCount, deepCount, version })}${curationAiUse()}</div>${curationAbstract()}<section class="curation-sources"><div><span class="panel-label">PUBLIC SOURCES</span><h2>来源清单</h2></div>${renderSources(sources().map((source) => source.id))}<p class="curation-note">数据集 ${esc(data.herbs.datasetId)} · 最近检索 ${esc(data.herbs.researchedAt)} · 图片许可覆盖 ${licences.length} 种公开许可（含 CC BY、CC BY-NC、CC BY-SA、CC0 与公共领域）。</p></section></main>`;
}

function atlasPage() {
  return atlasModule.atlasMarkup({
    items: herbs(),
    selectedId: state.atlasHerbId,
    activeHabitat: state.atlasHabitat || 'all',
    query: state.atlasQuery || '',
  });
}

function navigateView(view, { herbId = '', atlasId = '', append = false } = {}) {
  clearTimeout(searchTimer);
  state.view = view;
  if (view === 'trace') {
    if (herbId) state.herbId = herbId;
    state.nodeId = state.herbId;
    state.stage = 'specimen';
    state.compareOpen = false;
  }
  if (view === 'cabinet' && herbId) {
    state.herbId = herbId;
    state.nodeId = herbId;
    state.stage = 'specimen';
  }
  if (view === 'atlas') {
    if (atlasId) state.atlasHerbId = atlasId;
    state.atlasHabitat = 'all';
    state.atlasQuery = '';
  }
  if (view === 'library') state.libraryLimit = 24;
  const hash = view === 'atlas' ? atlasHash(atlasId || state.atlasHerbId) : `#${view}`;
  if (window.location.hash !== hash) {
    const method = append ? 'pushState' : 'replaceState';
    history[method]({ view }, '', hash);
  }
  render();
}

const FOCUS_SELECTORS = [
  '[data-herb-search]',
  '[data-library-search]',
  '[data-atlas-search]',
  '[data-planet-search]',
  '[data-compare-select]',
  '[data-library-habitat]',
  '[data-library-depth]',
];

function focusSelectorFor(element) {
  if (!element || !document.querySelector('#app')?.contains(element)) return '';
  const exact = FOCUS_SELECTORS.find((selector) => element.matches?.(selector));
  if (exact) return exact;
  const attributes = [
    'data-cabinet-drawer', 'data-atlas-herb', 'data-planet-fallback-id', 'data-herb',
    'data-library-type', 'data-library-quick-habitat', 'data-image-open', 'data-image-quiz-answer',
    'data-stage', 'data-node', 'data-relation-node', 'data-relation-id', 'data-view',
  ];
  for (const attribute of attributes) {
    const value = element.getAttribute?.(attribute);
    if (value !== null) return `[${attribute}="${CSS.escape(value)}"]`;
  }
  return '';
}

function captureFocus() {
  const element = document.activeElement;
  const selector = focusSelectorFor(element);
  if (!selector) return null;
  return {
    selector,
    start: Number.isInteger(element.selectionStart) ? element.selectionStart : null,
    end: Number.isInteger(element.selectionEnd) ? element.selectionEnd : null,
    direction: element.selectionDirection || 'none',
  };
}

function restoreFocus(snapshot) {
  if (!snapshot?.selector) return false;
  const target = document.querySelector(snapshot.selector);
  if (!target) return false;
  target.focus({ preventScroll: true });
  if (snapshot.start !== null && typeof target.setSelectionRange === 'function') {
    try { target.setSelectionRange(snapshot.start, snapshot.end ?? snapshot.start, snapshot.direction); } catch {}
  }
  return true;
}

function cleanupMountedViews() {
  viewGeneration += 1;
  atlasGeneration += 1;
  disposePlanetEngine?.();
  disposePlanetEngine = null;
  disposePlanet?.();
  disposePlanet = null;
  disposeAtlas?.();
  disposeAtlas = null;
  disposeApothecary?.();
  disposeApothecary = null;
  hallEngine = null;
}

function setPlanetFallbackState(root, label, note) {
  if (!root) return;
  root.classList.remove('is-3d-ready', 'is-engine-connecting');
  root.dataset.planetMode = 'canvas';
  const mode = root.querySelector('[data-planet-mode]');
  const modeNote = root.querySelector('[data-planet-engine-note]');
  if (mode) mode.textContent = label;
  if (modeNote) modeNote.textContent = note;
  const engineCanvas = root.querySelector('[data-planet-engine]');
  if (engineCanvas) engineCanvas.hidden = true;
}

function mountPlanetExperience() {
  const root = document.querySelector('[data-planet-root]');
  if (!root) return;
  const sceneCanvas = root.querySelector('[data-planet-canvas]');
  const engineCanvas = root.querySelector('[data-planet-engine]');
  const generation = viewGeneration;
  let engine = null;
  const runtime = planetModule.mountParticlePlanet(root, herbs(), {
    activeHabitat: state.planetHabitat || 'all',
    selectedId: state.planetHerbId || '',
    onSelect: (item) => {
      state.planetHerbId = item.id;
      engine?.update({ habitat: state.planetHabitat, query: state.planetQuery, selectedId: item.id });
    },
    onTrace: (item) => navigateView('trace', { herbId: item.id, append: true }),
    onAtlas: (item) => navigateView('atlas', { atlasId: item.id, append: true }),
    onFilter: (value) => {
      state.planetHabitat = value;
      engine?.update({ habitat: value, query: state.planetQuery, selectedId: state.planetHerbId });
    },
    onSearch: (value) => {
      state.planetQuery = value;
      engine?.update({ habitat: state.planetHabitat, query: value, selectedId: state.planetHerbId });
    },
    onReset: () => engine?.resetView(),
  });
  disposePlanet = runtime;
  state.planetHerbId = root.dataset.planetSelected || state.planetHerbId || '';

  const loadEngine = async () => {
    if (generation !== viewGeneration || state.view !== 'planet' || document.hidden) return;
    root.classList.add('is-engine-connecting');
    if (engineCanvas) engineCanvas.hidden = false;
    try {
      const module = await import(new URL('../vendor/planet-engine.js?v=planet-layout-v5-20261022-1', import.meta.url).href);
      if (generation !== viewGeneration || state.view !== 'planet') return;
      engine = await module.mountPlanetEngine({
        root,
        canvas: engineCanvas,
        items: herbs(),
        habitat: state.planetHabitat || 'all',
        query: state.planetQuery || '',
        selectedId: state.planetHerbId || '',
        onSelect: (item) => {
          state.planetHerbId = item.id;
          runtime.reflectSelection?.(item);
          engine?.update({ habitat: state.planetHabitat, query: state.planetQuery, selectedId: item.id });
        },
      });
      if (generation !== viewGeneration || state.view !== 'planet') {
        engine.dispose();
        engine = null;
        return;
      }
      disposePlanetEngine = () => engine.dispose();
      disposePlanet = runtime;
      runtime.pause?.();
      if (sceneCanvas) sceneCanvas.hidden = true;
      root.classList.remove('is-engine-connecting');
      root.classList.add('is-3d-ready');
    } catch (error) {
      engineCanvas.hidden = true;
      setPlanetFallbackState(root, 'CANVAS 2D · SAFE FALLBACK', '此设备未启用 3D，交互与目录保持完整');
      console.info('[Herbal-Cosmos] 3D renderer unavailable; Canvas 2D retained.', error);
    }
  };

  if ('requestIdleCallback' in window) window.requestIdleCallback(loadEngine, { timeout: 1800 });
  else window.setTimeout(loadEngine, 260);
}

function syncCabinetSelection(item = null) {
  if (item) {
    state.herbId = item.id;
    state.nodeId = item.id;
    state.stage = 'specimen';
    state.compareId = '';
    state.cabinetPicked = true;
  } else {
    state.cabinetPicked = false;
  }
  const activeHabitat = state.cabinetHabitat || 'forest';
  document.querySelectorAll('[data-cabinet-habitat]').forEach((button) => {
    const active = button.dataset.cabinetHabitat === activeHabitat;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-cabinet-morphology]').forEach((button) => {
    const active = button.dataset.cabinetMorphology === (state.cabinetMorphology || 'all');
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-cabinet-drawer]').forEach((button) => {
    const selected = Boolean(state.cabinetPicked && button.dataset.herb === state.herbId);
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
    const pull = button.querySelector('.drawer-pull small');
    if (pull) pull.textContent = selected ? '已抽出' : '抽出';
  });
  const selected = state.cabinetPicked ? find(herbs(), state.herbId) : null;
  const readingHabitat = selected ? null : habitatFor(find(herbs(), state.herbId) || herbs()[0]);
  const reading = document.querySelector('.cabinet-reading');
  if (reading) {
    reading.classList.toggle('cabinet-reading-idle', !selected);
    reading.innerHTML = cabinetReadingMarkup(data, selected, readingHabitat);
  }
  if (item) announce(`已抽出${item.nameZh}，右侧档案已同步`);
  const picker = document.querySelector('[data-apothecary-picker]');
  if (picker?.tomselect) picker.tomselect.setValue(item?.id || '', true);
  else if (picker) picker.value = item?.id || '';
}

function setApothecaryFallbackState(root, canvas, error) {
  root.classList.add('is-hall-fallback');
  root.dataset.hallMode = 'canvas';
  document.body.classList.remove('is-hall-ready');
  if (canvas) canvas.hidden = true;
  const mode = root.querySelector('[data-apothecary-mode]');
  const note = root.querySelector('[data-apothecary-note]');
  if (mode) mode.textContent = '平面百子药堂 · 安全降级';
  if (note) note.textContent = '当前浏览器未启用 WebGL2，下方完整柜格仍可继续探索';
  console.info('[Herbal-Cosmos] Apothecary WebGL2 unavailable; 2D cabinet retained.', error);
}

async function mountApothecaryExperience() {
  const root = document.querySelector('[data-apothecary-root]');
  if (!root) return;
  const canvas = root.querySelector('[data-apothecary-canvas]');
  const generation = viewGeneration;
  let disposePicker = () => {};
  try {
    const module = await import(new URL('../vendor/apothecary-engine.js?v=planet-layout-v5-20261022-1', import.meta.url).href);
    if (generation !== viewGeneration || state.view !== 'cabinet') return;
    const engine = await module.mountApothecaryEngine({
      root,
      canvas,
      items: herbs(),
      activeHabitat: state.cabinetHabitat || 'forest',
      morphology: state.cabinetMorphology || 'all',
      selectedId: state.cabinetPicked ? state.herbId : '',
      onSelect: (item) => syncCabinetSelection(item),
      onError: (error) => {
        if (generation !== viewGeneration || state.view !== 'cabinet') return;
        hallEngine = null;
        disposePicker();
        setApothecaryFallbackState(root, canvas, error);
      },
    });
    if (generation !== viewGeneration || state.view !== 'cabinet') {
      engine.dispose();
      return;
    }
    hallEngine = engine;
    disposeApothecary = () => {
      disposePicker();
      engine.dispose();
      if (hallEngine === engine) hallEngine = null;
    };
    root.addEventListener('click', (event) => {
      if (event.target.closest('[data-apothecary-close]')) {
        hallEngine?.closeDrawer();
        return;
      }
      const target = event.target.closest('[data-apothecary-view]');
      if (!target || !hallEngine) return;
      const viewName = target.dataset.apothecaryView;
      hallEngine.setView(viewName === 'reset' ? 'outside' : viewName);
    });
    const pickerSelect = root.querySelector('[data-apothecary-picker]');
    const selectHerb = (value) => {
      const item = find(herbs(), value);
      if (!item) { engine.closeDrawer(); return; }
      syncCabinetSelection(item);
      engine.update({ selectedId: item.id });
    };
    try {
      const pickerModule = await import(new URL('../vendor/herb-picker.js?v=picker-v3-20261022', import.meta.url).href);
      if (generation !== viewGeneration || hallEngine !== engine) return;
      disposePicker = pickerModule.mountHerbPicker(pickerSelect, herbs(), selectHerb);
    } catch (error) {
      // A missing optional UI bundle must not tear down a working 3D scene.
      if (generation !== viewGeneration || hallEngine !== engine) return;
      console.info('[Herbal-Cosmos] Enhanced herb picker unavailable; native select retained.', error);
      const change = event => selectHerb(event.target.value);
      pickerSelect?.addEventListener('change', change);
      disposePicker = () => pickerSelect?.removeEventListener('change', change);
    }
  } catch (error) {
    disposePicker();
    if (generation === viewGeneration && state.view === 'cabinet') setApothecaryFallbackState(root, canvas, error);
  }
}
function mountAtlasExperience() {
  const root = document.querySelector('[data-atlas-root]');
  if (!root) return;
  const generation = ++atlasGeneration;
  atlasModule.mountAtlas({
    root,
    items: herbs(),
    selectedId: state.atlasHerbId,
    activeHabitat: state.atlasHabitat || 'all',
    query: state.atlasQuery || '',
    onSelect: (item) => {
      state.atlasHerbId = item.id;
      history.replaceState({ view: 'atlas' }, '', atlasHash(item.id));
    },
    onTrace: (item) => navigateView('trace', { herbId: item.id, append: true }),
    onStateChange: (next) => {
      state.atlasHabitat = next.habitat || 'all';
      state.atlasQuery = next.query || '';
    },
  }).then((cleanup) => {
    if (generation !== atlasGeneration || state.view !== 'atlas') cleanup();
    else disposeAtlas = cleanup;
  }).catch((error) => {
    console.warn('[Herbal-Cosmos] Atlas mount failed.', error);
  });
}

async function render() {
  if (!data) return;
  const requestedView = state.view;
  try {
    if (requestedView === 'planet') await loadPlanetModule();
    else if (requestedView === 'atlas') await loadAtlasModule();
  } catch (error) {
    if (state.view !== requestedView) return;
    console.warn('[Herbal-Cosmos] Route module failed to load.', error);
    document.querySelector('#app').innerHTML = `<main class="error-screen"><span class="loading-mark" aria-hidden="true">${icon('seal')}</span><h1>舞台暂时无法载入</h1><p>${esc(error.message)}。可以返回首页，或重新加载后再试。</p><button class="primary-button" data-view="home">返回首页</button></main>`;
    return;
  }
  if (state.view !== requestedView) return;
  const app = document.querySelector('#app');
  const previousView = app.dataset.cosmosView || '';
  const preservePosition = previousView === state.view;
  const scrollY = preservePosition ? window.scrollY : 0;
  const focusSnapshot = preservePosition ? captureFocus() : null;
  clearTimeout(searchTimer);
  cleanupMountedViews();

  const content = state.view === 'trace' ? trace() : state.view === 'library' ? library() : state.view === 'cabinet' ? cabinetPage() : state.view === 'planet' ? planet() : state.view === 'atlas' ? atlasPage() : state.view === 'curation' ? curation() : home();
  const routeNotice = state.routeMiss
    ? `<p class="route-miss" role="alert">没有找到 <code>#${esc(state.routeMiss)}</code> 这个页面，已回到宇宙首页。<button class="quiet-button" data-view="library">去资料库搜索</button></p>`
    : '';
  const posterChain = chainFor(selectedHerb()).map((node) => node.label).join(' → ');
  app.innerHTML = `${header()}${routeNotice}${content}<footer class="site-footer"><span>本草宇宙 · 百子万象</span><span>无需账号 · 无遥测 · 资料用于文化与植物学阅读，不构成医疗建议</span><span>${esc(data.herbs.catalogStats?.total || herbs().length)} 味目录 · ${esc(data.herbs.datasetId)}</span></footer><dialog class="share-dialog" id="shareDialog"><button class="dialog-close" data-close-dialog aria-label="关闭">${icon('close')}</button><p class="kicker">RELATION POSTER</p><h2>${esc(selectedHerb().nameZh)}的证据链</h2><p>把这次阅读中已登记的证据节点导出为一张可分享的 SVG 海报；没有档案的节点不会出现在海报上。</p><div class="poster-preview"><span>${esc(selectedHerb().nameZh)}</span><b>${esc(posterChain)}</b><small>本草宇宙 · ${esc(data.herbs.researchedAt)}</small></div><button class="primary-button" data-download-poster>下载 SVG 海报</button></dialog><dialog class="image-lightbox" id="imageLightbox" aria-label="本草照片来源"><div class="image-lightbox-card"><button class="dialog-close" data-image-close aria-label="关闭图片">${icon('close')}</button><div class="image-lightbox-empty">${icon('sparkle')}<p>点击任意本草照片查看大图与来源。</p></div></div></dialog>`;
  document.body.dataset.cosmosView = state.view;
  app.dataset.cosmosView = state.view;
  document.title = `${VIEW_NAMES[state.view] || '本草宇宙'} · 本草宇宙 · 百子万象`;
  if (preservePosition) window.scrollTo(0, scrollY);
  else window.scrollTo(0, 0);
  const restored = restoreFocus(focusSnapshot);
  if (!preservePosition) app.focus({ preventScroll: true });
  else if (!restored && document.activeElement === document.body) app.focus({ preventScroll: true });
  announceView();
  if (state.view === 'planet') mountPlanetExperience();
  if (state.view === 'atlas') mountAtlasExperience();
  if (state.view === 'cabinet') mountApothecaryExperience();
}

const VIEW_NAMES = { home: '宇宙首页', cabinet: '百子药堂', planet: '粒子星球', atlas: '生境地图', trace: '一味档案', library: '资料库', curation: '项目说明' };
let announcedView = '';

// The app re-renders the whole #app subtree on every interaction, so a live
// region inside it would be destroyed before it can speak. Announce route
// changes through a node that lives outside the rendered markup instead, and
// only when the route actually changes (search re-renders would otherwise
// repeat the same sentence on every keystroke).
function announceView() {
  if (announcedView === state.view) return;
  announcedView = state.view;
  announce(`已进入${VIEW_NAMES[state.view] || '本草宇宙'}`);
}

function announce(text) {
  const node = document.querySelector('#announcer');
  if (node) node.textContent = text;
}

// The visible library summary is rebuilt on every render, so read the count
// from the DOM after rendering rather than recomputing the filter pipeline.
function announceLibraryCount() {
  const total = document.querySelector('.library-summary b')?.textContent?.trim();
  if (total) announce(`当前结果 ${total} 条`);
}

function planet() {
  return planetModule.particlePlanetMarkup({ items: herbs(), activeHabitat: state.planetHabitat || 'all', query: state.planetQuery || '', selectedId: state.planetHerbId || '' });
}

function posterSvg(item) {
  const nodes = chainFor(item);
  const gap = 225;
  const startX = 500 - ((nodes.length - 1) * gap) / 2;
  const clip = (text, max) => { const t = String(text || '').replace(/[&<>]/g, ''); return t.length > max ? `${t.slice(0, max)}…` : t; };
  const texts = nodes.map((node, index) => `<text x="${startX + index * gap}" y="190" text-anchor="middle" fill="#151718" font-size="24" font-family="serif">${clip(node.title, 9)}</text><text x="${startX + index * gap}" y="220" text-anchor="middle" fill="#6a6157" font-size="14" font-family="sans-serif">${esc(node.label)}</text>`).join('');
  const links = nodes.slice(0, -1).map((_, index) => `<path d="M ${startX + index * gap + 58} 150 H ${startX + (index + 1) * gap - 58}" stroke="#b54a3a" stroke-width="2" stroke-dasharray="4 8"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="420" viewBox="0 0 1000 420"><rect width="1000" height="420" fill="#f5f0e8"/><rect x="34" y="34" width="932" height="352" fill="none" stroke="#c8bfb2"/><text x="80" y="95" fill="#b54a3a" font-size="13" font-family="sans-serif" letter-spacing="3">HERBAL COSMOS · TRACE</text><text x="80" y="140" fill="#151718" font-size="42" font-family="serif">${clip(item.nameZh, 12)} 的证据链</text>${links}${texts}<text x="80" y="330" fill="#6a6157" font-size="13" font-family="sans-serif">公开来源重新检索 · ${data.herbs.researchedAt} · 仅用于文化与植物学阅读</text></svg>`;
}

function bind() {
  const app = document.querySelector('#app');
  app.addEventListener('click', (event) => {
    clearTimeout(searchTimer);
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
      const correct = state.imageQuizSelected === state.imageQuizId;
      if (correct) state.imageQuizScore += 1;
      render();
      announce(correct ? '识别正确' : `识别错误，答案是${find(herbs(), state.imageQuizId)?.nameZh || '这味本草'}`);
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
    const habitatZone = event.target.closest('[data-cabinet-habitat]');
    const morphologyTab = event.target.closest('[data-cabinet-morphology]');
    const relationNode = event.target.closest('[data-relation-node]');
    const relationEdge = event.target.closest('[data-relation-id]');
    const compareHerb = event.target.closest('[data-compare-herb]');
    const node = event.target.closest('[data-node]');
    const stage = event.target.closest('[data-stage]');
    const filter = event.target.closest('[data-library-type]');
    const quickHabitat = event.target.closest('[data-library-quick-habitat]');
    if (event.target.closest('[data-library-more]')) { state.libraryLimit += 16; render(); return; }
    if (cabinetDrawer) {
      const item = find(herbs(), cabinetDrawer.dataset.herb);
      if (!item) return;
      const close = state.cabinetPicked && state.herbId === item.id;
      syncCabinetSelection(close ? null : item);
      if (hallEngine) hallEngine.update({ habitat: state.cabinetHabitat, morphology: state.cabinetMorphology, selectedId: close ? '' : item.id });
      else render();
      return;
    }
    if (event.target.closest('[data-cabinet-map]')) {
      state.atlasHerbId = state.herbId;
      state.atlasHabitat = 'all';
      state.view = 'atlas';
      history.pushState({ view: 'atlas' }, '', atlasHash(state.herbId));
      render();
      return;
    }
    if (compareHerb) { state.herbId = compareHerb.dataset.compareHerb; state.nodeId = state.herbId; state.stage = 'specimen'; state.view = 'trace'; state.compareOpen = true; state.compareId = ''; if (window.location.hash !== '#trace') history.pushState({ view: 'trace' }, '', '#trace'); render(); document.querySelector('.compare-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (habitatZone) {
      state.cabinetHabitat = habitatZone.dataset.cabinetHabitat;
      state.cabinetMorphology = 'all';
      state.cabinetPicked = false;
      state.libraryLimit = 24;
      const first = herbs().find((entry) => habitatFor(entry).id === state.cabinetHabitat);
      if (first) { state.herbId = first.id; state.nodeId = first.id; state.stage = 'specimen'; }
      if (hallEngine) {
        syncCabinetSelection(null);
        document.querySelectorAll('.apothecary-filters.morphology-filters').forEach((node) => { node.innerHTML = cabinetMorphologyMarkup(data, state.cabinetHabitat, state.cabinetMorphology); });
        hallEngine.update({ habitat: state.cabinetHabitat, morphology: state.cabinetMorphology, selectedId: '' });
      } else render();
      return;
    }
    if (morphologyTab) { state.cabinetMorphology = morphologyTab.dataset.cabinetMorphology; state.cabinetPicked = false; state.libraryLimit = 24; if (hallEngine) { syncCabinetSelection(null); hallEngine.update({ habitat: state.cabinetHabitat, morphology: state.cabinetMorphology, selectedId: '' }); } else render(); return; }
    if (event.target.closest('[data-cabinet-reset]')) { state.herbId = herbs()[0].id; state.nodeId = state.herbId; state.stage = 'specimen'; state.cabinetHabitat = habitatFor(herbs()[0]).id; state.cabinetMorphology = 'all'; state.cabinetPicked = false; if (hallEngine) { syncCabinetSelection(null); hallEngine.update({ habitat: state.cabinetHabitat, morphology: state.cabinetMorphology, selectedId: '' }); hallEngine.setView('outside'); } else render(); return; }
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
    if (view) {
      const target = view.dataset.view;
      const previousView = state.view;
      clearTimeout(searchTimer);
      state.view = target;
      if (herbButton) { state.herbId = herbButton.dataset.herb; state.compareId = ''; }
      if (target === 'trace' || target === 'cabinet') { state.nodeId = state.herbId; state.stage = 'specimen'; }
      if (target === 'cabinet' && previousView !== 'cabinet') { state.cabinetHabitat = habitatFor(selectedHerb()).id; state.cabinetMorphology = 'all'; state.cabinetPicked = false; }
      if (target === 'library') state.libraryLimit = 24;
      if (target === 'planet') state.planetQuery = '';
      if (target === 'atlas') { state.atlasHabitat = 'all'; state.atlasQuery = ''; }
      state.query = '';
      const hash = target === 'atlas' ? atlasHash() : `#${target}`;
      if (window.location.hash !== hash) history.pushState({ view: target }, '', hash);
      render();
      return;
    }
    if (herbButton) { state.herbId = herbButton.dataset.herb; state.compareId = ''; state.view = 'trace'; state.nodeId = state.herbId; state.stage = 'specimen'; render(); return; }
    if (stage) { state.stage = stage.dataset.stage; state.nodeId = stage.dataset.node; render(); return; }
    if (node) { state.nodeId = node.dataset.node; state.stage = node.dataset.stage; render(); return; }
    if (filter) { state.libraryType = filter.dataset.libraryType; state.libraryLimit = 24; render(); announceLibraryCount(); return; }
    if (quickHabitat) { state.libraryHabitat = quickHabitat.dataset.libraryQuickHabitat; state.libraryLimit = 24; render(); announceLibraryCount(); document.querySelector('.library-featured-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (event.target.closest('[data-compare]')) { state.compareOpen = true; render(); document.querySelector('.compare-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (event.target.closest('[data-share]')) { document.querySelector('#shareDialog')?.showModal(); return; }
    if (event.target.closest('[data-close-dialog]')) { document.querySelector('#shareDialog')?.close(); return; }
    if (event.target.closest('[data-download-poster]')) { const blob = new Blob([posterSvg(selectedHerb())], { type: 'image/svg+xml' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `本草关系海报-${selectedHerb().nameZh}.svg`; link.click(); URL.revokeObjectURL(url); return; }
  });
  window.addEventListener('popstate', () => { clearTimeout(searchTimer); applyHash(); state.query = ''; state.compareOpen = false; render(); });
  app.addEventListener('change', (event) => {
    if (event.target.matches('[data-compare-select]')) { state.compareId = event.target.value; state.compareOpen = true; render(); document.querySelector('.compare-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (event.target.matches('[data-library-habitat]')) { state.libraryHabitat = event.target.value; state.libraryLimit = 24; render(); announceLibraryCount(); return; }
    if (event.target.matches('[data-library-depth]')) { state.libraryDepth = event.target.value; state.libraryLimit = 24; render(); announceLibraryCount(); }
  });
  app.addEventListener('input', (event) => {
    if (!event.target.matches('[data-herb-search], [data-library-search]')) return;
    state.query = event.target.value;
    clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      render();
      if (state.view === 'library') announceLibraryCount();
    }, 150);
  });
  app.addEventListener('pointerdown', (event) => { const stage = event.target.closest('[data-specimen-stage]'); const model = stage?.querySelector('[data-specimen-model]'); if (!stage || !model) return; stage.setPointerCapture?.(event.pointerId); const startX = event.clientX; const startY = event.clientY; const baseX = Number(model.dataset.rx || 0); const baseY = Number(model.dataset.ry || 0); const move = (moveEvent) => { model.dataset.rx = baseX + (moveEvent.clientY - startY) * -0.35; model.dataset.ry = baseY + (moveEvent.clientX - startX) * 0.45; model.style.setProperty('--rx', `${model.dataset.rx}deg`); model.style.setProperty('--ry', `${model.dataset.ry}deg`); }; const up = () => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerup', up); }; stage.addEventListener('pointermove', move); stage.addEventListener('pointerup', up, { once: true }); });
  app.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelector('#imageLightbox')?.close();
      document.querySelector('#shareDialog')?.close();
      return;
    }
    const drawerTarget = event.target.closest('[data-cabinet-drawer]');
    const fallbackTarget = event.target.closest('[data-planet-fallback-id]');
    const rovingTarget = event.target.closest('[data-library-type], [data-library-quick-habitat], [data-planet-habitat], [data-atlas-habitat]');
    const horizontal = ['ArrowRight', 'ArrowDown'].includes(event.key);
    const vertical = ['ArrowLeft', 'ArrowUp'].includes(event.key);
    if ((drawerTarget || fallbackTarget || rovingTarget) && (horizontal || vertical)) {
      let selector = '';
      if (drawerTarget) selector = '[data-cabinet-drawer]:not([hidden])';
      else if (fallbackTarget) selector = '[data-planet-fallback-id]:not([hidden])';
      else if (event.target.matches('[data-library-type]')) selector = '[data-library-type]';
      else if (event.target.matches('[data-library-quick-habitat]')) selector = '[data-library-quick-habitat]';
      else if (event.target.matches('[data-planet-habitat]')) selector = '[data-planet-habitat]';
      else selector = '[data-atlas-habitat]';
      const scope = event.target.closest('[role="toolbar"], [role="group"], .drawer-shelf, [data-planet-fallback]') || document.querySelector('#app');
      const items = [...scope.querySelectorAll(selector)];
      const index = items.indexOf(event.target.closest(selector));
      if (index >= 0 && items.length > 1) {
        event.preventDefault();
        items[(index + (horizontal ? 1 : -1) + items.length) % items.length].focus();
        return;
      }
    }
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
  await render();
  bind();
}

boot().catch((error) => { document.querySelector('#app').innerHTML = `<main class="error-screen"><span class="loading-mark" aria-hidden="true">${icon('seal')}</span><h1>资料暂时无法打开</h1><p>${esc(error.message)}。请检查网络或重新加载页面。</p><button class="primary-button" onclick="location.reload()">重新加载</button></main>`; });
