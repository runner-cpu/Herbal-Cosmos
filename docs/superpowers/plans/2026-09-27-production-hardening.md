# Herbal Cosmos Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Make the existing static Herbal Cosmos site dependable on weak networks and mobile devices, discoverable by search and sharing tools, keyboard-readable, and protected by automated production gates without changing its audited data claims or visual identity.

**Architecture:** Keep native HTML/CSS/JavaScript, the hash router, GitHub Pages, and file-protocol fallback. Add one progressive app-shell module and one versioned Service Worker, move self-hosted ECharts out of the parser-blocking head, and extend the current validators and Playwright suite instead of introducing a build framework.

**Tech Stack:** HTML5, CSS custom properties, browser JavaScript, Service Worker/Cache Storage, Web App Manifest, ECharts 5, Node.js 22 test runner, Playwright, GitHub Actions, GitHub Pages.

## Global Constraints

- Preserve native HTML/CSS/JavaScript, GitHub Pages, zero production build, local HTTP serving, and file-protocol fallback.
- Keep the day, night, and classic themes, star-field hero, seal system, card layout, and audited open-image policy.
- Do not add images. Keep 547 runtime open-license images, 603 image-search records, 546 unique image files, and 61 intentional placeholders auditable.
- Do not change catalog approval or inflate claims: 8,818 approved names have public row-level sources but are not equivalent to Chinese Pharmacopoeia inclusion; 1,487 review rows stay hidden by default.
- Describe TCM_KG as “公开资料整理”, origin as “资料记录地区”, retain original historical formula dose units, and never imply an image proves medicinal part, processing state, efficacy, or safety.
- Preserve 608 knowledge cards, 106 food-medicine entries, 50 formulas, and 30 syndromes unless validation exposes an existing mismatch.
- Precache no more than 2.5 MB; do not precache herb images or the 45 catalog chunks. Keep at most 120 visited images and 45 visited chunks.
- Use network-first navigation, cache-first/background-refresh for versioned core assets, and do not intercept non-GET or cross-origin requests.
- Do not activate a waiting worker silently; offer “刷新更新” and “稍后”.
- Keep ECharts below page content and before assets/js/core/runtime.js. Do not broadly convert scripts to modules or defer.
- Primary navigation is 首页 / 探索本草 / 性味归经 / 配伍网络 / 学习舱; 病证药链 and section anchors go in a keyboard-operable “更多”.
- Do not restore incomplete English mode.
- Honor prefers-reduced-motion, forced-colors, and mobile safe areas.
- Validate on Node.js 22 and Playwright Chromium desktop plus the existing 375 × 812 mobile project.

---

### Task 1: Application validator, budgets, and dependency lock

**Files:**
- Create: scripts/validate-web-app.mjs
- Create: tests/web-app-validation.test.mjs
- Modify: package.json
- Create: package-lock.json

**Interfaces:**
- Consumes: repository files, HTML resource references, and the literal PRECACHE_URLS array in sw.js.
- Produces: validateWebApp({ baseDir }): { ok, issues, summary }, npm run validate:app, and an exact Playwright lock.

- [ ] **Step 1: Write failing validator tests**

~~~javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateWebApp } from '../scripts/validate-web-app.mjs';

test('production shell satisfies metadata, ordering, and budgets', () => {
  const result = validateWebApp();
  assert.equal(result.ok, true, result.issues.map(item => item.code + ': ' + item.message).join('\n'));
  assert.ok(result.summary.precacheBytes > 0 && result.summary.precacheBytes <= 2_500_000);
});

test('parser-blocking ECharts is rejected', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'herbal-app-'));
  fs.writeFileSync(path.join(dir, 'index.html'), '<head><script src="assets/vendor/echarts.min.js"></script></head><body><script src="assets/js/core/runtime.js"></script></body>');
  const result = validateWebApp({ baseDir: dir });
  assert.ok(result.issues.some(item => item.code === 'echarts-order'));
  fs.rmSync(dir, { recursive: true, force: true });
});
~~~

- [ ] **Step 2: Confirm the missing module failure**

Run: node --test tests/web-app-validation.test.mjs

Expected: FAIL with ERR_MODULE_NOT_FOUND for scripts/validate-web-app.mjs.

- [ ] **Step 3: Implement deterministic checks and CLI reporting**

~~~javascript
export const RESOURCE_LIMITS = Object.freeze({
  'assets/vendor/echarts.min.js': 1_100_000,
  'assets/js/data/expanded.generated.js': 700_000,
  'assets/js/core/runtime.js': 100_000
});
export const HANDWRITTEN_MODULE_LIMIT = 40_000;
export const PRECACHE_LIMIT = 2_500_000;

