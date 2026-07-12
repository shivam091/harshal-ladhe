"use client";

import type { JSX } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

const SPRING_CONFIG = { tension: 300, friction: 14 };

// Spring-animated envelope — its flap lifts open above the body on boop, like a letter being opened.
export default function IconEnvelope({ size = 20, isBooped: isBoopedProp }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Internal boop state used only when the parent has not passed isBooped.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  // Animates the flap's fold point from pointing down into the envelope (closed) to lifted above the rim (open).
  const flapSpring = useSpring({
    points: isBooped ? "4 7 12 1 20 7" : "4 7 12 14 20 7",
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size} fill="none" stroke="currentColor">
        <rect x="3" y="6" width="18" height="14" rx="2" ry="2" />
        <animated.polyline {...flapSpring} />
      </svg>
    </>
  );
}

IconEnvelope.displayName = "IconEnvelope";
