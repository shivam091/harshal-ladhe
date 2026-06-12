"use client";

import type { JSX} from "react";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import Typed from "typed.js";
import VisuallyHidden from "@/components/VisuallyHidden";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { HeroHighlight } from "@/components/HeroRoleTyped/HeroRoleTyped.styles";

// Cycles through the roles visually while screen readers hear the full list once, without partial words.
export default function HeroRoleTyped(): JSX.Element {
  const el = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // typed.js' `loop: true` runs forever — never start it for users who've asked to reduce motion.
    if (prefersReducedMotion) return;

    const strings = siteConfig.author.roles || [];
    if (strings.length === 0 || !el.current) return;

    const typed = new Typed(el.current, {
      strings,
      loop: true,
      typeSpeed: 60,
      backSpeed: 30,
      backDelay: 2000,
      smartBackspace: true,
      showCursor: false
    });

    return () => typed.destroy();
  }, [prefersReducedMotion]);

  // Static fallback for reduced-motion — same text the typed animation would eventually show, with no loop.
  if (prefersReducedMotion) {
    return (
      <HeroHighlight>
        {siteConfig.author.roles.join(", or a ")}
      </HeroHighlight>
    );
  }

  return (
    <>
      {/* Screen readers get the full list at once instead of every character as it types. */}
      <VisuallyHidden>
        {siteConfig.author.roles.join(", or a ")}
      </VisuallyHidden>

      {/* aria-hidden so the typing doesn't announce a stream of partial words. */}
      <HeroHighlight ref={el} aria-hidden="true" />
    </>
  );
}

HeroRoleTyped.displayName = "HeroRoleTyped";