export function validateWebApp({ baseDir = root } = {}) {
  const issues = [];
  const add = (code, message) => issues.push({ code, message });
  const summary = { precacheBytes: 0, checkedFiles: 0 };
  // Each requirement below emits one stable code and a path-specific message.
  return { ok: issues.length === 0, issues, summary };
}
~~~

Implement checks for non-empty manifest, sw.js, 404.html, and app-shell.js; manifest start_url/scope/icons/colors; canonical/robots/Twitter/OG dimensions/JSON-LD/manifest tags; ECharts outside head and before runtime; no new external runtime script/style; resolvable internal resources; the exact file ceilings above; every other handwritten module at or below 40,000 bytes; precache at or below 2,500,000 bytes; no herb image or catalog chunk in precache; 404 recovery links; privacy and medical-boundary copy. Print counts and set process.exitCode=1 for issues.

- [ ] **Step 4: Add the package command and lock dependencies**

~~~json
"validate:app": "node scripts/validate-web-app.mjs"
~~~

Run: npm install --package-lock-only --ignore-scripts

Expected: package-lock.json contains the exact @playwright/test graph.

- [ ] **Step 5: Commit the independent gate**

~~~bash
git add scripts/validate-web-app.mjs tests/web-app-validation.test.mjs package.json package-lock.json
git commit -m "test: add web app production budgets"
~~~

### Task 2: Metadata, install manifest, branded 404, and privacy

**Files:**
- Create: manifest.webmanifest
- Create: 404.html
- Modify: index.html
- Modify: tests/v3-regressions.test.mjs
- Modify: tests/web-app-validation.test.mjs

**Interfaces:**
- Consumes: assets/icons/favicon.svg and audited images/herbs/open/panax-ginseng-b85bb77ce4d8f0.jpg.
- Produces: project-relative install metadata, a no-script recovery page, complete share/search tags, and visible local-data disclosure.

- [ ] **Step 1: Add failing shell assertions**

~~~javascript
test('shell publishes install, sharing, and privacy metadata', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /rel="canonical" href="https:\/\/runner-cpu\.github\.io\/Herbal-Cosmos\/"/);
  assert.match(html, /name="robots" content="index,follow,max-image-preview:large"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /rel="manifest" href="manifest\.webmanifest"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /无账号/); assert.match(html, /无遥测/);
  assert.match(html, /清除浏览器数据后不可恢复/);
});
~~~

- [ ] **Step 2: Run and verify missing tags/files**

Run: node --test tests/v3-regressions.test.mjs tests/web-app-validation.test.mjs

Expected: FAIL for manifest, canonical, structured data, and privacy.

- [ ] **Step 3: Add exact SEO/share markup**

~~~html
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="https://runner-cpu.github.io/Herbal-Cosmos/">
<link rel="manifest" href="manifest.webmanifest">
<meta name="twitter:card" content="summary_large_image">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="800">
<meta property="og:image:alt" content="人参植物开放许可图像，本草宇宙分享预览">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"EducationalApplication","name":"本草宇宙","applicationCategory":"EducationalApplication","operatingSystem":"Web","url":"https://runner-cpu.github.io/Herbal-Cosmos/","inLanguage":"zh-CN","description":"中药名称索引、本草知识卡、方剂配伍与文化资料的可视化学习应用。内容仅供文化科普与学习，不构成医疗建议。"}</script>
~~~

Add matching Twitter title, description, and image. Do not add ratings, user counts, treatment claims, or MedicalWebPage.

- [ ] **Step 4: Create manifest and static 404**

~~~json
{"name":"本草宇宙 · HERBAL COSMOS","short_name":"本草宇宙","description":"中药名称索引、本草知识卡、方剂配伍与文化资料的可视化学习应用。","lang":"zh-CN","start_url":"./#/home","scope":"./","display":"standalone","background_color":"#F6F1E7","theme_color":"#20364B","icons":[{"src":"assets/icons/favicon.svg","sizes":"any","type":"image/svg+xml","purpose":"any maskable"}]}
~~~

404.html states the address is unavailable, uses the existing paper/indigo/cinnabar palette in less than 2 KB of inline CSS, contains ./#/home, ./#/herbs, and ./#/formula links, and never redirects.

- [ ] **Step 5: Add exact footer privacy copy**

~~~html
<p class="privacy-note"><b>隐私说明：</b>无需账号、无遥测；收藏、探索足迹和主题偏好仅保存在当前浏览器，不会上传。可从收藏抽屉导出 JSON；清除浏览器数据后不可恢复。</p>
~~~

- [ ] **Step 6: Verify and commit**

