import type { Axis } from "@/types/axis-diagram";
import {
  inlineAxisClass,
  blockAxisClass
} from "@/components/mdx/AxisDiagram/AxisDiagram.styles";

// Maps an axis to its themed color class, so its arrow, edge text, and legend entry all match.
export function axisClass(axis: Axis): string {
  return axis === "inline" ? inlineAxisClass : blockAxisClass;
}
