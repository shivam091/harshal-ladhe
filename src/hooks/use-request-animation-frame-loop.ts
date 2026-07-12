"use client";

import { useEffect, useRef } from "react";

/*
  Keeps the latest callback in a ref so the loop restarts only when `isRunning` changes, not on
  every new callback identity. The frame id isn't returned because reading a ref during render
  trips this repo's react-hooks/refs lint rule.
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
