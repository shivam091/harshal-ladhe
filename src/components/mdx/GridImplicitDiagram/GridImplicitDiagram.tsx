import type { JSX } from "react";
import type { GridImplicitDiagramProps } from "@/components/mdx/GridImplicitDiagram/GridImplicitDiagram.types";
import GridImplicitPanel from "@/components/mdx/GridImplicitDiagram/GridImplicitPanel";
import { CELL, GAP, LEFT_X, LEFT_Y, RIGHT_X, RIGHT_Y, BASELINE_CELLS, EXTRA_CELLS } from "@/components/mdx/GridImplicitDiagram/GridImplicitDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GridImplicitDiagram/GridImplicitDiagram.styles";

/*
  Static SVG diagram comparing an explicit grid to the implicit tracks the browser generates once items
  overflow it — one variant per axis, since `grid-auto-rows` and `grid-auto-columns` each need their own example.
*/
export default function GridImplicitDiagram({ variant }: GridImplicitDiagramProps): JSX.Element {
  const rightCells = [...BASELINE_CELLS, ...EXTRA_CELLS[variant]];
  const caption = variant === "rows"
    ? "grid-auto-rows sizes the auto-created 3rd row"
    : "grid-auto-columns sizes the auto-created 3rd column";

  /*
    The "rows" variant's right panel grows a 3rd row (taller), while "columns" only grows a 3rd column (same
    2-row height as the left panel) — so the caption/legend below both panels sit right under whichever panel
    is taller, instead of leaving a fixed, oversized gap under the shorter "columns" layout.
  */
  const diagramBottom = LEFT_Y + (variant === "rows" ? 3 : 2) * CELL + (variant === "rows" ? 2 : 1) * GAP;
  const captionY = diagramBottom + 34;
  const legendY = captionY + 26;
  const viewBoxHeight = legendY + 34;

  // x coordinate of the auto-created track's own centre — the callout arrow's tip, so it points at that
  // specific track rather than the panel as a whole.
  const trackCenterX = variant === "rows" ? RIGHT_X + CELL + GAP / 2 : RIGHT_X + 2 * (CELL + GAP) + CELL / 2;
  const arrowTipY = diagramBottom + 6;
  const arrowTailY = captionY - 14;

  /*
    "rows" keeps its caption centred under both panels, since the 3rd row it names spans them both. "columns"
    right-aligns to the auto-created column's own right edge instead, since that column sits off to the right —
    centring it under the whole diagram would leave the arrow pointing awkwardly far from the text.
  */
  const captionX = variant === "columns" ? RIGHT_X + 3 * CELL + 2 * GAP : 260;
  const captionAnchor = variant === "columns" ? "end" : "middle";
  const arrowTailX = variant === "columns" ? 320 : 260;

  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 520 ${viewBoxHeight}`} role="img" aria-labelledby={`grid-implicit-${variant}-title`}>
          <title id={`grid-implicit-${variant}-title`}>
            {variant === "rows"
              ? "Diagram comparing an explicit 2x2 grid to the same grid with a 3rd, auto-created row holding Item 5 and one empty cell."
              : "Diagram comparing an explicit 2x2 grid to the same grid with a 3rd, auto-created column holding Item 5 and one empty cell."}
          </title>

          <defs>
            <marker id="grid-implicit-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          <text x={LEFT_X + CELL + GAP / 2} y={LEFT_Y - 20} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">Explicit Grid</text>
          <GridImplicitPanel originX={LEFT_X} originY={LEFT_Y} cells={BASELINE_CELLS} />

          <text
            x={variant === "columns" ? RIGHT_X + CELL + GAP / 2 : RIGHT_X + (CELL + GAP / 2) / 2}
            y={RIGHT_Y - 20} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)"
          >
            Implicit Grid
          </text>
          <GridImplicitPanel originX={RIGHT_X} originY={RIGHT_Y} cells={rightCells} />

          {/* Callout arrow from the caption up to the specific auto-created track it describes. */}
          <line
            x1={arrowTailX} y1={arrowTailY} x2={trackCenterX} y2={arrowTipY}
            stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#grid-implicit-arrow)"
          />
          <text x={captionX} y={captionY} textAnchor={captionAnchor} fontSize={12} fill="var(--color-fg-muted)">{caption}</text>

          {/* Legend — distinguishes the plain explicit-track styling from the dashed, tinted implicit-track styling.
              Left-aligns to the left (explicit) panel's left edge (LEFT_X). */}
          <g fontSize={11}>
            <rect x={LEFT_X} y={legendY} width={14} height={14} rx={3} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
            <text x={LEFT_X + 20} y={legendY + 11} fill="var(--color-fg-default)">explicit track</text>

            <rect x={LEFT_X + 145} y={legendY} width={14} height={14} rx={3} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} strokeDasharray="5 4" />
            <text x={LEFT_X + 165} y={legendY + 11} fill="var(--color-fg-default)">implicit track (auto-created)</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

GridImplicitDiagram.displayName = "GridImplicitDiagram";
