/* Shared field labels used before the deferred insight bundles load. */
var CANONICAL_WEIS=['酸','苦','甘','辛','咸'];
var INVALID_HERB_NAME=/^(?:unknown|未知|未命名|未录入|暂无|无)$/i;
function displayHerbName(id){var h=HERBS.find(function(item){return item.id===id;});var name=String(h&&h.name||'').trim();return name&&!INVALID_HERB_NAME.test(name)?name:'';}
function herbName(id){return displayHerbName(id)||'未命名药材';}
function weiTokens(value){var text=String(value||'').replace(/[、，,；;／\/\s]/g,'');return CANONICAL_WEIS.filter(function(wei){return text.includes(wei);});}
function isCompositeWei(value){return weiTokens(value).length>1;}
function missingLabel(){return '待补充';}
function coverageLabel(value){return ({complete:'完整事实',partial:'部分字段',images:'开放图片','missing-image':'图片待补',origin:'省级分布',sources:'逐行来源'}[value]||value);}
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
