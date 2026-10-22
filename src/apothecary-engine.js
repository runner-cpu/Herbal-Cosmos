import * as THREE from 'three';
import { buildCourtyard } from './apothecary-scene.js';
import { loadApothecarySurfaces, surfaceMaps, weatherMaterial, makePatinaTexture, makeCanopyTexture, makeThatchTexture, makeBambooLeafTexture } from './apothecary-materials.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const HABITAT_TINTS = {
  forest: '#a97852',
  meadow: '#79956c',
  flower: '#b58b93',
  fruit: '#c58e50',
  wetland: '#638e92',
  fungus: '#75677d',
};

const VIEW_PRESETS = {
  outside: { target: [0, 5.2, -1], yaw: -.16, pitch: .12, distance: 39 },
  panorama: { target: [0, 8.5, -5], yaw: .22, pitch: .22, distance: 65 },
  bamboo: { target: [18, 3.6, 10], yaw: -.40, pitch: .04, distance: 11.5 },
  hall: { target: [0, 3.0, -1], yaw: 0, pitch: .10, distance: 16 },
  cabinet: { target: [0, 3.35, -1.5], yaw: 0, pitch: 0, distance: 6.5 },
  drawer: { target: [0, 3.5, -1.5], yaw: 0, pitch: .04, distance: 2.6 },
};

const habitatOf = (item = {}) => {
  const raw = String(item.habitat || item.habitatLabel || item.ecology || '').toLowerCase();
  if (/(山林|根境|forest|mountain|shanlin)/.test(raw)) return 'forest';
  if (/(草甸|原野|草原|meadow|grassland|caodian)/.test(raw)) return 'meadow';
  if (/(花野|芳香|花卉|flower|aromatic|huaye)/.test(raw)) return 'flower';
  if (/(果实|种籽|果园|fruit|seed|guoshi)/.test(raw)) return 'fruit';
  if (/(水泽|湿地|水生|wetland|water|shuize)/.test(raw)) return 'wetland';
  return 'fungus';
};

const shapeOf = (item = {}) => {
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const excluded = new Set([item.habitatLabel, '深度条目', '拓展目录', '精选条目', '目录条目']);
  return tags.find((tag) => tag && !excluded.has(tag)) || item.form || item.partUsed || '形态待补';
};

function makeCanvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  draw(context, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(4, rendererMaxAnisotropy || 4);
  texture.needsUpdate = true;
  return texture;
}

let rendererMaxAnisotropy = 4;

