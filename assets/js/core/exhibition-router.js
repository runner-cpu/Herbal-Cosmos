(function (root) {
  'use strict';
  const workspaces = new Set(['home', 'exhibit', 'herbs', 'herb', 'qiwei', 'formula', 'heritage', 'learn']);
  const archiveAnchors = new Set(['home-collection', 'home-sources']);
  const cultureAnchors = { food: 'heritage-food', culture: 'heritage-culture', 'home-food': 'heritage-food', 'home-culture': 'heritage-culture' };
  const classics = new Set(['classics', 'home-classics']);

  function resolve(hash = '') {
    const raw = String(hash).replace(/^#\/?/, '') || 'home';
    const separator = raw.indexOf('?');
    const path = separator < 0 ? raw : raw.slice(0, separator);
    const params = Object.fromEntries(new URLSearchParams(separator < 0 ? '' : raw.slice(separator + 1)));
    let route = workspaces.has(path) ? path : 'not-found';
    if (path === 'intro') route = params.anchor === 'intro-timeline' ? 'intro' : 'home';
    if (path === 'saved' || path === 'home-learning') { route = 'learn'; if (path === 'saved') params.saved = '1'; }
    if (path === 'zheng') { route = 'formula'; params.view = 'zheng'; }
    if (cultureAnchors[path]) { route = 'heritage'; params.anchor = cultureAnchors[path]; }
    if (classics.has(path)) { route = 'intro'; params.anchor = 'intro-timeline'; }
    if (archiveAnchors.has(path)) { route = 'herbs'; params.anchor = path; }
    if (route === 'home' && archiveAnchors.has(params.anchor)) route = 'herbs';
    if (route === 'home' && params.anchor === 'home-overview') params.anchor = 'home-featured';
    if (route === 'home' && cultureAnchors[params.anchor]) { route = 'heritage'; params.anchor = cultureAnchors[params.anchor]; }
    if (route === 'home' && (params.focus === 'classics' || params.anchor === 'home-classics')) { route = 'intro'; params.anchor = 'intro-timeline'; }
    if (route === 'herbs') {
      if (params.section === 'formulas') route = 'formula';
      else if (params.section === 'culture') route = 'heritage';
      else if (params.section === 'classics') { route = 'intro'; params.anchor ||= 'intro-timeline'; }
      else if (params.view === 'attributes') route = 'qiwei';
    }
    if (route === 'heritage' && params.anchor === 'heritage-classics') { route = 'intro'; params.anchor = 'intro-timeline'; }
    const section = ['herbs', 'herb', 'qiwei', 'formula', 'heritage', 'intro'].includes(route) ? 'herbs' : route === 'learn' ? 'learn' : route === 'exhibit' ? 'exhibit' : 'home';
    return { route, params, section, unknownPath: route === 'not-found' ? path : '' };
  }
  root.HerbalExhibitionRouter = { resolve };
})(typeof window !== 'undefined' ? window : globalThis);