Run: node --test tests/v3-regressions.test.mjs tests/web-app-validation.test.mjs

Expected: metadata/manifest/404/privacy pass; Task 3 shell checks may remain red.

~~~bash
git add index.html manifest.webmanifest 404.html tests/v3-regressions.test.mjs tests/web-app-validation.test.mjs
git commit -m "feat: publish install and recovery metadata"
~~~

### Task 3: Versioned offline shell and explicit updates

**Files:**
- Create: sw.js
- Create: assets/js/core/app-shell.js
- Create: tests/service-worker-policy.test.mjs
- Modify: index.html
- Modify: assets/css/components.css
- Modify: scripts/check-inline-runtime.mjs
- Modify: tests/runtime-split.test.mjs

**Interfaces:**
- Consumes: #appStatus, #appUpdate, and ordered runtime scripts.
- Produces: PRECACHE_URLS, bounded caches, window.HerbalAppShell, connection announcements, and explicit SKIP_WAITING approval.

- [ ] **Step 1: Write failing worker-policy tests**

~~~javascript
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
test('bulk assets stay out of precache', () => {
  const list = sw.match(/const PRECACHE_URLS = Object\.freeze\((\[[\s\S]*?\])\);/);
  assert.ok(list); assert.doesNotMatch(list[1], /images\/herbs|data\/catalog\/chunk-/);
  assert.match(sw, /MAX_IMAGE_ENTRIES = 120/); assert.match(sw, /MAX_CATALOG_ENTRIES = 45/);
});
test('updates wait for approval', () => {
  assert.match(sw, /event\.data\?\.type === 'SKIP_WAITING'/);
  assert.match(sw, /self\.skipWaiting\(\)/);
});
~~~

- [ ] **Step 2: Confirm ENOENT for sw.js**

Run: node --test tests/service-worker-policy.test.mjs

Expected: FAIL with ENOENT.

- [ ] **Step 3: Implement cache names, limits, and literal shell list**

~~~javascript
const CACHE_VERSION = 'herbal-cosmos-v5-20260927';
const PRECACHE = CACHE_VERSION + '-shell';
const IMAGE_CACHE = CACHE_VERSION + '-images';
const CATALOG_CACHE = CACHE_VERSION + '-catalog';
const MAX_IMAGE_ENTRIES = 120;
const MAX_CATALOG_ENTRIES = 45;
const PRECACHE_URLS = Object.freeze([
  './','./index.html','./404.html','./manifest.webmanifest','./assets/icons/favicon.svg',
  './assets/css/site.css','./assets/css/components.css','./assets/vendor/echarts.min.js',
  './assets/js/data/food-medicine.generated.js','./assets/js/data/featured.js','./assets/js/data/expanded.generated.js',
  './assets/js/core/runtime.js','./assets/js/core/app-shell.js','./assets/js/core/catalog-loader.js',
  './assets/js/components/stamp.js','./assets/js/components/context-bar.js','./assets/js/components/search.js',
  './assets/js/components/saved-drawer.js','./assets/js/components/theme.js','./assets/js/pages/home.js',
  './assets/js/pages/cross-navigation.js','./assets/js/pages/cosmos.js','./assets/js/charts/insights.js',
  './workers/catalog-search.js','./data/catalog/manifest.json'
]);
~~~

Install with cache.addAll and do not skip waiting. Activation deletes old version caches and claims clients. Handle same-origin GET only: navigation network-first with cached index fallback; herb images stale-while-revalidate then trim to 120; catalog chunks stale-while-revalidate then trim to 45; precached assets cache-first with background refresh. Let uncached failures reject so local fallbacks stay truthful.

- [ ] **Step 4: Implement progressive registration and update UI**

~~~javascript
const supported = 'serviceWorker' in navigator && /^https?:$/.test(location.protocol);
let refreshing = false;
function offerUpdate(worker) { update.hidden = false; refreshButton.onclick = () => worker.postMessage({ type:'SKIP_WAITING' }); laterButton.onclick = () => { update.hidden = true; }; }
export async function registerAppShell() {
  if (!supported) return null;
  const registration = await navigator.serviceWorker.register('./sw.js', { scope:'./' });
  if (registration.waiting) offerUpdate(registration.waiting);
  return registration;
}
~~~

Announce exact offline limits and restored connectivity through #appStatus. Detect waiting/installing workers. Reload once on controllerchange. Catch registration failure with one console warning. Export window.HerbalAppShell.

- [ ] **Step 5: Insert status DOM and move ECharts below content**

