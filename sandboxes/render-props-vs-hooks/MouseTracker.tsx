import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Position } from "./useMousePosition";

interface MouseTrackerProps {
  // A function-as-children ("render prop") that receives the tracked position and returns markup.
  children: (position: Position) => ReactNode;
}

// The pre-hooks pattern for sharing this same logic: the component owns the state and hands it
// to `children` as a function instead of returning it. Kept here only to demo the migration —
// prefer useMousePosition in new code.
export function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => setPosition({ x: event.clientX, y: event.clientY });

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return <>{children(position)}</>;
}
