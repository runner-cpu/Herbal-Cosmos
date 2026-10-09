/* Native, static SVG scenes; semantic controls carry equivalent keyboard access. */
(function (root) {
  'use strict';
  const data = root.HerbalExhibitionCases;
  const esc = data.escapeXml;
  const noteKey = 'herbal_exhibition_notes_v1';
  let state, graph, pending = null, sourceOpen = false, noteOpen = false;
  const narrowScene = root.matchMedia('(max-width:480px)');
  let notes = {};
  const downloadUrls = new Set();
  try { const value = JSON.parse(localStorage.getItem(noteKey) || '{}'); if (value && typeof value === 'object' && !Array.isArray(value)) notes = value; } catch (_) {}
  const noteId = () => state.chapter + ':' + state.caseId + ':' + state.selected;
  const canonicalUrl = () => location.href.split('#')[0] + data.canonicalHash(state);
  const node = () => graph.nodes.find(n => n.id === state.selected) || graph.nodes[0];
  const claim = id => data.assertions.find(a => a.id === id);
  const entry = () => (state.chapter === 'compose' ? data.formulas : data.heritages).find(c => c.id === state.caseId);
  const caseLabel = () => state.chapter === 'recognize' ? '五味与八张本草卡' : entry().name;
  const button = n => '<button type="button" data-select="' + esc(n.id) + '" aria-pressed="' + (n.id === state.selected) + '">' + esc(n.label) + '</button>';
  function move(params, control, retainPosition = true) {
    pending = retainPosition ? { scroll: scrollY, control } : null;
    location.hash = data.canonicalHash(params);
  }
  function edgePath(edge, path) {
    const active = edge.source === state.selected || edge.target === state.selected;
    return '<path data-graph-edge="' + esc(edge.assertionId || '') + '" class="exhibit-edge ' + (active ? 'active ' : '') + esc(edge.type) + '" d="' + path + '"/>';
  }
  function svgNode(n, x, y, width = 154) {
    const active = n.id === state.selected;
    const meta = state.chapter === 'recognize' && n.kind === 'herb' ? n.wei || '未录入' : '';
    return '<g data-graph-node="' + esc(n.id) + '" data-select="' + esc(n.id) + '" class="exhibit-svg-node ' + esc(n.kind) + (active ? ' active' : '') + '"><rect x="' + (x - width / 2) + '" y="' + (y - 25) + '" width="' + width + '" height="50" rx="6"/><text x="' + x + '" y="' + (y + (meta ? -1 : 6)) + '" text-anchor="middle">' + esc(n.label) + '</text>' + (meta ? '<text class="node-meta" x="' + x + '" y="' + (y + 17) + '" text-anchor="middle">' + esc(meta) + '</text>' : '') + '</g>';
  }
  function scene() {
    const compact = narrowScene.matches;
    let drawing = '';
    const title = caseLabel() + '关系图；下方有同等功能的对象选择按钮。';
    if (state.chapter === 'recognize') {
      const positions = new Map();
      graph.nodes.filter(n => n.kind !== 'herb').forEach((n, i) => positions.set(n.id, compact ? [42, i < 5 ? 65 + i * 98 : 548 + (i - 5) * 58] : [100, i < 5 ? 65 + i * 78 : 462 + (i - 5) * 49]));
      graph.nodes.filter(n => n.kind === 'herb').forEach((n, i) => positions.set(n.id, compact ? [322, 70 + i * 82] : [535, 60 + i * 72]));
      drawing += graph.edges.map(e => { const from = positions.get(e.source), to = positions.get(e.target); return edgePath(e, compact ? 'M134 ' + from[1] + ' C185 ' + from[1] + ' 190 ' + to[1] + ' 245 ' + to[1] : 'M198 ' + from[1] + ' C305 ' + from[1] + ' 330 ' + to[1] + ' 458 ' + to[1]); }).join('');
      drawing += '<text class="scene-label" x="' + (compact ? 10 : 45) + '" y="24">传统五味</text><text class="scene-label" x="' + (compact ? 245 : 458) + '" y="24">' + (compact ? '一卡多味' : '项目知识卡 · 一卡多味') + '</text><text class="scene-label" x="' + (compact ? 10 : 32) + '" y="' + (compact ? 507 : 432) + '">' + (compact ? '补充与待补' : '补充味型与待补记录') + '</text>';
      drawing += graph.nodes.map(n => {
        const [x, y] = positions.get(n.id);
        if (n.kind === 'herb') return svgNode(n, x, y);
        if (compact && n.kind === 'missing') return svgNode(n, 70, y, 112);
        return '<g data-graph-node="' + esc(n.id) + '" data-select="' + esc(n.id) + '" class="exhibit-svg-node ' + esc(n.kind) + (n.id === state.selected ? ' active' : '') + '"><circle cx="' + x + '" cy="' + y + '" r="' + (n.kind === 'taste' ? 27 : 20) + '"/><text x="' + x + '" y="' + (y + 6) + '" text-anchor="middle">' + esc(n.label) + '</text>' + (n.phase ? '<text class="node-meta" x="' + (compact ? 78 : 138) + '" y="' + (y + 5) + '">' + esc(n.phase + ' · ' + n.colorName) + '</text>' : '') + '</g>';
      }).join('');
    } else if (state.chapter === 'compose') {
      const members = graph.nodes.slice(1), from = compact ? [92, 260] : [155, 292];
      const originY = compact ? 75 : 98, spread = compact ? 380 : 388;
      const endX = compact ? 242 : 428;
      drawing += '<text class="scene-label" x="' + (compact ? 17 : 59) + '" y="36">一方</text><text class="scene-label" x="' + endX + '" y="36">' + (compact ? '组成材料' : '组成材料 · 角色据教学图') + '</text>';
      drawing += graph.edges.map((e, i) => {
        const y = originY + i * (spread / Math.max(1, members.length - 1));
        const path = edgePath(e, compact ? 'M167 260 C205 260 205 ' + y + ' 242 ' + y : 'M250 292 C333 292 340 ' + y + ' 428 ' + y);
        return path + (state.roles ? '<text data-edge-role="' + esc(e.role || 'unassigned') + '" class="edge-role" x="' + (compact ? 204 : 353) + '" y="' + (y - 12) + '">' + esc(e.role || '未分配 · 来源受限') + '</text>' : '');
      }).join('');
      drawing += svgNode(graph.nodes[0], from[0], from[1], compact ? 150 : 190);
      drawing += members.map((n, i) => svgNode(n, compact ? 317 : 505, originY + i * (spread / Math.max(1, members.length - 1)))).join('');
      drawing += '<text class="scene-label" x="' + (compact ? 17 : 58) + '" y="' + (compact ? 504 : 555) + '">' + (compact ? '线条表示组成关系，不表示剂量。' : '线条表示组成关系；不表示剂量或临床贡献。') + '</text>';
    } else {
      const groups = ['practice', 'participant', 'transmission'];
      const labels = ['实践形式', '参与者／机构', '传递场景／记录'];
      groups.forEach((kind, i) => {
        const x = 118 + i * 232;
        const members = graph.nodes.filter(n => n.kind === kind);
        drawing += '<text class="scene-label" text-anchor="' + (compact ? 'start' : 'middle') + '" x="' + (compact ? 20 : x) + '" y="' + (compact ? 125 + i * 165 : 145) + '">' + labels[i] + '</text>';
        members.forEach((n, j) => {
          const y = compact ? 170 + i * 165 + Math.floor(j / 2) * 62 : 194 + j * 96;
          const nodeX = compact ? (j % 2 ? 307 : 113) : x;
          const busX = j % 2 ? 411 : 9;
          drawing += edgePath(graph.edges.find(e => e.target === n.id), compact ? 'M210 80 L210 98 L' + busX + ' 98 L' + busX + ' ' + y + ' L' + (j % 2 ? 397 : 23) + ' ' + y : 'M350 94 L350 117 L' + (x - 108) + ' 117 L' + (x - 108) + ' ' + y + ' L' + (x - 99) + ' ' + y);
          drawing += svgNode(n, nodeX, y, compact ? 180 : 198);
        });
      });
      drawing += svgNode(graph.nodes[0], compact ? 210 : 350, compact ? 55 : 69, 234);
      drawing += '<text class="scene-label" x="' + (compact ? 20 : 25) + '" y="' + (compact ? 622 : 558) + '">' + (compact ? '项目包含的关系，非操作顺序或师承。' : '三类线条均表示项目包含的关系，非操作顺序或师承谱系。') + '</text>';
    }
    const viewBox = compact ? (state.chapter === 'recognize' ? '0 0 420 710' : state.chapter === 'compose' ? '0 0 420 540' : '0 0 420 650') : '0 0 700 600';
    if (state.chapter === 'recognize') {
      const phaseKeys = ['wood', 'fire', 'earth', 'metal', 'water'];
      drawing += data.tastes.slice(0, 5).map((taste, i) => '<circle aria-hidden="true" class="exhibit-phase-swatch" data-phase="' + phaseKeys[i] + '" cx="' + (compact ? 42 : 100) + '" cy="' + ((compact ? 65 + i * 98 : 65 + i * 78) + 27) + '" r="6"/>').join('');
    }
    return '<svg class="exhibit-scene" viewBox="' + viewBox + '" role="img" aria-labelledby="exhibitSceneTitle"><title id="exhibitSceneTitle">' + esc(title) + '</title>' + drawing + '</svg>';
  }
  function evidence() {
    const chosen = node();
    if (chosen.assertionId) return [claim(chosen.assertionId)].filter(Boolean);
    if (state.chapter === 'recognize') {
      if (chosen.kind === 'taste') return [claim('five-correspondence')];
      return graph.edges.filter(e => e.source === chosen.id).map(e => claim(e.assertionId));
    }
    return graph.edges.map(e => claim(e.assertionId)).filter(Boolean);
  }
  function sourcesMarkup(records) {
    const fallback = state.chapter === 'recognize' ? data.sources.collection : entry().source;
    const usable = records.length ? records : [{ id: 'source-limited', source: fallback, evidenceNote: '所选分类当前没有关联记录；不据此补造本草关系。' }];
    const seen = new Set();
    return '<details class="exhibit-source-disclosure"' + (sourceOpen ? ' open' : '') + '><summary>来源与证据</summary><div class="exhibit-sources">' + usable.filter(r => { const key = r.source.url + r.source.locator; if (seen.has(key)) return false; seen.add(key); return true; }).map(r => '<article><a href="' + esc(r.source.url) + '"' + (r.source.url.startsWith('https:') ? ' target="_blank" rel="noopener"' : '') + '>' + esc(r.source.title) + ' ↗</a><p>' + esc(r.source.locator) + '</p><p>' + esc(r.evidenceNote) + '</p><small>核对日期 ' + esc(r.source.accessedAt) + ' · 项目整理</small></article>').join('') + (state.chapter === 'compose' ? '<a class="exhibit-diagram-link" href="' + esc(entry().diagram) + '" target="_blank" rel="noopener">查看原教学图与角色图例 ↗</a><p>本图为项目独立绘制，未复制来源图片。</p>' : '') + '</div></details>';
  }
  function detail() {
    const chosen = node(), records = evidence();
    let text = '', extra = '';
    if (state.chapter === 'recognize') {
      if (chosen.kind === 'herb') {
        text = '知识卡性味记录：' + (chosen.wei || '未录入') + '。' + records[0].statement;
        extra = herbActions(chosen.id, chosen.label);
      } else if (chosen.kind === 'taste') {
        text = chosen.label + '与' + chosen.phase + '、' + chosen.colorName + '相配。' + records[0].statement;
        const neighbors = graph.edges.filter(e => e.source === chosen.id).map(e => graph.nodes.find(n => n.id === e.target).label);
        extra = '<p class="exhibit-related">本次展例：' + (neighbors.length ? esc(neighbors.join('、')) : '暂无关联记录') + '</p>';
      } else text = chosen.kind === 'supplementary' ? '补充味型独立保留，不强行归入五行。此处仅展示所选知识卡记录中的连接。' : '未录入单独标示。当前八张展例均有已识别的味型；缺失不意味着没有属性。';
    } else if (state.chapter === 'compose') {
      text = chosen.kind === 'formula' ? entry().origin + '所载代表方。此处读取组成关系与HKBU教学图的角色解释。' : (records[0]?.statement || '未分配角色 · 来源受限。');
      extra = '<p class="exhibit-caveat">' + esc(entry().caveat) + '</p>' + (chosen.kind === 'herb' ? herbActions(chosen.id, chosen.label) : '') + '<a class="exhibit-archive-link" href="#/formula?f=' + esc(state.caseId) + '">查看原有方剂档案 ↗</a>';
    } else text = chosen.description;
    const takeaway = records[0]?.statement || text;
    return '<aside id="exhibitDetail" class="exhibit-detail" aria-live="polite"><span class="exhibit-eyebrow">正在阅读 · ' + esc(caseLabel()) + '</span><h2>' + esc(chosen.label) + '</h2><p class="exhibit-detail-copy">' + esc(text) + '</p>' + extra + '<p class="exhibit-boundary">' + esc(state.chapter === 'recognize' ? '五味是传统分类语言，不等同现代可测量的物理性质。药材连线据项目字段，经典只支持文化对应。' : state.chapter === 'compose' ? '传统解释约定，不表示药效大小。本展不展示剂量或配药建议。' : state.caseId === 'lum' ? '保持藏医药浴的独立文化语境。此展例不附会具体药材或中医五行。' : '展示项目记录的技艺文化关系；不生成加工教程或师承谱系。') + '</p>' + sourcesMarkup(records) + '<button type="button" class="exhibit-takeaway" data-takeaway="' + esc(takeaway) + '">将这条理解写入札记 ↓</button></aside>';
  }
  function herbActions(id, label) {
    const herb = root.HERBS.find(h => h.id === id);
    if (!herb) return '<p>相关知识卡尚未收录。</p>';
    const favorite = typeof isFav === 'function' && isFav(id);
    return '<div class="exhibit-detail-actions"><a href="#/herb?id=' + esc(id) + '">' + (label !== herb.name ? '相关知识卡：' + esc(herb.name) : '查看知识卡') + ' ↗</a><button type="button" data-fav="' + esc(id) + '" aria-label="' + (favorite ? '取消收藏' : '收藏') + esc(herb.name) + '">' + (favorite ? '已收藏' : '收藏') + '</button></div>';
  }
  function defaults() {
    const records = evidence(), selected = node();
    const source = records[0]?.source || (state.chapter === 'recognize' ? data.sources.collection : entry().source);
    return { object: caseLabel() + ' · ' + selected.label, takeaway: records[0]?.statement || selected.description || '记录你对这个对象的理解。', source: source.title + '\n' + source.url + '\n' + source.locator, url: canonicalUrl() };
  }
  function noteForm() {
    const saved = notes[noteId()], note = saved && typeof saved === 'object' ? { ...defaults(), ...saved, url: canonicalUrl() } : defaults();
    return '<details class="exhibit-note-disclosure"' + (noteOpen ? ' open' : '') + '><summary>阅读札记 · ' + (saved ? '已保存，可打开继续编辑' : '打开后写下自己的理解') + '</summary><section class="exhibit-note" aria-labelledby="exhibitNoteHeading"><div><span class="exhibit-eyebrow">读后留一页</span><h2 id="exhibitNoteHeading">我的阅读札记</h2><p>选择一条理解，改写成自己的话。札记只保存到本机，可导出为 SVG。</p><a href="#/learn">我的本草 · 测验与阅读足迹 ↗</a></div><form id="exhibitNoteForm"><label>阅读对象<input name="object" maxlength="160" value="' + esc(note.object) + '"></label><label>我的理解<textarea name="takeaway" rows="3" maxlength="1800">' + esc(note.takeaway) + '</textarea></label><label>资料来源<textarea name="source" rows="3" maxlength="1800">' + esc(note.source) + '</textarea></label><label>展览地址<input name="url" value="' + esc(note.url) + '" readonly></label><div class="exhibit-note-actions"><button type="submit">保存到本机</button><button type="button" data-export-note>导出 SVG 札记</button></div><p id="exhibitNoteStatus" role="status">' + (saved ? '已读取本机札记。' : '尚未保存。可用键盘操作所有字段与按钮。') + '</p></form></section></details>';
  }
  function readForm() { return Object.fromEntries(new FormData(document.getElementById('exhibitNoteForm'))); }
  function saveNote() {
    notes[noteId()] = { ...readForm(), url: canonicalUrl() };
    let local = true;
    try { localStorage.setItem(noteKey, JSON.stringify(notes)); } catch (_) { local = false; }
    document.getElementById('exhibitNoteStatus').textContent = local ? '已保存到本机。可继续修改或导出。' : '本机存储不可用，札记已暂存本次页面；请导出保留。';
    document.querySelector('.exhibit-note-disclosure summary').textContent = local ? '阅读札记 · 已保存，可打开继续编辑' : '阅读札记 · 本次页面暂存';
  }
  function render(params = {}) {
    state = data.resolveState(params);
    graph = state.chapter === 'recognize' ? data.recognitionGraph(root.HERBS) : state.chapter === 'compose' ? data.formulaGraph(state.caseId) : data.heritageGraph(state.caseId);
    // Missing dataset IDs never become invented SVG nodes or broken detail targets.
    if (!graph.nodes.some(n => n.id === state.selected)) state.selected = graph.nodes[0]?.id || '';
    const host = document.getElementById('exhibitionRoot');
    if (!host) return;
    const chapter = data.chapters.find(c => c.id === state.chapter);
    const cases = state.chapter === 'compose' ? data.formulas : state.chapter === 'inherit' ? data.heritages : [];
    host.dataset.chapter = state.chapter;
    host.innerHTML = '<div class="exhibit-heading"><span class="exhibit-eyebrow">文化长卷 · 三章阅读</span><h1><span>' + chapter.number + '</span>' + esc(chapter.title) + '</h1><p class="exhibit-subtitle">' + esc(chapter.subtitle) + '</p><p>' + esc(chapter.description) + '</p></div><nav class="exhibit-chapters" aria-label="长卷章节">' + data.chapters.map(c => '<a data-chapter="' + c.id + '" href="' + esc(data.canonicalHash({ chapter: c.id })) + '"' + (c.id === state.chapter ? ' aria-current="page"' : '') + '><span>' + c.number + '</span>' + c.title + '</a>').join('') + '</nav>' + (cases.length ? '<div class="exhibit-cases" role="group" aria-label="选择展例">' + cases.map(c => '<button type="button" data-case="' + c.id + '" aria-pressed="' + (c.id === state.caseId) + '">' + esc(c.name) + '</button>').join('') + '</div>' : '') + '<div class="exhibit-layout"><section class="exhibit-figure" aria-label="' + esc(caseLabel()) + '"><div class="exhibit-figure-top"><span>' + esc(caseLabel()) + '</span>' + (state.chapter === 'compose' ? '<button type="button" data-role-toggle aria-pressed="' + state.roles + '">' + (state.roles ? '隐藏角色标注' : '显示有据角色') + '</button>' : '<span>' + graph.nodes.length + ' 个对象 · ' + graph.edges.length + ' 条关系</span>') + '</div>' + scene() + '<div class="exhibit-legend">' + (state.chapter === 'recognize' ? '五味与五行对应 · 淡／涩为补充味型 · 未录入独立标示' : state.chapter === 'compose' ? '组成关系 → 角色解释可切换；每条角色有对应教学图证据' : '实践形式 ／ 参与者 ／ 传递场景 · 每个对象可打开证据') + '</div><details class="exhibit-object-list" open><summary>选择阅读对象 · 键盘等效列表</summary><div role="group" aria-label="阅读对象选择">' + graph.nodes.map(button).join('') + '</div></details></section>' + detail() + '</div>' + (state.chapter === 'recognize' ? '<a class="exhibit-archive-link exhibit-full-atlas" href="#/qiwei?view=wei">进入本草图鉴，查看完整性味统计 ↗</a>' : '') + noteForm();
    host.onclick = event => {
      const target = event.target.closest('[data-select],[data-case],[data-role-toggle],[data-takeaway],[data-export-note]');
      if (!target) return;
      if (target.hasAttribute('data-select')) move({ ...state, selected: target.dataset.select }, ['data-select', target.dataset.select]);
      else if (target.hasAttribute('data-case')) move({ chapter: state.chapter, case: target.dataset.case }, ['data-case', target.dataset.case]);
      else if (target.hasAttribute('data-role-toggle')) move({ ...state, roles: !state.roles }, ['data-role-toggle', '']);
      else if (target.hasAttribute('data-takeaway')) {
        const form = document.getElementById('exhibitNoteForm');
        host.querySelector('.exhibit-note-disclosure').open = true;
        noteOpen = true;
        form.elements.takeaway.value = target.dataset.takeaway;
        form.elements.takeaway.focus();
        document.getElementById('exhibitNoteStatus').textContent = '理解已写入，可编辑后保存。';
      } else {
        const url = URL.createObjectURL(new Blob([data.noteSvg({ ...readForm(), url: canonicalUrl() })], { type: 'image/svg+xml;charset=utf-8' }));
        downloadUrls.add(url);
        const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'herbal-reading-note.svg'; anchor.click();
        setTimeout(() => { URL.revokeObjectURL(url); downloadUrls.delete(url); }, 0);
        document.getElementById('exhibitNoteStatus').textContent = 'SVG 札记已导出。';
      }
    };
    host.querySelector('.exhibit-source-disclosure').ontoggle = event => { sourceOpen = event.target.open; };
    host.querySelector('.exhibit-note-disclosure').ontoggle = event => { noteOpen = event.target.open; };
    const atlas = host.querySelector('.exhibit-full-atlas');
    if (atlas) atlas.href = '#/qiwei?chart=wei';
    document.getElementById('exhibitNoteForm').onsubmit = event => { event.preventDefault(); saveNote(); };
    if (pending) {
      const restore = pending; pending = null;
      requestAnimationFrame(() => {
        const [key, value] = restore.control;
        const control = Array.from(host.querySelectorAll('button[' + key + ']')).find(el => el.getAttribute(key) === value);
        control?.focus({ preventScroll: true });
        window.scrollTo({ top: restore.scroll, behavior: 'instant' });
      });
    }
  }
  function dispose() { downloadUrls.forEach(url => URL.revokeObjectURL(url)); downloadUrls.clear(); pending = null; }
  root.addEventListener('herbal:route', event => { if (event.detail?.route !== 'exhibit') dispose(); });
  root.addEventListener('pagehide', dispose);
  narrowScene.addEventListener('change', () => {
    const current = document.querySelector('.page[data-route="exhibit"].active .exhibit-scene');
    if (current && graph) current.outerHTML = scene();
  });
  root.HerbalExhibition = { render };
})(window);
