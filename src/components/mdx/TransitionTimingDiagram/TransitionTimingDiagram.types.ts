// The 5 keyword timing functions this post's own "Common Timing Functions" table covers.
export type TransitionTimingCurve = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";

// One timing function's cubic-bezier control points plus how to draw it, matching its spec-defined keyword values.
export interface TransitionTimingCurveConfig {
  // x coordinate (0-1) of the first control point, i.e. the x1 in cubic-bezier(x1, y1, x2, y2).
  p1x: number;
  // y coordinate of the first control point — can exceed 0-1 for overshoot curves, though none of these 5 do.
  p1y: number;
  // x coordinate of the second control point.
  p2x: number;
  // y coordinate of the second control point.
  p2y: number;
  // Theme color token this curve is stroked with.
  color: string;
  // Whether this curve is drawn dashed, used for the "linear" reference baseline.
  dashed: boolean;
}
