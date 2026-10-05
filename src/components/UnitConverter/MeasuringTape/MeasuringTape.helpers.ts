import type { RulerTick } from "@/components/UnitConverter/UnitConverter.types";

// Tick lengths in px from the strip's top edge — fixed rather than proportional, since the whole point of the tape is that its x-axis is true CSS px and the y-axis just needs to be legible.
const MINOR_TICK_PX = 7;
const MAJOR_TICK_PX = 13;

// Empty tape past the measured length, so there's always somewhere to drag the handle to.
const TAPE_RUNOUT_PX = 240;

// Short enough to fit a phone without scrolling at the default length, long enough to show a few rem/vw labels.
const TAPE_MIN_PX = 640;

/*
  All of a strip's ticks as one SVG path rather than one <line> each — a long px strip can carry a
  couple of thousand ticks, and eight strips of individual elements would make every drag frame
  re-render far more DOM than it needs to. Half-px offset keeps 1px strokes crisp on 1× screens.
*/
export function buildTickPath(ticks: RulerTick[]): string {
  return ticks.map((tick) => `M${tick.x + 0.5} 0V${tick.major ? MAJOR_TICK_PX : MINOR_TICK_PX}`).join("");
}

// Rounds the tape up to the next 100px past the handle plus a runout, so it only grows in visible steps rather than on every drag frame.
export function computeTapeLength(lengthPx: number): number {
  return Math.max(TAPE_MIN_PX, Math.ceil((Math.max(lengthPx, 0) + TAPE_RUNOUT_PX) / 100) * 100);
}
