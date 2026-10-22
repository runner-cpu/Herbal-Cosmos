import test from 'node:test';
import assert from 'node:assert/strict';
import { fitSphereDistance, projectedSphereRadius } from '../src/planet-framing.js';
import { detailMarkup } from '../src/planet.js';

test('default 3D framing fits the entire particle shell in wide and portrait canvases', () => {
  for (const [width, height] of [[1800, 820], [970, 600], [950, 468], [800, 420], [338, 371], [290, 320]]) {
    const distance = fitSphereDistance(6730, width / height);
    const radius = projectedSphereRadius(6730, distance, height);
    assert.ok(radius <= Math.min(width, height) * .39 + .001, `${width}x${height}: clipped shell`);
    assert.ok(radius >= Math.min(width, height) * .38, `${width}x${height}: globe is unnecessarily small`);
    const zoomed = projectedSphereRadius(6730, distance * .8, height);
    assert.ok(zoomed > radius, 'intentional zoom should still magnify');
  }
});

test('framing rejects invalid dimensions rather than positioning the camera at NaN', () => {
  for (const args of [[0, 1], [6730, 0], [6730, NaN], [6730, 1, 180], [6730, 1, 36, 0]]) {
    assert.throws(() => fitSphereDistance(...args), RangeError);
  }
});

test('a photographed herb has one compact identity area and retains full reading boundaries', () => {
  const item = {
    id: 'test-herb', nameZh: '人参', scientificName: 'Panax ginseng', habitatLabel: '山林根境',
    partUsed: '干燥根和根茎', depthLevel: 'deep', identitySummary: '身份说明',
    boundary: '完整阅读边界不会截断', image: { status: 'ready', path: '/sample.jpg', creator: 'Sample' },
  };
  const html = detailMarkup(item, true);
  assert.match(html, /planet-detail-identity/);
  assert.match(html, /planet-detail-image/);
  assert.doesNotMatch(html, /class="planet-detail-orb"/);
  assert.match(html, /完整阅读边界不会截断/);
  assert.match(html, /data-planet-atlas="test-herb"/);
  assert.match(html, /data-planet-trace="test-herb"/);
  assert.ok(html.indexOf('planet-detail-actions') < html.indexOf('planet-detail-boundary'));
});
