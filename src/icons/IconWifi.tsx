"use client";

import type { JSX } from "react";
import { useSpring, useSprings, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";

// Driven by connection state rather than hover, so the icon tells the story of the outage itself.
export interface IconWifiProps {
  size?: number;
  isOffline: boolean;
}

// Inner arc first so a reconnect ripples outwards from the signal dot.
const ARCS = [
  "M8.5 16.429a5 5 0 0 1 7 0",
  "M5 12.859a10 10 0 0 1 14 0",
  "M2 8.82a15 15 0 0 1 20 0"
] as const;

// Staggered so the arcs light up one after another instead of all at once.
const ARC_DELAY = [0, 90, 180] as const;

// Plays its transition on mount as well as on change, so it still animates when swapped in fresh.
export default function IconWifi({ size = 20, isOffline }: IconWifiProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Dimmed rather than removed on loss, so the slash reads as the dominant mark without losing the wifi shape.
  const arcSprings = useSprings(
    ARCS.length,
    ARCS.map((_, i) => ({
      from: { opacity: isOffline ? 1 : 0, scale: isOffline ? 1 : 0.6 },
      to: { opacity: isOffline ? 0.45 : 1, scale: 1 },
      delay: isOffline ? 0 : ARC_DELAY[i],
      config: SPRINGS.springy,
      immediate: prefersReducedMotion
    }))
  );

  // Normalised path length so the slash can draw in without measuring the line or hard-coding its length.
  const { draw } = useSpring({
    from: { draw: isOffline ? 0 : 1 },
    to: { draw: isOffline ? 1 : 0 },
    delay: isOffline ? 120 : 0,
    config: SPRINGS.quick,
    immediate: prefersReducedMotion
  });

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size} fill="none" stroke="currentColor" style={{ overflow: "visible" }}>
        {arcSprings.map(({ opacity, scale }, i) => (
          <animated.path
            key={i}
            d={ARCS[i]}
            style={{ opacity, scale, transformOrigin: "12px 20px" }}
          />
        ))}
        <path d="M12 20h.01" />
        <animated.line
          x1="2"
          y1="2"
          x2="22"
          y2="22"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={draw.to((d) => 1 - d)}
        />
      </svg>
    </>
  );
}

IconWifi.displayName = "IconWifi";
