import { useEffect, useState } from "react";
import type { Heading } from "@/components/TableOfContents/TableOfContents.types";

// Top-of-viewport threshold (px) — headings above this line are considered scrolled past.
const TOP_OFFSET = 120;

/*
  Highlights the section being read so the list doubles as a progress indicator; falls back to
  the last heading passed so something stays highlighted between headings.
*/
export function useActiveHeading(headings: Heading[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    // Throttles to one recalculation per frame however often scroll fires.
    let ticking = false;

    const update = () => {
      // At the very top of the page nothing should be highlighted yet.
      if (window.scrollY === 0) {
        setActiveId(null);
        ticking = false;
        return;
      }

      // Headings can disappear on client navigation, so missing ones are skipped.
      const headingBoxes = headings
        .map(({ id }) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const { top, bottom } = el.getBoundingClientRect();
          return { id, top, bottom };
        })
        .filter((b): b is { id: string; top: number; bottom: number } => b !== null);

      let firstHeadingInViewport = headingBoxes.find(
        (b) => b.bottom > TOP_OFFSET && b.top < window.innerHeight
      );

      if (!firstHeadingInViewport) {
        firstHeadingInViewport = [...headingBoxes].reverse().find((b) => b.bottom < TOP_OFFSET);
      }

      setActiveId(firstHeadingInViewport?.id ?? null);
      ticking = false;
    };

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
