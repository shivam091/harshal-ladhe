"use client";

import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import { IconBoopProps } from "@/interfaces/icons";

const SPRING_CONFIG = { tension: 300, friction: 16 };

// Spring-animated right-pointing arrow that shoots forward on boop and eases back.
export default function IconArrowRight({ size = 18, isBooped: isBoopedProp }: IconBoopProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Internal boop state used only when the parent has not passed isBooped.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  // Animates the horizontal line tip to extend right on boop.
  const lineSpring = useSpring({
    x2: isBooped ? 23 : 18,
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion,
  });

  // Animates the arrowhead polyline coordinates to shift right on boop.
  const polySpring = useSpring({
    points: isBooped ? "17 6 24 12 17 18" : "12 5 19 12 12 19",
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion,
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
