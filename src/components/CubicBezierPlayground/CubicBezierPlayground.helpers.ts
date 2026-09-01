import { clamp, normalize } from "@/utils/number";
import { getPlotInset } from "@/utils/plot";
import type { BezierPoint } from "@/types/bezier";

/*
  Converts a pointer event's client coordinates into a bezier control point: time clamped to
  the CSS-spec-required [0,1], progress allowed further outside [0,1] (-1 to 2) so overshoot
  and anticipation curves stay explorable.
*/
export function pointerEventToPoint(clientX: number, clientY: number, rect: DOMRect, size: number): BezierPoint {
  const inset = getPlotInset(size);
  const min = inset;
  const max = size - inset;

  const scaleX = size / rect.width;
  const scaleY = size / rect.height;

  const localX = (clientX - rect.left) * scaleX;
  const localY = (clientY - rect.top) * scaleY;

  const x = clamp(normalize(localX, min, max, 0, 1), 0, 1);
  const y = clamp(normalize(localY, min, max, 1, 0), -1, 2);

  return [Number(x.toFixed(3)), Number(y.toFixed(3))];
}

// Formats two bezier control points as a copy-pasteable cubic-bezier() CSS value.
export function formatCubicBezier(p1: BezierPoint, p2: BezierPoint): string {
  return `cubic-bezier(${p1[0].toFixed(2)}, ${p1[1].toFixed(2)}, ${p2[0].toFixed(2)}, ${p2[1].toFixed(2)})`;
}
