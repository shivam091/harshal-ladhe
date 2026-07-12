import { clamp, getDistanceBetweenPoints } from "@/utils/math";
import { BALL_SIZE_PX, BALL_GAP_PX, AREA_OF_EFFECT_RADIUS_PX, MAX_BLUR_PX } from "@/components/FooterDivider/FooterDivider.constants";
import type { MousePosition } from "@/hooks/use-mouse-position";

// Derived from the row's box so a single measurement serves every ball.
export function getBallCenter(index: number, rowBoundingBox: DOMRect): { x: number; y: number } {
  const step = BALL_SIZE_PX + BALL_GAP_PX;

  return {
    x: rowBoundingBox.left + index * step + BALL_SIZE_PX / 2,
    y: rowBoundingBox.top + rowBoundingBox.height / 2
  };
}

// Linear falloff so each ball's fill tracks cursor distance predictably, keeping the wave easy to follow.
export function getBallFillScale(ballCenter: { x: number; y: number }, cursorPoint: MousePosition): number {
  if (cursorPoint.x === null || cursorPoint.y === null) return 0;

  const distance = getDistanceBetweenPoints({ x: cursorPoint.x, y: cursorPoint.y }, ballCenter);
  return clamp(1 - distance / AREA_OF_EFFECT_RADIUS_PX, 0, 1);
}

// Tied inversely to fill so a ball sharpens into focus exactly as it fills in.
export function getBallBlurPx(fillScale: number): number {
  return (1 - fillScale) * MAX_BLUR_PX;
}
