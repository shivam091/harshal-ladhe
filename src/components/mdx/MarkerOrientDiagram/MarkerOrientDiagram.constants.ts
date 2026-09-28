// Width of each of the 3 side-by-side panels — the viewBox is exactly 3 of these.
export const PANEL_WIDTH = 220;

/*
  The bent path, in panel-local coordinates. Symmetric about x=110 so the incoming (up-right) and outgoing
  (down-right) directions at the middle vertex bisect to exactly 0°, which makes the bisector easy to see.
*/
export const PATH_POINTS = { start: { x: 30, y: 170 }, mid: { x: 110, y: 70 }, end: { x: 190, y: 170 } };

/*
  One panel per orient value. `withMid` is only on for "auto" because that is the only value where the interior
  vertex's angle is interesting — the bisector of the two segments meeting there.
*/
export const PANELS = [
  { id: "fixed", orient: "0", title: "orient=\"0\"", withMid: false, caption: ["Fixed angle: both arrows point", "along +x, ignoring the line"] },
  { id: "auto", orient: "auto", title: "orient=\"auto\"", withMid: true, caption: ["Follows travel: the start arrow", "points inward; mid uses the bisector"] },
  { id: "reverse", orient: "auto-start-reverse", title: "orient=\"auto-start-reverse\"", withMid: false, caption: ["Like auto, but marker-start is", "flipped 180° to face outward"] }
];
