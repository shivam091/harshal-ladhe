"use client";

import type { JSX } from "react";
import { useSpring, useSprings, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/interfaces/icons";

const SPRING_CONFIG = { tension: 210, friction: 20 };

// Shortened rays (vs. IconSunRays' full-length set) — geometry never animates here, only opacity does.
const RAYS = [
  { x1: 12, y1: 2,  x2: 12, y2: 4 },  // top
  { x1: 12, y1: 20, x2: 12, y2: 22 }, // bottom
  { x1: 2,  y1: 12, x2: 4,  y2: 12 }, // left
  { x1: 20, y1: 12, x2: 22, y2: 12 }, // right
  { x1: 5,  y1: 5,  x2: 6,  y2: 6 },  // top-left
  { x1: 18, y1: 6,  x2: 19, y2: 5 },  // top-right
  { x1: 5,  y1: 19, x2: 6,  y2: 18 }, // bottom-left
  { x1: 18, y1: 18, x2: 19, y2: 19 } // bottom-right
] as const;

const RAY_DELAY = [0, 20, 40, 60, 80, 100, 120, 140] as const;

const RESTING_OPACITY = 0.35;

/*
  "Soft dark" color-scheme icon — deliberately distinct from IconSunRays' outward burst: the rays
  never move, they just glow in with a staggered opacity fade on boop, settling back to a dim
  resting state. Meant to read as a dimmer, quieter cousin of the full sun.
*/
export default function IconSunDim({ size = 20, isBooped = false }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const bodySpring = useSpring({
    r: isBooped ? 4 : 4.5,
    opacity: isBooped ? 1 : RESTING_OPACITY,
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  const raySprings = useSprings(
    RAYS.length,
    RAYS.map((_, i) => ({
      opacity: isBooped ? 1 : RESTING_OPACITY,
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
          <animated.line key={i} {...RAYS[i]} style={style} />
        ))}
      </svg>
    </>
  );
}

IconSunDim.displayName = "IconSunDim";
