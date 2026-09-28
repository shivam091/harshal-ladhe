// Tile size in panel units — big enough that a dot, its tile outline, and the width/height ticks all stay legible.
export const TILE = 40;

// Dot radius — large enough that a dot cut by the shape's edge is visibly a partial circle, not a stray pixel.
export const DOT_RADIUS = 8;

// Each panel's own user-space extent; (0,0) is the panel's top-left corner, standing in for the SVG's user-space origin.
export const PANEL = { width: 250, height: 200 };

/*
  The filled shape, deliberately placed off the tile grid (22 is not a multiple of 40) so the default anchoring
  visibly misses the shape's corner.
*/
export const SHAPE = { x: 22, y: 22, width: 190, height: 130 };

/*
  The 2 compared panels: identical shape and tile size, differing only in the pattern's x/y — isolating tile
  anchoring as the single variable being taught.
*/
export const PANELS = [
  {
    key: "origin",
    offsetX: 44,
    offsetY: 60,
    anchorX: 0,
    anchorY: 0,
    title: "x=\"0\" y=\"0\" (the default)",
    caption: "tiles start at (0,0), so edge dots are cut"
  },
  {
    key: "shape",
    offsetX: 354,
    offsetY: 60,
    anchorX: 22,
    anchorY: 22,
    title: "x=\"22\" y=\"22\" (the rect's corner)",
    caption: "the first tile starts at the rect's corner"
  }
];
