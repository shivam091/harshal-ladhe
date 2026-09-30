/*
  Stroke width shared by both corners. Kept large (24 units) so the miter spike and the bevel are big enough to
  annotate; every coordinate below is derived from it via miter length = width / sin(θ / 2).
*/
export const STROKE_WIDTH = 24;

/*
  The two corners, one either side of the default miterlimit of 4. 30° gives a ratio of 3.86 (just under, so the
  miter survives); 20° gives 5.76 (over, so the renderer bevels). Coordinates are pre-computed from the formula
  so the annotated tip, inner corner and bevel line sit exactly where the browser draws the join.
*/
export const CORNERS = [
  {
    key: "pass",
    cx: 165,
    arms: "115.8,333.5 165,150 214.2,333.5",
    title: "30° corner",
    ratio: "1 / sin(15°) ≈ 3.86 ≤ 4",
    verdict: "→ miter is drawn",
    arc: "M131.4,275.6 A130,130 0 0 0 198.6,275.6",
    angleLabel: "30°"
  },
  {
    key: "fail",
    cx: 495,
    arms: "462,337.1 495,150 528,337.1",
    title: "20° corner",
    ratio: "1 / sin(10°) ≈ 5.76 > 4",
    verdict: "→ falls back to bevel",
    arc: "M472.4,278 A130,130 0 0 0 517.6,278",
    angleLabel: "20°"
  }
];

// The 30° corner's miter tip and inner corner — the two ends of the "miter length" the ratio is measured on.
export const PASS_MITER = { tipY: 103.6, innerY: 196.4 };

// A perpendicular across the 30° corner's left arm, 150 units from the vertex, marking one stroke-width.
export const WIDTH_DIMENSION = { x1: 137.8, y1: 298, x2: 114.6, y2: 291.8 };

// The 20° corner's would-be miter: the two outer stroke corners at the vertex, plus the tip they'd extend to.
export const FAIL_MITER = "483.2,147.9 495,80.9 506.8,147.9";
