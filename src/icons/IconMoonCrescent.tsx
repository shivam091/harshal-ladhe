"use client";

import type { JSX } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

const SPRING_CONFIG = { tension: 160, friction: 18 };

/*
  "Dark" color-scheme icon — ported from the reference sun/moon toggle's masking technique,
  narrowed to just its "dark" half (this is a static list item, not a live sun↔moon toggle).
  A crescent needs TWO arcs, not one: the body circle is masked by the cutout circle to draw its
  outer edge, and the cutout circle is *separately* re-rendered (clipped to a reveal circle
  slightly larger than the body) to draw the crescent's inner edge. Masking a single stroked
  circle only carves a gap in that one ring — it can't produce the two-arc "sliver" a crescent
  reads as. Both circles are otherwise static — like the reference, only the whole glyph's
  rotation reacts to isBooped, animating the cutout's position on top would distort the crescent.
*/
export default function IconMoonCrescent({ size = 20, isBooped = false }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const rotateSpring = useSpring({
    transform: `rotate(${isBooped ? -45 : 0}deg)`,
    config: SPRING_CONFIG,
    immediate: prefersReducedMotion
  });

  return (
    <>
      <animated.svg
        {...defaultAttributes}
        width={size}
        height={size}
        style={{ ...rotateSpring, transformOrigin: "center center", overflow: "visible" }}
      >
        <path d="M10.719 2.082c-2.572 2.028-4.719 5.212-4.719 9.918 0 4.569 1.938 7.798 4.548 9.895-4.829-.705-8.548-4.874-8.548-9.895 0-5.08 3.808-9.288 8.719-9.918zm1.281-2.082c-6.617 0-12 5.383-12 12s5.383 12 12 12c1.894 0 3.87-.333 5.37-1.179-3.453-.613-9.37-3.367-9.37-10.821 0-7.555 6.422-10.317 9.37-10.821-1.74-.682-3.476-1.179-5.37-1.179zm0 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001z" />
      </animated.svg>
    </>
  );
}

IconMoonCrescent.displayName = "IconMoonCrescent";
