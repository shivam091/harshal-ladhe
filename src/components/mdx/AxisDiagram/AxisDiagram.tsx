import type { JSX } from "react";
import type { AxisDiagramProps } from "@/interfaces/axis-diagram";
import type { Axis } from "@/types/axis-diagram";
import { axisClass } from "@/components/mdx/AxisDiagram/AxisDiagram.helpers";
import EdgeText from "@/components/mdx/AxisDiagram/EdgeText";
import {
  CX,
  CY,
  AXIS_DIAGRAM_CONFIG,
  VERTICAL_ARROW_TOP,
  VERTICAL_ARROW_BOTTOM,
  HORIZONTAL_ARROW_START,
  HORIZONTAL_ARROW_END,
  LEGEND_Y,
  LEGEND_INLINE_X,
  LEGEND_BLOCK_X
} from "@/components/mdx/AxisDiagram/AxisDiagram.constants";
import {
  Wrapper,
  Svg,
  boxClass,
  inlineAxisClass,
  blockAxisClass,
  arrowLineClass,
  axisTagClass
} from "@/components/mdx/AxisDiagram/AxisDiagram.styles";

/* 
  Static, illustrative SVG diagram of the inline/block axes for one writing-mode + direction combo —
  replaces what used to be a hand-drawn ASCII box. See AxisDiagram.constants.ts for the four configs,
  kept in sync with the "Quick Reference" table in the post that uses this.
*/
export default function AxisDiagram({ variant }: AxisDiagramProps): JSX.Element {
  const config = AXIS_DIAGRAM_CONFIG[variant];
  const verticalAxis: Axis = config.horizontalAxis === "inline" ? "block" : "inline";
  const horizontalMarkerId = config.horizontalAxis === "inline" ? "axis-arrow-inline" : "axis-arrow-block";
  const verticalMarkerId = verticalAxis === "inline" ? "axis-arrow-inline" : "axis-arrow-block";
  const horizontalPointsRight = config.horizontalDirection === "start-to-end";

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 480 280" role="img" aria-label={config.ariaLabel}>
          <defs>
            <marker id="axis-arrow-inline" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" className={inlineAxisClass} />
            </marker>
            <marker id="axis-arrow-block" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" className={blockAxisClass} />
            </marker>
          </defs>

          <rect x={20} y={20} width={440} height={200} rx={12} className={boxClass} />

          {/* Vertical arrow — always top → bottom, true in every writing mode. */}
          <line
            x1={CX}
            y1={VERTICAL_ARROW_TOP}
            x2={CX}
            y2={VERTICAL_ARROW_BOTTOM}
            className={`${arrowLineClass} ${axisClass(verticalAxis)}`}
            markerEnd={`url(#${verticalMarkerId})`}
          />

          {/* Horizontal arrow — direction is the one thing that varies between variants. */}
          <line
            x1={HORIZONTAL_ARROW_START}
            y1={CY}
            x2={HORIZONTAL_ARROW_END}
            y2={CY}
            className={`${arrowLineClass} ${axisClass(config.horizontalAxis)}`}
            markerEnd={horizontalPointsRight ? `url(#${horizontalMarkerId})` : undefined}
            markerStart={horizontalPointsRight ? undefined : `url(#${horizontalMarkerId})`}
          />

          <EdgeText label={config.top} x={CX} y={45} anchor="middle" />
          <EdgeText label={config.bottom} x={CX} y={182} anchor="middle" />
          <EdgeText label={config.left} x={38} y={114} anchor="start" />
          <EdgeText label={config.right} x={442} y={114} anchor="end" />

          {/* Legend — color is never the only signal; the axis name is spelled out too. */}
          <g transform={`translate(${LEGEND_INLINE_X}, ${LEGEND_Y})`}>
            <line x1={0} y1={1} x2={20} y2={1} className={`${arrowLineClass} ${inlineAxisClass}`} />
            <text x={28} y={4} className={`${axisTagClass} ${inlineAxisClass}`}>
              inline axis
            </text>
          </g>
          <g transform={`translate(${LEGEND_BLOCK_X}, ${LEGEND_Y})`}>
            <line x1={0} y1={1} x2={20} y2={1} className={`${arrowLineClass} ${blockAxisClass}`} />
            <text x={28} y={4} className={`${axisTagClass} ${blockAxisClass}`}>
              block axis
            </text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

AxisDiagram.displayName = "AxisDiagram";
