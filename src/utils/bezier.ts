import { clamp } from "@/utils/number";
import { toPlotPoint, getPlotInset } from "@/utils/plot";
import type { BezierPoint } from "@/types/bezier";

export { toPlotPoint };

// Cubic bezier x(t) for fixed anchors P0=(0,0)/P3=(1,1) plus the two control points.
function bezierX(t: number, p1: BezierPoint, p2: BezierPoint): number {
  const mt = 1 - t;
  return 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t * t * t;
}

// Cubic bezier y(t) for fixed anchors P0=(0,0)/P3=(1,1) plus the two control points.
function bezierY(t: number, p1: BezierPoint, p2: BezierPoint): number {
  const mt = 1 - t;
  return 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t * t * t;
}

/*
  Solves for the progress (y) at a given elapsed-time ratio (x) — the same computation the
  browser performs every frame to turn a `transition-timing-function` into a value. x(t) is
  itself a cubic bezier, so there's no closed-form inverse; binary search over t converges on
  the matching x within ~30 iterations, which is cheap enough for a 60fps animation loop. Only
  valid when x1/x2 stay within [0,1] (guaranteed by every curve in EASING_CURVES and by
  CubicBezierPlayground's drag clamp), which keeps x(t) monotonic.
*/
export function solveBezierY(x: number, p1: BezierPoint, p2: BezierPoint): number {
  const targetX = clamp(x, 0, 1);

  let lo = 0;
  let hi = 1;
  let t = targetX;

  for (let i = 0; i < 30; i++) {
    t = (lo + hi) / 2;
    const currentX = bezierX(t, p1, p2);
    if (Math.abs(currentX - targetX) < 1e-6) break;
    if (currentX < targetX) lo = t; else hi = t;
  }

  return bezierY(t, p1, p2);
}

// Builds the SVG path `d` for a cubic-bezier curve plot of the given pixel size, sharing toPlotPoint's inset so the curve's endpoints line up exactly with the plot's corners.
export function buildBezierPathD(p1: BezierPoint, p2: BezierPoint, size: number): string {
  const inset = getPlotInset(size);
  const min = inset;
  const max = size - inset;

  const [x1, y1] = toPlotPoint(p1, size);
  const [x2, y2] = toPlotPoint(p2, size);

  return `M${min},${max} C${x1} ${y1}, ${x2} ${y2}, ${max},${min}`;
}
