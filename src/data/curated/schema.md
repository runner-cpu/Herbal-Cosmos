# 本草宇宙 · 百子万象数据契约

本目录是从公开权威来源重新检索后的第一批展示数据，独立于旧界面和旧数据结构。每次刷新都写入 `researchedAt` 和 `accessedAt`，方便审计。

## 文件

- `sources.json`：来源登记。`id` 在整个数据集内唯一；`url` 是公开入口，`locator` 说明在该入口中如何定位具体内容。
- `herbs.json`：本草实体。每一味必须有 `scientificName`、`partUsed`、`sourceIds`、逐条定位的 `sourceRefs` 和 `boundary`。
- `formulas.json`：方剂实体。`composition` 只能引用 `herbs.json` 中已登记的实体 ID；`sourceRefs` 给出古籍与药典定位摘要。
- `cultural-anchors.json`：文化或研究史锚点。`relatedEntityIds` 指向实体，`sourceIds` 指向来源，`sourceRefs` 记录书名、章节或事实页定位。
- `relations.json`：可视化用有向关系。每条关系必须有 `from`、`to`、`type`、`label`、`evidenceStatus`、至少一个 `sourceIds` 和 `boundary`。
- `specimens.json`：3D 识别台使用的结构化标本参数和观察线索；它描述可视化模型，不保存未经许可的照片。
- `comparisons.json`：相似药材对照组。外部对象会明确标为 `external-*`，不伪装成已经进入本草实体目录的完整档案。

## 证据状态

- `verified-direct`：来源直接陈述该关系或事实，可在右侧证据抽屉中展示。
- `contextual`：来源提供时代、文献或文化语境，不能被解读为现代疗效证明。
- `official-monograph`、`botanical-reference`、`historical-text` 等是实体级来源类型，不代表临床等级。

## 安全和展示边界

数据用于文化、植物学和文献关系展示，不提供诊断、剂量、处方、替代治疗或个体化健康建议。历史本草分类、方剂组成和现代研究史必须在界面中分层标注。涉及半夏、甘草、丹参等存在安全关注点的实体，必须保留原始 `boundary` 文案。

## 校验规则

1. 所有 ID 全局唯一；关系两端必须能在实体或来源中解析。
2. 所有关系必须至少有一个来源，且来源 ID 必须存在于 `sources.json`。
3. 所有实体必须含 `boundary`；来源必须含 `accessedAt`。
4. 前台不得把 `traditionalContext`、`textualOrigin` 或 `summary` 直接渲染为疗效、诊断或用药推荐。
5. 新增或更新内容要重新访问来源并更新访问日期，不复制旧 UI 的卡片字段或文案。

## 生境目录字段（v2）

`herbs.json` 现在以“一个主生境 + 多标签”扩展目录。新增本草只需追加对象，不需要修改页面结构：

- `habitat`：唯一主生境 ID（`shanlin`、`caodian`、`huaye`、`guoshi`、`shuize`、`junmu`）。
- `habitatLabel`：面向用户的生境名称。
- `tags`：形态、药用部位、文化或研究状态标签；不用于再次分柜。
- `morphology`：植物或药材识形线索，保持与疗效叙述分离。
- `depthLevel`：`deep`（首批深度档案）或 `overview`（目录索引条目）。
- `catalogStatus`：`featured`（百子药堂精品）或 `catalog`（资料库与粒子星球拓展条目）。

首批目录目标为约 120 味：16 味 `deep/featured` 与 104 味 `overview/catalog`。所有条目仍需有 `sourceIds`、逐条 `sourceRefs` 和 `boundary`；新增条目可直接挂入既有六类生境。
