import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
const start = html.indexOf('const HERBS = [');
const end = html.indexOf('// 本草图像系统', start);
const source = html.slice(start + 'const HERBS = '.length, end).trim().replace(/;$/, '');
const herbs = Function(`"use strict"; return (${source});`)();
const generatedIds = new Set(['banlangen','sangye','niubangzi','jingjie','zisunye','baizhi','xinyi','xiakucao','juemingzi','lugen','tianhuafen','kushen','longdan','jinqiancao','haijinsha','peilan','caoguo','laifuzi','qingpi','jianghuang','ruxiang','moyao','baiji','banzhilian','baihuasheshecao','tufuling','daqingye','machixian','puhuang','huaihua','xianhecao','wangbuliuxing','chuanxinlian','wujiaipi','duzhong','xuduan','tusizi','yinyanghuo','nvzhenzi','mohanlian','yuzhu','huangjing','shashen','xiangru','zelan']);
const heritage = [{id:'zhenjiu',name:'针灸'},{id:'paozhi',name:'中药炮制技艺'},{id:'yuyu',name:'藏医药浴法'},{id:'zhenfa',name:'中医诊法'},{id:'yangsheng',name:'中医养生'},{id:'tongrentang',name:'同仁堂中医药文化'}];
const assets = herbs.map(h => generatedIds.has(h.id) ? {
  kind:'herb', id:h.id, name:h.name, file:`images/herbs/${h.id}.jpg`, sourceType:'AI 科普插画', source:'本项目生成', license:'PROJECT-EDUCATIONAL', note:'根据物种/药用部位提示生成并裁切自植物学图谱；不是专业鉴定照片。'
} : {
  kind:'herb', id:h.id, name:h.name, file:`images/herbs/${h.id}.jpg`, sourceType:'本地既有素材', source:'项目历史资产', license:'REVIEW-REQUIRED', note:'保留并去重；缺少原始许可元数据，后续可用开放图库来源替换。'
});
assets.push(...heritage.map(h => ({kind:'heritage',id:h.id,name:h.name,file:`images/heritage/${h.id}.jpg`,sourceType:'AI 科普插画',source:'本项目生成',license:'PROJECT-EDUCATIONAL',note:'文化场景概念插画，不代表历史影像记录。'})));
await fs.writeFile(path.join(root,'data','image-sources.json'), JSON.stringify({generatedAt:new Date().toISOString(), policy:'运行时只使用本地图片。开放图库同步因网络不可达未写入不确定来源；AI 图像和既有素材均显式标注，避免冒充实拍或开放许可。', assets, missing:[]}, null, 2)+'\n');
const lines=['# 图片来源与许可清单','','> 页面运行时仅加载仓库内本地图片。AI 科普插画与历史既有素材均有明确标注；既有素材因缺少原始许可元数据，标记为 REVIEW-REQUIRED，不宣称为开放许可。','','| 对象 | 文件 | 来源类型 | 许可/状态 | 说明 |','|---|---|---|---|---|',...assets.map(a=>`| ${a.name} | ${a.file} | ${a.sourceType} | ${a.license} | ${a.note} |`)];
await fs.writeFile(path.join(root,'IMAGE_SOURCES.md'), lines.join('\n')+'\n');
console.log(`manifest: ${assets.filter(a=>a.kind==='herb').length} herbs, ${assets.filter(a=>a.kind==='heritage').length} heritage`);
