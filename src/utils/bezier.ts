import { clamp } from "@/utils/number";
import { toPlotPoint, getPlotInset } from "@/utils/plot";

export { toPlotPoint };

// Matches cubic-bezier()'s own (x, y) pairs, so values copy straight between CSS and code.
export type BezierPoint = [number, number];

// Anchors are fixed at (0,0) and (1,1), as in every CSS timing function, so only the control points vary.
function bezierX(t: number, p1: BezierPoint, p2: BezierPoint): number {
  const mt = 1 - t;
  return 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t * t * t;
}

// Kept apart from bezierX because the solver searches on x alone.
function bezierY(t: number, p1: BezierPoint, p2: BezierPoint): number {
  const mt = 1 - t;
  return 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t * t * t;
}

/*
  Races and trails need progress at a given moment, but a bezier is defined by its own curve
  parameter rather than by time, and there's no neat formula to convert. A short bisection
  search is simple and cheap enough to run every frame. Only valid while x1/x2 stay within 0–1,
  which the CSS spec requires anyway and which keeps the search well-defined.
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

// Uses SVG's native cubic command, so the drawn curve is the exact bezier rather than a sampled approximation.
export function buildBezierPathD(p1: BezierPoint, p2: BezierPoint, size: number): string {
  const inset = getPlotInset(size);
  const min = inset;
  const max = size - inset;

  const [x1, y1] = toPlotPoint(p1, size);
  const [x2, y2] = toPlotPoint(p2, size);

  return `M${min},${max} C${x1} ${y1}, ${x2} ${y2}, ${max},${min}`;
}
