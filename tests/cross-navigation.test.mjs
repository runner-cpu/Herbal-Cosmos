import test from 'node:test';
import assert from 'node:assert/strict';
import { formulaHref, zhengHref, learnStep, normalizeLegacyRoute, quizFeedbackMarkup } from '../assets/js/pages/cross-navigation.js';

test('formula and pattern links preserve the navigation context', () => {
  assert.equal(formulaHref('guizhitang', { source: 'zheng', zhengId: 'feng-han' }), '#/formula?f=guizhitang&from=zheng&z=feng-han');
  assert.equal(zhengHref('feng-han', 'guizhitang'), '#/formula?view=zheng&z=feng-han&f=guizhitang');
});

test('learning stays independent while the legacy pattern route joins formula', () => {
  assert.deepEqual(normalizeLegacyRoute('learn', { step: '3' }), { route: 'learn', params: { step: '3' } });
  assert.deepEqual(normalizeLegacyRoute('zheng', { z: 'feng-han', f: 'guizhitang' }), { route: 'formula', params: { z: 'feng-han', f: 'guizhitang', view: 'zheng' } });
  assert.deepEqual(normalizeLegacyRoute('herbs', { q: '甘草' }), { route: 'herbs', params: { q: '甘草' } });
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
