"use client";

import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

const SPRING_CONFIG = { tension: 300, friction: 16 };

// Stretches downward on boop to reinforce the direction it points.
export default function IconArrowDown({ size = 18, isBooped: isBoopedProp }: IconBoopProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Internal boop state used only when the parent has not passed isBooped.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  // Animates the vertical line tip to extend downward on boop.
  const lineSpring = useSpring({
    y2: isBooped ? 24 : 19,
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  // Animates the arrowhead polyline coordinates to shift downward on boop.
  const polySpring = useSpring({
    points: isBooped ? "6 17 12 24 18 17" : "5 12 12 19 19 12",
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size} fill="none" stroke="currentColor">
        <animated.line x1="12" y1="5" x2="12" {...lineSpring} />
        <animated.polyline {...polySpring} />
      </svg>
    </>
  );
}

IconArrowDown.displayName = "IconArrowDown";
