# V4 方剂与证候来源说明

核对日期：2026-09-26。增补范围：29 首方剂、12 项证候索引；与 featured.js 原有 21 首方剂、18 项证候合计为 50 / 30。

## 固定来源与许可

两个增补 JSON 的组成、传统方义及古籍摘录索引，整理自 **hongge168 / 华佗中医辞典（huatuo-tcm-dictionary）** 的公开知识库。读取并核对的固定提交为 `4bf9786f5191dd17f8ee0f2b4183d9d1f7bbb679`（GitHub heads/main 返回的 commit SHA）。每条 sourceRefs 都指向这个固定版本；方剂第一条引用带有对应标题行号。

- 上游知识库许可：https://github.com/hongge168/huatuo-tcm-dictionary/blob/4bf9786f5191dd17f8ee0f2b4183d9d1f7bbb679/server/data/knowledge/LICENSE.md
- 适用许可：**CC BY-NC-SA 4.0（署名—非商业性使用—相同方式共享）**。
- 许可文本：https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.zh-Hans
- 本次改动：从上游条目抽取组成与传统方义，建立项目 ID，规范少量检索药名，保留古籍剂量和炮制备注，并编写方证摘要。
- 本项目的这两个 JSON 及其中上述来源的改编数据亦以 CC BY-NC-SA 4.0 提供；发布或再分发时须保留本署名、来源、修改说明和许可。不将仓库代码许可误用为知识库内容许可。
- 上游声明所载古籍原文已进入公共领域，其整理、校勘、注解、索引和术语体系受上述许可约束。本次按其明确许可处理整理成果，不宣称它们是药典收载、官方审定或经临床验证的数据。

## 收录与转换规则

1. 29 首均有可定位的上游方剂行级条目；sourceNote 记录上游 gf-* 编号。对应古籍方证摘录文件作为附加证据链接。
2. 18 首具有上游 dosages.json 的原文剂量，保留两、斤、升、合、铢、枚、个、尺等原始单位与去皮、炙、炮、切等原始备注。没有换算为克，也没有将不同体积或个数单位混算。
3. 另 11 首的所引组成条目不含剂量，dose 明确标记“所引资料未载剂量”。这仅表示本次所引资料的覆盖缺口，并不声称古籍本身没有剂量。麻子仁丸的蜂蜜与炙甘草汤的清酒亦保留组成，剂量使用相同缺失标记。
4. 原始资料没有君臣佐使分工，所有新增组方药物的 role 均为“未标注”。剂量多少不用于推断角色。
5. 规范的检索名在对应 sourceNote 记录转换：杏仁→苦杏仁、麻子仁／麻仁→火麻仁、麦门冬→麦冬、香豉→淡豆豉、胶饴→饴糖、茵陈蒿→茵陈、苦桔梗→桔梗、生甘草→甘草、苇根→芦根、代赭石→赭石。炮制备注仍留在 dose；炙甘草汤组成用剂量表的“甘草（炙）”表达。
6. **芍药保留古籍原名**，不在此资料中擅自指定白芍或赤芍；**干地黄保留原名**，不得当作熟地黄。鸡子黄、饴糖、蜂蜜、清酒为原方材料，不应因为不是普通植物药就从组成删去。
7. 原条目明确写出“功用”时，eff 为传统方义转录；未写功用时，eff 以“方证索引：”开头，摘取所引主治语境，不推造疗效。
8. 12 项新增证候是有来源的古籍方证检索分类。desc 不加入来源没有的舌象、脉象或现代疾病适应证；同一大类内列方不意味着各方可互换。方剂的具体 zheng 可以比这 30 个索引分类更细，不为凑分类而强行改写方证。
9. 内容用于文献学习，古方中的历史剂量与炮制文字不是现代用药指示。上游条目仍可能存在版本或编校差异，需要继续对照古籍影印本；例如上游少阴里寒证据串引包含四逆汤／通脉四逆汤混杂，本次证候摘要只采用可以明确对应四逆汤的“少阴病脉沉”及寒逆语境，不引用混杂结尾。

## 29 首方剂对照

