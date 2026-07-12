import type { JSX } from "react";
import { COL_W, ROW_H, COL_X, ROW_Y, ORIGIN_X, ORIGIN_Y, TOTAL_W } from "@/components/mdx/GridAreasDiagram/GridAreasDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GridAreasDiagram/GridAreasDiagram.styles";

/*
  Static SVG diagram of the post's own `grid-template-areas` example — one colored, labeled region per named
  area, matching the exact "header header header" / "sidebar main main" / "footer footer footer" layout above.
*/
export default function GridAreasDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 440 320" role="img" aria-labelledby="grid-areas-diagram-title grid-areas-diagram-desc">
          <title id="grid-areas-diagram-title">grid-template-areas diagram</title>
          <desc id="grid-areas-diagram-desc">
            A 3-column, 3-row grid divided into four named areas: header spanning the full width across the top,
            sidebar in the narrow first column, main spanning the two wider columns beside it, and footer
            spanning the full width across the bottom.
          </desc>

          {/* Backdrop — shows through the gaps between the four named-area regions. */}
          <rect x={ORIGIN_X - 12} y={ORIGIN_Y - 12} width={TOTAL_W + 24} height={ROW_Y[2] + ROW_H[2] - ORIGIN_Y + 24} rx={12} fill="var(--color-bg-muted)" />

          {/* header — spans all 3 columns on row 1. */}
          <rect x={COL_X[0]} y={ROW_Y[0]} width={TOTAL_W} height={ROW_H[0]} rx={6} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
          <text x={COL_X[0] + TOTAL_W / 2} y={ROW_Y[0] + ROW_H[0] / 2 + 4} textAnchor="middle" fontSize={13} fill="var(--color-fg-default)">header</text>

          {/* sidebar — column 1 only, on row 2. */}
          <rect x={COL_X[0]} y={ROW_Y[1]} width={COL_W[0]} height={ROW_H[1]} rx={6} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" strokeWidth={1.5} />
          <text x={COL_X[0] + COL_W[0] / 2} y={ROW_Y[1] + ROW_H[1] / 2 + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">sidebar</text>

          {/* main — columns 2 and 3, on row 2. */}
          <rect x={COL_X[1]} y={ROW_Y[1]} width={COL_X[2] + COL_W[2] - COL_X[1]} height={ROW_H[1]} rx={6} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <text x={COL_X[1] + (COL_X[2] + COL_W[2] - COL_X[1]) / 2} y={ROW_Y[1] + ROW_H[1] / 2 + 4} textAnchor="middle" fontSize={13} fill="var(--color-fg-default)">main</text>

          {/* footer — spans all 3 columns on row 3. */}
          <rect x={COL_X[0]} y={ROW_Y[2]} width={TOTAL_W} height={ROW_H[2]} rx={6} fill="var(--color-bg-neutral-muted)" stroke="var(--color-border-neutral-muted)" strokeWidth={1.5} />
          <text x={COL_X[0] + TOTAL_W / 2} y={ROW_Y[2] + ROW_H[2] / 2 + 4} textAnchor="middle" fontSize={13} fill="var(--color-fg-default)">footer</text>
        </Svg>
      </Wrapper>
    </>
  );
}

GridAreasDiagram.displayName = "GridAreasDiagram";
