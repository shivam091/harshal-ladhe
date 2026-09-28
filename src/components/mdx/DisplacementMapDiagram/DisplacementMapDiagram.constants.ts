// The scale the worked numbers assume — 40 keeps every resulting offset a whole number.
export const SCALE = 40;

// Visual pixels drawn per user unit of offset, so a ±20 shift reads clearly without crowding neighbouring columns.
export const ARROW_MULTIPLIER = 2;

// Side of each sample "pixel" swatch.
export const SWATCH_SIZE = 50;

/*
  Five evenly spaced channel values from 0 to 1, each with its column centre. Five, not three, so the linear
  relationship (equal steps in C give equal steps in offset) is visible, not just the two extremes and the middle.
*/
export const SAMPLES = [
  { value: 0, cx: 104 },
  { value: 0.25, cx: 212 },
  { value: 0.5, cx: 320 },
  { value: 0.75, cx: 428 },
  { value: 1, cx: 536 }
];
