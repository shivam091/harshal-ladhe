import { FIRST_STEP_X, STEP_W, STEP_GAP } from "@/components/mdx/MicrotaskMacrotaskTimelineDiagram/MicrotaskMacrotaskTimelineDiagram.constants";

// Left x of a step box by index, so the boxes and the arrows between them share one spacing rule.
export function stepX(index: number): number {
  return FIRST_STEP_X + index * (STEP_W + STEP_GAP);
}
