/* 百子柜：首页的可交互 3D 药柜。
 *
 * 144 味代表本草各占一个抽屉，悬停拉开、点选读出知识卡。渲染在
 * apothecary-webgl.js（three.js，按需加载）；这里只管数据、筛选、文案与降级。
 * 没有 WebGL 时不起 3D，把同一批本草留在「本草图鉴」入口，不假装有柜子。
 *
 * 键盘按方向键在抽屉间移动，步长取决于渲染层当前的行列（横屏 16×9、
 * 竖屏 9×16），所以行列由 state() 汇报，这里绝不自己算。 */

export function apothecaryMarkup() {
  return '<div class="apothecary-stage">'
    + '<canvas id="apothecaryCanvas" aria-label="百子柜：用方向键移动，回车抽出抽屉" tabindex="0"></canvas>'
    + '<p class="apothecary-status" data-apothecary-status role="status">正在装配百子柜…</p>'
    + '<div class="apothecary-controls" role="group" aria-label="百子柜筛选">'
    + '<label class="apothecary-search"><span class="sr-only">在百子柜中查找本草</span><input type="search" data-apothecary-search placeholder="输入本草名称，定位对应抽屉" autocomplete="off"></label>'
    + '<div class="apothecary-chips" data-apothecary-chips role="group" aria-label="按资料分类筛选"></div>'
    + '<output class="apothecary-count" data-apothecary-count aria-live="polite"></output>'
    + '</div>'
    + '<aside class="apothecary-readout" data-apothecary-readout hidden aria-label="抽出的抽屉">'
    + '<p class="apothecary-kicker">抽出的这一屉</p>'
    + '<h3 data-apothecary-name>—</h3>'
    + '<p class="apothecary-attrs" data-apothecary-attrs></p>'
    + '<p class="apothecary-note" data-apothecary-note></p>'
    + '<div class="apothecary-actions"><a data-apothecary-open href="#/herbs">打开知识卡 →</a><button type="button" data-apothecary-close>推回抽屉</button></div>'
    + '</aside>'
    + '</div>';
}

