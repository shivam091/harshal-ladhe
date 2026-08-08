import type { TransitionTimingCurveConfig } from "@/components/mdx/TransitionTimingDiagram/TransitionTimingDiagram.types";
import { PLOT_LEFT, PLOT_BOTTOM, PLOT_W, PLOT_H } from "@/components/mdx/TransitionTimingDiagram/TransitionTimingDiagram.constants";

/*
  Converts a curve's 0-1 cubic-bezier control points into an SVG cubic path across the plot area, flipping the
  y axis so progress increases upward — the same visual convention browser devtools' bezier editor uses.
*/
export function buildTimingCurvePath(config: TransitionTimingCurveConfig): string {
  const startX = PLOT_LEFT;
  const startY = PLOT_BOTTOM;
  const endX = PLOT_LEFT + PLOT_W;
  const endY = PLOT_BOTTOM - PLOT_H;
  const control1X = PLOT_LEFT + config.p1x * PLOT_W;
  const control1Y = PLOT_BOTTOM - config.p1y * PLOT_H;
  const control2X = PLOT_LEFT + config.p2x * PLOT_W;
  const control2Y = PLOT_BOTTOM - config.p2y * PLOT_H;
  return `M ${startX},${startY} C ${control1X},${control1Y} ${control2X},${control2Y} ${endX},${endY}`;
}
