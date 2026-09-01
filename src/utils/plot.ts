import { normalize } from "@/utils/number";

// Inset (in px) kept between a plot's edge and its extreme points, so a point sitting exactly at an extreme still renders fully on-canvas instead of clipped. Shared by every timing-function graph (bezier, steps, linear) so they all frame identically.
export function getPlotInset(size: number): number {
  return size * 0.04;
}

/*
  Maps a point in the timing-function domain (x = time ratio in [0,1], y = progress, which can
  exceed [0,1] for overshoot/bounce) to plot pixel coordinates for a square plot of the given
  size. y is flipped since SVG grows downward while progress grows upward. Assumes a fixed 0-1
  progress domain — shared by BezierGraph and StepsEasingGraph; LinearEasingGraph uses its own
  wider-domain mapping in utils/linear-easing.ts instead, since a linear() curve's overshoot can
  swing well past what a 0-1 domain could show without clipping.
*/
export function toPlotPoint(point: [number, number], size: number): [number, number] {
  const inset = getPlotInset(size);
  const min = inset;
  const max = size - inset;

  return [normalize(point[0], 0, 1, min, max), normalize(1 - point[1], 0, 1, min, max)];
}
