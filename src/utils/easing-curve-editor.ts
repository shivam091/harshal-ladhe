import type { BezierPoint } from "@/types/bezier";
import type { EasingCurveEditorState } from "@/interfaces/easing-curve-editor";

// Same 2-decimal rounding as CubicBezierPlayground.helpers.ts's own formatCubicBezier — kept as a local copy rather than importing across the components/utils boundary, since it's a 1-line pure formatter with nothing else worth sharing from that file.
export function formatCubicBezier(p1: BezierPoint, p2: BezierPoint): string {
  return `cubic-bezier(${p1[0].toFixed(2)}, ${p1[1].toFixed(2)}, ${p2[0].toFixed(2)}, ${p2[1].toFixed(2)})`;
}

export function compileTimingFunction(state: EasingCurveEditorState): string {
  return formatCubicBezier(state.p1, state.p2);
}

/*
  Single entry point every export format (CSS/Tailwind/React) and every preview calls — one source
  of truth for "what does this state compile to." Omits the delay clause when it's 0, the CSS
  shorthand's own default, so an untouched delay doesn't clutter the output with `0ms` at the end.
*/
export function compileTransitionValue(state: EasingCurveEditorState): string {
  const timingFunction = compileTimingFunction(state);
  const delayClause = state.delayMs > 0 ? ` ${state.delayMs}ms` : "";
  return `${state.property} ${state.durationMs}ms ${timingFunction}${delayClause}`;
}
