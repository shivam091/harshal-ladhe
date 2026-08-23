"use client";

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { STRETCH_SPRING_CONFIG, RELAX_SPRING_CONFIG, FLAIL_DURATION_MS } from "@/icons/IconStretchyGuy/IconStretchyGuy.constants";
import type { StretchyGuyProps } from "@/interfaces/stretchy-guy";
import { StretchButton, Svg } from "@/icons/IconStretchyGuy/IconStretchyGuy.styles";

/*
  Whimsical stick figure that stretches upward on hover/focus, briefly flailing its arms as the
  stretch/relax transition kicks off before they settle. Inspired by whimsy.joshwcomeau.com's
  StretchyGuy — ported to this codebase's `@react-spring/web` + Linaria conventions.
*/
export default function StretchyGuy({ className }: StretchyGuyProps): JSX.Element {
  const [isStretched, setIsStretched] = useState(false);
  const [isFlailingArms, setIsFlailingArms] = useState(false);
  const flailTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Cancels a pending settle-timeout on unmount — never sets state itself, so it can't cascade a render.
  useEffect(() => {
    return () => {
      if (flailTimeoutRef.current !== null) clearTimeout(flailTimeoutRef.current);
    };
  }, []);

  /*
    Flips the stretch state and kicks off a beat of arm-flailing that settles back down on its own —
    driven from the triggering event handler (not an effect) so the flail starts the same render the
    stretch does, with only one pending settle-timeout at a time.
  */
  function handleStretchChange(nextIsStretched: boolean) {
    setIsStretched(nextIsStretched);
    setIsFlailingArms(true);

    if (flailTimeoutRef.current !== null) clearTimeout(flailTimeoutRef.current);
    flailTimeoutRef.current = setTimeout(() => {
      setIsFlailingArms(false);
    }, FLAIL_DURATION_MS);
  }

  const config = isStretched ? STRETCH_SPRING_CONFIG : RELAX_SPRING_CONFIG;
  const shouldFlail = isFlailingArms && !prefersReducedMotion;

  const headProps = useSpring({
    cx: 25,
    cy: isStretched ? 15 : 35,
    r: 15,
    config,
    immediate: prefersReducedMotion
  });

  const bodyProps = useSpring({
    x1: 25,
    y1: isStretched ? 30 : 50,
    x2: 25,
    y2: isStretched ? 70 : 80,
    config,
    immediate: prefersReducedMotion
  });

  const leftLegProps = useSpring({
    x1: 25,
    y1: isStretched ? 70 : 80,
    x2: 15,
    y2: 100,
    config,
    immediate: prefersReducedMotion
  });

  const rightLegProps = useSpring({
    x1: 25,
    y1: isStretched ? 70 : 80,
    x2: 35,
    y2: 100,
    config,
    immediate: prefersReducedMotion
  });

  const leftArmProps = useSpring({
    x1: 25,
    y1: isStretched ? 35 : 55,
    x2: isStretched ? (shouldFlail ? 20 : 15) : shouldFlail ? 5 : 15,
    y2: isStretched ? (shouldFlail ? 65 : 60) : shouldFlail ? 50 : 70,
    config,
    immediate: prefersReducedMotion
  });

  const rightArmProps = useSpring({
    x1: 25,
    y1: isStretched ? 35 : 55,
    x2: isStretched ? (shouldFlail ? 30 : 35) : shouldFlail ? 45 : 35,
    y2: isStretched ? (shouldFlail ? 65 : 60) : shouldFlail ? 50 : 70,
    config,
    immediate: prefersReducedMotion
  });

  // Face — eyes, nose, mouth all shift straight up with the head, no flailing of their own.
  const leftEyeProps = useSpring({
    cx: 20,
    cy: isStretched ? 10 : 30,
    r: isStretched ? 0.8 : 0.5,
    config,
    immediate: prefersReducedMotion
  });

  const rightEyeProps = useSpring({
    cx: 30,
    cy: isStretched ? 10 : 30,
    r: isStretched ? 0.8 : 0.5,
    config,
    immediate: prefersReducedMotion
  });

  const noseProps = useSpring({
    x1: 25,
    y1: isStretched ? 14 : 34,
    x2: 25,
    y2: isStretched ? 18 : 38,
    config,
    immediate: prefersReducedMotion
  });

  const mouthProps = useSpring({
    d: isStretched ? "M 20,21 Q 25,25 30,21" : "M 20,41 Q 25,45 30,41",
    config,
    immediate: prefersReducedMotion
  });

  return (
    <>
      <StretchButton
        type="button"
        className={className}
        aria-label="A little stick figure — hover or focus to watch it stretch"
        onPointerEnter={() => handleStretchChange(true)}
        onPointerLeave={() => handleStretchChange(false)}
        onPointerCancel={() => handleStretchChange(false)}
        onFocus={() => handleStretchChange(true)}
        onBlur={() => handleStretchChange(false)}
      >
        <Svg width={50} height={100} viewBox="0 0 50 100" aria-hidden>
          <g fill="none" stroke="var(--color-fg-default)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <animated.circle {...headProps} />
            <animated.line {...bodyProps} />
            <animated.line {...leftLegProps} />
            <animated.line {...rightLegProps} />
            <animated.line {...leftArmProps} />
            <animated.line {...rightArmProps} />

            {/* Eyes are solid dots, unlike the outline-only head/limbs above, so they need their own explicit fill. */}
            <g strokeWidth={2}>
              <animated.circle {...leftEyeProps} fill="var(--color-fg-default)" />
              <animated.circle {...rightEyeProps} fill="var(--color-fg-default)" />
              <animated.line {...noseProps} />
              <animated.path {...mouthProps} />
            </g>
          </g>
        </Svg>
      </StretchButton>
    </>
  );
}

StretchyGuy.displayName = "StretchyGuy";
