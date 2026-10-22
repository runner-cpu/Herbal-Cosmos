import TomSelect from 'tom-select/base';
import 'tom-select/dist/css/tom-select.default.css';

export function mountHerbPicker(select, items, onSelect) {
  if (!select) return () => {};
  const originalHidden = select.getAttribute('aria-hidden');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let animation, disposed = false;
  const stopAnimation = () => { animation?.cancel(); animation = null; };
  const picker = new TomSelect(select, {
    maxItems: 1,
    maxOptions: 120,
    valueField: 'id',
    labelField: 'nameZh',
    searchField: ['nameZh', 'pinyin', 'scientificName', 'habitatLabel'],
    options: items,
    create: false,
    allowEmptyOption: false,
    hideSelected: false,
    closeAfterSelect: true,
    dropdownParent: 'body',
    placeholder: '搜索药名、拼音或学名',
    refreshThrottle: 0,
    render: {
      option: (item, escape) => `<div class="herb-option"><span class="herb-option-copy"><strong>${escape(item.nameZh)}</strong><small>${escape(item.pinyin || item.scientificName || '')}</small></span><span class="herb-option-habitat">${escape(item.habitatLabel || '')}</span><span class="herb-option-check" aria-hidden="true">✓</span></div>`,
      item: (item, escape) => `<div class="herb-picked"><span>${escape(item.nameZh)}</span><small>${escape(item.habitatLabel || '')}</small></div>`,
      no_results: (data, escape) => `<div class="herb-picker-empty"><strong>没有找到「${escape(data.input)}」</strong><span>试试中文药名、拼音或学名。</span></div>`,
    },
    onChange(value) { onSelect(value); },
    onDropdownOpen(dropdown) {
      stopAnimation();
      dropdown.inert = false;
      dropdown.removeAttribute('aria-hidden');
      dropdown.style.pointerEvents = '';
      if (!motion.matches) animation = dropdown.animate([
        { opacity: 0, transform: `translateY(${dropdown.dataset.side === 'top' ? '6' : '-6'}px) scale(.985)` },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ], { duration: 180, easing: 'cubic-bezier(.16,1,.3,1)' });
    },
    onDropdownClose(dropdown) {
      stopAnimation();
      dropdown.inert = true;
      dropdown.setAttribute('aria-hidden', 'true');
      if (motion.matches || disposed) return;
      // Keep only the visual surface during exit; the listbox is already closed to input/AT.
      dropdown.style.display = 'block';
      dropdown.style.pointerEvents = 'none';
      const exit = dropdown.animate([
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: `translateY(${dropdown.dataset.side === 'top' ? '4' : '-4'}px)` },
      ], { duration: 110, easing: 'ease-in' });
      animation = exit;
      exit.onfinish = () => {
        if (!this.isOpen) dropdown.style.display = 'none';
        if (animation === exit) animation = null;
      };
    },
  });
  picker.wrapper.classList.add('herb-picker-control');
  select.setAttribute('aria-hidden', 'true');
  picker.dropdown.classList.add('herb-picker-dropdown');
  picker.control_input.setAttribute('aria-label', '按药名定位');
  picker.control_input.setAttribute('enterkeyhint', 'go');
  picker.control_input.setAttribute('autocapitalize', 'off');
  picker.dropdown.setAttribute('aria-hidden', 'true');
  picker.dropdown.inert = true;
  // Keep the portal clear of the scene and viewport edge, including the mobile keyboard.
  picker.positionDropdown = () => {
    const rect = picker.control.getBoundingClientRect();
    const viewport = window.visualViewport;
    const topEdge = viewport?.offsetTop || 0;
    const bottomEdge = topEdge + (viewport?.height || innerHeight);
    const below = bottomEdge - rect.bottom - 12, above = rect.top - topEdge - 12;
    const top = below < 280 && above > below;
    const maxHeight = Math.max(60, Math.min(320, (top ? above : below) - 16));
    picker.dropdown_content.style.maxHeight = `${maxHeight}px`;
    picker.dropdown.dataset.side = top ? 'top' : 'bottom';
    picker.dropdown.style.width = `${Math.min(rect.width, innerWidth - 24)}px`;
    picker.dropdown.style.left = `${Math.max(12, Math.min(rect.left, innerWidth - rect.width - 12)) + scrollX}px`;
    picker.dropdown.style.top = `${(top ? rect.top - picker.dropdown.offsetHeight - 8 : rect.bottom + 8) + scrollY}px`;
    picker.dropdown.style.transformOrigin = top ? 'bottom center' : 'top center';
  };
  const reposition = () => { if (picker.isOpen) picker.positionDropdown(); };
  const stopMotion = () => {
    if (!motion.matches) return;
    stopAnimation();
    if (!picker.isOpen) picker.dropdown.style.display = 'none';
  };
  window.addEventListener('resize', reposition);
  window.addEventListener('scroll', reposition, { passive: true, capture: true });
  window.visualViewport?.addEventListener('resize', reposition);
  motion.addEventListener('change', stopMotion);
  return () => {
    disposed = true;
    stopAnimation();
    window.removeEventListener('resize', reposition);
    window.removeEventListener('scroll', reposition, true);
    window.visualViewport?.removeEventListener('resize', reposition);
    motion.removeEventListener('change', stopMotion);
    picker.destroy();
    if (originalHidden === null) select.removeAttribute('aria-hidden');
    else select.setAttribute('aria-hidden', originalHidden);
  };
}
