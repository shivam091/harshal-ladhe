import { clamp, normalize } from "@/utils/number";
import { getPlotInset } from "@/utils/plot";

export { getPlotInset };

// Mirrors CSS's own stop syntax — a value plus an optional percentage — so it formats straight back to CSS.
export interface LinearEasingStop {
  // Unique id for React keys and drag targeting — not part of the generated CSS.
  id: string;
  // Progress value at this stop. Unbounded, matching the CSS spec — can exceed 0-1 for bounce/spring overshoot.
  value: number;
  // Percentage (0-100) pinning this stop to an exact point in the duration. null means auto-spaced.
  position: number | null;
}

// Separate from LinearEasingStop so the editor can keep a stop unpinned while still knowing where it sits.
export interface ResolvedLinearEasingStop extends LinearEasingStop {
  resolvedPosition: number;
}

// Room below 0 for wind-ups, on one shared scale so every linear() graph is comparable.
export const LINEAR_EASING_VALUE_MIN = -0.5;
// Room above 1 for overshoots, on the same shared scale.
export const LINEAR_EASING_VALUE_MAX = 1.75;

/*
  Mirrors the CSS spec's auto-spacing and clamping rules, so graphs and races show exactly the
  timing a browser would give the same stops.
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

// Leaves unpinned stops bare, so the copied value stays as short as hand-written CSS.
export function formatLinearEasing(stops: LinearEasingStop[]): string {
  const parts = stops.map((stop) => {
    const value = Number(stop.value.toFixed(2)).toString();
    return stop.position === null ? value : `${value} ${Number(stop.position.toFixed(1))}%`;
  });

  return `linear(${parts.join(", ")})`;
}

/*
  Races and trails need progress at any moment. Unlike a bezier, linear() is defined directly
  against time, so this needs no iterative search.
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

// Clamped so a value outside the plotted range sits on the edge instead of drawing off the graph.
export function valueToPlotY(value: number, size: number, valueMin: number, valueMax: number): number {
  const inset = getPlotInset(size);
  return normalize(clamp(value, valueMin, valueMax), valueMin, valueMax, size - inset, inset);
}

// Uses the same inset as the axes, so 0% and 100% land exactly on the frame.
export function positionToPlotX(resolvedPosition: number, size: number): number {
  const inset = getPlotInset(size);
  return normalize(resolvedPosition, 0, 100, inset, size - inset);
}

// One mapping for the line and the handles, so a handle always sits exactly on the line it edits.
export function toLinearPlotPoint(stop: ResolvedLinearEasingStop, size: number, valueMin: number, valueMax: number): [number, number] {
  return [positionToPlotX(stop.resolvedPosition, size), valueToPlotY(stop.value, size, valueMin, valueMax)];
}

// A polyline rather than a path, because linear() really is straight segments between stops.
export function buildLinearEasingPoints(resolvedStops: ResolvedLinearEasingStop[], size: number, valueMin: number, valueMax: number): string {
  return resolvedStops.map((stop) => toLinearPlotPoint(stop, size, valueMin, valueMax).join(",")).join(" ");
}

// Corrects for CSS scaling of the SVG, so a drag stays under the pointer at any rendered size.
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
