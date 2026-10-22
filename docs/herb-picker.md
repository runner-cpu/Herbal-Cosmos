# 药名定位组件

2026-10-22：移除三维药屉上方的 DOM 悬浮药名，保留柜面药名图集、选中描边和档案标题。

## 开源来源与取舍

- 使用 [orchidjs/tom-select](https://github.com/orchidjs/tom-select) 2.6.2，Apache-2.0。
- 对比过 [Choices.js](https://github.com/Choices-js/Choices)；本项目为原生 JavaScript，选择 Tom Select 的基础核心，不引入 React，也不加载 complete 插件包。
- 包管理器锁定版本，通过 esbuild 生成本地 `vendor/herb-picker.js` 与 CSS；运行时不请求 CDN。许可证随构建复制到 `vendor/tom-select-LICENSE.txt`。
- 纸签色彩、中文字体、结果中的生境标签及展开/收起动画是本项目的适配，不是库默认皮肤。

## 行为契约

- 在完整 120 味目录内搜索中文药名、拼音（可不带声调）、学名或生境。
- 选择后同步三维药屉和档案；三维选择、关闭药屉、筛选重置也同步选择器，静默更新避免循环触发。
- 方向键导航、Enter 选择、Escape 收起、点击外部关闭；无结果有中文提示，不允许创建任意药名。
- 展开 180ms，收起 110ms，仅操作 opacity/transform；减少动态效果模式不运行动画。
- 下拉面板挂到 body，按视口空间上下展开；收起动画期间不可交互，也不暴露给辅助技术。
- 页面切换销毁组件和事件监听；组件模块加载失败时保留原生 select，不破坏已运行的 3D 场景。

## 验证边界

`tests/herb-picker.test.mjs` 只验证依赖与源码契约，不能代替真实浏览器交互及视觉检查。

本轮另在本地真实 Chromium 页面核对：`ren shen` 与 `Panax` 搜索、中文搜索、零结果提示、方向键与 Enter、Escape、关闭药屉清空选择、切到首页时 portal 数为 0、返回后仅一个组件。390×844 视口下搜索菜单未横向越界；模拟 reduced-motion 时菜单动画数为 0，正常模式读取到 180ms 展开动画。此为本地浏览器验证，不代表实体手机或屏幕阅读器实测。
