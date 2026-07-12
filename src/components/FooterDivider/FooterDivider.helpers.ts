import { clamp, getDistanceBetweenPoints } from "@/utils/math";
import { BALL_SIZE_PX, BALL_GAP_PX, AREA_OF_EFFECT_RADIUS_PX, MAX_BLUR_PX } from "@/components/FooterDivider/FooterDivider.constants";
import type { MousePosition } from "@/interfaces/mouse-position";

// Center point (in viewport coordinates) of the ball at `index`, given the row's own bounding box.
export function getBallCenter(index: number, rowBoundingBox: DOMRect): { x: number; y: number } {
  const step = BALL_SIZE_PX + BALL_GAP_PX;

  return {
    x: rowBoundingBox.left + index * step + BALL_SIZE_PX / 2,
    y: rowBoundingBox.top + rowBoundingBox.height / 2
  };
}

/*
  How full a ball should be (0-1), based on how close the cursor is to its center — 1 right on top
  of it, falling off linearly to 0 at AREA_OF_EFFECT_RADIUS_PX away.
*/
export function getBallFillScale(ballCenter: { x: number; y: number }, cursorPoint: MousePosition): number {
  if (cursorPoint.x === null || cursorPoint.y === null) return 0;

  const distance = getDistanceBetweenPoints({ x: cursorPoint.x, y: cursorPoint.y }, ballCenter);
  return clamp(1 - distance / AREA_OF_EFFECT_RADIUS_PX, 0, 1);
}

/*
  Blur (in px) for a ball at the given fill scale — the inverse of how full it is, so it sharpens to
  0 as the cursor nears its center (fillScale 1) and blurs back up to MAX_BLUR_PX at rest (fillScale 0).
*/
export function getBallBlurPx(fillScale: number): number {
  return (1 - fillScale) * MAX_BLUR_PX;
}
