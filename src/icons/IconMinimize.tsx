"use client";

import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

const SPRING_CONFIG = { tension: 300, friction: 16 };

// Spring-animated corner brackets whose shafts stretch further inward, toward center, on boop.
export default function IconMinimize({ size = 18, isBooped: isBoopedProp }: IconBoopProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Internal boop state used only when the parent has not passed isBooped.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  /*
    Only the end that meets the bracket moves, sliding toward center on boop; the opposite end
    (the shaft's start, at the true corner) stays fixed, so the shaft stretches.
  */
  const topRight = useSpring({
    points: isBooped ? "18 12 12 12 12 6" : "20 10 14 10 14 4",
    x1: isBooped ? 12 : 14,
    y1: isBooped ? 12 : 10,
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  const bottomLeft = useSpring({
    points: isBooped ? "6 12 12 12 12 18" : "4 14 10 14 10 20",
    x1: isBooped ? 12 : 10,
    y1: isBooped ? 12 : 14,
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size} fill="none" stroke="currentColor">
        <animated.polyline points={topRight.points} />
        <animated.polyline points={bottomLeft.points} />
        <animated.line x1={topRight.x1} y1={topRight.y1} x2="21" y2="3" />
        <animated.line x1={bottomLeft.x1} y1={bottomLeft.y1} x2="3" y2="21" />
      </svg>
    </>
  );
}

IconMinimize.displayName = "IconMinimize";
