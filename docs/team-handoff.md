# 本草宇宙 · 百子万象团队交接

> 交接基线：`8fb00bd`（2026-10-13）  
> 当前分支：`main`；发布分支：`gh-pages`；在线地址：<https://runner-cpu.github.io/Herbal-Cosmos/>

这份文档给接手项目的队友使用。先读完“不可破坏的约束”和“执行顺序”，再开始改代码。项目是原生 ES Modules + CSS + 静态 JSON 的 GitHub Pages 展示，不需要引入 React、构建框架、服务端或新的数据服务。

## 1. 项目目标

本草宇宙是面向评委和普通访客的本草文化交互展，核心叙事是：把 120 味本草放回六类生境，用白天的百子柜发现一味本草，用夜间的粒子星球查看全量关系，再在一味档案中核对形态、文献和公开来源。

用户应该在三分钟内走完一条清晰路径：

`首页 → 百子柜 → 生境 → 抽屉 → 一味档案 → 相似药材 / 证据链 → 资料库`

三个评委记忆点按优先级排列：

1. **百子柜**：六类生境组成一面三列两排的柜墙；选中抽屉沿左前方 Z 轴拉出，右侧同步打开米纸详情。
2. **粒子星球**：120 味本草各是一颗粒子，按主生境着色；支持旋转、缩放、搜索、筛选和点击详情。
3. **识形与辨别**：一味档案中的结构化识形台、真实植物照片、四组相似药材照片对照和看图识本草。

## 2. 当前页面和职责

导航由 `src/ui-layout.js` 的 `renderCosmosHeader` 生成，页面状态和事件由 `src/main.js` 管理。

| 页面 | Hash | 负责什么 | 主要文件 |
| --- | --- | --- | --- |
| 宇宙首页 | `#home` | 解释昼夜双世界、四条入口和三条中国故事锚点 | `src/ui-layout.js` |
| 百子柜 | `#cabinet` | 按生境、形态筛选并抽出一味本草 | `src/ui-layout.js`、`src/styles.css` |
| 粒子星球 | `#planet` | 旋转、缩放和点击 120 粒子 | `src/planet.js`、`src/main.js` |
| 一味档案 | `#trace` | 识形台、证据链、来源抽屉、相似药材 | `src/main.js`、`src/relations.js` |
| 资料库 | `#library` | 16 味精品 + 104 味拓展的筛选目录 | `src/main.js`、`src/styles.css` |
| 项目说明 | `#curation` | 定位、数据精度、构建方式、无障碍、演示路径、已知不足 | `src/main.js`、`src/styles.css` |

路由采用 `location.hash`，没有服务端路由。无法识别的哈希会回到首页并显示一条提示。新增页面前先判断是否真的需要新舞台；优先把功能接入已有页面，避免首页堆叠入口。

## 3. 关键代码入口

- `index.html`：静态入口、OG/Twitter 分享卡、JSON-LD、样式和模块脚本版本号。修改 JS/CSS 后必须同步更新查询参数，避免 Pages 缓存旧资源。
- `src/main.js`：数据加载、全局状态、六个页面渲染、事件代理、图片灯箱、看图识本草和结构化标本拖动。
- `src/ui-layout.js`：品牌头部、首页、百子柜、六类生境常量和柜墙 HTML。
- `src/planet.js`：Canvas 粒子星球、指针拖拽、滚轮/触控缩放、键盘交互和无 Canvas 时的目录回退。
- `src/relations.js`：关系星图模型和可访问的 HTML 关系列表；不要把来源支持边误写成药材关系。
- `src/styles.css`：全站视觉系统、响应式布局、柜墙透视、粒子星球、资料库样式和打印样式。品牌变量在文件顶部和重构追加区均有定义，修改前先搜索现有选择器。
- `src/data/curated/schema.md`：数据契约和展示边界，任何新增数据先按这里校验。
- `scripts/build.mjs`：读取全部静态 JSON 做最小构建检查，不会生成新的 bundle。
- `scripts/make-og-cover.py`：用当前数据计数渲染 1200×630 分享卡到 `src/assets/share/og-cover.jpg`；数据计数变化后重跑一次。
- `tests/new-app.test.mjs`：数据完整性、图片资产、关系来源、旧运行时依赖和关键 DOM/CSS 契约。

## 4. 数据现状和新增规则

`src/data/curated/` 当前包含：

- `herbs.json`：120 味本草；16 味 `deep/featured`，104 味 `overview/catalog`。
- `herb-images.json`：120 条本草图片，当前全部 `ready`，路径指向 `src/assets/herbs/`，每条都带 `width`/`height` 以免图片加载时抖动。
- `sources.json`：14 个公开来源，实体和关系均通过 ID 引用。
- `formulas.json`：3 首方剂。
- `cultural-anchors.json`：3 个文化/研究史锚点。
- `relations.json`：20 条可视化关系。
- `specimens.json`：6 个结构化识形台标本。
- `comparisons.json`：4 组相似药材对照；四组均有真实照片。

