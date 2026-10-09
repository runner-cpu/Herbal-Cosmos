/* 民族对照线索层。
 *
 * 这不是一份"各民族医药体系数据库"，而是给已收录药材加的一层对照标注：
 * 某一味药在哪些民族的医药文献中也有记载。所有条目必须带可访问来源；
 * 没有来源的条目一律留在 review，不进入页面渲染（见 scripts/validate-ethnic-data.mjs）。
 *
 * status 说明：
 *   approved —— 已有可访问来源，可在星云、知识卡与传承展区呈现
 *   review   —— 待补来源，只在覆盖报告中可见
 *
 * 注：本馆知识卡按中医本草框架编目（四气、五味、归经与资料分类均为汉地方案）。
 *     民族对照只说明"还见于其他体系"，不改变原有编目口径，也不等于体系收载认定。 */
window.ETHNIC_CORRESPONDENCE = [
  {
    herbId: 'open-4547aaf7fe62',
    herbName: '诃子',
    systems: ['tibetan', 'mongolian'],
    note: '在藏医药与蒙古医药文献中均有记载的常用药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-91b2193137e8',
    herbName: '翼首草',
    systems: ['tibetan'],
    note: '藏医药文献中记载的高原药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-89674717be7b',
    herbName: '独一味',
    systems: ['tibetan'],
    note: '藏医药文献中记载的高原药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-ee284eac912e',
    herbName: '红景天',
    systems: ['tibetan'],
    note: '藏医药文献中记载的高原药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-88aa79dc3e86',
    herbName: '菊苣',
    systems: ['uyghur'],
    note: '维吾尔医药文献中记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-aebd1c705d07',
    herbName: '黑种草子',
    systems: ['uyghur'],
    note: '维吾尔医药文献中记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-6a20da163f2b',
    herbName: '沙棘',
    systems: ['tibetan', 'mongolian'],
    note: '在藏医药与蒙古医药文献中均有记载的常用药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-e01c5fa72aa1',
    herbName: '余甘子',
    systems: ['tibetan', 'uyghur'],
    note: '在藏医药与维吾尔医药文献中均有记载。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-b48432da0f27',
    herbName: '草乌',
    systems: ['mongolian'],
    note: '蒙古医药文献中记载的药材，原植物有毒，须炮制后使用。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-a840d0d6ecec',
    herbName: '天仙子',
    systems: ['mongolian'],
    note: '蒙古医药文献中记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-6134ebf4a2c7',
    herbName: '肉豆蔻',
    systems: ['mongolian', 'uyghur'],
    note: '在蒙古医药与维吾尔医药文献中均有记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-b5d360fd884e',
    herbName: '荜茇',
    systems: ['mongolian', 'uyghur', 'tibetan'],
    note: '在蒙古医药、维吾尔医药与藏医药文献中均有记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-a7d91150c3f4',
    herbName: '胡椒',
    systems: ['mongolian', 'uyghur', 'tibetan'],
    note: '在多个民族医药文献中均有记载，同时是国家食药物质目录收载的香辛料。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-3e8ef1fb9296',
    herbName: '豆蔻',
    systems: ['mongolian', 'uyghur'],
    note: '在蒙古医药与维吾尔医药文献中均有记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-0a9c97694038',
    herbName: '檀香',
    systems: ['uyghur', 'tibetan'],
    note: '在维吾尔医药与藏医药文献中均有记载。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-fcfd247e26bd',
    herbName: '沉香',
    systems: ['uyghur', 'tibetan'],
    note: '在维吾尔医药与藏医药文献中均有记载。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-73c484b4ebc7',
    herbName: '丁香',
    systems: ['uyghur', 'tibetan'],
    note: '在维吾尔医药与藏医药文献中均有记载，同时是国家食药物质目录收载的香辛料。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-ac59252eb64c',
    herbName: '玫瑰花',
    systems: ['uyghur'],
    note: '维吾尔医药文献中记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'mahuang',
    herbName: '麻黄',
    systems: ['common'],
    note: '在多个民族医药文献中均有记载的常用药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'gancao',
    herbName: '甘草',
    systems: ['common'],
    note: '在多个民族医药文献中均有记载的常用药材，同时是国家食药物质目录收载项。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'huangqi',
    herbName: '黄芪',
    systems: ['common'],
    note: '在多个民族医药文献中均有记载的常用药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'qinjiao',
    herbName: '秦艽',
    systems: ['common'],
    note: '在多个民族医药文献中均有记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'longdan',
    herbName: '龙胆',
    systems: ['common'],
    note: '在多个民族医药文献中均有记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-84a8115d849f',
    herbName: '锁阳',
    systems: ['mongolian'],
    note: '蒙古医药文献中记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-3cabeb886781',
    herbName: '肉苁蓉',
    systems: ['mongolian'],
    note: '蒙古医药文献中记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-f8cc35eb6a83',
    herbName: '冬虫夏草',
    systems: ['tibetan'],
    note: '藏医药文献中记载的高原药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-b3764e15996d',
    herbName: '西红花',
    systems: ['tibetan', 'uyghur'],
    note: '在藏医药与维吾尔医药文献中均有记载。别名"藏红花"来自其历史流通路线，不代表植物原产西藏。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'honghua',
    herbName: '红花',
    systems: ['mongolian', 'uyghur', 'tibetan'],
    note: '在多个民族医药文献中均有记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'caoguo',
    herbName: '草果',
    systems: ['mongolian', 'uyghur'],
    note: '在蒙古医药与维吾尔医药文献中均有记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'muxiang',
    herbName: '木香',
    systems: ['tibetan', 'mongolian'],
    note: '在藏医药与蒙古医药文献中均有记载。藏医药另有"藏木香"一名，对应植物与本条目不同。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-680cefa37061',
    herbName: '小茴香',
    systems: ['uyghur'],
    note: '维吾尔医药文献中记载的药材，同时是国家食药物质目录收载的香辛料。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'rougui',
    herbName: '肉桂',
    systems: ['mongolian', 'uyghur'],
    note: '在蒙古医药与维吾尔医药文献中均有记载，同时是国家食药物质目录收载的香辛料。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'ganjiang',
    herbName: '干姜',
    systems: ['mongolian', 'tibetan'],
    note: '在蒙古医药与藏医药文献中均有记载。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-03c5239b1058',
    herbName: '巴戟天',
    systems: ['uyghur'],
    note: '维吾尔医药文献中记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'pugongying',
    herbName: '蒲公英',
    systems: ['common'],
    note: '在多个民族医药文献中均有记载的常用药材。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-84a4206e8d79',
    herbName: '石榴皮',
    systems: ['tibetan', 'mongolian'],
    note: '在藏医药与蒙古医药文献中均有记载。藏医药另有以石榴入药的记载。',
    source: { title: '', url: '' },
    status: 'review'
  },
  {
    herbId: 'open-d75da9b9d4fb',
    herbName: '当药',
    systems: ['tibetan'],
    note: '别名"獐牙菜"，藏医药文献中记载的药材。',
    source: { title: '', url: '' },
    status: 'review'
  }
];
