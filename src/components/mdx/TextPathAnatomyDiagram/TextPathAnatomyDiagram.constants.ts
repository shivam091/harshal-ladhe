// A single quadratic arch — symmetric and gentle, so the tangent and the startOffset segment are easy to read.
export const CURVE_D = "M 80 240 Q 320 30 560 240";

// Where the path's own data begins and ends — the start is what startOffset is measured from.
export const PATH_START = { x: 80, y: 240 };
export const PATH_END = { x: 560, y: 240 };

// startOffset used by the live <textPath> and the highlighted arc segment — one value so the two can never disagree.
export const START_OFFSET_PERCENT = 25;

/*
  Point 25% of the arc length along CURVE_D, and the unit tangent there — computed numerically from the curve's
  arc length (t ≈ 0.231), not from t = 0.25, because a Bézier's t is not proportional to distance travelled.
*/
export const OFFSET_POINT = { x: 190.7, y: 165.5 };
export const OFFSET_TANGENT = { dx: 0.905, dy: -0.426 };

// Half-length of the drawn tangent segment — short enough not to run through more than the first glyph.
export const TANGENT_HALF = 34;
