import { useState, useEffect, useCallback, useRef } from "react";

// How long the booped state stays true before snapping back to false.
const BOOP_DURATION_MS = 150;

// Returns [isBooped, trigger] — call trigger() on mouseenter to flip isBooped true for 150 ms, then auto-reset.
export function useBoop() {
  const [isBooped, setIsBooped] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Clears any in-flight timer before re-arming so rapid mouse-enters restart rather than stack.
  const trigger = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setIsBooped(true);
    timerRef.current = window.setTimeout(() => {
      setIsBooped(false);
      timerRef.current = null;
    }, BOOP_DURATION_MS);
  }, []);

  // Cancels the pending reset timer on unmount to avoid a setState on an unmounted component.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  return [isBooped, trigger] as const;
}
