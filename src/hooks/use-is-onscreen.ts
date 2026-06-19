"use client";

import { useEffect, useRef, useState } from "react";

// Optional knobs so most callers can observe with the defaults.
interface Options {
  /*
    Passed straight through to IntersectionObserver: the element counts as "onscreen" once
    this fraction of it is visible. Defaults to [0] — a single visible pixel is enough.
  */
  threshold: Array<number>;
  /*
    Once the element has entered the viewport for the first time, dissolve the observer
    instead of continuing to track subsequent enter/exit — for effects that only care about
    the first reveal.
  */
  ignoreSubsequentEntries?: boolean;
  /*
    Hooks can't be called conditionally, so this lets a caller opt out of observing without
    having to skip the hook call itself.
  */
  disabled?: boolean;
}

// Lets decorative effects pause off-screen instead of animating unseen.
export function useIsOnscreen(
  elementRef: React.RefObject<HTMLElement | null | undefined>,
  defaultState: boolean = false,
  options: Options = { threshold: [0], ignoreSubsequentEntries: false, disabled: false }
): boolean {
  const [isOnscreen, setIsOnscreen] = useState(defaultState);

  /*
    The threshold array's identity doesn't need to retrigger the effect below, so it's synced
    into a ref (itself updated in an effect, not during render — see react-hooks/refs) and read
    from there instead of being a dependency.
  */
  const thresholdRef = useRef(options.threshold);
  useEffect(() => {
    thresholdRef.current = options.threshold;
  });

  useEffect(() => {
    if (!elementRef.current) return;
    if (options.disabled) return;
    if (isOnscreen && options.ignoreSubsequentEntries) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsOnscreen(entry.intersectionRatio > 0);
      },
      { threshold: thresholdRef.current }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [isOnscreen, elementRef, options.ignoreSubsequentEntries, options.disabled]);

  return isOnscreen;
}
