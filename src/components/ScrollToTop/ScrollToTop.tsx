"use client";

import type { JSX} from "react";
import { useEffect, useState, useCallback } from "react";
import IconArrowUp from "@/icons/IconArrowUp";
import Button from "@/components/Button";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import * as styles from "@/components/ScrollToTop/ScrollToTop.styles";

// Fixed pill button that appears after 250 px of scroll and smooth-scrolls back to the top.
export default function ScrollToTop(): JSX.Element {
  // undefined = never been visible yet (no animation, hidden via base CSS)
  const [state, setState] = useState<"visible" | "hidden" | undefined>(undefined);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isBooped, triggerBoop] = useBoop();

  useEffect(() => {
    /*
      `ticking` prevents scheduling more than one rAF per paint cycle,
      keeping the scroll handler cheap even on high-frequency scroll events.
    */
    let ticking = false;

    // Shows or hides the button based on scroll position; skips the hide animation on first load.
    const updateVisibility = () => {
      if (window.scrollY > 250) {
        setState("visible");
      } else {
        /*
          Only transition to "hidden" (triggering the bounce-out animation)
          after the button has been shown at least once; if it has never been
          visible, keep state undefined so no animation runs at all.
        */
        setState(prev => (prev !== undefined ? "hidden" : undefined));
      }
      ticking = false;
    };

    // rAF-throttled scroll listener — at most one visibility check per frame.
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    };

    // Checks immediately on mount so a refresh that restores scroll position past the
    // threshold (e.g. browser scroll restoration, anchor links) shows the button right away.
    updateVisibility();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrolls the page back to the top — instantly if the OS reduced-motion setting is on,
  // since browser support for auto-honoring the preference on smooth scrolling is inconsistent.
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [prefersReducedMotion]);

  return (
    <>
      <Button
        shape="pill"
        intent="accent"
        aria-label="Scroll to top"
        data-state={state}
        onClick={scrollToTop}
        onPointerEnter={triggerBoop}
        className={styles.scrollTopElement}
      >
        <IconArrowUp isBooped={isBooped} />
      </Button>
    </>
  );
}

ScrollToTop.displayName = "ScrollToTop";
