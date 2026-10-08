const THEMES = ['day', 'night', 'ink'];

function normalizeTheme(value) {
  return value === 'classic' ? 'ink' : (THEMES.includes(value) ? value : 'day');
}

function nextTheme(value) {
  const current = normalizeTheme(value);
  return THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
}

function readStorage(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function setTheme(theme, target = typeof document !== 'undefined' ? document.documentElement : null) {
  const value = normalizeTheme(theme);
  if (target) target.dataset.theme = value;
  if (typeof document !== 'undefined') {
    document.body?.classList.toggle('night', value === 'night');
    document.body?.classList.toggle('ink', value === 'ink');
  }
  try { localStorage.setItem('herbal_theme', value); } catch { /* storage is optional */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('herbal:theme', { detail: { theme: value } }));
  return value;
}

function initTheme() {
  const initial = normalizeTheme(readStorage('herbal_theme', document.documentElement.dataset.theme || 'day'));
  setTheme(initial);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTheme, { once: true });
  else initTheme();
  window.HerbalTheme = { THEMES, normalizeTheme, nextTheme, setTheme };
}
