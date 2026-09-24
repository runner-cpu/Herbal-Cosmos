import test from 'node:test';
import assert from 'node:assert/strict';
import { formulaHref, zhengHref, learnStep, quizFeedbackMarkup } from '../assets/js/pages/cross-navigation.js';

test('formula and pattern links preserve the navigation context', () => {
  assert.equal(formulaHref('guizhitang', { source: 'zheng', zhengId: 'feng-han' }), '#/formula?f=guizhitang&from=zheng&z=feng-han');
  assert.equal(zhengHref('feng-han', 'guizhitang'), '#/zheng?z=feng-han&f=guizhitang');
});

test('learning steps are clamped to the five-step journey', () => {
  assert.equal(learnStep('3'), 3);
  assert.equal(learnStep('-2'), 1);
  assert.equal(learnStep('99'), 5);
});

test('quiz feedback is a focusable status surface', () => {
  assert.match(quizFeedbackMarkup({ ok: true, note: '说明' }), /role="status"/);
  assert.match(quizFeedbackMarkup({ ok: false, note: '说明' }), /再想一想/);
});
