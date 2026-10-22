# 本草宇宙 · 百子万象

这是一个面向普通公众与比赛评委的本草文化交互展。项目把 120 味本草放回六类生境，把目录与关系汇成一颗可旋转的 3D 地球，再把 GBIF 开放观测记录落回中国底图。每一味的身份、证据与阅读边界都可以继续追踪到公开来源。

在线地址：<https://runner-cpu.github.io/Herbal-Cosmos/>

## 2026-10-22 更新

- 山间药堂：120 格药柜、竹丛、群山与起伏地形，保留 WebGL 降级。
- 选药器：Tom Select 2.6.2 基础核心、本地打包、中文/拼音/学名搜索；移除悬浮药名。
- 星球页：完整球体自适应取景、紧凑页头、照片与名称并排、取消详情内部滚动，新增“完整星球”复位。
- 资源版本：`planet-layout-v5-20261022-1`。本地构建及 15 项测试通过；几何和 DOM 测试不代替实体手机帧率验证。

## 体验重点

- **三入口宇宙首页**：百子药堂、3D 粒子星球、生境地图三扇门各解决一种阅读任务；首页同时保留四种深入读法与五个探索入口的路线说明。
- **古风 3D 药堂与六类生境百子药堂**：WebGL2 优先呈现门面、柜台、百子药堂、木梁灯饰与地面药屉；可堂外全览、入堂环视、聚焦并开启/关闭抽屉，再回景。点击药屉直接同步右侧米纸档案，不做整页重绘；WebGL2 不可用时保留可抽拉平面柜墙。
- **真实 3D 地球粒子星球**：优先使用 Three.js + WebGPU + `@takram/three-atmosphere` 呈现地球纹理、云层、法线、夜光与大气散射；WebGPU 不可用时切到 WebGL2 地球，再失败则保留 Canvas 2D 粒子星球。支持拖拽、双指/滚轮缩放、搜索、生境筛选、粒子命中和键盘目录。
- **GBIF 生境地图**：MapLibre 优先接入 OpenFreeMap Positron；在线底图失败时使用本地 Natural Earth；地图引擎不可用时切到 Canvas 聚合网格。地图支持生境筛选、物种搜索、聚类展开、详情联动与记录许可入口；选中本草会以金色高亮全部 GBIF 网格，并在地图栏同步显示“当前物种 · 网格数”。
- **关系星图与证据链**：从一味档案沿方剂、典籍、研究史和公开来源逐段核对；只有已经登记的关系才进入链条，缺口用文字说明，不用占位节点补足。
- **结构化识形台与相似药材**：拖动观察根、叶、果皮和花蕾等识别线索；对照陈皮／青皮、金银花／山银花、白术／苍术、人参／党参的基原、部位、形态与名称边界。
- **资料库与看图识本草**：先显示 16 味深度档案与前 8 条拓展资料，再每次加载 16 条；搜索、生境和深度筛选同步作用于全量目录。看图识本草先隐藏名称，答完再揭晓来源。
- **无障碍与动效边界**：焦点环、键盘目录、路由播报、Esc 关闭弹窗和方向键移动都已覆盖；`prefers-reduced-motion` 会停止惯性旋转、漂移动画和地图飞行动画。筛选重排与详情切换才使用 AutoAnimate，持续动画优先只改 `transform` / `opacity`。

## 数据来源与边界

`src/data/curated/` 包含 120 味本草（16 味深度条目 + 104 味拓展条目）、3 首方剂、3 个文化锚点、20 条关系、6 个结构化标本和 4 组相似药材对照。每味本草采用“一个主生境 + 多标签”规则，保留 `habitat`、`morphology`、`partUsed`、`depthLevel`、来源和阅读边界。

`src/data/generated/gbif-snapshot.json` 由 `scripts/build-gbif-snapshot.mjs` 生成。查询限定为中国、有坐标、无地理质量标记、现存记录，并且只接收 CC0 1.0 / CC BY 4.0 许可。原始坐标不会进入前端：记录被聚合到 0.5° 或稀疏时 1° 的网格中心，最多为每个物种抽样 300 条记录。没有符合条件的记录会明确标记为 `no-records`，不等于该物种在中国没有分布。

