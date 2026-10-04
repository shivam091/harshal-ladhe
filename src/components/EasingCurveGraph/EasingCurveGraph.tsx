import type { JSX } from "react";
import { EASING_CURVES } from "@/constants/easing-curves";
import { toPlotPoint } from "@/utils/bezier";
import BezierGraph from "@/components/BezierGraph";
import { GuideLine } from "@/components/BezierGraph/BezierGraph.styles";
import type { EasingCurveGraphProps } from "@/components/EasingCurveGraph/EasingCurveGraph.types";
import { Wrapper, ControlPoint } from "@/components/EasingCurveGraph/EasingCurveGraph.styles";

// Small enough to read as a marker rather than the playground's grabbable handle.
const CONTROL_POINT_RADIUS = 6;

// Looks curves up by name so a graph and the prose around it can't quote different numbers.
export default function EasingCurveGraph({ name, size = 200 }: EasingCurveGraphProps): JSX.Element {
  const { p1, p2, label } = EASING_CURVES[name];

  // Guides start at the curve's own anchors, which sit inset from the axis corners.
  const [startX, startY] = toPlotPoint([0, 0], size);
  const [endX, endY] = toPlotPoint([1, 1], size);
  const [x1, y1] = toPlotPoint(p1, size);
  const [x2, y2] = toPlotPoint(p2, size);

  return (
    <>
      <Wrapper>
        <BezierGraph
          p1={p1}
          p2={p2}
          size={size}
          ariaLabel={`Progress-over-time bezier curve for the "${label}" easing function, with control points at (${p1.join(", ")}) and (${p2.join(", ")})`}
        >
          <GuideLine x1={startX} y1={startY} x2={x1} y2={y1} />
          <GuideLine x1={endX} y1={endY} x2={x2} y2={y2} />
          <ControlPoint cx={x1} cy={y1} r={CONTROL_POINT_RADIUS} />
          <ControlPoint cx={x2} cy={y2} r={CONTROL_POINT_RADIUS} />
        </BezierGraph>
      </Wrapper>
    </>
  );
}

EasingCurveGraph.displayName = "EasingCurveGraph";
