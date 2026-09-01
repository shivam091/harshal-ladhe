import { clamp, normalize } from "@/utils/number";
import { getPlotInset } from "@/utils/plot";
import type { LinearEasingStop, ResolvedLinearEasingStop } from "@/interfaces/linear-easing";

export { getPlotInset };

// Vertical domain plotted on every linear() graph — wide enough to fit every preset's overshoot/undershoot without clipping. Shared by LinearEasingPlayground and LinearEasingGraph/LinearEasingRace so they all frame presets identically.
export const LINEAR_EASING_VALUE_MIN = -0.5;
export const LINEAR_EASING_VALUE_MAX = 1.75;

/*
  Resolves every stop's final 0-100 position, mirroring the CSS spec's auto-spacing algorithm:
  the first stop defaults to 0 and the last to 100 when left unpinned, and any run of unpinned
  stops between two pinned (or boundary) anchors is spread evenly across that gap. Positions are
  then forced non-decreasing, since a linear() stop can never sit before the one drawn before it.
*/
export function resolveLinearEasingStops(stops: LinearEasingStop[]): ResolvedLinearEasingStop[] {
  if (stops.length === 0) return [];

  const positions = stops.map((stop) => stop.position);
  if (positions[0] === null) positions[0] = 0;
  if (positions[positions.length - 1] === null) positions[positions.length - 1] = 100;

  let index = 0;
  while (index < positions.length) {
    if (positions[index] !== null) {
      index++;
      continue;
    }

    const gapStart = index - 1;
    let gapEnd = index;
    while (positions[gapEnd] === null) gapEnd++;

    const startPosition = positions[gapStart] as number;
    const endPosition = positions[gapEnd] as number;

    for (let step = gapStart + 1; step < gapEnd; step++) {
      positions[step] = normalize(step - gapStart, 0, gapEnd - gapStart, startPosition, endPosition);
    }

    index = gapEnd + 1;
  }

  let previous = 0;
  const resolvedPositions = positions.map((position) => {
    const next = Math.max(position as number, previous);
    previous = next;
    return next;
  });

  return stops.map((stop, i) => ({ ...stop, resolvedPosition: resolvedPositions[i] }));
}

// Formats stops as a copy-pasteable linear() CSS value — pinned stops keep their percentage, auto-spaced stops print the value alone.
export function formatLinearEasing(stops: LinearEasingStop[]): string {
  const parts = stops.map((stop) => {
    const value = Number(stop.value.toFixed(2)).toString();
    return stop.position === null ? value : `${value} ${Number(stop.position.toFixed(1))}%`;
  });

  return `linear(${parts.join(", ")})`;
}

/*
  Piecewise-linear interpolation over resolved stops at a given time ratio (0-1) — the same
  computation the browser performs every frame for a `linear()` timing function. Unlike a cubic
  bezier, this needs no iterative solve: time IS the x-axis, so it's a direct lookup of which
  segment `t` falls in, followed by a single lerp.
*/
export function solveLinearEasingY(t: number, resolvedStops: ResolvedLinearEasingStop[]): number {
  if (resolvedStops.length === 0) return t;
  if (resolvedStops.length === 1) return resolvedStops[0].value;

  const targetPosition = clamp(t, 0, 1) * 100;

  let segmentStart = resolvedStops[0];
  let segmentEnd = resolvedStops[resolvedStops.length - 1];

  for (let i = 0; i < resolvedStops.length - 1; i++) {
    if (targetPosition >= resolvedStops[i].resolvedPosition && targetPosition <= resolvedStops[i + 1].resolvedPosition) {
      segmentStart = resolvedStops[i];
      segmentEnd = resolvedStops[i + 1];
      break;
    }
  }

  if (segmentEnd.resolvedPosition === segmentStart.resolvedPosition) return segmentEnd.value;

  return normalize(targetPosition, segmentStart.resolvedPosition, segmentEnd.resolvedPosition, segmentStart.value, segmentEnd.value);
}

// Maps a progress value to a plot y pixel coordinate for the given size and vertical value domain.
export function valueToPlotY(value: number, size: number, valueMin: number, valueMax: number): number {
  const inset = getPlotInset(size);
  return normalize(clamp(value, valueMin, valueMax), valueMin, valueMax, size - inset, inset);
}

// Maps a resolved 0-100 position to a plot x pixel coordinate for the given size.
export function positionToPlotX(resolvedPosition: number, size: number): number {
  const inset = getPlotInset(size);
  return normalize(resolvedPosition, 0, 100, inset, size - inset);
}

// Maps a resolved stop to plot pixel coordinates — shared by the polyline builder and the playground's draggable handles so a handle always sits exactly on the line it's editing.
export function toLinearPlotPoint(stop: ResolvedLinearEasingStop, size: number, valueMin: number, valueMax: number): [number, number] {
  return [positionToPlotX(stop.resolvedPosition, size), valueToPlotY(stop.value, size, valueMin, valueMax)];
}

// Builds the SVG polyline `points` for a piecewise-linear plot of the given pixel size and vertical value domain.
export function buildLinearEasingPoints(resolvedStops: ResolvedLinearEasingStop[], size: number, valueMin: number, valueMax: number): string {
  return resolvedStops.map((stop) => toLinearPlotPoint(stop, size, valueMin, valueMax).join(",")).join(" ");
}

// Converts a pointer event's client coordinates into a stop's value and position, clamped to the plot's domain.
export function pointerEventToLinearStop(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  size: number,
  valueMin: number,
  valueMax: number
): { value: number; position: number } {
  const inset = getPlotInset(size);
  const min = inset;
  const max = size - inset;

  const scaleX = size / rect.width;
  const scaleY = size / rect.height;

  const localX = (clientX - rect.left) * scaleX;
  const localY = (clientY - rect.top) * scaleY;

  const position = clamp(normalize(localX, min, max, 0, 100), 0, 100);
  const value = clamp(normalize(localY, min, max, valueMax, valueMin), valueMin, valueMax);

  return { value: Number(value.toFixed(2)), position: Number(position.toFixed(1)) };
}
