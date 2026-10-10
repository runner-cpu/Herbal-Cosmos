/* 百子柜的几何与网格契约：不碰 DOM、不碰 WebGL，只算数。
 *
 * 渲染层（apothecary-webgl.js）与键盘导航（apothecary.js）共用这里的
 * 行列选择与位移规则，测试也直接跑这个文件，不必起动 three.js。
 * 抽屉墙的行列随画布比例变化，所以「上/下一行」的步长不是常数，
 * 任何写死列数的写法都会在换比例后错位。 */
(function (root) {
  'use strict';

  const DRAWER = Object.freeze({ width: .52, height: .36, depth: .30, gapX: .034, gapY: .034 });
  // 144 = 16×9 = 18×8 = 24×6 = 12×12 = 9×16 …… 按画布比例挑最贴合的一档。
  const LAYOUTS = Object.freeze([[16, 9], [18, 8], [24, 6], [36, 4], [12, 12], [9, 16], [8, 18], [6, 24], [4, 36]]);

  const FOV = 40;
  const FRAME_MARGIN = 1.12;

  function layoutFor(count, aspect) {
    let best = LAYOUTS[0], bestScore = Infinity;
    for (const [columns, rows] of LAYOUTS) {
      if (columns * rows < count) continue;
      const wall = (columns * (DRAWER.width + DRAWER.gapX)) / (rows * (DRAWER.height + DRAWER.gapY));
      const score = Math.abs(Math.log(wall / Math.max(.2, aspect)));
      if (score < bestScore) { bestScore = score; best = [columns, rows]; }
    }
    const [columns, rows] = best;
    // 格子数多于本草数时，把多出来的格子留在最后一行的末尾，不让本草被压缩。
    return { columns, rows: Math.max(rows, Math.ceil(count / columns)) };
  }

  // 第 index 个抽屉的中心。行序自上而下，所以 y 随行号递减。
  function drawerPosition(index, layout) {
    return {
      x: ((index % layout.columns) - (layout.columns - 1) / 2) * (DRAWER.width + DRAWER.gapX),
      y: ((layout.rows - 1) / 2 - Math.floor(index / layout.columns)) * (DRAWER.height + DRAWER.gapY)
    };
  }

  // 整面墙的宽高，含格间缝，不含外框。
  function wallSpan(layout) {
    return {
      x: layout.columns * (DRAWER.width + DRAWER.gapX),
      y: layout.rows * (DRAWER.height + DRAWER.gapY)
    };
  }

  // 相机取景：按柜体宽高与画布比例算出刚好框住整面墙的距离。
  function frameDistance(spanX, spanY, aspect, fov = FOV, margin = FRAME_MARGIN) {
    const half = Math.tan((fov * Math.PI) / 360);
    const byHeight = (spanY + .78) / (2 * half);
    const byWidth = (spanX + .78) / (2 * half * Math.max(.2, aspect));
    return Math.max(byHeight, byWidth) * margin;
  }

  // 方向键位移。左右不跨行，上下保持所在列，越界就停在原地。
  function moveIndex(index, key, layout, count) {
    if (!Number.isInteger(index) || index < 0 || index >= count) return index;
    const column = index % layout.columns, row = Math.floor(index / layout.columns);
    if (key === 'ArrowLeft') return column > 0 ? index - 1 : index;
    if (key === 'ArrowRight') return column < layout.columns - 1 && index + 1 < count ? index + 1 : index;
    if (key === 'ArrowUp') return row > 0 ? index - layout.columns : index;
    if (key === 'ArrowDown') {
      const next = index + layout.columns;
      return next < count ? next : index;
    }
    return index;
  }

  root.HerbalApothecaryLayout = { DRAWER, LAYOUTS, FOV, FRAME_MARGIN, layoutFor, drawerPosition, wallSpan, frameDistance, moveIndex };
})(typeof window === 'undefined' ? globalThis : window);
