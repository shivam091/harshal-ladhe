import { useState, useEffect } from "react";

// Inverted query so browsers without support default to reduced motion — the safer assumption.
const QUERY = "(prefers-reduced-motion: no-preference)";

// Lets JS-driven animations honour the reduced-motion setting that CSS media queries can't reach.
export function usePrefersReducedMotion(): boolean {
  // Lazy init so the client's first render already has the real preference, while staying SSR-safe.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && !window.matchMedia(QUERY).matches
  );

  // The setting can be toggled mid-session, so keep listening after mount.
  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches);
    };

    mediaQueryList.addEventListener("change", listener);
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, []);

  return prefersReducedMotion;
}
