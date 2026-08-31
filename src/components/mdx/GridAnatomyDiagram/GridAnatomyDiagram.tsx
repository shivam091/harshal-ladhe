import type { JSX } from "react";
import {
  CELL_W,
  CELL_H,
  COL_X,
  ROW_Y,
  COL_LINES,
  ROW_LINES,
  CONTAINER_X,
  CONTAINER_Y,
  CONTAINER_W,
  CONTAINER_H
} from "@/components/mdx/GridAnatomyDiagram/GridAnatomyDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GridAnatomyDiagram/GridAnatomyDiagram.styles";

/*
  Static SVG diagram of grid container/line/track/cell/item terminology, replacing what would otherwise need a
  separate hand-drawn illustration per term — colors are theme tokens so it repaints correctly per theme.
*/
export default function GridAnatomyDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 440 356" role="img" aria-labelledby="grid-anatomy-diagram-title grid-anatomy-diagram-desc">
          <title id="grid-anatomy-diagram-title">CSS Grid terminology diagram</title>
          <desc id="grid-anatomy-diagram-desc">
            A grid container with 3 columns and 2 rows, showing numbered grid lines, a highlighted column track,
            a highlighted row track, the grid cell where they intersect, a grid item inside another cell, and the
            gap between two columns.
          </desc>

          {/* Grid container */}
          <rect
            x={CONTAINER_X} y={CONTAINER_Y} width={CONTAINER_W} height={CONTAINER_H} rx={10}
            fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5}
          />

          {/* Highlighted column track (column 2) — spans the container's full height. */}
          <rect x={COL_X[1]} y={CONTAINER_Y} width={CELL_W} height={CONTAINER_H} fill="var(--color-bg-accent-muted)" opacity={0.55} />

          {/* Highlighted row track (row 2) — spans the container's full width. */}
          <rect x={CONTAINER_X} y={ROW_Y[1]} width={CONTAINER_W} height={CELL_H} fill="var(--color-bg-attention-muted)" opacity={0.55} />

          {/* Six grid cells, drawn as plain bordered boxes on top of the track tints. */}
          {ROW_Y.map((y, rowIndex) => (
            COL_X.map((x, colIndex) => (
              <rect
                key={`cell-${rowIndex}-${colIndex}`}
                x={x} y={y} width={CELL_W} height={CELL_H}
                fill="none" stroke="var(--color-border-muted)" strokeWidth={1}
              />
            ))
          ))}

          {/* Grid cell — the single cell where the highlighted track column and row intersect. */}
          <rect
            x={COL_X[1]} y={ROW_Y[1]} width={CELL_W} height={CELL_H} rx={4}
            fill="none" stroke="var(--color-border-success-emphasis)" strokeWidth={2.5}
          />

          {/* Grid item — a piece of content sitting inside a cell of its own. */}
          <rect x={COL_X[2] + 18} y={ROW_Y[0] + 20} width={60} height={44} rx={6} fill="var(--color-bg-default)" stroke="var(--color-fg-muted)" strokeWidth={1.5} />

          {/* Gap — a short double-headed arrow inside the gutter between column 1 and column 2. */}
          <defs>
            <marker id="gap-arrow-start" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M10,0 L0,5 L10,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            <marker id="gap-arrow-end" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>
          <line
            x1={COL_X[0] + CELL_W} y1={ROW_Y[0] + CELL_H / 2} x2={COL_X[1]} y2={ROW_Y[0] + CELL_H / 2}
            stroke="var(--color-fg-muted)" strokeWidth={1.5}
            markerStart="url(#gap-arrow-start)" markerEnd="url(#gap-arrow-end)"
          />

          {/* Column line ticks + numbers, above the container. */}
          {COL_LINES.map((x, index) => (
            <g key={`col-line-${index}`}>
              <line x1={x} y1={CONTAINER_Y - 8} x2={x} y2={CONTAINER_Y} stroke="var(--color-fg-muted)" strokeWidth={1} />
              <text x={x} y={CONTAINER_Y - 12} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{index + 1}</text>
            </g>
          ))}

          {/* Row line ticks + numbers, left of the container. */}
          {ROW_LINES.map((y, index) => (
            <g key={`row-line-${index}`}>
              <line x1={CONTAINER_X - 8} y1={y} x2={CONTAINER_X} y2={y} stroke="var(--color-fg-muted)" strokeWidth={1} />
              <text x={CONTAINER_X - 12} y={y + 4} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">{index + 1}</text>
            </g>
          ))}

          {/* Legend — two rows of colored swatches, matched to the highlights above. Each row's first swatch
              left-aligns to the container's left edge (CONTAINER_X). */}
          <g fontSize={11}>
            <rect x={CONTAINER_X} y={302} width={14} height={14} rx={3} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" />
            <text x={CONTAINER_X + 20} y={313} fill="var(--color-fg-default)">grid track (column)</text>

            <rect x={CONTAINER_X + 180} y={302} width={14} height={14} rx={3} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" />
            <text x={CONTAINER_X + 200} y={313} fill="var(--color-fg-default)">grid track (row)</text>

            <rect x={CONTAINER_X} y={326} width={14} height={14} rx={3} fill="none" stroke="var(--color-border-success-emphasis)" strokeWidth={2} />
            <text x={CONTAINER_X + 20} y={337} fill="var(--color-fg-default)">grid cell</text>

            <rect x={CONTAINER_X + 100} y={326} width={14} height={14} rx={3} fill="var(--color-bg-default)" stroke="var(--color-fg-muted)" />
            <text x={CONTAINER_X + 120} y={337} fill="var(--color-fg-default)">grid item</text>

            <line x1={CONTAINER_X + 205} y1={333} x2={CONTAINER_X + 219} y2={333} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerStart="url(#gap-arrow-start)" markerEnd="url(#gap-arrow-end)" />
            <text x={CONTAINER_X + 227} y={337} fill="var(--color-fg-default)">gap</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

GridAnatomyDiagram.displayName = "GridAnatomyDiagram";
