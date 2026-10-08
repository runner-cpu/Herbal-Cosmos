/* ============================================================
   本草宇宙 · 交互美化层
   以 React Bits 组件文档为参考，零依赖原生实现：
   Aurora 极光背景 · Noise 噪点 · DotGrid 点阵
   BlurText 标题入场 · ShinyText 光泽小标题 · CountUp 数字滚动
   SpotlightCard 聚光 · TiltedCard 倾斜 · StarBorder 星光按钮
   Magnet 磁吸 · MagicRings 点击涟漪 · ScrollReveal 滚动揭示
   全部动效尊重 prefers-reduced-motion。
   ============================================================ */
(function () {
  'use strict';
  const reduce = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia
    && window.matchMedia('(pointer: fine)').matches;

  /* ---------- 1. 噪点层 ---------- */
  function addNoise() {
    if (document.getElementById('noiseLayer')) return;
    const div = document.createElement('div');
    div.id = 'noiseLayer';
    div.className = 'noise-layer';
    div.setAttribute('aria-hidden', 'true');
    document.body.append(div);
  }

  /* ---------- 2. BlurText：hero 标题逐字入场 ---------- */
  function blurTitle() {
    const targets = [
      document.querySelector('.hero-overlay h1'),
      document.querySelector('.hero-overlay .en'),
    ];
    targets.forEach(node => {
      if (!node || node.dataset.blurDone) return;
      node.dataset.blurDone = '1';
      const chars = (node.textContent || '').trim().split('');
      if (reduce || chars.length < 2) return;
      node.textContent = '';
      chars.forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'blur-char';
        span.textContent = ch;
        span.style.animationDelay = (0.08 + i * 0.055).toFixed(3) + 's';
        span.style.animationDuration = reduce ? '0s' : '.9s';
        node.append(span);
      });
      node.classList.add('blur-title');
    });
  }

  /* ---------- 3. ShinyText：小标题光泽 ---------- */
  function shinyKickers() {
    const sel = '.home-board-head>div>span:first-child,.home-subhead span,.home-source-copy>span,.section-kicker';
    document.querySelectorAll(sel).forEach(el => {
      if (reduce || el.dataset.shineDone) return;
      el.dataset.shineDone = '1';
      el.classList.add('kicker-shine');
    });
  }

  /* ---------- 4. CountUp：统计数字滚动 ---------- */
  const countTargets = () => [
    ...document.querySelectorAll('.evidence-rail .stat .v'),
  ];
  function runCountUp(el) {
    if (reduce || el.dataset.counted) return;
    el.dataset.counted = '1';
    // Preserve runtime-owned count nodes such as [data-food-count]. Replacing
    // the parent markup would remove their selectors after the first animation.
    const nested = el.querySelector('[data-food-count],[data-featured-count],[data-catalog-count]');
    // Dataset counts belong to the renderer and always remain readable.
    if (nested) return;
    const targetNode = el;
    const raw = (targetNode.textContent || '').replace(/,/g, '');
    const match = String(raw).match(/[\d.]+/);
    if (!match) return;
    const target = parseFloat(match[0]);
    if (!Number.isFinite(target)) return;
    const decimals = (match[0].split('.')[1] || '').length;
    const small = el.querySelector('small');
    const keep = small ? small.outerHTML : '';
    el.innerHTML = '<b class="n">' + target.toLocaleString('zh-CN') + '</b>' + keep;
    const n = el.querySelector('.n');
    const duration = 1300;
    const start = performance.now();
    const ease = t => (1 - Math.pow(1 - t, 3));
    const frame = now => {
      const p = Math.min(1, (now - start) / duration);
      const value = target * ease(p);
      n.textContent = decimals
        ? value.toFixed(decimals)
        : Math.round(value).toLocaleString('zh-CN');
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
  function countUpAll() { countTargets().forEach(runCountUp); }

  /* ---------- 5. SpotlightCard：卡片聚光 ---------- */
  function spotlight() {
    const cards = document.querySelectorAll('.home-module-grid .home-module');
    if (!finePointer || reduce) return;
    cards.forEach(card => {
      if (card.dataset.spotlightBound === '1') return;
      card.dataset.spotlightBound = '1';
      card.setAttribute('data-spotlight', '');
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--spot-y', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  }

  /* ---------- 6. TiltedCard + Glare：精选本草倾斜卡 ---------- */
  function tilt() {
    const cards = document.querySelectorAll('#homeFeatured .featured-herb');
    if (!finePointer || reduce) return;
    cards.forEach(card => {
      if (card.dataset.tiltBound === '1') return;
      card.dataset.tiltBound = '1';
      card.setAttribute('data-tilt', '');
      card.classList.add('tilt-glare');
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * 10;
        const ry = (px - 0.5) * 12;
        card.style.transform = 'perspective(620px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-3px)';
        card.style.setProperty('--glare-x', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--glare-y', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- 7. StarBorder + Magnet：hero CTA ---------- */
  function ctas() {
    const solid = document.querySelector('.hero-overlay .cta.solid');
    if (solid && !reduce) solid.classList.add('star-border');
    const buttons = document.querySelectorAll('.hero-overlay .cta');
    if (!finePointer || reduce) return;
    buttons.forEach(btn => {
      if (btn.dataset.magnetBound === '1') return;
      btn.dataset.magnetBound = '1';
      btn.classList.add('magnet');
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.transform = 'translate(' + (dx * 7).toFixed(1) + 'px,' + (dy * 5).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- 8. MagicRings：点击涟漪 ---------- */
  function rings() {
    if (reduce) return;
    document.addEventListener('click', e => {
      const tag = e.target && e.target.closest ? e.target.closest('a,button,input,select,summary,[role="button"]') : null;
      if (tag) return;
      const ring = document.createElement('span');
      ring.className = 'magic-ring';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
      document.body.append(ring);
      setTimeout(() => ring.remove(), 800);
    });
  }

  /* ---------- 9. ScrollReveal：滚动揭示 ---------- */
  let revealObserver = null;
  function reveal(container) {
    const els = (container || document).querySelectorAll(
      '.home-dashboard,.home-modules,.home-learning,.home-food,.home-classics,' +
      '.home-culture,.home-source-band,.home-featured-heading,#homeFeatured,' +
      '.analysis-dashboard,.graph-workspace,.insight-grid,.formula-directory,' +
      '.province-insight,.completeness-insight,.meridian-insight,.atlas-toolbar,' +
      '.evidence-rail'
    );
    if (!els.length) return;
    if (reduce) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('revealed'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.06, rootMargin: '0px 0px -36px 0px' });
    }
    els.forEach(el => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        revealObserver.observe(el);
      }
    });
  }

  /* ---------- 生命周期 ---------- */
  function boot() {
    addNoise();
    blurTitle();
    shinyKickers();
    countUpAll();
    spotlight();
    tilt();
    ctas();
    rings();
    reveal(document);
  }
  function rebind() {
    // 路由切换后重新绑定：数字滚动与滚动揭示只对新增 DOM 生效
    countUpAll();
    spotlight();
    tilt();
    reveal(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
  window.addEventListener('herbal:route', rebind);
})();
