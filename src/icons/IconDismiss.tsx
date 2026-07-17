"use client";

import type { JSX } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
// Props for IconDismiss — a static ✕ (not a hamburger/X morph) that flattens while pressed and boops on hover.
export interface IconDismissProps {
  size?: number;
  isPressed: boolean;
  isBooped: boolean;
}
import { VIEWBOX_SIZE, getFirstLineProps, getSecondLineProps } from "@/icons/IconDismiss.helpers";

/*
  Static ✕ icon — unlike IconHamburger, it never morphs to/from bars, so it only needs the
  two diagonal lines (no middle "patty"). Reuses the hamburger's own line-position helpers so
  the flatten-on-press and boop-on-hover motion is pixel-identical to the header hamburger's
  own "open" state. Icon-only (no <button>) — the caller owns press/boop state and renders
  its own button, e.g. SearchModal's/SearchBox's dismiss buttons.
*/
export default function IconDismiss({ size = 20, isPressed, isBooped }: IconDismissProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const sharedConfig = {
    tension: 300,
    friction: 16,
    // clamp while pressed so the flatten stops cleanly at centre; unclamped at rest so boop bounces naturally
    clamp: isPressed
  };

  const iconStatus = isPressed && !prefersReducedMotion ? "closing" : "open";

  const firstLineProps = useSpring({
    ...getFirstLineProps(iconStatus, isBooped),
    config: sharedConfig,
    immediate: prefersReducedMotion
  });

  const secondLineProps = useSpring({
    ...getSecondLineProps(iconStatus, isBooped),
    config: sharedConfig,
    immediate: prefersReducedMotion
  });

  return (
    <>
      <svg
        {...defaultAttributes}
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        style={{ display: "block", overflow: "visible" }}
      >
        <animated.line {...firstLineProps} />
        <animated.line {...secondLineProps} />
      </svg>
    </>
  );
}

IconDismiss.displayName = "IconDismiss";