~~~html
<div class="app-status" id="appStatus" role="status" aria-live="polite" aria-atomic="true" hidden><span id="appStatusText"></span></div>
<div class="app-update" id="appUpdate" role="status" aria-live="polite" hidden><span>本草宇宙已有新版本。</span><button id="appUpdateRefresh" type="button">刷新更新</button><button id="appUpdateLater" type="button">稍后</button></div>
<script src="assets/vendor/echarts.min.js"></script>
~~~

Remove ECharts from head; insert it before data scripts; retain runtime ordering; load app-shell.js last. Update REQUIRED_ASSETS and runtime-split order assertions.

- [ ] **Step 6: Style status controls with theme tokens and safe areas**

~~~css
.app-status,.app-update{position:fixed;z-index:150;left:max(16px,env(safe-area-inset-left));right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));margin:auto;max-width:720px;border:1px solid var(--line);background:var(--card);color:var(--ink);box-shadow:0 12px 34px rgba(0,0,0,.22);padding:11px 14px}.app-update{display:flex;align-items:center;gap:10px}.app-update[hidden],.app-status[hidden]{display:none}.app-update span{flex:1}.app-update button{min-height:40px;border:1px solid var(--qing);background:var(--qing);color:#fff;padding:7px 12px}.app-update button:last-child{background:transparent;color:var(--qing)}
~~~

- [ ] **Step 7: Run shell gates and commit**

Run: node --test tests/service-worker-policy.test.mjs tests/runtime-split.test.mjs tests/web-app-validation.test.mjs && npm run check:inline && npm run validate:app

Expected: PASS with precache no greater than 2,500,000 bytes.

~~~bash
git add sw.js assets/js/core/app-shell.js index.html assets/css/components.css scripts/check-inline-runtime.mjs tests/service-worker-policy.test.mjs tests/runtime-split.test.mjs
git commit -m "feat: add bounded offline app shell"
~~~

### Task 4: Five-entry navigation, keyboard “More”, and unknown routes

**Files:**
- Modify: index.html
- Modify: assets/js/core/runtime.js
- Modify: assets/css/site.css
- Modify: assets/css/components.css
- Create: tests/browser/navigation.spec.js

**Interfaces:**
- Consumes: existing hash routes and home-food, home-culture, and home-sources anchors.
- Produces: #navMore disclosure navigation, parseHash().unknownPath, and data-route=not-found.

- [ ] **Step 1: Write failing browser tests**

~~~javascript
import { test, expect } from '@playwright/test';
test('primary navigation has five entries and More closes accessibly', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('#mainNav > a')).toHaveCount(5);
  const more = page.locator('#navMore');
  await more.locator('summary').focus(); await page.keyboard.press('Enter');
  await expect(more).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(more).not.toHaveAttribute('open', '');
  await expect(more.locator('summary')).toBeFocused();
});
test('unknown hash renders safe recovery', async ({ page }) => {
  await page.goto('/#/route-that-does-not-exist?x=%3Cscript%3E');
  await expect(page.locator('[data-route="not-found"]')).toBeVisible();
  await expect(page.locator('#unknownRoute')).toContainText('route-that-does-not-exist');
  await expect(page.locator('#unknownRoute script')).toHaveCount(0);
});
~~~

- [ ] **Step 2: Run and observe current failures**

Run: npx playwright test tests/browser/navigation.spec.js --project=chromium

Expected: FAIL because six direct links render and unknown routes silently become home.

- [ ] **Step 3: Add native disclosure navigation**

~~~html
<details class="nav-more" id="navMore"><summary aria-label="更多页面">更多</summary><div class="nav-popover"><a href="#/zheng" data-more-route="zheng">病证药链</a><a href="#/home-food">食养同源</a><a href="#/home-culture">文化非遗</a><a href="#/home-sources">数据来源</a></div></details>
~~~

Keep 学习舱 as the fifth direct entry and add home-sources to the existing source section.

- [ ] **Step 4: Preserve unknown paths and render text safely**

~~~javascript
const known = routes.includes(path) || Boolean(legacyAnchors[path]) || path.startsWith('home-') || path === 'classics';
const route = known ? (routes.includes(path) ? path : 'home') : 'not-found';
return { route, params, unknownPath: known ? '' : path };
function renderNotFound(path){ document.getElementById('unknownRoute').textContent = path || '未知路径'; }
~~~

Add not-found to route/view maps. The page links to home, herbs, and data sources. Never write unknownPath with innerHTML.

- [ ] **Step 5: Implement Escape, outside-click, link-close, and current state**

~~~javascript
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !navMore.open) return;
  navMore.open = false; navMore.querySelector('summary').focus();
});
document.addEventListener('pointerdown', event => {
  if (navMore.open && !navMore.contains(event.target)) navMore.open = false;
});
~~~

