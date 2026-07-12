"use client";

import { useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { LINE_DATA } from "@/icons/IconPlus.helpers";
import defaultAttributes from "@/components/Icon/defaultAttributes";

// The three visual states the icon can occupy.
export type IconPlusState = "plus" | "chevron" | "flat";

// Driven from outside so the icon mirrors its parent's open/pressed state.
export interface IconPlusProps {
  state: IconPlusState;
  size?: number;
}

const SPRING_CONFIG = { tension: 300, friction: 10, clamp: true };

// One icon morphing between states so toggles feel continuous instead of swapping glyphs.
export default function IconPlus({ state, size = 20 }: IconPlusProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Prevents the initial mount from triggering an animated transition (should snap to plus).
  const isMounted = useRef(false);

  // Imperative API used so prop changes re-trigger the spring rather than only initialising it.
  const [leftSpring,  leftApi]  = useSpring(() => ({ ...LINE_DATA[0].plus, config: SPRING_CONFIG }));
  const [rightSpring, rightApi] = useSpring(() => ({ ...LINE_DATA[1].plus, config: SPRING_CONFIG }));

  useEffect(() => {
    isMounted.current = true;
  }, []);

  // Snaps instead of animating on first mount and under reduced motion.
  useEffect(() => {
    leftApi.start({
      ...LINE_DATA[0][state],
      immediate: !isMounted.current || prefersReducedMotion
    });
    rightApi.start({
      ...LINE_DATA[1][state],
      immediate: !isMounted.current || prefersReducedMotion
    });
  }, [state, prefersReducedMotion, leftApi, rightApi]);

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
        <animated.line {...leftSpring} />
        <animated.line {...rightSpring} />
      </svg>
    </>
  );
}

IconPlus.displayName = "IconPlus";
