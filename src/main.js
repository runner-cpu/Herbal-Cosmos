import { relationExplorer } from './relations.js';
import { renderCosmosHeader, renderCosmosHome, renderHabitatCabinet, habitatFor } from './ui-layout.js?v=redesign-v1-20261020-1';
import { particlePlanetMarkup, mountParticlePlanet } from './planet.js?v=redesign-v1-20261020-1';
import { icon } from './icons.js?v=redesign-v1-20261020-1';

const ROOT = './src/data/curated/';
// Keep the catalog cache key independent from the application shell. GitHub Pages
// can retain a previously fetched JSON response even after the JS bundle updates.
const DATA_VERSION = 'redesign-v1-20261020-1';
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
  compareId: '',
  compareOpen: false,
  relationFocus: '',
  cabinetHabitat: 'forest',
  cabinetMorphology: 'all',
  cabinetPicked: false,
  planetHabitat: 'all',
  planetHerbId: '',
  imageQuizOpen: false,
  imageQuizId: '',
  imageQuizOptions: [],
  imageQuizAnswered: false,
  imageQuizSelected: '',
  imageQuizScore: 0,
};
let data = null;
let disposePlanet = null;

const VIEW_IDS = ['home', 'cabinet', 'planet', 'trace', 'library', 'curation'];