Set aria-current=page and active on More for route zheng; close after menu or route selection.

- [ ] **Step 6: Style desktop popover and 44px mobile targets**

~~~css
.nav-more{position:relative}.nav-more summary{list-style:none;min-height:36px;display:flex;align-items:center;padding:6px 12px;border-radius:8px;cursor:pointer}.nav-more summary::-webkit-details-marker{display:none}.nav-popover{position:absolute;top:calc(100% + 8px);right:0;width:190px;padding:7px;background:var(--card);color:var(--ink);border:1px solid var(--line);box-shadow:var(--shadow)}.nav-popover a{display:flex;min-height:40px;align-items:center}.nav-more.active summary{background:rgba(200,162,74,.28);color:#F3D9A0}@media(max-width:768px){.nav-more summary,.nav-popover a{min-height:44px}.nav-popover{position:static;width:100%;box-shadow:none}}
~~~

- [ ] **Step 7: Run both profiles and commit**

Run: npx playwright test tests/browser/navigation.spec.js

Expected: PASS in chromium and mobile.

~~~bash
git add index.html assets/js/core/runtime.js assets/css/site.css assets/css/components.css tests/browser/navigation.spec.js
git commit -m "feat: clarify navigation and route recovery"
~~~

### Task 5: Complete search combobox semantics

**Files:**
- Modify: index.html
- Modify: assets/js/core/runtime.js
- Modify: assets/js/core/catalog-loader.js
- Create: tests/browser/search-accessibility.spec.js

**Interfaces:**
- Consumes: current matching rules, catalog lifecycle events, and #searchResults.
- Produces: stable option IDs, aria-expanded/busy/activedescendant, and concise #searchStatus announcements.

- [ ] **Step 1: Write failing assistive-technology flow**

~~~javascript
test('global search follows the editable combobox pattern', async ({ page }) => {
  await page.goto('/#/home');
  const input = page.locator('#globalSearch');
  await expect(input).toHaveAttribute('role', 'combobox');
  await expect(input).toHaveAttribute('aria-controls', 'searchResults');
  await input.fill('公丁香');
  await expect(page.locator('#searchStatus')).toContainText(/条结果/);
  await page.keyboard.press('ArrowDown');
  const id = await input.getAttribute('aria-activedescendant');
  expect(id).toMatch(/^search-option-/); await expect(page.locator('#' + id)).toHaveClass(/active/);
  await page.keyboard.press('Escape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toBeFocused();
});
~~~

- [ ] **Step 2: Run and confirm missing combobox state**

Run: npx playwright test tests/browser/search-accessibility.spec.js --project=chromium

Expected: FAIL on role or active descendant.

- [ ] **Step 3: Add editable-combobox markup and a separate live region**

~~~html
<input id="globalSearch" role="combobox" aria-label="搜索药材、名称索引或方剂" aria-autocomplete="list" aria-controls="searchResults" aria-expanded="false" aria-busy="true" autocomplete="off">
<div class="search-results" id="searchResults" role="listbox" aria-label="搜索建议"></div><div class="sr-only" id="searchStatus" role="status" aria-live="polite" aria-atomic="true"></div>
~~~

- [ ] **Step 4: Synchronize identity, active item, loading, and result count**

~~~javascript
function setSearchBusy(busy){ searchInput.setAttribute('aria-busy', String(Boolean(busy))); if (busy) searchStatus.textContent = '名称索引正在加载'; }
function setActiveSearchOption(options, index){ store._searchIndex = index; options.forEach((option, i) => option.classList.toggle('active', i === index)); if (options[index]) searchInput.setAttribute('aria-activedescendant', options[index].id); else searchInput.removeAttribute('aria-activedescendant'); }
function announceSearchResults(count, keyword){ searchStatus.textContent = count ? '“' + keyword + '”有 ' + count + ' 条结果' : '没有找到“' + keyword + '”'; }
~~~

Generate IDs from type, encoded item ID, and index. Escape clears active state, closes the popup, and retains focus. Catalog success/failure clears busy and announces actual scope. The live region never repeats full option text.

- [ ] **Step 5: Run search/catalog flows and commit**

Run: npx playwright test tests/browser/search-accessibility.spec.js tests/browser/catalog-loading.spec.js

Expected: PASS in both profiles, including 公丁香 resolving to 丁香.

~~~bash
git add index.html assets/js/core/runtime.js assets/js/core/catalog-loader.js tests/browser/search-accessibility.spec.js
git commit -m "fix: complete search combobox semantics"
~~~

### Task 6: Chart names and non-canvas evidence paths

**Files:**
- Modify: assets/js/core/runtime.js
- Modify: assets/js/charts/insights.js
- Modify: index.html
- Modify: assets/css/components.css
- Create: tests/browser/chart-accessibility.spec.js

**Interfaces:**
- Consumes: panel headings, cap/chart-method text, aggregate outputs, evidence links, and chartManager.register.
- Produces: chartManager.describe, role=img/aria-label on passive chart containers, and generated details.chart-summary content.

- [ ] **Step 1: Write failing naming/evidence tests**

~~~javascript
test('rendered charts have readable names and evidence paths', async ({ page }) => {
  await page.goto('/#/qiwei');
  const charts = page.locator('.chart-box');
  await expect(charts.first()).toHaveAttribute('role', 'img');
  for (let i = 0; i < await charts.count(); i += 1) await expect(charts.nth(i)).toHaveAttribute('aria-label', /\S+/);
  await page.goto('/#/formula');
  await expect(page.locator('.chart-summary').first()).toContainText(/样本|方剂|药材/);
  await expect(page.locator('.chart-evidence a').first()).toBeFocusable();
});
~~~

- [ ] **Step 2: Run and confirm unnamed chart containers**

Run: npx playwright test tests/browser/chart-accessibility.spec.js --project=chromium

Expected: FAIL on role or accessible name.

- [ ] **Step 3: Describe every chart during registration**

~~~javascript
describe(el, { label = '', summary = '' } = {}) {
  if (!el) return;
  const panel = el.closest('.chart-panel,.insight-chart-panel,.syndrome-flow');
  const heading = panel?.querySelector('h2,h3')?.textContent?.trim();
  const method = panel?.querySelector('.cap,.chart-method')?.textContent?.trim();
  const name = [label || heading, method, summary].filter(Boolean).join('。');
  el.setAttribute('role', 'img'); el.setAttribute('aria-label', name || '本草数据图表');
}
~~~

Call describe inside chartManager.register. Supply explicit sample sizes to charts without adjacent headings. Keep ECharts canvas descendants outside tab order.

- [ ] **Step 4: Generate summaries from the same aggregates**

~~~javascript
function renderChartSummary(container, title, rows) {
  const details = document.createElement('details'); details.className = 'chart-summary';
  const summary = document.createElement('summary'); summary.textContent = title;
  const list = document.createElement('ol');
  rows.slice(0, 8).forEach(row => { const item = document.createElement('li'); item.textContent = row; list.append(item); });
  details.append(summary, list); container.insertAdjacentElement('afterend', details);
}
~~~

Generate rows for frequency/co-occurrence, dose groups, meridian/classification flow, and food usage. Do not hard-code findings. Keep existing tables and evidence links authoritative.

- [ ] **Step 5: Style summaries and run leak regression**

~~~css
.chart-summary{margin-top:12px;border-top:1px solid var(--line);padding-top:10px;color:var(--ink-2);font-size:12px}.chart-summary summary{min-height:40px;display:flex;align-items:center;color:var(--qing);font-weight:600;cursor:pointer}.chart-summary ol{padding:8px 0 0 22px}.chart-summary li+li{margin-top:5px}.chart-summary summary:focus-visible{outline:2px solid var(--jin);outline-offset:3px}
~~~

Run: npx playwright test tests/browser/chart-accessibility.spec.js tests/browser/leaks.spec.js

Expected: PASS in both profiles with bounded chart and ResizeObserver counts.

- [ ] **Step 6: Commit chart accessibility**

~~~bash
git add assets/js/core/runtime.js assets/js/charts/insights.js index.html assets/css/components.css tests/browser/chart-accessibility.spec.js
git commit -m "feat: add readable chart evidence paths"
~~~

### Task 7: High-contrast, safe-area, reduced-motion, and mobile polish

**Files:**
- Modify: assets/css/site.css
- Modify: assets/css/components.css
- Modify: tests/browser/accessibility.spec.js
- Modify: tests/browser/responsive.spec.js

**Interfaces:**
- Consumes: existing theme tokens and new shell/navigation/search selectors.
- Produces: visible forced-color states, safe-area-aware UI, motion-free transitions, and 375px no-overflow guarantees.

- [ ] **Step 1: Extend forced-color and mobile tests**

~~~javascript
test('forced colors preserves shell controls', async ({ page }) => {
  await page.emulateMedia({ forcedColors:'active', reducedMotion:'reduce' });
  await page.goto('/#/home');
  await expect(page.locator('#themeToggle')).toBeVisible();
  await expect(page.locator('[data-route-link="home"]')).toHaveCSS('forced-color-adjust', 'auto');
});
test('375px shell has no document overflow', async ({ page }) => {
  await page.goto('/#/home');
  const widths = await page.evaluate(() => ({ scroll:document.documentElement.scrollWidth, client:document.documentElement.clientWidth }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
});
~~~

- [ ] **Step 2: Run focused tests before styling**

Run: npx playwright test tests/browser/accessibility.spec.js tests/browser/responsive.spec.js

Expected: existing flows pass; new assertions expose unsupported new shell state or overflow.

- [ ] **Step 3: Add exact adaptive media rules**

~~~css
body{padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}header{padding-top:env(safe-area-inset-top)}footer{padding-bottom:calc(30px + env(safe-area-inset-bottom))}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}.hero #heroCanvas{transform:none!important}}
@media(forced-colors:active){a,button,input,summary,select{forced-color-adjust:auto}.card,.chart-panel,.insight-chart-panel,.nav-popover,.saved-drawer,.app-status,.app-update{border:1px solid CanvasText;box-shadow:none}.active,[aria-current="page"],:focus-visible{outline:2px solid Highlight!important;outline-offset:2px}.stamp,.herb-stamp{border-color:CanvasText;color:CanvasText;background:Canvas}}
@media(max-width:768px){.nav-inner{padding-left:max(12px,env(safe-area-inset-left));padding-right:max(12px,env(safe-area-inset-right))}.app-update{align-items:stretch;flex-wrap:wrap}.app-update span{flex-basis:100%}.app-update button,.nav-more summary,.nav-popover a{min-height:44px}.searchbox,.searchbox input{min-width:0}.saved-drawer{width:100%;max-width:390px;padding-bottom:calc(22px + env(safe-area-inset-bottom))}}
~~~

- [ ] **Step 4: Run all affected flows and commit**

Run: npx playwright test tests/browser/accessibility.spec.js tests/browser/responsive.spec.js tests/browser/navigation.spec.js tests/browser/search-accessibility.spec.js

Expected: PASS in desktop and mobile with no horizontal document overflow.

~~~bash
git add assets/css/site.css assets/css/components.css tests/browser/accessibility.spec.js tests/browser/responsive.spec.js
git commit -m "fix: harden adaptive and high contrast shell"
~~~

### Task 8: Offline browser regression and GitHub Actions gates

**Files:**
- Create: tests/browser/pwa.spec.js
- Modify: .github/workflows/catalog-quality.yml
- Modify: package.json

**Interfaces:**
- Consumes: window.HerbalAppShell, Service Worker caches, both Playwright projects, and all validator commands.
- Produces: reproducible install/offline tests and locked CI execution of data, app, desktop, and mobile gates.

- [ ] **Step 1: Write PWA fetch and offline-shell tests**

~~~javascript
import { test, expect } from '@playwright/test';
test('manifest and worker are fetchable and scoped', async ({ page, request }) => {
  const response = await request.get('/manifest.webmanifest');
  expect(response.ok()).toBeTruthy(); expect((await response.json()).scope).toBe('./');
  expect((await request.get('/sw.js')).ok()).toBeTruthy();
  await page.goto('/#/home');
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), { timeout:15000 }).toBeTruthy();
});
test('visited shell reloads offline', async ({ page, context }) => {
  await page.goto('/#/home');
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), { timeout:15000 }).toBeTruthy();
  await context.setOffline(true); await page.reload();
  await expect(page.locator('[data-route="home"]')).toBeVisible();
  await expect(page.locator('#appStatus')).toContainText('当前离线');
  await expect(page.locator('[data-featured-count]').first()).not.toHaveText('0');
  await context.setOffline(false);
});
~~~

