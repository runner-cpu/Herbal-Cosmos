import * as THREE from 'three';

// An inhabited garden, not a building on a bare display platform. Inspired by the
// spatial layering in Du Fu Cottage photographs; this is not a reconstruction.
export function buildGardenEnvelope({ add, box, stem, curve, leaf, random, m, compact }) {
  const plane = (w, h, material, position, rotation) => add(new THREE.PlaneGeometry(w, h), material, position, rotation);
  const capWall = (x, z, length, alongZ = false) => {
    box(alongZ ? [.32, 2.65, length] : [length, 2.65, .32], m.ochreWall, [x, 1.33, z]);
    box(alongZ ? [.40, .38, length] : [length, .38, .40], m.stone, [x, .2, z]);
    for (const sign of [-1, 1]) {
      box(alongZ ? [.43, .09, length + .2] : [length + .2, .09, .43], m.tileRib,
        [x + (alongZ ? sign * .17 : 0), 2.74, z + (alongZ ? 0 : sign * .17)], alongZ ? [0, 0, sign * -.28] : [sign * .28, 0, 0]);
    }
    for (let d = -length / 2; d < length / 2; d += .22) {
      const p = [x + (alongZ ? 0 : d), 2.79, z + (alongZ ? d : 0)];
      add(new THREE.CylinderGeometry(.075, .075, .80, 6, 1, true, 0, Math.PI), m.tileRib, p, alongZ ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0]);
    }
  };
  capWall(0, -15, 43);
  capWall(-21.5, 4, 38, true);
  capWall(21.5, 3, 36, true);
  capWall(-17.8, 13, 16, true);
  capWall(-12.5, 21.5, 10);
  capWall(13.5, 22, 11);
  for (let z = 6; z < 22; z += .85) for (let x = -20.5; x < -18.2; x += .82) box([.78, .08, .81], m.stone, [x, .10, z]);

  // Offset side workshop: dark timber, pale infill, deep veranda, modest thatch.
  const cottage = (x, z, width, depth) => {
    box([width, .25, depth], m.stone, [x, .15, z]);
    box([width - .2, 3.5, .18], m.plaster, [x, 1.94, z - depth / 2 + .2]);
    for (const side of [-1, 1]) box([.18, 3.5, depth - .4], m.plaster, [x + side * (width / 2 - .2), 1.94, z]);
    for (let i = -1; i <= 1; i++) {
      const xx = x + i * (width / 2 - .3);
      stem([xx, .2, z + depth / 2 - .5], [xx, 3.9, z + depth / 2 - .5], .12, m.wood, 1);
    }
    box([width, .2, .24], m.wood, [x, 3.6, z + depth / 2 - .45]);
    for (const side of [-1, 1]) {
      const xx = x + side * width * .28;
      box([width * .37, 2.9, .10], m.darkwood, [xx, 1.7, z + depth / 2 - .85]);
      for (let i = 0; i < 5; i++) box([.045, 1.5, .14], m.wood, [xx - .55 + i * .28, 2.15, z + depth / 2 - .76]);
      for (let i = 0; i < 4; i++) box([1.25, .045, .14], m.wood, [xx, 1.6 + i * .35, z + depth / 2 - .75]);
    }
    const roof = new THREE.PlaneGeometry(width + 1.2, depth + 1.5, 20, 16);
    const p = roof.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const xx = p.getX(i), zz = -p.getY(i);
      p.setXYZ(i, x + xx, 3.85 + 1.9 * (1 - Math.abs(zz) / ((depth + 1.5) / 2)) + Math.sin(xx * 2.1) * .035, z + zz);
    }
    roof.computeVertexNormals(); add(roof, m.thatch);
    for (const side of [-1, 1]) for (let row = 0; row < 8; row++) {
      const zz = side * ((depth + 1.5) / 2) * (row + .5) / 8;
      const yy = 3.85 + 1.9 * (1 - Math.abs(zz) / ((depth + 1.5) / 2));
      // Bundled courses give the thatch a broken eave and visible thickness.
      for (let j = 0; j < (compact ? 25 : 44); j++) {
        const xx = x - (width + 1.1) / 2 + j * (width + 1.1) / (compact ? 25 : 44);
        box([.20, .06, .62], m.thatch, [xx, yy + .04 + random() * .035, z + zz], [side * .38, 0, (random() - .5) * .06]);
      }
    }
    for (const side of [-1, 1]) {
      const zz = z + side * (depth + 1.5) / 2;
      box([width + 1.18, .23, .24], m.thatch, [x, 3.77, zz]);
      for (let i = 0; i < (compact ? 50 : 180); i++) {
        const xx = x - width / 2 - .5 + random() * (width + 1);
        stem([xx, 4.04, zz - side * .24], [xx + (random() - .5) * .06, 3.65 + random() * .2, zz + side * .07], .008, m.straw, .7);
      }
    }
    curve([[x - width / 2 - .6, 5.75, z], [x, 5.83, z], [x + width / 2 + .6, 5.75, z]], .18, m.thatch);
    for (let i = 0; i < 5; i++) {
      const xx = x - width / 2 + i * width / 4;
      curve([[xx, 3.9, z - (depth + 1.4) / 2], [xx, 5.83, z], [xx, 3.9, z + (depth + 1.4) / 2]], .022, m.bamboo);
    }
  };
  cottage(-13.1, .4, 6.8, 9.0);
  cottage(13.2, -6, 6.4, 7);

  const canopyTree = (x, z, h, radius) => {
    const bend = (random() - .5) * 1.3;
    const trunk = [[x, 0, z], [x - .15, h * .3, z + .3], [x + bend, h * .58, z], [x + bend + .4, h * .76, z + .5]];
    trunk.slice(1).forEach((end, i) => stem(trunk[i], end, (.31 + h * .012) * (1 - i * .22), m.bark, .76));
    for (let i = 0; i < 5; i++) {
      const a = i * 2.4;
      stem([x, .7, z], [x + Math.cos(a) * 1.2, .06, z + Math.sin(a) * 1.2], .18, m.bark, .1);
    }
    for (let branch = 0; branch < 7; branch++) {
      const a = branch * 2.4;
      const tip = [x + Math.cos(a) * radius * .68, h * (.65 + random() * .25), z + Math.sin(a) * radius * .68];
      stem([x + bend * .5, h * .5, z], tip, .13, m.bark, .25);
    }
    // Cards fill a loose ellipsoid, with gaps; no solid spheres behind the leaves.
    const count = compact ? 100 : 160;
    for (let i = 0; i < count; i++) {
      const angle = i * 2.39996, r = Math.sqrt(random()) * radius;
      const y = h * .79 + (random() - .5) * radius * .8;
      const p = [x + Math.cos(angle) * r, y, z + Math.sin(angle) * r];
      plane(3.0 + random(), 2.6 + random(), m.canopy, p, [(random() - .5) * 2, random() * Math.PI, (random() - .5)]);
    }
  };
  // The background tree belt encloses the courtyard instead of exposing a rectangular base.
  const trees = [[-19,-12,13,4.2],[-11,-17,15,4.7],[-2,-18,16,5],[9,-17,14,4.4],[18,-15,15,4.8],[-25,1,15,4.6],[25,-3,14,4.3],[-22,16,13,4.5],[24,15,15,4.8],[-11,21,12,4.0],[15,23,13,4.1]];
  trees.forEach(p => canopyTree(...p));
  // Shrubs hide the garden platform edge, while keeping the doorway corridor clear.
  for (const side of [-1, 1]) for (let k = 0; k < (compact ? 40 : 70); k++) {
    const x = side * (7.4 + random() * 17), z = 18 + random() * 10;
    for (let i = 0; i < 3; i++) plane(1.6, 1.2, m.understory, [x + (random() - .5) * .6, .4 + random() * .3, z], [0, i * 2.1, 0]);
  }

  for (let i = 0; i < (compact ? 230 : 450); i++) {
    const side = i % 2 ? -1 : 1;
    const x = side * (9 + random() * 19), z = -19 + random() * 47;
    if (Math.abs(x) < 17 && z > -8 && z < 6) continue;
    if (x < -17.5 && x > -21 && z > 5 && z < 23) continue;
    const size = .55 + random() * .9;
    plane(size * 1.6, size, m.understory, [x, .22 + size * .3, z], [-.35, random() * 6.28, 0]);
    if (i % 5 === 0) {
      for (let j = 0; j < 5; j++) leaf([x, .06, z], [-.9 + random() * .4, j * 1.26, .15], [.18, .3, .9], m.herb);
    }
  }
  // Broad-leaved understory at the side workshop, echoing the planted, lived-in reference.
  for (const [x, z] of [[-11,7],[-15,8],[15,4]]) {
    stem([x,0,z], [x,2.4,z], .08, m.bambooGreen, .6);
    for (let j = 0; j < 9; j++) leaf([x,1.3 + random(),z], [-.7, j * 2.4, .2], [.75,.8,1.9], m.leaf);
  }
  // A worn cross-path joins the medicine hall to its side workshop.
  for (let x = -12; x < -1; x += .85) for (const z of [6.8,7.65]) box([.80,.08,.80], m.stone, [x,.08,z]);
}
