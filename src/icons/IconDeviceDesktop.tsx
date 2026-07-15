"use client";

import type { JSX } from "react";
import { animated } from "@react-spring/web";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

/*
  Simpler than the other theme icons on purpose: "use the OS default" has no light/dark
  identity of its own to animate toward.
*/
export default function IconDeviceDesktop({ size = 20, isBooped = false }: IconBoopProps): JSX.Element {
  const boopStyle = useTransformBoop(isBooped, { rotation: -6, scaleX: 1.08, scaleY: 1.08, springConfig: SPRINGS.springy });

  return (
    <>
      <animated.span style={{ display: "inline-flex", willChange: "transform", ...boopStyle }}>
        <svg {...defaultAttributes} width={size} height={size} fill="currentColor" stroke="none">
          <path d="M19,3H5A3,3,0,0,0,2,6v8a3,3,0,0,0,3,3h6v2H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2H13V17h6a3,3,0,0,0,3-3V6A3,3,0,0,0,19,3Zm1,11a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V6A1,1,0,0,1,5,5H19a1,1,0,0,1,1,1Z" />
        </svg>
      </animated.span>
    </>
  );
}

IconDeviceDesktop.displayName = "IconDeviceDesktop";
