"use client";

import type { JSX} from "react";
import { useEffect, useRef, useState } from "react";
import { useIsOnscreen } from "@/hooks/use-is-onscreen";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useRandomInterval } from "@/hooks/use-random-interval";
import { useSound } from "@/hooks/use-sound";
import type { SparklesProps, SparkleType } from "@/components/Sparkles/Sparkles.types";
import { Sparkle } from "@/components/Sparkles/Sparkle";
import {
  defaultGeneratePosition,
  generateSparkle
} from "@/components/Sparkles/Sparkles.helpers";
import { wrapper, ChildWrapper } from "@/components/Sparkles/Sparkles.styles";

// How long a sparkle stays in the DOM (must match Sparkles.styles.ts's sparkle-come-in-out duration) — older sparkles are pruned on every tick so the list doesn't grow unbounded.
const SPARKLE_LIFESPAN_MS = 1000;

// Fallback palette when no `colors` prop is passed — hoisted so the default doesn't allocate a fresh array reference on every render.
const DEFAULT_COLORS = ["#FFC700"];

/*
  Sparkles around text add a playful highlight (inspired by joshwcomeau.com); optionally a
  button that toggles the effect with a switch sound.
*/
export default function Sparkles({
  rate = 250,
  variance = 200,
  minSize = 10,
  maxSize = 20,
  colors = DEFAULT_COLORS,
  children,
  isToggleable = true,
  style = {},
  generatePosition = defaultGeneratePosition,
  delayBy = 0,
  ...delegated
}: SparklesProps): JSX.Element {
  const [sparkles, setSparkles] = useState<Array<SparkleType>>([]);
  const [hasDelayElapsed, setHasDelayElapsed] = useState(delayBy === 0);
  const [isEnabled, setIsEnabled] = useState(true);

  const ref = useRef<HTMLButtonElement | HTMLSpanElement>(null);
  const isOnscreen = useIsOnscreen(ref);

  const [playOn] = useSound("/sounds/switch-on.wav");
  const [playOff] = useSound("/sounds/switch-off.wav");

  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = hasDelayElapsed && !prefersReducedMotion;

  // Only ticks while onscreen, enabled and motion is allowed, so nothing animates unseen.
  useRandomInterval(
    () => {
      if (!isOnscreen || !isEnabled) return;

      const sparkle = generateSparkle(colors, minSize, maxSize, generatePosition);
      const now = Date.now();

      setSparkles((current) => [
        ...current.filter((sp) => now - sp.createdAt < SPARKLE_LIFESPAN_MS),
        sparkle
      ]);
    },
    shouldAnimate ? rate - variance : null,
    shouldAnimate ? rate + variance : null
  );

  // One-shot delayed start, so a caller can let an entrance animation settle before sparkles begin.
  useEffect(() => {
    if (!delayBy) return;

    const timeoutId = window.setTimeout(() => setHasDelayElapsed(true), delayBy);
    return () => window.clearTimeout(timeoutId);
  }, [delayBy]);

  /*
    Prunes stale sparkles even when the spawn loop above isn't ticking (offscreen, disabled, or
    reduced motion). Without this, a sparkle spawned right before the effect pauses would sit as
    an invisible-but-present DOM node/state entry indefinitely, since the interval callback above
    only prunes when it fires again.
  */
  useEffect(() => {
    if (sparkles.length === 0) return;

    const timeoutId = window.setTimeout(() => {
      const now = Date.now();
      setSparkles((current) => current.filter((sp) => now - sp.createdAt < SPARKLE_LIFESPAN_MS));
    }, SPARKLE_LIFESPAN_MS);

    return () => window.clearTimeout(timeoutId);
  }, [sparkles]);

  const Tag = isToggleable ? "button" : "span";

  return (
    <>
      <Tag
        ref={ref as never}
        className={wrapper}
        data-toggleable={String(isToggleable)}
        type={isToggleable ? "button" : undefined}
        onClick={
          isToggleable
            ? () => {
                setIsEnabled((current) => !current);
                if (isEnabled) {
                  playOff();
                } else {
                  playOn();
                }
              }
            : undefined
        }
        style={style}
        {...delegated}
      >
        {sparkles.map((sparkle) => (
          <Sparkle
            key={sparkle.id}
            color={sparkle.color}
            size={sparkle.size}
            style={sparkle.style}
          />
        ))}
        <ChildWrapper>{children}</ChildWrapper>
      </Tag>
    </>
  );
}

Sparkles.displayName = "Sparkles";
