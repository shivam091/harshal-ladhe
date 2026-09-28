// Tile size in panel units — coarse enough that the rotated grid's individual cells stay easy to follow.
export const TILE = 40;

// Rotation angle shown in both panels — 30° rather than 45° so the rotated grid can't be mistaken for a symmetric diamond pattern.
export const ANGLE = 30;

// Each panel's user-space extent; its top-left corner stands in for the SVG's (0,0) origin.
export const PANEL = { width: 260, height: 200 };

// The filled shape — identical in both panels and never transformed, since patternTransform leaves the outline alone.
export const SHAPE = { x: 40, y: 40, width: 180, height: 120 };

// Enough tiles either side of the origin that the rotated grid still covers the whole panel after rotation.
export const GRID_RANGE = 10;

/*
  The 2 compared panels. Both rotate by the same angle; only the pivot changes — the user-space origin by default,
  or the shape's own centre via rotate()'s optional cx/cy arguments.
*/
export const PANELS = [
  {
    key: "origin",
    offsetX: 30,
    offsetY: 56,
    pivotX: 0,
    pivotY: 0,
    title: "patternTransform=\"rotate(30)\"",
    caption: "grid pivots around (0,0), the user-space origin"
  },
  {
    key: "centre",
    offsetX: 350,
    offsetY: 56,
    pivotX: 130,
    pivotY: 100,
    title: "patternTransform=\"rotate(30 130 100)\"",
    caption: "grid pivots around the shape's centre"
  }
];