注意：120 味中只有 3 味登记了古典文本锚点、8 味登记了方剂组成、1 味登记了现代研究史节点。证据链只渲染真实存在的节点，缺口用 `.chain-gap-note` 明说，不要用“待补”占位节点伪造完整度。另有 7 组同物种不同药用部位共用同一条公开观测照片，灯箱会主动说明复用关系；新增图片时不要为了“每味一张”而虚构来源。

新增本草时必须遵守：

1. 只归入一个主生境：`shanlin`、`caodian`、`huaye`、`guoshi`、`shuize`、`junmu`。
2. 同时填写 `habitatLabel`、`tags`、`morphology`、`partUsed`、`depthLevel`、`catalogStatus` 和 `boundary`。
3. 每个 `sourceIds` 都要在 `sources.json` 存在，并且在 `sourceRefs` 中提供逐条定位。
4. 图片必须记录原始媒体地址、观测页、作者、数据集和许可；不要把外部图片直接写成无来源 URL。
5. 先重新访问来源，更新 `researchedAt`/`accessedAt`，不要复制旧卡片字段或未经核对的传统疗效文案。
6. 页面文案只能用于植物学、文献和文化阅读；不能给出诊断、剂量、处方、替代治疗或个体化建议。

`specimens.json` 描述的是根据公开形态资料生成的可视化参数，不是照片，也不能暗示专业鉴定结论。没有结构化标本时应显示对应本草自己的照片和“待补”说明，不能复用另一物种模型。

## 5. 不可破坏的视觉与交互约束

- 保留昼夜双世界：百子柜为木柜暖色，粒子星球为深夜靛蓝；字体、按钮、朱砂/青绿色强调色和过渡保持统一。
- 百子柜是第一记忆点。抽屉方向向左，必须能看到柜腔、侧板、阴影和明显的 Z 轴深度；不要把它退化成普通卡片平移。
- 桌面版柜墙是三列两排六区；移动端生境横向滚动、抽屉双列、详情面板单列。
- 每味本草在柜子、星球详情、档案和资料库都应优先显示对应图片；图片点击要能进入灯箱并查看来源。
- 相似药材对照必须同时展示基原、药用部位、形态差异和识别边界；“相似”不等于“可互换”。
- 粒子星球必须保留 Canvas 失败时的文本目录回退，不能让无 WebGL/Canvas 的浏览器出现空白舞台。
- 复杂可视化旁边要有可读的 HTML/键盘路径：关系星图有 `.relation-access-list`，星球有回退列表，标本支持方向键。
- 不引入渐变球、装饰性光斑、无意义的大卡片或营销式 Hero；信息密度要服务于查找和比较。
- `prefers-reduced-motion` 下关闭或缩短移动、抽屉和页面进入动画。
- `@media print` 下隐藏导航、抽屉和交互舞台，只保留可读的档案、来源和关系列表；新增页面时补一条打印规则。
- 图片一律写 `width`/`height`；新增 `<img>` 时同时提供 `loading` 与 `decoding`，首屏外不要用 `eager`。

## 6. 推荐执行顺序

### P0：先保证可交付

1. 运行完整检查，确认当前基线没有回归。
2. 用 Chrome/Playwright 检查 `#home`、`#cabinet`、`#planet`、`#trace`、`#library`、`#curation` 的桌面和 390px 移动端截图。
3. 优先修复会阻塞演示的问题：白屏、数据加载失败、抽屉被裁切、移动端横向溢出、图片 404、来源按钮无响应。
4. 改完 JS/CSS 后同步提升 `index.html`、`src/main.js` 里的 `?v=` 版本号，否则线上会继续命中旧缓存。

### P1：按评委视角打磨

1. 百子柜：验证抽屉拉出时的左向位移、柜腔和右侧详情同步，确保首次点击就能理解操作。
2. 粒子星球：验证拖拽、缩放、筛选、点击粒子和键盘回退；控制粒子密度，避免详情面板遮挡。
3. 一味档案：让“识形台 → 证据链 → 相似药材”顺序自然，明确每一段的来源和阅读边界。
4. 资料库：保持精品区和拓展区分层，不要把 16 + 104 重新合并成同质卡片墙。

### P2：再增加内容

内容扩展只能进入现有分类和数据契约。优先补齐 `specimens.json` 的真实空缺、增加有来源的关系和来源定位，再考虑新视觉模块。新模块必须先写一个短验收标准和移动端降级方案。

## 7. 本地验证和发布

首次进入仓库：

```sh
npm ci --ignore-scripts
```

开发和验证：

```sh
npm run serve 4183
node --check src/main.js
node --check src/ui-layout.js
node --check src/planet.js
npm test
npm run build
git diff --check
```

