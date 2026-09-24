export const THEMES = ['day', 'night', 'classic'];

export function normalizeTheme(value) {
  return THEMES.includes(value) ? value : 'day';
}

export function nextTheme(value) {
  const current = normalizeTheme(value);
  return THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
}

function readStorage(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

export function setTheme(theme, target = typeof document !== 'undefined' ? document.documentElement : null) {
  const value = normalizeTheme(theme);
  if (target) target.dataset.theme = value;
  if (typeof document !== 'undefined') document.body?.classList.toggle('night', value === 'night');
  try { localStorage.setItem('herbal_theme', value); } catch { /* storage is optional */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('herbal:theme', { detail: { theme: value } }));
  return value;
}

function initTheme() {
  const button = document.getElementById('themeToggle');
  const initial = normalizeTheme(readStorage('herbal_theme', document.documentElement.dataset.theme || 'day'));
  setTheme(initial);
  const update = ({ detail } = {}) => {
    const value = normalizeTheme(detail?.theme || document.documentElement.dataset.theme);
    if (button) {
      button.dataset.theme = value;
      button.setAttribute('aria-label', '切换主题：' + (value === 'classic' ? '古籍' : value === 'night' ? '夜读' : '日间'));
      const label = button.querySelector('[data-theme-label]');
      if (label) label.textContent = value === 'classic' ? '古籍' : value === 'night' ? '夜读' : '日间';
    }
  };
  window.addEventListener('herbal:theme', update);
  update({ detail: { theme: initial } });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTheme, { once: true });
  else initTheme();
  window.HerbalTheme = { THEMES, normalizeTheme, nextTheme, setTheme };
}
