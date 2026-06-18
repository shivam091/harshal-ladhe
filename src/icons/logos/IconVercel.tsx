"use client";

import type { JSX } from "react";
import { animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import defaultAttributes from "@/components/Icon/defaultAttributes";

// Boop launches it upward — a deploy shipping to the edge.
export default function IconVercel({ size = 32, isBooped: isBoopedProp }: { size?: number; isBooped?: boolean }): JSX.Element {
  const [isBoopedInternal, triggerBoop] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;
  const boopStyle = useTransformBoop(isBooped, { transformY: -6, scaleX: 1.08, scaleY: 1.08, springConfig: { tension: 300, friction: 8 } });

  return (
    <>
      <animated.span
        style={{ display: "inline-flex", willChange: "transform", ...boopStyle }}
        onPointerEnter={isBoopedProp === undefined ? triggerBoop : undefined}
      >
        <svg {...defaultAttributes} width={size} height={size}>
          {/* Centered triangle */}
          <path fill="currentColor" d="m12 1.608 12 20.784H0Z" />
        </svg>
      </animated.span>
    </>
  );
}

IconVercel.displayName = "IconVercel";
