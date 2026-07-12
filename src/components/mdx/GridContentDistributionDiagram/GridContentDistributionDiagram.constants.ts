// Width of each of the 3 fixed-size tracks every row distributes.
export const TRACK_W = 50;

// Height of each track box.
export const TRACK_H = 50;

// Vertical padding inside the container, above/below the track boxes.
export const PAD_Y = 15;

// Container height, derived from the track height plus top/bottom padding.
export const CONTAINER_H = TRACK_H + 2 * PAD_Y;

/*
  Container width: 3 tracks at TRACK_W each (150px) leaves 180px of leftover space for each row's
  distribution rule to place — the same "grid is smaller than its container" situation the post's
  own Common Mistakes note describes.
*/
export const CONTAINER_W = 330;

// Left x coordinate of every row's container/tracks.
export const ORIGIN_X = 40;

// Baseline-to-container-top gap reserved for each row's caption.
export const CAPTION_GAP = 18;

// Vertical gap between one row's container bottom and the next row's caption.
export const ROW_GAP = 24;

// Full height of one row block (caption + container + gap to the next row).
const ROW_BLOCK_H = CAPTION_GAP + CONTAINER_H + ROW_GAP;

// Each row's caption baseline y, stacked one ROW_BLOCK_H apart.
export const ROW_CAPTION_Y = [30, 30 + ROW_BLOCK_H, 30 + 2 * ROW_BLOCK_H];

// Each row's container top y, offset from its own caption by CAPTION_GAP.
export const ROW_CONTAINER_Y = ROW_CAPTION_Y.map((y) => y + CAPTION_GAP);

/*
  Each row's 3 track x-offsets (relative to ORIGIN_X), precomputed from the actual CSS distribution
  formula for 3 fixed 50px tracks inside a 330px container (180px of leftover space, n = 3 tracks):
    - space-between: gap = leftover / (n - 1) = 90, no edge gap.
    - space-around:  unit = leftover / n = 60, edge gap = unit / 2 = 30, between-gap = unit = 60.
    - space-evenly:  gap = leftover / (n + 1) = 45, every gap (edge or between) is equal.
  The middle track lands at the same x (140) in all three — the symmetric centre of 3 equal tracks
  doesn't move, only the two outer tracks and the gap sizes around them change.
*/
export const ROWS = [
  { caption: "justify-content: space-between;", trackX: [0, 140, 280] },
  { caption: "justify-content: space-around;", trackX: [30, 140, 250] },
  { caption: "justify-content: space-evenly;", trackX: [45, 140, 235] }
];
