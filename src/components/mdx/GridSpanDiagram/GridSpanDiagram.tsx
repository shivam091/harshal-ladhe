import type { JSX } from "react";
import { CELL, TRACK, LINES, CONTAINER_X, CONTAINER_SIZE } from "@/components/mdx/GridSpanDiagram/GridSpanDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GridSpanDiagram/GridSpanDiagram.styles";

// Static SVG diagram of the post's own spanning example — an item placed with `grid-column: 1 / 3` and
// `grid-row: 2 / 4` inside a 3x3 grid, alongside the three items that keep their normal, unspanned cells.
export default function GridSpanDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 380 440" role="img" aria-labelledby="grid-span-diagram-title grid-span-diagram-desc">
          <title id="grid-span-diagram-title">Grid item spanning diagram</title>
          <desc id="grid-span-diagram-desc">
            A 3x3 grid where Item 2, Item 3, and Item 4 each occupy their own cell in the top row, and a fourth
            item labeled Spanning covers a merged 2x2 region below them, from grid line 1 to 3 across and from
            grid line 2 to 4 down. The remaining cell in the bottom right stays empty.
          </desc>

          {/* Grid container */}
          <rect
            x={CONTAINER_X} y={CONTAINER_X} width={CONTAINER_SIZE} height={CONTAINER_SIZE} rx={10}
            fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5}
          />

          {/* Item 2, Item 3, Item 4 — each in its own cell along the top row. */}
          {["Item 2", "Item 3", "Item 4"].map((label, colIndex) => (
            <g key={label}>
              <rect x={TRACK[colIndex]} y={TRACK[0]} width={CELL} height={CELL} fill="none" stroke="var(--color-border-muted)" strokeWidth={1} />
              <text x={TRACK[colIndex] + CELL / 2} y={TRACK[0] + CELL / 2 + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{label}</text>
            </g>
          ))}

          {/* The one remaining empty cell — bottom right, untouched by the spanning item. */}
          <rect x={TRACK[2]} y={TRACK[2]} width={CELL} height={CELL} fill="none" stroke="var(--color-border-muted)" strokeWidth={1} />

          {/* Spanning — grid-column: 1 / 3, grid-row: 2 / 4, covering columns 1-2 and rows 2-3. */}
          <rect
            x={TRACK[0]} y={TRACK[1]} width={TRACK[1] + CELL - TRACK[0]} height={TRACK[2] + CELL - TRACK[1]} rx={6}
            fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={2}
          />
          <text
            x={TRACK[0] + (TRACK[1] + CELL - TRACK[0]) / 2} y={TRACK[1] + (TRACK[2] + CELL - TRACK[1]) / 2 + 4}
            textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)"
          >
            Spanning
          </text>

          {/* Grid line numbers — columns above the container, rows to its left. */}
          {LINES.map((position, index) => (
            <g key={`line-${index}`}>
              <line x1={position} y1={CONTAINER_X - 8} x2={position} y2={CONTAINER_X} stroke="var(--color-fg-muted)" strokeWidth={1} />
              <text x={position} y={CONTAINER_X - 12} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{index + 1}</text>
              <line x1={CONTAINER_X - 8} y1={position} x2={CONTAINER_X} y2={position} stroke="var(--color-fg-muted)" strokeWidth={1} />
              <text x={CONTAINER_X - 12} y={position + 4} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">{index + 1}</text>
            </g>
          ))}

          {/* Caption spelling out the two properties the highlighted region represents. */}
          <text
            x={CONTAINER_X + 130} y={CONTAINER_X + CONTAINER_SIZE + 28} textAnchor="middle" fontSize={12} fill="var(--color-fg-muted)"
            fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
          >
            grid-column: 1 / 3 &#183; grid-row: 2 / 4
          </text>

          {/* Legend — distinguishes the highlighted spanning item from a regular, unspanned cell. Left-aligns
              to the container's left edge (CONTAINER_X). */}
          <g fontSize={11}>
            <rect x={CONTAINER_X} y={CONTAINER_X + CONTAINER_SIZE + 42} width={14} height={14} rx={3} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />
            <text x={CONTAINER_X + 20} y={CONTAINER_X + CONTAINER_SIZE + 53} fill="var(--color-fg-default)">spanning item</text>

            <rect x={CONTAINER_X + 130} y={CONTAINER_X + CONTAINER_SIZE + 42} width={14} height={14} rx={3} fill="none" stroke="var(--color-border-muted)" strokeWidth={1} />
            <text x={CONTAINER_X + 150} y={CONTAINER_X + CONTAINER_SIZE + 53} fill="var(--color-fg-default)">regular cell</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

GridSpanDiagram.displayName = "GridSpanDiagram";
