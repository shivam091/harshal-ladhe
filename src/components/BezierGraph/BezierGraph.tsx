import { forwardRef, type JSX } from "react";
import { buildBezierPathD } from "@/utils/bezier";
import type { BezierGraphProps } from "@/interfaces/bezier-graph";
import GraphFrame from "@/components/GraphFrame";
import { Curve } from "@/components/BezierGraph/BezierGraph.styles";

// Plot box: bezier curve plotted inside the shared GraphFrame axis/label chrome.
const BezierGraph = forwardRef<SVGSVGElement, BezierGraphProps>(function BezierGraph(
  { p1, p2, size, ariaLabel, verticalLabel, horizontalLabel, children },
  ref
): JSX.Element {
  const d = buildBezierPathD(p1, p2, size);

  return (
    <>
      <GraphFrame ref={ref} size={size} ariaLabel={ariaLabel} verticalLabel={verticalLabel} horizontalLabel={horizontalLabel}>
        <Curve d={d} />
        {children}
      </GraphFrame>
    </>
  );
});

BezierGraph.displayName = "BezierGraph";
export default BezierGraph;
