// Geometry is computed in canvas space, where y grows downwards.
export interface Point {
  // Relative to the frame's (0,0), matching the canvas origin.
  x: number;
  // Grows downwards, as on a real canvas.
  y: number;
}
