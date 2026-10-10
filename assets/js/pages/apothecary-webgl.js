/* 百子柜渲染层：一堵会开抽屉的药柜。
 *
 * 只负责画：柜体、抽屉、签牌、灯光与拾取。数据、筛选与文案属于
 * apothecary.js，这样着色器与几何体不掺业务状态。
 *
 * 抽屉与签牌各用一个 InstancedMesh，整柜只占两次 draw call：
 * 悬停/选中只改实例矩阵，签牌靠一张 atlas 纹理配合逐实例 UV 偏移取字。
 * 网格行列随画布比例重排（横屏 16×9、方屏 12×12、竖屏 9×16），
 * 相机按柜体尺寸取景，所以手机与桌面都填满画面。
 *
 * 行列选择、位移与取景规则在 apothecary-layout.js，按 <script> 先于本包执行：
 * 键盘导航要走同一份网格，渲染层独占那份数就会和实际操作错位。 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, InstancedMesh,
  BoxGeometry, PlaneGeometry, MeshStandardMaterial, MeshBasicMaterial,
  AmbientLight, DirectionalLight, PointLight, Raycaster, Vector2, Vector3,
  Color, FogExp2, SRGBColorSpace, CanvasTexture, InstancedBufferAttribute,
  Matrix4, DynamicDrawUsage, DoubleSide
} from 'three';

const DRAWER = HerbalApothecaryLayout.DRAWER;

// 签牌 atlas 固定 16 列，与画面上的行列解耦：换网格只重排抽屉，不重画纹理。
const ATLAS = Object.freeze({ columns: 16, rows: 9 });

const { FOV, layoutFor, drawerPosition, wallSpan, frameDistance } = HerbalApothecaryLayout;

const CARD_PAPER = '#E9DCBE';
const CARD_INK = '#2A1D12';

/* 签牌只写名称，格子里塞得下两行四到六个字。 */
function buildLabelAtlas(names) {
  const cell = 176;
  const canvas = document.createElement('canvas');
  canvas.width = cell * ATLAS.columns;
  canvas.height = cell * ATLAS.rows;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#8A7358';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  names.forEach((name, index) => {
    const column = index % ATLAS.columns, row = Math.floor(index / ATLAS.columns);
    const x = column * cell, y = row * cell;
    ctx.fillStyle = CARD_PAPER;
    ctx.fillRect(x, y, cell, cell);
    ctx.strokeStyle = 'rgba(88,58,32,.40)';
    ctx.lineWidth = 5;
    ctx.strokeRect(x + 8, y + 8, cell - 16, cell - 16);
    ctx.fillStyle = CARD_INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = String(name || '');
    const lines = label.length > 4 ? [label.slice(0, Math.ceil(label.length / 2)), label.slice(Math.ceil(label.length / 2))] : [label];
    const longest = Math.max(...lines.map(line => line.length));
    const size = Math.min(cell * .48, (cell * .8) / longest);
    ctx.font = '700 ' + size.toFixed(1) + 'px "Noto Serif SC","Songti SC","STSong","SimSun",serif';
    lines.forEach((line, lineIndex) => {
      ctx.fillText(line, x + cell / 2, y + cell / 2 + (lineIndex - (lines.length - 1) / 2) * size * 1.12);
    });
  });
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/* 标签材质复用内置标准材质：只补一个逐实例 uv 偏移，其余（光照、雾、色彩空间）交给 three。 */
function labelMaterial(texture) {
  const material = new MeshStandardMaterial({ map: texture, roughness: .9, metalness: 0 });
  const divisor = 'vec2(' + ATLAS.columns.toFixed(1) + ',' + ATLAS.rows.toFixed(1) + ')';
  material.onBeforeCompile = shader => {
    shader.vertexShader = 'attribute vec2 aUvOffset;\n' + shader.vertexShader.replace(
      '#include <uv_vertex>',
      '#include <uv_vertex>\n#ifdef USE_MAP\nvMapUv = ( vMapUv / ' + divisor + ' ) + aUvOffset;\n#endif'
    );
  };
  material.customProgramCacheKey = () => 'apothecary-label';
  return material;
}

