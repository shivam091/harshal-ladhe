// Number of balls in the row.
export const NUM_BALLS = 8;

// Diameter of each ball, in px — matches BallWrapper's fixed inline-size/block-size in FooterDivider.styles.ts.
export const BALL_SIZE_PX = 16;

// Horizontal gap between balls, in px — matches Wrapper's `gap` in FooterDivider.styles.ts.
export const BALL_GAP_PX = 12;

// How far (in px) the cursor can be from a ball's center before it stops contributing to that ball's fill.
export const AREA_OF_EFFECT_RADIUS_PX = (BALL_SIZE_PX + BALL_GAP_PX) * 10;

// Blur applied to a ball at rest (cursor fully away) — sharpens to 0 as the cursor nears its center, like it's coming into focus.
export const MAX_BLUR_PX = 4;

// Radius (from the row's center) within which the cursor is tracked at all — row half-width plus the area of effect, so a ball starts filling just before the cursor reaches it.
export const ROW_PROXIMITY_RADIUS_PX = (NUM_BALLS * (BALL_SIZE_PX + BALL_GAP_PX)) / 2 + AREA_OF_EFFECT_RADIUS_PX;

// Curated rainbow hues assigned to balls left-to-right (not evenly spaced, for a more pleasant gradient).
export const BALL_COLORS: string[] = [
  "hsl(350deg 100% 65%)",
  "hsl(25deg 100% 65%)",
  "hsl(50deg 100% 65%)",
  "hsl(150deg 100% 65%)",
  "hsl(210deg 100% 65%)",
  "hsl(240deg 100% 65%)",
  "hsl(260deg 100% 70%)",
  "hsl(300deg 100% 65%)"
];
