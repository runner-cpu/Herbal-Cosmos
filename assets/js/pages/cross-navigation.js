export function formulaHref(formulaId, { source = 'zheng', zhengId = '' } = {}) {
  const params = new URLSearchParams({ f: formulaId });
  if (source) params.set('from', source);
  if (zhengId) params.set('z', zhengId);
  return '#/formula?' + params.toString();
}

export function zhengHref(zhengId, formulaId = '') {
  const params = new URLSearchParams({ z: zhengId });
  if (formulaId) params.set('f', formulaId);
  return '#/zheng?' + params.toString();
}

export function learnStep(value, total = 5) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.min(total, Math.max(1, Math.floor(numeric))) : 1;
}

export function quizFeedbackMarkup({ ok, note, correctLabel = '答对了！', retryLabel = '再想一想。' }) {
  return '<div class="quiz-note" role="status" tabindex="-1">' + (ok ? correctLabel : retryLabel) + ' ' + String(note || '') + '</div>';
}

function initCrossNavigation() {
  window.HerbalCrossNavigation = { formulaHref, zhengHref, learnStep, quizFeedbackMarkup };
  window.openQuizFeedback = result => {
    const target = document.getElementById('quizFeedback');
    if (!target) return;
    target.innerHTML = quizFeedbackMarkup(result);
    target.querySelector('[role="status"]')?.focus();
  };
  const feedback = document.getElementById('quizFeedback');
  if (feedback && typeof MutationObserver !== 'undefined') {
    new MutationObserver(() => { const status = feedback.querySelector('.quiz-note'); if (status) { status.setAttribute('role', 'status'); status.setAttribute('tabindex', '-1'); } }).observe(feedback, { childList: true, subtree: true });
  }
  document.addEventListener('keydown', event => { if (event.key === 'Escape') document.querySelector('#quizFeedback [role="status"]')?.remove(); });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCrossNavigation, { once: true });
  else initCrossNavigation();
}
