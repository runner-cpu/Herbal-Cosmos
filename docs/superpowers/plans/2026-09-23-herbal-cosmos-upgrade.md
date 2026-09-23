# 本草宇宙可信度与体验升级实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有单文件静态网页升级为数据来源可审计、名称检索可信、跨页联动完整、移动端可验证的本草知识可视化作品。

**Architecture:** 保持原生 HTML/CSS/JavaScript 与静态部署，把数据规则、聚合逻辑、状态管理和页面渲染拆成顺序加载的经典脚本。全量目录由确定性构建产物生成，HTTP 环境走 Web Worker 分块查询，`file://` 环境走动态脚本回退；精品数据和主页面始终同步可用。

**Tech Stack:** HTML5、CSS3、原生 JavaScript、Canvas 2D、ECharts 5.6、Node.js 内置测试、Playwright、GitHub Actions。

## Global Constraints

- 运行时保持零构建，可在 GitHub Pages、本地 HTTP 服务和直接打开 `index.html` 三种环境使用。
- 《中国药典》2020 年版一部“2,711”只表述为中药标准总数；默认名称白名单使用可核验的药材与饮片名称。
- 无法确认的名称进入 `status: "review"`，保留审计证据，但不进入默认搜索、分页或星图。
- 索引层只提供名称检索，药性字段以 144 味精品卡为准。
- 不推断缺失药性、用途或典籍统计；未知值显示“未录入”。
- 新增动效必须同时遵守站内动效开关和 `prefers-reduced-motion`。
- 不新增运行时框架或 CDN 依赖；ECharts 继续使用仓库内文件。
- 本轮不生成新图片；如范围变更需生成栅格图，只能使用全局 `codex-image.cmd`。

---

## 文件结构

实施后主要职责如下：

- `index.html`：语义页面骨架、全局壳和 defer 脚本顺序。
- `assets/css/tokens.css`：日间、夜读、古籍主题与 z-index/动效令牌。
- `assets/css/base.css`：重置、排版、通用布局与可访问性。
- `assets/css/components.css`：导航、搜索、印章、抽屉、上下文条和图表面板。
- `assets/css/pages.css`：首页、星图、分析工作区和响应式样式。
- `assets/js/data/featured.js`：144 味精品卡、方剂、证候、食养、非遗和典籍数据。
- `assets/js/core/store.js`：订阅状态、localStorage 安全读写和持久偏好。
- `assets/js/core/router.js`：hash/query 解析、序列化和路由生命周期。
- `assets/js/core/catalog-loader.js`：Worker 与 file 协议兼容加载器。
- `assets/js/core/chart-manager.js`：ECharts/ResizeObserver 注册、销毁和调试计数。
- `assets/js/lib/catalog-rules.mjs`：Node 构建与浏览器检索共享的名称规则。
- `assets/js/lib/insight-aggregates.mjs`：四张洞察图的纯聚合函数。
- `assets/js/components/*.js`：搜索、收藏抽屉、上下文条、主题、印章组件。
- `assets/js/pages/*.js`：各路由渲染器与星图控制器。
- `data/sources/*.json`：权威名称、别名、变体、候选和来源元数据。
- `data/catalog/*.js`：manifest 与兼容分块；由脚本生成。
- `workers/catalog-search.js`：HTTP 环境目录查询 Worker。
- `scripts/build-herb-catalog.mjs`：确定性构建与分块。
- `scripts/validate-catalog.mjs`：目录、来源和图片质量门。
- `scripts/check-inline-runtime.mjs`：检查遗留内联逻辑和脚本加载顺序。
- `tests/*.test.mjs`：Node 单元测试。
- `tests/browser/*.spec.js`：Playwright 桌面与移动回归。
- `.github/workflows/catalog-quality.yml`：CI 质量门。

---

### Task 1: 建立可审计的药名规则与来源清单

**Files:**
- Create: `assets/js/lib/catalog-rules.mjs`
- Create: `data/sources/source-manifest.json`
- Create: `data/sources/pharmacopoeia-2020-materials.json`
- Create: `data/sources/classic-aliases.json`
- Create: `data/sources/character-variants.json`
- Create: `data/sources/raw-candidates.json`
- Create: `tests/catalog-rules.test.mjs`

