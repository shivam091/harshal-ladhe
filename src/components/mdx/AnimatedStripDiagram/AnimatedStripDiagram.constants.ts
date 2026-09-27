// The post's own animated example — the first and last stops match, which is what makes 200% land back on 0%.
export const GRADIENT_STOPS = ["#ff6a00", "#ee0979", "#00c6ff", "#ff6a00"];

// The text's box — fixed in place, since it's the gradient that moves, not the text.
export const WINDOW = { x: 270, width: 120 };

// background-size: 200% auto — one full copy of the gradient is twice as wide as the text.
export const TILE_WIDTH = WINDOW.width * 2;

// The slice of the (repeating) strip drawn in each row: wide enough to show the window plus the gradient around it.
export const STRIP = { x: 150, width: 360, height: 14 };

/*
  One row per keyframe position. With a background twice the element's width, background-position: p% shifts the
  strip left by p% of the element's width — so 200% moves it exactly one tile, back to where it started.
*/
export const ROWS = [
  { position: "0%", caption: "animation starts", shift: 0, y: 64 },
  { position: "100%", caption: "halfway", shift: WINDOW.width, y: 150 },
  { position: "200%", caption: "same as 0% — loops", shift: WINDOW.width * 2, y: 236 }
].map((row) => ({ ...row, tileStart: WINDOW.x - row.shift }));

// Where one copy of the gradient ends and the next begins, for the tile-edge ticks drawn on each strip.
export function tileEdges(tileStart: number): number[] {
  const edges: number[] = [];
  for (let k = -2; k <= 2; k += 1) {
    const x = tileStart + k * TILE_WIDTH;
    if (x >= STRIP.x && x <= STRIP.x + STRIP.width) edges.push(x);
  }
  return edges;
}

// Glyph size for the word shown under each strip.
export const WORD_FONT_SIZE = 30;
