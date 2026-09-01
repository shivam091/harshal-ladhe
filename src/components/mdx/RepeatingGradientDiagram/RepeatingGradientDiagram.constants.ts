// The two stripe colors, matching the post's own repeating-linear-gradient code example.
export const STRIPE_A = "#4338ca";
export const STRIPE_B = "#22d3ee";

// Bounds of the horizontal stripe bar — its left edge is also the gradient's own x1, so the first stripe
// tile lines up exactly with the "repeat unit" bracket drawn above it.
export const BAR = { x: 20, y: 60, w: 380, h: 60 };

// Width of one repeat unit (one full pass through the color stops) — 20px, matching the post's own example.
export const UNIT_W = 20;

// Center and outer radius of the radial swatch panel below the bar.
export const RADIAL_PANEL = { cx: 220, cy: 260, outerR: 70 };

// Radius of one repeat unit in the radial swatch — same 20px unit, just measured outward instead of sideways.
export const RADIAL_UNIT_R = 20;
