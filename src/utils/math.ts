// Clamps a value to the inclusive [min, max] range.
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Straight-line distance between two points.
export function getDistanceBetweenPoints(
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Converts an angle in radians to degrees.
export function convertRadiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

// Inclusive integer range: range(1, 4) => [1, 2, 3, 4].
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// Linearly maps `value` from the [inMin, inMax] range onto [outMin, outMax].
export function normalize(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const progress = (value - inMin) / (inMax - inMin);
  return outMin + progress * (outMax - outMin);
}
