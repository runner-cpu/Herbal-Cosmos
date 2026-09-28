# 本草宇宙 V5 发布前多维审计

审计日期：2026-09-28
审计范围：数据管道、来源与图片、信息架构、视觉连续性、交互、可访问性、性能、PWA、移动端和发布流程。

## 结论

本轮把“内容很多但入口分散、统计口径不清、图片来源不可追溯、首页模块割裂”收敛成一条可验证的首页探索路径。精品层现在有 780 张完整知识卡，名称索引有 8,818 条 approved，药食同源目录 106 条，方剂 50 条，证候 30 条。图片优先采用 Wikimedia Commons / iNaturalist 的开放许可记录；当前 555 张卡有可核验图片，225 张明确显示为待补充，没有用相似物种或生成图填充空缺。

## 分维度检查与本轮处理

| 维度 | 发现 | 本轮处理 | 当前证据 |
|---|---|---|---|
| 数据规模 | 旧版只暴露少量精品卡，首页数字与实际层级容易混淆 | 以公开、可追溯事实记录扩展到 780 张卡；另保留 5 条原方物料用于关系引用但不计入精品卡 | reports/data-coverage.json |
| 名称索引 | 白名单缺失会把干净历史名称全部误判为 review | 生成 8,818 approved / 1,487 review，review 默认不进入检索；规则和质检脚本共同拦截症状句、含“等”和重复别名 | npm run validate:catalog |
| 来源口径 | “有链接”容易被误读成“药典核验” | 覆盖图把完整属性、图片、逐行链接、省级分布分开统计，并注明这些指标可重叠；来源链接不宣称药典认证 | 首页覆盖说明、validate-expanded-data |
| 图片质量 | 图片优先但不能牺牲物种准确性或许可证 | 受限检索新增开放许可记录；每条保留作者、许可证、来源 URL、下载 URL、物种证据和 SHA-256；无法确认的条目继续占位 | 611 条检索记录、553 个本地文件、555 张运行时卡图片；node scripts/fetch-herb-images.mjs --verify |
| 信息架构 | 食养、文化、典籍、来源内容过少却各自形成入口 | 食养、文化、典籍、来源并入首页长卷；“更多”仅保留内容充实的病证药链，保留旧锚点以兼容链接 | Playwright navigation/home-coverage |
| 首页连续性 | 深色英雄区、浅色卡片区和经典页式模块之间断裂 | 统一 --paper / --paper-2 / --card / --line 语义色，移除 classic 主题的局部硬编码背景，所有首页区块共享边界、间距和纸面底色 | assets/css/home.css、375px 回归 |
| 数据洞察 | 只有浏览型列表，用户难以一眼理解资料完成度 | 新增“资料覆盖进度”图；柱条、文字摘要和筛选链接均可操作，直接跳到对应知识卡集合 | #homeCoverageChart browser test |
| 加载稳定性 | 分块请求失败时可能发布半成品，首帧会出现 0 | 4 路并发、单块重试、进度事件、失败不发布半成品；KPI 在清单准备好前显示破折号 | catalog-loader unit/browser tests |
| 探索闭环 | 用户离开首页后难以回到刚看过的药材 | 收藏角标、抽屉、浏览足迹和“继续上次探索”共用同一存储事件；知识卡分页避免长表阻塞 | responsive/accessibility browser tests |
| 可访问性 | 图表和异步列表可能没有可读反馈 | 图表提供文字摘要，加载/失败状态使用 role=status，按钮和链接保留原生键盘路径，375px 触控目标回归 | accessibility/chart tests |
| 移动端 | 星图、筛选和抽屉容易产生横向溢出 | 对桌面与 Pixel 5（375px）运行路由、触控、溢出、主题和收藏回归 | 70 passed、2 条按设备条件跳过 |
| 性能/PWA | 全量目录和图片不应阻塞首屏；更新后旧缓存容易残留 | 目录懒加载、共享字符串压缩、受控 precache、SW v6、离线 shell 回归；生成数据 637,032 bytes，应用 precache 约 2.03 MB | validate:app、PWA browser tests |
| 工程发布 | 手动生成数据容易再次出现“代码与产物不一致” | CI 运行 build、catalog/expanded/app 校验、图片策略、Node/浏览器测试，并检查生成文件无漂移 | .github/workflows/catalog-quality.yml |

## 当前真实口径

| 层级 | 数量 | 说明 |
|---|---:|---|
| 精品知识卡 | 780 | 完整四气/五味/归经/类别/功效/来源字段；面向用户浏览 |
| 原方物料 | 5 | 配方关系所需的食材或炮制物料，不计入精品卡 |
| 名称索引 approved | 8,818 | 仅名称和来源层可检索；不等于 8,818 张完整知识卡 |
| 名称索引 review | 1,487 | 保留在审查报告，默认检索隐藏 |
| 药食同源 | 106 | 官方目录条目，字段不足处明确标注未审计 |
| 方剂 / 证候 | 50 / 30 | 有来源记录的关系网络样本 |
| 开放许可图片 | 555 / 780 | 71.2%（四舍五入）；其余 225 张为明确占位 |
| 来源链接 / 省级分布 | 777 / 519 | 两项可重叠；分布是资料记录地区，不是道地产区认证 |

## 仍需诚实保留的不足

1. 18,817、2,711 等介绍性总量仍是资源规模口径，不应被理解为当前页面逐条可浏览数据；首页已在覆盖说明中分层，但后续可以把每个总量旁的来源卡做成可展开证据。
2. 图片覆盖仍有 225 张空缺，尤其矿物、树脂、炮制品和来源物种不明确的名称。下一阶段应继续逐批检索，并优先补齐首页精选和高频方剂用药；不能为了比例伪造图片。
3. 名称索引的 1,487 条 review 需要人工抽样复核，未来可增加审核队列和变更 diff，而不是直接提高放行比例。
4. ECharts 仍是较大的运行时依赖；下一阶段可按图表类型拆分注册，并用真实网络条件测量首屏 LCP，而不是只看文件字节数。
5. 当前 CI 覆盖 Chromium 桌面和移动模拟器；Safari、低端 Android、屏幕阅读器实机和真实 GitHub Pages CDN 缓存仍应在发布后抽样复测。
6. 首页英文切换仍不是完整本地化入口，因此继续保持隐藏/不宣称完整 EN；若要开放，应先补齐所有静态文案和图表摘要。

## 发布前验收记录

以下命令在 2026-09-28 工作树中重新执行并通过：

~~~text
npm run build:data
npm run validate:data                 # 8818 approved, 1487 review, 0 issue(s)
                                       # 785 cards, 50 formulas, 30 syndromes, 106 foods,
                                       # 555 card images, 611 searched images, 0 issue(s)
npm run validate:app                  # 29 files, 2026784 precached bytes, 0 issue(s)
npm test                              # 77 passed, 0 failed
npm run check:inline                  # 0 issues
npm run test:browser:ci              # 70 passed, 2 skipped
node scripts/fetch-herb-images.mjs --verify  # 0 errors, 555 runtime images
git diff --check                      # 0 whitespace errors
~~~

发布时必须把同一提交 SHA 推送到 main 和 gh-pages，再用 HTTP 200、最新 manifest、首页覆盖图和 375px 页面做线上 smoke test。
