"use client";

import { useState, useEffect } from "react";

/*
  Returns true if the primary pointer supports hover (mouse/trackpad).
  Defaults to true before hydration so the overlay does not flash in and out on desktop.
*/
export function useHoverDevice(): boolean | null {
  const [isHoverDevice, setIsHoverDevice] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setIsHoverDevice(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isHoverDevice;
}
