# 本草宇宙数据深化与页面收敛实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 899 条开放来源事实全部转化为透明分层的可浏览知识卡，把学习与证候内容并入首页和配伍页，并统一四个核心页面的视觉与交互。

**Architecture:** 生成脚本负责事实分层和覆盖率报告；纯函数负责覆盖矩阵聚合和旧路由转换；运行时只渲染四个主路由，学习和证候作为核心页面内视图。CSS 继续使用现有语义变量和三主题，不引入依赖。

**Tech Stack:** Node.js ESM、vanilla JavaScript、ECharts、CSS custom properties、Node test runner、Playwright、GitHub Pages。

## Global Constraints

- 不手改 `expanded.generated.js`，所有生成数据由脚本产出。
- 不推断缺失药性、归经、地区、分类学或图片。
- 图片只能使用精确匹配且许可可追溯的开放来源。
- 18,817、2,711 只作为资源/标准统计，不作为当前逐条可浏览数量。
- 保留旧 hash 链接兼容；发布时 main 与 gh-pages 必须是同一 SHA。

---

### Task 1: 全量接入 899 条来源事实

**Files:**
- Modify: `assets/js/lib/data-coverage.mjs`
- Modify: `scripts/build-expanded-data.mjs`
- Modify: `scripts/validate-expanded-data.mjs`
- Test: `tests/expanded-data-coverage.test.mjs`
- Generate: `assets/js/data/expanded.generated.js`, `reports/data-coverage.json`

**Interfaces:**
- `factStatus(herb)` returns `complete | partial | legacy | material`.
- `buildDataCoverage(herbs)` adds `partialFacts`, `legacyFacts`, `meridianCovered`, `taxonomyCovered`, `factCoverageRatio`.

- [ ] Write a failing test that expects 902 knowledge cards, complete + partial + legacy equality, and transparent missing-field coverage.
- [ ] Run `node --test tests/expanded-data-coverage.test.mjs` and confirm failure because the build remains capped at 780.
- [ ] Implement fact status and build all unique source facts without inventing missing fields.
- [ ] Update validation so partial cards require traceable sources but do not require inferred meridians.
- [ ] Run `npm.cmd run build:expanded`, focused tests, and `npm.cmd run validate:expanded`.

### Task 2: 收敛为四个主路由并保留旧链接

**Files:**
- Modify: `assets/js/pages/cross-navigation.js`
- Modify: `assets/js/core/runtime.js`
- Modify: `index.html`
- Test: `tests/cross-navigation.test.mjs`, `tests/components.test.mjs`, `tests/browser/navigation.spec.js`

**Interfaces:**
- `normalizeLegacyRoute(route, params)` maps learn to home learning anchor and zheng to formula zheng view.
- Formula route accepts `view=network|zheng`, `z`, and `f`.

- [ ] Write failing unit tests for both legacy mappings and browser tests for four main navigation entries.
- [ ] Run focused tests and verify the old seven-route implementation fails.
- [ ] Remove learn/zheng page sections and nav links; add formula view controls and home learning markup.
- [ ] Implement redirect-compatible parsing without adding history loops.
- [ ] Run component and navigation tests.

### Task 3: 嵌入首页学习工作台

**Files:**
- Modify: `assets/js/core/runtime.js`
- Modify: `assets/js/pages/home.js`
- Modify: `assets/css/home.css`
- Test: `tests/browser/pwa.spec.js`, `tests/browser/accessibility.spec.js`

**Interfaces:**
- `renderLearn(targetPrefix = '')` renders into home quiz nodes and persists `herbal_learn_stats`.
- Home learning section id is `home-learning`.

- [ ] Add a failing browser test that answers a question on the home page and verifies persistence after reload.
- [ ] Render the existing quiz inside the home learning chapter and update all five path links to real core destinations.
- [ ] Add accessible status feedback and mobile layout.
- [ ] Run focused PWA/accessibility tests.

### Task 4: 将证候药链并入配伍页并双向联动

**Files:**
- Modify: `index.html`
- Modify: `assets/js/core/runtime.js`
- Modify: `assets/css/site.css`
- Test: `tests/cross-navigation.test.mjs`, `tests/browser/navigation.spec.js`, `tests/browser/chart-accessibility.spec.js`

**Interfaces:**
- `renderFormula()` selects the visible pane from `view`.
- `renderZheng()` renders the embedded pane and links back to `#/formula?view=network&f=...`.

- [ ] Add failing browser coverage for switching views and preserving the focused syndrome/formula.
- [ ] Move the zheng workspace markup inside the formula section and add an accessible two-button view switch.
- [ ] Update links and event handlers to retain `view`, `z`, and `f`.
- [ ] Initialize/dispose only the chart for the visible pane.
- [ ] Run focused chart/navigation tests.

### Task 5: 新增资料完整度矩阵

**Files:**
- Modify: `assets/js/lib/insight-aggregates.mjs`
- Modify: `assets/js/charts/insights.js`
- Modify: `index.html`
- Modify: `assets/js/core/runtime.js`
- Test: `tests/insight-aggregates.test.mjs`, `tests/browser/chart-accessibility.spec.js`

**Interfaces:**
- `buildFactCompletenessMatrix(herbs, limit = 12)` returns `{ categories, dimensions, cells, evidence }`.
- Click emits a filtered atlas URL using `cat` and `coverage`.

- [ ] Write a failing aggregate test with hand-derived category/dimension ratios.
- [ ] Implement the pure aggregate and ECharts heatmap with textual evidence.
- [ ] Add click-to-filter and keyboard-readable fallback links.
- [ ] Run aggregate and chart accessibility tests.

### Task 6: 统一四页纸面视觉与移动布局

**Files:**
- Modify: `assets/css/site.css`
- Modify: `assets/css/components.css`
- Modify: `assets/css/home.css`
- Test: `tests/browser/responsive.spec.js`, `tests/browser/accessibility.spec.js`

**Interfaces:**
- All page surfaces consume `--paper`, `--paper-2`, `--line`, `--ink`, and existing theme overrides.

- [ ] Add failing browser assertions for continuous surface colors, 44px view controls, and no overflow at 375px.
- [ ] Replace abrupt dark panels and generic shadow cards with connected chapter surfaces and shared spacing.
- [ ] Add focus/hover/pressed states and reduced-motion overrides.
- [ ] Run desktop/mobile responsive and accessibility suites.

### Task 7: 图片增补、全量验证与发布

**Files:**
- Generate only when verified matches exist: `data/sources/herb-images.json`, `assets/images/herbs/*`, `IMAGE_SOURCES_V4.md`
- Create: `reports/2026-09-28-consolidation-v2-audit.md`

- [ ] Run the existing missing-runtime image fetcher in dry-run/limited batches; accept only exact, open-license matches and leave other cards as explicit placeholders.
- [ ] Run `npm.cmd run build:data`, `npm.cmd run validate:data`, `npm.cmd run validate:app`, `npm.cmd test`, `npm.cmd run check:inline`, JS `node --check`, `npm.cmd run test:browser:ci`, and `git diff --check`.
- [ ] Record actual counts, route reduction, image coverage, responsive results, remaining limitations, and the multi-angle follow-up audit.
- [ ] Commit the implementation and audit.
- [ ] Push the exact commit SHA to `origin/main` and `origin/gh-pages`, verify both refs match, then smoke-test the production URL and generated data asset.
