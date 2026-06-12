"use client";

import type { JSX } from "react";
import { useSprings, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

const SPRING_CONFIG = { tension: 300, friction: 16 };

// Kept separate from the animated values because only x moves on boop.
const LINE_Y = [7, 11, 15, 19, 9, 13, 17] as const;

// Rest-state x1/x2 for each line, taken from the icon's original geometry.
const LINE_REST_VALS = [
  { x1: 1, x2: 5 },
  { x1: 1, x2: 5 },
  { x1: 1, x2: 5 },
  { x1: 1, x2: 5 },
  { x1: 9, x2: 14.5 },
  { x1: 9, x2: 16 },
  { x1: 9, x2: 14 }
] as const;

// Boop-state x1/x2 — left-margin lines pinch inward, text lines stretch outward.
const LINE_BOOP_VALS = [
  { x1: 1.5, x2: 4.5 },
  { x1: 1.5, x2: 4.5 },
  { x1: 1.5, x2: 4.5 },
  { x1: 1.5, x2: 4.5 },
  { x1: 9, x2: 15.5 },
  { x1: 9, x2: 17 },
  { x1: 9, x2: 15 }
] as const;

// Staggered per column so the lines ripple instead of moving in lockstep.
const LINE_DELAY = [100, 200, 300, 400, 100, 200, 300] as const;

// Only the interior lines move so the book's silhouette stays recognisable mid-boop.
export default function IconBook({ size = 20, isBooped: isBoopedProp }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Fallback so the icon still boops on its own when no parent controls it.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  // y never changes on boop, so it's passed as static props below rather than animated.
  const lineSprings = useSprings(
    LINE_REST_VALS.length,
    LINE_REST_VALS.map((rest, i) => ({
      ...(isBooped ? LINE_BOOP_VALS[i] : rest),
      delay: LINE_DELAY[i],
      config: SPRING_CONFIG,
      immediate: prefersReducedMotion
    }))
  );

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size} fill="none" stroke="currentColor">
        <rect x="3" y="2" width="18" height="22" rx="2" />
        {lineSprings.map((style, i) => (
          <animated.line key={i} y1={LINE_Y[i]} y2={LINE_Y[i]} {...style} />
        ))}
      </svg>
    </>
  );
}

IconBook.displayName = "IconBook";
