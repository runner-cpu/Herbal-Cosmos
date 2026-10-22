import * as THREE from 'three';

export function seededRandom(initial = 209) {
  let seed = initial;
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}

const smooth = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
const hash = (x, y) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};
export function landscapeNoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y), tx = smooth(x - ix), ty = smooth(y - iy);
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(hash(ix, iy), hash(ix + 1, iy), tx),
    THREE.MathUtils.lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), tx), ty,
  );
}

// Keep the inhabited court level. Outside the red walls it blends into rolling
// foothills, with a shallow walking valley continuing from the entrance.
export function terrainHeight(x, z) {
  const outside = Math.max(Math.abs(x) - 27, -z - 24, z - 33, 0);
  const blend = smooth(outside / 18);
  const hills = 1.3 + 5.5 * landscapeNoise(x * .035, z * .035) + 2.4 * landscapeNoise(x * .085 + 9, z * .085);
  const pathX = Math.sin((z - 23) * .045) * 6;
  const valley = z > 23 ? .72 * Math.exp(-(((x - pathX) / 9) ** 2)) : 0;
  return -.045 + blend * hills * (1 - valley);
}

export function makeTerrainGeometry(compact = false) {
  const geometry = new THREE.PlaneGeometry(480, 480, compact ? 80 : 120, compact ? 80 : 120);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = -p.getY(i);
    p.setXYZ(i, x, terrainHeight(x, z), z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function makeMountainGeometry(layer, compact = false) {
  const width = 420 + layer * 65, depth = 95 + layer * 15;
  const geometry = new THREE.PlaneGeometry(width, depth, compact ? 100 : 180, compact ? 18 : 40);
  const p = geometry.attributes.position;
  const summits = [
    [[-150, 56, 30], [-90, 42, 28], [-25, 64, 27], [47, 47, 28], [115, 68, 28], [173, 43, 30]],
    [[-183, 66, 34], [-116, 88, 36], [-40, 54, 28], [31, 87, 34], [106, 63, 28], [180, 80, 38]],
    [[-220, 80, 44], [-139, 66, 30], [-62, 98, 40], [24, 72, 32], [97, 108, 39], [200, 94, 46]],
  ][layer];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), t = (p.getY(i) + depth / 2) / depth;
    let profile = 4;
    for (const [center, height, spread] of summits) profile += height * Math.exp(-(((x - center) / spread) ** 2));
    const ridgeT = .43 + .12 * Math.sin(x * .043 + layer * 3) + .05 * Math.sin(x * .11);
    const cross = Math.max(0, 1 - Math.abs(t - ridgeT) / (t < ridgeT ? ridgeT : 1 - ridgeT));
    const grain = landscapeNoise(x * .10 + layer * 13, t * 13) - .5;
    const fine = landscapeNoise(x * .38, t * 36) - .5;
    const ribs = .13 * Math.sin(x * .18 + t * 7) + .07 * Math.cos(x * .4 - t * 12);
    const y = -1 + Math.pow(cross, 1.15) * profile * (.64 + layer * .04) * (1 + grain * .32 + fine * .12 + ribs);
    p.setXYZ(i, x, y, -72 - layer * 92 - t * depth);
  }
  geometry.computeVertexNormals();
  const normal = geometry.attributes.normal;
  const colors = new Float32Array(p.count * 3);
  const rock = new THREE.Color(['#65736c', '#72858a', '#93a2ab'][layer]);
  const forest = new THREE.Color(['#35564c', '#5c797b', '#859aa4'][layer]);
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const n = landscapeNoise(p.getX(i) * .16, p.getZ(i) * .14);
    const slope = 1 - Math.abs(normal.getY(i));
    c.copy(forest).lerp(rock, smooth(slope * 1.8 + n * .55)).multiplyScalar(.80 + n * .28);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

export function buildLandscape({ add, box, ball, stem, leaf, m, compact }) {
  const random = seededRandom(429);
  add(makeTerrainGeometry(compact), m.ground);
  for (let layer = 2; layer >= 0; layer--) add(makeMountainGeometry(layer, compact), m.mountains[layer]);
  // The approach continues beyond the gate and curves out of view, rather than ending at a plinth.
  for (let z = 23; z < 82; z += 1.08) {
    const x = Math.sin((z - 23) * .045) * 6;
    for (let side = -1; side <= 1; side++) {
      const px = x + side * 1.02;
      box([.97, .09, 1.02], m.stone, [px, terrainHeight(px, z) + .08, z], [0, Math.cos(z * .045) * .26, 0]);
    }
  }
  for (let i = 0; i < (compact ? 55 : 90); i++) {
    const x = (i % 2 ? -1 : 1) * (29 + random() * 38), z = -40 + random() * 110;
    const y = terrainHeight(x, z), size = .45 + random() * 1.6;
    ball(size, m.stone, [x, y + size * .28, z], [1.4, .55, 1]);
    if (i % 3) {
      for (let j = 0; j < 4; j++) leaf([x, y + .05, z], [-.6, j * 1.57, .3], [.4, .4, 1.0], m.herb);
    }
  }
  // Layered irregular crowns, not cone primitives, cover the foothill/mountain join.
  for (let i = 0; i < (compact ? 40 : 70); i++) {
    const x = -85 + random() * 170, z = -36 - random() * 28;
    const y = terrainHeight(x, z), h = 4 + random() * 8;
    stem([x, y, z], [x, y + h, z], .10, m.bark, .25);
    for (let j = 0; j < (compact ? 16 : 25); j++) {
      const a = j * 2.39996, r = .7 + random() * 2;
      add(new THREE.PlaneGeometry(3.5, 3.2), m.canopy,
        [x + Math.cos(a) * r, y + h * (.65 + random() * .25), z + Math.sin(a) * r],
        [(random() - .5) * 1.7, a, random() - .5]);
    }
  }
}
