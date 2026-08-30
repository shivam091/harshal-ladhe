import type { Axis } from "@/components/mdx/AxisDiagram/AxisDiagram.types";
import {
  inlineAxisClass,
  blockAxisClass
} from "@/components/mdx/AxisDiagram/AxisDiagram.styles";

// Maps an axis to its themed colour class, so its arrow, edge text, and legend entry all match.
export function axisClass(axis: Axis): string {
  return axis === "inline" ? inlineAxisClass : blockAxisClass;
}
