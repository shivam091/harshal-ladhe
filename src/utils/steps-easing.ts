import { toPlotPoint } from "@/utils/plot";
import type { StepsJumpTerm } from "@/types/steps-easing";

// One flat "tread" of a steps() staircase: a half-open [xStart, xEnd) time range holding a constant progress value.
export interface StepsTread {
  xStart: number;
  xEnd: number;
  value: number;
}

// A marker dot on a steps() graph — filled where the value is actually achieved, open where the tread ends but the value has already moved on.
export interface StepsMarkerPoint {
  x: number;
  y: number;
  filled: boolean;
}

// CSS steps() divides [0,1] into n equal boundaries; which of those n+1 boundaries produce a discrete jump depends on the jump-term.
function getStepsRisers(n: number, jumpTerm: StepsJumpTerm): number[] {
  const boundaries = Array.from({ length: n + 1 }, (_, k) => k / n);

  switch (jumpTerm) {
    case "jump-start": return boundaries.slice(0, n);
    case "jump-end": return boundaries.slice(1);
    case "jump-none": return boundaries.slice(1, n);
    case "jump-both": return boundaries;
  }
}

/*
  Resolves steps(n, jumpTerm) into its flat tread segments, mirroring exactly how the browser
  evaluates the function every frame: walking the time boundaries in order and counting risers
  crossed so far gives every tread's height in one pass, with no per-jump-term special-casing.
  Every tread is half-open [xStart, xEnd) — the fixed (1, 1) endpoint every timing function must
  reach is intentionally left for the caller to draw/mark separately (see StepsEasingGraph).
*/
export function computeStepsTreads(n: number, jumpTerm: StepsJumpTerm): StepsTread[] {
  const risers = getStepsRisers(n, jumpTerm);
  const riserSet = new Set(risers);
  const totalJumps = risers.length;
  const eventPoints = Array.from(new Set([0, ...risers, 1])).sort((a, b) => a - b);

  let jumpsSoFar = 0;
  const treads: StepsTread[] = [];
  for (let i = 0; i < eventPoints.length - 1; i++) {
    const xStart = eventPoints[i];
    if (riserSet.has(xStart)) jumpsSoFar++;
    treads.push({ xStart, xEnd: eventPoints[i + 1], value: jumpsSoFar / totalJumps });
  }

  return treads;
}

// Builds the SVG path `d` for a steps() staircase plot: one horizontal segment per tread, plus the vertical risers connecting them (including the fixed jump up to the (1, 1) endpoint).
export function buildStepsPathD(n: number, jumpTerm: StepsJumpTerm, size: number): string {
  const treads = computeStepsTreads(n, jumpTerm);

  const segments = treads.map((tread) => {
    const [x1, y1] = toPlotPoint([tread.xStart, tread.value], size);
    const [x2, y2] = toPlotPoint([tread.xEnd, tread.value], size);
    return `M${x1},${y1} L${x2},${y2}`;
  });

  for (let i = 0; i < treads.length; i++) {
    const next = treads[i + 1];
    const nextValue = next ? next.value : 1;
    if (nextValue === treads[i].value) continue;

    const [x1, y1] = toPlotPoint([treads[i].xEnd, treads[i].value], size);
    const [x2, y2] = toPlotPoint([treads[i].xEnd, nextValue], size);
    segments.push(`M${x1},${y1} L${x2},${y2}`);
  }

  return segments.join(" ");
}

// Marker dots for a steps() plot: a filled dot where each tread's value starts (achieved exactly at that instant), an open dot where it ends (the value has already moved on), plus the fixed (1, 1) endpoint every timing function reaches.
export function getStepsMarkerPoints(n: number, jumpTerm: StepsJumpTerm, size: number): StepsMarkerPoint[] {
  const treads = computeStepsTreads(n, jumpTerm);

  const markers = treads.flatMap((tread) => {
    const [xStart, yStart] = toPlotPoint([tread.xStart, tread.value], size);
    const [xEnd, yEnd] = toPlotPoint([tread.xEnd, tread.value], size);
    return [
      { x: xStart, y: yStart, filled: true },
      { x: xEnd, y: yEnd, filled: false },
    ];
  });

  const [finalX, finalY] = toPlotPoint([1, 1], size);
  markers.push({ x: finalX, y: finalY, filled: true });

  return markers;
}

// Evaluates steps(n, jumpTerm) at a given time ratio — the tread containing t determines the held value, since steps() jumps rather than eases.
export function solveStepsY(t: number, n: number, jumpTerm: StepsJumpTerm): number {
  if (t >= 1) return 1;

  const treads = computeStepsTreads(n, jumpTerm);
  const tread = treads.find((candidate) => t < candidate.xEnd) ?? treads[treads.length - 1];
  return tread.value;
}
