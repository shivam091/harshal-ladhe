"use client";

import { useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
// Controlled by the parent so the morph stays in sync with the disclosure it reflects.
export interface IconFlatProps {
  open?: boolean;
  size?: number;
}

// Polyline coordinates for the two shapes the icon morphs between.
const POINTS: { closed: string; open: string } = {
  closed: "5 12 12 12 19 12", // flat horizontal line
  open: "6 9 12 15 18 9"     // downward chevron
};

// clamp so the morph stops cleanly on the target shape instead of overshooting.
const SPRING_CONFIG = { ...SPRINGS.quick, clamp: true };

// Quieter alternative to a chevron — a flat line at rest that only becomes a chevron when open.
export default function IconFlat({ open = false, size = 20 }: IconFlatProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Prevents the initial mount from animating — the icon snaps to its starting shape.
  const isMounted = useRef(false);

  // Imperative API so `open` prop changes re-trigger the spring rather than only initialising it.
  const [spring, api] = useSpring(() => ({
    points: POINTS.closed,
    config: SPRING_CONFIG
  }));

  useEffect(() => {
    isMounted.current = true;
  }, []);

  // Snaps instead of animating on first mount and under reduced motion.
  useEffect(() => {
    api.start({
      points: open ? POINTS.open : POINTS.closed,
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

IconFlat.displayName = "IconFlat";
