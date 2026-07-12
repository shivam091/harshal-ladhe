import { useState, useEffect, useCallback, useRef } from "react";

// Short enough to read as a flick rather than a held state.
const BOOP_DURATION_MS = 150;

// Gives hover a brief, self-resetting pulse so icons can react without tracking hover state themselves.
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
