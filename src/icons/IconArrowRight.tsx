"use client";

import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

const SPRING_CONFIG = { tension: 300, friction: 16 };

// Lunges forward on hover to reinforce that the link moves you onward.
export default function IconArrowRight({ size = 18, isBooped: isBoopedProp }: IconBoopProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Fallback so the icon still boops on its own when no parent controls it.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  const lineSpring = useSpring({
    x2: isBooped ? 23 : 18,
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  const polySpring = useSpring({
    points: isBooped ? "17 6 24 12 17 18" : "12 5 19 12 12 19",
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size} fill="none" stroke="currentColor">
        <animated.line x1="5" y1="12" {...lineSpring} y2="12" />
        <animated.polyline {...polySpring} />
      </svg>
    </>
  );
}

IconArrowRight.displayName = "IconArrow";