- [ ] **Step 2: Run PWA tests in Chromium**

Run: npx playwright test tests/browser/pwa.spec.js --project=chromium

Expected: PASS after controlled registration gives the page a worker controller.

- [ ] **Step 3: Add the exact two-profile command**

~~~json
"test:browser:ci": "playwright test --project=chromium --project=mobile"
~~~

- [ ] **Step 4: Upgrade CI to locked installs and every gate**

~~~yaml
- run: npm ci --ignore-scripts
- run: npm run build:data
- run: git diff --exit-code -- data/ reports/ assets/js/data/food-medicine.generated.js assets/js/data/expanded.generated.js
- run: npm run validate:data
- run: npm run validate:app
- run: node scripts/fetch-herb-images.mjs --verify
- run: npm test
- run: npm run check:inline
~~~

The browser job also uses npm ci, installs Chromium, and runs npm run test:browser:ci. Keep runtime-asset and syntax checks. Mobile is not allowed to fail.

- [ ] **Step 5: Run the exact CI command and commit**

Run: npm run test:browser:ci

Expected: every browser test passes in both profiles.

~~~bash
git add tests/browser/pwa.spec.js .github/workflows/catalog-quality.yml package.json package-lock.json
git commit -m "ci: enforce desktop mobile and offline quality"
~~~

