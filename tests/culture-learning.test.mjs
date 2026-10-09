import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../assets/js/lib/culture-learning.js', import.meta.url), 'utf8');
const sharedData = await readFile(new URL('../assets/js/data/featured.js', import.meta.url), 'utf8');

function learningContext() {
  const window = {};
  const context = vm.createContext({ window });
  vm.runInContext(sharedData, context);
  return { context, window };
}

test('cultural learning becomes the first activity and retains every existing question', () => {
  const { context, window } = learningContext();
  const existing = Array.from(window.QUIZ);
  vm.runInContext(source, context);

  assert.ok(window.CULTURE_QUIZ.length >= 5);
  assert.equal(window.QUIZ.length, existing.length + window.CULTURE_QUIZ.length);
  assert.ok(window.QUIZ.slice(0, window.CULTURE_QUIZ.length).every(item => item.category === 'culture'));
  assert.deepEqual(Array.from(window.QUIZ.slice(window.CULTURE_QUIZ.length)), existing);
  assert.ok(window.QUIZ.some(item => item.q.includes('枸杞子')));
});

test('loading the quiz extension twice does not duplicate questions or lose base content', () => {
  const { context, window } = learningContext();
  vm.runInContext(source, context);
  const once = JSON.stringify(window.QUIZ);
  vm.runInContext(source, context);

  assert.equal(JSON.stringify(window.QUIZ), once);
  const ids = window.QUIZ.filter(item => item.category === 'culture').map(item => item.id);
  assert.equal(new Set(ids).size, window.CULTURE_QUIZ.length);
});

test('questions have answerable choices, explanations, sources and exhibition destinations', () => {
  const { context, window } = learningContext();
  vm.runInContext(source, context);

  for (const item of window.CULTURE_QUIZ) {
    assert.ok(item.q.trim());
    assert.equal(item.options.length, 4);
    assert.equal(new Set(item.options).size, item.options.length);
    assert.ok(item.options.every(option => typeof option === 'string' && option.trim()));
    assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.options.length);
    assert.ok(item.note.includes('来源：'));
    assert.ok(item.source.trim());
    assert.ok(['#/herbs?section=classics', '#/qiwei', '#/formula', '#/heritage'].includes(item.readHref));
  }
});

test('culture answers preserve statistical scope and distinct knowledge traditions', () => {
  const { context, window } = learningContext();
  vm.runInContext(source, context);
  const answerFor = id => {
    const item = window.CULTURE_QUIZ.find(question => question.id === id);
    assert.ok(item, id);
    return item.options[item.answer];
  };

  assert.equal(answerFor('culture-wuxing-sour'), '木');
  assert.equal(answerFor('culture-pharmacopoeia-scope'), '四部合计收载的标准项数');
  assert.equal(answerFor('culture-formula-roles'), '按具体方义理解角色，不强求四类齐备');
  assert.equal(answerFor('culture-shennong-story'), '区分文化起源传说与后世托名的本草文献');
  assert.equal(answerFor('culture-tibetan-bathing'), '介绍其自身的知识实践，并保留UNESCO条目来源');
  const bathing = window.CULTURE_QUIZ.find(item => item.id === 'culture-tibetan-bathing');
  assert.equal(new URL(bathing.sourceUrl).hostname, 'ich.unesco.org');
  assert.match(bathing.note, /2018年/);
  assert.match(bathing.note, /概念插画/);
});

test('the extension remains answerable when the optional base quiz is unavailable', () => {
  const window = {};
  const context = vm.createContext({ window });
  vm.runInContext(source, context);
  assert.equal(window.QUIZ.length, window.CULTURE_QUIZ.length);
  assert.ok(window.QUIZ.every(item => Number.isInteger(item.answer)));
});
