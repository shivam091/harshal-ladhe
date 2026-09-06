// Fixed size of one grid cell in the immediate-mode "pixel buffer" pattern.
export const PIXEL_CELL = 10;

// The 3 example SVG child elements shown as individually addressable DOM nodes hanging off <svg>.
export const SVG_CHILDREN = [
  { x: 14, y: 128, w: 62, label: "<rect>" },
  { x: 89, y: 128, w: 62, label: "<circle>" },
  { x: 164, y: 128, w: 62, label: "<path>" }
];

// The 3 example Canvas 2D drawing commands, issued in order, that all collapse into one shared pixel buffer.
export const CANVAS_DRAW_CALLS = [
  { y: 38, label: "ctx.fillRect()" },
  { y: 72, label: "ctx.arc()" },
  { y: 106, label: "ctx.fillText()" }
];

/*
  A handful of fixed (not randomly generated) small squares scattered inside the pixel-buffer box, standing
  in for "some pixels got painted here" — deterministic so server and client render identically.
*/
export const PAINTED_PIXELS = [
  { x: 16, y: 14, size: 10 },
  { x: 34, y: 30, size: 14 },
  { x: 60, y: 12, size: 8 },
  { x: 88, y: 34, size: 12 },
  { x: 20, y: 52, size: 10 },
  { x: 108, y: 16, size: 10 },
  { x: 70, y: 50, size: 8 }
];
