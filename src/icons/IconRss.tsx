"use client";

import type { JSX } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";

// `isBooped` is required because the parent link owns hover, so the whole link triggers the burst.
interface IconRssProps {
  size?: number;
  isBooped: boolean;
}

// Dot and arcs spring out in sequence so the boop reads like a signal broadcasting.
export default function IconRss({ size = 16, isBooped }: IconRssProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const circleSpring = useSpring({
    r: isBooped ? 2 : 1,
    config: { tension: 300, friction: 22 },
    immediate: prefersReducedMotion
  });

  // Arcs lag by whole 60fps frames so the burst ripples outward from the dot.
  const i = 2;
  const innerRingSpring = useSpring({
    d: isBooped
      ? `M4 ${11 - i} a ${9 + i} ${9 + i} 0 0 1 ${9 + i} ${9 + i}`
      : "M4 11 a 9 9 0 0 1 9 9",
    config: { tension: 300, friction: 18 },
    delay: 16.6 * 4,
    immediate: prefersReducedMotion
  });

  const o = 2;
  const outerRingSpring = useSpring({
    d: isBooped
      ? `M4 ${4 - o} a ${16 + o} ${16 + o} 0 0 1 ${16 + o} ${16 + o}`
      : "M4 4 a 16 16 0 0 1 16 16",
    config: { tension: 250, friction: 12 },
    delay: 16.6 * 8,
    immediate: prefersReducedMotion
  });

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size} fill="none" stroke="currentColor">
        <animated.path {...innerRingSpring} />
        <animated.path {...outerRingSpring} />
        <animated.circle cx="5" cy="19" fill="currentColor" {...circleSpring} />
      </svg>
    </>
  );
}

IconRss.displayName = "IconRss";
