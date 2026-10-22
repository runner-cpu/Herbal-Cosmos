import * as THREE from 'three';
import { seededRandom, terrainHeight } from './apothecary-landscape.js';

export function bambooPoint(x, z, h, leanX, leanZ, t, base = 0) {
  return new THREE.Vector3(x + leanX * t * t, base + h * t, z + leanZ * t * t);
}

export function buildBambooGroves({ add, stem, m, compact }) {
  const random = seededRandom(1977);
  const leafSpray = (tip, angle, size) => {
    // Two crossing leaf sprays read as slender, alternating bamboo leaves at oblique angles.
    for (let side = 0; side < 2; side++) {
      add(new THREE.PlaneGeometry(size * 1.6, size), m.bambooCrown, tip.toArray(), [-.15 + side * .7, angle + side * 1.2, .18]);
    }
  };
  const culm = (x, z, h, azimuth, lean) => {
    const base = terrainHeight(x, z) + .04;
    const lx = Math.cos(azimuth) * lean, lz = Math.sin(azimuth) * lean;
    const points = Array.from({ length: 12 }, (_, i) => bambooPoint(x, z, h, lx, lz, i / 11, base));
    const path = new THREE.CatmullRomCurve3(points);
    const radius = .045 + random() * .025;
    const geometry = new THREE.TubeGeometry(path, 18, radius, 7, false);
    const p = geometry.attributes.position;
    // Taper the actual curved culm; the old straight poles and detached node rings are gone.
    for (let i = 0; i < p.count; i++) {
      const t = Math.floor(i / 8) / 18, c = path.getPointAt(t);
      const v = new THREE.Vector3().fromBufferAttribute(p, i).sub(c).multiplyScalar(1 - t * .62).add(c);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    geometry.computeVertexNormals(); add(geometry, m.bambooGreen);
    const segments = Math.round(h / .42);
    for (let j = 1; j < segments; j++) {
      const t = j / segments, c = path.getPointAt(t), tangent = path.getTangentAt(t);
      const node = new THREE.TorusGeometry(radius * (1 - t * .62) + .008, .009, compact ? 3 : 4, compact ? 5 : 8);
      node.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent));
      add(node, m.bambooNode, c.toArray());
      if (t < .32 || j % (compact ? 3 : 2)) continue;
      const angle = azimuth + j * 2.4;
      const reach = (Math.sin(t * Math.PI) * 1.2 + .35) * (.8 + random() * .45);
      for (const side of [-1, 1]) {
        const a = angle + side * .48;
        const tip = c.clone().add(new THREE.Vector3(Math.cos(a) * reach, .18 - t * .1, Math.sin(a) * reach));
        const mid = c.clone().lerp(tip, .6); mid.y += .14;
        stem(c.toArray(), mid.toArray(), .018, m.bambooGreen, .5);
        stem(mid.toArray(), tip.toArray(), .009, m.bambooGreen, .15);
        leafSpray(tip, -a, .85 + random() * .4);
      }
    }
    leafSpray(path.getPointAt(.98), azimuth, .85);
  };
  // Uneven clumps with gaps, not a fence of parallel green rods.
  const clumps = [[-17,9,6.3],[-16,14,7],[-20,-8,7.8],[18,8,7.0],[18,15,7.6],[21,-12,8],[-24,3,8.5],[25,0,8.4],[-15,-20,7.5],[14,-21,7.8]];
  clumps.forEach(([x, z, height]) => {
    const count = compact ? 5 : 8;
    for (let i = 0; i < count; i++) {
      const a = i * 2.39996 + random() * .3, radius = .2 + Math.sqrt(random()) * 1.3;
      culm(x + Math.cos(a) * radius, z + Math.sin(a) * radius, height * (.72 + random() * .36), a, .4 + random() * 1.2);
    }
  });
  return { clumps: clumps.length, culms: clumps.length * (compact ? 5 : 8) };
}