function applyHash() {
  const value = window.location.hash.replace(/^#/, '');
  if (!value || VIEW_IDS.includes(value)) {
    state.view = value || 'home';
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
  const habitatOptions = `<option value="all">全部生境</option>${habitatLabels.map((label) => `<option value="${esc(label)}" ${state.libraryHabitat === label ? 'selected' : ''}>${esc(label)}</option>`).join('')}`;
  const depthOptions = `<option value="all">全部深度</option><option value="deep" ${state.libraryDepth === 'deep' ? 'selected' : ''}>深度条目 · 16</option><option value="overview" ${state.libraryDepth === 'overview' ? 'selected' : ''}>拓展条目 · 104</option>`;
  const quickHabitats = habitatLabels.map((label) => { const count = featuredCatalog.filter((item) => item.habitat === label).length; return `<button class="library-habitat-chip ${state.libraryHabitat === label ? 'is-active' : ''}" data-library-quick-habitat="${esc(label)}" aria-pressed="${state.libraryHabitat === label}"><span>${esc(label)}</span><b>${count}</b></button>`; }).join('');
  const noResults = !featured.length && !expanded.length ? '<div class="empty-state"><strong>没有匹配项</strong><p>换一个关键词，或清除筛选重新浏览。</p></div>' : '';
  return `<main class="library-view" aria-labelledby="library-title"><div class="page-intro library-intro"><div><p class="kicker">OPEN LIBRARY · 16 FEATURED / 104 EXPANDED</p><h1 id="library-title">先读精品，再查全量。</h1><p>先从 16 味深度档案进入本草的形态、生境和证据，再把筛选器打开到 104 味拓展目录。资料库保留全量数据，但让第一次进入的人先看到最有解释力的部分。</p></div><div class="intro-actions"><button class="quiet-button" data-view="trace">← 回到一味档案</button><button class="primary-button compact" data-image-quiz-open>${state.imageQuizOpen ? '收起看图识本草' : '看图识本草 ↗'}</button></div></div><div class="library-proof"><div><b>16</b><span>味深度档案</span></div><div><b>104</b><span>味拓展目录</span></div><div><b>6</b><span>类主生境</span></div><div class="library-proof-note">每一张卡片都保留照片、来源和阅读边界。</div></div><div class="library-featured-index"><div><span class="panel-label">FEATURED HABITATS</span><h2>先按生境找到一组精品。</h2></div><div class="library-habitat-chips"><button class="library-habitat-chip ${state.libraryHabitat === 'all' ? 'is-active' : ''}" data-library-quick-habitat="all" aria-pressed="${state.libraryHabitat === 'all'}"><span>全部精品</span><b>${featured.length}</b></button>${quickHabitats}</div></div><div class="library-toolbar"><label class="search-box wide"><span aria-hidden="true">${icon('search')}</span><input data-library-search value="${esc(state.query)}" placeholder="搜索本草、方剂、学名、形态或来源关键词" aria-label="搜索资料库全部条目" /></label><div class="filter-tabs" role="group" aria-label="按条目类型筛选">${['all', '本草', '方剂', '文化锚点'].map((value) => `<button class="filter-tab ${state.libraryType === value ? 'active' : ''}" data-library-type="${value}" aria-pressed="${state.libraryType === value}">${value === 'all' ? '全部' : value}</button>`).join('')}</div><div class="library-selects"><label>生境<select data-library-habitat>${habitatOptions}</select></label><label>深度<select data-library-depth>${depthOptions}</select></label></div></div><div class="library-summary"><span>当前结果 <b>${items.length}</b></span><span>精品结果 <b>${featured.length}</b></span><span>拓展及关联 <b>${expanded.length}</b></span><span>重新检索于 ${esc(data.herbs.researchedAt)}</span></div>${state.imageQuizOpen ? imageQuiz() : ''}${featured.length ? `<section class="library-section library-featured-section" aria-labelledby="library-featured-title"><div class="library-section-heading"><div><span class="section-index">01 / DEEP ARCHIVE</span><h2 id="library-featured-title">16 味精品图谱</h2><p>从形态与生境进入，再回到一味档案读完整证据链。</p></div><span class="library-section-count">${featured.length} / 16</span></div><div class="library-grid library-featured-grid">${featured.map((item) => libraryCard(item, true)).join('')}</div></section>` : ''}${expanded.length ? `<section class="library-section library-expanded-section" aria-labelledby="library-expanded-title"><div class="library-section-heading"><div><span class="section-index">02 / OPEN CATALOG</span><h2 id="library-expanded-title">拓展目录与关联资料</h2><p>104 味本草和方剂、文化锚点在这里展开，筛选器会同步作用于全量结果。</p></div><span class="library-section-count">${expanded.length} 条结果</span></div><div class="library-grid library-expanded-grid">${expanded.map((item) => libraryCard(item)).join('')}</div></section>` : ''}${noResults}</main>`;
}

/**
 * Project statement page. Judges and first-time readers need one place that
 * states what the object is, how it is built, and what it deliberately does
 * not claim. Counts are computed from the dataset so the page cannot drift.
 */
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
  return `<main class="curation-view" aria-labelledby="curation-title"><div class="page-intro"><div><p class="kicker">PROJECT NOTES · 项目说明</p><h1 id="curation-title">把一部草木志，<br />做成可以漫游的空间。</h1><p>这一页写给第一次打开网站的人：它是什么、怎么被做出来、哪些话有来源、哪些地方还不足。所有数字都从当前数据集实时计算。</p></div><div class="intro-actions"><button class="quiet-button" data-view="home">← 回到首页</button><button class="primary-button compact" data-view="trace">直接读一味档案 ↗</button></div></div><div class="curation-grid"><section class="curation-block"><span class="section-index">01 / POSITION</span><h2>为什么用“宇宙”讲本草</h2><p>本草是一套被连续书写了约两千年的知识系统：同一株草被不同朝代命名、校补、入方，又被现代的植物学与药典重新定位。单篇图文很难让人看见这种“层层叠加”的结构。</p><p>所以这里不按时间轴排布，而把 ${herbCount} 味本草放进两个空间：白天的百子柜按生境归位，夜里的粒子星球按关系聚拢。同一味本草在两个空间里位置不同，读者可以对照着理解“它长在哪里”和“它被谁引用”。</p></section><section class="curation-block"><span class="section-index">02 / DATA</span><h2>三层数据，三种精度</h2><p>站点不做“全部同等可信”的暗示，而是把精度分层写出来：</p><dl class="curation-facts"><div><dt>深度档案</dt><dd>${deepCount} 味：逐条来源定位到药典条目或植物志物种处理页，配识形台与相似药材对照。</dd></div><div><dt>目录条目</dt><dd>${overviewCount} 味：保留学名、科属、部位、生境和来源入口，用于检索与全量浏览。</dd></div><div><dt>关系与方剂</dt><dd>${relationCount} 条关系、${formulaCount} 个方剂、${anchorCount} 个文化锚点、${comparisonCount} 组相似药材、${specimenCount} 个结构化标本，全部登记来源。</dd></div><div><dt>公开来源</dt><dd>${sourceCount} 个：药典、Flora of China、NCBI Taxonomy、POWO、Chinese Text Project、WHO、Nobel Prize 等公开入口。</dd></div></dl><p class="curation-note">图片来自公开植物观测记录（iNaturalist / GBIF 等），逐张保留作者、数据集、许可与观测页链接，可在灯箱内点开核对。</p></section><section class="curation-block"><span class="section-index">03 / BUILD</span><h2>零框架，一条命令验证</h2><p>没有打包器、没有前端框架、没有运行时依赖：原生 ES Modules 加一份样式表，数据是静态 JSON。粒子星球、百子柜抽屉、识形台都是手写的 CSS 3D 与 Canvas 2D，不加载任何图表或 3D 库。</p><p>构建脚本只做一件事——校验入口文件存在、八个 JSON 可解析；测试脚本检查数据连通性、来源引用和关系图的可达性。任何人都可以用任意静态服务器打开同一份产物。</p></section><section class="curation-block"><span class="section-index">04 / ACCESS</span><h2>没有鼠标也能读完</h2><p>键盘可达的焦点环覆盖全站；粒子星球提供可展开的文本目录，读屏会播报选择与筛选结果；抽屉、灯箱、海报弹窗都能用 Esc 关闭；对比度按 WCAG AA 校核过；系统开启“减少动态效果”后，漂浮粒子、连线动画和惯性旋转都会停止。</p><p>当 Canvas 不可用时，星球页直接降级为 ${herbCount} 味的可滚动目录，而不是留一块空白。</p></section><section class="curation-block curation-block-wide"><span class="section-index">05 / WALKTHROUGH</span><h2>三分钟能看完什么</h2><ol class="curation-steps"><li><b>首页 30 秒</b><span>看两个入口的分工，再读“后来走到了哪里”三条公开记录。</span></li><li><b>百子柜 60 秒</b><span>按生境抽一格，看抽屉抽出、右侧档案同步更新；再用形态标签收拢视线。</span></li><li><b>一味档案 60 秒</b><span>拖动识形台，看证据链只剩已登记节点，点开右侧来源逐条核对。</span></li><li><b>粒子星球 30 秒</b><span>拖动旋转、滚轮缩放、点击一粒星光，或展开键盘目录。</span></li></ol></section><section class="curation-block curation-block-wide"><span class="section-index">06 / LIMITS</span><h2>我们还没有做到的部分</h2><p>把不足写在这里，比让读者自己发现更诚实：</p><ul class="curation-limits"><li><b>证据链长度不均</b>：${herbCount} 味中，只有 ${withClassic} 味登记了古典文本锚点、${withFormula} 味登记了方剂组成、${withResearch} 味登记了现代研究史节点。缺口用一段说明写清楚，不用占位节点补足。</li><li><b>图片是物种级而非药材级</b>：照片来自对应的植物学名观测，展示的是原植物，不是饮片或炮制品；同一物种的不同药用部位会共用同一张观测照片，灯箱里保留了原始观测链接。</li><li><b>古籍定位仍是入口级</b>：Chinese Text Project 的条目目前定位到书名与检索方式，尚未逐卷逐页校对。</li><li><b>没有医疗建议</b>：全站不提供剂量、处方、替代治疗或个体化建议；传统分类与现代研究分层标注，不互相替代。</li></ul></section></div><section class="curation-sources"><div><span class="panel-label">PUBLIC SOURCES</span><h2>来源清单</h2></div>${renderSources(sources().map((source) => source.id))}<p class="curation-note">数据集 ${esc(data.herbs.datasetId)} · 最近检索 ${esc(data.herbs.researchedAt)} · 图片许可覆盖 ${licences.length} 种公开许可（含 CC BY、CC BY-NC、CC BY-SA、CC0 与公共领域）。</p></section></main>`;
}

function render() {
  if (!data) return;
  disposePlanet?.();
  disposePlanet = null;
  const content = state.view === 'trace' ? trace() : state.view === 'library' ? library() : state.view === 'cabinet' ? cabinetPage() : state.view === 'planet' ? planet() : state.view === 'curation' ? curation() : home();
  const routeNotice = state.routeMiss
    ? `<p class="route-miss" role="alert">没有找到 <code>#${esc(state.routeMiss)}</code> 这个页面，已回到宇宙首页。<button class="quiet-button" data-view="library">去资料库搜索</button></p>`
    : '';
  const posterChain = chainFor(selectedHerb()).map((node) => node.label).join(' → ');
  document.querySelector('#app').innerHTML = `${header()}${routeNotice}${content}<footer class="site-footer"><span>本草宇宙 · 百子万象</span><span>无需账号 · 无遥测 · 资料用于文化与植物学阅读，不构成医疗建议</span><span>${esc(data.herbs.catalogStats?.total || herbs().length)} 味目录 · ${esc(data.herbs.datasetId)}</span></footer><dialog class="share-dialog" id="shareDialog"><button class="dialog-close" data-close-dialog aria-label="关闭">${icon('close')}</button><p class="kicker">RELATION POSTER</p><h2>${esc(selectedHerb().nameZh)}的证据链</h2><p>把这次阅读中已登记的证据节点导出为一张可分享的 SVG 海报；没有档案的节点不会出现在海报上。</p><div class="poster-preview"><span>${esc(selectedHerb().nameZh)}</span><b>${esc(posterChain)}</b><small>本草宇宙 · ${esc(data.herbs.researchedAt)}</small></div><button class="primary-button" data-download-poster>下载 SVG 海报</button></dialog><dialog class="image-lightbox" id="imageLightbox" aria-label="本草照片来源"><div class="image-lightbox-card"><button class="dialog-close" data-image-close aria-label="关闭图片">${icon('close')}</button><div class="image-lightbox-empty">${icon('sparkle')}<p>点击任意本草照片查看大图与来源。</p></div></div></dialog>`;
  document.body.dataset.cosmosView = state.view;
  document.querySelector('#app').dataset.cosmosView = state.view;
  announceView();
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

const VIEW_NAMES = { home: '宇宙首页', cabinet: '百子柜', planet: '粒子星球', trace: '一味档案', library: '资料库', curation: '项目说明' };
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
  return particlePlanetMarkup({ items: herbs(), activeHabitat: state.planetHabitat || 'all', query: state.query || '', selectedId: state.planetHerbId || '' });
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
    if (cabinetDrawer) { state.herbId = cabinetDrawer.dataset.herb; state.nodeId = state.herbId; state.stage = 'specimen'; state.compareId = ''; state.cabinetPicked = true; render(); return; }
    if (compareHerb) { state.herbId = compareHerb.dataset.compareHerb; state.nodeId = state.herbId; state.stage = 'specimen'; state.view = 'trace'; state.compareOpen = true; state.compareId = ''; if (window.location.hash !== '#trace') history.pushState({ view: 'trace' }, '', '#trace'); render(); document.querySelector('.compare-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (habitatZone) {
      state.cabinetHabitat = habitatZone.dataset.cabinetHabitat;
      state.cabinetMorphology = 'all';
      state.cabinetPicked = false;
      const first = herbs().find((entry) => habitatFor(entry).id === state.cabinetHabitat);
      if (first) { state.herbId = first.id; state.nodeId = first.id; state.stage = 'specimen'; }
      render();
      return;
    }
    if (morphologyTab) { state.cabinetMorphology = morphologyTab.dataset.cabinetMorphology; state.cabinetPicked = false; render(); return; }
    if (event.target.closest('[data-cabinet-reset]')) { state.herbId = herbs()[0].id; state.nodeId = state.herbId; state.stage = 'specimen'; state.cabinetHabitat = habitatFor(herbs()[0]).id; state.cabinetMorphology = 'all'; state.cabinetPicked = false; render(); return; }
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
    if (view) { const previousView = state.view; state.view = view.dataset.view; if (herbButton) { state.herbId = herbButton.dataset.herb; state.compareId = ''; } if (state.view === 'trace') { state.nodeId = state.herbId; state.stage = 'specimen'; } if (state.view === 'cabinet' && previousView !== 'cabinet') { state.cabinetHabitat = habitatFor(selectedHerb()).id; state.cabinetMorphology = 'all'; state.cabinetPicked = false; } state.query = ''; if (window.location.hash !== `#${state.view}`) history.pushState({ view: state.view }, '', `#${state.view}`); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (herbButton) { state.herbId = herbButton.dataset.herb; state.compareId = ''; state.view = 'trace'; state.nodeId = state.herbId; state.stage = 'specimen'; render(); return; }
    if (stage) { state.stage = stage.dataset.stage; state.nodeId = stage.dataset.node; render(); return; }
    if (node) { state.nodeId = node.dataset.node; state.stage = node.dataset.stage; render(); return; }
    if (filter) { state.libraryType = filter.dataset.libraryType; render(); announceLibraryCount(); return; }
    if (quickHabitat) { state.libraryHabitat = quickHabitat.dataset.libraryQuickHabitat; render(); announceLibraryCount(); document.querySelector('.library-featured-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (event.target.closest('[data-compare]')) { state.compareOpen = true; render(); document.querySelector('.compare-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (event.target.closest('[data-share]')) { document.querySelector('#shareDialog')?.showModal(); return; }
    if (event.target.closest('[data-close-dialog]')) { document.querySelector('#shareDialog')?.close(); return; }
    if (event.target.closest('[data-download-poster]')) { const blob = new Blob([posterSvg(selectedHerb())], { type: 'image/svg+xml' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `本草关系海报-${selectedHerb().nameZh}.svg`; link.click(); URL.revokeObjectURL(url); return; }
  });
  window.addEventListener('popstate', () => { applyHash(); state.query = ''; state.compareOpen = false; render(); });
  app.addEventListener('change', (event) => {
    if (event.target.matches('[data-compare-select]')) { state.compareId = event.target.value; state.compareOpen = true; render(); document.querySelector('.compare-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (event.target.matches('[data-library-habitat]')) { state.libraryHabitat = event.target.value; render(); announceLibraryCount(); return; }
    if (event.target.matches('[data-library-depth]')) { state.libraryDepth = event.target.value; render(); announceLibraryCount(); }
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

boot().catch((error) => { document.querySelector('#app').innerHTML = `<main class="error-screen"><span class="loading-mark" aria-hidden="true">${icon('seal')}</span><h1>资料暂时无法打开</h1><p>${esc(error.message)}。请检查网络或重新加载页面。</p><button class="primary-button" onclick="location.reload()">重新加载</button></main>`; });
