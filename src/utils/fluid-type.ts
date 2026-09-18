import { toFixed } from "@/utils/number";
import type { FluidTypeStep } from "@/interfaces/fluid-type";

// The three numbers clamp()'s `calc()` middle argument compiles from, plus its own min/max bounds — kept as one struct so compileClampValue never has to recompute anything computeClampParts already derived.
export interface FluidClampParts {
  minRem: number;
  maxRem: number;
  slopeVw: number;
  interceptRem: number;
}

/*
  The standard fluid-type formula: fit a straight line through (minViewport, minSize) and
  (maxViewport, maxSize), then express that line as `interceptRem + slopeVw vw` so a browser can
  evaluate it against its own real viewport width. Works the same whether maxSize is larger or
  smaller than minSize (a step allowed to shrink as the viewport grows) — the line's slope is just negative.
*/
export function computeClampParts(step: FluidTypeStep, minViewport: number, maxViewport: number, rootFontSize: number): FluidClampParts {
  const slope = (step.maxSize - step.minSize) / (maxViewport - minViewport);
  const interceptPx = step.minSize - slope * minViewport;
  return {
    minRem: step.minSize / rootFontSize,
    maxRem: step.maxSize / rootFontSize,
    slopeVw: slope * 100,
    interceptRem: interceptPx / rootFontSize
  };
}

/*
  Single entry point for this tool's output — one source of truth every export format reads from.
  Bounds are sorted with Math.min/max rather than assumed min<max: `clamp(MIN, VAL, MAX)` is only
  well-defined when MIN <= MAX, which still needs stating explicitly for a step set up to shrink as
  the viewport grows (there maxSize < minSize by design).
*/
export function compileClampValue(parts: FluidClampParts): string {
  const lower = toFixed(Math.min(parts.minRem, parts.maxRem), 3);
  const upper = toFixed(Math.max(parts.minRem, parts.maxRem), 3);
  const preferred = `calc(${toFixed(parts.interceptRem, 3)}rem + ${toFixed(parts.slopeVw, 3)}vw)`;
  return `clamp(${lower}rem, ${preferred}, ${upper}rem)`;
}

/*
  The literal px size a step resolves to at an arbitrary viewport width — the same linear
  interpolation clamp() performs, run here in JS since the live preview simulates "as-if" viewport
  widths via a slider rather than actually resizing the browser window.
*/
export function computeSizeAtWidth(step: FluidTypeStep, minViewport: number, maxViewport: number, widthPx: number): number {
  if (widthPx <= minViewport) return step.minSize;
  if (widthPx >= maxViewport) return step.maxSize;
  const t = (widthPx - minViewport) / (maxViewport - minViewport);
  return step.minSize + t * (step.maxSize - step.minSize);
}
