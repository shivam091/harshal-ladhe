"use client";

import type { JSX } from "react";
import { useSprings, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

// Shared spring feel for every row's boop.
const SPRING_CONFIG = { tension: 300, friction: 16 };

// Rest-state geometry for the three dot/bar rows.
const BASE_CIRCLE_R = 1.5;
const BASE_RECT_WIDTH = 11;
const CIRCLE_CY = [6, 12, 18] as const;
const RECT_Y = [5.4, 11.4, 17.4] as const;

// Per-row boop targets, kept separate so each row can be tuned on its own.
const RECT_BOOP_VALS = [{ width: 14 }, { width: 14 }, { width: 14 }] as const;
const CIRCLE_BOOP_VALS = [{ r: 1.8 }, { r: 1.8 }, { r: 2 }] as const;
// Stagger (ms) applied per row so the boop ripples top-to-bottom instead of firing all at once.
const delay = [100, 200, 300] as const;

// Rows pulse in sequence so the boop reads like a list being scanned.
export default function IconList({ size = 20, isBooped: isBoopedProp }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Fallback so the icon still boops on its own when no parent controls it.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  const circleSprings = useSprings(
    3,
    CIRCLE_BOOP_VALS.map((vals, i) => ({
      r: isBooped ? vals.r : BASE_CIRCLE_R,
      delay: delay[i],
      config: SPRING_CONFIG,
      immediate: prefersReducedMotion
    }))
  );

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