**Interfaces:**
- Produces: `normalizeCandidate(raw): string`
- Produces: `splitCandidate(raw): string[]`
- Produces: `classifyCandidate(raw, authority): { canonicalName, aliases, status, reviewReasons }`
- Authority shape: `{ canonicalNames: Set<string>, aliases: Map<string,string>, variants: Map<string,string> }`

- [ ] **Step 1: 写失败测试，固定噪声、变体和复合名边界**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAuthority, classifyCandidate, splitCandidate } from '../assets/js/lib/catalog-rules.mjs';

const authority = buildAuthority({
  canonicalNames: ['川楝子', '川芎', '皂角刺', '泽泻', '沙参'],
  aliases: { 皂角针: '皂角刺' },
  variants: { 川棟子: '川楝子', 川萼: '川芎', 皂角剌: '皂角刺' }
});

test('已核验异体字归并到规范名并保留 alias', () => {
  assert.deepEqual(classifyCandidate('皂角剌', authority), {
    canonicalName: '皂角刺', aliases: ['皂角剌'], status: 'approved', reviewReasons: []
  });
});

test('症状句和含等条目进入 review', () => {
  assert.equal(classifyCandidate('出现面色苍白', authority).status, 'review');
  assert.equal(classifyCandidate('皂角刺等脓肿破溃', authority).status, 'review');
});

test('只拆明确分隔符，不猜分无分隔复合名', () => {
  assert.deepEqual(splitCandidate('泽泻、沙参'), ['泽泻', '沙参']);
  assert.equal(classifyCandidate('泽泻沙参', authority).status, 'review');
});
```

- [ ] **Step 2: 运行测试并确认因模块不存在而失败**

Run: `node --test tests/catalog-rules.test.mjs`  
Expected: FAIL，错误包含 `ERR_MODULE_NOT_FOUND`。

- [ ] **Step 3: 实现最小规则模块**

```js
export const NOISE_WORDS = ['疼痛', '抽搐', '烦躁', '苍白', '破溃'];
export const SEPARATORS = /[、，,；;/\+]/;

export function buildAuthority({canonicalNames, aliases, variants}) {
  return { canonicalNames: new Set(canonicalNames), aliases: new Map(Object.entries(aliases)), variants: new Map(Object.entries(variants)) };
}

export function splitCandidate(raw) {
  return String(raw).split(SEPARATORS).map(value => value.trim()).filter(Boolean);
}

export function normalizeCandidate(raw, variants = new Map()) {
  const compact = String(raw).replace(/\uFEFF|\s+/g, '');
  return variants.get(compact) || compact;
}

export function classifyCandidate(raw, authority) {
  const original = String(raw).trim();
  const normalized = normalizeCandidate(original, authority.variants);
  const reasons = [];
  if (NOISE_WORDS.some(word => normalized.includes(word))) reasons.push('symptom-word');
  if (normalized.includes('等')) reasons.push('contains-deng');
  if (normalized.length > 8) reasons.push('too-long');
  const canonicalName = authority.canonicalNames.has(normalized) ? normalized : authority.aliases.get(normalized) || '';
  if (!canonicalName) reasons.push('not-in-authority');
  return { canonicalName: canonicalName || normalized, aliases: canonicalName && canonicalName !== original ? [original] : [], status: reasons.length ? 'review' : 'approved', reviewReasons: [...new Set(reasons)] };
}
```

- [ ] **Step 4: 整理并记录公开来源**

`source-manifest.json` 必须记录以下已核验入口和 SHA-256：国家药监局 2020 年第 78 号公告 `https://www.nmpa.gov.cn/xxgk/ggtg/ypggtg/ypqtggtg/20200702151301219.html`、公开学术统计《2020 年版药典收录的中药材与中药制剂的系统分析》、中华中医药学会公开的中药饮片处方用名标准公示稿。药材名进入主表前须有药典页码、公开表格行或第二来源交叉记录；来源不足的候选写入 `raw-candidates.json`，不能写入规范名数组。

- [ ] **Step 5: 重跑测试并提交**

Run: `node --test tests/catalog-rules.test.mjs`  
Expected: PASS。

```bash
git add assets/js/lib/catalog-rules.mjs data/sources tests/catalog-rules.test.mjs
git commit -m "feat: add auditable herb name authority"
```

---

### Task 2: 重写目录构建器并生成 approved/review 产物

