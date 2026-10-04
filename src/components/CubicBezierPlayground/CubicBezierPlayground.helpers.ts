import { clamp, normalize } from "@/utils/number";
import { getPlotInset } from "@/utils/plot";
import type { BezierPoint } from "@/utils/bezier";

/*
  x is clamped to 0–1 because the CSS spec rejects anything else; y gets -1 to 2 so overshoot and
  anticipation curves stay reachable. Corrects for CSS scaling of the SVG, so a drag stays under
  the pointer at any rendered size.
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

// Two decimals is as fine as anyone tunes a curve by eye, and keeps the readout short enough to paste.
export function formatCubicBezier(p1: BezierPoint, p2: BezierPoint): string {
  return `cubic-bezier(${p1[0].toFixed(2)}, ${p1[1].toFixed(2)}, ${p2[0].toFixed(2)}, ${p2[1].toFixed(2)})`;
}