### Task 9: Documentation, full audit, deployment, and live verification

**Files:**
- Modify: README.md
- Modify: docs/superpowers/specs/2026-09-27-production-hardening-design.md

**Interfaces:**
- Consumes: all production behavior and validator results from Tasks 1–8.
- Produces: operator documentation, an acceptance record, one verified commit on origin/main and origin/gh-pages, and a live Pages smoke result.

- [ ] **Step 1: Document offline/update and privacy behavior**

~~~markdown
### 离线、弱网与更新

- 首次联网访问后，页面外壳、核心脚本、数据摘要与图表库可离线重新打开。
- 目录分块与本草图片按访问缓存；从未访问过的内容在离线时会明确局部降级，不会伪装成空数据。
- 新版本下载完成后显示“刷新更新”；只有确认后才切换版本并刷新。
- file 协议打开时不注册 Service Worker，原有静态回退保留。

### 本机数据与隐私

无需账号、无遥测。收藏、探索足迹、学习进度和主题偏好只保存在当前浏览器；收藏可导出 JSON，清除浏览器数据后无法恢复。
~~~

- [ ] **Step 2: Append final acceptance evidence to the approved design**

Record the date, commit candidate, exact commands, actual pass totals, final precache bytes, both browser profiles, and unchanged data/image counts. Repeat the catalog, TCM_KG, origin, historical-dose, and image-evidence limits from Global Constraints.

