import * as THREE from 'three';

export async function loadApothecarySurfaces(textures, anisotropy) {
  const loader = new THREE.TextureLoader();
  const surfaces = {};
  await Promise.all(['dark_wooden_planks', 'rough_plaster_03', 'monastery_stone_floor', 'forest_ground_04'].map(async id => {
    const entries = await Promise.all(['color', 'normal', 'roughness'].map(async role => {
      // Bundled under vendor/ at runtime. Keep these local for offline demonstrations.
      try {
        const map = await loader.loadAsync(new URL(`../src/assets/apothecary/${id}_${role}.webp`, import.meta.url).href);
        map.colorSpace = role === 'color' ? THREE.SRGBColorSpace : THREE.NoColorSpace;
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = Math.min(8, anisotropy);
        textures.push(map);
        return [role, map];
      } catch { return [role, null]; }
    }));
    surfaces[id] = Object.fromEntries(entries);
  }));
  return surfaces;
}

export function surfaceMaps(surface, textures, repeat = [1, 1], offset = [0, 0]) {
  const props = {};
  for (const [role, key] of [['color', 'map'], ['normal', 'normalMap'], ['roughness', 'roughnessMap']]) {
    if (!surface[role]) continue;
    const map = surface[role].clone();
    map.repeat.set(...repeat);
    map.offset.set(...offset);
    map.needsUpdate = true;
    textures.push(map);
    props[key] = map;
  }
  props.normalScale = new THREE.Vector2(.4, .4);
  return props;
}

// Stains follow world height: dampness at masonry feet, dust in roof valleys.
export function weatherMaterial(material, kind) {
  material.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec3 vWeatherPosition;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvWeatherPosition = (modelMatrix * vec4(position, 1.0)).xyz;');
    shader.fragmentShader = `varying vec3 vWeatherPosition;
      float ageHash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float ageNoise(vec2 p) { vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(ageHash(i),ageHash(i+vec2(1,0)),f.x),mix(ageHash(i+vec2(0,1)),ageHash(i+vec2(1,1)),f.x),f.y); }
      ` + shader.fragmentShader;
    const weather = kind === 'wall'
      ? `float damp = (1.0-smoothstep(.6,1.9+ageNoise(vWeatherPosition.xz*3.0)*.8,vWeatherPosition.y));
         float streak=ageNoise(vec2((vWeatherPosition.x+vWeatherPosition.z)*9.0,vWeatherPosition.y*.38));
         diffuseColor.rgb *= mix(vec3(1.0),vec3(.44,.48,.36),damp*(.35+streak*.55));`
      : `float patina=ageNoise(vWeatherPosition.xz*2.2); diffuseColor.rgb *= .76 + .27*patina;
         diffuseColor.rgb = mix(diffuseColor.rgb,vec3(.11,.15,.075),smoothstep(.74,.95,patina)*.38);`;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + weather);
  };
  material.customProgramCacheKey = () => `courtyard-weather-${kind}-v1`;
}

export function makePatinaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const pixels = ctx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const patch = Math.sin(x * .046 + Math.sin(y * .055) * 2) * Math.cos(y * .031 + x * .023);
    const grain = Math.sin(x * 18.1 + y * 31.7) * .07;
    const t = THREE.MathUtils.clamp((patch - .25) * .5 + grain, 0, .3);
    const i = (y * 256 + x) * 4;
    pixels.data[i] = 132 * (1 - t) + 48 * t;
    pixels.data[i + 1] = 100 * (1 - t) + 69 * t;
    pixels.data[i + 2] = 58 * (1 - t) + 53 * t;
    pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

// Alpha-cut leaf sprays for the distant tree belt. Their gaps preserve silhouettes and dappled shadows.
export function makeCanopyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  let seed = 713;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let branch = 0; branch < 8; branch++) {
    const a = branch * 2.4;
    const endX = 256 + Math.cos(a) * (125 + random() * 85);
    const endY = 256 + Math.sin(a) * (125 + random() * 85);
    ctx.strokeStyle = '#5d5a38'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(256, 300); ctx.lineTo(endX, endY); ctx.stroke();
    for (let i = 0; i < 22; i++) {
      const t = .15 + random() * .85;
      const x = 256 + (endX - 256) * t + (random() - .5) * 100;
      const y = 300 + (endY - 300) * t + (random() - .5) * 100;
      const angle = a + (random() - .5) * 2;
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
      const len = 13 + random() * 18;
      const shade = 75 + Math.floor(random() * 65);
      ctx.fillStyle = `rgb(${shade},${shade + 22},${Math.floor(shade * .60)})`;
      ctx.beginPath(); ctx.moveTo(0, -len);
      ctx.quadraticCurveTo(len * .65, -len * .3, 0, len);
      ctx.quadraticCurveTo(-len * .65, len * .3, 0, -len); ctx.fill();
      ctx.strokeStyle = 'rgba(206,201,137,.30)'; ctx.lineWidth = .8;
      ctx.beginPath(); ctx.moveTo(0, -len * .9); ctx.lineTo(0, len); ctx.stroke(); ctx.restore();
    }
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

export function makeThatchTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#69604a'; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2200; i++) {
    const x = (i * 151.7) % 512, y = (i * 83.3) % 512;
    ctx.strokeStyle = ['#9c9278', '#5e5948', '#b1a58a', '#79715b'][i % 4];
    ctx.lineWidth = .7 + (i % 3) * .35;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(i) * 6, y + 20 + i % 90); ctx.stroke();
  }
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(5, 2);
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

export function makeBambooLeafTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  // Fine drooping twigs with long pointed leaves, deliberately unlike the broad-leaf tree atlas.
  for (let twig = 0; twig < 5; twig++) {
    const startX = 90, startY = 400, endX = 200 + twig * 60, endY = 65 + Math.abs(twig - 2) * 55;
    ctx.lineWidth = twig === 2 ? 3 : 1.7; ctx.strokeStyle = '#3d512b';
    ctx.beginPath(); ctx.moveTo(startX, startY); ctx.quadraticCurveTo(220, 150, endX, endY); ctx.stroke();
    for (let i = 1; i < 8; i++) {
      const t = i / 8;
      const x = (1 - t) ** 2 * startX + 2 * (1 - t) * t * 220 + t * t * endX;
      const y = (1 - t) ** 2 * startY + 2 * (1 - t) * t * 150 + t * t * endY;
      const direction = i % 2 ? 1 : -1;
      const dx = direction * (42 + (i * 11 + twig * 7) % 32), dy = 10 + (i * 19) % 30;
      ctx.fillStyle = ['#3e602f', '#53783b', '#6f8e49', '#36542b'][(i + twig) % 4];
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + dx * .52, y + dy * .5 - 10, x + dx, y + dy);
      ctx.quadraticCurveTo(x + dx * .42, y + dy * .6 + 6, x, y); ctx.fill();
      ctx.strokeStyle = '#82945b66'; ctx.lineWidth = .65;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx * .9, y + dy * .9); ctx.stroke();
    }
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}
