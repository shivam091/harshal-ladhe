import { useEffect, useState } from "react";

// Viewport coordinates of the pointer.
export interface Position {
  x: number;
  y: number;
}

// Tracks the pointer's position — the hook-based replacement for a MouseTracker render-prop
// component. Same subscription logic, but callers get the value back directly instead of
// wrapping their markup in a function-as-children component.
export function useMousePosition(): Position {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => setPosition({ x: event.clientX, y: event.clientY });

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return position;
}
