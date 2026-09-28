/*
  The two target elements each clip is applied to — a square and a 2:1 wide box of equal height — so the only
  thing that differs between columns is the aspect ratio, which is exactly what objectBoundingBox reacts to.
*/
export const TARGETS = [
  { key: "square", x: 180, width: 120, header: "square target (120 × 120)" },
  { key: "wide", x: 360, width: 240, header: "wide target (240 × 120)" }
];

// Shared target height; both columns keep it so the ellipse's stretch can only come from width.
export const TARGET_HEIGHT = 120;

/*
  One row per clipPathUnits value. `radius` returns the clip circle's rendered radii for a given target width:
  objectBoundingBox scales r=0.5 by width and height separately, userSpaceOnUse keeps r=50 fixed.
*/
export const ROWS = [
  {
    y: 50,
    title: "objectBoundingBox",
    note: "r = 0.5 of each axis",
    radius: (width: number) => ({ rx: width / 2, ry: TARGET_HEIGHT / 2 })
  },
  {
    y: 210,
    title: "userSpaceOnUse",
    note: "r = 50 user units",
    radius: () => ({ rx: 50, ry: 50 })
  }
];
