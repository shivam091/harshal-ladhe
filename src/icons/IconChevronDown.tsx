"use client";

import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
// Controlled by the parent so the chevron stays in sync with the disclosure it labels.
export interface IconChevronDownProps {
  direction?: "down" | "up";
  // Parent owns the boop so hovering anywhere on the toggle's hit-area reacts, not just the glyph.
  isBooped?: boolean;
  size?: number;
}

// Slightly under-damped so the boop reads as a springy nudge rather than a flat morph.
const SPRING_CONFIG = {
  tension: 300,
  friction: 18
};

// Animated counterpart to the static chevron, redrawing itself when flipping between down and up.
export default function IconChevronDown({ direction = "down", isBooped = false, size = 20 }: IconChevronDownProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Booped pushes a little further in the current direction so hover hints at the toggle without flipping it.
  const polyLineProps = useSpring({
    points:
      direction === "down"
        ? isBooped
          ? "7 10 12 17 17 10"
          : "6 9 12 15 18 9"
        : isBooped
          ? "7 15 12 7 17 15"
          : "6 15 12 9 18 15",
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  return (
    <>
      <svg
        {...defaultAttributes}
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        style={{ display: "block", overflow: "visible" }}
      >
        <animated.polyline {...polyLineProps} />
      </svg>
    </>
  );
}

IconChevronDown.displayName = "IconChevronDown";
