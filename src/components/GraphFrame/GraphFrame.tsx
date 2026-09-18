import { forwardRef, type JSX } from "react";
import type { GraphFrameProps } from "@/interfaces/graph-frame";
import { GraphPlot, Svg, Axis, VerticalAxisLabel, HorizontalAxisLabel } from "@/components/GraphFrame/GraphFrame.styles";

// Shared axis+label chrome behind every timing-function graph — BezierGraph, StepsEasingGraph, and LinearEasingGraph/Playground each layer their own curve/marker svg content as children, plotted in whatever value domain they need.
const GraphFrame = forwardRef<SVGSVGElement, GraphFrameProps>(function GraphFrame(
  { size, ariaLabel, verticalLabel = "Progression", horizontalLabel = "Time", inset = 0, children },
  ref
): JSX.Element {
  return (
    <>
      <GraphPlot style={{ inlineSize: size }}>
        <Svg ref={ref} viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={ariaLabel}>
          <Axis d={`M${inset},${inset} L${inset},${size - inset} L${size - inset},${size - inset}`} />
          {children}
        </Svg>
        <VerticalAxisLabel style={{ inlineSize: size }}>{verticalLabel}</VerticalAxisLabel>
        <HorizontalAxisLabel style={{ inlineSize: size }}>{horizontalLabel}</HorizontalAxisLabel>
      </GraphPlot>
    </>
  );
});

GraphFrame.displayName = "GraphFrame";
export default GraphFrame;
