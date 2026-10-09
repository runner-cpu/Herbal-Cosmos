/* Cultural questions precede the existing quiz after shared data loads. */
(function () {
  'use strict';
  const host = typeof window === 'undefined' ? globalThis : window;
  const questions = [
    {
      id: 'culture-wuxing-sour',
      category: 'culture',
      q: '在中医五行的文化联系中，酸味常与哪一行相联系？',
      options: ['火', '土', '木', '金'],
      answer: 2,
      note: '酸与木相联系，苦与火、甘与土、辛与金、咸与水相联系。这是传统理论的文化分类，不能据此单独判断用药。来源：展览“道 · 性味归经”的五行解读。',
      source: '道 · 性味归经：五味与五行',
      readHref: '#/qiwei'
    },
    {
      id: 'culture-formula-roles',
      category: 'culture',
      q: '阅读一首方的“君臣佐使”时，哪种理解更准确？',
      options: ['每首方都必须四类齐备', '按具体方义理解角色，不强求四类齐备', '用剂量大小自动判定全部角色', '没有角色记录时自动补成君药'],
      answer: 1,
      note: '君臣佐使解释组方中的主次、辅助与协调关系，具体方剂不必四类齐备。资料没有标注角色时保留“未标注”，不能为了图表完整自行推断。来源：展览“术 · 配伍成方”的角色说明与方剂来源分层。',
      source: '术 · 配伍成方：君臣佐使与方剂来源',
      readHref: '#/formula'
    },
    {
      id: 'culture-pharmacopoeia-scope',
      category: 'culture',
      q: '典籍时间轴中的《中国药典》2020版“5,911”，采用什么统计单位？',
      options: ['可浏览的本草知识卡', '四部合计收载的标准项数', '单味中药材的物种数', '项目已核验的药材照片数'],
      answer: 1,
      note: '5,911表示2020版药典四部合计标准项数，不能与古籍药物数视为同类计数；一部中药标准2,711项也不等于2,711味药。2020版在展览中是历史节点。来源：药典2020收载统计及展览“典籍新读”的口径说明。',
      source: '中国药典2020收载统计：四部与一部范围',
      readHref: '#/heritage'
    },
    {
      id: 'culture-shennong-story',
      category: 'culture',
      q: '怎样理解“神农尝百草”与《神农本草经》的关系？',
      options: ['区分文化起源传说与后世托名的本草文献', '认定神农亲笔写成了现存版本', '把传说当成逐味药物的实验记录', '认为书名能够证明准确作者生卒年'],
      answer: 0,
      note: '“神农尝百草”讲述文化起源，《神农本草经》是后世托名神农的本草文献。传说、文献与现代资料分别说明，不能把故事人物直接当作已考证的作者。来源：展览“序章 · 本草千年”的传说与文献说明。',
      source: '序章 · 本草千年：传说与文献',
      readHref: '#/herbs?section=classics'
    },
    {
      id: 'culture-tibetan-bathing',
      category: 'culture',
      q: '“藏医药浴法”专题怎样呈现民族医药文化的多样性？',
      options: ['把各民族医药都归成同一套理论', '用中医归经图替代藏医的知识体系', '介绍其自身的知识实践，并保留UNESCO条目来源', '仅凭概念插画认定传承人身份'],
      answer: 2,
      note: '藏医药浴是有自身知识背景的文化实践，2018年列入UNESCO人类非物质文化遗产代表作名录。它与中医专题并列展示，不能据此声称各民族医学采用同一体系。站内场景图是概念插画。来源：UNESCO藏医药浴条目01386（2018）。',
      source: 'UNESCO藏医药浴条目01386（2018）',
      sourceUrl: 'https://ich.unesco.org/en/RL/lum-medicinal-bathing-of-sowa-rigpa-knowledge-and-practices-concerning-life-health-and-illness-prevention-and-treatment-among-the-tibetan-people-in-china-01386',
      readHref: '#/heritage'
    }
  ];

  const culturalIds = new Set(questions.map(item => item.id));
  const existing = Array.isArray(host.QUIZ) ? host.QUIZ : [];
  host.CULTURE_QUIZ = questions;
  host.QUIZ = questions.concat(existing.filter(item => !culturalIds.has(item?.id)));
})();
