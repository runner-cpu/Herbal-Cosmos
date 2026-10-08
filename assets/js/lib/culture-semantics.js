/* 五味与五行是传统文化对应关系；保留补充味型与复合性味，不推断药性。 */
(function (global) {
  'use strict';
  const phases = Object.freeze([
    Object.freeze({ flavor: '酸', phase: '木', key: 'wood', colorName: '青', color: '#3A7861', border: '#315F4D' }),
    Object.freeze({ flavor: '苦', phase: '火', key: 'fire', colorName: '赤', color: '#AD453A', border: '#873C33' }),
    Object.freeze({ flavor: '甘', phase: '土', key: 'earth', colorName: '黄', color: '#C4A243', border: '#8A722D' }),
    Object.freeze({ flavor: '辛', phase: '金', key: 'metal', colorName: '白', color: '#F1EEE7', border: '#75827A' }),
    Object.freeze({ flavor: '咸', phase: '水', key: 'water', colorName: '玄', color: '#26383D', border: '#60737A' })
  ]);
  const supplementary = Object.freeze([
    Object.freeze({ flavor: '淡', phase: null, key: 'bland', colorName: null, color: '#8D9688', border: '#62715E' }),
    Object.freeze({ flavor: '涩', phase: null, key: 'astringent', colorName: null, color: '#89725A', border: '#695846' })
  ]);
  const compound = Object.freeze({ flavor: '复合性味', phase: null, key: 'compound', colorName: null, color: '#8B9394', border: '#657476' });
  const known = [...phases, ...supplementary];
  function styles() {
    return global.document?.body && global.getComputedStyle ? global.getComputedStyle(global.document.body) : null;
  }
  function token(name, fallback) { return styles()?.getPropertyValue(name).trim() || fallback; }
  function hexChannels(color) {
    const match = /^#([0-9a-f]{6})$/i.exec(String(color).trim());
    return match ? [0, 2, 4].map(offset => parseInt(match[1].slice(offset, offset + 2), 16)) : null;
  }
  function mixColor(base, foreground, strength) {
    const background = hexChannels(base), accent = hexChannels(foreground);
    if (!background || !accent) return foreground;
    const weight = Math.max(0, Math.min(1, strength));
    return '#' + background.map((channel, i) => Math.round(channel + (accent[i] - channel) * weight).toString(16).padStart(2, '0')).join('');
  }
  function contrastText(color) {
    const channels = hexChannels(color);
    if (!channels) return token('--ink', '#1D2C25');
    const luminanceOf = values => {
      const linear = values.map(channel => { const value = channel / 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; });
      return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
    };
    const luminance = luminanceOf(channels);
    const candidates = ['#16261F', '#FBF7EB'].map(text => {
      const value = luminanceOf(hexChannels(text));
      return { text, contrast: (Math.max(luminance, value) + .05) / (Math.min(luminance, value) + .05) };
    }).sort((a, b) => b.contrast - a.contrast);
    if (candidates[0].contrast >= 4.5) return candidates[0].text;
    return (luminance + .05) / .05 >= 1.05 / (luminance + .05) ? '#000000' : '#FFFFFF';
  }
  function flavorMeta(value) {
    const text = String(value || '');
    const matches = known.filter(item => text.includes(item.flavor));
    const item = matches.length === 1 ? matches[0] : compound;
    const color = token('--phase-' + item.key, item.color);
    const border = token('--phase-' + item.key + '-border', item.border);
    return { ...item, color, border, text: contrastText(color), supplementary: !item.phase, compound: item === compound };
  }
  function flavorLabel(value) {
    const item = flavorMeta(value);
    return item.phase ? item.flavor + ' · ' + item.phase + '（' + item.colorName + '）' : (item.compound ? String(value || '性味待考') : item.flavor + ' · 补充味型');
  }
  function flavorStyle(value, count, max) {
    const item = flavorMeta(value), hasCount = Number.isFinite(count);
    const strength = hasCount ? (count > 0 ? .22 + .78 * Math.min(1, count / Math.max(1, max || count)) : 0) : 1;
    const color = mixColor(token('--card', '#FBFBF5'), item.color, strength);
    return { itemStyle: { color, borderColor: item.border, borderWidth: 1 }, label: { color: contrastText(color) } };
  }
  function renderFlavorLegend(container, options = {}) {
    const host = typeof container === 'string' ? global.document?.getElementById(container) : container;
    if (!host) return;
    const items = options.includeSecondary === false ? phases : known;
    const list = global.document.createElement('ul');
    list.className = 'five-phase-legend';
    list.setAttribute('aria-label', '五味、五行与五色对应图例');
    items.forEach(item => {
      const row = global.document.createElement('li');
      row.dataset.phase = item.key;
      const swatch = global.document.createElement('i');
      swatch.setAttribute('aria-hidden', 'true');
      const name = global.document.createElement('span');
      name.textContent = flavorLabel(item.flavor);
      row.append(swatch, name);list.append(row);
    });
    const note = global.document.createElement('p');note.className = 'five-phase-note';
    note.textContent = options.note || '五行与五色表达传统文化对应关系；淡、涩保留为补充味型。颜色区分味型，同色深浅表示记录数量。';
    host.replaceChildren(list, note);
  }
  global.HerbalFivePhases = Object.freeze({ phases, supplementary, flavorMeta, flavorLabel, flavorStyle, renderFlavorLegend, mixColor, contrastText });
})(typeof window !== 'undefined' ? window : globalThis);
