# 关系星图：百子药堂之后的第二个记忆点

`src/relations.js` 提供一个不依赖框架的 SVG / DOM 关系可视化。它把当前重新检索的数据组织成四条“证据车道”：

`本草 → 方剂 → 典籍 / 回响 → 公开来源`

关系条目的 `sourceIds` 会在最右侧生成浅色“来源支持”边，即使原始关系的终点是方剂或典籍，也能在图上直接看到这条事实由哪些公开来源支撑。浅色边只表示引用支持，不会被误读为新的药材关系。

## 为什么用星图而不是 3D 模型

3D 模型适合观察真实断面或局部结构，但当前数据集是“实体关系”而不是扫描模型。关系星图将评委最关心的创新点直接放到可操作区域：选择一味本草，立即看到它被哪些方剂收录、与哪条文献锚点相连、每条关系由哪个来源支持。线条只表达资料中明确记录的关系，避免把视觉位置误读为疗效强弱。

它与百子药堂形成互补：

1. 百子药堂负责“发现”：抽屉、标签、首字和形态卡片让用户愿意点开一味本草。
2. 关系星图负责“理解”：横向四车道把信息密度提高，同时保留从左到右的阅读方向。
3. 证据抽屉负责“核查”：点击节点或关系后，使用现有证据面板展示原始出处和阅读边界。

## 接入方式

在 `main.js` 顶部引入：

```js
import { relationExplorer } from './relations.js';
```

在追踪台中传入已经解包的数据：

```js
const graph = relationExplorer({
  herbs: data.herbs.herbs,
  formulas: data.formulas.formulas,
  anchors: data.anchors.anchors,
  sources: data.sources.sources,
  relations: data.relations.relations,
}, { focusId: state.herbId, maxRelations: 24 });
```

将 `${graph}` 放入追踪台主栏（建议位于四节点证据链与阅读边界之间）。生成的节点带有 `data-relation-node`，关系带有 `data-relation-id`，所以现有的事件代理可以直接扩展：

```js
const relationNode = event.target.closest('[data-relation-node]');
if (relationNode) {
  const id = relationNode.dataset.relationNode;
  if (herbs().some((herb) => herb.id === id)) state.herbId = id;
  state.nodeId = id;
  render();
}
```

## 交互约定

- 鼠标悬停 / 键盘聚焦节点时，使用 `.is-active` 突出该节点；关系本身使用 `.is-focus`。
- 节点全部 `tabindex="0"` 并声明 `role="button"`，回车和空格应复用点击处理。
- SVG 下方同时输出 `.relation-access-list` HTML 按钮列表；当浏览器辅助技术不暴露 SVG `g` 节点时，用户仍可从列表逐条聚焦实体关系和来源支持。
- 关系线有透明 hit path，方便触屏点击，不要求用户精确点中 1px 的可见线。
- 关系数量默认按当前本草邻域优先排序，`maxRelations` 用于控制移动端密度；资料库视图可以传 `Infinity` 显示全网。
- 空关系时返回明确的“关系待补”状态，而不是复用另一味本草的关系。

## 视觉实现要点

建议将 `.relation-scene` 设置为 `overflow-x: auto`，SVG 保持最小宽度 900px；小屏幕可以横向浏览四条车道，不压缩中文节点。节点使用米纸底色和黑墨文字，四类节点以细色点区分，朱砂只用于当前选中节点与关系线的焦点态。

