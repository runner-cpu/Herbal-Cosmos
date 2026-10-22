/**
 * High-fidelity planet renderer for 本草宇宙.
 *
 * WebGPU + @takram/three-atmosphere is the primary path. A classic Three.js
 * WebGL2 renderer is attempted next. The caller keeps the Canvas 2D planet
 * alive until this module reports a successful mount, and re-enables it when
 * both GPU paths are unavailable.
 */

import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';
import { context } from 'three/tsl';
import { AtmosphereContext, skyBackground } from '@takram/three-atmosphere/webgpu';
import { fitSphereDistance, projectedSphereRadius } from './planet-framing.js';

const EARTH_RADIUS = 6360;
const PARTICLE_RADIUS = 6600;
const CLOUD_RADIUS = 6394;
const CAMERA_Z = fitSphereDistance(6730, 1);
const HABITAT_COLORS = {
  mountain: '#d86a4f',
  meadow: '#80c7a7',
  flower: '#e8a7cb',
  fruit: '#f1c46f',
  wetland: '#62b7cc',
  fungus: '#b39ae3',
  unknown: '#c7d0d7',
};

function habitatFor(item = {}) {
  const value = String(item.habitat || item.habitatLabel || item.environment || '').toLowerCase();
  if (/山林|根境|林下|山地|forest|mountain|shanlin/.test(value)) return 'mountain';
  if (/草甸|原野|草原|平原|grassland|meadow|caodian/.test(value)) return 'meadow';
  if (/花野|芳香|花卉|aromatic|flower|huaye/.test(value)) return 'flower';
  if (/果实|种籽|果园|seed|fruit|guoshi/.test(value)) return 'fruit';
  if (/水泽|湿地|水生|湖|water|wetland|shuize/.test(value)) return 'wetland';
  if (/菌木|阴翳|菌|木本|shade|fungus|junmu/.test(value)) return 'fungus';
  return 'unknown';
}

function itemText(item = {}) {
  return `${item.nameZh || ''} ${item.pinyin || ''} ${item.scientificName || ''} ${item.tags || ''} ${item.morphology || ''}`.toLowerCase();
}

function fibonacciPositions(count) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, index) => {
    const y = 1 - (index / Math.max(1, count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * index;
    return new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
  });
}

function makeGlowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.18, 'rgba(255,255,255,.98)');
  gradient.addColorStop(0.42, 'rgba(255,255,255,.32)');
  gradient.addColorStop(1, outer);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeRingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 192;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');
  ctx.translate(96, 96);
  ctx.strokeStyle = '#f4d9a7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(244,217,167,.35)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(0, 0, 72, 0, Math.PI * 2);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

async function loadTexture(loader, url, { color = false, anisotropy = 4 } = {}) {
  const texture = await loader.loadAsync(url);
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
  return texture;
}

function makeStarfield() {
  const count = 1800;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();
  for (let index = 0; index < count; index += 1) {
    const radius = 42000 + Math.random() * 12000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.cos(phi);
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    color.set(Math.random() > 0.86 ? '#f3d4a7' : Math.random() > 0.55 ? '#c8e0ea' : '#f4f7f9');
    color.multiplyScalar(0.45 + Math.random() * 0.55);
    colors.set([color.r, color.g, color.b], index * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size: 1.35, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.76, depthWrite: false });
  return new THREE.Points(geometry, material);
}

function makeAtmosphereShell() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color('#78b9df') },
      uSun: { value: new THREE.Vector3(-0.7, 0.35, 0.5).normalize() },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorld;
      void main() {
        vNormal = normalize(mat3(modelMatrix) * normal);
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uSun;
      varying vec3 vNormal;
      varying vec3 vWorld;
      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorld);
        float rim = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.8);
        float daylight = smoothstep(-0.25, 0.62, dot(normalize(vWorld), uSun));
        float alpha = rim * (0.12 + daylight * 0.88) * 0.58;
        gl_FragColor = vec4(uColor * (0.58 + daylight * 0.62), alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
  const shell = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS * 1.022, 96, 64), material);
  shell.renderOrder = 4;
  return shell;
}

async function createAtmosphereRenderer(canvas, camera) {
  if (!navigator.gpu) throw new Error('WebGPU unavailable');
  const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
  if (!adapter) throw new Error('WebGPU adapter unavailable');
  const renderer = new WebGPURenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  await renderer.init();
  const atmosphere = new AtmosphereContext();
  atmosphere.camera = camera;
  atmosphere.matrixWorldToECEF.value.identity();
  atmosphere.matrixECIToECEF.value.identity();
  atmosphere.sunDirectionECEF.value.copy(new THREE.Vector3(-0.72, 0.28, 0.63).normalize());
  atmosphere.constrainCamera = false;
  atmosphere.accurateShadowScattering = false;
  atmosphere.raymarchScattering = true;
  renderer.contextNode = context({
    ...renderer.contextNode.value,
    getAtmosphere: () => atmosphere,
  });
  return { renderer, atmosphere, mode: 'WebGPU · ATMOSPHERE' };
}

function createWebGLRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.55));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return { renderer, atmosphere: null, mode: 'WEBGL2 · EARTH' };
}

/**
 * Mount the 3D planet. Throws if no GPU renderer can be created; the caller
 * must keep the existing Canvas 2D planet in that case.
 */
export async function mountPlanetEngine({
  root,
  canvas,
  items = [],
  habitat = 'all',
  query = '',
  selectedId = '',
  onSelect,
}) {
  if (!root || !canvas || !items.length) throw new Error('Planet root, canvas, or catalog missing');
  const catalog = items.filter(Boolean);
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const camera = new THREE.PerspectiveCamera(36, 1, 2, 90000);
  camera.position.set(0, 0, CAMERA_Z);
  camera.lookAt(0, 0, 0);
  let rendererInfo;
  let gpuError = null;
  try {
    rendererInfo = await createAtmosphereRenderer(canvas, camera);
  } catch (error) {
    gpuError = error;
    try {
      rendererInfo = createWebGLRenderer(canvas);
    } catch (webglError) {
      throw new Error(`WebGPU: ${gpuError.message}; WebGL2: ${webglError.message}`);
    }
  }

  const { renderer, atmosphere, mode } = rendererInfo;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#030913');
  if (atmosphere) scene.backgroundNode = skyBackground();

  const planet = new THREE.Group();
  planet.rotation.set(-0.16, 0.46, 0);
  planet.rotation.order = 'YXZ';
  scene.add(planet);

  const loader = new THREE.TextureLoader();
  const textureBase = new URL('../src/assets/planet/', import.meta.url);
  let map, normalMap, specularMap, cloudMap, lightsMap;
  try {
    [map, normalMap, specularMap, cloudMap, lightsMap] = await Promise.all([
      loadTexture(loader, new URL('earth_atmos_2048.jpg', textureBase).href, { color: true }),
      loadTexture(loader, new URL('earth_normal_2048.jpg', textureBase).href),
      loadTexture(loader, new URL('earth_specular_2048.jpg', textureBase).href),
      loadTexture(loader, new URL('earth_clouds_1024.png', textureBase).href, { color: true }),
      loadTexture(loader, new URL('earth_lights_2048.png', textureBase).href, { color: true }),
    ]);
  } catch (error) {
    renderer.setAnimationLoop(null);
    renderer.dispose();
    atmosphere?.dispose();
    throw new Error(`Planet textures unavailable: ${error.message}`);
  }

  const earthMaterial = new THREE.MeshStandardMaterial({
    map,
    normalMap,
    normalScale: new THREE.Vector2(0.8, 0.8),
    roughness: 0.78,
    metalness: 0.02,
    emissiveMap: lightsMap,
    emissive: new THREE.Color('#f7bb72'),
    emissiveIntensity: 0.46,
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS, 160, 96), earthMaterial);
  earth.rotation.y = Math.PI * 0.78;
  planet.add(earth);

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(CLOUD_RADIUS, 128, 80),
    new THREE.MeshStandardMaterial({
      map: cloudMap,
      alphaMap: cloudMap,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      roughness: 1,
      metalness: 0,
      color: new THREE.Color('#d9e8ea'),
    }),
  );
  clouds.rotation.y = earth.rotation.y + 0.1;
  clouds.renderOrder = 2;
  planet.add(clouds);

  const shell = atmosphere ? null : makeAtmosphereShell();
  if (shell) planet.add(shell);

  const sun = new THREE.DirectionalLight('#fff1d4', 2.8);
  sun.position.set(-12500, 5200, 11400);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight('#87a9c8', '#071018', 0.42));
  const rim = new THREE.DirectionalLight('#7bb6d6', 0.65);
  rim.position.set(9000, -5000, -13000);
  scene.add(rim);
  const stars = makeStarfield();
  scene.add(stars);

  const positions = fibonacciPositions(catalog.length).map((point) => point.multiplyScalar(PARTICLE_RADIUS));
  const pointGeometry = new THREE.SphereGeometry(130, 8, 6);
  const pointMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const points = new THREE.InstancedMesh(pointGeometry, pointMaterial, catalog.length);
  points.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  points.frustumCulled = false;
  points.renderOrder = 6;
  points.count = 0;
  planet.add(points);  const ringTexture = makeRingTexture();
  const ring = new THREE.Sprite(new THREE.SpriteMaterial({ map: ringTexture, transparent: true, depthWrite: false, opacity: 0.92, blending: THREE.AdditiveBlending }));
  ring.scale.setScalar(230);
  ring.visible = false;
  ring.renderOrder = 8;
  planet.add(ring);

  let localHabitat = habitat || 'all';
  let localQuery = query || '';
  let localSelected = selectedId || '';
  let visible = [];
  let active = true;
  let visibleOnScreen = true;
  let frame = 0;
  let lastTime = performance.now();
  let drag = null;
  let moved = false;
  let pinch = null;
  let fittedDistance = CAMERA_Z, zoom = 1;
  const pointerState = new Map();
  const projectedPoint = new THREE.Vector3();
  const worldPoint = new THREE.Vector3();
  const toCamera = new THREE.Vector3();

  const filtered = () => catalog.filter((item) => (localHabitat === 'all' || habitatFor(item) === localHabitat) && (!localQuery.trim() || itemText(item).includes(localQuery.trim().toLowerCase())));

  const updateFrontPoints = () => {
    planet.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    let rendered = 0;
    const color = new THREE.Color();
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);
    for (const item of visible) {
      const source = positions[catalog.indexOf(item)];
      worldPoint.copy(source).applyMatrix4(planet.matrixWorld);
      toCamera.copy(camera.position).sub(worldPoint);
      if (worldPoint.dot(toCamera) <= 0) continue;
      matrix.compose(source, quaternion, scale);
      points.setMatrixAt(rendered, matrix);
      color.set(HABITAT_COLORS[habitatFor(item)] || HABITAT_COLORS.unknown);
      points.setColorAt(rendered, color);
      rendered += 1;
    }
    points.count = rendered;
    points.instanceMatrix.needsUpdate = true;
    if (points.instanceColor) points.instanceColor.needsUpdate = true;
  };  const updateGeometry = () => {
    visible = filtered();
    updateFrontPoints();
    const selectedIndex = visible.findIndex((item) => item.id === localSelected);
    ring.visible = selectedIndex >= 0;
    if (selectedIndex >= 0) {
      const index = catalog.findIndex((item) => item.id === localSelected);
      const source = positions[index];
      ring.position.copy(source).multiplyScalar(1.002);
      worldPoint.copy(source).applyMatrix4(planet.matrixWorld);
      toCamera.copy(camera.position).sub(worldPoint);
      ring.visible = worldPoint.dot(toCamera) > 0;
    }
  };  const update = ({ habitat: nextHabitat = localHabitat, query: nextQuery = localQuery, selectedId: nextSelected = localSelected } = {}) => {
    localHabitat = nextHabitat || 'all';
    localQuery = nextQuery || '';
    localSelected = nextSelected || '';
    updateGeometry();
  };

  const applyZoom = (next = zoom) => {
    zoom = THREE.MathUtils.clamp(next, .65, 1.5);
    camera.position.z = fittedDistance * zoom;
    const rect = canvas.getBoundingClientRect();
    root.dataset.planetZoom = String(zoom);
    root.dataset.planetRadiusPx = String(projectedSphereRadius(PARTICLE_RADIUS + 130, camera.position.z, rect.height, camera.fov));
  };
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.fov = 36;
    fittedDistance = fitSphereDistance(PARTICLE_RADIUS + 130, camera.aspect, camera.fov);
    applyZoom();
    camera.updateProjectionMatrix();
  };
  const resetView = () => {
    planet.rotation.set(-.16, .46, 0);
    clouds.rotation.y = earth.rotation.y + .1;
    applyZoom(1);
    updateGeometry();
  };

  const setAnimationState = () => {
    active = visibleOnScreen && !document.hidden;
    if (active) {
      if (!frame) frame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const render = (time = performance.now()) => {
    frame = 0;
    if (!active) return;
    const delta = Math.min(40, time - lastTime);
    lastTime = time;
    if (!reduced && !drag) {
      planet.rotation.y += delta * 0.000018;
      clouds.rotation.y += delta * 0.000006;
    }
    stars.rotation.y -= delta * 0.0000015;
    updateFrontPoints();
    const selectedIndex = visible.findIndex((item) => item.id === localSelected);
    if (selectedIndex >= 0) {
      const scale = 220 + Math.sin(time * 0.0022) * 18;
      ring.scale.setScalar(scale);
    }
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  };

  const pickParticle = (event) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const hitRadius = event.pointerType === 'touch' ? 38 : 30;
    planet.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    let nearest = null;
    let nearestDistance = Infinity;
    for (const item of visible) {
      const source = positions[catalog.indexOf(item)];
      worldPoint.copy(source).applyMatrix4(planet.matrixWorld);
      toCamera.copy(camera.position).sub(worldPoint);
      if (worldPoint.dot(toCamera) <= 0) continue;
      projectedPoint.copy(worldPoint).project(camera);
      if (projectedPoint.z < -1 || projectedPoint.z > 1) continue;
      const x = (projectedPoint.x * 0.5 + 0.5) * rect.width;
      const y = (-projectedPoint.y * 0.5 + 0.5) * rect.height;
      const distance = Math.hypot(x - localX, y - localY);
      const insideGlobe = Math.hypot(localX - rect.width / 2, localY - rect.height / 2) <= projectedSphereRadius(PARTICLE_RADIUS, camera.position.z, rect.height, camera.fov);
      if ((distance <= hitRadius || insideGlobe) && distance < nearestDistance) {
        nearest = item;
        nearestDistance = distance;
      }
    }
    return nearest;
  };

  const onPointerDown = (event) => {
    canvas.setPointerCapture?.(event.pointerId);
    pointerState.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointerState.size === 1) {
      drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, rx: planet.rotation.x, ry: planet.rotation.y };
      moved = false;
      canvas.classList.add('is-dragging');
    } else if (pointerState.size === 2) {
      const [a, b] = [...pointerState.values()];
      pinch = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom };
      drag = null;
    }
  };

  const onPointerMove = (event) => {
    if (pointerState.has(event.pointerId)) pointerState.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinch && pointerState.size === 2) {
      const [a, b] = [...pointerState.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      applyZoom(pinch.zoom * (pinch.distance / Math.max(1, distance)));
      moved = true;
      return;
    }
    if (drag && drag.pointerId === event.pointerId) {
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      planet.rotation.y = drag.ry + dx * 0.005;
      planet.rotation.x = THREE.MathUtils.clamp(drag.rx + dy * 0.004, -1.12, 1.12);
      return;
    }
    if (event.pointerType === 'mouse') {
      const item = pickParticle(event);
      canvas.style.cursor = item ? 'pointer' : 'grab';
    }
  };

  const onPointerUp = (event) => {
    pointerState.delete(event.pointerId);
    if (pointerState.size < 2) pinch = null;
    if (drag?.pointerId === event.pointerId) {
      drag = null;
      canvas.classList.remove('is-dragging');
      if (!moved && event.type === 'pointerup') {
        const item = pickParticle(event);
        if (item) onSelect?.(item);
      }
    }
  };

  const onWheel = (event) => {
    event.preventDefault();
    applyZoom(zoom * Math.exp(event.deltaY * .001));
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') planet.rotation.y -= 0.11;
    else if (event.key === 'ArrowRight') planet.rotation.y += 0.11;
    else if (event.key === 'ArrowUp') planet.rotation.x = Math.max(-1.12, planet.rotation.x - 0.08);
    else if (event.key === 'ArrowDown') planet.rotation.x = Math.min(1.12, planet.rotation.x + 0.08);
    else if (event.key === '+' || event.key === '=') applyZoom(zoom * .9);
    else if (event.key === '-' || event.key === '_') applyZoom(zoom / .9);
    else return;
    event.preventDefault();
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('keydown', onKeyDown);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const intersectionObserver = new IntersectionObserver((entries) => {
    visibleOnScreen = entries.some((entry) => entry.isIntersecting);
    setAnimationState();
  }, { threshold: 0.05 });
  intersectionObserver.observe(root);
  const onVisibility = () => setAnimationState();
  document.addEventListener('visibilitychange', onVisibility);
  updateGeometry();
  resize();
  setAnimationState();
  canvas.classList.add('is-engine-ready');
  root.classList.add('is-3d-ready');
  root.dataset.planetMode = mode;
  root.querySelector('[data-planet-mode]')?.replaceChildren(document.createTextNode(mode));
  root.querySelector('[data-planet-engine-note]')?.replaceChildren(document.createTextNode(atmosphere ? '真实大气散射 · 晨昏线 · 夜光地表' : 'Three.js 地球 · 云层 · 粒子上层'));

  return {
    mode,
    update,
    resetView,
    dispose() {
      active = false;
      cancelAnimationFrame(frame);
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('keydown', onKeyDown);
      pointGeometry.dispose();
      pointMaterial.dispose();
      ringTexture.dispose();
      earth.geometry.dispose();
      earthMaterial.dispose();
      clouds.geometry.dispose();
      clouds.material.dispose();
      shell?.geometry.dispose();
      shell?.material.dispose();
      stars.geometry.dispose();
      stars.material.dispose();
      map?.dispose(); normalMap?.dispose(); specularMap?.dispose(); cloudMap?.dispose(); lightsMap?.dispose();
      atmosphere?.dispose();
      renderer.dispose();
      root.classList.remove('is-3d-ready');
    },
  };
}