**Files:**
- Modify: `scripts/build-herb-catalog.mjs`
- Create: `tests/catalog-build.test.mjs`
- Generate: `data/herb-catalog.js`
- Generate: `data/catalog/manifest.js`
- Generate: `data/catalog/chunk-*.js`
- Generate: `reports/catalog-review.json`

**Interfaces:**
- Produces: `buildCatalog({candidates, authority}): {approved, review, stats}`
- Browser global: `window.HERB_CATALOG_MANIFEST`
- Chunk global: `window.__HERB_CATALOG_CHUNKS__[chunkId]`

- [ ] **Step 1: 写确定性、别名聚合和 review 保留测试**

```js
test('构建与输入顺序无关并聚合 aliases', () => {
  const result = buildCatalog({candidates: ['皂角剌', '皂角刺', '出现面色苍白'], authority});
  assert.equal(result.approved.length, 1);
  assert.deepEqual(result.approved[0].aliases, ['皂角剌']);
  assert.equal(result.review[0].name, '出现面色苍白');
  assert.match(result.approved[0].id, /^herb-[a-f0-9]{12}$/);
});
```

- [ ] **Step 2: 运行测试，确认旧脚本没有导出构建接口**

Run: `node --test tests/catalog-build.test.mjs`  
Expected: FAIL，错误指向 `buildCatalog` 未导出。

- [ ] **Step 3: 把构建器改为可导入函数和 CLI 双入口**

使用 `createHash('sha256').update(canonicalName).digest('hex').slice(0, 12)` 生成稳定 ID；按规范名合并 aliases/sourceRefs；approved 和 review 分别排序；manifest 写入 `approvedCount`、`reviewCount`、`chunks`、`sourceRevision`、`authorityHash`。`sourceRevision` 取受版本控制来源清单中的固定修订日期，不写当前时间，保证同一输入逐字节重建一致。CLI 只从 `data/sources/` 读取，不读 `.tmp-*`。

- [ ] **Step 4: 生成浏览器兼容分块**

每块不超过 120 条 approved 名称，内容格式固定：

```js
window.__HERB_CATALOG_CHUNKS__ = window.__HERB_CATALOG_CHUNKS__ || {};
window.__HERB_CATALOG_CHUNKS__['c00'] = [{id:'herb-…',name:'阿魏',aliases:[],sourceRefs:['cp2020']}];
```

- [ ] **Step 5: 验证构建两次哈希一致并提交**

Run: `node scripts/build-herb-catalog.mjs && git hash-object data/herb-catalog.js data/catalog/*.js`  
Run again with the same inputs.  
Expected: 两次文件哈希完全一致；产物不包含“出现面色苍白”“躁不安或抽搐”“则治其本”。

```bash
git add scripts/build-herb-catalog.mjs tests/catalog-build.test.mjs data/herb-catalog.js data/catalog reports/catalog-review.json
git commit -m "feat: build tiered herb catalog artifacts"
```

---

### Task 3: 增加目录质检命令和 CI 基础

**Files:**
- Create: `scripts/validate-catalog.mjs`
- Create: `tests/catalog-validation.test.mjs`
- Create: `package.json`
- Create: `.github/workflows/catalog-quality.yml`

**Interfaces:**
- Produces: `validateCatalog({approved, review, manifest, root}): {errors, warnings, stats}`
- CLI exit code: errors 为空为 0，否则为 1。

- [ ] **Step 1: 写失败测试覆盖噪声、alias 冲突和缺图**

