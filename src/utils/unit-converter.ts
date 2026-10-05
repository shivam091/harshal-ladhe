import { toFixed } from "@/utils/number";
import type { CssUnit, RulerTick, UnitContext } from "@/components/UnitConverter/UnitConverter.types";

// CSS fixes 1in = 96px and 1in = 72pt, so a point is always exactly this many px regardless of screen.
const PX_PER_PT = 96 / 72;

/*
  How many CSS px one of `unit` is worth in `context` — the single ratio every conversion in this tool
  goes through. % is resolved against the parent's width since that's what width/padding/margin use,
  the case people convert for most often.
*/
export function pxPerUnit(unit: CssUnit, context: UnitContext): number {
  switch (unit) {
    case "px":
      return 1;
    case "rem":
      return context.rootFontSize;
    case "em":
      return context.parentFontSize;
    case "vw":
      return context.viewportWidth / 100;
    case "vh":
      return context.viewportHeight / 100;
    case "cqi":
      return context.containerInlineSize / 100;
    case "%":
      return context.parentWidth / 100;
    case "pt":
      return PX_PER_PT;
  }
}

// Every unit funnels through px, so n units only need n ratios rather than n² pairwise formulas.
export function toPx(value: number, unit: CssUnit, context: UnitContext): number {
  return value * pxPerUnit(unit, context);
}

// Guards the zero-basis case (a 0px container) so a row reads 0 rather than Infinity or NaN.
export function fromPx(px: number, unit: CssUnit, context: UnitContext): number {
  const ratio = pxPerUnit(unit, context);
  return ratio === 0 ? 0 : px / ratio;
}

// Converts straight between any two units — the batch table's only entry point.
export function convert(value: number, from: CssUnit, to: CssUnit, context: UnitContext): number {
  return fromPx(toPx(value, from, context), to, context);
}

// Rounds via arithmetic then lets String() drop trailing zeros, so 1.5000 prints as 1.5 and -0 never appears.
export function formatNumber(value: number, precision: number): string {
  const rounded = toFixed(value, precision);
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

// A value plus its unit, ready to paste into CSS.
export function formatLength(value: number, unit: CssUnit, precision: number): string {
  return `${formatNumber(value, precision)}${unit}`;
}

/*
  Forgiving parse for the batch list: commas, spaces, newlines or semicolons all separate values, and
  a trailing "px" is tolerated since people paste straight from a stylesheet. Duplicates are dropped
  so the exported custom properties never collide.
*/
export function parseBatchValues(input: string): number[] {
  const seen = new Set<number>();
  const values: number[] = [];
  for (const token of input.split(/[\s,;]+/)) {
    const cleaned = token.trim().replace(/px$/i, "");
    if (cleaned === "") continue;
    const value = Number(cleaned);
    if (!Number.isFinite(value) || seen.has(value)) continue;
    seen.add(value);
    values.push(value);
  }
  return values;
}

// Nice "round" step sizes a ruler can label at — the usual 1/2/5 series, so labels always land on numbers a person would write.
const TICK_STEPS = [0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000];

// Closest two labelled ticks are allowed to sit — enough room for a two-digit label at 10px type, so rem and vw can still label every couple of units.
const MIN_MAJOR_GAP_PX = 28;

// Closest two minor ticks are allowed to sit before they blur into a solid bar.
const MIN_MINOR_GAP_PX = 5;

/*
  Picks a labelled step and a subdivision for one unit's ruler, then lays its ticks out in true px
  from the tape's zero. Step choice depends on the unit's px size, so 1vw (a few px) and 1rem (16px)
  both get readable, evenly spaced labels without a per-unit lookup table.
*/
export function computeRulerTicks(unitPx: number, lengthPx: number): RulerTick[] {
  if (unitPx <= 0) return [];
  const majorStep = TICK_STEPS.find((step) => step * unitPx >= MIN_MAJOR_GAP_PX) ?? TICK_STEPS[TICK_STEPS.length - 1];
  // Minor ticks also come from the nice series and must divide the major step evenly — so 2rem subdivides into halves, never into 0.4s.
  const minorStep = TICK_STEPS.find((step) => step <= majorStep && step * unitPx >= MIN_MINOR_GAP_PX && Math.abs(majorStep / step - Math.round(majorStep / step)) < 1e-9) ?? majorStep;
  const divisions = Math.round(majorStep / minorStep);

  const ticks: RulerTick[] = [];
  const count = Math.floor(lengthPx / (minorStep * unitPx));
  for (let i = 0; i <= count; i++) {
    const unitValue = i * minorStep;
    const major = i % divisions === 0;
    ticks.push({ x: unitValue * unitPx, major, label: major ? String(toFixed(unitValue, 2)) : null });
  }
  return ticks;
}
