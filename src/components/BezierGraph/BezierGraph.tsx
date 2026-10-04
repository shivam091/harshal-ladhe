import { forwardRef } from "react";
import type { JSX } from "react";
import { buildBezierPathD } from "@/utils/bezier";
import type { BezierGraphProps } from "@/components/BezierGraph/BezierGraph.types";
import GraphFrame from "@/components/GraphFrame";
import { Curve } from "@/components/BezierGraph/BezierGraph.styles";

// One plotting component for static and editable curves, so every bezier on the site looks the same.
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
