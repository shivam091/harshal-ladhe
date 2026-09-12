import { FIRST_STEP_X, STEP_W, STEP_GAP } from "@/components/mdx/MicrotaskMacrotaskTimelineDiagram/MicrotaskMacrotaskTimelineDiagram.constants";

// Left x coordinate of the step box at the given index in STEPS, each one STEP_W + STEP_GAP further right than the last.
export function stepX(index: number): number {
  return FIRST_STEP_X + index * (STEP_W + STEP_GAP);
}
