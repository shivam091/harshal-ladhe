// Tile size in tile units — every tile's content below is authored against this 40 × 40 square.
export const TILE = 40;

// The motif's radius — large enough that half of it spilling past the tile edge is obvious.
export const RADIUS = 12;

// Scale of the enlarged single-tile view, so the clipped half-circle is easy to read.
export const TILE_VIEW_SCALE = 2;

// Scale of each tile in the 3 × 3 tiled result — smaller than the single-tile view so the whole grid fits.
export const RESULT_SCALE = 1.5;

// Rows and columns in the tiled result — 3 is the minimum that shows a seam on every side of the centre tile.
export const RESULT_COUNT = 3;

// Vertical layout shared by both panels: the enlarged tile, the arrow between, and the tiled result.
export const LAYOUT = { tileTop: 44, arrowTop: 132, arrowBottom: 158, resultTop: 164, captionY: 366 };

/*
  The 2 compared tiles. Both place a circle centred on the tile's right edge; the fixed tile adds a copy centred on
  the left edge, one tile-width away, so the half clipped off the right re-enters from the next tile's left.
*/
export const PANELS = [
  {
    key: "cut",
    centreX: 160,
    title: "circle crosses the edge",
    caption: "each tile clips the circle — half-moons, not circles",
    copies: [{ cx: TILE, cy: TILE / 2, tone: "accent" }]
  },
  {
    key: "seamless",
    centreX: 480,
    title: "copy on the opposite edge",
    caption: "the two halves meet across every seam",
    copies: [
      { cx: TILE, cy: TILE / 2, tone: "accent" },
      { cx: 0, cy: TILE / 2, tone: "attention" }
    ]
  }
];
