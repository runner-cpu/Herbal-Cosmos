import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { terrainHeight, makeTerrainGeometry, makeMountainGeometry } from '../src/apothecary-landscape.js';
import { bambooPoint, buildBambooGroves } from '../src/apothecary-bamboo.js';

test('inhabited courtyard stays level while surrounding terrain rises', () => {
  for (const [x, z] of [[0, 0], [-22, 12], [22, -15], [0, 30]]) assert.equal(terrainHeight(x, z), -.045);
  assert.ok(terrainHeight(55, 0) > 1);
  assert.ok(terrainHeight(0, -55) > 1);
  const geometry = makeTerrainGeometry();
  for (const n of geometry.attributes.position.array) assert.ok(Number.isFinite(n));
  geometry.computeBoundingBox();
  assert.ok(geometry.boundingBox.max.y - geometry.boundingBox.min.y > 4);
  geometry.dispose();
});

test('three mountain layers are volumetric terrain strips with distinct depth and ridges', () => {
  const ranges = [];
  for (let layer = 0; layer < 3; layer++) {
    const geometry = makeMountainGeometry(layer);
    geometry.computeBoundingBox();
    assert.ok(geometry.boundingBox.max.y > 35);
    assert.ok(geometry.boundingBox.max.z - geometry.boundingBox.min.z > 80);
    assert.ok(geometry.attributes.color);
    for (const n of geometry.attributes.normal.array) assert.ok(Number.isFinite(n));
    ranges.push(geometry.boundingBox.max.z);
    const mobile = makeMountainGeometry(layer, true);
    assert.ok(mobile.attributes.position.count < geometry.attributes.position.count);
    mobile.dispose(); geometry.dispose();
  }
  assert.ok(ranges[0] > ranges[1] && ranges[1] > ranges[2]);
});

test('bamboo uses bent culms, aligned nodes and separate leaf sprays in uneven clumps', () => {
  assert.deepEqual(bambooPoint(1, 2, 8, 1.2, .7, 0).toArray(), [1, 0, 2]);
  assert.ok(bambooPoint(1, 2, 8, 1.2, .7, .5).x < 1.6);
  const m = { bambooGreen: 'culm', bambooNode: 'node', bambooCrown: 'leaves' };
  for (const compact of [false, true]) {
    const counts = { culm: 0, node: 0, leaves: 0 };
    const result = buildBambooGroves({ compact, m, stem() {}, add(geometry, material) {
      counts[material]++;
      assert.ok(geometry instanceof THREE.BufferGeometry);
      for (const n of geometry.attributes.position.array) assert.ok(Number.isFinite(n));
      geometry.dispose();
    }});
    assert.equal(result.clumps, 10);
    assert.equal(result.culms, compact ? 50 : 80);
    assert.equal(counts.culm, result.culms);
    assert.ok(counts.node > counts.culm * 8);
    assert.ok(counts.leaves > counts.culm * 6);
  }
});