`npm run serve 4183` 后打开 <http://127.0.0.1:4183/>。交互改动至少检查桌面 1440px 和移动 390px；数据改动必须检查图片和来源入口。

发布前确认：

```sh
git status --short
git diff --check
git add <实际改动文件>
git commit -m "<说明行为的提交信息>"
git -c http.proxy= -c https.proxy= -c 'http.https://github.com.proxy=' push origin main
git -c http.proxy= -c https.proxy= -c 'http.https://github.com.proxy=' push origin HEAD:refs/heads/gh-pages
```

不要提交 `.tmp/`、截图缓存、浏览器用户目录、`node_modules/` 或本地报告。提交后等待 Pages 发布，再验证：

- `https://runner-cpu.github.io/Herbal-Cosmos/?sha=<commit>#cabinet`
- `https://runner-cpu.github.io/Herbal-Cosmos/?sha=<commit>#library`
- `src/main.js` 中的资源版本是否为最新
- `src/data/curated/herb-images.json` 是否返回 120 条图片记录

## 8. 提交前检查清单

- [ ] 没有减少 120 味本草、16 味精品或 104 味拓展。
- [ ] 新数据拥有来源、定位、访问日期和阅读边界。
- [ ] 图片路径真实存在，来源卡可以打开，灯箱可关闭。
- [ ] 百子柜抽屉仍然向左前方拉出，柜腔和阴影可见。
- [ ] 粒子星球拖拽/缩放/筛选/点击和文本回退都可用。
- [ ] 一味档案的识形台没有借用其他物种的模型。
- [ ] 相似药材四组对照和差异边界仍然可读。
- [ ] 移动端没有标题、按钮、抽屉或图片溢出。
- [ ] `node --check`、`npm test`、`npm run build`、`git diff --check` 全部通过。
- [ ] `.tmp/` 等本地产物没有进入提交。
- [ ] `main` 和 `gh-pages` 已推送，线上资源可访问。

## 9. 当前版本记录

- 当前提交：`04c8af7 feat: harden evidence chain, sharing and site closeout`
- 当前资源版本：`redesign-v1-20261020-1`
- 当前 Pages 分支：`gh-pages`
- 当前在线入口：<https://runner-cpu.github.io/Herbal-Cosmos/>
- 现有设计背景：`docs/rebuild-plan.md`
- 关系星图说明：`docs/relations-redesign.md`
- 演示与答辩脚本：`docs/competition-presentation.md`

### 2026-10-18 变更摘要（本轮）

- 证据链改为只渲染真实登记的节点，并新增 `.chain-gap-note` 说明缺口；海报同步只画真实节点。
- 新增 `#curation` 项目说明页：定位、三层数据精度、构建方式、无障碍、三分钟路径、已知不足、14 个来源。
- 首页新增“后来走到了哪里”中国故事带：1596《本草纲目》刊行、2015 青蒿素诺奖、WHO ICD-11 传统医学章节，均只陈述可核实事实。
- 16 味精品的 72 条 `sourceRefs` 定位按来源重写，不再在药典、植物志、POWE、NCBI 之间复制同一段药典描述。
- 新增 1200×630 分享卡 `src/assets/share/og-cover.jpg`，OG/Twitter 元数据与 JSON-LD 同步更新。
- 所有 120 条图片补 `width`/`height`；灯箱披露同物种不同药用部位共用同一观测照片的 7 组情况。
- `color-scheme` 修正为 `light`，新增打印样式、带品牌与五条返回路径的 `404.html`，未知哈希回到首页并提示。

### 2026-10-20 变更摘要（图标与排版）

- 新增 `src/icons.js`：17 枚 24×24、1.5 描边、同一家族的 SVG 图标，替换全部“用文字当图标”的位置（品牌印章、六类生境、柜子索引、搜索、关闭、证据链节点、星球详情、图片缺失占位）。
- 首页路由标题改为整幅堆叠标题并启用 `text-wrap:balance`，“四个入口，四种读法。”不再把“法。”挤到第二行；`h1–h3` 与正文分别启用 balance/pretty。
- 百子柜生境标签的“被按下”观感修正为内嵌朱砂导轨 + 平坦深色底，抬升只在 hover/focus 出现；抽屉改为用户真正抽出后才打开，页面加载时右侧显示 `CABINET CLOSED 还没有抽出抽屉。` 引导面板。
- 错误页与 404 的品牌标记改为 SVG 印章；分享卡 `og-cover.jpg` 的印章由文字“本”改为同一套矢量草药路径重绘。
- 清理已无引用的 `.drawer-glyph`、`.glyph-*` 旧字符图标 CSS，避免后续误用。

接手时先从 P0 开始；如果发现现状与本文档不一致，以仓库实际代码和通过的测试为准，并在本文件的“当前版本记录”中补一条变更说明。
