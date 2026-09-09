import type { JSX } from "react";
import type { SegmentBoxProps } from "@/interfaces/layout-composition-diagram";
import { segmentClass } from "@/components/mdx/LayoutCompositionDiagram/LayoutCompositionDiagram.helpers";
import {
  segmentTitleClass,
  segmentFileClass
} from "@/components/mdx/LayoutCompositionDiagram/LayoutCompositionDiagram.styles";

/*
  Renders one nested route segment's box: a rect colored by persists/swaps status, plus a two-line
  label (bold title, muted monospace file path) anchored at its top-left corner.
*/
export default function SegmentBox({ x, y, width, height, segment }: SegmentBoxProps): JSX.Element {
  return (
    <>
      <rect x={x} y={y} width={width} height={height} rx={10} className={segmentClass(segment.status)} />
      <text x={x + 10} y={y + 16} className={segmentTitleClass}>
        {segment.label}
      </text>
      <text x={x + 10} y={y + 28} className={segmentFileClass}>
        {segment.file}
      </text>
    </>
  );
}

SegmentBox.displayName = "SegmentBox";