- [ ] **Step 3: Run every local gate from a locked install**

~~~powershell
npm ci --ignore-scripts
npm run build:data
git diff --exit-code -- data reports assets/js/data/food-medicine.generated.js assets/js/data/expanded.generated.js
npm run validate:data
npm run validate:app
node scripts/fetch-herb-images.mjs --verify
npm test
npm run check:inline
Get-ChildItem assets/js,workers -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName; if ($LASTEXITCODE -ne 0) { throw "Syntax check failed: $($_.FullName)" } }
npm run test:browser:ci
~~~

Expected: no generated-data diff; zero catalog, expanded, image, and app issues; all Node tests and syntax checks pass; all Playwright tests pass in both profiles.

- [ ] **Step 4: Inspect the complete diff and commit documentation**

Run: git diff --check && git status --short && git diff --stat 7497ccdd3d4988450705a5c44fc8a1892c3a7773...HEAD

Expected: only approved production-hardening changes, no generated image or catalog-count drift.

~~~bash
git add README.md docs/superpowers/specs/2026-09-27-production-hardening-design.md
git commit -m "docs: explain production shell safeguards"
~~~

- [ ] **Step 5: Finish and publish one exact commit**

Read and follow finishing-a-development-branch and verification-before-completion. The user explicitly requested publication, so push the same full HEAD SHA without rewriting:

~~~powershell
$releaseSha = git rev-parse HEAD
git push origin ($releaseSha + ':refs/heads/main')
git push origin ($releaseSha + ':refs/heads/gh-pages')
git ls-remote origin refs/heads/main refs/heads/gh-pages
~~~

Expected: both remote refs equal $releaseSha.

- [ ] **Step 6: Verify Actions and live Pages**

Use the GitHub integration to confirm Catalog quality and pages-build-deployment succeed for the release SHA. Require HTTP 200 and current content for the root URL, manifest.webmanifest, sw.js, and 404.html. On the live page verify #/home and an unknown route, five primary entries, 公丁香 alias search, worker registration, 8,818 approved names, 608 cards, 106 food-medicine entries, 50 formulas, 30 syndromes, and a non-zero favorite badge after one favorite action.

---

## Plan self-review

- Spec coverage: Tasks 1–9 cover resource budgets and lock; metadata, manifest, 404, and privacy; bounded offline/update behavior; navigation and unknown routes; search semantics; chart text alternatives; themes, forced colors, safe areas, and motion; desktop/mobile/offline CI; documentation, deployment, and live verification.
- Placeholder scan: every implementation step names concrete files, commands, selectors, limits, copy, and expected results.
- Scope protection: no task changes data approval, expands factual records, generates images, adds a framework, or removes file-protocol support.
- Interface consistency: validateWebApp, PRECACHE_URLS, CACHE_VERSION, window.HerbalAppShell, #navMore, unknownPath, #searchStatus, and chartManager.describe use one spelling wherever consumed.
- Execution choice: inline execution in the existing isolated codex/herbal-cosmos-upgrade worktree, using executing-plans with review checkpoints.
