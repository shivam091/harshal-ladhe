import { useEffect, useRef, useState } from "react";
import { useSpring } from "@react-spring/web";
import { clamp, getDistanceBetweenPoints, convertRadiansToDegrees } from "@/utils/math";
import { SPRINGS } from "@/constants/springs";
import type { MousePosition } from "@/interfaces/mouse-position";
import type { Status } from "@/types/like-button";
import type { PointObj, Proximity } from "@/interfaces/like-button";

// SVG viewBox width for the heart artwork — every coordinate authored against this box.
export const VIEWBOX_WIDTH = 50;
// SVG viewBox height for the heart artwork — every coordinate authored against this box.
export const VIEWBOX_HEIGHT = 42;

/*
  Matches the heart's rendered inline-size (--size-xxxl = 3rem = 48px at the default root size),
  used for the cursor-proximity radius math below.
*/
export const BUTTON_SIZE_PX = 48;

// How long the message bubble stays visible after a flash.
export const MESSAGE_VISIBLE_MS = 2200;

// Outline of the heart, shared by the empty-gradient fill, the fill-progress mask, and the clip mask.
export const HEART_PATH = "M13.2537 0.0255029C23.4033 0.0255029 25.0273 10.5191 25.0273 10.5191C25.0273 10.5191 26.6512 -0.60088 37.6129 0.0255029C44.3441 0.410148 48.7484 6.32169 48.9804 12.1981C49.7924 32.7656 28.7678 41.5 25.0273 41.5C21.2868 41.5 -0.549833 32.3459 1.07416 12.1981C1.54782 6.32169 6.29929 0.0255029 13.2537 0.0255029Z";

// Narrows a MousePosition to a concrete point once we know the pointer is actually on-screen.
function isPointerNearButton(pointerPosition: MousePosition): pointerPosition is PointObj {
  return pointerPosition.x !== null && pointerPosition.y !== null;
}

// Center point of a bounding box, in viewport coordinates.
function getCenterPoint(boundingBox: DOMRect): PointObj {
  return { x: boundingBox.left + boundingBox.width / 2, y: boundingBox.top + boundingBox.height / 2 };
}

// Computes the shared proximity snapshot once per render; see `Proximity` above.
export function getProximity(size: number, boundingBox: DOMRect | null, cursorPoint: MousePosition): Proximity | null {
  if (!boundingBox || !isPointerNearButton(cursorPoint)) return null;

  const areaOfEffectRadius = size * 2;
  const centerPoint = getCenterPoint(boundingBox);
  const distanceToCenter = getDistanceBetweenPoints(cursorPoint, centerPoint);

  if (distanceToCenter > areaOfEffectRadius) return null;

  return { cursorPoint, centerPoint, distanceToCenter, areaOfEffectRadius };
}

// Degrees to tilt the whole heart body, leaning away from the cursor as it orbits nearby.
export function getBodyRotation(proximity: Proximity | null): number {
  if (!proximity) return 0;

  const { centerPoint, cursorPoint } = proximity;
  const deltaX = centerPoint.x - cursorPoint.x;
  const deltaY = centerPoint.y - cursorPoint.y;

  const angleInRads = Math.atan2(deltaY, deltaX);
  const angleInDegrees = 180 + convertRadiansToDegrees(angleInRads);

  // Max degrees the heart can lean in either direction.
  const rotationMax = 10;

  // Slope/intercept of the piecewise-linear map from angleInDegrees to a signed rotation.
  let a: number, b: number;
  if (angleInDegrees < 180) {
    a = (rotationMax / 90) * -1;
    b = rotationMax;
  } else {
    a = rotationMax / 90;
    b = rotationMax * -3;
  }

  return a * angleInDegrees + b;
}

// Pixel offset for the eye pupils, tracking toward the cursor as it nears the button.
export function getEyeTranslation(size: number, proximity: Proximity | null): { x: number; y: number } {
  if (!proximity) return { x: 0, y: 0 };

  const { centerPoint, cursorPoint, areaOfEffectRadius } = proximity;
  const deltaX = cursorPoint.x - centerPoint.x;
  const deltaY = cursorPoint.y - centerPoint.y;

  // Furthest the pupils can shift, in px.
  const maxDisplacement = size * 0.025;
  // Cursor distance at which the pupils hit maxDisplacement.
  const reachMaxAt = areaOfEffectRadius / 2;

  // Proportional offset before clamping to maxDisplacement.
  const unboundTranslateX = (deltaX / reachMaxAt) * maxDisplacement;
  const unboundTranslateY = (deltaY / reachMaxAt) * maxDisplacement;

  return {
    x: clamp(unboundTranslateX, -maxDisplacement, maxDisplacement),
    y: clamp(unboundTranslateY, -maxDisplacement, maxDisplacement),
  };
}

/*
  Interpolates the quadratic curve's control-point Y between a downturned "sad" mouth and
  the default happy one.
*/
export function useMouthControlPoint(status: Status) {
  // Control-point Y for the default happy curve (deeper into the viewBox = more upturned).
  const happyControlPosition = VIEWBOX_HEIGHT * 0.8;
  // Control-point Y for the downturned sad curve.
  const sadControlPosition = VIEWBOX_HEIGHT * 0.6;

  return useSpring({
    position: status === "sad" ? sadControlPosition : happyControlPosition,
    config: SPRINGS.fast,
  });
}

/*
  If the cursor lingers near the button and then leaves without a like landing, the face
  frowns for 3s before reverting — a little nudge, mirroring the reference. Returns just the
  transient "sad" flag rather than a full Status, since "super-happy" is fully derived from
  the `hasLiked` prop by the caller (LikeHeart) — no need to sync that here too.
*/
export function useFrownIfDisengaged(proximity: Proximity | null, hasLiked: boolean): boolean {
  const [isSad, setIsSad] = useState(false);
  const wasWithinRadiusRef = useRef(false);
  const isWithinRadius = proximity !== null;

  useEffect(() => {
    if (isWithinRadius) {
      wasWithinRadiusRef.current = true;
      return;
    }

    if (wasWithinRadiusRef.current) {
      wasWithinRadiusRef.current = false;
      if (!hasLiked) {
        setIsSad(true);
        const timer = window.setTimeout(() => setIsSad(false), 3000);
        return () => window.clearTimeout(timer);
      }
    }
  }, [isWithinRadius, hasLiked]);

  return isSad;
}