function escape(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

/* 抽屉按大类分组，颜色沿用星图那套本草分类色，方便和知识卡对上。 */
const CHIP_COLORS = Object.freeze({
  '补虚药': '#D0A24C', '清热药': '#B84B3E', '解表药': '#7C9DB3', '活血化瘀药': '#9D86AF',
  '利水渗湿药': '#6B9E8A', '理气药': '#D88C61', '化痰止咳平喘药': '#86B8AF', '止血药': '#D7A4A3'
});

const KEY_MOVES = Object.freeze({ ArrowLeft: true, ArrowRight: true, ArrowUp: true, ArrowDown: true });

export function categoryChips(categories = []) {
  if (!categories.length) return '';
  return '<button type="button" data-apothecary-chip="" aria-pressed="true">全部</button>'
    + categories.map(item => '<button type="button" data-apothecary-chip="' + escape(item.name) + '" aria-pressed="false">'
      + '<i style="background:' + (CHIP_COLORS[item.name] || '#B9AC72') + '"></i>' + escape(item.name)
      + '<b>' + item.count + '</b></button>').join('');
}

export function drawerSummary(herb = {}) {
  if (!herb || !herb.name) return { name: '—', attrs: '', note: '', href: '#/herbs' };
  const nature = [herb.qi, herb.wei].filter(Boolean).join(' · ');
  const meridians = Array.isArray(herb.meridian) && herb.meridian.length ? '归经 ' + herb.meridian.join('、') : '';
  const category = herb.cat ? '资料分类 ' + herb.cat : '';
  const origin = Array.isArray(herb.origin) && herb.origin.length ? '分布记录 ' + herb.origin.join('、') : '';
  return {
    name: herb.name,
    attrs: [nature, meridians, category].filter(Boolean).join(' ｜ '),
    note: origin || String(herb.note || ''),
    href: '#/herb?id=' + encodeURIComponent(herb.id)
  };
}

/* 名称与拼音都算命中；空关键词视为全部命中。 */
export function matchHerbs(herbs = [], keyword = '', category = '') {
  const term = String(keyword || '').trim().toLowerCase();
  return herbs.reduce((hits, herb, index) => {
    const inCategory = !category || herb.cat === category;
    const haystack = [herb.name, herb.pinyin, herb.latin, ...(herb.aliases || [])].filter(Boolean).join(' ').toLowerCase();
    if (inCategory && (!term || haystack.includes(term))) hits.push(index);
    return hits;
  }, []);
}

export function categoryTally(herbs = [], limit = 6) {
  const tally = new Map();
  herbs.forEach(herb => { const key = herb.cat || '未录类别'; tally.set(key, (tally.get(key) || 0) + 1); });
  return [...tally.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, limit);
}

export function initApothecary() {
  const host = document.getElementById('apothecaryRoot');
  if (!host || host.dataset.mounted === 'true') return null;
  const herbs = (window.HERBS || []).filter(herb => !['formula-material', 'directory-only'].includes(herb.kind)).slice(0, 144);
  if (!herbs.length) { host.hidden = true; return null; }
  host.dataset.mounted = 'true';
  host.innerHTML = apothecaryMarkup();

  const stage = host.querySelector('.apothecary-stage');
  const dom = {
    canvas: host.querySelector('#apothecaryCanvas'),
    status: host.querySelector('[data-apothecary-status]'),
    readout: host.querySelector('[data-apothecary-readout]'),
    name: host.querySelector('[data-apothecary-name]'),
    attrs: host.querySelector('[data-apothecary-attrs]'),
    note: host.querySelector('[data-apothecary-note]'),
    open: host.querySelector('[data-apothecary-open]'),
    close: host.querySelector('[data-apothecary-close]'),
    count: host.querySelector('[data-apothecary-count]'),
    chips: host.querySelector('[data-apothecary-chips]'),
    search: host.querySelector('[data-apothecary-search]')
  };
  dom.chips.innerHTML = categoryChips(categoryTally(herbs));

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  let renderer = null;
  let raf = 0;
  let running = false;
  let last = 0;
  let selected = -1;
  let category = '';
  let term = '';
  let observer = null;
  let sizing = null;
  let inflight = null;

  function draw(herb) {
    const summary = drawerSummary(herb);
    dom.name.textContent = summary.name;
    dom.attrs.textContent = summary.attrs;
    dom.note.textContent = summary.note;
    dom.open.setAttribute('href', summary.href);
    dom.readout.hidden = !herb;
  }

  function select(index) {
    selected = Number.isInteger(index) && index >= 0 && index < herbs.length ? index : -1;
    renderer?.select(selected);
    draw(selected >= 0 ? herbs[selected] : null);
    return selected;
  }

  function syncCount(hits) {
    dom.count.textContent = hits === herbs.length
      ? herbs.length + ' 个抽屉 · 全部可读'
      : '命中 ' + hits + ' / ' + herbs.length + ' 个抽屉';
  }

  function applyFilter({ focusFirst = false } = {}) {
    const hits = matchHerbs(herbs, term, category);
    syncCount(hits.length);
    if (focusFirst && hits.length) select(hits[0]);
    else if (!hits.length) select(-1);
    return hits;
  }

  function loop() {
    if (!running || !renderer) return;
    const now = performance.now();
    const delta = Math.min(.05, (now - last) / 1000);
    last = now;
    renderer.tick(delta);
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (!renderer || running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function bindPointer() {
    dom.canvas.addEventListener('pointermove', event => {
      const index = renderer?.hoverAt(event.clientX, event.clientY);
      if (index >= 0) dom.status.textContent = '抽屉：' + herbs[index].name;
      else dom.status.textContent = '移动指针可拉开抽屉，点选读知识卡。';
    }, { passive: true });
    dom.canvas.addEventListener('pointerleave', () => {
      renderer?.clearHover();
      dom.status.textContent = '移动指针可拉开抽屉，点选读知识卡。';
    });
    dom.canvas.addEventListener('pointerdown', event => {
      const index = renderer?.hoverAt(event.clientX, event.clientY);
      if (index >= 0) select(index);
    });
    // 键盘是这套 3D 交互唯一可达的替代路径：方向键移动，回车/空格推拉。
    dom.canvas.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        select(selected >= 0 ? -1 : 0);
        return;
      }
      const grid = renderer?.state();
      if (!grid || !(event.key in KEY_MOVES)) return;
      event.preventDefault();
      // 还没抽出任何一屉时，第一次按方向键就落在第一屉上，不让用户先猜起点。
      select(selected < 0 ? 0 : HerbalApothecaryLayout.moveIndex(selected, event.key, grid, herbs.length));
    });
  }

  /* 渲染层是按需层：柜子滚进视口才下载 three.js，离线或档案页不该为它付流量。
   * 首批本草一进画面就起动；离开视口只停循环，不卸载已建好的柜子。 */
  function reveal() {
    if (inflight) return inflight;
    inflight = enhance().then(instance => {
      if (!instance) return null;
      if (reduced) { instance.tick(1 / 60); running = false; }
      else start();
      return instance;
    });
    return inflight;
  }

  function watchVisibility() {
    if (typeof IntersectionObserver === 'undefined') { reveal(); return; }
    observer = new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting && !document.hidden;
      if (!visible) { stop(); return; }
      if (!renderer) reveal();
      else if (!reduced) start();
    }, { threshold: .05 });
    observer.observe(dom.canvas);
  }

  /* 画布尺寸一变，行列就得重排：横屏 16×9 在竖屏下会把抽屉压成一条。
   * resize() 只在尺寸真的变了时才返回 true，静止画面这时候要补画一帧。 */
  function reframe() {
    if (!renderer?.resize()) return;
    if (reduced) renderer.tick(1 / 60);
  }

  function watchSize() {
    window.addEventListener('resize', reframe, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      sizing = new ResizeObserver(reframe);
      sizing.observe(dom.canvas);
    }
  }

  /* 渲染层是二十多万字节的按需包：装好之后请 worker 存一份，
   * 下次离线或被缓存清掉时柜子还开得起来。失败只是少一层离线兜底。 */
  function warmRendererCache() {
    try {
      if (navigator.serviceWorker?.controller) navigator.serviceWorker.controller.postMessage({ type: 'CACHE_APOTHECARY' });
    } catch { /* 缓存是增强，不能影响已经画出来的柜子。 */ }
  }

  async function enhance() {
    if (renderer) return renderer;
    if (!window.WebGLRenderingContext || location.protocol === 'file:') {
      dom.status.textContent = '当前环境不支持 3D 抽屉；本草图鉴可逐条查阅。';
      stage.dataset.mode = 'flat';
      return null;
    }
    try {
      const module = await import('../../vendor/apothecary-webgl.js');
      renderer = module.createApothecary(dom.canvas, {
        herbs,
        reducedMotion: reduced,
        onHover: herb => { if (herb) dom.status.textContent = '抽屉：' + herb.name; },
        onSelect: herb => {
          selected = herb ? herbs.indexOf(herb) : -1;
          draw(herb);
          dom.status.textContent = herb ? '已抽出 ' + herb.name + '。' : '抽屉已推回。';
        }
      });
      dom.canvas.dataset.renderer = 'apothecary';
      stage.dataset.mode = 'drawers';
      dom.status.textContent = '移动指针可拉开抽屉，点选读知识卡。';
      bindPointer();
      watchSize();
      warmRendererCache();
      return renderer;
    } catch (error) {
      dom.status.textContent = '这台设备的 3D 画面不可用；本草图鉴可继续查阅。';
      stage.dataset.mode = 'flat';
      return null;
    }
  }

  dom.chips.addEventListener('click', event => {
    const button = event.target.closest('[data-apothecary-chip]');
    if (!button) return;
    category = button.dataset.apothecaryChip || '';
    dom.chips.querySelectorAll('[data-apothecary-chip]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    applyFilter();
  });

  let timer = 0;
  dom.search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => { term = dom.search.value; applyFilter({ focusFirst: true }); }, 140);
  });
  dom.close.addEventListener('click', () => { select(-1); dom.canvas.focus({ preventScroll: true }); });
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', () => { if (renderer && !reduced) start(); });

  applyFilter();
  watchVisibility();

  window.HerbalApothecary = {
    herbs,
    select,
    filter: (keyword = '', nextCategory = '') => { term = keyword; category = nextCategory; return applyFilter({ focusFirst: true }); },
    perf: () => (renderer ? renderer.state() : null),
    dispose: () => {
      stop();
      observer?.disconnect();
      sizing?.disconnect();
      window.removeEventListener('resize', reframe);
      renderer?.dispose();
      renderer = null;
      inflight = null;
    }
  };
  return window.HerbalApothecary;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApothecary, { once: true });
  else initApothecary();
}