GBIF 图层只表达“公众在哪里记录过这种植物”，不代表药效、药用分布、资源储量、稀缺程度或推荐采集地点。记录数量受观测活动、许可过滤和抽样上限影响。页面与项目说明中保留这三条读图边界。

本草图片来自 GBIF / iNaturalist 公开观测媒体，逐张保留原始媒体、观测页、作者、数据集与许可。照片是物种级原植物照片，不是饮片或炮制品，也不能替代专业鉴定。

内容用于植物学、文献和文化阅读，不提供诊断、剂量、处方、替代治疗或个体化健康建议。

## 技术栈与构建

- 原生 ES Modules、HTML 与 CSS，没有 React、Vue 等前端框架。
- Three.js 0.183 与 `@takram/three-atmosphere`：3D 地球、云层、夜光、大气散射与古风药堂。 药堂实现参考 GitHub threejs-skills 中关于 InstancedMesh、Raycaster 命中、灯光分层、动画衔接与资源释放的建议。
- MapLibre GL 5：在线底图、本地 GeoJSON 与地图交互。
- `@formkit/auto-animate`：只用于筛选结果、列表重排和详情切换。
- esbuild：生成 `vendor/planet-engine.js`、`vendor/apothecary-engine.js` 与 `vendor/ui-runtime.js`；MapLibre 资产在构建时复制到 `vendor/maplibre/`。`planet.js` 与 `atlas.js` 只在实际进入对应路由时动态加载，首页不下载 3D/GIS 路由模块。
- 本地静态服务器：gzip 文本资源、版本化不可变缓存与安全响应头；线上 GitHub Pages 也使用压缩传输。
- Node.js 测试、Playwright、axe-core 与 Lighthouse：数据、交互、无障碍与性能验证。

所有运行资源都从仓库自己的静态路径加载；在线地图只是第一种优先路径，不是应用运行的必要条件。

## 本地运行

```sh
npm ci --ignore-scripts
node scripts/build-gbif-snapshot.mjs
npm run build
npm test
npm run serve
```

打开 <http://localhost:4173/>。

`build-gbif-snapshot.mjs` 默认复用 `.tmp/gbif-cache/`；只有缓存缺失时才访问 GBIF。需要重新抓取时显式运行：

```sh
node scripts/build-gbif-snapshot.mjs --refresh
```

## 降级路径

- 3D 星球：Three.js + WebGPU + atmosphere → Three.js WebGL2 → Canvas 2D 粒子星球 → 可滚动文本目录。
- 古风药堂：Three.js WebGL2 → 平面百子药堂；拖拽、滚轮/双指缩放与键盘方向键均可运镜。
- 生境地图：MapLibre + OpenFreeMap → MapLibre + 本地 Natural Earth → Canvas 聚合网格 → 物种与档案列表。
- 动效：正常动画 → `prefers-reduced-motion` 静态首尾状态。
- 所有异步 3D / 地图挂载都有代次令牌；切换路由后，晚到的实例会被立即销毁，不会覆盖新页面或泄漏 WebGL / MapLibre 上下文。

## 团队交接

接手开发、数据补录或发布前，请先阅读 [团队交接文档](docs/team-handoff.md)。比赛演示使用 [四分钟演示与答辩手册](docs/competition-presentation.md)。其中记录页面职责、数据契约、不可破坏的交互约束、验证命令和 GitHub Pages 发布流程。

## 评分对应

作品围绕“科技 + 创意讲好中国本草故事”设计：证据链是原创主交互；3D 地球、开放 GIS 地图与 Z 轴抽屉承担展示记忆点；来源抽屉、许可过滤和数据校验保证可验证性。四分钟演示可以从首页三入口出发，依次完成百子药堂、证据链、3D 星球和生境地图闭环。