// Partial coverage must survive into the markup, or the anti-aliased edge would vanish.
export interface PixelCell {
  // Position within the patch, since each patch has its own origin.
  x: number;
  // Position within the patch, since each patch has its own origin.
  y: number;
  // Differs between resolutions, so it travels with the cell.
  size: number;
  // Mirrors a real canvas's anti-aliasing, so edges look as they would on screen.
  alpha: number;
}