/* 每个抽屉的明度做一点确定性扰动，整墙才不会像贴了同一块贴图。 */
function grain(index) {
  const value = Math.sin((index + 1) * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

/* 选一档行列，让柜体的长宽比最接近画布的长宽比。 */
export function createApothecary(canvas, { herbs = [], onHover, onSelect, onRenderer, reducedMotion = false } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  scene.fog = new FogExp2(0x120C07, .055);
  const camera = new PerspectiveCamera(FOV, 1, .1, 200);

  const root = new Group();
  scene.add(root);

  const count = herbs.length;
  const matrix = new Matrix4();
  const open = new Float32Array(count);
  const target = new Float32Array(count);
  let grid = { columns: ATLAS.columns, rows: ATLAS.rows };
  let spanX = 0, spanY = 0;

  // 柜体：背板 + 上下横档 + 两侧立板，给整面墙一个深度轮廓。
  const carcass = new MeshStandardMaterial({ color: 0x3A2513, roughness: .88, metalness: .04 });
  const trim = new MeshStandardMaterial({ color: 0x241609, roughness: .82 });
  const back = new Mesh(new BoxGeometry(1, 1, .18), carcass);
  const bars = [0, 1, 2, 3].map(() => new Mesh(new BoxGeometry(1, 1, .46), trim));
  root.add(back, ...bars);

  const drawerMaterial = new MeshStandardMaterial({ color: 0xffffff, roughness: .76, metalness: .03 });
  const drawers = new InstancedMesh(new BoxGeometry(DRAWER.width, DRAWER.height, DRAWER.depth), drawerMaterial, count);
  drawers.instanceMatrix.setUsage(DynamicDrawUsage);
  root.add(drawers);

  const labelTexture = buildLabelAtlas(herbs.map(herb => herb.name));
  const labels = new InstancedMesh(new PlaneGeometry(DRAWER.width - .045, DRAWER.height - .04), labelMaterial(labelTexture), count);
  labels.instanceMatrix.setUsage(DynamicDrawUsage);
  const uvOffsets = new Float32Array(count * 2);
  for (let index = 0; index < count; index += 1) {
    uvOffsets[index * 2] = (index % ATLAS.columns) / ATLAS.columns;
    uvOffsets[index * 2 + 1] = 1 - (Math.floor(index / ATLAS.columns) + 1) / ATLAS.rows;
  }
  labels.geometry.setAttribute('aUvOffset', new InstancedBufferAttribute(uvOffsets, 2));
  root.add(labels);

  const markerMaterial = new MeshBasicMaterial({ color: 0xE8C179, transparent: true, opacity: .9, side: DoubleSide });
  const marker = new Mesh(new PlaneGeometry(DRAWER.width + .1, DRAWER.height + .09), markerMaterial);
  marker.visible = false;
  root.add(marker);

  const wood = new Color();
  herbs.forEach((herb, index) => {
    const seed = grain(index);
    wood.setHSL(.074 + seed * .018, .40 + seed * .1, .30 + seed * .1);
    drawers.setColorAt(index, wood);
  });
  if (drawers.instanceColor) drawers.instanceColor.needsUpdate = true;

  scene.add(new AmbientLight(0x6E5740, 1.5));
  const key = new DirectionalLight(0xFFD8A2, 2.2);
  key.position.set(-4.8, 5.6, 6.4);
  scene.add(key);
  const fill = new DirectionalLight(0x8FA9C6, .55);
  fill.position.set(5.2, -2.6, 3.6);
  scene.add(fill);
  const lamp = new PointLight(0xFFB067, 30, 22, 2);
  lamp.position.set(0, 0, 3.1);
  scene.add(lamp);

  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const focus = new Vector2(0, 0);
  const desired = new Vector2(0, 0);
  const home = new Vector3(0, 0, 10);
  const at = new Vector3(0, 0, 0);
  let width = 0, height = 0, hovered = -1, selected = -1, disposed = false, clock = 0, frame = 0;

  const positionOf = (index, layout = grid) => drawerPosition(index, layout);

  function drawInstance(index) {
    const { x, y } = positionOf(index);
    const out = open[index] * .3;
    matrix.makeTranslation(x, y, out);
    drawers.setMatrixAt(index, matrix);
    matrix.makeTranslation(x, y, DRAWER.depth / 2 + .005 + out);
    labels.setMatrixAt(index, matrix);
  }

  /* 网格重排：抽屉与签牌全部重写实例矩阵，柜体与灯光跟着缩放。 */
  function applyLayout(next) {
    grid = next;
    const span = wallSpan(grid);
    spanX = span.x;
    spanY = span.y;
    for (let index = 0; index < count; index += 1) drawInstance(index);
    drawers.instanceMatrix.needsUpdate = true;
    labels.instanceMatrix.needsUpdate = true;
    back.scale.set(spanX + .42, spanY + .42, 1);
    back.position.z = -DRAWER.depth / 2 - .11;
    const frame = [
      [spanX + .72, .3, 0, spanY / 2 + .34], [spanX + .72, .34, 0, -spanY / 2 - .36],
      [.34, spanY + 1, -spanX / 2 - .4, 0], [.34, spanY + 1, spanX / 2 + .4, 0]
    ];
    bars.forEach((bar, index) => {
      const [w, h, x, y] = frame[index];
      bar.scale.set(w, h, 1);
      bar.position.set(x, y, -.07);
    });
    lamp.position.set(0, 0, 3.1);
  }

  /* 相机取景：按柜体宽高与画布比例算出刚好框住整面墙的距离。 */
  function frameCamera(aspect) {
    const distance = frameDistance(spanX, spanY, aspect);
    home.set(0, 0, distance);
    at.set(0, 0, 0);
    camera.near = Math.max(.1, distance * .05);
    camera.far = distance * 4;
  }

  function want(index, value) {
    if (index < 0 || index >= count) return;
    if (Math.abs(target[index] - value) < .001) return;
    target[index] = value;
  }

  function hoverAt(clientX, clientY) {
    if (disposed) return -1;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return -1;
    pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(drawers, false)[0];
    const index = hit && Number.isInteger(hit.instanceId) ? hit.instanceId : -1;
    if (index !== hovered) {
      if (hovered >= 0 && hovered !== selected) want(hovered, 0);
      hovered = index;
      if (index >= 0 && index !== selected) want(index, 1);
      onHover?.(index >= 0 ? herbs[index] : null, index);
    }
    return index;
  }

  function clearHover() {
    if (hovered >= 0 && hovered !== selected) want(hovered, 0);
    if (hovered >= 0) onHover?.(null, -1);
    hovered = -1;
  }

  function select(index) {
    const next = Number.isInteger(index) && index >= 0 && index < count ? index : -1;
    if (selected >= 0 && selected !== next) want(selected, 0);
    selected = next;
    if (selected >= 0) {
      want(selected, 1);
      const { x, y } = positionOf(selected);
      desired.set(x * .45, y * .45);
      marker.position.set(x, y, DRAWER.depth / 2 + .32);
      marker.visible = true;
    } else {
      desired.set(0, 0);
      marker.visible = false;
    }
    if (!disposed) onSelect?.(selected >= 0 ? herbs[selected] : null, selected);
    return selected;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
    if (w === width && h === height) return false;
    width = w; height = h;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    applyLayout(layoutFor(count, aspect));
    frameCamera(aspect);
    if (selected >= 0) {
      const { x, y } = positionOf(selected);
      desired.set(x * .45, y * .45);
      marker.position.set(x, y, DRAWER.depth / 2 + .32 + open[selected] * .3);
    }
    return true;
  }

  function tick(delta) {
    if (disposed) return frame;
    clock += delta;
    let moved = false;
    for (let index = 0; index < count; index += 1) {
      if (open[index] === target[index]) continue;
      // 弹簧式收敛：抽屉有一点惯性，而不是匀速滑出来。
      open[index] += (target[index] - open[index]) * Math.min(1, delta * 7.5);
      if (Math.abs(target[index] - open[index]) < .002) open[index] = target[index];
      drawInstance(index);
      moved = true;
    }
    if (moved) { drawers.instanceMatrix.needsUpdate = true; labels.instanceMatrix.needsUpdate = true; }
    if (selected >= 0 && marker.visible) {
      const { x, y } = positionOf(selected);
      marker.position.set(x, y, DRAWER.depth / 2 + .32 + open[selected] * .3);
    }
    focus.lerp(desired, Math.min(1, delta * 3.2));
    const sway = reducedMotion ? 0 : Math.sin(clock * .13);
    const lift = reducedMotion ? 0 : Math.sin(clock * .09);
    // 视差幅度按取景距离缩放，近景不晃出画外。
    camera.position.set(home.x + sway * home.z * .045, home.y + lift * home.z * .02, home.z);
    camera.lookAt(at.x + focus.x, at.y + focus.y, at.z);
    renderer.render(scene, camera);
    return ++frame;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    drawers.geometry.dispose(); drawerMaterial.dispose();
    labels.geometry.dispose(); labels.material.dispose();
    marker.geometry.dispose(); markerMaterial.dispose();
    back.geometry.dispose(); carcass.dispose(); trim.dispose();
    bars.forEach(bar => bar.geometry.dispose());
    labelTexture.dispose();
    renderer.dispose();
  }

  resize();
  onRenderer?.('apothecary', count);
  return {
    tick,
    hoverAt,
    clearHover,
    select,
    resize,
    dispose,
    state: () => ({
      hovered, selected, frame, count,
      columns: grid.columns, rows: grid.rows,
      open: selected >= 0 ? open[selected] : 0,
      camera: { x: camera.position.x, y: camera.position.y, z: camera.position.z }
    })
  };
}
