"use client";

import type { JSX } from "react";
import { useSpring, useSprings, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/interfaces/icons";

const SPRING_CONFIG = { tension: 300, friction: 14 };

// Anchor point of each ray, nearest the circle body — fixed, never animates.
const RAY_INNER = [
  { x: 12, y: 4 },  // top
  { x: 12, y: 20 }, // bottom
  { x: 4,  y: 12 }, // left
  { x: 20, y: 12 }, // right
  { x: 6,  y: 6 },  // top-left
  { x: 18, y: 6 },  // top-right
  { x: 6,  y: 18 }, // bottom-left
  { x: 18, y: 18 }  // bottom-right
] as const;

// Tip of each ray at full extension — the inner point animates out to here on boop.
const RAY_OUTER = [
  { x: 12, y: 1 },
  { x: 12, y: 23 },
  { x: 1,  y: 12 },
  { x: 23, y: 12 },
  { x: 4,  y: 4 },
  { x: 20, y: 4 },
  { x: 4,  y: 20 },
  { x: 20, y: 20 }
] as const;

// Per-ray stagger — cardinal rays lead, diagonals trail, so the burst reads as a radial cascade.
const RAY_DELAY = [0, 0, 30, 30, 60, 60, 90, 90] as const;

/*
  "Light" color-scheme icon — a plain sun body with 8 rays that, at rest, are collapsed to a dot
  at the ray's inner anchor (a zero-length round-capped line renders as a dot) and burst outward
  to full length on boop. This is the "sun" counterpart to IconSoftDark's dimmer pulse and
  IconMoonCrescent's crescent reveal — the three color-scheme dropdown items.
*/
export default function IconSun({ size = 20, isBooped = false }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const bodySpring = useSpring({
    r: isBooped ? 4 : 4.5,
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  const raySprings = useSprings(
    RAY_INNER.length,
    RAY_INNER.map((inner, i) => ({
      x2: isBooped ? RAY_OUTER[i].x : inner.x,
      y2: isBooped ? RAY_OUTER[i].y : inner.y,
      delay: RAY_DELAY[i],
      config: SPRING_CONFIG,
      immediate: prefersReducedMotion
    }))
  );

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size} fill="none" stroke="currentColor">
        <animated.circle cx="12" cy="12" {...bodySpring} />
        {raySprings.map((style, i) => (
          <animated.line
            key={i}
            x1={RAY_INNER[i].x}
            y1={RAY_INNER[i].y}
            {...style}
          />
        ))}
      </svg>
    </>
  );
}

IconSun.displayName = "IconSun";