```js
test('approved 层的症状词和 alias 冲突是硬错误', () => {
  const report = validateCatalog({
    approved: [
      {id:'a',name:'出现面色苍白',aliases:['皂角针'],sourceRefs:['x'],status:'approved'},
      {id:'b',name:'皂角刺',aliases:['皂角针'],sourceRefs:['x'],status:'approved'}
    ], review: [], manifest: {approvedCount:2}, root: fixtureRoot
  });
  assert.ok(report.errors.some(error => error.code === 'approved-noise'));
  assert.ok(report.errors.some(error => error.code === 'alias-conflict'));
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `node --test tests/catalog-validation.test.mjs`  
Expected: FAIL，`validateCatalog` 未定义。

- [ ] **Step 3: 实现验证器和 npm scripts**

```json
{
  "private": true,
  "scripts": {
    "build:catalog": "node scripts/build-herb-catalog.mjs",
    "validate:catalog": "node scripts/validate-catalog.mjs",
    "test:unit": "node --test tests/*.test.mjs",
    "test:e2e": "playwright test",
    "test": "npm run test:unit && npm run validate:catalog && npm run test:e2e"
  },
  "devDependencies": {"@playwright/test": "1.55.0"}
}
```

- [ ] **Step 4: 增加 Actions 工作流**

CI 使用 Node 22，依次执行 `npm ci`、目录构建、`git diff --exit-code data/ reports/`、目录验证、单元测试、Playwright Chromium 安装和 smoke。

- [ ] **Step 5: 运行验证并提交**

Run: `npm install`  
Run: `npm run test:unit && npm run validate:catalog`  
Expected: 全部退出 0，validator 输出 approved/review 精确数量。

```bash
git add package.json package-lock.json scripts/validate-catalog.mjs tests/catalog-validation.test.mjs .github/workflows/catalog-quality.yml
git commit -m "ci: enforce catalog credibility checks"
```

---

### Task 4: 拆分单文件并建立可测试的运行核心

**Files:**
- Modify: `index.html`
- Create: `assets/css/tokens.css`
- Create: `assets/css/base.css`
- Create: `assets/css/components.css`
- Create: `assets/css/pages.css`
- Create: `assets/js/data/featured.js`
- Create: `assets/js/core/store.js`
- Create: `assets/js/core/router.js`
- Create: `assets/js/core/chart-manager.js`
- Create: `tests/router.test.mjs`
- Create: `scripts/check-inline-runtime.mjs`

**Interfaces:**
- `window.Herbal.store.getState/subscribe/setState`
- `window.Herbal.router.parseHash/formatHash/navigate`
- `window.Herbal.chartManager.register/dispose/disposeAll/debugCounts`

- [ ] **Step 1: 写 hash 往返和 store 精确通知测试**

```js
test('hash query 中文参数可逆', () => {
  const parsed = parseHash('#/formula?f=guizhitang&from=zheng&herb=白芍');
  assert.deepEqual(parsed, {route:'formula', params:{f:'guizhitang',from:'zheng',herb:'白芍'}});
  assert.equal(formatHash(parsed.route, parsed.params), '#/formula?f=guizhitang&from=zheng&herb=%E7%99%BD%E8%8A%8D');
});
```

- [ ] **Step 2: 运行测试确认失败，再实现纯路由函数**

Run: `node --test tests/router.test.mjs`  
Expected: FAIL。实现后重跑，Expected: PASS。

- [ ] **Step 3: 按职责迁移现有 CSS、数据和核心逻辑**

脚本顺序固定为 featured data → store → router → chart manager → components → pages → app。`check-inline-runtime.mjs` 解析 `index.html`，若仍存在超过 30 行的内联 `<style>` 或业务 `<script>` 则退出 1。

- [ ] **Step 4: 暴露只读调试计数以支持泄漏测试**

```js
window.__HERBAL_DEBUG__ = {
  chartCounts: () => window.Herbal.chartManager.debugCounts(),
  state: () => structuredClone(window.Herbal.store.getState())
};
```

- [ ] **Step 5: 运行语法和页面骨架检查并提交**

Run: `node scripts/check-inline-runtime.mjs`  
Run: `Get-ChildItem assets/js -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }`  
Expected: 全部退出 0。

```bash
git add index.html assets/css assets/js/data assets/js/core tests/router.test.mjs scripts/check-inline-runtime.mjs
git commit -m "refactor: split static runtime by responsibility"
```

---

### Task 5: 实现全局主题、上下文条、搜索和收藏抽屉

**Files:**
- Create: `assets/js/components/theme.js`
- Create: `assets/js/components/context-bar.js`
- Create: `assets/js/components/search.js`
- Create: `assets/js/components/saved-drawer.js`
- Create: `assets/js/components/stamp.js`
- Modify: `assets/css/components.css`
- Modify: `index.html`
- Create: `tests/browser/shell.spec.js`

**Interfaces:**
- `setSelectedHerb(herbId, source)` updates store and viewed history.
- `openSavedDrawer()/closeSavedDrawer()/exportSavedJson()`
- `setTheme('day'|'night'|'classic')`

- [ ] **Step 1: 写浏览器失败测试**

```js
test('选中药材显示上下文条并可导出收藏', async ({page}) => {
  await page.goto('/#/herb?id=gancao');
  await expect(page.getByTestId('herb-context')).toContainText('甘草');
  await page.getByRole('button', {name:'收藏'}).click();
  await page.getByRole('button', {name:'打开收藏'}).click();
  await expect(page.getByRole('complementary', {name:'本机收藏'})).toContainText('甘草');
});
```

- [ ] **Step 2: 运行 Playwright 并确认上下文条不存在**

Run: `npx playwright test tests/browser/shell.spec.js`  
Expected: FAIL，找不到 `herb-context`。

- [ ] **Step 3: 实现组件与古籍主题**

主题使用 `data-theme` 而非叠加 class；classic 令牌至少包含 `--paper:#F1E4C5`、`--paper-2:#E8D8B5`、`--ink:#352C22`、`--cinnabar:#A43C2F`。上下文条提供星图、性味、配伍、相关方剂四个实际 href。搜索只消费 approved 目录，并在输入旁常驻口径提示。

