// The same 24-unit star the post's sprite examples use, so the diagram shows the exact artwork the reader just saw in markup.
export const STAR_PATH = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

// Vertical centre every box aligns to, so size differences read as scale rather than position.
export const CENTER_Y = 130;

// The symbol's own 24 × 24 canvas, drawn at 5px per unit so its 4-unit grid lines are clearly visible.
export const SYMBOL_BOX = { x: 20, y: 70, size: 120 };

// Grid spacing inside the symbol box — every 4 viewBox units, matching the 24-unit icon grid designers usually work on.
export const GRID_STEP = 20;

/*
  The four use instances, drawn at 2.5px per use unit. The first three match the symbol's 1:1 aspect ratio and only
  change scale; the last is deliberately 2:1 so preserveAspectRatio's default "xMidYMid meet" letterboxing is visible.
*/
export const INSTANCES = [
  { x: 200, width: 40, height: 40, label: "16 × 16", note: "scale 0.67×" },
  { x: 264, width: 60, height: 60, label: "24 × 24", note: "scale 1×" },
  { x: 348, width: 80, height: 80, label: "32 × 32", note: "scale 1.33×" },
  { x: 452, width: 120, height: 60, label: "48 × 24", note: "meet: 1×, centred" }
];
