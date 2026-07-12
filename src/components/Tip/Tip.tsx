"use client";

import type { JSX } from "react";
import { animated, useSpring } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { TipProps } from "@/interfaces/tip";
import { Tip as TipSvg, tipPathClass } from "@/components/Tip/Tip.styles";

/*
  Dimensions match Radix Arrow's built-in viewBox (0 0 30 10).
  Tip is at y=TIP_H (bottom), base at y=0 (top). Radix's PopperArrow wrapper
  applies rotate(180deg) for bottom placement, which flips these so the tip
  ends up pointing at the trigger.
*/
const TIP_W = 30;
const TIP_H = 10;

// Flat line — the resting (closed) state of the animated tip.
const PATH_FLAT = `M 0 0 C 0 0 ${TIP_W / 2} 0 ${TIP_W / 2} 0 C ${TIP_W / 2} 0 ${TIP_W} 0 ${TIP_W} 0 Z`;

// Bezier hill — the expanded (open) state of the animated tip.
const PATH_CURVED = `M 0 0 C ${TIP_W * 0.25} 0 ${TIP_W * 0.375} ${TIP_H} ${TIP_W / 2} ${TIP_H} C ${TIP_W * 0.625} ${TIP_H} ${TIP_W * 0.75} 0 ${TIP_W} 0 Z`;

// Shared animated SVG arrow — springs from a flat line to a curved hill as the
// overlay opens. Used by both DropdownMenu and Tooltip via their Radix Arrow.
export default function Tip({ arrow: Arrow, isOpen }: TipProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const spring = useSpring({
    from: {
      d: PATH_FLAT
    },
    d: isOpen ? PATH_CURVED : PATH_FLAT,
    config: {
      tension: 300,
      friction: 18
    },
    immediate: prefersReducedMotion
  });

  /*
    Arrow asChild: Radix's Slot merges positioning props onto our SVG. The span
    Radix renders around the arrow uses Floating UI's arrow middleware to centre
    it on the trigger — so it stays aligned.
  */
  return (
    <>
      <Arrow asChild width={TIP_W} height={TIP_H}>
        <TipSvg
          aria-hidden
          width={TIP_W}
          height={TIP_H}
          viewBox={`0 0 ${TIP_W} ${TIP_H}`}
          preserveAspectRatio="none"
        >
          <animated.path className={tipPathClass} d={spring.d} />
        </TipSvg>
      </Arrow>
    </>
  );
}

Tip.displayName = "Tip";
