// Monospace so angle labels read like the radian values you'd pass to `arc()`.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// Leaves room either side of the circle for the π and 0 labels.
export const CX = 260;

// Leaves room above the circle for the 3π/2 label and below for the captions.
export const CY = 200;

// Large enough that the highlighted quarter-arc and its arrowhead stay legible at phone width.
export const R = 110;

// π/2 lands at the bottom, not the top, because the canvas y-axis points down.
export const QUARTER_POINTS = [
  { radians: "0", degrees: "0°", x: CX + R, y: CY, labelX: CX + R + 14, labelY: CY - 4, anchor: "start" },
  { radians: "π/2", degrees: "90°", x: CX, y: CY + R, labelX: CX, labelY: CY + R + 28, anchor: "middle" },
  { radians: "π", degrees: "180°", x: CX - R, y: CY, labelX: CX - R - 14, labelY: CY - 4, anchor: "end" },
  { radians: "3π/2", degrees: "270°", x: CX, y: CY - R, labelX: CX, labelY: CY - R - 32, anchor: "middle" }
] as const;
