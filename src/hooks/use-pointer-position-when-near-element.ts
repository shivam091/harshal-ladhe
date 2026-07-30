"use client";

import { usePointerPosition } from "@/hooks/use-pointer-position";
import { getDistanceBetweenPoints } from "@/utils/math";
import type { MousePosition } from "@/interfaces/mouse-position";

interface Params {
  boundingBox: DOMRect | null;
  radius: number;
}

/*
  Returns the live pointer position only while it's within `radius` px of the
  element's center; otherwise {x: null, y: null}, so callers can treat
  "pointer is far away" and "pointer has never moved" identically.
*/
export function usePointerPositionWhenNearElement({ boundingBox, radius }: Params): MousePosition {
  const pointerPosition = usePointerPosition();

  if (!boundingBox || pointerPosition.x === null || pointerPosition.y === null) {
    return { x: null, y: null };
  }

  const centerPoint = {
    x: boundingBox.left + boundingBox.width / 2,
    y: boundingBox.top + boundingBox.height / 2,
  };

  const distance = getDistanceBetweenPoints({ x: pointerPosition.x, y: pointerPosition.y }, centerPoint);

  return distance <= radius ? pointerPosition : { x: null, y: null };
}
