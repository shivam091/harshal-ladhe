import { forwardRef, type JSX } from "react";
import type { GraphFrameProps } from "@/components/GraphFrame/GraphFrame.types";
import { GraphPlot, Svg, Axis, VerticalAxisLabel, HorizontalAxisLabel } from "@/components/GraphFrame/GraphFrame.styles";

// Owns only the axis and label chrome so each graph can plot its own curve content in whatever value domain it needs.
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
