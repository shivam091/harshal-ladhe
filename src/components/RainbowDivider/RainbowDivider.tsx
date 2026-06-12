"use client";

import type { JSX, KeyboardEvent} from "react";
import { useMemo, useState } from "react";
import { useSprings, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import {
  NUM_SEGMENTS,
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
  FLIP_STAGGER_DELAY_MS
} from "@/components/RainbowDivider/RainbowDivider.constants";
import { buildSegments } from "@/components/RainbowDivider/RainbowDivider.helpers";
import { Svg, DividerButton, backgroundLineClass, foregroundLineClass } from "@/components/RainbowDivider/RainbowDivider.styles";
import type { RainbowDividerProps } from "@/components/RainbowDivider/RainbowDivider.types";

// Keys that also trigger the press-and-hold stretch from the keyboard, mirroring a native button's own activation keys.
const HOLD_KEYS = new Set(["Enter", " "]);

// A playful divider that rewards readers who poke at it, inspired by whimsy.joshwcomeau.com.
export default function RainbowDivider({ className }: RainbowDividerProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHeld, setIsHeld] = useState(false);

  // Geometry/colours never change after mount — computed once rather than every render.
  const segments = useMemo(() => buildSegments(), []);

  // Per-segment springs so a flip ripples across the divider instead of snapping all at once.
  const pathSprings = useSprings(
    NUM_SEGMENTS,
    segments.map((segment, index) => {
      const target = isFlipped
        ? isHeld
          ? segment.flippedHoldPath
          : segment.flippedPath
        : isHeld
          ? segment.restHoldPath
          : segment.restPath;

      return {
        d: target,
        delay: index * FLIP_STAGGER_DELAY_MS,
        config: SPRINGS.quick,
        immediate: prefersReducedMotion
      };
    })
  );

  // Key auto-repeat just re-sets the same state, so repeated keydowns need no guard.
  function handleHoldKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (HOLD_KEYS.has(event.key)) setIsHeld(true);
  }

  function handleHoldKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (HOLD_KEYS.has(event.key)) setIsHeld(false);
  }

  return (
    <>
      <DividerButton
        type="button"
        className={className}
        aria-label={isFlipped ? "Un-flip the rainbow divider" : "Flip the rainbow divider"}
        onClick={() => setIsFlipped((prev) => !prev)}
        onPointerDown={() => setIsHeld(true)}
        onPointerUp={() => setIsHeld(false)}
        onPointerLeave={() => setIsHeld(false)}
        onPointerCancel={() => setIsHeld(false)}
        onKeyDown={handleHoldKeyDown}
        onKeyUp={handleHoldKeyUp}
      >
        <Svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="none" aria-hidden>
          {segments.map((_, index) => (
            <animated.path key={`bg-${index}`} className={backgroundLineClass} d={pathSprings[index].d} />
          ))}
          {segments.map((segment, index) => (
            <animated.path
              key={`fg-${index}`}
              className={foregroundLineClass}
              style={{ "--color": segment.color, "--index": segment.index } as React.CSSProperties}
              d={pathSprings[index].d}
              pathLength={100}
            />
          ))}
        </Svg>
      </DividerButton>
    </>
  );
}

RainbowDivider.displayName = "RainbowDivider";