function makeWoodTexture(base = '#5b3c2b', grain = '#4a3023') {
  return makeCanvasTexture(512, 256, (ctx, width, height) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);
    for (let index = 0; index < 110; index += 1) {
      const y = Math.random() * height;
      ctx.globalAlpha = 0.04 + Math.random() * 0.15;
      ctx.strokeStyle = Math.random() > 0.5 ? grain : '#6d4a33';
      ctx.lineWidth = 0.8 + Math.random() * 2.6;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(width * 0.3, y + (Math.random() - 0.5) * 20, width * 0.7, y + (Math.random() - 0.5) * 24, width, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
}

function makePlasterTexture() {
  return makeCanvasTexture(512, 256, (ctx, width, height) => {
    ctx.fillStyle = '#efe2cd';
    ctx.fillRect(0, 0, width, height);
    for (let index = 0; index < 180; index += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.globalAlpha = 0.03 + Math.random() * 0.06;
      ctx.fillStyle = Math.random() > 0.5 ? '#d9c8ab' : '#f7edda';
      ctx.beginPath();
      ctx.arc(x, y, 2 + Math.random() * 12, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
}

function makeTileTexture() {
  return makeCanvasTexture(512, 256, (ctx, width, height) => {
    ctx.fillStyle = '#23262e';
    ctx.fillRect(0, 0, width, height);
    for (let row = 0; row < 8; row += 1) {
      for (let column = 0; column < 16; column += 1) {
        const x = column * 32;
        const y = row * 32;
        const gradient = ctx.createLinearGradient(x, y, x + 30, y + 30);
        gradient.addColorStop(0, '#39404d');
        gradient.addColorStop(1, '#161a21');
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y + 1, 29, 29);
      }
    }
  });
}

function makeSkyTexture() {
  return makeCanvasTexture(1024, 512, (ctx, width, height) => {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#6e97ab');
    sky.addColorStop(.46, '#b6c7c4');
    sky.addColorStop(.74, '#e0d4bb');
    sky.addColorStop(1, '#f0dfc3');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    for (let index = 0; index < 12; index += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height * .62;
      const radius = 18 + Math.random() * 76;
      const cloud = ctx.createRadialGradient(x, y, 0, x, y, radius);
      cloud.addColorStop(0, 'rgba(255,247,229,.12)');
      cloud.addColorStop(1, 'rgba(255,247,229,0)');
      ctx.fillStyle = cloud;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function makeGroundTexture() {
  return makeCanvasTexture(1024, 1024, (ctx, width, height) => {
    ctx.fillStyle = '#6d7a58';
    ctx.fillRect(0, 0, width, height);
    for (let index = 0; index < 320; index += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 12 + Math.random() * 86;
      const patch = ctx.createRadialGradient(x, y, 0, x, y, radius);
      const tone = Math.random() > .55 ? '#5d6a4c' : '#7f8a61';
      patch.addColorStop(0, tone);
      patch.addColorStop(1, 'rgba(109,122,88,0)');
      ctx.globalAlpha = .35;
      ctx.fillStyle = patch;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (let index = 0; index < 1800; index += 1) {
      ctx.strokeStyle = Math.random() > .5 ? 'rgba(215,226,176,.07)' : 'rgba(50,61,43,.08)';
      ctx.lineWidth = 1 + Math.random() * 2;
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - .5) * 12, y - 4 - Math.random() * 10);
      ctx.stroke();
    }
  });
}

function makeStoneTexture() {
  return makeCanvasTexture(512, 512, (ctx, width, height) => {
    ctx.fillStyle = '#8f8a80';
    ctx.fillRect(0, 0, width, height);
    for (let index = 0; index < 260; index += 1) {
      ctx.globalAlpha = .06 + Math.random() * .12;
      ctx.fillStyle = Math.random() > .5 ? '#a5a196' : '#6e6a63';
      ctx.beginPath();
      ctx.ellipse(Math.random() * width, Math.random() * height, 6 + Math.random() * 34, 4 + Math.random() * 18, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
}

function makeSignTexture() {
  return makeCanvasTexture(2048, 768, (ctx, width, height) => {
    const board = ctx.createLinearGradient(0, 0, width, height);
    board.addColorStop(0, '#1c1210');
    board.addColorStop(.5, '#2d1d16');
    board.addColorStop(1, '#150e0c');
    ctx.fillStyle = board;
    ctx.fillRect(0, 0, width, height);
    for (let index = 0; index < 260; index += 1) {
      ctx.globalAlpha = .02 + Math.random() * .05;
      ctx.fillStyle = '#f2d8a4';
      ctx.fillRect(Math.random() * width, Math.random() * height, 2 + Math.random() * 5, 2 + Math.random() * 4);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#d8b270';
    ctx.lineWidth = 14;
    ctx.strokeRect(34, 34, width - 68, height - 68);
    ctx.strokeStyle = 'rgba(244,223,171,.34)';
    ctx.lineWidth = 6;
    ctx.strokeRect(76, 76, width - 152, height - 152);
    const gold = ctx.createLinearGradient(0, height * .2, 0, height * .82);
    gold.addColorStop(0, '#fff4cf');
    gold.addColorStop(.55, '#f5cf79');
    gold.addColorStop(1, '#a9762f');
    ctx.fillStyle = gold;
    ctx.font = '600 375px KaiTi, STKaiti, "Noto Serif SC", SimSun, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,.55)';
    ctx.shadowBlur = 24;
    ctx.fillText('百子药堂', width / 2, height / 2 - 12);
    ctx.shadowBlur = 0;
    // Dark lacquer worn at the border, not over the gold lettering.
    for (let i = 0; i < 160; i++) {
      ctx.fillStyle = i % 3 ? 'rgba(114,80,45,.35)' : 'rgba(12,9,7,.3)';
      ctx.fillRect(18 + Math.random() * (width - 36), i % 2 ? 38 : height - 47, 4 + Math.random() * 22, 3 + Math.random() * 8);
    }
  });
}

function makeLabelAtlasTexture(catalog = []) {
  const columns = 12;
  const rows = 10;
  const cellWidth = 341;
  const cellHeight = 154;
  return makeCanvasTexture(columns * cellWidth, rows * cellHeight, (ctx, width, height) => {
    ctx.fillStyle = '#f6ead2';
    ctx.fillRect(0, 0, width, height);
    for (let index = 0; index < columns * rows; index += 1) {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = column * cellWidth;
      const y = row * cellHeight;
      const item = catalog[index];
      ctx.fillStyle = index % 4 ? '#e1d0a6' : '#ebdbb8';
      ctx.fillRect(x + 4, y + 4, cellWidth - 8, cellHeight - 8);
      ctx.strokeStyle = '#8a5c36';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 10, y + 10, cellWidth - 20, cellHeight - 20);
      ctx.strokeStyle = 'rgba(138,92,54,.34)';
      ctx.lineWidth = 2;
      for (let j = 0; j < 25; j++) {
        ctx.fillStyle = 'rgba(99,69,32,.09)';
        ctx.fillRect(x + 6 + Math.random() * (cellWidth - 12), y + 6 + Math.random() * (cellHeight - 12), 1 + Math.random() * 3, 1);
      }
      const name = String(item?.nameZh || '本草');
      let fontSize = 76;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      do {
        ctx.font = `600 ${fontSize}px KaiTi, STKaiti, "Noto Serif SC", SimSun, serif`;
        if (ctx.measureText(name).width <= cellWidth - 66) break;
        fontSize -= 4;
      } while (fontSize > 38);
      ctx.fillStyle = '#2b1c11';
      ctx.fillText(name, x + cellWidth / 2, y + cellHeight / 2 - 2);

    }
  });
}

export async function mountApothecaryEngine({ root, canvas, items = [], activeHabitat = 'forest', morphology = 'all', selectedId = '', onSelect, onError } = {}) {
  if (!root || !canvas || !items.length) throw new Error('Apothecary root, canvas, or catalog missing');
  const catalog = items.filter(Boolean);
  if (catalog.length > 120) throw new Error('Apothecary capacity exceeded');
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = media.matches;
  const compact = window.matchMedia('(max-width: 700px)').matches;
  const shadows = true;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  rendererMaxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.35 : 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.03;
  renderer.shadowMap.enabled = shadows;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#a9babc', 110, 560);
  const camera = new THREE.PerspectiveCamera(42, 1, .08, 620);
  const materials = [], geometries = [], textures = [];
  const texture = (t) => { textures.push(t); return t; };
  const material = (name, props) => {
    const mat = new THREE.MeshStandardMaterial(props);
    mat.name = name;
    materials.push(mat);
    return mat;
  };
  const surfaces = await loadApothecarySurfaces(textures, rendererMaxAnisotropy);
  const timberMaps = surfaceMaps(surfaces.dark_wooden_planks, textures, [1.2, .18], [0, .04]);
  const floorMaps = surfaceMaps(surfaces.dark_wooden_planks, textures, [4, 3]);
  const plasterMaps = surfaceMaps(surfaces.rough_plaster_03, textures, [3, 1]);
  // Use the photographed plaster's relief, not its exposed-rock color, on limewashed walls.
  delete plasterMaps.map;
  plasterMaps.normalScale.set(.12, .12);
  const stoneMaps = surfaceMaps(surfaces.monastery_stone_floor, textures, [.26, .26], [.1, .2]);
  const soilMaps = surfaceMaps(surfaces.forest_ground_04, textures, [4, 4]);
  const wood = texture(makeWoodTexture('#815b3e', '#30231c'));
  const darkwood = texture(makeWoodTexture('#513c2c', '#271e18'));
  const stone = texture(makeStoneTexture());
  const ground = texture(makeGroundTexture());
  ground.wrapS = ground.wrapT = THREE.RepeatWrapping;
  ground.repeat.set(18, 18);
  const sky = texture(makeSkyTexture());
  scene.background = sky;
  const sign = texture(makeSignTexture());
  const labels = texture(makeLabelAtlasTexture(catalog));
  labels.anisotropy = Math.min(8, rendererMaxAnisotropy);
  const m = {
    wood: material('timber', { map: wood, ...timberMaps, color: '#88715a', roughness: .95 }),
    floor: material('floorboards', { map: wood, ...floorMaps, color: '#a49176', roughness: .94 }),
    darkwood: material('cabinet-recesses', { map: darkwood, ...timberMaps, color: '#504437', roughness: .96 }),
    redwood: material('red-lacquer', { map: wood, ...timberMaps, color: '#966d57', roughness: .85 }),
    plaster: material('lime-plaster', { map: texture(makePlasterTexture()), ...plasterMaps, color: '#d3ceba', roughness: 1 }),
    ochreWall: material('garden-red-wall', { ...plasterMaps, color: '#974b35', roughness: .96 }),
    thatch: material('layered-thatch', { map: texture(makeThatchTexture()), color: '#b7ad91', roughness: 1, side: THREE.DoubleSide }),
    straw: material('thatch-ends', { color: '#8c8265', roughness: 1 }),
    stone: material('weathered-stone', { map: stone, ...stoneMaps, color: '#9e9f8d', roughness: .96 }),
    ground: material('grassland', { map: ground, ...surfaceMaps(surfaces.forest_ground_04, textures, [50, 50]), color: '#8b9873', roughness: 1 }),
    gravel: material('courtyard-gravel', { map: stone, ...surfaceMaps(surfaces.monastery_stone_floor, textures, [10, 9]), color: '#9b9987', roughness: 1 }),
    tile: material('curved-tile-roof', { color: '#3f4442', roughness: .94, vertexColors: true, side: THREE.DoubleSide }),
    tileRib: material('tile-ridges', { color: '#555951', roughness: .94, vertexColors: true }),
    moss: material('crevice-moss', { color: '#434d28', roughness: 1 }),
    brass: material('aged-brass', { map: texture(makePatinaTexture()), color: '#b1a188', roughness: .56, metalness: .65 }),
    lantern: material('red-silk', { color: '#893d2c', emissive: '#d3853c', emissiveIntensity: .13, roughness: .95 }),
    bamboo: material('split-bamboo', { map: wood, ...timberMaps, color: '#afa17a', roughness: .95 }),
    bambooGreen: material('bamboo-stems', { color: '#52663b', roughness: .73, vertexColors: true }),
    bambooNode: material('bamboo-nodes', { color: '#7c8053', roughness: .86 }),
    leaf: material('deep-leaves', { color: '#354c27', roughness: .95, side: THREE.DoubleSide, vertexColors: true }),
    treeLeaf: material('tree-leaves', { color: '#53653a', roughness: .95, side: THREE.DoubleSide, vertexColors: true }),
    herb: material('herb-leaves', { color: '#617e36', roughness: .95, side: THREE.DoubleSide, vertexColors: true }),
    soil: material('garden-soil', { ...soilMaps, color: '#6d6150', roughness: 1 }),
    flower: material('ivory-blossoms', { color: '#ece4cb', roughness: .85, side: THREE.DoubleSide }),
    pink: material('peach-blossoms', { color: '#cfa2a3', roughness: .9, side: THREE.DoubleSide }),
    bark: material('tree-bark', { map: darkwood, ...surfaceMaps(surfaces.dark_wooden_planks, textures, [.2, 2]), color: '#777264', roughness: 1 }),
    ceramic: material('porcelain', { color: '#e3e5d7', roughness: .28 }),
    blue: material('porcelain-blue', { color: '#406477', roughness: .35 }),
    mountains: [0, 1, 2].map(i => {
      const detail = surfaceMaps(surfaces.rough_plaster_03, textures, [28, 10]);
      delete detail.map;
      detail.normalScale.set(.65, .65);
      return material(`mountain-${i}`, { ...detail, color: '#b5c4c1', vertexColors: true, roughness: 1, envMapIntensity: .12 });
    }),
  };
  const canopyMap = texture(makeCanopyTexture());
  const foliage = { map: canopyMap, alphaTest: .45, side: THREE.DoubleSide, roughness: .92, vertexColors: true };
  m.canopy = material('garden-tree-canopies', { ...foliage, color: '#b4c090' });
  m.understory = material('garden-understory', { ...foliage, color: '#9eae72' });
  m.bambooCrown = material('bamboo-leaf-sprays', { ...foliage, map: texture(makeBambooLeafTexture()), color: '#e2e5c7', alphaTest: .35 });
  weatherMaterial(m.plaster, 'wall');
  weatherMaterial(m.ochreWall, 'wall');
  weatherMaterial(m.stone, 'stone');
  weatherMaterial(m.tile, 'roof');
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .035);
  scene.environment = environment.texture;
  scene.environmentIntensity = .28;
  room.dispose();
  pmrem.dispose();
  m.sign = new THREE.MeshBasicMaterial({ map: sign, toneMapped: false });
  materials.push(m.sign);
  const sun = new THREE.DirectionalLight('#fff1d6', 2.6);
  sun.position.set(-17, 26, 20);
  sun.target.position.set(0, 0, 4);
  sun.castShadow = shadows;
  sun.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { near: 1, far: 90, left: -28, right: 28, top: 28, bottom: -28 });
  sun.shadow.bias = -.0003;
  sun.shadow.normalBias = .035;
  scene.add(sun, sun.target, new THREE.HemisphereLight('#d7e0e1', '#655747', 1.7));
  const fill = new THREE.DirectionalLight('#ffe9c4', .95);
  fill.position.set(0, 5, 12);
  scene.add(fill);
  const courtyard = buildCourtyard({ scene, materials: m, geometries, shadows, compact });
  root.dataset.hallBambooCulms = String(courtyard.userData.bamboo.culms);
  root.dataset.hallMountainLayers = String(courtyard.userData.mountainLayers);

  const placements = catalog.map((_, i) => {
    const bay = Math.floor(i / 40), cell = i % 40;
    return new THREE.Vector3((bay - 1) * 4.7 - 1.59 + (cell % 4) * 1.06, 5.47 - Math.floor(cell / 4) * .46, -1.6);
  });
  const instanced = (geo, mat) => {
    geometries.push(geo);
    const mesh = new THREE.InstancedMesh(geo, mat, catalog.length);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  };
  const drawerMaterial = material('drawer-fronts', { map: wood, ...timberMaps, roughness: .87, color: '#a48c70' });
  const drawers = instanced(new RoundedBoxGeometry(.98, .41, .5, 1, .016), drawerMaterial);
  drawers.castShadow = shadows;
  drawers.receiveShadow = shadows;
  const handles = instanced(new THREE.TorusGeometry(.052, .010, compact ? 5 : 8, compact ? 10 : 20), m.brass);
  const handlePlates = instanced(compact ? new THREE.CircleGeometry(.035, 8) : new THREE.SphereGeometry(.035, 12, 8), m.brass);
  const labelMaterial = new THREE.MeshBasicMaterial({ map: labels, toneMapped: false });
  materials.push(labelMaterial);
  labelMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = 'attribute vec2 labelOffset;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\nvMapUv = vMapUv / vec2(12.0, 10.0) + labelOffset;');
  };
  labelMaterial.customProgramCacheKey = () => 'herb-label-atlas-v1';
  const labelGeometry = new THREE.PlaneGeometry(.76, .25);
  labelGeometry.setAttribute('labelOffset', new THREE.InstancedBufferAttribute(new Float32Array(catalog.flatMap((_, i) => [(i % 12) / 12, 1 - (Math.floor(i / 12) + 1) / 10])), 2));
  const labelMesh = instanced(labelGeometry, labelMaterial);
  const matrix = new THREE.Matrix4();
  const setInstance = (i, open) => {
    const p = placements[i], z = p.z + open * .42;
    drawers.setMatrixAt(i, matrix.makeTranslation(p.x, p.y, z));
    // The ring is below the name, never across the characters.
    handles.setMatrixAt(i, matrix.makeTranslation(p.x, p.y - .145, z + .29));
    handlePlates.setMatrixAt(i, matrix.makeTranslation(p.x, p.y - .10, z + .254));
    labelMesh.setMatrixAt(i, matrix.makeTranslation(p.x, p.y + .047, z + .256));
  };
  const markInstances = () => {
    for (const mesh of [drawers, handles, handlePlates, labelMesh]) mesh.instanceMatrix.needsUpdate = true;
    renderer.shadowMap.needsUpdate = true;
  };
  const openAmounts = new Float32Array(catalog.length);
  placements.forEach((_, i) => setInstance(i, 0));
  markInstances();
  const borderGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.015, .445, .51));
  const borderMaterial = new THREE.LineBasicMaterial({ color: '#ffe5a0', toneMapped: false });
  geometries.push(borderGeometry);
  materials.push(borderMaterial);
  const highlight = new THREE.LineSegments(borderGeometry, borderMaterial);
  highlight.visible = false;
  scene.add(highlight);
  const noteNode = root.querySelector('[data-apothecary-note]');
  const modeNode = root.querySelector('[data-apothecary-mode]');
  const note = (s) => { if (noteNode) noteNode.textContent = s; };
  let selected = -1, matches = new Set(), disposed = false, frameId = 0, visible = true;
  let width = 1, height = 1, lastTime = 0;
  let viewName = 'outside';
  const target = new THREE.Vector3(), currentTarget = new THREE.Vector3();
  const orbit = { yaw: 0, pitch: 0, distance: 40 };
  const desired = new THREE.Vector3();
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  const cameraDestination = () => desired.set(
    target.x + orbit.distance * Math.sin(orbit.yaw) * Math.cos(orbit.pitch),
    Math.max(.85, target.y + orbit.distance * Math.sin(orbit.pitch)),
    target.z + orbit.distance * Math.cos(orbit.yaw) * Math.cos(orbit.pitch),
  );
  const setViewButtons = () => root.querySelectorAll('[data-apothecary-view]').forEach(button => {
    const active = button.dataset.apothecaryView === viewName;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const fitDistance = (distance, fullWidth) => Math.max(distance, fullWidth / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect));
  function setView(name = 'outside') {
    if (name === 'reset') name = 'outside';
    if (name === 'drawer' && selected < 0) name = 'cabinet';
    const preset = VIEW_PRESETS[name] || VIEW_PRESETS.outside;
    viewName = name;
    // Keep the cabinet camera inside the doorway; fit with the lens, not a dolly through the sign.
    const cabinetFov = THREE.MathUtils.radToDeg(2 * Math.atan(15.2 / (2 * preset.distance * camera.aspect)));
    camera.fov = name === 'cabinet' ? THREE.MathUtils.clamp(cabinetFov, 62, 112) : name === 'panorama' || name === 'outside' ? 50 : 42;
    camera.updateProjectionMatrix();
    target.fromArray(preset.target);
    orbit.yaw = preset.yaw;
    orbit.pitch = preset.pitch;
    orbit.distance = name === 'cabinet' ? preset.distance : fitDistance(preset.distance, name === 'panorama' ? 48 : name === 'outside' ? 27 : name === 'hall' ? 19 : name === 'bamboo' ? 8 : 2.5);
    if (name === 'drawer') target.copy(placements[selected]);
    root.dataset.hallView = name;
    setViewButtons();
    note(name === 'outside' ? '山间药堂 · 竹影与层峦' : name === 'panorama' ? '群山全景 · 坡地、曲径与庭院' : name === 'bamboo' ? '竹径近观 · 竹节、侧枝与披垂叶' : name === 'hall' ? '檐下入堂 · 拖拽环视' : name === 'cabinet' ? `120 格常驻 · 当前筛选亮起 ${matches.size} 味` : `${catalog[selected].nameZh} · 药屉聚焦`);
    requestRender();
  }
  function tintDrawers() {
    matches = new Set(catalog.filter(item => (activeHabitat === 'all' || habitatOf(item) === activeHabitat) && (morphology === 'all' || shapeOf(item).includes(morphology))).map(item => item.id));
    catalog.forEach((item, i) => {
      const active = matches.has(item.id);
      drawers.setColorAt(i, new THREE.Color(i === selected ? '#ebd9b6' : active ? '#d9c6a4' : '#a89a87').multiplyScalar(.90 + (i * 37 % 17) * .008));
      labelMesh.setColorAt(i, new THREE.Color(active || i === selected ? '#ffffff' : '#b1b4ad'));
    });
    drawers.instanceColor.needsUpdate = true;
    labelMesh.instanceColor.needsUpdate = true;
    root.dataset.hallDrawerCount = String(catalog.length);
    root.dataset.hallMatchCount = String(matches.size);
  }
  function choose(index, notify = true) {
    selected = index;
    root.dataset.hallSelected = index >= 0 ? catalog[index].id : '';
    tintDrawers();
    if (index >= 0) setView('drawer');
    if (notify) onSelect?.(index >= 0 ? catalog[index] : null);
    requestRender();
  }
  function closeDrawer() {
    if (selected < 0) return false;
    const name = catalog[selected].nameZh;
    choose(-1);
    note(`${name} · 药屉关闭`);
    return true;
  }
  function render(time = performance.now()) {
    frameId = 0;
    if (disposed || document.hidden || !visible) return;
    const dt = Math.min((time - lastTime) / 1000 || .016, .25);
    lastTime = time;
    const alpha = reduced ? 1 : 1 - Math.exp(-dt * 5.5);
    currentTarget.lerp(target, alpha);
    camera.position.lerp(cameraDestination(), alpha);
    camera.lookAt(currentTarget);
    let moving = camera.position.distanceToSquared(desired) > .00001 || currentTarget.distanceToSquared(target) > .00001;
    let changed = false;
    for (let i = 0; i < openAmounts.length; i++) {
      const goal = i === selected ? 1 : 0;
      if (Math.abs(openAmounts[i] - goal) > .001) {
        openAmounts[i] = reduced ? goal : THREE.MathUtils.lerp(openAmounts[i], goal, 1 - Math.exp(-dt * 12));
        if (Math.abs(openAmounts[i] - goal) < .001) openAmounts[i] = goal;
        setInstance(i, openAmounts[i]);
        changed = true;
        moving ||= openAmounts[i] !== goal;
      }
    }
    if (changed) markInstances();
    highlight.visible = selected >= 0;
    if (selected >= 0) {
      highlight.position.copy(placements[selected]);
      highlight.position.z += openAmounts[selected] * .42;
    }
    renderer.render(scene, camera);
    root.dataset.hallDrawCalls = String(renderer.info.render.calls);
    root.dataset.hallTriangles = String(renderer.info.render.triangles);
    root.dataset.hallTextures = String(renderer.info.memory.textures);
    root.dataset.hallGeometries = String(renderer.info.memory.geometries);
    root.dataset.hallAnimating = String(moving);
    if (moving && !reduced) requestRender();
  }
  function requestRender() {
    if (!disposed && !frameId && visible && !document.hidden) frameId = requestAnimationFrame(render);
  }
  const pointers = new Map();
  let gesture = null;
  const onDown = event => {
    if (event.button !== 0) return;
    canvas.setPointerCapture?.(event.pointerId);
    pointers.set(event.pointerId, [event.clientX, event.clientY]);
    if (pointers.size === 1) gesture = { x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false };
    else if (gesture) gesture.moved = true;
  };
  const onMove = event => {
    if (!pointers.has(event.pointerId) || !gesture) return;
    if (pointers.size === 2) {
      const before = [...pointers.values()];
      const d0 = Math.hypot(before[0][0] - before[1][0], before[0][1] - before[1][1]);
      pointers.set(event.pointerId, [event.clientX, event.clientY]);
      const after = [...pointers.values()];
      const d1 = Math.hypot(after[0][0] - after[1][0], after[0][1] - after[1][1]);
      orbit.distance = THREE.MathUtils.clamp(orbit.distance * d0 / Math.max(1, d1), 1.8, 100);
      gesture.moved = true;
    } else {
      pointers.set(event.pointerId, [event.clientX, event.clientY]);
      gesture.moved ||= Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 5;
      orbit.yaw = THREE.MathUtils.clamp(orbit.yaw - (event.clientX - gesture.lastX) * .004, -.9, .9);
      orbit.pitch = THREE.MathUtils.clamp(orbit.pitch + (event.clientY - gesture.lastY) * .003, -.08, .72);
    }
    gesture.lastX = event.clientX;
    gesture.lastY = event.clientY;
    requestRender();
  };
  const onUp = event => {
    const click = pointers.has(event.pointerId) && pointers.size === 1 && gesture && !gesture.moved && event.type === 'pointerup';
    pointers.delete(event.pointerId);
    if (!pointers.size) gesture = null;
    else if (gesture) gesture.moved = true;
    canvas.releasePointerCapture?.(event.pointerId);
    if (!click) return;
    if (['outside', 'panorama', 'bamboo', 'hall'].includes(viewName)) { setView(viewName === 'hall' ? 'cabinet' : 'hall'); return; }
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(drawers, false)[0];
    if (Number.isInteger(hit?.instanceId)) {
      if (hit.instanceId === selected) closeDrawer();
      else choose(hit.instanceId);
    }
  };
  const onWheel = event => { event.preventDefault(); orbit.distance = THREE.MathUtils.clamp(orbit.distance * Math.exp(event.deltaY * .001), 1.8, 100); requestRender(); };
  const onKey = event => {
    if (event.key === 'Escape') { closeDrawer(); return; }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(selected >= 0 ? selected : catalog.findIndex(item => matches.has(item.id))); return; }
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4 }[event.key];
    if (step) { event.preventDefault(); choose((Math.max(0, selected) + step + catalog.length) % catalog.length); }
  };
  const resize = () => {
    width = canvas.clientWidth || root.clientWidth;
    height = canvas.clientHeight || 440;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    setView(viewName);
    requestRender();
  };
  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) requestRender();
    else { cancelAnimationFrame(frameId); frameId = 0; }
  });
  const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; } else requestRender(); };
  const onMotion = () => { reduced = media.matches; requestRender(); };
  const onLost = event => { event.preventDefault(); dispose(); onError?.(new Error('WebGL context lost')); };
  const listeners = [['pointerdown', onDown], ['pointermove', onMove], ['pointerup', onUp], ['pointercancel', onUp], ['wheel', onWheel], ['keydown', onKey], ['webglcontextlost', onLost]];
  listeners.forEach(([name, handler]) => canvas.addEventListener(name, handler, name === 'wheel' ? { passive: false } : undefined));
  media.addEventListener('change', onMotion);
  document.addEventListener('visibilitychange', onVisibility);
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', '古风庭院：拖拽环视，点击入堂；近景点击药屉。方向键选药，Enter 聚焦，Escape 关闭。');
  tintDrawers();
  resize();
  camera.position.copy(cameraDestination());
  currentTarget.copy(target);
  if (selectedId) choose(catalog.findIndex(item => item.id === selectedId), false);
  root.classList.add('is-hall-ready');
  document.body.classList.add('is-hall-ready');
  root.dataset.hallMode = 'WebGL2';
  if (modeNode) modeNode.textContent = '百子药堂 · 120 格';
  resizeObserver.observe(canvas.parentElement);
  intersectionObserver.observe(canvas);
  requestRender();
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    media.removeEventListener('change', onMotion);
    document.removeEventListener('visibilitychange', onVisibility);
    listeners.forEach(([name, handler]) => canvas.removeEventListener(name, handler));
    root.classList.remove('is-hall-ready');
    document.body.classList.remove('is-hall-ready');
    for (const mesh of [drawers, handles, handlePlates, labelMesh]) mesh.dispose();
    for (const geo of new Set(geometries)) geo.dispose();
    for (const mat of new Set(materials)) mat.dispose();
    for (const tex of new Set(textures)) tex.dispose();
    sun.shadow.dispose();
    environment.dispose();
    renderer.dispose();
  }
  return {
    mode: 'WebGL2', setView, closeDrawer, dispose,
    focusSelected: () => { if (selected < 0) return false; setView('drawer'); return true; },
    update(next = {}) {
      activeHabitat = next.habitat ?? activeHabitat;
      morphology = next.morphology ?? morphology;
      if ('selectedId' in next) choose(catalog.findIndex(item => item.id === next.selectedId), false);
      tintDrawers();
      if (!next.selectedId) setView('cabinet');
      requestRender();
    },
  };
}


