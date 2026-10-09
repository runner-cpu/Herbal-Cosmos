# V7 cultural exhibition sources

Verified on 2026-10-09. Exhibition prose is project-authored summary, not copied source prose or source imagery. Assertion records in `assets/js/data/exhibition-cases.js` identify case, entities, cultural system, source title/URL/locator, date, evidence note, kind and review status. `approved` refers only to this scoped project-summary review; it does not confer clinical authority or change candidate-data status.

## Recognize: classical correspondence and project records

[《黄帝内经·素问》第二卷](https://zh.wikisource.org/wiki/黃帝內經/素問第二卷), 阴阳应像大论第五: the adjacent directional paragraphs explicitly contain 木生酸、火生苦、土生甘、金生辛、水生鹹, and 苍、赤、黄、白、黑. The controller read the public transcription in the browser. This is a community transcription whose index reports incomplete proofreading, not an official edition. The exhibition uses 苍 and 黑 (rather than the previous design paraphrases 青 and 玄), and simplified 咸 for 鹹. These passages support traditional cultural correspondence, not physical measurements or clinical advice. The classical original is public domain; no modern editorial prose is reproduced.

Herb connections are derived from eight existing project knowledge cards, not from these classical paragraphs: `wuweizi`, `huanglian`, `gancao`, `guizhi`, `mangxiao`, `juemingzi`, `tufuling`, `baiji`. Their `wei` fields currently read 酸、苦、甘、辛、咸、甘苦咸、甘淡、苦甘涩. Each card appears once; every recognized component gets an edge. 淡 and 涩 remain supplementary; empty/unrecognized fields get a separate missing node. Eight curated cards yield 13 edges and 16 nodes (five principal tastes, three supplementary/missing categories, eight herbs). The source panel explicitly labels these as project fields; individual pharmacopoeia text was not reverified in this task. Full collection statistics remain in the atlas.

## Compose: HKBU formula records and diagram legends

The controller read each record and opened its actual diagram at original size. Plain-text composition records alone do not establish the complete role mapping. The locator for each role is the teaching diagram's labeled color legend. All diagram URLs are evidence links; the project draws its own graph and does not copy the images. Source medical claims and dosing text are not imported into the exhibition.

| Case | Record | Role legend | Scope caveat |
| --- | --- | --- | --- |
| 四君子汤 | [F00067](https://sys01.lib.hkbu.edu.hk/cmed/cmfid/detail.php?id=F00067), 《太平惠民和剂局方》 | [diagram](https://sys01.lib.hkbu.edu.hk/cmed/cmfid/images/cht/F00067.jpg): 人参君、白术臣、茯苓佐、炙甘草使 | 炙甘草 display is preserved; `gancao` is a related-card index, not equal material identity. |
| 麻黄汤 | [F00001](https://sys01.lib.hkbu.edu.hk/cmed/cmfid/detail.php?id=F00001), 《伤寒论》 | [diagram](https://sys01.lib.hkbu.edu.hk/cmed/cmfid/images/cht/F00001.jpg): 麻黄君、桂枝臣、杏仁佐、炙甘草使 | Roles scoped to this teaching interpretation; same processed-material caveat. |
| 桂枝汤 | [F00002](https://sys01.lib.hkbu.edu.hk/cmed/cmfid/detail.php?id=F00002), 《伤寒论》 | [diagram](https://sys01.lib.hkbu.edu.hk/cmed/cmfid/images/cht/F00002.jpg): 桂枝君、白芍臣、生姜佐、大枣佐、炙甘草使 | Composition lists 芍药; 白芍 comes from the modern explanatory paragraph and diagram, not a claim about original wording. |

An edge exposes a role only when an assertion exists for the same case and herb. Other archive roles are not inferred or promoted; unassigned/source-limited fallback is supported. The graphs have 5/4, 5/4 and 6/5 nodes/edges respectively, with one active formula at a time. Original archive units remain unchanged.

## Inherit: independent heritage contexts

[UNESCO Lum medicinal bathing of Sowa Rigpa, 01386](https://ich.unesco.org/en/RL/lum-medicinal-bathing-of-sowa-rigpa-knowledge-and-practices-concerning-life-health-and-illness-prevention-and-treatment-among-the-tibetan-people-in-china-01386), Description paragraphs, read by controller during design verification: natural hot springs, herbal water and steam; farmers, herdsmen and urban residents; Manpa physician, Lum Jorkhan pharmacist and Manyok assistant transmission responsibilities; daily life, religious rituals, folkloric activities, medicinal practice and medical-college curricula. The scene has 12 nodes/11 case-to-object edges in three typed groups. Grouped fields are labeled honestly. It asserts no particular herb, mentor relationship, or mapping into TCM five phases.

[中国非物质文化遗产网：中药炮制技术](https://www.ihchina.cn/project_details/14788.html), project 442, code Ⅸ-3, 2006 first batch. Controller read by public HTTP; implementer additionally fetched it via `Invoke-WebRequest` and read the decoded project introduction, historical paragraph and institution fields before writing processing descriptions. Applicant 中国中医科学院; protector 中国中医科学院中药研究所. The first paragraph supports processing into 饮片 under traditional theory, accumulated methods/techniques and traditional tools. The history paragraph supports literature records, including 《本草经集注》《雷公炮炙论》. Project text also identifies inheritance/protection needs. The 7-node/6-edge scene represents these as project relationships, not a universal mandatory 净制→切制→炮炙 pipeline. No historical practitioner count is presented as a 2026 statistic, and no mentor lineage is invented.

The 37 ethnic candidates remain in review. Their dataset and storage are untouched; these two sourced heritage cases do not approve candidates or fabricate herb links.

## Reading note and access

The selected object, chosen takeaway, source and canonical exhibition URL are user-editable (URL read-only to retain provenance). Saving uses a dedicated local-storage key `herbal_exhibition_notes_v1` with per-object entries; unavailable storage is disclosed as session-only. SVG export escapes XML, wraps text, contains no external fetches, and revokes its blob URL. There is no automatic sharing. Existing favorites, atlas detail links and 我的本草 learning/history remain available. Native classic scripts permit basic `file://` reading, and semantic buttons provide keyboard equivalents to the SVG.
