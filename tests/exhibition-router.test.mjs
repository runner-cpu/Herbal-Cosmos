import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function router() {
  const sandbox = { window: {}, URLSearchParams };
  vm.runInNewContext(fs.readFileSync(new URL('../assets/js/core/exhibition-router.js', import.meta.url), 'utf8'), sandbox);
  return sandbox.window.HerbalExhibitionRouter.resolve;
}

test('V7 main and legacy routes select an existing workspace and navigation owner', () => {
  const resolve = router();
  assert.equal(resolve('').route, 'home');
  assert.equal(resolve('#/intro').route, 'home');
  assert.equal(resolve('#/exhibit?chapter=compose').params.chapter, 'compose');
  assert.equal(resolve('#/qiwei?cat=补虚药').section, 'herbs');
  assert.equal(resolve('#/qiwei?cat=补虚药').params.cat, '补虚药');
  assert.equal(resolve('#/herbs?section=formulas').route, 'formula');
  assert.equal(resolve('#/herbs?section=culture').route, 'heritage');
  assert.equal(resolve('#/herbs?section=classics').route, 'intro');
  assert.equal(resolve('#/herbs?view=attributes').route, 'qiwei');
  assert.equal(resolve('#/intro?anchor=intro-timeline').section, 'herbs');
  assert.equal(resolve('#/intro?anchor=intro-timeline').route, 'intro');
  assert.equal(resolve('#/heritage?anchor=heritage-classics').params.anchor, 'intro-timeline');
  assert.equal(resolve('#/home-sources').params.anchor, 'home-sources');
  assert.equal(resolve('#/home-sources').route, 'herbs');
  assert.equal(resolve('#/home?anchor=home-collection').route, 'herbs');
  assert.equal(resolve('#/zheng?z=feng-han&f=guizhitang').params.view, 'zheng');
  assert.equal(resolve('#/zheng?z=feng-han&f=guizhitang').params.f, 'guizhitang');
  assert.equal(resolve('#/home-food').params.anchor, 'heritage-food');
  assert.equal(resolve('#/herb?id=gancao').section, 'herbs');
  assert.equal(resolve('#/learn').section, 'learn');
});

test('unknown and malformed hash inputs remain recoverable and preserve query text safely', () => {
  const resolve = router();
  assert.equal(resolve('#/home-not-a-real-section').route, 'not-found');
  assert.equal(resolve('#/no-such-route?x=%3Cscript%3E').unknownPath, 'no-such-route');
  assert.equal(resolve('#/no-such-route?x=%3Cscript%3E').params.x, '<script>');
  assert.equal(resolve('#/home?focus=%E0%A4%A').route, 'home');
});
