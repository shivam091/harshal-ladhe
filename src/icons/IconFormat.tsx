"use client";

import type { JSX } from "react";
import { useEffect, useRef, useState, memo } from "react";
import { useSpring } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconToggleStatus } from "@/hooks/use-toggle-icon-status";

// Props for IconFormat — animated magic-wand glyph that bursts sparkles whenever a format action fires.
export interface IconFormatProps {
  size?: number;
  status?: IconToggleStatus;
  // True for a brief pulse right after a format action fires — spawns one sparkle burst per pulse.
  isFormatting?: boolean;
  // Sparkle stroke colour; defaults to currentColor.
  accentColor?: string;
}
import type { SparkleSpec } from "@/icons/IconFormat.helpers";
import { getSparkleSpecs, getWandRotation } from "@/icons/IconFormat.helpers";
import { StarGroup, Wand } from "@/icons//styles/IconFormat.styles";

/*
  Longest fadeDelay + fadeDuration among SPARKLE_SPECS below, plus a small buffer — how long a
  sparkle burst's DOM nodes stay mounted before being cleaned up.
*/
const SPARKLE_LIFETIME_MS = 2400;

// Sparkles burst from the wand tip on each format so the action gets a visible flourish.
export default function IconFormat({
  size = 16,
  status = "idle",
  isFormatting = false,
  accentColor
}: IconFormatProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [sparkleBurstIds, setSparkleBurstIds] = useState<string[]>([]);
  const nextSparkleId = useRef(0);
  /*
    Tracks every pending removal timeout so they can be flushed on unmount — NOT reset per
    isFormatting toggle, since that would cancel a still-pending removal from the prior pulse.
  */
  const pendingRemovals = useRef<number[]>([]);

  useEffect(() => {
    if (!isFormatting) return;

    const sparkleId = `sparkle-${nextSparkleId.current++}`;
    setSparkleBurstIds((current) => [...current, sparkleId]);

    const timeoutId = window.setTimeout(() => {
      setSparkleBurstIds((current) => current.filter((id) => id !== sparkleId));
    }, SPARKLE_LIFETIME_MS);
    pendingRemovals.current.push(timeoutId);
  }, [isFormatting]);

  useEffect(() => {
    /*
      pendingRemovals is a plain accumulator ref (not a DOM node), and reading .current fresh at
      unmount — rather than a variable snapshotted at mount, when the array was still empty — is
      the point: it must see every id pushed after mount, not just what existed at effect-setup time.
    */
    return () => {
      pendingRemovals.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  const wandGroupStyle = useSpring({
    transform: `rotate(${getWandRotation(status)}deg)`,
    config: SPRINGS.springy,
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
        style={{ overflow: "visible", opacity: status !== "idle" ? 1 : 0.7 }}
      >
        {sparkleBurstIds.map((sparkleId) => (
          <SparkleBurst key={sparkleId} accentColor={accentColor} prefersReducedMotion={prefersReducedMotion} />
        ))}

        <Wand style={wandGroupStyle}>
          <rect x={0} y={8} width={24} height={6} rx={2} />
          <line x1={18} y1={8} x2={18} y2={14} />
        </Wand>
      </svg>
    </>
  );
}

/*
  One burst of three sparkles flying out from the wand tip. Memoised and never expected to
  re-render during its own lifetime — each mount computes its own random flight paths once.
*/
const SparkleBurst = memo(function SparkleBurst({
  accentColor,
  prefersReducedMotion
}: {
  accentColor?: string;
  prefersReducedMotion: boolean;
}): JSX.Element {
  const specs = getSparkleSpecs();

  return (
    <>
      {specs.map((spec, index) => (
        <SparkleParticle key={index} spec={spec} accentColor={accentColor} prefersReducedMotion={prefersReducedMotion} />
      ))}
    </>
  );
});

// A single sparkle: flies out under a physics spring while independently fading to transparent on its own delayed tween.
function SparkleParticle({
  spec,
  accentColor,
  prefersReducedMotion
}: {
  spec: SparkleSpec;
  accentColor?: string;
  prefersReducedMotion: boolean;
}) {
  const spring = useSpring({
    from: { transform: "translate(0px, 0px) rotate(0deg) scale(1)", opacity: 1 },
    to: {
      transform: `translate(${spec.translateX}px, ${spec.translateY}px) rotate(${spec.rotation}deg) scale(${spec.scale})`,
      opacity: 0
    },
    delay: (key: string) => (key === "opacity" ? spec.fadeDelay : spec.transformDelay),
    config: (key: string) => (key === "opacity" ? { duration: spec.fadeDuration } : { tension: spec.tension, friction: spec.friction }),
    immediate: prefersReducedMotion
  });

  return (
    <>
      <StarGroup stroke={accentColor ?? "currentColor"} style={spring}>
        <polygon points="16 4, 20 4" />
        <polygon points="18 2, 18 6" />
      </StarGroup>
    </>
  );
}

IconFormat.displayName = "IconFormat";
