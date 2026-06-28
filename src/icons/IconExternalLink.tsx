"use client";

import type { JSX } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconToggleStatus } from "@/hooks/use-toggle-icon-status";

// Props for IconExternalLink — external-link glyph that boops diagonally toward its own arrowhead on hover.
export interface IconExternalLinkProps {
  size?: number;
  status?: IconToggleStatus;
  // Stroke colour while hovering/pressed/booped; defaults to currentColor.
  accentColor?: string;
}

// How far (in SVG units) the arrow's tip stretches up-and-right on a hover boop.
const BOOP_DISTANCE = 2;

/*
  Only the arrow stretches toward its tip so the box stays put. Coordinates duplicate the
  registry entry because the arrow's end points must be individually animatable.
*/
export default function IconExternalLink({ size = 16, status = "idle", accentColor }: IconExternalLinkProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const { t } = useSpring({
    t: status === "booped" ? 1 : 0,
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
        style={{ overflow: "visible", opacity: status !== "idle" ? 1 : 0.7, transition: "stroke 250ms" }}
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <animated.line
          stroke={status !== "idle" && accentColor ? accentColor : "currentColor"}
          x1="10"
          y1="14"
          x2={t.to((v) => 21 + v * BOOP_DISTANCE)}
          y2={t.to((v) => 3 - v * BOOP_DISTANCE)}
        />
        <animated.polyline
          stroke={status !== "idle" && accentColor ? accentColor : "currentColor"}
          points={t.to(
            (v) => `${14 + v * BOOP_DISTANCE} ${3 - v * BOOP_DISTANCE} ${21 + v * BOOP_DISTANCE} ${3 - v * BOOP_DISTANCE} ${21 + v * BOOP_DISTANCE} ${10 - v * BOOP_DISTANCE}`
          )}
        />
      </svg>
    </>
  );
}

IconExternalLink.displayName = "IconExternalLink";
