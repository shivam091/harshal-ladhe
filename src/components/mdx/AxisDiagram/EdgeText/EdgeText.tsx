import type { JSX } from "react";
import type { EdgeTextProps } from "@/interfaces/axis-diagram";
import { physicalTextClass, termTextClass } from "@/components/mdx/AxisDiagram/EdgeText/EdgeText.styles";
import { axisClass } from "@/components/mdx/AxisDiagram/AxisDiagram.helpers";

/*
  Renders one edge's two-line label (bold logical term, muted physical hint below it), matching this
  axis's color so a reader can trace "this text" back to "that arrow" at a glance.
*/
export default function EdgeText({ label, x, y, anchor }: EdgeTextProps): JSX.Element {
  return (
    <>
      <text x={x} y={y} textAnchor={anchor} className={`${termTextClass} ${axisClass(label.axis)}`}>
        {label.term}
      </text>
      <text x={x} y={y + 13} textAnchor={anchor} className={physicalTextClass}>
        ({label.physical})
      </text>
    </>
  );
}
