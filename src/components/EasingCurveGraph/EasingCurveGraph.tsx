import type { JSX } from "react";
import { EASING_CURVES } from "@/constants/easing-curves";
import BezierGraph from "@/components/BezierGraph";
import type { EasingCurveGraphProps } from "@/interfaces/easing-curve-graph";
import { Wrapper } from "@/components/EasingCurveGraph/EasingCurveGraph.styles";

// Static labeled bezier plot for a named easing curve.
export default function EasingCurveGraph({ name, size = 200 }: EasingCurveGraphProps): JSX.Element {
  const { p1, p2, label } = EASING_CURVES[name];

  return (
    <>
      <Wrapper>
        <BezierGraph
          p1={p1}
          p2={p2}
          size={size}
          verticalLabel="Progression"
          ariaLabel={`Progress-over-time bezier curve for the "${label}" easing function`}
        />
      </Wrapper>
    </>
  );
}

EasingCurveGraph.displayName = "EasingCurveGraph";
