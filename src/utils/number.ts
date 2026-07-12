// Arithmetic rather than Number.prototype.toFixed avoids a string round-trip and returns a number.
export function toFixed(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// Defaults to 0-1, the range ratios like progress and opacity live in.
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}
