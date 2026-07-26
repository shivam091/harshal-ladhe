"use client";

import type { JSX } from "react";
import { useId } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconToggleStatus } from "@/hooks/use-toggle-icon-status";

// Props for IconSkipBack — skip-back glyph that kicks further back whenever a reset action fires.
export interface IconSkipBackProps {
  size?: number;
  status?: IconToggleStatus;
  // True for the entire click-and-hold gesture (from press to release/reset) — creeps the triangle back over the hold's duration rather than snapping it.
  isHolding?: boolean;
  // True for a brief pulse right after a reset action fires — holds the triangle further back under a heavier spring.
  isResetting?: boolean;
}

// Base (at-rest) triangle points — a "skip back" arrowhead pointing at a fixed vertical bar.
const POINTS = [19, 20, 9, 12, 19, 4, 19, 20];

// How far left (in SVG units) the triangle pulls on a hover boop vs. a completed hold.
const BOOP_DISTANCE = 3;
const RESET_DISTANCE = 5;

/*
  Must match ResetButton's RESET_AFTER — the hold-creep below is timed to land at RESET_DISTANCE
  exactly as the hold reaches the reset threshold, so the triangle's position keeps changing
  visibly over the course of the hold instead of snapping straight to its pulled-back position.
*/
const HOLD_DURATION_MS = 1000;

/*
  The triangle creeps back over the hold so progress toward the reset stays visible, then pulls
  fully back under a heavier spring when it fires. A mask tucks its tip behind the bar instead of
  overlapping it.
*/
export default function IconSkipBack({ size = 16, status = "idle", isHolding = false, isResetting = false }: IconSkipBackProps): JSX.Element {
  const id = useId();
  const maskId = `skip-back-mask-${id}`;
  const prefersReducedMotion = usePrefersReducedMotion();

  const distance = isHolding || isResetting ? RESET_DISTANCE : status === "booped" ? BOOP_DISTANCE : 0;
  const pulledBack = distance > 0;

  const polygonSpring = useSpring({
    points: pulledBack ? POINTS.map((p, i) => (i % 2 === 0 ? p - distance : p)).join(" ") : POINTS.join(" "),
    config: isHolding ? { duration: HOLD_DURATION_MS } : isResetting ? { tension: 100, friction: 40 } : SPRINGS.springy,
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
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="black" />
          <rect x="9" y="0" width="16" height="24" fill="white" />
        </mask>
        <line x1="5" y1="19" x2="5" y2="5" />
        {/* `points` is itself the animated value — a rigid horizontal shift, not a transform. */}
        <animated.polygon {...polygonSpring} mask={`url(#${maskId})`} />
      </svg>
    </>
  );
}

IconSkipBack.displayName = "IconSkipBack";
