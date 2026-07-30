"use client";

import { useState, useEffect } from "react";

/*
  Returns whether `query` currently matches, staying in sync as the viewport changes. Always starts
  `false` — even on the client — so the first client render matches the server-rendered markup
  exactly (reading the real `window.matchMedia` value up front, like a lazy initializer would,
  causes a hydration mismatch whenever the client's actual match differs from the SSR default).
  The effect corrects it to the real value immediately after mount, which can cause a one-frame
  flash of the "false" state but never a hydration error.
*/
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
