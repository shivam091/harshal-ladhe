"use client";

import type { JSX } from "react";
import { animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import defaultAttributes from "@/components/Icon/defaultAttributes";

// Linaria double-loop knot. Boop bursts it outward — zero-runtime CSS exploding into place.
export default function IconLinaria({ size = 32, isBooped: isBoopedProp }: { size?: number; isBooped?: boolean }): JSX.Element {
  const [isBoopedInternal, triggerBoop] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;
  const boopStyle = useTransformBoop(isBooped, { scaleX: 1.15, scaleY: 1.15, springConfig: { tension: 400, friction: 8 } });

  return (
    <>
      <animated.span
        style={{ display: "inline-flex", willChange: "transform", ...boopStyle }}
        onPointerEnter={isBoopedProp === undefined ? triggerBoop : undefined}
      >
        <svg {...defaultAttributes} width={size} height={size}>
          <g fill="#7C5DFA">
            <path d="M7.79,16.49H5.66a3.44,3.44,0,0,1,0,-6.88a0.82,0.82,0,1,0,0,-1.63a5.07,5.07,0,0,0,0,10.14h2.13A3.44,3.44,0,0,1,11.23,21.55a0.82,0.82,0,0,0,1.63,0A5.08,5.08,0,0,0,7.79,16.49Z" />
            <path d="M18.42,7.98a5.08,5.08,0,0,0,-2.36,0.58A19.97,19.97,0,0,1,12.37,10.08a2.27,2.27,0,0,1,-1.15,0.04A3.55,3.55,0,0,1,11.95,3.13A3.55,3.55,0,0,1,15.59,6.67a0.82,0.82,0,0,0,1.63,0A5.18,5.18,0,1,0,7.97,9.86a5.2,5.2,0,0,0,2.90,1.86a3.91,3.91,0,0,0,1.98,-0.07a21.58,21.58,0,0,0,3.98,-1.64a3.41,3.41,0,0,1,1.60,-0.39a3.44,3.44,0,1,1,0,6.88H16.29a5.07,5.07,0,0,0,-2.54,0.68a0.82,0.82,0,1,0,0.82,1.41a3.43,3.43,0,0,1,1.72,-0.46h2.13a5.07,5.07,0,1,0,0,-10.14Z" />
          </g>
        </svg>
      </animated.span>
    </>
  );
}

IconLinaria.displayName = "IconLinaria";
