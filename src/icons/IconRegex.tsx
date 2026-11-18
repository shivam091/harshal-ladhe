"use client";

import type { JSX } from "react";
import { useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

// Small enough to stay within the icon's footprint, yet enough for the delimiters to visibly make room for a match.
const SPREAD = 1.5;

// Centre of the asterisk, so it spins in place rather than swinging around the icon.
const STAR_X = 13;
const STAR_Y = 13;

// Six-armed, so half a turn always lands it looking like itself again.
const STAR_TURN_DEG = 180;

// The dot's resting radius, matching the static registry glyph so both read the same at rest.
const DOT_R = 1.1;

// `/.*/` running on boop — the delimiters part, the wildcard spins through its options and the dot swells as it matches.
export default function IconRegex({ size = 20, isBooped: isBoopedProp }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Fallback so the icon still boops on its own when no parent controls it.
  const [isBoopedInternal, triggerBoop] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;
  // Counts boops rather than following isBooped, so the wildcard only ever spins forwards.
  const spinsRef = useRef(0);

  // Springy, so the delimiters bounce apart like the code-block chevrons do.
  const { spread, dot } = useSpring({
    spread: isBooped ? SPREAD : 0,
    dot: isBooped ? DOT_R * 1.5 : DOT_R,
    config: SPRINGS.springy,
    immediate: prefersReducedMotion
  });

  // Under-damped enough to swing past the half turn and wobble back, so the wildcard reads as clicking into place rather than gliding.
  const [{ star }, starApi] = useSpring(() => ({ star: 0, config: { tension: 260, friction: 13 } }));

  // Each new boop is one more pass of the pattern; releasing it leaves the asterisk where it landed.
  useEffect(() => {
    if (!isBooped || prefersReducedMotion) return;
    spinsRef.current += 1;
    starApi.start({ star: spinsRef.current * STAR_TURN_DEG });
  }, [isBooped, prefersReducedMotion, starApi]);

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
        <animated.path d="M7 3 L4 21" transform={spread.to((x) => `translate(${-x} 0)`)} />
        <animated.path d="M20 3 L17 21" transform={spread.to((x) => `translate(${x} 0)`)} />
        <animated.circle cx="9.5" cy="16" r={dot} fill="currentColor" stroke="none" />
        <animated.path
          d="M13 10.5 L13 15.5 M10.8 11.75 L15.2 14.25 M15.2 11.75 L10.8 14.25"
          transform={star.to((deg) => `rotate(${deg} ${STAR_X} ${STAR_Y})`)}
        />
      </svg>
    </>
  );
}

IconRegex.displayName = "IconRegex";
