import type { JSX } from "react";
import {
  PLOT_LEFT,
  PLOT_BOTTOM,
  PLOT_W,
  PLOT_H,
  COUNT_TICKS,
  SVG_COST_Y,
  CANVAS_COST_Y
} from "@/components/mdx/ElementCountPerformanceDiagram/ElementCountPerformanceDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ElementCountPerformanceDiagram/ElementCountPerformanceDiagram.styles";

// Builds a "M x0,y0 L x1,y1 L x2,y2 ..." path string connecting each tick's x with its matching cost y.
function buildCostPath(costY: number[]): string {
  return COUNT_TICKS.map((tick, index) => `${index === 0 ? "M" : "L"}${tick.x},${costY[index]}`).join(" ");
}

/*
  Conceptual (deliberately NOT a literal benchmark) line chart of how per-frame cost trends as object count
  grows: SVG's line climbs because every extra shape is another real DOM node with its own style/layout/paint
  overhead, while Canvas's line stays close to flat because a draw call has no per-object bookkeeping at all.
  Exists to make Question 2 of the decision framework ("how many objects, and does that count grow?") visual.
*/
export default function ElementCountPerformanceDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 400 300" role="img" aria-labelledby="element-count-performance-diagram-title element-count-performance-diagram-desc">
          <title id="element-count-performance-diagram-title">Relative per-frame cost vs. object count for SVG and Canvas</title>
          <desc id="element-count-performance-diagram-desc">
            A conceptual, illustrative-only line chart, not measured benchmark data. The horizontal axis is
            object count, from 10 to 10,000+. The vertical axis is relative per-frame rendering cost. The SVG
            line starts low and climbs steeply as object count grows, because every shape is a real DOM node
            with its own style, layout, and paint overhead. The Canvas line stays close to flat across the same
            range, because a draw call keeps no per-object bookkeeping.
          </desc>

          <defs>
            <marker id="element-count-axis-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Axes */}
          <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_LEFT} y2={PLOT_BOTTOM - PLOT_H - 20} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#element-count-axis-arrow)" />
          <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_LEFT + PLOT_W + 15} y2={PLOT_BOTTOM} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#element-count-axis-arrow)" />

          {COUNT_TICKS.map((tick) => (
            <g key={tick.label}>
              <line x1={tick.x} y1={PLOT_BOTTOM} x2={tick.x} y2={PLOT_BOTTOM + 5} stroke="var(--color-fg-muted)" strokeWidth={1} />
              <text x={tick.x} y={PLOT_BOTTOM + 18} textAnchor="middle" fontSize={10.5} fill="var(--color-fg-muted)">{tick.label}</text>
            </g>
          ))}

          <text x={PLOT_LEFT + PLOT_W / 2} y={PLOT_BOTTOM + 34} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">Object / shape count</text>
          <text
            x={20} y={PLOT_BOTTOM - (PLOT_H + 20) / 2} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)"
            transform={`rotate(-90, 20, ${PLOT_BOTTOM - (PLOT_H + 20) / 2})`}
          >
            Relative per-frame cost
          </text>

          {/* The two trend lines. */}
          <path d={buildCostPath(SVG_COST_Y)} fill="none" stroke="var(--color-fg-accent)" strokeWidth={2.25} strokeLinejoin="round" />
          <path d={buildCostPath(CANVAS_COST_Y)} fill="none" stroke="var(--color-fg-attention)" strokeWidth={2.25} strokeLinejoin="round" />

          {COUNT_TICKS.map((tick, index) => (
            <g key={`points-${tick.label}`}>
              <circle cx={tick.x} cy={SVG_COST_Y[index]} r={3} fill="var(--color-fg-accent)" />
              <circle cx={tick.x} cy={CANVAS_COST_Y[index]} r={3} fill="var(--color-fg-attention)" />
            </g>
          ))}

          {/* Legend */}
          <g>
            <line x1={PLOT_LEFT + 8} y1={38} x2={PLOT_LEFT + 24} y2={38} stroke="var(--color-fg-accent)" strokeWidth={2.5} />
            <text x={PLOT_LEFT + 30} y={42} fontSize={11} fill="var(--color-fg-default)">SVG — DOM node per shape</text>

            <line x1={PLOT_LEFT + 8} y1={58} x2={PLOT_LEFT + 24} y2={58} stroke="var(--color-fg-attention)" strokeWidth={2.5} />
            <text x={PLOT_LEFT + 30} y={62} fontSize={11} fill="var(--color-fg-default)">Canvas — no per-object cost</text>
          </g>

          <text x={PLOT_LEFT + PLOT_W / 2} y={288} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)" fontStyle="italic">Illustrative trend only — not measured benchmark numbers</text>
        </Svg>
      </Wrapper>
    </>
  );
}

ElementCountPerformanceDiagram.displayName = "ElementCountPerformanceDiagram";
