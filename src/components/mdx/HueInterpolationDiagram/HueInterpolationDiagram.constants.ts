// Center of each hue-wheel panel, in that panel's own local coordinate space (before translation).
export const PANEL_CENTER = { x: 130, y: 140 };

// Outer radius of the ring itself (the <foreignObject> conic-gradient donut) and the radius the
// travel-arc guide is drawn at, just outside the ring — mirrors ConicGradientDiagram's own
// RADIUS/ARC_OUTER_RADIUS pair (arc drawn outside the wheel, never overlapping it).
export const RING_R = 92;
export const ARC_R = 110;

// Horizontal translation applied to the 2nd ("longer hue") panel so the two sit side by side.
export const PANEL_OFFSET_X = 300;

/*
  The two hues every panel marks — deliberately the same pair in both panels, since the one fact this
  diagram exists to teach is that "shorter hue" and "longer hue" pick DIFFERENT paths (and therefore
  different in-between colors) between the exact same two colors, not different colors.
*/
export const HUE_A = 40; // amber
export const HUE_B = 250; // blue-violet
export const HUE_A_COLOR = "hsl(40, 80%, 55%)";
export const HUE_B_COLOR = "hsl(250, 80%, 60%)";

/*
  Angle-to-point helper, computed once at module load: 0deg is straight up and angles increase clockwise,
  the same convention `conic-gradient()` itself uses — so a marker placed at angle N sits exactly on top of
  the ring's own hsl(N, ...) colored segment below, with no separate lookup needed to keep them in sync.
*/
function pointAt(deg: number, radius: number, center: { x: number; y: number }) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: center.x + radius * Math.sin(rad),
    y: center.y - radius * Math.cos(rad)
  };
}

// Marker dots sit ON the ring (at RING_R); arc endpoints sit just OUTSIDE it (at ARC_R).
export const MARKER_A = pointAt(HUE_A, RING_R, PANEL_CENTER);
export const MARKER_B = pointAt(HUE_B, RING_R, PANEL_CENTER);
export const ARC_POINT_A = pointAt(HUE_A, ARC_R, PANEL_CENTER);
export const ARC_POINT_B = pointAt(HUE_B, ARC_R, PANEL_CENTER);

/*
  Both arcs run between the exact same two points above — only the SVG arc command's sweep flag (which
  side it bulges toward) and large-arc flag (whether it's the >180deg reflex arc) differ, mirroring how
  `shorter hue` vs `longer hue` are the same two colors, just a different arc between them.

  clockwise (increasing hue, 40 -> 250 forward through 50,60,...,240): 210deg — this is the LONGER arc.
  counterclockwise (decreasing hue, 40 -> 250 backward through 30,20,...,0,350,...,260): 150deg — SHORTER.
*/
export const SHORTER_ARC = { largeArc: 0, sweep: 0, degrees: 150, throughLabel: "through magenta / violet" };
export const LONGER_ARC = { largeArc: 1, sweep: 1, degrees: 210, throughLabel: "through green / cyan / blue" };
