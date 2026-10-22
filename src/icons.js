/* Inline SVG marks for 本草宇宙.
 *
 * The site ships no icon dependency: every mark is a 24×24 stroke path drawn
 * to the same 1.5 stroke weight so the set reads as one family. Icons are
 * decorative next to a text label, so they stay hidden from assistive tech.
 */

const PATHS = {
  // Brand seal: a herb sprig pressed inside a square chop.
  seal: '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="2.2"/><path d="M12 18.4v-6.6"/><path d="M12 13.6c0-3.1 1.9-5.1 4.5-5.5.3 3-1.7 5.2-4.5 5.5Z"/><path d="M12 15.4c0-2.5-1.6-4.1-3.9-4.5-.2 2.5 1.4 4.2 3.9 4.5Z"/>',
  root: '<path d="M12 3.8v7.8"/><path d="M12 7.6c-1.9 0-3.2-1-3.9-2.6"/><path d="M12 10.2c1.9 0 3.2-1 3.9-2.6"/><path d="M12 11.6c0 4.5-1.5 7.1-4.3 8.6"/><path d="M12 11.6c0 3.3 1 5.5 3.1 6.8"/>',
  leaf: '<path d="M12 20.2V9.4"/><path d="M12 13.4c-3.3 0-5.3-1.7-5.5-4.7 3.2-.3 5.2 1.5 5.5 4.7Z"/><path d="M12 10.4c3.3 0 5.3-1.7 5.5-4.7-3.2-.3-5.2 1.5-5.5 4.7Z"/>',
  flower: '<circle cx="12" cy="12" r="1.9"/><circle cx="12" cy="7.4" r="2.6"/><circle cx="16.1" cy="10.2" r="2.6"/><circle cx="14.5" cy="15.1" r="2.6"/><circle cx="9.5" cy="15.1" r="2.6"/><circle cx="7.9" cy="10.2" r="2.6"/>',
  fruit: '<path d="M12 7.8c3 0 5.1 2.2 5.1 5.3 0 3.4-2.2 5.6-5.1 5.6s-5.1-2.2-5.1-5.6c0-3.1 2.1-5.3 5.1-5.3Z"/><path d="M12 7.8V4.4"/><path d="M12 4.8c1.6-.9 3-.7 4 .6-1 1.2-2.4 1.4-4 .5"/>',
  water: '<path d="M4 8.2c1.6-1.4 3.2-1.4 4.8 0s3.2 1.4 4.8 0 3.2-1.4 4.8 0"/><path d="M4 12.8c1.6-1.4 3.2-1.4 4.8 0s3.2 1.4 4.8 0 3.2-1.4 4.8 0"/><path d="M4 17.4c1.6-1.4 3.2-1.4 4.8 0s3.2 1.4 4.8 0 3.2-1.4 4.8 0"/>',
  fungus: '<path d="M4.6 11.4c0-3.6 3.3-6.2 7.4-6.2s7.4 2.6 7.4 6.2c-2.2.8-4.7 1.2-7.4 1.2s-5.2-.4-7.4-1.2Z"/><path d="M10 12.4v5.2c0 1.4 3.9 1.4 3.9 0v-5.2"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.1"/><path d="m15.4 15.4 4.1 4.1"/>',
  close: '<path d="m6.8 6.8 10.4 10.4M17.2 6.8 6.8 17.2"/>',
  book: '<path d="M12 6.6c-1.8-1.2-3.9-1.7-6.2-1.5v11c2.3-.2 4.4.3 6.2 1.5 1.8-1.2 3.9-1.7 6.2-1.5v-11c-2.3-.2-4.4.3-6.2 1.5Z"/><path d="M12 6.6v11.2"/>',
  formula: '<circle cx="12" cy="6.4" r="2.2"/><circle cx="6.8" cy="16.6" r="2.2"/><circle cx="17.2" cy="16.6" r="2.2"/><path d="m10.6 8.3-2.3 6.2M13.4 8.3l2.3 6.2M9 16.6h6"/>',
  echo: '<circle cx="12" cy="12" r="1.2"/><path d="M8.7 15.3a4.7 4.7 0 0 1 0-6.6"/><path d="M5.8 18.2a8.8 8.8 0 0 1 0-12.4"/><path d="M15.3 8.7a4.7 4.7 0 0 1 0 6.6"/><path d="M18.2 5.8a8.8 8.8 0 0 1 0 12.4"/>',
  cabinet: '<rect x="4.2" y="3.4" width="15.6" height="17.2" rx="1.4"/><path d="M4.2 9h15.6M4.2 14.6h15.6"/><path d="M13.4 6.4h3M13.4 12h3M13.4 17.6h3"/>',
  image: '<rect x="3.4" y="5.4" width="17.2" height="13.2" rx="1.6"/><path d="m5.6 16.4 4.3-4.7 3 3.2 2.2-2.4 3.3 3.8"/><circle cx="9.2" cy="9.5" r="1.2"/>',
  keyboard: '<rect x="2.8" y="6.4" width="18.4" height="11.2" rx="1.8"/><path d="M6.4 10h.01M9.6 10h.01M12.8 10h.01M16 10h.01M6.4 13h.01M9.6 13h.01M12.8 13h.01M16 13h.01M8.4 16h7.2"/>',
  info: '<circle cx="12" cy="12" r="8.2"/><path d="M12 11.2v4.8"/><path d="M12 8.2h.01"/>',
  pin: '<path d="M12 21s6.2-5.7 6.2-11A6.2 6.2 0 1 0 5.8 10c0 5.3 6.2 11 6.2 11Z"/><circle cx="12" cy="10" r="2.2"/>',
  sparkle: '<path d="M10.4 3.6c.5 3.4 1.6 4.5 5 5-3.4.5-4.5 1.6-5 5-.5-3.4-1.6-4.5-5-5 3.4-.5 4.5-1.6 5-5Z"/><path d="M17.6 13.8c.3 1.9.9 2.5 2.8 2.8-1.9.3-2.5.9-2.8 2.8-.3-1.9-.9-2.5-2.8-2.8 1.9-.3 2.5-.9 2.8-2.8Z"/>',
};

/** Names accepted by `icon`, useful for asserting coverage in tests. */
export const ICON_NAMES = Object.keys(PATHS);

/** Return an inline, decorative SVG mark. Unknown names render nothing. */
export function icon(name, className = '') {
  const path = PATHS[name];
  if (!path) return '';
  return `<svg class="icon${className ? ` ${className}` : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
}
