// Arrow colour roles, so each loop's return arrow can carry its own accent.
export type CanvasRenderLoopArrowTone = "muted" | "danger" | "success";

// A step as data, so both loops are laid out from the same shape and stay comparable.
export interface CanvasRenderLoopBox {
  // Top-left corner, because SVG <rect> positions from there rather than from the centre.
  x: number;
  // Pairs with x; each lane snakes over its own rows, so y can't be shared.
  y: number;
  // Width of the box, so the long `requestAnimationFrame` label gets room without widening every box.
  w: number;
  // Step names are what the diagram teaches, so they live with the geometry.
  label: string;
  // Code-named steps need monospace so they read as calls, not prose.
  mono: boolean;
}

// An arrow as path data, so elbowed return arrows need no special case.
export interface CanvasRenderLoopArrow {
  // Raw path data lets straight and elbowed arrows share one shape.
  d: string;
  // Return arrows carry their lane's accent so each loop reads as a closed cycle.
  tone: CanvasRenderLoopArrowTone;
}
