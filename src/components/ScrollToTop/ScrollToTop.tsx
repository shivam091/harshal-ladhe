"use client";

import type { JSX} from "react";
import { useEffect, useState, useCallback } from "react";
import IconArrowUp from "@/icons/IconArrowUp";
import Button from "@/components/Button";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import * as styles from "@/components/ScrollToTop/ScrollToTop.styles";

// Saves readers of long posts a manual scroll back up to the navigation.
export default function ScrollToTop(): JSX.Element {
  // Starts undefined so no bounce-out plays before the button has ever appeared.
  const [state, setState] = useState<"visible" | "hidden" | undefined>(undefined);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isBooped, triggerBoop] = useBoop();

  useEffect(() => {
    /*
      `ticking` prevents scheduling more than one rAF per paint cycle,
      keeping the scroll handler cheap even on high-frequency scroll events.
    */
    let ticking = false;

    const updateVisibility = () => {
      if (window.scrollY > 250) {
        setState("visible");
      } else {
        // Only animate out a button that was actually shown.
        setState(prev => (prev !== undefined ? "hidden" : undefined));
      }
      ticking = false;
    };

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
