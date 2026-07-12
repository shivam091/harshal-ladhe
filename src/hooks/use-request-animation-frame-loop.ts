"use client";

import { useEffect, useRef } from "react";

/*
  Declarative requestAnimationFrame loop — pass isRunning: false to pause. Saves the latest
  callback in a ref (same pattern as useInterval) so the loop itself never needs to be torn down
  and restarted just because the callback identity changed, only when `isRunning` does. Doesn't
  return the frame id — that's an internal bookkeeping detail, and reading a ref during render
  (as opposed to an effect/event handler) trips this repo's react-hooks/refs lint rule.
*/
export function useRequestAnimationFrameLoop(callback: () => void, isRunning: boolean = true): void {
  const animationFrameId = useRef<number | null>(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      savedCallback.current();
      animationFrameId.current = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      if (animationFrameId.current !== null) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRunning]);
}
