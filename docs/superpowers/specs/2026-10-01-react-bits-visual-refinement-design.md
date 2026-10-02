# 本草宇宙 React Bits 视觉精修设计

## 目标

在不迁移 React、不改变现有数据模型和路由信息架构的前提下，使用 React Bits 源码库中的视觉模式，继续提升首页的沉浸感、信息层级和交互反馈。首页保持“中药典籍 + 自然观察 + 学术数据”的气质，首屏、精选本草和数据入口是主要视觉焦点。

## 方案

### 首屏背景与标题

- 保留现有 Canvas 星图作为信息性背景。
- 以 Aurora、DotGrid、Noise 的视觉模式调整 `.hero` 的背景层：Aurora 提供低对比度色彩流动，DotGrid 提供纸张纹理的秩序感，Noise 提供轻微材质感。
- 保持 BlurText 标题和渐变英文副标题，但限制动画幅度和透明度，确保标题、CTA 与辅助文案始终有足够对比度。
- 背景层使用 `aria-hidden`，不捕获指针事件，不影响星图和 CTA 的键盘访问。

### 精选本草与入口卡片

- 给首页精选本草卡和模块入口增加 SpotlightCard / GlareHover 的局部高亮。
- TiltedCard 只用于宽屏、支持悬停的设备；移动端不旋转卡片，只保留边框和阴影反馈。
- 卡片视觉优先级为：植物图像、中文名与拉丁名、资料状态、进入详情操作。来源标签保持可读，不以装饰覆盖数据。
- 为标题、区块标签保留 ShinyText / GradientText 的轻量样式，避免大面积发光。

### 页面节奏与可访问性

- 首页长区块使用 ScrollReveal / AnimatedContent 的淡入和位移节奏，避免一次性动画造成跳动。
- 所有动效遵守 `prefers-reduced-motion: reduce`，降级为静态布局。
- 颜色、焦点环、触摸目标和文字对比度沿用现有主题变量，深色模式和移动端保持可用。
- 不改变图表容器尺寸策略，避免再次产生图表空白或布局拉伸。

## 实现边界

- 主要修改 `assets/css/components.css`、`assets/css/home.css`、`assets/js/beautify.js` 和首页需要的少量标记。
- 不引入 React、WebGL 依赖、外部 CDN 或新的运行时资源。
- 不修改 `data/`、图表数据、路由逻辑和其他页面的业务交互。
- 复用已有的本地视觉实现；新增样式需使用现有 CSS 变量和 `data-*` 钩子。

## 验证

- `npm test`
- `npm run validate:data`
- `npm run validate:app`
- `npm run check:inline`
- `npm run test:browser:ci`
- 视觉检查首页、`qiwei`、`formula` 的桌面和移动布局，重点确认首屏文字对比度、卡片间距、图表容器高度和减少动态效果模式。

## 发布

验证通过后提交实现变更，推送 `origin/main`，再将同一提交推送到 `origin/gh-pages`；使用 `git ls-remote` 核对两个远端分支指向一致，并检查 GitHub Pages 地址可访问。
