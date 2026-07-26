"use client";

import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

const SPRING_CONFIG = { tension: 300, friction: 16 };

// Spring-animated corner brackets whose shafts stretch further outward, away from center, on boop.
export default function IconMaximize({ size = 18, isBooped: isBoopedProp }: IconBoopProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Internal boop state used only when the parent has not passed isBooped.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  /*
    Only the end that meets the bracket moves, sliding toward the true corner on boop; the
    opposite end (the shaft's start, away from center) stays fixed, so the shaft stretches.
  */
  const topRight = useSpring({
    points: isBooped ? "17 1 23 1 23 7" : "15 3 21 3 21 9",
    x1: isBooped ? 23 : 21,
    y1: isBooped ? 1 : 3,
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  const bottomLeft = useSpring({
    points: isBooped ? "7 23 1 23 1 17" : "9 21 3 21 3 15",
    x1: isBooped ? 1 : 3,
    y1: isBooped ? 23 : 21,
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size} fill="none" stroke="currentColor">
        <animated.polyline points={topRight.points} />
        <animated.polyline points={bottomLeft.points} />
        <animated.line x1={topRight.x1} y1={topRight.y1} x2="14" y2="10" />
        <animated.line x1={bottomLeft.x1} y1={bottomLeft.y1} x2="10" y2="14" />
      </svg>
    </>
  );
}

IconMaximize.displayName = "IconMaximize";
