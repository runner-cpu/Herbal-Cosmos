export function formulaDirectoryPage(formulas, herbs, query = '', page = 1, size = 12) {
  const keyword = query.trim().toLowerCase();
  const names = new Map(herbs.map(herb => [herb.id, herb.name]));
  const matches = formulas.filter(formula => [formula.name, formula.from, formula.zheng, formula.eff,
    ...formula.herbs.map(entry => names.get(entry[0]) || '')].join(' ').toLowerCase().includes(keyword));
  const pages = Math.max(1, Math.ceil(matches.length / size));
  const current = Math.max(1, Math.min(pages, page));
  return { items: matches.slice((current - 1) * size, current * size), total: matches.length, pages, page: current };
}

if (typeof window !== 'undefined') {
  let query = '', page = 1;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const render = (focus = '') => {
    const cards = document.getElementById('formulaCards');
    if (!cards) return;
    const state = formulaDirectoryPage(window.FORMULAS || [], window.HERBS || [], query, page);
    page = state.page;
    cards.innerHTML = state.items.map(formula => {
      const names = formula.herbs.map(entry => window.HERBS.find(herb => herb.id === entry[0])?.name || '名称待考');
      return '<a class="card card-pad formula-card ' + (focus === formula.id ? 'active' : '') + '" href="#/formula?f=' + encodeURIComponent(formula.id) + '"><h3>' + esc(formula.name) + '</h3><small>' + esc(formula.from) + '</small><p>' + esc(names.join(' · ')) + '</p><span class="badge celadon">' + esc(formula.zheng) + '</span><span class="formula-card-action">查看组成、角色与来源 ↗</span></a>';
    }).join('') || '<div class="empty">没有匹配方剂，请换一个方名、药材名或清空检索。</div>';
    document.getElementById('formulaDirectoryCount').textContent = state.total + ' / ' + (window.FORMULAS?.length || 0) + ' 首 · 第 ' + state.page + ' / ' + state.pages + ' 页';
    const pager = document.getElementById('formulaDirectoryPages');
    pager.innerHTML = '<button type="button" data-directory-page="' + (page - 1) + '" ' + (page === 1 ? 'disabled' : '') + '>上一页</button>'
      + Array.from({ length: state.pages }, (_, index) => '<button type="button" data-directory-page="' + (index + 1) + '" ' + (page === index + 1 ? 'class="on" aria-current="page"' : '') + '>' + (index + 1) + '</button>').join('')
      + '<button type="button" data-directory-page="' + (page + 1) + '" ' + (page === state.pages ? 'disabled' : '') + '>下一页</button>';
    pager.querySelectorAll('button').forEach(button => button.onclick = () => {
      page = Number(button.dataset.directoryPage);
      render(focus);
      document.querySelector('.formula-directory-toolbar').scrollIntoView({ block: 'start' });
    });
  };
  window.HerbalFormulaDirectory = { render };
  document.getElementById('formulaDirectorySearch')?.addEventListener('input', event => {
    query = event.target.value; page = 1; render();
  });
  render();
}