| 方名 | 本项目 ID | 上游条目 ID | 上游方剂文件 | 剂量覆盖 |
| --- | --- | --- | --- | --- |
| 葛根汤 | gegen-tang | gf-sh-014 | phase2-fang-batch.json | 原文单位 |
| 大承气汤 | dachengqi-tang | gf-sh-011 | shanghan-fang.json | 原文单位 |
| 小承气汤 | xiaochengqi-tang | gf-sh-012 | shanghan-fang.json | 原文单位 |
| 调胃承气汤 | tiaowei-chengqi-tang | gf-sh-013 | shanghan-fang.json | 原文单位 |
| 四逆汤 | sini-tang | gf-sh-006 | shanghan-fang.json | 原文单位 |
| 真武汤 | zhenwu-tang | gf-sh-007 | shanghan-fang.json | 原文单位 |
| 五苓散 | wuling-san | gf-sh-016 | phase2-water-lung-batch.json | 原文单位 |
| 猪苓汤 | zhuling-tang | gf-sh-015 | phase2-water-lung-batch.json | 原文单位 |
| 黄连阿胶汤 | huanglian-ejiao-tang | gf-sh-030 | phase4-insomnia-formulas.json | 原文单位 |
| 麻子仁丸 | maziren-wan | gf-sh-010 | shanghan-fang.json | 原文单位 |
| 茵陈蒿汤 | yinchenhao-tang | gf-jk-011 | phase2-fang-batch.json | 原文单位 |
| 栀子豉汤 | zhizi-chi-tang | gf-sh-009 | shanghan-fang.json | 原文单位 |
| 小建中汤 | xiaojianzhong-tang | gf-sh-028 | phase4-abdominal-pain-formulas.json | 原文单位 |
| 炙甘草汤 | zhigancao-tang | gf-sh-008 | shanghan-fang.json | 原文单位 |
| 吴茱萸汤 | wuzhuyu-tang | gf-sh-017 | phase3-vomiting-formulas.json | 原文单位 |
| 苓桂术甘汤 | linggui-zhugan-tang | gf-jk-003 | jinkui-fang.json | 原文单位 |
| 肾气丸 | shenqi-wan | gf-jk-002 | jinkui-fang.json | 原文单位 |
| 麦门冬汤 | maimendong-tang | gf-jk-006 | jinkui-fang.json | 所引资料未载剂量 |
| 泽泻汤 | zexie-tang | gf-jk-007 | jinkui-fang.json | 所引资料未载剂量 |
| 射干麻黄汤 | shegan-mahuang-tang | gf-jk-008 | jinkui-fang.json | 所引资料未载剂量 |
| 当归芍药散 | danggui-shaoyao-san | gf-jk-004 | jinkui-fang.json | 所引资料未载剂量 |
| 桂枝甘草汤 | guizhi-gancao-tang | gf-sh-020 | phase3-palpitations-formulas.json | 所引资料未载剂量 |
| 茯苓甘草汤 | fuling-gancao-tang | gf-sh-021 | phase3-palpitations-formulas.json | 所引资料未载剂量 |
| 茯苓桂枝甘草大枣汤 | linggui-ganzao-tang | gf-sh-022 | phase3-palpitations-formulas.json | 所引资料未载剂量 |
| 小半夏汤 | xiaobanxia-tang | gf-jk-017 | phase3-vomiting-formulas.json | 所引资料未载剂量 |
| 旋覆代赭石汤 | xuanfu-daizhe-tang | gf-sh-019 | phase3-vomiting-formulas.json | 所引资料未载剂量 |
| 桑菊饮 | sangju-yin | gf-wb-002 | wenbing-fang.json | 所引资料未载剂量 |
| 百合地黄汤 | baihe-dihuang-tang | gf-jk-025 | phase4-insomnia-formulas.json | 所引资料未载剂量 |
| 白虎加人参汤 | baihu-renshen-tang | gf-sh-023 | phase3-thirst-formulas.json | 原文单位 |

## 12 项证候索引

- 阳明腑实证（yang-ming-fu-shi）：dachengqi-tang、xiaochengqi-tang、tiaowei-chengqi-tang
- 阳虚水泛证（yang-xu-shui-fan）：zhenwu-tang
- 膀胱气化不利证（pangguang-qi-hua-bu-li）：wuling-san
- 水热互结证（shui-re-hu-jie）：zhuling-tang
- 少阴里寒证（shao-yin-li-han）：sini-tang
- 湿热发黄证（shi-re-fa-huang）：yinchenhao-tang
- 心阳不足证（xin-yang-bu-zu）：guizhi-gancao-tang
- 胃寒上逆证（wei-han-shang-ni）：wuzhuyu-tang、xiaobanxia-tang
- 气津两伤证（qi-jin-liang-shang）：baihu-renshen-tang
- 痰饮内停证（tan-yin-nei-ting）：linggui-zhugan-tang、zexie-tang、fuling-gancao-tang、linggui-ganzao-tang、shegan-mahuang-tang
- 肺胃阴虚证（fei-wei-yin-xu）：maimendong-tang
- 少阴阴虚证（shao-yin-yin-xu）：huanglian-ejiao-tang

来源为相应 formulas 与 evidence 文件；每条 sourceRefs 可直接复核。分类用语中的“阳虚”“阴虚”“气津两伤”等为上游传统方义归纳，不能理解为原文逐字出现的现代标准化证候定义。

## 完整性检查

运行 `node --test tests/formula-sources-v4.test.mjs`，检查增补数量、与原表合计数量、名称与 ID 唯一性、来源版本固定、组成字段、剂量缺失的明确标记、所有角色未标注及证候引用无悬空 ID。药名到全站 HERBS ID 的解析和全站运行验证由主构建流程完成。
