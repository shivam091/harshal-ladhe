/*
  The browser viewport, drawn at 1 diagram unit per CSS pixel so the client-space numbers can be read straight
  off the geometry. Its top-left corner is client (0, 0).
*/
export const VIEWPORT = { x: 20, y: 40, width: 280, height: 280 };

// The rendered <svg> box inside the viewport: client left 40, top 60, 200 × 200 CSS px.
export const SVG_BOX = { left: 40, top: 60, size: 200 };

// Pointer position in client pixels — chosen so the conversion lands on round user-unit numbers (75, 50).
export const POINTER = { clientX: 190, clientY: 160 };

// Right-hand user-space panel: a 100 × 100 viewBox drawn at 2.4 diagram units per user unit.
export const USER_PANEL = { x: 400, y: 60, size: 240 };

// The viewBox extent the panel represents, matching the example's viewBox="0 0 100 100".
export const VIEWBOX_SIZE = 100;

// Gridline positions in user units — quarters keep the (75, 50) result sitting exactly on a gridline crossing.
export const GRID_STEPS = [0, 25, 50, 75, 100];
