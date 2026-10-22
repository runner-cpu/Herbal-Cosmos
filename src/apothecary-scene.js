import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { buildGardenEnvelope } from './apothecary-garden.js';
import { buildBambooGroves } from './apothecary-bamboo.js';
import { buildLandscape } from './apothecary-landscape.js';

// Static scenery is merged by material; only the drawers need individual transforms.
export function buildCourtyard({ scene, materials: m, geometries, shadows, compact }) {
  const batches = new Map();
  const transform = new THREE.Object3D();
  const add = (geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) => {
    transform.position.set(...position);
    transform.rotation.set(...rotation);
    transform.scale.set(...scale);
    transform.updateMatrix();
    geometry.applyMatrix4(transform.matrix);
    if (material.vertexColors && !geometry.attributes.color) {
      const tone = .75 + random() * .36;
      const count = geometry.attributes.position.count;
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) colors.set([tone, tone * (.96 + random() * .04), tone * .92], i * 3);
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
    const key = material;
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key).push(geometry);
  };
  const box = (size, material, position, rotation) => add(new THREE.BoxGeometry(...size), material, position, rotation);
  const wornBox = (size, material, position, rotation, bevel = .03) => add(new RoundedBoxGeometry(...size, 1, bevel), material, position, rotation);
  const ball = (radius, material, position, scale = [1, 1, 1]) => add(new THREE.IcosahedronGeometry(radius, 1), material, position, [0, 0, 0], scale);
  const stem = (a, b, radius, material, taper = .7) => {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const direction = end.clone().sub(start);
    const geometry = new THREE.CylinderGeometry(radius * taper, radius, direction.length(), radius > .1 ? 12 : 6);
    geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()));
    add(geometry, material, start.add(end).multiplyScalar(.5).toArray());
  };
  const curve = (points, radius, material) => add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), compact ? 10 : 16, radius, 5, false), material);
  let seed = 209;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const leaf = (position, rotation, scale, material = m.treeLeaf) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, -.37, .05, .42, 0, .13, .48, .37, .05, .42, 0, 0, 1], 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute([.5, 0, 0, .42, .5, .48, 1, .42, .5, 1], 2));
    geo.setIndex([0, 1, 2, 0, 2, 3, 1, 4, 2, 2, 4, 3]);
    geo.computeVertexNormals();
    add(geo, material, position, rotation, scale);
  };
  const blossom = (p, material, radius) => {
    for (let j = 0; j < 5; j++) {
      const a = j * Math.PI * .4;
      leaf(p, [Math.PI * .18, a, .1], [radius * 1.7, radius, radius], material);
    }
  };

  box([24, .10, 21], m.gravel, [0, 0, 2]);
  box([19.5, .45, 13.4], m.stone, [0, .23, 0]);
  box([18.8, .18, 12.8], m.floor, [0, .54, 0]);
  for (let i = 0; i < 3; i++) wornBox([6.4 + i * .65, .17, .65], m.stone, [0, .42 - i * .16, 6.8 + i * .6]);
  for (let z = 8.4; z < 23; z += 1.12) {
    for (let x = -1; x <= 1; x++) {
      wornBox([1.0 - random() * .05, .13, .98 - random() * .04], m.stone, [x * 1.08 + (Math.round(z) % 2) * .08, .10 + random() * .025, z], [0, (random() - .5) * .06, 0]);
      if (random() > .6) ball(.13, m.moss, [x * 1.08 + .51, .10, z + .42], [1.8, .06, 1]);
    }
  }
  box([18, 6.0, .3], m.plaster, [0, 3.6, -6.1]);
  box([.3, 6.0, 12], m.plaster, [-8.9, 3.6, 0]);
  box([.3, 6.0, 12], m.plaster, [8.9, 3.6, 0]);
  box([18.3, .65, .45], m.stone, [0, .95, -6.1]);
  for (const side of [-1, 1]) {
    for (let row = 0; row < 4; row++) for (let i = 0; i < 15; i++) wornBox([.36, .18, .78], m.stone, [side * 8.94, .73 + row * .2, -5.7 + i * .79 + (row % 2) * .2], [0, 0, 0], .012);
  }
  for (const x of [-8.6, -6, -3, 3, 6, 8.6]) {
    stem([x, .65, 5.4], [x, 6.15, 5.4], .18, m.redwood, 1);
    add(new THREE.CylinderGeometry(.28, .34, .32, 8), m.stone, [x, .8, 5.4]);
    box([.6, .16, .65], m.wood, [x, 5.77, 5.4]);
    box([.94, .16, .38], m.redwood, [x, 5.95, 5.4]);
    box([.45, .16, 1.05], m.wood, [x, 6.1, 5.4]);
    // Layered bearing blocks and curved braces carry the overhanging eave.
    for (const side of [-1, 1]) {
      curve([[x, 5.35, 5.4], [x + side * .22, 5.50, 5.4], [x + side * .65, 5.9, 5.4]], .06, m.redwood);
      box([.20, .16, .54], m.darkwood, [x + side * .4, 5.83, 5.4]);
    }
    stem([x, 5.85, 4.8], [x, 6.42, 6.6], .09, m.wood, .85);
  }
  for (const z of [-5.5, 0, 5.4]) box([18, .35, .4], m.redwood, [0, 6.24, z]);
  for (const x of [-8.8, 8.8]) box([.3, .35, 12.4], m.wood, [x, 6.2, 0]);
  for (let x = -9.6; x <= 9.6; x += .5) {
    stem([x, 6.4, 5.1], [x, 6.59, 7.1], .055, m.wood, 1);
  }
  // Front lattice bays leave the central doorway and cabinet sightline open.
  for (const side of [-1, 1]) {
    const x = side * 7.3;
    box([2.15, 1.1, .14], m.wood, [x, 1.25, 5.45]);
    for (let i = -3; i <= 3; i++) box([.055, 3.8, .10], m.wood, [x + i * .29, 3.65, 5.45]);
    for (let i = 0; i < 9; i++) box([2.15, .055, .10], m.wood, [x, 1.85 + i * .43, 5.45]);
  }

  const roofHeight = (x, z, halfWidth, halfDepth, base, rise) => {
    const t = Math.abs(z) / halfDepth;
    return base + rise * (1 - t) ** 1.7 + .34 * t ** 8 + .40 * (Math.abs(x) / halfWidth) ** 10;
  };
  const roof = (width, depth, base, rise, centerZ = 0) => {
    const hw = width / 2, hd = depth / 2;
    const geo = new THREE.PlaneGeometry(width, depth, 32, 24);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = -p.getY(i);
      p.setXYZ(i, x, roofHeight(x, z, hw, hd, base, rise), z + centerZ);
    }
    geo.computeVertexNormals();
    add(geo, m.tile);
    // Individual overlapping half-round tiles, not painted lines over a flat plane.
    const tileWidth = .36, tileLength = .50;
    for (let x = -hw + tileWidth / 2; x < hw; x += tileWidth) for (const sign of [-1, 1]) {
    for (let z = .04; z < hd; z += compact ? .65 : .43) {
        const geo = new THREE.PlaneGeometry(tileWidth - .012, tileLength, 6, 1);
        const p = geo.attributes.position;
        const raise = .035 + random() * .018;
        for (let i = 0; i < p.count; i++) {
          const dx = p.getX(i), along = p.getY(i) + tileLength / 2;
          const zz = sign * Math.min(hd + .06, z + along);
          const arc = Math.sqrt(Math.max(0, 1 - (dx / (tileWidth / 2)) ** 2)) * .075;
          p.setXYZ(i, x + dx, roofHeight(x + dx, Math.min(Math.abs(zz), hd), hw, hd, base, rise) + arc + raise + along * .034, zz + centerZ);
        }
        geo.computeVertexNormals();
        add(geo, m.tile);
      }
    }
    for (const sign of [-1, 1]) {
      const edge = Array.from({ length: 12 }, (_, i) => {
        const x = -hw + width * i / 11;
        return [x, roofHeight(x, hd, hw, hd, base, rise) - .08, sign * hd + centerZ];
      });
      curve(edge, .13, m.wood);
      for (let x = -hw + .18; x < hw; x += .36) {
        const y = roofHeight(x, hd, hw, hd, base, rise);
        add(new THREE.CylinderGeometry(.10, .10, .09, 14), m.tileRib, [x, y, sign * (hd + .09) + centerZ], [Math.PI / 2, 0, 0]);
        add(new THREE.TorusGeometry(.067, .012, 4, 12), m.tile, [x, y, sign * (hd + .14) + centerZ]);
      }
    }
    for (const side of [-1, 1]) {
      const outline = Array.from({length: 25}, (_, i) => {
        const z = -hd + i / 24 * depth;
        return [side * hw, roofHeight(hw, z, hw, hd, base, rise) - .09, z + centerZ];
      });
      curve(outline, .15, m.tileRib);
    }
    curve([[-hw, base + rise + .8, centerZ], [-hw + 1, base + rise + .15, centerZ], [0, base + rise + .12, centerZ], [hw - 1, base + rise + .15, centerZ], [hw, base + rise + .8, centerZ]], .16, m.tileRib);
  };
  roof(20.4, 14.4, 6.35, 2.5);
  // The sign sits BELOW, not behind, the front eave.
  box([5.6, 1.55, .2], m.wood, [0, 5.25, 5.95]);
  add(new THREE.PlaneGeometry(5.4, 1.45), m.sign, [0, 5.25, 6.065]);
  for (const x of [-2.35, 2.35]) {
    add(new THREE.TorusGeometry(.12, .022, 5, 12), m.brass, [x, 4.36, 6.08]);
    stem([x, 4.24, 6.08], [x, 3.86, 6.08], .042, m.lantern, .55);
  }

  const lanternPositions = [[-4.5, 4.7, 5.7], [4.5, 4.7, 5.7], [-2.7, 3.3, 18], [2.7, 3.3, 18]];
  lanternPositions.forEach(([x, y, z]) => {
    stem([x, y + .4, z], [x, y + 1.2, z], .015, m.wood, 1);
    add(new THREE.SphereGeometry(.36, 12, 8), m.lantern, [x, y, z], [0, 0, 0], [1, 1.3, 1]);
    for (const dy of [-.42, .42]) add(new THREE.CylinderGeometry(.23, .23, .10, 10), m.brass, [x, y + dy, z]);
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      curve([[x + Math.cos(a) * .19, y + .4, z + Math.sin(a) * .19], [x + Math.cos(a) * .37, y, z + Math.sin(a) * .37], [x + Math.cos(a) * .19, y - .4, z + Math.sin(a) * .19]], .012, m.redwood);
    }
    stem([x, y - .5, z], [x, y - .92, z], .032, m.lantern, .4);
  });

  // Three framed cabinet bays, each forty drawers; larger lower cupboards and open shelves.
  for (const x of [-4.7, 0, 4.7]) {
    box([4.55, 5.9, .85], m.darkwood, [x, 3.45, -2.18]);
    for (const dx of [-2.23, 2.23]) box([.13, 6.0, 1.0], m.wood, [x + dx, 3.45, -2.05]);
    wornBox([4.7, .2, 1.1], m.wood, [x, 6.48, -2.05]);
    wornBox([4.78, .10, 1.14], m.redwood, [x, 6.58, -2.05]);
    for (let row = 0; row <= 10; row++) box([4.4, .035, .15], m.wood, [x, 1.1 + row * .46, -1.65]);
    for (let col = 1; col < 4; col++) box([.035, 4.65, .15], m.wood, [x - 2.12 + col * 1.06, 3.42, -1.65]);
    for (const dx of [-1.1, 1.1]) {
      box([2.05, .50, .14], m.redwood, [x + dx, .82, -1.68]);
      add(new THREE.TorusGeometry(.08, .017, 5, 12), m.brass, [x + dx, .82, -1.57]);
    }
    wornBox([4.45, .13, 1.05], m.wood, [x, 5.86, -2.0]);
  }
  const jar = (x, y, z, s = 1) => {
    const points = [[.14, 0], [.25, .05], [.30, .25], [.25, .45], [.16, .52], [.18, .57]].map(([r, h]) => new THREE.Vector2(r * s, h * s));
    const curve = new THREE.SplineCurve(points);
    add(new THREE.LatheGeometry(curve.getPoints(compact ? 16 : 28), compact ? 16 : 24), m.ceramic, [x, y, z]);
    add(new THREE.CylinderGeometry(.19 * s, .19 * s, .06 * s, 12), m.ceramic, [x, y + .59 * s, z]);
    for (const h of [.13, .38]) add(new THREE.TorusGeometry(.276 * s, .018 * s, 4, 16), m.blue, [x, y + h * s, z], [Math.PI / 2, 0, 0]);
  };
  for (let x = -6; x <= 6; x += 1.5) jar(x, 5.93, -1.9, .65);
  box([7.1, 1.0, 1.4], m.darkwood, [0, 1.1, 2.8]);
  wornBox([7.4, .12, 1.65], m.wood, [0, 1.66, 2.8]);
  for (const x of [-2.3, 0, 2.3]) {
    box([2.1, .65, .05], m.redwood, [x, 1.12, 3.53]);
    box([1.92, .50, .04], m.wood, [x, 1.12, 3.57]);
  }
  jar(-2.5, 1.73, 2.8);
  jar(-1.65, 1.73, 2.8, .8);
  stem([.2, 1.74, 2.8], [.2, 2.48, 2.8], .025, m.brass, 1);
  stem([-.45, 2.43, 2.8], [.85, 2.43, 2.8], .025, m.brass, 1);
  for (const x of [-.43, .83]) {
    stem([x, 2.43, 2.8], [x, 2.05, 2.8], .008, m.brass, 1);
    add(new THREE.CylinderGeometry(.19, .12, .06, 12), m.brass, [x, 2.03, 2.8]);
  }
  add(new THREE.CylinderGeometry(.5, .42, .10, 18), m.bamboo, [2.3, 1.78, 2.8]);
  for (let i = 0; i < 24; i++) ball(.065, m.herb, [2.3 + (random() - .5) * .7, 1.88, 2.8 + (random() - .5) * .6], [1, .3, 1.8]);

  const fence = (ax, az, bx, bz) => {
    const length = Math.hypot(bx - ax, bz - az);
    for (const y of [.6, 1.2]) stem([ax, y, az], [bx, y, bz], .05, m.bamboo, 1);
    const n = Math.ceil(length / .7);
    for (let i = 0; i <= n; i++) {
      const x = ax + (bx - ax) * i / n, z = az + (bz - az) * i / n;
      stem([x, .05, z], [x + (random() - .5) * .12, 1.55 + .12 * Math.sin(i), z + (random() - .5) * .09], .055, m.bamboo, .8);
      for (const y of [.6, 1.2]) add(new THREE.TorusGeometry(.065, .014, 4, 8), m.bark, [x, y, z], [Math.PI / 2, 0, 0]);
    }
  };
  fence(-16, -9, 16, -9);
  fence(-16, -9, -16, 18);
  fence(16, -9, 16, 18);
  fence(-16, 18, -3, 18);
  fence(3, 18, 16, 18);
  for (const x of [-2.7, 2.7]) {
    stem([x, .1, 18], [x, 4.6, 18], .15, m.wood, 1);
    box([.55, .4, .55], m.stone, [x, .22, 18]);
  }
  box([6.1, .3, .45], m.redwood, [0, 4.4, 18]);
  roof(6.6, 2.3, 4.6, .65, 18);

  for (const x of [-5.2, 5.2]) for (const z of [9.3, 13.7]) {
    box([4.3, .18, 3.4], m.soil, [x, .15, z]);
    for (const dx of [-2.2, 2.2]) box([.18, .28, 3.65], m.stone, [x + dx, .17, z]);
    for (const dz of [-1.78, 1.78]) box([4.5, .28, .18], m.stone, [x, .17, z + dz]);
    const count = compact ? 18 : 32;
    for (let i = 0; i < count; i++) {
      const px = x + (random() - .5) * 3.8, pz = z + (random() - .5) * 2.9;
      const h = .35 + random() * .5;
      stem([px, .2, pz], [px, .2 + h, pz], .018, m.leaf, .4);
      for (let j = 0; j < 4; j++) {
        const a = j * Math.PI * .7 + i;
        leaf([px, .3 + h * j / 5, pz], [-.4, a, .4], [.20, .20, .35], i % 3 ? m.herb : m.leaf);
      }
      if (i % 6 === 0) blossom([px, .23 + h, pz], m.flower, .07);
    }
  }

  const tree = (x, z, h, flower, shrub = false) => {
    curve([[x, 0, z], [x - .16, h * .24, z + .12], [x + .12, h * .48, z], [x + .33, h * .75, z + .1]], shrub ? .12 : .21, m.bark);
    for (let r = 0; r < 5; r++) {
      const a = r * 1.26;
      stem([x, .35, z], [x + Math.cos(a) * .7, .02, z + Math.sin(a) * .7], .10, m.bark, .2);
    }
    for (let i = 0; i < (compact ? 7 : 9); i++) {
      const a = i * 2.4, reach = shrub ? .85 : 1.3 + random() * 1.25;
      const tip = [x + Math.cos(a) * reach, h * (.60 + random() * .3), z + Math.sin(a) * reach];
      const base = [x + .1, h * (.35 + i * .025), z];
      const mid = [(base[0] + tip[0]) / 2, tip[1] - .5, (base[2] + tip[2]) / 2];
      curve([base, mid, tip], shrub ? .035 : .065, m.bark);
      for (let j = 0; j < (compact ? 6 : 9); j++) {
        const center = [tip[0] + (random() - .5) * 1.75, tip[1] + (random() - .4) * 1.3, tip[2] + (random() - .5) * 1.75];
        stem(tip, center, .018, m.bark, .15);
        for (let l = 0; l < (compact ? 16 : 26); l++) {
          const p = [center[0] + (random() - .5) * .8, center[1] + (random() - .5) * .6, center[2] + (random() - .5) * .8];
          leaf(p, [random() * 1.2 - .6, random() * 6.28, random() * 1.4 - .7], [shrub ? .25 : .16, .18, shrub ? .34 : .32], l % 3 ? m.treeLeaf : m.leaf);
        }
        for (let b = 0; b < (shrub || compact ? 2 : 4); b++) blossom([center[0] + (random() - .5) * .65, center[1] + .25, center[2] + (random() - .5) * .65], flower, shrub ? .09 : .065);
      }
    }
  };
  tree(-10, 11.3, 5.3, m.pink);
  tree(10.7, 12.8, 5.8, m.pink);
  tree(12, -5.5, 5.4, m.flower);
  tree(-11.4, -4.5, 2.8, m.flower, true);
  buildGardenEnvelope({ add, box, stem, curve, leaf, random, m, compact });
  for (let i = 0; i < 26; i++) {
    const side = i % 2 ? -1 : 1;
    ball(.3 + random() * .6, m.stone, [side * (10 + random() * 5), .18, -6 + random() * 22], [1.3, .6, 1]);
  }
  buildLandscape({ add, box, ball, stem, leaf, m, compact });
  const bambooCounts = buildBambooGroves({ add, stem, m, compact });

  const group = new THREE.Group();
  group.name = 'apothecary-courtyard';
  group.userData.bamboo = bambooCounts;
  group.userData.mountainLayers = 3;
  for (const [material, pieces] of batches) {
    // Primitive classes differ in indexing, so normalize before merging.
    const normalized = pieces.map(g => g.index ? g.toNonIndexed() : g);
    const geometry = mergeGeometries(normalized, false);
    for (const g of new Set([...pieces, ...normalized])) g.dispose();
    if (!geometry) throw new Error('Courtyard geometry merge failed');
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = material.name || 'courtyard-batch';
    mesh.castShadow = shadows && ![m.ground, m.gravel, ...m.mountains].includes(material);
    mesh.receiveShadow = shadows;
    group.add(mesh);
  }
  scene.add(group);
  return group;
}
