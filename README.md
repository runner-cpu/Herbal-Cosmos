# 本草宇宙 · 一草一世界

中华医药文化交互展 V7。三个主入口：漫游星海、文化长卷、本草图鉴；我的本草作为收藏、足迹、练习与阅读札记工具。认识一味本草、读懂一条关系、打开具体出处，然后留下自己的理解。

[在线展馆](https://runner-cpu.github.io/Herbal-Cosmos/) · [网站职责](docs/website-framework.md) · [文化框架与证据](docs/competition-framework.md) · [三分钟演示](docs/competition-presentation.md) · [V7本地验收报告](reports/2026-10-09-v7-release.md)

下载完整仓库后可双击 index.html 阅读与查询。完整动画、离线安装与增强渲染推荐 HTTP(S)：

```sh
npm ci --ignore-scripts
node scripts/serve-local.mjs 4188
```

开发构建：npm run build:data、npm run build:browser、npm run build:cosmos。依赖锁定；渲染器由 esbuild 打包 Three.js，自托管且按需加载。Canvas 与静态列表保留同一选择和资料语义。file:// 不注册 Service Worker，不保证完整动画或尚未访问资料离线可用。

| 入口 | 实际任务 |
|---|---|
| #/home（默认；旧 #/intro 兼容） | 902 张知识卡对应可选星；分类分组为设计布局，非地理坐标；详情、关系、完整键盘清单 |
| #/exhibit?chapter=recognize | 八张展例的五味关系；复合味多边但本草不复制；淡、涩与未录入独立保留 |
| #/exhibit?chapter=compose | 四君子汤、麻黄汤、桂枝汤三例，一次一首；有据角色开关与教学图出处 |
| #/exhibit?chapter=inherit | Lum 药浴和中药炮制两专题，一次一例；名录所述关系，非重建师承 |
| #/herbs | 知识卡／名称索引、属性统计、方剂、文化资料、典籍与来源账本；补充分析折叠并按需加载 |
| #/learn | 30 题、足迹与个人阅读回看；札记本机保存／SVG导出，无账号或自动发布 |

旧 qiwei、formula、heritage、zheng、intro 锚点经集中路由表到达对应真实资料；知识卡 #/herb?id=… 保留。来源与未知字段继续可查，旧收藏／主题／足迹不迁移成新格式。

## 数据与证据

UI V7 与数据版本10（2026-10-08）分开。构建报告：[数据覆盖](reports/data-coverage.json)、[名称待审](reports/catalog-review.json)、[民族候选](reports/ethnic-coverage.json)。

| 层级 | 保留规模 | 边界 |
|---|---:|---|
| 本草知识卡 | 902 | 803完整、96部分、3基础；不全部称精品 |
| 运行时实体 | 961 | 另含17目录身份、42原方物料；不混入902分母 |
| 名称索引 | 8,818 | 1,487待审另列，名称不等于完整药性档案 |
| 方剂／证候 | 100／58 | 馆藏样本，非全国全量 |
| 食药目录 | 106 | 2002—2024公告快照，非实时目录或食用保证 |
| 有许可照片的卡 | 624 | 562唯一文件；278卡照片待补 |
| 民族对照候选 | 37 | 正式通过0，全部待核，不生成跨体系药材边 |

五味、归经与角色属于传统知识语境，不作温度、解剖、疗效或剂量推断。地区采用文献多值记录，非道地产区认证。文化断言有独立来源定位、核查摘要与日期；URL非空不代表证据通过。

[来源清单](data/sources/source-manifest.json) · [展览案例](assets/js/data/exhibition-cases.js) · [角色证据](docs/exhibition-sources.md) · [照片许可](IMAGE_SOURCES_V4.md) · [既有AI概念图](IMAGE_SOURCES.md)。照片仅作来源生物参考；六张既有概念图非现场纪实，本轮未生成新栅格图。

## 验证与边界

```sh
npm run validate:data
npm run validate:app
npm run check:browser-copies
npm run check:inline
npm test
# PowerShell: $env:PLAYWRIGHT_PORT='4187'
npm run test:browser:ci
npm run test:browser:compat
```

CI另检查生成物和本地渲染器确定性。Pages沿用 gh-pages:/ 分支根目录，发布维护者需检查 Actions／公开文件一致性。本地通过不等于已发布，发布状态见日期报告。

首屏静态数据仍完整加载，未实现“先轻量星辰索引、详细资料延迟取用”目标；图表库、渲染增强、名称索引分块、照片按需取用。未访问的全库与图库不承诺离线。真实手机、真实 Safari、屏幕阅读器专项与非开发者任务研究尚未完成。性能值来自明确条件的浏览器模拟，见报告，不冒充线上或真实设备结论。

第三方：Three.js 0.186.1 与 esbuild 0.28.2（MIT）、ECharts（Apache-2.0）、Playwright（Apache-2.0）；许可见本地 vendor 注释、锁文件和依赖声明。诗云（PolyForm Noncommercial）仅借鉴交互原则，无代码或资产复制；3d-force-graph、Scrollama、React Bits FadeContent／SpotlightCard仅参考设计原则，原生实现，不整包引入。AI辅助本轮路由、图形、测试、文档和核查整理；用户批准选题与设计，不能称学生独立手写全部代码或编造成员分工。