- [ ] **Step 4: 将 `#/saved` 兼容为打开抽屉**

router 遇到 saved 时调用 `openSavedDrawer()` 并 `replaceState` 回来源路由；导航和更多菜单不再显示收藏链接。导出 JSON 结构固定为 `{schemaVersion:1, exportedAt, herbs:[{id,name}]}`。

- [ ] **Step 5: 重跑浏览器测试并提交**

Run: `npx playwright test tests/browser/shell.spec.js`  
Expected: PASS。

```bash
git add index.html assets/js/components assets/css/components.css tests/browser/shell.spec.js
git commit -m "feat: add global herb context and saved drawer"
```

---

### Task 6: 重排首页并合并食养、非遗和典籍内容

**Files:**
- Create: `assets/js/pages/home.js`
- Create: `assets/js/pages/food.js`
- Create: `assets/js/pages/culture.js`
- Modify: `index.html`
- Modify: `assets/css/pages.css`
- Create: `tests/browser/home.spec.js`

**Interfaces:**
- `renderHome()` 按固定章节顺序渲染。
- `renderFoodMatrix(target, foods, {compact})` 供首页与 food 页复用。
- `openClassicDetail(classicId)` 只显示已有字段。

- [ ] **Step 1: 写首页顺序和展开行为测试**

```js
test('首页章节顺序与规格一致', async ({page}) => {
  await page.goto('/#/home');
  const ids = await page.locator('main [data-home-section]').evaluateAll(nodes => nodes.map(node => node.dataset.homeSection));
  expect(ids).toEqual(['hero','archive','categories','entrances','learning','featured','food','classics','culture','about']);
});
```

- [ ] **Step 2: 运行测试确认 food/culture 章节缺失或顺序不符**

Run: `npx playwright test tests/browser/home.spec.js`  
Expected: FAIL。

- [ ] **Step 3: 实现首页食养横滑条和文化精选**

食养条使用原生横向滚动与 scroll-snap，每项包含图片、性味、用法和印章。文化默认只显示三项，按钮更新 `aria-expanded` 并展开其余三项；独立页仍显示全部。学习五步 href 使用 `#/learn?step=atlas|qiwei|formula|classics|food`。

- [ ] **Step 4: 升级典籍图并实现详情浮层**

按 `era` 映射朝代色带，series 点击通过 classic ID 打开浮层。详情字段仅渲染数据中存在的 `medicines/formulas/illustrations`，不存在时输出“未录入”，不能输出 0。

- [ ] **Step 5: 重跑首页测试并提交**

Run: `npx playwright test tests/browser/home.spec.js`  
Expected: PASS。

```bash
git add index.html assets/js/pages/home.js assets/js/pages/food.js assets/js/pages/culture.js assets/css/pages.css tests/browser/home.spec.js
git commit -m "feat: compose food and heritage into home journey"
```

---

### Task 7: 增加四张洞察图与证据钻取

**Files:**
- Create: `assets/js/lib/insight-aggregates.mjs`
- Create: `assets/js/charts/insights.js`
- Create: `assets/js/pages/formula.js`
- Create: `assets/js/pages/qiwei.js`
- Modify: `assets/js/pages/food.js`
- Create: `tests/insight-aggregates.test.mjs`
- Create: `tests/browser/insights.spec.js`

**Interfaces:**
- `rankFormulaHerbs(formulas, herbs)`
- `countFormulaRoles(formulas)`
- `buildMeridianEffectFlow(herbs)`
- `buildFoodUsageMatrix(foods)`

