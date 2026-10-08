function filterApproved(entries = []) {
  return entries.filter(entry => entry && entry.status !== 'review' && entry.status !== 'rejected');
}

function initSearchShell() {
  const input = document.getElementById('globalSearch');
  const box = input?.closest('.searchbox');
  if (!input || !box) return;
  let hint = document.getElementById('searchScopeHint');
  if (!hint) {
    hint = document.createElement('span');
    hint.id = 'searchScopeHint';
    hint.className = 'search-scope-hint';
    hint.textContent = '知识卡与名称索引分层展示；索引无药性';
    box.append(hint);
  }
  input.setAttribute('aria-describedby', 'searchScopeHint');
  window.HerbalSearch = { filterApproved };
  const results = document.getElementById('searchResults');
  const decorate = () => {
    const herbs = window.HERBS || [];
    results?.querySelectorAll('.herb-result').forEach(item => {
      if (item.querySelector('.search-stamp,img,.herb-image-empty')) return;
      const name = item.querySelector('strong')?.textContent;
      const herb = herbs.find(entry => entry.name === name);
      if (!herb || !window.HerbalStamp?.renderStamp) return;
      item.insertAdjacentHTML('afterbegin', window.HerbalStamp.renderStamp(herb, 'search-stamp'));
    });
  };
  if (results && typeof MutationObserver !== 'undefined') new MutationObserver(decorate).observe(results, { childList: true, subtree: true });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSearchShell, { once: true });
  else initSearchShell();
}
