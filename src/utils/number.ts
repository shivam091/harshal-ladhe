/*
  Rounds a number to a specified number of decimal places using arithmetic
  instead of string conversion for better performance.
*/
export function toFixed(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// Clamps `value` into the inclusive [min, max] range, defaulting to 0-1.
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

// Linearly remaps `value` from [inMin, inMax] into [outMin, outMax] — e.g. a 1-10 "speed" scale into a duration in ms.
export function normalize(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}
