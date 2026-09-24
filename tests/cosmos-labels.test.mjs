import test from 'node:test';
import assert from 'node:assert/strict';
import { selectVisibleLabels, colorForEffect, motionEnabled } from '../assets/js/pages/cosmos.js';

function stars() {
  return Array.from({ length: 40 }, (_, index) => ({
    id: index < 2 ? 'gancao' : 'herb-' + index,
    herb: { id: index < 2 ? 'gancao' : 'herb-' + index, name: index < 2 ? '甘草' : '药材' + index, food: index % 5 === 0, cat: index % 2 ? '清热药' : '补虚药' },
    screenX: index * 20,
    screenY: index * 8,
    favorite: index === 3,
    viewed: index === 4
  }));
}

test('default label selection deduplicates and stays sparse', () => {
  const labels = selectVisibleLabels(stars(), { width: 1280, height: 720 }, 1, { selectedHerb: null, viewedHerbs: new Set() });
  assert.ok(labels.length <= 18);
  assert.equal(new Set(labels.map(item => item.herb.id)).size, labels.length);
});

test('selected and viewed stars outrank ordinary labels', () => {
  const labels = selectVisibleLabels(stars(), { width: 320, height: 240 }, 1, { selectedHerb: 'herb-10', viewedHerbs: new Set(['herb-10']) });
  assert.ok(labels.some(item => item.herb.id === 'herb-10'));
});

test('effect colors are deterministic and motion preference is explicit', () => {
  assert.notEqual(colorForEffect('清热药'), colorForEffect('补虚药'));
  assert.equal(motionEnabled({ reducedMotion: true, preference: true }), false);
  assert.equal(motionEnabled({ reducedMotion: false, preference: false }), false);
});
