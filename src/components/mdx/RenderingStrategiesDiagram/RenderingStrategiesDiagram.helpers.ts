import type { StrategyBox } from "@/components/mdx/RenderingStrategiesDiagram/RenderingStrategiesDiagram.constants";

// Fill/stroke pair for one strategy box's kind.
export interface StrategyBoxColor {
  fill: string;
  stroke: string;
}

/*
  "static" (green) is HTML that already exists and just gets handed out — a build node or a fresh
  cache entry. "dynamic" (blue) is HTML being actively generated right now, whether that's SSR doing
  it on every single request or ISR's background rebuild doing it once in a while. "stale" (amber)
  is the one state unique to ISR: an old page still being served instantly while a rebuild is
  pending or running. Same token choices as ISRTimelineDiagram, kept as an independent copy here so
  this diagram has no import dependency on that one.
*/
export function getStrategyBoxColor(kind: StrategyBox["kind"]): StrategyBoxColor {
  switch (kind) {
    case "static":
      return { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" };
    case "stale":
      return { fill: "var(--color-bg-attention-muted)", stroke: "var(--color-border-attention-emphasis)" };
    default:
      return { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" };
  }
}
