"use client";

import { useState, useEffect } from "react";

// Nullable so "no finger down" stays distinct from a real touch at the viewport origin.
export interface TouchPosition {
  x: number | null;
  y: number | null;
}

// Follows the finger on touch devices, where mouse-position tracking never fires; passive so scrolling isn't blocked.
export function useTouch(): TouchPosition {
  const [position, setPosition] = useState<TouchPosition>({ x: null, y: null });

  useEffect(() => {
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setPosition({ x: t.clientX, y: t.clientY });
    };
    const onEnd = () => setPosition({ x: null, y: null });

    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  return position;
}
