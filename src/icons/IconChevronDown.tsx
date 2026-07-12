"use client";

import { useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
// Props for IconChevronDown — `open` drives the down ↔ up polyline morph.
export interface IconChevronDownProps {
  // When true the polyline morphs to point up; when false it settles back down.
  open?: boolean;
  size?: number;
}

/*
  Polyline coordinates for the two shapes the icon morphs between. `down`
  matches the chevronDown registry entry in icons.tsx (icons/icons.tsx) so
  the icon is pixel-identical at rest; `up` is the morph target.
*/
const POINTS: { down: string; up: string } = {
  down: "6 10 12 16 18 10",
  up: "6 14 12 8 18 14"
};

// clamp so the morph stops cleanly on the target shape instead of overshooting.
const SPRING_CONFIG = { ...SPRINGS.quick, clamp: true };

// Spring-animated chevron that morphs between pointing down (closed) and up (open).
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

  // Drives the polyline to the target shape whenever `open` or motion preference changes.
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
