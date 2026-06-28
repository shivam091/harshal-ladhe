"use client";

import type { JSX } from "react";
import { useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

// Small enough to stay within the icon's footprint, yet enough for the brackets to visibly make room for the caret.
const SPREAD = 2;

// Dead centre between the chevrons, so the slash lands as an exact upright "|" rather than a near-vertical tilt.
const CARET_X = 12;

// Matches the ~530ms on/off rhythm of a real text cursor, so the caret reads as one.
const BLINK_MS = 530;

// Lets the chevrons finish spreading first, so the opening blink never competes with the movement.
const BLINK_START_MS = 400;

// Acts out "code" on boop — the brackets make room and the slash becomes a blinking caret, as if waiting for you to type.
export default function IconCodeBlock({ size = 20, isBooped: isBoopedProp }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Fallback so the icon still boops on its own when no parent controls it.
  const [isBoopedInternal, triggerBoop] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;
  const leftStyle = useSpring({
    transform: `translateX(${isBooped ? -SPREAD : 0}px)`,
    config: SPRINGS.quick,
    immediate: prefersReducedMotion
  });
  const rightStyle = useSpring({
    transform: `translateX(${isBooped ? SPREAD : 0}px)`,
    config: SPRINGS.quick,
    immediate: prefersReducedMotion
  });

  // Imperative so the caret loop can be started on boop and cut off the moment it ends.
  const [blinkStyle, blinkApi] = useSpring(() => ({ opacity: 1 }));

  const slashStyle = useSpring({
    x1: isBooped ? CARET_X : 10,
    x2: isBooped ? CARET_X : 14,
    config: SPRINGS.quick,
    immediate: prefersReducedMotion
  });

  // Timed from the boop rather than a spring's onRest, which only fires once the last imperceptible wobble has died out.
  useEffect(() => {
    if (isBooped && !prefersReducedMotion) {
      blinkApi.start({
        to: async (next) => {
          await next({ opacity: 0, delay: BLINK_START_MS, immediate: true });
          for (;;) {
            await next({ opacity: 1, delay: BLINK_MS, immediate: true });
            await next({ opacity: 0, delay: BLINK_MS, immediate: true });
          }
        }
      });
      return;
    }
    // Releasing the boop leaves the caret solid rather than frozen mid-blink.
    blinkApi.stop();
    blinkApi.start({ opacity: 1, immediate: true });
  }, [isBooped, prefersReducedMotion, blinkApi]);

  return (
    <>
      <svg
        {...defaultAttributes}
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        // The base layer turns off pointer events on every svg, so a self-booping icon has to opt back in.
        style={{ overflow: "visible", pointerEvents: isBoopedProp === undefined ? "auto" : undefined }}
        onPointerEnter={isBoopedProp === undefined ? triggerBoop : undefined}
      >
        <animated.polyline points="6 8 2 12 6 16" style={leftStyle} />
        <animated.line x1={slashStyle.x1} y1="18" x2={slashStyle.x2} y2="6" style={blinkStyle} />
        <animated.polyline points="18 8 22 12 18 16" style={rightStyle} />
      </svg>
    </>
  );
}

IconCodeBlock.displayName = "IconCodeBlock";
