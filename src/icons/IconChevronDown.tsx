"use client";

import { useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
// Controlled by the parent so the chevron stays in sync with the disclosure it labels.
export interface IconChevronDownProps {
  open?: boolean;
  size?: number;
}

// `down` must match the static chevronDown icon so the two are pixel-identical at rest.
const POINTS: { down: string; up: string } = {
  down: "6 10 12 16 18 10",
  up: "6 14 12 8 18 14"
};

// clamp so the morph stops cleanly on the target shape instead of overshooting.
const SPRING_CONFIG = { ...SPRINGS.quick, clamp: true };

// Animated counterpart to the static chevron, for disclosures that need to show open/closed state.
export default function IconChevronDown({ open = false, size = 20 }: IconChevronDownProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Prevents the initial mount from animating — the icon snaps to its starting shape.
  const isMounted = useRef(false);

  // Imperative API so `open` prop changes re-trigger the spring rather than only initialising it.
  const [spring, api] = useSpring(() => ({
    points: POINTS.down,
    config: SPRING_CONFIG
  }));

  useEffect(() => {
    isMounted.current = true;
  }, []);

  // Snaps instead of animating on first mount and under reduced motion.
  useEffect(() => {
    api.start({
      points: open ? POINTS.up : POINTS.down,
      immediate: !isMounted.current || prefersReducedMotion
    });
  }, [open, prefersReducedMotion, api]);

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
        <animated.polyline {...spring} />
      </svg>
    </>
  );
}

IconChevronDown.displayName = "IconChevronDown";
