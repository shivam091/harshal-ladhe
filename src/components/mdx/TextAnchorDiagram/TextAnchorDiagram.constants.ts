// The one shared x every row anchors to — centred so both start and end rows have room to extend fully.
export const ANCHOR_X = 310;

// Vertical span of the guide line, reaching a little past the first and last rows.
export const GUIDE = { y1: 34, y2: 188 };

// One row per text-anchor value, each on its own baseline so the three strings never overlap.
export const ROWS = [
  { value: "start", y: 72 },
  { value: "middle", y: 122 },
  { value: "end", y: 172 }
] as const;
