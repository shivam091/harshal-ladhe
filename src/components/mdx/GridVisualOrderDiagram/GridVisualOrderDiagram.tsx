import type { JSX } from "react";
import {
  BOX_W, BOX_H, BOX_CX, BOX_X, PANEL1_BOX_TOP, PANEL1_ARROW_Y,
  PANEL2_BOX_TOP, PANEL2_LANE_Y, PANEL2_ARC_PEAK_Y, PANEL2_VISUAL_LABELS
} from "@/components/mdx/GridVisualOrderDiagram/GridVisualOrderDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GridVisualOrderDiagram/GridVisualOrderDiagram.styles";

/*
  Static SVG diagram contrasting DOM order with visual order. Top panel: 4 items in their natural source
  order, where tab order simply follows the boxes left to right. Bottom panel: the same 4 items, but Item 4
  has been moved to appear first on screen (e.g. via `grid-column`) — the DOM, and therefore tab order,
  hasn't changed, so focus still visits Items 1-3 before jumping back to Item 4's new, earlier position.
*/
export default function GridVisualOrderDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 400 330" role="img" aria-labelledby="grid-visual-order-diagram-title grid-visual-order-diagram-desc">
          <title id="grid-visual-order-diagram-title">Visual order vs. DOM order diagram</title>
          <desc id="grid-visual-order-diagram-desc">
            Top panel: Items 1 through 4 in a row, with tab order following them left to right, matching what
            is on screen. Bottom panel: the same 4 items, but Item 4 now appears first on screen. Tab order
            still visits Item 1, then Item 2, then Item 3, then loops back to Item 4 in its new, earlier
            position — a mismatch between what a keyboard or screen reader user experiences and what is shown.
          </desc>

          <defs>
            <marker id="grid-visual-order-arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            <marker id="grid-visual-order-arrow-danger" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-danger)" />
            </marker>
          </defs>

          {/* Panel 1 — DOM order and visual order match. */}
          <text x={200} y={24} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">Source order = visual order</text>
          {BOX_X.map((x, index) => (
            <g key={`panel1-${index}`}>
              <rect x={x} y={PANEL1_BOX_TOP} width={BOX_W} height={BOX_H} rx={6} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
              <text x={x + BOX_W / 2} y={PANEL1_BOX_TOP + BOX_H / 2 + 4} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">{`Item ${index + 1}`}</text>
            </g>
          ))}
          <path d={`M${BOX_CX[0]},${PANEL1_ARROW_Y} L${BOX_CX[3]},${PANEL1_ARROW_Y}`} stroke="var(--color-fg-muted)" strokeWidth={1.5} fill="none" markerEnd="url(#grid-visual-order-arrow-muted)" />
          <line x1={BOX_CX[1]} y1={PANEL1_ARROW_Y - 4} x2={BOX_CX[1]} y2={PANEL1_ARROW_Y + 4} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
          <line x1={BOX_CX[2]} y1={PANEL1_ARROW_Y - 4} x2={BOX_CX[2]} y2={PANEL1_ARROW_Y + 4} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
          <text x={200} y={140} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">Tab order: 1 → 2 → 3 → 4 — matches what's on screen ✓</text>

          {/* Panel 2 — Item 4 moved to appear first on screen; DOM order (and tab order) is unchanged. */}
          <text x={200} y={168} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">Visually reordered, DOM unchanged</text>
          {BOX_X.map((x, index) => (
            <g key={`panel2-${index}`}>
              <rect
                x={x} y={PANEL2_BOX_TOP} width={BOX_W} height={BOX_H} rx={6}
                fill={index === 0 ? "var(--color-bg-accent-muted)" : "var(--color-bg-muted)"}
                stroke={index === 0 ? "var(--color-border-accent-emphasis)" : "var(--color-border-default)"}
                strokeWidth={1.5}
              />
              <text x={x + BOX_W / 2} y={PANEL2_BOX_TOP + BOX_H / 2 + 4} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">{PANEL2_VISUAL_LABELS[index]}</text>
            </g>
          ))}
          {/* Forward: Item 1 → Item 2 → Item 3, now sitting in visual positions 2, 3, and 4. */}
          <path d={`M${BOX_CX[1]},${PANEL2_LANE_Y} L${BOX_CX[3]},${PANEL2_LANE_Y}`} stroke="var(--color-fg-muted)" strokeWidth={1.5} fill="none" markerEnd="url(#grid-visual-order-arrow-muted)" />
          <line x1={BOX_CX[2]} y1={PANEL2_LANE_Y - 4} x2={BOX_CX[2]} y2={PANEL2_LANE_Y + 4} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
          {/* Backward: focus then jumps from Item 3 all the way back to Item 4, now in the first visual position. */}
          <path
            d={`M${BOX_CX[3]},${PANEL2_LANE_Y} C${BOX_CX[3]},${PANEL2_ARC_PEAK_Y} ${BOX_CX[0]},${PANEL2_ARC_PEAK_Y} ${BOX_CX[0]},${PANEL2_LANE_Y}`}
            stroke="var(--color-fg-danger)" strokeWidth={1.5} fill="none" markerEnd="url(#grid-visual-order-arrow-danger)"
          />
          <text x={200} y={302} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">Tab order still goes 1 → 2 → 3 → 4 — but Item 4 now appears first ⚠</text>
        </Svg>
      </Wrapper>
    </>
  );
}

GridVisualOrderDiagram.displayName = "GridVisualOrderDiagram";
