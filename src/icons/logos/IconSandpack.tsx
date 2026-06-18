"use client";

import type { JSX } from "react";
import { animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import defaultAttributes from "@/components/Icon/defaultAttributes";

// Boop rotates it like a 3D box tumbling in a live sandbox.
export default function IconSandpack({ size = 32, isBooped: isBoopedProp }: { size?: number; isBooped?: boolean }): JSX.Element {
  const [isBoopedInternal, triggerBoop] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;
  const boopStyle = useTransformBoop(isBooped, { rotation: 15, scaleX: 1.05, scaleY: 1.05, springConfig: { tension: 250, friction: 12 } });

  return (
    <>
      <animated.span
        style={{ display: "inline-flex", willChange: "transform", ...boopStyle }}
        onPointerEnter={isBoopedProp === undefined ? triggerBoop : undefined}
      >
        <svg {...defaultAttributes} width={size} height={size}>
          <path
            fill="currentColor"
            d="M0 24H24V0H0V2.45455H21.5455V21.5455H2.45455V0H0Z"
          />
        </svg>
      </animated.span>
    </>
  );
}

IconSandpack.displayName = "IconSandpack";
