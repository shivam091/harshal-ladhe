"use client";

import { JSX } from "react";
import { useSprings, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import { IconBoopProps } from "@/interfaces/icons";

const SPRING_CONFIG = { tension: 300, friction: 16 };

// Static y position of each of the book's 7 interior lines — identical for y1/y2, never changes on boop.
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

// Per-line stagger
const LINE_DELAY = [100, 200, 300, 400, 100, 200, 300] as const;

// Spring-animated book icon — its interior lines pinch/stretch on boop while the cover and y-positions stay fixed.
export default function IconBook({ size = 20, isBooped: isBoopedProp }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Internal boop state used only when the parent has not passed isBooped.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  // Animates only x1/x2 per line — y1/y2 never change on boop, so they're passed as static props below.
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
