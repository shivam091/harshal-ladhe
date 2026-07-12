import type { JSX } from "react";
import {
  SIDEBAR_W, MAIN_W, ROW_H, ORIGIN_X, ORIGIN_Y, MAIN_X,
  CONTAINER_X, CONTAINER_Y, CONTAINER_W, CONTAINER_H,
  LINE_SIDEBAR_START_X, LINE_SIDEBAR_END_MAIN_START_X, LINE_MAIN_END_X
} from "@/components/mdx/GridNamedLinesDiagram/GridNamedLinesDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GridNamedLinesDiagram/GridNamedLinesDiagram.styles";

// y coordinate of the tick marks for each named line, just above the container.
const LINE_TICK_Y1 = CONTAINER_Y - 8;

// y coordinate of the named-line labels, just above their tick marks.
const LINE_LABEL_Y = CONTAINER_Y - 12;

// y coordinate of the first caption line, below the container.
const CAPTION_Y1 = CONTAINER_Y + CONTAINER_H + 28;

// y coordinate of the second caption line, below the first.
const CAPTION_Y2 = CAPTION_Y1 + 26;

/*
  Static SVG diagram of the post's own named-lines example — a `250px` sidebar track and a `1fr` main track,
  with the three named lines (`[sidebar-start]`, `[sidebar-end main-start]`, `[main-end]`) labelled above,
  matching the exact bracket syntax used in the CSS example.
*/
export default function GridNamedLinesDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 540 300" role="img" aria-labelledby="grid-named-lines-diagram-title grid-named-lines-diagram-desc">
          <title id="grid-named-lines-diagram-title">Named grid lines diagram</title>
          <desc id="grid-named-lines-diagram-desc">
            A 2-column grid with a narrow sidebar track and a wider main track. Three named lines are labeled
            above: sidebar-start at the left edge of the sidebar, sidebar-end and main-start together at the
            shared line between the two tracks, and main-end at the right edge of the main track.
          </desc>

          {/* Backdrop — shows through the gap between the sidebar and main tracks. */}
          <rect x={CONTAINER_X} y={CONTAINER_Y} width={CONTAINER_W} height={CONTAINER_H} rx={12} fill="var(--color-bg-muted)" />

          {/* sidebar — grid-column: sidebar-start / sidebar-end */}
          <rect x={ORIGIN_X} y={ORIGIN_Y} width={SIDEBAR_W} height={ROW_H} rx={6} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" strokeWidth={1.5} />
          <text x={ORIGIN_X + SIDEBAR_W / 2} y={ORIGIN_Y + ROW_H / 2 + 4} textAnchor="middle" fontSize={13} fill="var(--color-fg-default)">sidebar</text>

          {/* main — grid-column: main-start / main-end */}
          <rect x={MAIN_X} y={ORIGIN_Y} width={MAIN_W} height={ROW_H} rx={6} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <text x={MAIN_X + MAIN_W / 2} y={ORIGIN_Y + ROW_H / 2 + 4} textAnchor="middle" fontSize={13} fill="var(--color-fg-default)">main</text>

          {/* Named line ticks + labels, above the container — using the exact bracket syntax from the CSS example. */}
          <line x1={LINE_SIDEBAR_START_X} y1={LINE_TICK_Y1} x2={LINE_SIDEBAR_START_X} y2={CONTAINER_Y} stroke="var(--color-fg-muted)" strokeWidth={1} />
          <text x={LINE_SIDEBAR_START_X} y={LINE_LABEL_Y} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">[sidebar-start]</text>

          <line x1={LINE_SIDEBAR_END_MAIN_START_X} y1={LINE_TICK_Y1} x2={LINE_SIDEBAR_END_MAIN_START_X} y2={CONTAINER_Y} stroke="var(--color-fg-muted)" strokeWidth={1} />
          <text x={LINE_SIDEBAR_END_MAIN_START_X} y={LINE_LABEL_Y} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">[sidebar-end main-start]</text>

          <line x1={LINE_MAIN_END_X} y1={LINE_TICK_Y1} x2={LINE_MAIN_END_X} y2={CONTAINER_Y} stroke="var(--color-fg-muted)" strokeWidth={1} />
          <text x={LINE_MAIN_END_X} y={LINE_LABEL_Y} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">[main-end]</text>

          {/* Legend — a coloured swatch matching each region, named, then followed by the grid-column rule it
              maps to. Both rows left-align to the container's left edge (CONTAINER_X). */}
          <g fontSize={12}>
            <rect x={CONTAINER_X} y={CAPTION_Y1 - 11} width={14} height={14} rx={3} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" strokeWidth={1.5} />
            <text x={CONTAINER_X + 20} y={CAPTION_Y1} fill="var(--color-fg-default)">sidebar — grid-column: sidebar-start / sidebar-end</text>

            <rect x={CONTAINER_X} y={CAPTION_Y2 - 11} width={14} height={14} rx={3} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
            <text x={CONTAINER_X + 20} y={CAPTION_Y2} fill="var(--color-fg-default)">main — grid-column: main-start / main-end</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

GridNamedLinesDiagram.displayName = "GridNamedLinesDiagram";
