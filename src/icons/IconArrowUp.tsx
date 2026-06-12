"use client";

import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

const SPRING_CONFIG = { tension: 300, friction: 16 };

// Lunges upward on hover to reinforce the direction it points.
export default function IconArrowUp({ size = 18, isBooped: isBoopedProp }: IconBoopProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Fallback so the icon still boops on its own when no parent controls it.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  const lineSpring = useSpring({
    y2: isBooped ? 0 : 5,
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  const polySpring = useSpring({
    points: isBooped ? "6 7 12 0 18 7" : "5 12 12 5 19 12",
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
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
