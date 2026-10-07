# 本草宇宙 · 2026-10-07 多角度审计与加固记录

本报告是当前发布候选的审计基线。历史报告保留当时快照；当前数据规模只以 `reports/data-coverage.json`、`data/catalog/manifest.js` 和运行时生成物为准。

## 一、当前可复核口径

| 层级 | 当前值 | 边界 |
|---|---:|---|
| 资源叙事 | 18,817 | 全国中药资源普查统计口径，不等于浏览器已收录记录 |
| 精品知识卡 | 902 | 进入详情、图表和跨页联动的公开资料整理卡 |
| 运行时本草记录 | 961 | 902 精品卡 + 17 directory-only + 42 formula-material |
| 名称索引 | 8,818 approved / 1,487 review | approved 可检索；review 默认隐藏；只有 2 条具当前仓库可机械复核的药典逐名证据 |
| 方剂 / 证候 | 100 / 58 | 关系层索引；未载剂量不换算、不补写 |
| 食药物质 | 106 | 2002—2024 官方公告去重目录 |
| 开放许可图 / 占位 | 623 / 279 | 图像只证明来源生物，不证明药用部位、功效或安全性 |
| 字段状态 | 803 complete / 96 partial / 3 legacy | 缺失字段保持“未录入”，不做合理推断 |
| 数据版本 | v9 · 2026-10-03 | Service Worker 在本轮升级为 v17 缓存外壳版本 |

## 二、本轮从不同角度发现并处理的问题

### 1. 可维护性：测试源与线上副本漂移

**问题。** 页面加载 `*.browser.js`，Node 测试导入同名模块源文件；首页章节、学习舱路由、星图默认色与折叠控制已经出现不同实现，测试不能代表线上代码。

**处理。** 新增 `scripts/build-browser-copies.mjs`，以可导入模块为唯一事实源，确定性生成九个 classic-script 浏览器副本；`--check` 只读比对并在漂移时失败。CI 同时执行生成、diff 和检查。运行时资产检查只解析真实 `<script src>` / `<link href>`，不再把 HTML 注释中的路径当作已加载资源。

### 2. 性能：无图表页面也等待 1MB ECharts

**问题。** 全局 `render()` 和洞察模块会在学习舱、应用内 404 等无图表路由请求 ECharts；首页动态内容等待图表库，详情页图表失败时相关方剂不会继续渲染。

**处理。** 路由主体立即渲染；洞察模块只在 home/herbs/qiwei/formula 请求图表库；详情属性、来源与相关方剂先显示，再异步补图。新增延迟和失败回归。`runtime.js` 同时从 101,299 字节降到约 96KB，重新满足 100KB 门禁。

### 3. 信息架构与状态：旧模型残留

**问题。** 源模块仍以 7 段首页和“学习舱并入首页”为前提，实际页面已是 5 段首页与独立学习舱；上下文条两个入口指向同一配伍路径；各路由共用同一个文档标题。

**处理。** 首页固定为档案/精选/食养/典籍/来源五段；`#/learn` 保持独立，`#/zheng` 只作兼容迁移；上下文条提供星图、性味、配伍、知识卡四个不同目标；主路由、详情、证候和未知路径分别设置中文标题，canonical 仍保持站点根地址。

### 4. 无障碍：菜单、抽屉与典籍弹窗

**问题。** “更多”菜单不能用 Escape 关闭并还焦点，也没有子路由当前态；收藏抽屉把焦点移入但不是模态对话框，键盘可逃到底层页面；典籍条目只有鼠标点击路径。

**处理。** “更多”支持 Escape、外部点击、路由切换关闭并同步当前态；收藏抽屉使用 `role=dialog`、`aria-modal`、背景层、焦点首尾循环、滚动锁和焦点恢复；典籍时间线可用 Enter/Space 打开原生 `<dialog>`，关闭后浏览器恢复触发项焦点。

### 5. 响应式与输出

**问题。** 自动回归只覆盖 375px，缺少 320px 最窄常见视口和打印/导出规则。