- [ ] **Step 1: 写聚合函数失败测试**

```js
test('入方排行按方数降序且同方不重复计数', () => {
  const ranked = rankFormulaHerbs([{id:'a',herbs:[['gancao'],['gancao'],['guizhi']]},{id:'b',herbs:[['gancao']]}]);
  assert.deepEqual(ranked.slice(0,2), [{id:'gancao',count:2},{id:'guizhi',count:1}]);
});

test('归经功效流量由真实药材展开', () => {
  const flow = buildMeridianEffectFlow([{id:'x',meridian:['肺','脾'],cat:'补气'}]);
  assert.deepEqual(flow.links, [{source:'肺经',target:'补气',value:1},{source:'脾经',target:'补气',value:1}]);
});
```

- [ ] **Step 2: 运行单元测试并确认失败**

Run: `node --test tests/insight-aggregates.test.mjs`  
Expected: FAIL。

- [ ] **Step 3: 实现纯聚合函数和 ECharts 适配层**

聚合函数不访问 DOM/ECharts；图表适配层负责 tooltip、颜色、点击和证据检查器。配伍页同时展示横向排行与 21 方角色堆积条；性味页展示十二经→功效桑基图；首页/food 页复用用途矩阵。

- [ ] **Step 4: 实现雷达顶点钻取**

在雷达图点击时将画布坐标与当前 indicator 的极坐标顶点比较，距离最近且小于 28px 时导航到 `#/qiwei?metric=<indicator>&herbs=<ids>`；否则保留现有系列点击行为。

- [ ] **Step 5: 验证聚合和浏览器交互并提交**

Run: `node --test tests/insight-aggregates.test.mjs`  
Run: `npx playwright test tests/browser/insights.spec.js`  
Expected: PASS，图表标题旁显示 `21 首方剂`、`144 味精品卡` 或实际 FOODS 样本数。

```bash
git add assets/js/lib/insight-aggregates.mjs assets/js/charts assets/js/pages/formula.js assets/js/pages/qiwei.js assets/js/pages/food.js tests/insight-aggregates.test.mjs tests/browser/insights.spec.js
git commit -m "feat: add evidence-linked insight charts"
```

---

### Task 8: 完成病证/配伍双向联动和学习浮层

**Files:**
- Create: `assets/js/pages/zheng.js`
- Create: `assets/js/pages/learn.js`
- Modify: `assets/js/pages/formula.js`
- Create: `tests/browser/cross-navigation.spec.js`

**Interfaces:**
- `selectFormula(formulaId, {source, zhengId})` 同步 store 和 query。
- `selectZheng(zhengId)` 更新证据视图。
- `openQuizFeedback(result)` 在当前学习卡内显示。

- [ ] **Step 1: 写闭环导航失败测试**

```js
test('证候到方剂再到药材保持可返回上下文', async ({page}) => {
  await page.goto('/#/zheng');
  await page.getByTestId('zheng-formula-link').first().click();
  await expect(page).toHaveURL(/#/formula?f=.*from=zheng&z=/);
  await expect(page.getByTestId('formula-inspector')).toContainText('返回相关证候');
});
```

- [ ] **Step 2: 运行测试并确认现有证候图只处理 herb 节点**

Run: `npx playwright test tests/browser/cross-navigation.spec.js`  
Expected: FAIL。

- [ ] **Step 3: 实现方剂节点点击和返回链接**

证候图的 formula 节点包含真实 formula ID，不再使用仅页面内 `formula-0`；点击写入 `f/from/z`。配伍页从 query 聚焦节点，并在 inspector 放置 `#/zheng?z=<id>&f=<id>` 返回链接。

- [ ] **Step 4: 实现学习 step query 和答题浮层**

学习页读取 step，突出对应学习阶段；答题结果使用带 `role="status"` 的卡内浮层，Esc 可关闭，不创建新路由。

- [ ] **Step 5: 重跑闭环测试并提交**

Run: `npx playwright test tests/browser/cross-navigation.spec.js`  
Expected: PASS。

```bash
git add assets/js/pages/zheng.js assets/js/pages/formula.js assets/js/pages/learn.js tests/browser/cross-navigation.spec.js
git commit -m "feat: link patterns formulas and learning steps"
```

---

### Task 9: 修复星图 LOD 并增加聚焦、着色、足迹和动效治理

