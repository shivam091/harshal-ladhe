"use client";

import { JSX } from "react";
import { animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import defaultAttributes from "@/components/Icon/defaultAttributes";

// Stylised coiled spring. Boop compresses it vertically — then the spring bounces back.
export default function IconReactSpring({ size = 32, isBooped: isBoopedProp }: { size?: number; isBooped?: boolean }): JSX.Element {
  const [isBoopedInternal, triggerBoop] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;
  const boopStyle = useTransformBoop(isBooped, { scaleY: 0.65, springConfig: { tension: 450, friction: 8 } });

  return (
    <>
      <animated.span
        style={{ display: "inline-flex", willChange: "transform", ...boopStyle, transformOrigin: "center bottom" }}
        onPointerEnter={isBoopedProp === undefined ? triggerBoop : undefined}
      >
        <svg {...defaultAttributes} width={size} height={size} viewBox="0 0 32 32">
          {/* Coiled spring drawn as a continuous open stroke */}
          <path
            fill="none"
            stroke="#FF6B6B"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6h14M9 6c-3 0-3 4 0 4h14c3 0 3 4 0 4H9c-3 0-3 4 0 4h14c-3 0-3 4 0 4H9"
          />
        </svg>
      </animated.span>
    </>
  );
}

IconReactSpring.displayName = "IconReactSpring";
