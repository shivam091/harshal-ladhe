"use client";

import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import { IconBoopProps } from "@/interfaces/icons";

const SPRING_CONFIG = { tension: 300, friction: 16 };

// Spring-animated up-pointing arrow that shoots upward on boop and eases back.
export default function IconArrowUp({ size = 18, isBooped: isBoopedProp }: IconBoopProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Internal boop state used only when the parent has not passed isBooped.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  // Animates the vertical line tip to extend upward on boop.
  const lineSpring = useSpring({
    y2: isBooped ? 0 : 5,
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion,
  });

  // Animates the arrowhead polyline coordinates to shift upward on boop.
  const polySpring = useSpring({
    points: isBooped ? "6 7 12 0 18 7" : "5 12 12 5 19 12",
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion,
  });

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size} fill="none" stroke="currentColor">
        <animated.line x1="12" y1="19" x2="12" {...lineSpring} />
        <animated.polyline {...polySpring} />
      </svg>
    </>
  );
}

IconArrowUp.displayName = "IconArrowUp";
