# React Bits Visual Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 精修本草宇宙首页的 React Bits 风格视觉层，增强背景、精选本草卡片和滚动节奏，同时保持原生 HTML/CSS/JS、数据模型和路由行为不变。

**Architecture:** 继续使用 `assets/css/components.css` 承载跨页面视觉原语，使用 `assets/css/home.css` 承载首页布局覆盖，使用 `assets/js/beautify.js` 初始化动效并通过数据属性避免路由重渲染后的重复绑定。首页数据仍由现有 runtime 渲染，视觉层只消费既有 DOM 钩子。

**Tech Stack:** 原生 HTML、CSS、JavaScript、现有 ECharts、Playwright。

## Global Constraints

- 不迁移 React，不新增运行时依赖或 CDN。
- 不修改 `data/`、图表数据、路由逻辑和其他页面业务交互。
- 所有背景层使用 `pointer-events:none` 与 `aria-hidden`，不能遮挡文字、图表或键盘焦点。
- 动效必须遵守 `prefers-reduced-motion: reduce`，移动端不使用 3D 倾斜。
- 不改变图表容器的高度策略，避免重新引入大块空白。

### Task 1: 精修背景、层级和首屏响应式样式

**Files:**
- Modify: `assets/css/components.css`
- Modify: `assets/css/home.css`

**Interfaces:**
- Consumes: 现有 `.hero-aurora`、`.noise-layer`、`body`、`.hero` 和首页 CSS 变量。
- Produces: 可见但低对比度的 Aurora / DotGrid / Noise 层，以及桌面、窄屏一致的首屏层级。

- [ ] **Step 1: 调整背景层的 stacking、透明度和混合模式**

  保持 Aurora、Noise、点阵为装饰层；让首页 Hero 的内部背景透出一部分点阵，同时保证文字区域使用渐变遮罩获得对比度。新增样式只使用既有主题变量。

- [ ] **Step 2: 优化首屏标题、CTA 和证据栏的响应式节奏**

  使用 `clamp()`、`min-height:100dvh` 兼容窄屏视口，减少移动端背景装饰强度，并保留 `#cosmosControls` 的可用空间。

- [ ] **Step 3: 手动检查 CSS 选择器和减少动态效果覆盖**

  运行 `npm run validate:app` 与 `npm run check:inline`，确保没有失效引用、内联运行时违规或新布局空白。

### Task 2: 精修精选本草、入口卡片与滚动揭示

**Files:**
- Modify: `assets/css/home.css`
- Modify: `assets/css/components.css`
- Modify: `assets/js/beautify.js`

**Interfaces:**
- Consumes: `#homeFeatured .featured-herb`、`.home-module-grid .home-module` 以及现有 React Bits 原生钩子。
- Produces: 可读、可聚焦、宽屏有轻量 Spotlight/Glare/倾斜反馈，触摸设备静态降级的首页卡片。

- [ ] **Step 1: 改善精选本草卡片的图片比例和文字层级**

  将六张精选卡调整为宽屏两行展廊/移动端横向可读的网格，统一图片高度、标题行高、资料摘要与焦点环，避免卡片内容被高亮层遮挡。

- [ ] **Step 2: 为卡片高亮层设置可访问的交互边界**

  为 `[data-spotlight]` 和 `[data-tilt]` 增加 `overflow:hidden`、焦点状态和触摸端静态规则，保持高亮层不影响链接点击。

- [ ] **Step 3: 防止路由重渲染重复绑定动效监听器**

  在 `spotlight()`、`tilt()` 与 CTA 磁吸初始化中添加数据标记，重复调用时跳过已绑定节点；保留现有 reduced-motion 和 fine-pointer 判断。

- [ ] **Step 4: 优化 ScrollReveal 的首屏触发和移动端节奏**

  保持 IntersectionObserver 单例，减少初始隐藏区域，确保首屏内容在观察器尚未触发时仍不会造成明显空白。

### Task 3: 回归验证、视觉检查与发布

**Files:**
- Modify: `sw.js` only if the final asset cache version needs a bump.

**Interfaces:**
- Consumes: Task 1 和 Task 2 的首页视觉实现。
- Produces: 通过验证的发布提交，`main` 与 `gh-pages` 指向同一提交。

- [ ] **Step 1: 运行单元、数据、应用与内联检查**

  ```powershell
  npm test
  npm run validate:data
  npm run validate:app
  npm run check:inline
  ```

- [ ] **Step 2: 运行桌面和移动端浏览器回归**

  ```powershell
  $env:PLAYWRIGHT_PORT='4189'
  npm run test:browser:ci
  ```

  检查首页、`#/qiwei`、`#/formula`，确认导航、图表、卡片焦点和移动端无横向溢出。

- [ ] **Step 3: 查看变更并提交**

  ```powershell
  git diff --check
  git status --short
  git add assets/css/components.css assets/css/home.css assets/js/beautify.js sw.js
  git commit -m "feat: refine React Bits visual system"
  ```

- [ ] **Step 4: 推送并验证两个 Pages 分支**

  ```powershell
  git push origin main
  git push origin main:gh-pages
  git ls-remote origin refs/heads/main refs/heads/gh-pages
  ```

  两个远端引用必须指向同一提交；最终检查 `https://runner-cpu.github.io/Herbal-Cosmos/`。