**Files:**
- Create: `assets/js/pages/cosmos.js`
- Modify: `assets/js/core/store.js`
- Modify: `assets/css/pages.css`
- Create: `tests/cosmos-labels.test.mjs`
- Create: `tests/browser/cosmos-mobile.spec.js`

**Interfaces:**
- `selectVisibleLabels(stars, viewport, scale, state): Star[]`
- `focusHerb(herbId, {animate})`
- `setCosmosColorMode('uniform'|'effect')`
- `setMotionEnabled(boolean)`

- [ ] **Step 1: 写默认稀疏和去重失败测试**

```js
test('默认缩放不会显示重复或全量标签', () => {
  const labels = selectVisibleLabels(starsWithDuplicates, {width:1280,height:720}, 1, {selectedHerb:null,viewedHerbs:new Set()});
  assert.ok(labels.length <= 18);
  assert.equal(new Set(labels.map(item => item.herb.id)).size, labels.length);
});
```

- [ ] **Step 2: 运行单元测试确认失败**

Run: `node --test tests/cosmos-labels.test.mjs`  
Expected: FAIL。

- [ ] **Step 3: 实现三层 LOD 与碰撞检测**

先按规范 ID 去重，再给 selected/hover/favorite/viewed/food/formula-frequency 赋优先级；按 96×24px 估算标签矩形做碰撞排除。scale `<1.25` 上限 18，`1.25–1.8` 上限 40，`>=1.8` 上限 90。

- [ ] **Step 4: 实现飞行、双击、着色和 reduced motion**

搜索与上下文条调用 `focusHerb`；Canvas `dblclick` 固定焦点；功效模式从 `herb.cat` 映射颜色。系统或站内减少动效时 `animate=false`，取消 `requestAnimationFrame` 公转增量和 scroll 视差。首屏按钮下增加可聚焦滚动提示。

- [ ] **Step 5: 验证移动触控和足迹并提交**

Run: `node --test tests/cosmos-labels.test.mjs`  
Run: `npx playwright test tests/browser/cosmos-mobile.spec.js --project=chromium`  
Expected: PASS；375px 模拟触控可拖动、缩放、点星，已阅药材出现外圈标记。

```bash
git add assets/js/pages/cosmos.js assets/js/core/store.js assets/css/pages.css tests/cosmos-labels.test.mjs tests/browser/cosmos-mobile.spec.js
git commit -m "feat: refine cosmos focus and label hierarchy"
```

---

### Task 10: 实现目录 Worker、分块懒加载和 file 协议回退

**Files:**
- Create: `workers/catalog-search.js`
- Create: `assets/js/core/catalog-loader.js`
- Modify: `assets/js/components/search.js`
- Create: `assets/js/pages/herbs.js`
- Create: `tests/browser/catalog-loading.spec.js`

**Interfaces:**
- `catalogLoader.search(query, {page, pageSize, source}): Promise<{items,total,status}>`
- Worker messages: `{type:'search', requestId, query, page, pageSize, source}` / `{type:'result', requestId, items, total}`

- [ ] **Step 1: 写首屏不加载和首次查询加载测试**

```js
test('目录只在进入索引模式后加载', async ({page}) => {
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/#/home');
  expect(requests.some(url => url.includes('/data/catalog/chunk-'))).toBeFalsy();
  await page.goto('/#/herbs?mode=catalog&q=皂角刺');
  await expect(page.getByTestId('catalog-result')).toContainText('皂角刺');
  expect(requests.some(url => url.includes('/data/catalog/chunk-'))).toBeTruthy();
});
```

- [ ] **Step 2: 运行测试并确认当前 `herb-catalog.js` 首屏加载**

Run: `npx playwright test tests/browser/catalog-loading.spec.js`  
Expected: FAIL。

- [ ] **Step 3: 实现 Worker 查询协议和加载器**

HTTP 环境使用 `new Worker('workers/catalog-search.js')`；每个请求带递增 requestId，过期响应丢弃。Worker 根据 manifest 的首字/alias 路由选择分块。

- [ ] **Step 4: 实现 file 协议兼容路径**

`location.protocol === 'file:'` 或 Worker 初始化失败时，按需插入 `<script src="data/catalog/chunk-c00.js">`，读取 `window.__HERB_CATALOG_CHUNKS__`，使用 `requestIdleCallback` 或 16ms setTimeout 分批过滤。UI 显示 loading/error/retry/ready，review 永不进入分块。

