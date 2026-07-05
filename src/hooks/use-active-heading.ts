import { useEffect, useState } from "react";
import type { Heading } from "@/components/TableOfContents/TableOfContents.types";

// Top-of-viewport threshold (px) — headings above this line are considered scrolled past.
const TOP_OFFSET = 120;

/*
  Tracks which heading the reader is currently at, returning its id (or null at the very top of the page).
  Listens to scroll and picks the first heading visible below TOP_OFFSET, falling back to the
  last heading already scrolled past when none is in the viewport.
*/
export function useActiveHeading(headings: Heading[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    /*
      Throttle flag: true while an update is queued for the next animation frame,
      so rapid scroll events collapse into at most one recalculation per frame.
    */
    let ticking = false;

    // Measures every heading's viewport position and derives the active id from the current scroll state.
    const update = () => {
      // At the very top of the page nothing should be highlighted yet.
      if (window.scrollY === 0) {
        setActiveId(null);
        ticking = false;
        return;
      }

      // Resolve each heading to its live viewport position, dropping any that no longer exist in the DOM.
      const headingBoxes = headings
        .map(({ id }) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const { top, bottom } = el.getBoundingClientRect();
          return { id, top, bottom };
        })
        .filter((b): b is { id: string; top: number; bottom: number } => b !== null);

      // First heading currently visible in the viewport wins.
      let firstHeadingInViewport = headingBoxes.find(
        (b) => b.bottom > TOP_OFFSET && b.top < window.innerHeight
      );

      // If none in viewport, use the most recently scrolled-past heading.
      if (!firstHeadingInViewport) {
        firstHeadingInViewport = [...headingBoxes].reverse().find((b) => b.bottom < TOP_OFFSET);
      }

      setActiveId(firstHeadingInViewport?.id ?? null);
      ticking = false;
    };

    /*
      Scroll handler: defers the actual work to requestAnimationFrame so we never
      recalculate more than once per frame, no matter how often scroll fires.
    */
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    // Run once immediately so the correct heading is highlighted on page load (e.g. deep links).
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  return activeId;
}
