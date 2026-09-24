import { toPlotPoint } from "@/utils/plot";

// The four CSS steps() jump-terms, which decide where a staircase's jumps fall.
export type StepsJumpTerm = "jump-start" | "jump-end" | "jump-none" | "jump-both";

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

// Isolates the only jump-term-specific logic: which of the n+1 boundaries in [0,1] produce a jump.
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
  One generic pass over the boundaries mirrors how the browser evaluates steps(), so every jump-term
  is correct by construction. Treads are half-open, so the (1, 1) endpoint is deliberately left to the caller.
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

// Draws risers explicitly, including the final jump to (1, 1), since the treads alone would leave the staircase disconnected.
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

// Filled/open dots make each tread's half-open bounds visible, plus the (1, 1) endpoint the treads leave out.
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

// Samples steps() at time t for animation — the held tread value, since steps() jumps rather than eases.
export function solveStepsY(t: number, n: number, jumpTerm: StepsJumpTerm): number {
  if (t >= 1) return 1;

  const treads = computeStepsTreads(n, jumpTerm);
  const tread = treads.find((candidate) => t < candidate.xEnd) ?? treads[treads.length - 1];
  return tread.value;
}
