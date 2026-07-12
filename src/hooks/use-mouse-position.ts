"use client";

import { useState, useEffect } from "react";

// Nullable so consumers can tell "no cursor yet" apart from a real position at 0,0.
export interface MousePosition {
  x: number | null;
  y: number | null;
}

// Lets decorative effects follow the cursor; stays null on touch devices so they can opt out.
export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: null, y: null });

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return mousePosition;
}
