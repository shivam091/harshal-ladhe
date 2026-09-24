import { normalize } from "@/utils/number";

// Keeps points at the extremes fully on-canvas instead of clipped, and one shared inset frames every timing-function graph identically.
export function getPlotInset(size: number): number {
  return size * 0.04;
}

/*
  y is flipped since SVG grows downward while progress grows upward. Assumes a fixed 0-1 progress
  domain, so curves whose overshoot swings far past it need their own wider-domain mapping.
*/
export function toPlotPoint(point: [number, number], size: number): [number, number] {
  const inset = getPlotInset(size);
  const min = inset;
  const max = size - inset;

  return [normalize(point[0], 0, 1, min, max), normalize(1 - point[1], 0, 1, min, max)];
}
