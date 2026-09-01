import type { JSX } from "react";
import { STEPS_EASING_CURVES } from "@/constants/steps-easing-curves";
import { buildStepsPathD, getStepsMarkerPoints } from "@/utils/steps-easing";
import GraphFrame from "@/components/GraphFrame";
import type { StepsEasingGraphProps } from "@/interfaces/steps-easing-graph";
import { Wrapper, Curve, FilledDot, OpenDot } from "@/components/StepsEasingGraph/StepsEasingGraph.styles";

// Static labeled staircase plot for a named steps() example — filled dots mark where a value is achieved, open dots mark where a tread ends but the value has already jumped on.
export default function StepsEasingGraph({ name, size = 200 }: StepsEasingGraphProps): JSX.Element {
  const { n, jumpTerm, label } = STEPS_EASING_CURVES[name];
  const d = buildStepsPathD(n, jumpTerm, size);
  const markers = getStepsMarkerPoints(n, jumpTerm, size);

  return (
    <>
      <Wrapper>
        <GraphFrame size={size} ariaLabel={`Progress-over-time step plot for ${label}`}>
          <Curve d={d} />
          {markers.map((marker, index) =>
            marker.filled
              ? <FilledDot key={index} cx={marker.x} cy={marker.y} r={4} />
              : <OpenDot key={index} cx={marker.x} cy={marker.y} r={4} />
          )}
        </GraphFrame>
      </Wrapper>
    </>
  );
}

StepsEasingGraph.displayName = "StepsEasingGraph";
