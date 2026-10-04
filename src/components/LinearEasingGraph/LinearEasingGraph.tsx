import type { JSX } from "react";
import { LINEAR_EASING_CURVES } from "@/constants/linear-easing-presets";
import {
  LINEAR_EASING_VALUE_MIN,
  LINEAR_EASING_VALUE_MAX,
  resolveLinearEasingStops,
  buildLinearEasingPoints,
  toLinearPlotPoint,
  valueToPlotY,
  getPlotInset
} from "@/utils/linear-easing";
import type { LinearEasingGraphProps } from "@/components/LinearEasingGraph/LinearEasingGraph.types";
import GraphFrame from "@/components/GraphFrame";
import { GuideLine, Curve } from "@/components/LinearEasingPlayground/LinearEasingPlayground.styles";
import { Wrapper, StopDot } from "@/components/LinearEasingGraph/LinearEasingGraph.styles";

// Shares the playground's axes and value range, so a static graph and the editor read as one system.
export default function LinearEasingGraph({ presetKey, size = 200 }: LinearEasingGraphProps): JSX.Element {
  const { label, stops } = LINEAR_EASING_CURVES[presetKey];
  const resolvedStops = resolveLinearEasingStops(stops);
  const points = buildLinearEasingPoints(resolvedStops, size, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);
  const inset = getPlotInset(size);
  const zeroLineY = valueToPlotY(0, size, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);
  const oneLineY = valueToPlotY(1, size, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);

  return (
    <>
      <Wrapper>
        <GraphFrame size={size} inset={inset} ariaLabel={`Progress-over-time linear() curve for ${label}`}>
          <GuideLine x1={inset} y1={zeroLineY} x2={size - inset} y2={zeroLineY} />
          <GuideLine x1={inset} y1={oneLineY} x2={size - inset} y2={oneLineY} />
          <Curve points={points} />
          {resolvedStops.map((stop) => {
            const [x, y] = toLinearPlotPoint(stop, size, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);
            return <StopDot key={stop.id} cx={x} cy={y} r={4} />;
          })}
        </GraphFrame>
      </Wrapper>
    </>
  );
}

LinearEasingGraph.displayName = "LinearEasingGraph";
