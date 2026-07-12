"use client";

import type { JSX } from "react";
import { useSprings, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/interfaces/icons";

// Shared spring feel for every row's boop.
const SPRING_CONFIG = { tension: 300, friction: 16 };

// Rest-state geometry for the three dot/bar rows.
const BASE_CIRCLE_R = 1.5;
const BASE_RECT_WIDTH = 11;
const CIRCLE_CY = [6, 12, 18] as const;
const RECT_Y = [5.4, 11.4, 17.4] as const;

// Per-row boop targets — index 0 is the top row, index 2 the bottom row.
const RECT_BOOP_VALS = [{ width: 14 }, { width: 14 }, { width: 14 }] as const;
const CIRCLE_BOOP_VALS = [{ r: 1.8 }, { r: 1.8 }, { r: 2 }] as const;
// Stagger (ms) applied per row so the boop ripples top-to-bottom instead of firing all at once.
const delay = [100, 200, 300] as const;

// Spring-animated list icon — its three dot/bar rows pulse outward in a top-to-bottom stagger on boop.
export default function IconList({ size = 20, isBooped: isBoopedProp }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Internal boop state used only when the parent has not passed isBooped.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  // Animates each row's dot radius, staggered by `delay`.
  const circleSprings = useSprings(
    3,
    CIRCLE_BOOP_VALS.map((vals, i) => ({
      r: isBooped ? vals.r : BASE_CIRCLE_R,
      delay: delay[i],
      config: SPRING_CONFIG,
      immediate: prefersReducedMotion
    }))
  );

  // Animates each row's bar width, staggered by `delay`.
  const rectSprings = useSprings(
    3,
    RECT_BOOP_VALS.map((vals, i) => ({
      width: isBooped ? vals.width : BASE_RECT_WIDTH,
      delay: delay[i],
      config: SPRING_CONFIG,
      immediate: prefersReducedMotion
    }))
  );

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size}>
        {circleSprings.map((style, i) => (
          <animated.circle key={i} cx="5" cy={CIRCLE_CY[i]} {...style} />
        ))}
        {rectSprings.map((style, i) => (
          <animated.rect key={i} x="9" y={RECT_Y[i]} height="1.5" rx="0.6" {...style} />
        ))}
      </svg>
    </>
  );
}

IconList.displayName = "IconList";
