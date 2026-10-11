# 民族对照来源核查记录

核查日期 2026-10-10。本文件记录 `assets/js/data/ethnic-correspondence.js` 中每条 `status: 'approved'` 条目的来源、原文句子与范围限制，供现场核对。条目结构由 `scripts/validate-ethnic-data.mjs` 校验；**来源 URL 非空只是格式条件，内容是否真支持断言由本文件逐条记录复核。**

## 口径

**本批通过的 9 条（覆盖 8 味药、12 个「药材 × 体系」组合）全部来自同行评议研究文献，不是药典、不是体系收录认定，也不是机构名录。**

这一点必须说清楚：`approved` 在本项目里只表示「这条对照线索有一篇可访问的、同行评议的文献支持」，不等于「该民族医药体系正式收载这味药」。页面上呈现的也是这一层含义，措辞统一为「文献中记载 / 有记载」。

来源一律引用 PMC 全文页，而不是出版社落地页：本项目核查环境对 MDPI、RSC、Wiley、ScienceDirect 的落地页返回 403，PMC 是这些论文的官方全文镜像（NIH 维护），可稳定访问。

## 逐条记录

| 药材 | 体系 | 来源 | 原文句子 |
|---|---|---|---|
| 诃子 | 藏医药 | [Animals (2025) · PMC11899446](https://pmc.ncbi.nlm.nih.gov/articles/PMC11899446/) | “Treatment-Related Mechanisms of Tibetan Medicine Terminalia chebula (TC)…”（标题即把诃子称为藏医药用药） |
| 诃子 | 蒙古医药 | [Frontiers in Pharmacology (2025) · PMC12301304](https://pmc.ncbi.nlm.nih.gov/articles/PMC12301304/) | “(Aconiti kusnezoffii Radix Preparata, Zhicaowu) and Terminalia chebula Retz. (Hezi) are a classic herb pair in Mongolian medicine, where Hezi mitigates Zhicaowu's hepatotoxicity.” |
| 翼首草 | 藏医药 | [RSC Advances (2021) · PMC9038101](https://pmc.ncbi.nlm.nih.gov/articles/PMC9038101/) | “Pterocephalus hookeri (C. B. Clarke) Höeck is a member of the Dipsacaceae family and has been used in traditional Tibetan medicine for thousands of years.”；同页 “It is known as fairy grass and is recorded in many classic Tibetan medicine books, such as The Four Medical Tantras…” |
| 独一味 | 藏医药 | [RSC Advances (2020) · PMC9050497](https://pmc.ncbi.nlm.nih.gov/articles/PMC9050497/) | “L. rotata has been used in traditional Tibetan medicine for more than a thousand years…”；同页 “as Dabage or Dagama in traditional Mongolian medicine” |
| 红景天 | 藏医药 | [Frontiers in Pharmacology (2024) · PMC10986185](https://pmc.ncbi.nlm.nih.gov/articles/PMC10986185/) | “Suo-luo-ma-bao (Tibetan: སྲོ་མོ་དམར་པོ།) is one of the most representative Tibetan medicine.”（表 1 列出 *Rhodiola crenulata*） |
| 菊苣 | 维吾尔医药 | [Frontiers in Nutrition (2022) · PMC9292578](https://pmc.ncbi.nlm.nih.gov/articles/PMC9292578/) | “Chicory, as an Uyghur customary herb in China, is also known as “kasni” and “kashenna”” |
| 黑种草子 | 维吾尔医药 | [RSC Advances (2022) · PMC9254149](https://pmc.ncbi.nlm.nih.gov/articles/PMC9254149/) | “The seeds of Nigella glandulifera Freyn et Sint. are traditional Uygur medicine used for the treatment of diabetes.” |
| 沙棘 | 藏医药 | [Frontiers in Pharmacology (2026) · PMC13002580](https://pmc.ncbi.nlm.nih.gov/articles/PMC13002580/) | “As a core medicinal material in the Tibetan medicine system, H. rhamnoides has its medicinal practice mainly concentrated in the Qinghai-Tibet Plateau…”（同页列《四部医典》《晶珠本草》） |
| 沙棘 | 蒙古医药 | [Frontiers in Pharmacology (2026) · PMC13002580](https://pmc.ncbi.nlm.nih.gov/articles/PMC13002580/) | 同页 §2.1.2 “Mongolian medicine has a profound theoretical accumulation… with relevant records in classic works such as… Meng Yao Zheng Dian”；“Known as “Chiqirigan” in Mongolian…” |
| 余甘子 | 藏医药 | [Frontiers in Pharmacology (2026) · PMC13385120](https://pmc.ncbi.nlm.nih.gov/articles/PMC13385120/) | “Phyllanthus emblica L. (PE) is a botanical drug widely used in several traditional medical systems, including Tibetan and Uyghur medicine.” |
| 余甘子 | 维吾尔医药 | [Frontiers in Pharmacology (2026) · PMC13385120](https://pmc.ncbi.nlm.nih.gov/articles/PMC13385120/) | 同上句 |

同日复核：以上 9 个 URL 全部返回 HTTP 200。

## 为什么要拆条

诃子、沙棘、余甘子各有两个体系。旧数据结构把它们写成一条 `systems: ['tibetan','mongolian']`，意味着「藏医药来源缺失」会把蒙古医药那一条也一起压回 review。现在一个体系一条，各自带来源：一条核对不通过不会牵连另一条，星图上「有对照线索」的判定也精确到体系，而不是含糊的「这味药有民族对照」。

## 明确保留的限制

- **本批没有使用任何药典或机构来源。** 中文机构站点在本环境不可用（ihchina.cn、satcm.gov.cn、tibet.cn 无法建立 HTTPS 连接），国家药典委员会官网无可检索的品种正文页。若后续要展示「药典收载」字样，需要另行取得可访问的权威页面。
- **红景天的物种对不上。** 来源记述的是大花红景天（*Rhodiola crenulata*），本馆知识卡的拉丁名作 *Rhodiola rosea*。两者是否同一药材未核，条目 note 已写明这一点。这条不影响「红景天见于藏医药文献」，但影响「此来源精确对应此卡」。
- **独一味的蒙古医药记载已确认，但本批未收录。** 来源 PMC9050497 明确写出蒙古医药用途与蒙古语名，本项目候选条目只列了藏医药。**收录与否是数据决策，不是来源不足**，留待确认后再决定是否扩列，本轮不擅自改。
- **余下的 29 条仍是 review，未补来源。** 本批只处理了清单上已经写出体系断言的前 8 味药。剩余 29 味（肉豆蔻、荜茇、胡椒、檀香、沉香、丁香、玫瑰花、麻黄、甘草、黄芪、秦艽、龙胆、锁阳、肉苁蓉、冬虫夏草、西红花、红花、草果、木香、小茴香、肉桂、干姜、巴戟天、蒲公英、石榴皮、当药、草乌、天仙子、豆蔻）尚未逐条检索，状态未改。
- **「多体系共通」这一分类仍是 0 条。** `common` 的 5 条（麻黄、甘草、黄芪、秦艽、龙胆）没有被本批处理。
