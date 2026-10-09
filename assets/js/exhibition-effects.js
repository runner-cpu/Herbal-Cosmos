/* Reference-only inspiration: React Bits FadeContent and SpotlightCard.
 * Independently authored IntersectionObserver/CSS implementation; no component code. */
(function () {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new WeakSet();
  const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!reduced.matches) entry.target.classList.add('native-enter');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08 });
  function bind() {
    document.querySelectorAll('.hero-overlay,.cosmos-detail,.exhibit-heading,.exhibit-detail,.exhibit-figure').forEach(element => {
      if (seen.has(element)) return;
      seen.add(element); observer?.observe(element);
      if (element.matches('.hero-overlay,.exhibit-heading')) return;
      element.classList.add('native-spotlight');
      element.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch' || reduced.matches) return;
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--light-x', (event.clientX - rect.left) + 'px');
        element.style.setProperty('--light-y', (event.clientY - rect.top) + 'px');
      }, { passive: true });
    });
  }
  reduced.addEventListener('change', () => document.querySelectorAll('.native-enter').forEach(el => el.classList.remove('native-enter')));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true }); else bind();
  window.addEventListener('herbal:route', bind);
})();
