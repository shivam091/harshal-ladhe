"use client";

import { useState, useEffect } from "react";
import type { MousePosition } from "@/hooks/use-mouse-position";

/*
  Tracks the pointer position (mouse, pen, or touch) via a passive pointermove listener; returns null
  until the first move.
*/
export function usePointerPosition(): MousePosition {
  const [pointerPosition, setPointerPosition] = useState<MousePosition>({ x: null, y: null });

  useEffect(() => {
    const onMove = (e: PointerEvent) => setPointerPosition({ x: e.clientX, y: e.clientY });

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return pointerPosition;
}
