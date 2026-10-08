/* Cultural exhibition pages. Existing datasets remain the canonical collection. */
(function () {
  'use strict';

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const bound = new WeakSet();
  const foodState = { query: '', scope: 'all', page: 1 };
  const journeySession = { favorites: [], viewed: [] };
  const PAGE_SIZE = 12;
  const sources = {
    acupuncture: 'https://ich.unesco.org/en/RL/acupuncture-and-moxibustion-of-traditional-chinese-medicine-00425',
    bathing: 'https://ich.unesco.org/en/RL/lum-medicinal-bathing-of-sowa-rigpa-knowledge-and-practices-concerning-life-health-and-illness-prevention-and-treatment-among-the-tibetan-people-in-china-01386',
    processing: 'https://www.ihchina.cn/project_details/14788.html',
    diagnosis: 'https://www.ihchina.cn/project_details/14768.html',
    wellbeing: 'https://www.ihchina.cn/project_details/23850.html',
    pharmacy: 'https://www.ihchina.cn/project_details/14852.html',
    bencaoBibliography: 'https://en.wikipedia.org/wiki/Compendium_of_Materia_Medica',
    pharmacopoeia2020: 'https://www.nmpa.gov.cn/xxgk/ggtg/ypggtg/ypqtggtg/20200702151301219.html',
    food2002: 'https://www.nhc.gov.cn/zwgkzt/wsbysj/200810/38175.shtml',
    food2019: 'https://www.nhc.gov.cn/wjw/c100175/202001/60977058ce3b4449b1b1d46cff283e73.shtml',
    food2023: 'https://www.nhc.gov.cn/sps/c100088/202311/5b062dd13fe646198b56c7d76a99aab4.shtml',
    food2024: 'https://wsjkw.nx.gov.cn/zfxxgk_279/zcfg/202409/t20240907_4650013.html'
  };
  const heritageNotes = {
    '针灸': { theme: '以技艺认识身体', badge: 'UNESCO · 2010', source: 'acupuncture', label: '中医针灸 · 人类非遗名录', note: '针刺与艾灸是中医药文化中的传统实践。它们的知识与技艺通过师徒和学校教育等途径传承。', prompt: '读名录时，留意“知识”如何通过人传给人。' },
    '中药炮制技艺': { theme: '一味药的工艺旅程', badge: '国家级 · Ⅸ-3', source: 'processing', label: '中药炮制技术 · 2006 第一批', note: '从净制、切制到不同炮炙方法，药材要经历一系列加工。名录以“中药炮制技术”记录这一技艺及其传承。', prompt: '同一种原料，为什么要保留不同的加工方法？' },
    '藏医药浴法': { theme: '高原上的生活知识', badge: 'UNESCO · 2018', source: 'bathing', label: '藏医药浴法 · 人类非遗名录', note: '藏医药浴法（Lum）包含温泉、药水或蒸汽浴等传统知识与实践。这里以其独立的文化体系呈现，保留名录对生活、健康与传承的描述。', prompt: '比较不同文化的表达之前，先读它自己的名称与解释。' },
    '中医诊法': { theme: '观察、倾听与询问', badge: '国家级 · Ⅸ-2', source: 'diagnosis', label: '中医诊法 · 2006 第一批', note: '望、闻、问、切构成传统诊察方法。名录记录的不只是方法名称，也包括知识体系、实践经验与传承主体。', prompt: '四诊为何要放在一起理解？' },
    '中医养生': { theme: '把传承放进日常', badge: '主题 · 代表条目', source: 'wellbeing', label: '中医养生（中医传统导引法）· 2021', note: '养生是宽广的文化主题。此处以国家级名录中的“中医传统导引法”为具体阅读入口，观察动作、呼吸与生活节律如何被传承。', prompt: '日常生活如何成为文化传习的场所？' },
    '同仁堂中医药文化': { theme: '技艺背后的责任', badge: '国家级 · Ⅸ-7', source: 'pharmacy', label: '同仁堂中医药文化 · 2006 第一批', note: '同仁堂中医药文化将传统制药技艺、经营理念与传承实践联系起来。名录提供了项目和保护单位的明确记录。', prompt: '一门技艺除了方法，还传递怎样的责任？' }
  };
  const classicNotes = {
    '神农本草经': { era: '汉代形成 · 后世辑本', focus: '从经验到分类', note: '托名神农，传世辑本收载 365 种药物，以上、中、下三品组织知识。神农尝百草属于起源传说，不能据此认定作者、成书年份或历史人物经历。', figure: '365', unit: '传世本收载药物' },
    '本草经集注': { era: '南朝梁', focus: '注释与整理', note: '陶弘景整理前代本草，增补注释与药物资料。观察“旧知识如何被校注”，比把收载量当作进步排行榜更有意义。' },
    '新修本草': { era: '唐 · 659 年', focus: '编修与制度', note: '由唐代朝廷组织编修。文字、药图与图经共同参与药物知识的整理，使本草成为公共知识的一部分。' },
    '证类本草': { era: '北宋 · 后有多种版本', focus: '汇聚与引证', note: '唐慎微广泛汇聚前代本草与相关文献。不同刊本与整理本应分别阅读，不能将版本间数字直接作同口径比较。' },
    '本草纲目': { era: '明 · 1596 年初刊', focus: '纲目与再分类', note: '李时珍编纂，按部、类组织药物资料，记载 1,892 种药物。编写、作序与首次刊刻是不同时间，时间线采用初刊年份。', figure: '1,892', unit: '典籍记载药物' },
    '本草纲目拾遗': { era: '清 · 18 世纪', focus: '民间知识的补遗', note: '赵学敏补录《本草纲目》之外的药物知识。以“补遗”理解知识如何持续更新，不把本书数量与全书总量相加作简单增长曲线。' },
    '中国药典 2020': { era: '现代 · 2020 年版', focus: '从本草到质量标准', note: '四部合计收载 5,911 个品种；一部收载 2,711 个品种。范围包括中药、化学药、生物制品等，5,911 并非中草药物种数。这里展示标准化这一转变，而不画“365 → 5,911”的增长图。', figure: '5,911', unit: '四部合计品种 · 与药物数不同口径' }
  };

  function externalLink(url, label, className = '') {
    if (!/^https:\/\//.test(url || '')) return '';
    return '<a class="culture-source ' + escapeHtml(className) + '" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(label) + '<span aria-hidden="true"> ↗</span><span class="culture-sr-only">（新窗口）</span></a>';
  }
  function classicEntries() {
    const names = (window.CLASSICS || []).map(item => item.name).filter(name => classicNotes[name]);
    return (names.length ? [...new Set(names)] : Object.keys(classicNotes)).map(name => ({ name, ...classicNotes[name] }));
  }
  function classicReference(item) {
    if (item.name === '本草纲目') return '<div class="culture-classic-reference">' + externalLink(sources.bencaoBibliography, '初刊年份 · 二级书目参考') + '</div>';
    if (item.name === '中国药典 2020') return '<div class="culture-classic-reference">' + externalLink(sources.pharmacopoeia2020, '2020 年版药典颁布公告 · 官方出处') + '</div>';
    return '';
  }
  function starsIllustration() {
    const dots = Array.from({ length: 48 }, (_, index) => {
      const angle = index * 2.3999632297, radius = 32 + Math.sqrt(index / 47) * 158;
      return '<circle cx="' + (220 + Math.cos(angle) * radius).toFixed(1) + '" cy="' + (220 + Math.sin(angle) * radius).toFixed(1) + '" r="' + (index % 7 === 0 ? 2.4 : 1.1) + '"/>';
    }).join('');
    return '<div class="culture-orbit" aria-hidden="true"><svg viewBox="0 0 440 440" focusable="false"><g class="culture-orbit-rings" fill="none"><circle cx="220" cy="220" r="78"/><circle cx="220" cy="220" r="144"/><circle cx="220" cy="220" r="198"/><path d="M22 220h396M220 22v396"/></g><g class="culture-orbit-stars">' + dots + '</g><path class="culture-leaf" d="M218 292C125 240 150 149 271 112C293 200 274 258 218 292ZM218 292L245 154M226 251L185 213M234 215L270 184" fill="none"/><circle class="culture-orbit-core" cx="220" cy="220" r="5"/></svg><span class="culture-orbit-label culture-orbit-north">天地</span><span class="culture-orbit-label culture-orbit-south">草木</span><span class="culture-orbit-caption">一草一木，皆可成为认识世界的起点</span></div>';
  }
  function sectionHeading(number, title, description) {
    return '<div class="culture-section-head"><span class="culture-section-number" aria-hidden="true">' + escapeHtml(number) + '</span><div><h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(description) + '</p></div></div>';
  }
  function renderIntro() {
    const root = document.getElementById('introExhibit');
    if (!root) return;
    root.innerHTML = '<div class="culture-exhibit culture-intro"><div class="culture-door"><div class="culture-door-copy"><p class="culture-kicker">序章 · 民族医药文化数字展馆</p><h1>本草<span>千年</span></h1><p class="culture-door-deck">从草木走向天地，<br>从一页本草走向一段传承。</p><p class="culture-door-description">这是一段由“源、道、术、传”组成的文化旅程。以典籍与名录为线索，以星图、属性与关系为表达，一起读懂本草背后的人与生活。</p><a class="culture-enter" href="#/home"><span>叩门 · 进入本草宇宙</span><span aria-hidden="true">→</span></a><a class="culture-skip" href="#/herbs">直接查一味本草 ↗</a></div>' + starsIllustration() + '</div>'
      + '<aside class="culture-legend"><span class="culture-small-seal" aria-hidden="true">起源</span><div><h2>神农尝百草：一个起源故事</h2><p>传说把人们认识草木、积累药物经验的漫长过程，凝成神农尝百草的形象。《神农本草经》托名神农，传说与文献成书史需要分开阅读。</p><span>文化传说 · 不作为历史事件或用药依据</span></div></aside>'
      + '<section class="culture-section" id="intro-timeline">' + sectionHeading('一', '把时间翻成书页', '每一部本草，都是一次观察、整理与传递。时间线展示知识组织方式的变化。')
      + '<ol class="culture-chronicle">' + classicEntries().map((item, index) => '<li><span class="culture-chronicle-index">' + String(index + 1).padStart(2, '0') + '</span><div><p class="culture-era">' + escapeHtml(item.era) + '</p><h3>《' + escapeHtml(item.name) + '》</h3><strong>' + escapeHtml(item.focus) + '</strong><p>' + escapeHtml(item.note) + '</p>' + (item.figure ? '<div class="culture-classic-figure"><b>' + item.figure + '</b><span>' + escapeHtml(item.unit) + '</span></div>' : '') + classicReference(item) + '</div></li>').join('') + '</ol><p class="culture-method-note">阅读提示：古代典籍的药物、现代药典的品种标准与资源普查的物种，统计对象各不相同。此处按年代排列，不作收载量增长比较。</p></section>'
      + '<section class="culture-section">' + sectionHeading('二', '三条线索，读进四幕', '先问一个文化问题，再进入数据表达。')
      + '<div class="culture-narrative-lines"><a href="#/qiwei"><span>天人合一</span><h3>草木怎样被理解？</h3><p>在“道”中读四气、五味与归经，分清传统文化解释与现代统计。</p><b>进入第二幕 · 道 →</b></a><a href="#/formula"><span>生生之道</span><h3>一味药怎样成为一首方？</h3><p>在“术”中读君臣佐使，看相互关系如何成为配伍的表达。</p><b>进入第三幕 · 术 →</b></a><a href="#/heritage"><span>薪火相传</span><h3>知识怎样回到人的生活？</h3><p>在“传”中读非遗、食养与典籍，再用收藏与传习留下自己的足迹。</p><b>进入第四幕 · 传 →</b></a></div></section>'
      + '<div class="culture-next"><p>故事从这里开始</p><h2>一草一木，皆有来处。</h2><a class="culture-enter" href="#/home"><span>第一幕 · 源 · 本草宇宙</span><span aria-hidden="true">→</span></a></div></div>';
    bindRoot(root);
  }
  function renderHeritageCard(item, index) {
    const note = heritageNotes[item.name];
    if (!note) return '';
    const image = (window.HERITAGE_IMAGES || {})[item.name];
    const visual = image ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(item.name) + '主题的项目概念插画" loading="lazy" decoding="async" width="640" height="420">' : '<span class="culture-art-empty">' + escapeHtml(item.name) + '</span>';
    return '<article class="culture-heritage-card"><figure>' + visual + '<figcaption>项目概念插画 · 非历史影像</figcaption></figure><div class="culture-heritage-copy"><span class="culture-card-eyebrow">' + String(index + 1).padStart(2, '0') + ' / ' + escapeHtml(note.badge) + '</span><h3>' + escapeHtml(item.name) + '</h3><h4>' + escapeHtml(note.theme) + '</h4><p>' + escapeHtml(note.note) + '</p><details><summary>读一读名录与传承</summary><p>' + escapeHtml(note.prompt) + '</p><p class="culture-reference-label">' + escapeHtml(note.label) + '</p>' + externalLink(sources[note.source], '打开官方名录') + '</details></div></article>';
  }
  function renderHeritage() {
    const root = document.getElementById('heritageExhibit');
    if (!root) return;
    const heritage = Array.isArray(window.HERITAGE) && window.HERITAGE.length ? window.HERITAGE : Object.keys(heritageNotes).map(name => ({ name }));
    const foodCount = (window.FOODS || []).length;
    root.innerHTML = '<div class="culture-exhibit culture-heritage"><div class="culture-act-head"><div><p class="culture-kicker">第四幕 · 传</p><h1>薪火相传</h1><p class="culture-act-deck">传承不只在书页里，<br>也在一双手、一餐饭、一次重新阅读里。</p></div><span class="culture-act-glyph" aria-hidden="true">传</span></div>'
      + '<nav class="culture-local-nav" aria-label="第四幕章节"><a href="#/heritage?anchor=heritage-culture">非遗技艺</a><a href="#/heritage?anchor=heritage-food">厨房里的本草</a><a href="#/heritage?anchor=heritage-classics">典籍新读</a><a href="#/heritage?anchor=heritage-journey">我的足迹</a></nav>'
      + '<section class="culture-section" id="heritage-culture">' + sectionHeading('一', '技艺靠人，代代相传', '六个文化主题，连接人类非遗与国家级名录。主题名称与名录中的具体项目逐项区别。')
      + '<div class="culture-heritage-grid">' + heritage.map(renderHeritageCard).join('') + '</div><p class="culture-method-note">本展柜不是“六项国家级非遗”的计数：针灸、藏医药浴法链接 UNESCO 名录，其余主题链接国家级名录的具体项目。插画用于文化表达，完整说明见 <a href="IMAGE_SOURCES.md">图像来源清单 ↗</a>。</p></section>'
      + '<section class="culture-section" id="heritage-food">' + sectionHeading('二', '厨房里的本草', '从熟悉的生活场景认识食药物质，再回到目录看名称与收载依据。')
      + '<div class="culture-food-intro"><div><strong>' + foodCount + '</strong><span>种目录物质</span></div><p>本展柜采用截至 ' + escapeHtml(window.FOOD_MEDICINE_REVISION || '2024-08-26') + ' 的整理快照。目录收载、生活用法与药材知识卡属于不同资料层级，每个条目保留公告入口。</p></div>'
      + '<div class="culture-food-controls"><label for="heritageFoodSearch">查找目录<input id="heritageFoodSearch" type="search" placeholder="例如：山药、橘皮" value="' + escapeHtml(foodState.query) + '" autocomplete="off"></label><label for="heritageFoodScope">资料范围<select id="heritageFoodScope"><option value="all">全部目录</option><option value="enriched"' + (foodState.scope === 'enriched' ? ' selected' : '') + '>有生活场景说明</option><option value="directory"' + (foodState.scope === 'directory' ? ' selected' : '') + '>仅目录收载</option></select></label></div>'
      + '<p class="culture-food-status" id="heritageFoodStatus" role="status" aria-live="polite" aria-atomic="true"></p><div class="culture-food-grid" id="heritageFoodGrid"></div><nav class="culture-food-pages" id="heritageFoodPages" aria-label="食药物质目录翻页"></nav><p class="culture-method-note">“药食同源”不等于人人可食、无限量食用。生活场景说明用于文化阅读，具体适用范围以公告为准。</p></section>'
      + '<section class="culture-section" id="heritage-classics">' + sectionHeading('三', '典籍新读：带着问题翻书', '保留书名与时代，再看它怎样组织知识。点击展开阅读札记。')
      + '<div class="culture-reading-list">' + classicEntries().map((item, index) => '<details' + (index === 0 ? ' open' : '') + '><summary><span>' + String(index + 1).padStart(2, '0') + '</span><h3>《' + escapeHtml(item.name) + '》</h3><b>' + escapeHtml(item.focus) + '</b></summary><div><p class="culture-era">' + escapeHtml(item.era) + '</p><p>' + escapeHtml(item.note) + '</p>' + classicReference(item) + '</div></details>').join('') + '</div><p class="culture-method-note">札记是依据典籍资料编写的导读，不作原文引语。<a href="#/intro?anchor=intro-timeline">回到序章时间线 →</a></p></section>'
      + '<section class="culture-section" id="heritage-journey">' + sectionHeading('尾声', '我的本草之旅', '从观看到参与：读一张卡、留一味收藏、完成一次传习。') + '<div id="heritageJourney"></div></section>'
      + '<div class="culture-next culture-next-compact"><p>让阅读继续</p><div class="culture-next-links"><a href="#/herbs"><span>图鉴</span><b>查一味本草 →</b></a><a href="#/learn"><span>传习</span><b>进入学习舱 →</b></a><a href="#/intro"><span>回望</span><b>重读本草千年 →</b></a></div></div></div>';
    bindRoot(root);
    renderFood();
    renderJourney();
  }
  function foodResults() {
    const query = foodState.query.trim().toLocaleLowerCase('zh-CN');
    return (window.FOODS || []).filter(food => {
      const text = [food.name, food.directoryName, ...(Array.isArray(food.aliases) ? food.aliases : [])].filter(Boolean).join(' ').toLocaleLowerCase('zh-CN');
      return (!query || text.includes(query)) && (foodState.scope === 'all' || (foodState.scope === 'enriched' ? food.enriched !== false : food.enriched === false));
    });
  }
  function foodSource(food) {
    const source = (food.sourceRefs || [])[0];
    const lookup = { 'nhc-2002-51': ['food2002', '2002 目录公告'], 'nhc-2019-8': ['food2019', '2019 增补公告'], 'nhc-2023-9': ['food2023', '2023 增补公告'], 'nhc-2024-4': ['food2024', '2024 增补公告（政府镜像）'] };
    const entry = lookup[source];
    return entry ? externalLink(sources[entry[0]], entry[1]) : '<span class="culture-era">目录出处待核对</span>';
  }
  function renderFood() {
    const grid = document.getElementById('heritageFoodGrid'), status = document.getElementById('heritageFoodStatus'), pages = document.getElementById('heritageFoodPages');
    if (!grid || !status || !pages) return;
    const results = foodResults(), totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    foodState.page = Math.max(1, Math.min(foodState.page, totalPages));
    const start = (foodState.page - 1) * PAGE_SIZE;
    status.textContent = results.length ? '找到 ' + results.length + ' 条 · 当前 ' + (start + 1) + '–' + Math.min(start + PAGE_SIZE, results.length) + ' 条' : '没有找到对应目录名称。可尝试正式名称或清除筛选。';
    const herbsByName = new Map((window.HERBS || []).filter(herb => !herb.directoryOnly && herb.kind !== 'formula-material').map(herb => [herb.name, herb]));
    grid.innerHTML = results.length ? results.slice(start, start + PAGE_SIZE).map(food => {
      const herb = herbsByName.get(food.name) || herbsByName.get(food.directoryName);
      const name = '<h3>' + escapeHtml(food.name) + '</h3>';
      const title = herb ? '<a class="culture-food-name" href="#/herb?id=' + encodeURIComponent(herb.id) + '">' + name + '<span aria-hidden="true">↗</span></a>' : name;
      const visual = herb && typeof window.herbImage === 'function' ? window.herbImage(herb, 'culture-food-thumb') : '<span class="culture-food-initial" aria-hidden="true">' + escapeHtml((food.name || '草').slice(0, 1)) + '</span>';
      return '<article class="culture-food-card"><div class="culture-food-identity"><div class="culture-food-visual">' + visual + '</div><div>' + title + '<span class="culture-era">' + (food.enriched === false ? '目录收载 · 生活用法待补' : '生活场景 · ' + escapeHtml(food.use || '已整理')) + '</span></div></div>' + (food.directoryName && food.directoryName !== food.name ? '<p class="culture-food-directory-name">目录名：' + escapeHtml(food.directoryName) + '</p>' : '') + '<div class="culture-food-source">' + foodSource(food) + '</div></article>';
    }).join('') : '<div class="culture-food-empty"><p>换个名称，再翻一页。</p><button type="button" data-culture-food-reset>查看全部目录</button></div>';
    pages.innerHTML = '<button type="button" data-culture-food-page="' + (foodState.page - 1) + '"' + (foodState.page <= 1 ? ' disabled' : '') + '>上一页</button><span>第 ' + foodState.page + ' / ' + totalPages + ' 页</span><button type="button" data-culture-food-page="' + (foodState.page + 1) + '"' + (foodState.page >= totalPages ? ' disabled' : '') + '>下一页</button>';
  }
  function readLocal(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
  }
  function knownHerbs(ids) {
    const byId = new Map((window.HERBS || []).map(herb => [herb.id, herb]));
    return [...new Set(Array.isArray(ids) ? ids : [])].map(id => byId.get(id)).filter(Boolean);
  }
  function renderJourney(targetId = 'heritageJourney') {
    const root = document.getElementById(targetId);
    if (!root) return;
    const saved = knownHerbs(readLocal('herbal_favs', journeySession.favorites));
    const viewed = knownHerbs(readLocal('herbal_viewed', journeySession.viewed));
    const stats = readLocal('herbal_learn_stats', window.HerbalLearnState || {});
    const positiveCount = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;
    const total = positiveCount(stats?.total);
    const correct = Math.min(total, positiveCount(stats?.correct));
    root.innerHTML = '<div class="culture-journey-stats"><button type="button" data-saved-open><strong>' + saved.length + '</strong><span>味本机收藏</span><b>打开收藏 →</b></button><a href="#/herbs"><strong>' + viewed.length + '</strong><span>味探索足迹</span><b>继续看本草 →</b></a><a href="#/learn"><strong>' + total + '</strong><span>次完成传习 · 正确 ' + correct + ' 次</span><b>去学习舱 →</b></a></div>'
      + (viewed.length ? '<div class="culture-journey-recent"><span>最近翻过的书页</span>' + viewed.slice(-4).reverse().map(herb => '<a href="#/herb?id=' + encodeURIComponent(herb.id) + '">' + escapeHtml(herb.name) + ' ↗</a>').join('') + '</div>' : '<p class="culture-journey-empty">你的旅程还没有足迹。先在图鉴中打开一张知识卡，再把想继续阅读的本草收进收藏。</p>')
      + '<p class="culture-local-note">收藏、足迹与传习次数保存在当前浏览器中，不上传为个人账户资料；清理浏览器数据后会消失。</p>';
  }
  function bindRoot(root) {
    if (bound.has(root)) return;
    bound.add(root);
    root.addEventListener('input', event => {
      if (event.target.id !== 'heritageFoodSearch') return;
      foodState.query = event.target.value;
      foodState.page = 1;
      renderFood();
    });
    root.addEventListener('change', event => {
      if (event.target.id !== 'heritageFoodScope') return;
      foodState.scope = event.target.value;
      foodState.page = 1;
      renderFood();
    });
    root.addEventListener('click', event => {
      const page = event.target.closest('[data-culture-food-page]');
      if (page && !page.disabled) {
        foodState.page = Number(page.dataset.cultureFoodPage) || 1;
        renderFood();
        root.querySelector('[data-culture-food-page]:not(:disabled)')?.focus({ preventScroll: true });
      }
      if (event.target.closest('[data-culture-food-reset]')) {
        foodState.query = ''; foodState.scope = 'all'; foodState.page = 1;
        const search = root.querySelector('#heritageFoodSearch'), scope = root.querySelector('#heritageFoodScope');
        if (search) search.value = '';
        if (scope) scope.value = 'all';
        renderFood(); search?.focus({ preventScroll: true });
      }
    });
    root.addEventListener('error', event => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || !image.closest('.culture-heritage-card')) return;
      const placeholder = document.createElement('span');
      placeholder.className = 'culture-art-empty';
      placeholder.textContent = '概念插画暂时未能加载';
      image.replaceWith(placeholder);
    }, true);
  }
  function updateJourneys() {
    renderJourney();
    renderJourney('learnJourney');
  }
  window.addEventListener('herbal:favorites', event => {
    if (Array.isArray(event.detail?.ids)) journeySession.favorites = event.detail.ids;
    updateJourneys();
  });
  window.addEventListener('herbal:selected', event => {
    if (Array.isArray(event.detail?.viewedIds)) journeySession.viewed = event.detail.viewedIds;
    Promise.resolve().then(updateJourneys);
  });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-answer], [data-picture-answer]')) Promise.resolve().then(updateJourneys);
  });
  window.addEventListener('storage', event => {
    if (['herbal_favs', 'herbal_viewed', 'herbal_learn_stats'].includes(event.key)) updateJourneys();
  });
  window.HerbalCulture = Object.freeze({ renderIntro, renderHeritage, renderJourney });
})();
