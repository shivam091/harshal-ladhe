"use client";

import type { JSX } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
// Props for IconTrash — `isAjar` pops the lid open on a spring; boop state is owned by the caller.
export interface IconTrashProps {
  size?: number;
  isAjar: boolean;
}

/*
  The lid and handle pop up as one group; clamping only the settle lets the pop overshoot a
  touch without bouncing past closed.
*/
export default function IconTrash({ size = 20, isAjar }: IconTrashProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const groupSpring = useSpring({
    transform: isAjar ? "translateY(-20%) rotate(12deg)" : "translateY(0%) rotate(0deg)",
    config: { tension: 300, friction: 16, clamp: !isAjar },
    immediate: prefersReducedMotion
  });

  return (
    <>
      <svg
        {...defaultAttributes}
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        style={{ display: "block", overflow: "visible" }}
      >
        <path d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6 Z" />
        <path d="M10 11V17" />
        <path d="M14 11V17" />
        <animated.g style={{ transformOrigin: "center center", ...groupSpring }}>
          <path d="M3 6H21" />
          <path d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" />
        </animated.g>
      </svg>
    </>
  );
}

IconTrash.displayName = "IconTrash";