- [ ] **Step 5: 在 HTTP 和 file 回退测试后提交**

Run: `npx playwright test tests/browser/catalog-loading.spec.js`  
Run: `node scripts/validate-catalog.mjs`  
Expected: PASS；首页网络记录没有目录 chunk，请求目录后才加载。

```bash
git add workers/catalog-search.js assets/js/core/catalog-loader.js assets/js/components/search.js assets/js/pages/herbs.js tests/browser/catalog-loading.spec.js
git commit -m "perf: lazy load searchable herb catalog"
```

---

### Task 11: 补齐浏览器回归、泄漏检查、README 和 CI

**Files:**
- Create: `playwright.config.js`
- Create: `tests/browser/responsive.spec.js`
- Create: `tests/browser/leaks.spec.js`
- Create: `tests/browser/accessibility.spec.js`
- Modify: `.github/workflows/catalog-quality.yml`
- Modify: `README.md`
- Modify: `DESIGN_AUDIT.md`

**Interfaces:**
- Playwright webServer: `python -m http.server 4173`
- Debug counts: `{charts:number, observers:number}`

- [ ] **Step 1: 写路由泄漏和 reduced-motion 失败测试**

```js
test('重复切换图表路由不增长实例', async ({page}) => {
  await page.goto('/#/qiwei');
  const baseline = await page.evaluate(() => window.__HERBAL_DEBUG__.chartCounts());
  for (let i = 0; i < 4; i++) { await page.goto('/#/formula'); await page.goto('/#/qiwei'); }
  expect(await page.evaluate(() => window.__HERBAL_DEBUG__.chartCounts())).toEqual(baseline);
});
```

- [ ] **Step 2: 运行浏览器测试并修复真实失败**

Run: `npx playwright test tests/browser/leaks.spec.js tests/browser/responsive.spec.js tests/browser/accessibility.spec.js`  
Expected before fixes: 至少泄漏或缺少移动目标的断言失败。修复 chartManager 路由销毁、observer 解绑、44px 触控目标、焦点环和键盘关闭后重跑。

- [ ] **Step 3: 更新文档中的真实口径和运行命令**

README 必须写明：2,711 是标准总数、approved 精确数量、review 精确数量、144 精品卡边界、目录来源、`npm test`、直接打开回退、文件结构和 CI。删除“单文件交付”与“2,275 条均可检索”等过时文案。

- [ ] **Step 4: 完成全套验证**

Run: `npm run build:catalog`  
Run: `git diff --exit-code data/ reports/`  
Run: `npm run validate:catalog`  
Run: `npm run test:unit`  
Run: `node scripts/check-inline-runtime.mjs`  
Run: `npx playwright test`  
Run: `git diff --check`  
Expected: 所有命令退出 0，Playwright 0 failed，构建产物无差异。

- [ ] **Step 5: 提交回归与文档**

```bash
git add playwright.config.js tests/browser .github/workflows/catalog-quality.yml README.md DESIGN_AUDIT.md
git commit -m "test: cover responsive interactions and chart lifecycle"
```

---

### Task 12: 预览验收、远端核对与推送

**Files:**
- Modify only files required by failures found during final verification.

**Interfaces:**
- Final remote target: `origin/main`

- [ ] **Step 1: 启动本地预览并检查关键页面**

Run: `python -m http.server 4173`  
检查 `#/home`、`#/herbs?mode=catalog`、`#/qiwei`、`#/formula`、`#/zheng`、`#/food`、`#/culture`、`#/learn`，并保存桌面与 375px 截图到 Playwright test artifacts（不提交截图）。

- [ ] **Step 2: 重跑完整验证并检查工作树**

Run: `npm test`  
Run: `git diff --check`  
Run: `git status --short --branch`  
Expected: 测试全部通过；工作树干净；分支只领先预期提交。

- [ ] **Step 3: 核对远端没有新增提交**

Run: `git fetch origin`  
Run: `git log --oneline --left-right origin/main...main`  
Expected: 左侧没有远端独有提交。若存在，停止推送并先向用户报告。

- [ ] **Step 4: 推送并验证远端提交哈希**

Run: `git push origin main`  
Run: `git rev-parse HEAD`  
Run: `git ls-remote origin refs/heads/main`  
Expected: 本地 HEAD 与远端 main 哈希完全相同。
