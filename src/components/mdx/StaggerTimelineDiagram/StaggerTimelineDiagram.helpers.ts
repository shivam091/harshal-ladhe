import { normalize } from "@/utils/number";
import { AXIS_LEFT, AXIS_RIGHT, AXIS_MAX_MS, STEP_MS } from "@/components/mdx/StaggerTimelineDiagram/StaggerTimelineDiagram.constants";

// Maps milliseconds onto the shared time axis, so both panels are directly comparable.
export function msToX(ms: number): number {
  return normalize(ms, 0, AXIS_MAX_MS, AXIS_LEFT, AXIS_RIGHT);
}

// The CSS delay for a zero-based card index, with the optional min() cap applied exactly as the post writes it.
export function getDelayMs(index: number, cap: number | null): number {
  return (cap === null ? index : Math.min(index, cap)) * STEP_MS;
}
