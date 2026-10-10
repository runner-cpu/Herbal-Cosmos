import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runtime = fs.readFileSync(path.join(root, 'assets/js/core/runtime.js'), 'utf8');

/* runtime.js 用模板串搭 HTML，再把数据字段插进去。字段是公开数据整理来的字符串，
   所以「有没有转义」是唯一挡住注入的东西。这里只扫真正落到 innerHTML 的表达式：
   textContent 与 canvas 尺寸计算不在范围内，它们本来就不会解析标签。 */
function functionBody(source, name) {
  const at = source.indexOf('function ' + name);
  assert.ok(at >= 0, name + ' must still be declared');
  let depth = 0, end = source.indexOf('{', at);
  for (; end < source.length; end++) {
    if (source[end] === '{') depth += 1;
    else if (source[end] === '}') { depth -= 1; if (!depth) { end += 1; break; } }
  }
  return source.slice(at, end);
}

// 从左括号起做括号配平，取出一条赋值语句。模板串内部的括号不参与配平。
function statementAt(source, start) {
  let depth = 0, i = start, quote = null, escaped = false;
  for (; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
    if (ch === '(' || ch === '[' || ch === '{') depth += 1;
    else if (ch === ')' || ch === ']' || ch === '}') { if (!depth) break; depth -= 1; }
    else if ((ch === ';' || ch === '\n') && !depth) break;
  }
  return source.slice(start, i);
}

function innerHtmlStatements(source) {
  const statements = [];
  const marker = /\.innerHTML\s*=\s*/g;
  let match;
  while ((match = marker.exec(source)) !== null) {
    const line = source.slice(0, match.index).split('\n').length;
    statements.push({ line, body: statementAt(source, match.index + match[0].length) });
  }
  return statements;
}

// 允许出现在 innerHTML 模板里的表达式：已经转义过、是常量、是数字，或者是
// 内部自行转义的构建函数（它们的转义由下一个测试逐个钉住）。
const ESCAPED = /^(?:esc|fact|encodeURIComponent|Number|String)\(/;
const SAFE = [
  /^[\d\s+\-*/%.()]+$/,                                   // 纯算式
  /^(?:i|index|count|pageCount|page|windowStart|windowEnd|totalPages|Math\.)/,
  /^(?:label|sortLabel|factSource|efficacyLabel|progress|reading|directoryCount|categoryCount)$/,
  /^(?:herbImage|sourceBadge|sourceLinks|imageCredit|herbImagePlaceholder|catalogSourceLink|herbEfficacyLabel|coverageLabel)\(/,
  /\.map\(|\.join\(/,                                     // 已知内部转义的片段构建
  /^fn\(h\)$/,                                            // 行单元格处理器，由 rows 测试逐个校验
  /\.length\b/,                                           // 计数
  // 内部状态里的数字：页码与答题计数只当数字用，不来自任何外部字符串。
  /^(?:store\._catalogPage|s\.correct|learnState\.index)$/,
  /\?[^:]*:/                                              // 三元表达式，两臂单独走同一个判定
];

test('every html-building helper escapes the data it interpolates', () => {
  for (const name of ['sourceBadge', 'sourceLinks', 'imageCredit', 'herbImage', 'herbImagePlaceholder']) {
    const body = functionBody(runtime, name);
    const raw = [...body.matchAll(/\$\{([^{}]+)\}/g)].map(match => match[1].trim())
      .filter(expr => !ESCAPED.test(expr) && !/^[`'"\d]/.test(expr));
    assert.deepEqual(raw, [], name + ' interpolates data without escaping: ' + raw.join(' | '));
  }
  // 徽章类名与来源标签都会被插进 class 与文本，两者都要转义。
  const badge = functionBody(runtime, 'sourceBadge');
  assert.match(badge, /class="badge \$\{esc\(s\.badge\)\}"/);
  assert.match(badge, /\$\{esc\(s\.label\)\}/);
});

test('the filter selects escape both option text and option value', () => {
  assert.ok(runtime.includes(`'<option value="">全部'+esc(label)+'</option>'`),
    'the placeholder option label must be escaped');
  assert.match(runtime, /values\.map\(v=>`<option value="\$\{esc\(v\)\}">\$\{esc\(v\)\}<\/option>`\s*\)/,
    'each option must escape both its value attribute and its text');
  assert.ok(runtime.includes('composite.map(v=>`<option value="${esc(v)}">${esc(v)} · 复合</option>`)'),
    'the composite optgroup options must escape too');
});

test('the comparison table escapes every row label and every cell', () => {
  const body = functionBody(runtime, 'renderCompareTable');
  assert.match(body, /<tr><th scope="row">\$\{esc\(label\)\}<\/th>/);
  const rows = body.slice(body.indexOf('const rows=['), body.indexOf('head.innerHTML'));
  const handlers = [...rows.matchAll(/\['[^']+', h=>([^\]]+)\]/g)].map(match => match[1].trim());
  assert.ok(handlers.length >= 8, 'the comparison table must still declare its rows: ' + handlers.length);
  for (const handler of handlers) {
    // 单元格要么走 esc()，要么是本地计算的计数，要么整支都是字面量。
    const literal = /^[^?]*\?[^?]*'[^']*'[^?]*:[^?]*'[^']*'$/.test(handler.replace(/'\\?'/g, "'"));
    const constant = /^h\.food\?/.test(handler) && handler.includes("'—'");
    const computed = /^esc\(/.test(handler) || /formulaCounts/.test(handler);
    assert.ok(literal || constant || computed, 'row cell must escape or compute a constant: ' + handler);
  }
});

test('echarts html tooltips escape the names and effects they print', () => {
  assert.match(runtime, /formatter:\(\)=>`\$\{esc\(h\.name\)\}：\$\{esc\(h\.qi\)\} · \$\{esc\(h\.wei\)\}`/);
  assert.match(runtime, /代表药材 <b>\$\{esc\(item\.value\[2\]\)\}<\/b> 味/);
  const graph = functionBody(runtime, 'renderFormula');
  const graphChart = graph.slice(graph.indexOf('gChart.setOption'));
  assert.match(graphChart, /const name = esc\(item\.data\.name\|\|''\);/);
  assert.match(graphChart, /\$\{esc\(formula\.eff\|\|''\)\}/);
  assert.match(graphChart, /\$\{esc\(item\.data\.sourceName\|\|'方剂'\)\}/);
});

test('innerHTML模板里的数据字段都先转义', () => {
  const offenders = [];
  for (const { line, body } of innerHtmlStatements(runtime)) {
    for (const match of body.matchAll(/\$\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g)) {
      const expr = match[1].trim();
      if (ESCAPED.test(expr)) continue;
      if (SAFE.some(pattern => pattern.test(expr))) continue;
      offenders.push('line ' + line + ': ' + expr);
    }
  }
  assert.deepEqual(offenders, [], '这些插值需要转义或明确归类：\n' + offenders.join('\n'));
});

test('the tree keeps one escaping primitive instead of a second dialect', () => {
  assert.equal([...runtime.matchAll(/function esc\(/g)].length, 0,
    'runtime.js 不能自己再声明一份 esc，要用 field-utils 里的那份');
  assert.match(fs.readFileSync(path.join(root, 'assets/js/core/field-utils.js'), 'utf8'), /function esc\(value\)/);
});
