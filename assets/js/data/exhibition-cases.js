/* Project-authored cultural summaries. No source images or medical recommendations. */
(function (root) {
  'use strict';
  const accessedAt = '2026-10-09';
  const sources = {
    classical: { title: '《黄帝内经·素问》阴阳应像大论第五（维基文库转录）', url: 'https://zh.wikisource.org/wiki/黃帝內經/素問第二卷', locator: '第五篇：东方至北方五段，木生酸／火生苦／土生甘／金生辛／水生鹹', accessedAt },
    collection: { title: '本草宇宙 · 项目知识卡字段', url: '#/herbs?mode=featured', locator: 'assets/js/data/featured.js：所选八张知识卡的 wei 字段；非外部药典逐条复核', accessedAt },
    lum: { title: 'UNESCO · Lum medicinal bathing of Sowa Rigpa · 01386', url: 'https://ich.unesco.org/en/RL/lum-medicinal-bathing-of-sowa-rigpa-knowledge-and-practices-concerning-life-health-and-illness-prevention-and-treatment-among-the-tibetan-people-in-china-01386', locator: 'Description：实践形式、社区参与、专业角色及传承场景段', accessedAt },
    processing: { title: '中国非物质文化遗产网 · 中药炮制技术', url: 'https://www.ihchina.cn/project_details/14788.html', locator: '项目442／Ⅸ-3，项目简介首段及历史段、申报与保护单位字段', accessedAt }
  };
  const tastes = [
    { id: 'taste:酸', label: '酸', phase: '木', colorName: '苍', kind: 'taste' },
    { id: 'taste:苦', label: '苦', phase: '火', colorName: '赤', kind: 'taste' },
    { id: 'taste:甘', label: '甘', phase: '土', colorName: '黄', kind: 'taste' },
    { id: 'taste:辛', label: '辛', phase: '金', colorName: '白', kind: 'taste' },
    { id: 'taste:咸', label: '咸', phase: '水', colorName: '黑', kind: 'taste' },
    { id: 'taste:淡', label: '淡', kind: 'supplementary' },
    { id: 'taste:涩', label: '涩', kind: 'supplementary' },
    { id: 'taste:未录入', label: '味型待补', kind: 'missing' }
  ];
  const curated = ['wuweizi', 'huanglian', 'gancao', 'guizhi', 'mangxiao', 'juemingzi', 'tufuling', 'baiji'];
  const herbLabels = ['五味子', '黄连', '甘草', '桂枝', '芒硝', '决明子', '土茯苓', '白及'];
  const assertions = [];
  function claim(id, caseId, statement, entityIds, system, source, evidenceNote) {
    const record = { id, caseId, statement, entityIds, system, source, evidenceNote, kind: 'project-summary', status: 'approved' };
    assertions.push(record); return record;
  }
  claim('five-correspondence', 'five-tastes', '五味与木、火、土、金、水及苍、赤、黄、白、黑相配，是经典中的传统对应表达。', tastes.slice(0, 5).map(t => t.id), '中医经典文化对应', sources.classical, '社区转录，未完全校对；不代表现代测量属性。使用原文苍、黑，咸为鹹的简体。');
  curated.forEach((id, i) => claim('taste-' + id, 'five-tastes', herbLabels[i] + '的连线读取项目知识卡的性味字段；复合味型保留多条关系。', [id], '项目中医性味记录', { ...sources.collection, url: '#/herb?id=' + id, locator: '项目知识卡 ' + id + ' 的 wei 字段' }, '这些连接展示本项目字段，不宣称已重新核验药典原文；淡、涩独列，空值与未知记录归入未录入。'));

  function formula(id, name, record, origin, members, caveat) {
    const source = { title: '香港浸会大学 · 中医药方剂图像数据库 · ' + name, url: 'https://sys01.lib.hkbu.edu.hk/cmed/cmfid/detail.php?id=' + record, locator: record + '记录：来源、组成；配伍角色据配套教学图彩色图例', accessedAt };
    const diagram = 'https://sys01.lib.hkbu.edu.hk/cmed/cmfid/images/cht/' + record + '.jpg';
    const result = { id, name, chapter: 'compose', origin, source, diagram, caveat, members: members.map(([herbId, label, role]) => {
      const assertionId = id + '-' + herbId;
      claim(assertionId, id, name + '教学图将' + label + '标为' + role + '药。', [id, herbId], '中医方剂教学解释', { ...source, locator: record + '配套教学图彩色角色图例：' + label + ' → ' + role }, caveat + ' 角色限于此方此图，不表示临床贡献大小。');
      return { id: herbId, label, role, assertionId };
    }) };
    return result;
  }
  const formulas = [
    formula('sijunzitang', '四君子汤', 'F00067', '《太平惠民和剂局方》', [['renshen', '人参', '君'], ['baizhu', '白术', '臣'], ['fuling', '茯苓', '佐'], ['gancao', '炙甘草', '使']], '炙甘草是来源中的炮制材料名；链接甘草卡仅作相关索引，不等同材料。'),
    formula('mahuangtang', '麻黄汤', 'F00001', '《伤寒论》', [['mahuang', '麻黄', '君'], ['guizhi', '桂枝', '臣'], ['xingren', '杏仁', '佐'], ['gancao', '炙甘草', '使']], '炙甘草保留来源材料名，甘草卡仅作相关索引。'),
    formula('guizhitang', '桂枝汤', 'F00002', '《伤寒论》', [['guizhi', '桂枝', '君'], ['baishao', '白芍', '臣'], ['shengjiang', '生姜', '佐'], ['dazao', '大枣', '佐'], ['gancao', '炙甘草', '使']], '原方组成栏为芍药；此处白芍据现代解释段与教学图，不称古方原文为白芍。炙甘草链接甘草卡仅作相关索引。')
  ];
  function heritage(id, name, source, description, groups) {
    const nodes = [{ id, label: name, kind: 'case', description }], edges = [];
    groups.forEach(([type, entries]) => entries.forEach(([nodeId, label, text, locator]) => {
      const assertionId = id + '-' + nodeId;
      nodes.push({ id: nodeId, label, kind: type, description: text, assertionId });
      edges.push({ source: id, target: nodeId, type, assertionId });
      claim(assertionId, id, text, [id, nodeId], id === 'lum' ? '藏医药浴文化独立语境' : '中药炮制非遗语境', { ...source, locator: locator || source.locator }, id === 'lum' ? '项目页概述归纳；不推断具体药材，也不创造师承谱系或五行映射。' : '项目页文化描述；不构造通用操作流程，不把历史人数当作当前统计。');
    }));
    return { id, name, chapter: 'inherit', source, description, nodes, edges };
  }
  const heritages = [
    heritage('lum', '藏医药浴法 · Lum', sources.lum, '在独立的藏医药文化语境里，读一项实践如何嵌入社区生活与知识传递。', [
      ['practice', [['hot-springs', '天然温泉', '项目描述包括天然温泉中的沐浴实践。'], ['herbal-water', '药水浴', '项目描述包括药水沐浴，不列具体药材。'], ['steam', '蒸汽浴', '项目描述包括蒸汽沐浴实践。']]],
      ['participant', [['communities', '农牧民与城市居民', '项目将农民、牧民及城市居民列为参与社区。'], ['manpa', 'Manpa · 医师', '项目描述Manpa医师承担知识与实践传递责任。'], ['jorkhan', 'Lum Jorkhan · 药师', '项目描述Lum Jorkhan药师承担知识与实践传递责任。'], ['manyok', 'Manyok · 助手', '项目描述Manyok助手承担知识与实践传递责任。']]],
      ['transmission', [['daily', '日常生活', '传承发生于日常生活场景。'], ['ritual-folklore', '仪式与民俗活动', '宗教仪式及民俗活动构成知识传递场景。'], ['medicinal', '医疗实践', '项目把医疗实践列为传承场景。'], ['college', '医学院校课程', '项目描述相关知识进入医学院校课程。']]]
    ]),
    heritage('processing', '中药炮制技术', sources.processing, '从方法、工具与文献读技艺积累；这里只展示项目记录中的关系，不展开操作步骤。', [
      ['practice', [['methods', '方法与技术', '项目首段定义炮制为传统理论指导下将药材加工为饮片的方法与技术。'], ['tools', '传统加工工具', '项目首段记录长期实践形成传统炮制加工工具。']]],
      ['participant', [['applicant', '中国中医科学院', '项目字段列申报单位为中国中医科学院。'], ['protector', '中药研究所', '项目字段列保护单位为中国中医科学院中药研究所。']]],
      ['transmission', [['texts', '历代文献记载', '历史段列举《本草经集注》《雷公炮炙论》等文献中的炮制记述。'], ['accumulation', '积累与保护', '项目说明技艺长期积累，并提出继承与保护的需求。']]]
    ])
  ];
  const chapters = [
    { id: 'recognize', number: '01', title: '识一草', subtitle: '从五味，读传统的分类语言', description: '同一味本草，可以连接多个味型。用八张知识卡读分类，再回到更完整的资料。', defaultCase: 'five-tastes' },
    { id: 'compose', number: '02', title: '合一方', subtitle: '一首方剂里的关系与角色', description: '把方剂放在一侧、组成材料放在另一侧。君臣佐使只在具体方剂和来源语境中解释。', defaultCase: 'sijunzitang' },
    { id: 'inherit', number: '03', title: '传一艺', subtitle: '实践、参与者与传递场景', description: '在各自文化语境中阅读项目记录。线条表示项目包含的关系，不是师承或加工顺序。', defaultCase: 'lum' }
  ];
  function recognitionGraph(herbs) {
    const records = curated.map(id => herbs.find(h => h.id === id)).filter(Boolean);
    const nodes = tastes.map(t => ({ ...t }));
    const edges = [];
    records.forEach(h => {
      nodes.push({ id: h.id, label: h.name, wei: String(h.wei || ''), kind: 'herb', assertionId: 'taste-' + h.id });
      const found = tastes.slice(0, 7).filter(t => String(h.wei || '').includes(t.label));
      (found.length ? found : [tastes[7]]).forEach(t => edges.push({ source: t.id, target: h.id, type: t.kind, assertionId: 'taste-' + h.id }));
    });
    return { caseId: 'five-tastes', nodes, edges };
  }
  function formulaGraph(value) {
    const entry = typeof value === 'string' ? formulas.find(f => f.id === value) : value;
    if (!entry) return { caseId: '', nodes: [], edges: [] };
    return { caseId: entry.id, nodes: [{ id: entry.id, label: entry.name, kind: 'formula' }, ...entry.members.map(m => ({ ...m, kind: 'herb' }))], edges: entry.members.map(m => {
      const approved = assertions.find(a => a.id === m.assertionId && a.caseId === entry.id && a.entityIds.includes(m.id));
      return { source: entry.id, target: m.id, type: 'member', role: approved ? m.role : null, assertionId: approved ? m.assertionId : null };
    }) };
  }
  function heritageGraph(id) {
    const entry = heritages.find(h => h.id === id);
    return entry ? { caseId: id, nodes: entry.nodes.map(n => ({ ...n })), edges: entry.edges.map(e => ({ ...e })) } : { caseId: '', nodes: [], edges: [] };
  }
  function resolveState(params = {}) {
    const chapter = chapters.find(c => c.id === params.chapter) || chapters[0];
    const available = chapter.id === 'compose' ? formulas : chapter.id === 'inherit' ? heritages : [{ id: 'five-tastes' }];
    const entry = available.find(c => c.id === (params.case || params.caseId)) || available[0];
    const ids = chapter.id === 'recognize' ? [...tastes.map(t => t.id), ...curated] : chapter.id === 'compose' ? [entry.id, ...entry.members.map(m => m.id)] : entry.nodes.map(n => n.id);
    return { chapter: chapter.id, caseId: entry.id, selected: ids.includes(params.selected) ? params.selected : chapter.id === 'recognize' ? 'taste:甘' : entry.id, roles: params.roles === true || params.roles === '1' };
  }
  function canonicalHash(params) {
    const state = resolveState(params);
    const query = new URLSearchParams({ chapter: state.chapter, case: state.caseId, selected: state.selected });
    if (state.roles) query.set('roles', '1');
    return '#/exhibit?' + query.toString();
  }
  function escapeXml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c])); }
  function noteSvg(note) {
    const rows = ['本草宇宙 · 阅读札记', '阅读对象：' + (note.object || ''), '我的理解：' + (note.takeaway || ''), '来源：' + (note.source || ''), '展览地址：' + (note.url || '')];
    const lines = rows.flatMap(row => {
      const characters = Array.from(row), chunks = [];
      for (let i = 0; i < characters.length; i += 38) chunks.push(characters.slice(i, i + 38).join(''));
      return chunks;
    });
    const height = Math.max(420, 110 + lines.length * 30);
    return '<svg xmlns="http://www.w3.org/2000/svg" width="760" height="' + height + '" viewBox="0 0 760 ' + height + '"><rect width="760" height="100%" fill="#f5f1e8"/><text x="40" y="40" fill="#193b30" font-size="18" font-family="sans-serif">' + lines.map(line => '<tspan x="40" dy="30">' + escapeXml(line) + '</tspan>').join('') + '</text></svg>';
  }
  root.HerbalExhibitionCases = { sources, tastes, curated, assertions, formulas, heritages, chapters, recognitionGraph, formulaGraph, heritageGraph, resolveState, canonicalHash, escapeXml, noteSvg };
})(typeof window !== 'undefined' ? window : globalThis);