**处理。** 新增 320px 的首页、探索、性味、配伍、学习舱无横向溢出门禁；加入打印样式，隐藏导航、Canvas 控件、临时状态和覆盖层，使用白底高对比并减少卡片/表格分页截断。

### 6. PWA 与平台兼容

**问题。** Manifest 与 Apple touch icon 只有 SVG，部分平台安装/主屏图标兼容性不足；Service Worker 缓存版本未对应本轮资源变化。

**处理。** 从项目现有叶片星轨标志生成本地 180/192/512 PNG；manifest 保留 SVG 并增加 192/512 maskable 图标，Apple touch icon 使用 180 PNG；Service Worker 升级为 `herbal-cosmos-v17-20261007-multi-angle-hardening` 并预缓存图标。应用外壳预缓存仍低于 2.5MB，不预取图片全集或目录分块。

### 7. 视觉与主题边界

**问题。** 产品已明确只有日间/夜读，但 CSS 仍保留不可达 classic 主题令牌，文档也残留三主题描述。

**处理。** 移除不可达 classic 主题选择器，保留实际使用的典籍内容组件；README 和当前报告只描述日间/夜读。历史报告不改写，继续作为当时快照。

### 8. 供应链、CI 与发布

**问题。** `@playwright/test` 使用范围版本；工作流缺最小权限、并发取消和超时；没有仓库内的 Pages 线上版本冒烟。

**处理。** Playwright 精确锁定 1.63.0；质量工作流加入 `contents: read`、并发取消、超时、浏览器副本与图标检查；保留 Chromium + 375px 全量门禁，并增加 Firefox/WebKit 核心路由与渐进渲染冒烟。新增 `pages-smoke.yml` 监听现有 `gh-pages` 分支，只验证公开站点，不接管或改变分支发布方式。

### 9. SEO、隐私与内容安全

**复核。** canonical、robots、Twitter/OG、EducationalApplication JSON-LD、严格 referrer policy、404、无账号/无遥测、本机存储和医疗边界继续保留。没有为静态页面添加会破坏内联 JSON-LD、Blob 收藏导出或动态样式的虚假严格 CSP；站点不收集表单数据、不执行医疗建议。

### 10. 数据与图片可信度

**复核。** 本轮不修改事实数据、不提升 review、不补无证据字段、不新增无许可图片。8,818 approved 仍只表示公开来源与规则通过，不等于药典收载；279 张占位继续诚实展示，错误图片风险优先于覆盖率。

## 三、仍保留的真实边界

1. 1,487 条 review 需要专家或逐名权威证据分批复核；不能批量提升。
2. 96 张 partial 与 3 张 legacy 卡仍需字段级来源摘录；本轮未编造补齐。
3. 279 张卡没有可确认开放许可图；优先补首页精选、高频关系和矿物/炮制品，但需逐图核验。
4. ECharts 自托管包仍约 1MB；在保持零构建、file:// 直开约束下暂不改为按需组件打包。
5. PWA 只保证应用外壳和已访问的有限运行时资源；未访问的约 65MB 图片与目录分块不承诺离线可用。
6. 自动化增加 Firefox/WebKit 核心冒烟，但真实 NVDA、VoiceOver、TalkBack、iOS Safari 缓存压力、低端安卓和现场网络仍需人工设备验收。
7. 本机收藏无账号、无云同步；JSON 只支持导出，导入与冲突策略尚未实现。

## 四、发布门槛

发布候选必须重新执行：

```bash
npm ci --ignore-scripts
npm run build:data
npm run build:browser
npm run check:browser-copies
npm run validate:data
npm run validate:app
node scripts/fetch-herb-images.mjs --verify
npm test
npm run check:inline
npm run test:browser:ci
npm run test:browser:compat
git diff --check
```

数据重建后，`data/`、`reports/data-coverage.json` 与 `assets/js/data/` 必须无内容漂移；浏览器副本生成后也必须无 diff。只有本地完整门禁、真实浏览器视觉验收、GitHub Actions 和公开 Pages 冒烟都支持时，才可标记为已发布。
