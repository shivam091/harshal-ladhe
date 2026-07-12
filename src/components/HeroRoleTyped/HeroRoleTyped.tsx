"use client";

import { JSX, useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import Typed from "typed.js";
import VisuallyHidden from "@/components/VisuallyHidden";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { HeroHighlight } from "@/components/HeroRoleTyped/HeroRoleTyped.styles";

// Typed role animation — renders the author's roles as a looping typed sequence; screen readers receive the full list at once via VisuallyHidden.
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
      showCursor: false,
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
      {/*
       * Static, visually-hidden text for screen readers.
       * Reads the full roles list once rather than spelling out every
       * animated character as it types. sr-only keeps it off-screen but
       * in the accessibility tree.
       */}
      {/* Screen readers get the full list at once; the animated span is aria-hidden to avoid partial-word noise. */}
      <VisuallyHidden>
        {siteConfig.author.roles.join(", or a ")}
      </VisuallyHidden>

      {/*
       * Visual-only animated span — hidden from AT with aria-hidden so
       * the typing animation doesn't produce a stream of partial words.
       */}
      <HeroHighlight ref={el} aria-hidden="true" />
    </>
  );
}

HeroRoleTyped.displayName = "HeroRoleTyped";
