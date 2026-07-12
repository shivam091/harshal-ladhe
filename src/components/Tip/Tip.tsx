"use client";

import type { JSX } from "react";
import { animated, useSpring } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { TipProps } from "@/components/Tip/Tip.types";
import { Tip as TipSvg, tipPathClass } from "@/components/Tip/Tip.styles";

/*
  Matches Radix Arrow's built-in 30×10 viewBox so its positioning still lines up; drawn tip-down
  because Radix flips the arrow for bottom placement, leaving it pointing at the trigger.
*/
const TIP_W = 30;
const TIP_H = 10;

// Collapsed start point so the tip can grow out of the panel edge rather than pop in.
const PATH_FLAT = `M 0 0 C 0 0 ${TIP_W / 2} 0 ${TIP_W / 2} 0 C ${TIP_W / 2} 0 ${TIP_W} 0 ${TIP_W} 0 Z`;

// Shares PATH_FLAT's command structure so react-spring can interpolate between them.
const PATH_CURVED = `M 0 0 C ${TIP_W * 0.25} 0 ${TIP_W * 0.375} ${TIP_H} ${TIP_W / 2} ${TIP_H} C ${TIP_W * 0.625} ${TIP_H} ${TIP_W * 0.75} 0 ${TIP_W} 0 Z`;

// Replaces Radix's static triangle with a soft curve that springs up on open, so overlays feel attached to their trigger.
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

  // asChild keeps Radix's positioning on our SVG, so Floating UI still centres the tip on the trigger.
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
