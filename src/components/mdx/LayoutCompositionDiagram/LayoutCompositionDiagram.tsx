import type { JSX } from "react";
import type { LayoutCompositionState } from "@/interfaces/layout-composition-diagram";
import SegmentBox from "@/components/mdx/LayoutCompositionDiagram/SegmentBox";
import {
  VIEWBOX,
  PANEL_WIDTH,
  PANEL_A_X,
  PANEL_B_X,
  CAPTION_Y,
  SEGMENT_RECTS,
  CONTENT_LABEL_Y,
  ARROW_Y,
  ARROW_X_START,
  ARROW_X_END,
  LEGEND_Y,
  LEGEND_PERSISTS_X,
  LEGEND_SWAPS_X,
  STATE_A,
  STATE_B
} from "@/components/mdx/LayoutCompositionDiagram/LayoutCompositionDiagram.constants";
import {
  Wrapper,
  Svg,
  persistBoxClass,
  swapBoxClass,
  contentLabelClass,
  captionClass,
  arrowLineClass,
  arrowLabelClass,
  legendTextClass
} from "@/components/mdx/LayoutCompositionDiagram/LayoutCompositionDiagram.styles";

// One panel: a route caption plus its three nested segment boxes and the page's visible content label.
function Panel({ state, panelX }: { state: LayoutCompositionState; panelX: number }): JSX.Element {
  return (
    <>
      <text x={panelX + PANEL_WIDTH / 2} y={CAPTION_Y} className={captionClass}>
        {state.route}
      </text>
      {state.segments.map((segment, index) => {
        const rect = SEGMENT_RECTS[index];
        return (
          <SegmentBox
            key={segment.file}
            x={panelX + rect.insetX}
            y={rect.y}
            width={PANEL_WIDTH - rect.insetX * 2}
            height={rect.height}
            segment={segment}
          />
        );
      })}
      <text x={panelX + PANEL_WIDTH / 2} y={CONTENT_LABEL_Y} className={contentLabelClass}>
        {state.content}
      </text>
    </>
  );
}

/*
  Static, illustrative SVG diagram comparing two states of the same route subtree: viewing
  /dashboard/settings, then navigating to the sibling /dashboard/billing. Both share app/layout.tsx
  and app/dashboard/layout.tsx — this makes it visually obvious that only the innermost page.tsx
  content is torn down and replaced, while both layouts stay mounted the whole time.
*/
export default function LayoutCompositionDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox={VIEWBOX} role="img" aria-labelledby="layout-composition-diagram-title">
          <title id="layout-composition-diagram-title">
            Diagram comparing /dashboard/settings and /dashboard/billing: app/layout.tsx and
            app/dashboard/layout.tsx persist unchanged across the navigation, while only
            app/dashboard/[page]/page.tsx is torn down and remounted with the new page&apos;s content.
          </title>

          <Panel state={STATE_A} panelX={PANEL_A_X} />
          <Panel state={STATE_B} panelX={PANEL_B_X} />

          {/* Connecting arrow between the two panels, showing the direction of the navigation being compared. */}
          <line
            x1={ARROW_X_START}
            y1={ARROW_Y}
            x2={ARROW_X_END}
            y2={ARROW_Y}
            className={arrowLineClass}
            markerEnd="url(#layout-composition-arrow)"
          />
          <text x={(ARROW_X_START + ARROW_X_END) / 2} y={ARROW_Y - 8} className={arrowLabelClass}>
            navigate
          </text>
          <defs>
            <marker id="layout-composition-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" className={arrowLineClass} />
            </marker>
          </defs>

          {/* Legend — color is never the only signal; each status is spelled out too. */}
          <g transform={`translate(${LEGEND_PERSISTS_X}, ${LEGEND_Y})`}>
            <rect x={0} y={-10} width={14} height={14} rx={3} className={persistBoxClass} />
            <text x={20} y={1} className={legendTextClass} fill="var(--color-fg-success)">
              persists — stays mounted
            </text>
          </g>
          <g transform={`translate(${LEGEND_SWAPS_X}, ${LEGEND_Y})`}>
            <rect x={0} y={-10} width={14} height={14} rx={3} className={swapBoxClass} />
            <text x={20} y={1} className={legendTextClass} fill="var(--color-fg-attention)">
              swaps — remounts
            </text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

LayoutCompositionDiagram.displayName = "LayoutCompositionDiagram";
