"use client";

import type { JSX } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

// Distance (px) each diamond slides outward from center on boop.
const INSET = 3;

// Spring-animated four-diamond cluster that spreads apart on boop and eases back.
export default function IconCategories({ size = 20, isBooped: isBoopedProp }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Internal boop state used only when the parent has not passed isBooped.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  const config = { tension: 350, friction: 10, clamp: isBooped };
  const immediate = prefersReducedMotion;

  // Each diamond slides outward along its own axis on boop.
  const topStyle = useSpring({
    transform: `translateY(${isBooped ? INSET : 0}px)`,
    config,
    immediate
  });
  const leftStyle = useSpring({
    transform: `translateX(${isBooped ? INSET : 0}px)`,
    config,
    immediate
  });
  const rightStyle = useSpring({
    transform: `translateX(${isBooped ? -INSET : 0}px)`,
    config,
    immediate
  });
  const bottomStyle = useSpring({
    transform: `translateY(${isBooped ? -INSET : 0}px)`,
    config,
    immediate
  });

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size} fill="none" stroke="currentColor">
        <animated.path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z" style={topStyle} />
        <animated.path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z" style={leftStyle} />
        <animated.path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z" style={rightStyle} />
        <animated.path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z" style={bottomStyle} />
      </svg>
    </>
  );
}

IconCategories.displayName = "IconCategories";
