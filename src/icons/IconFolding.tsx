"use client";

import { JSX, useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconFoldingProps } from "@/interfaces/icons/folding";

/*
  Polyline coordinates for the two shapes this icon morphs between — matching the chevronDown/
  chevronRight registry entries (icons/icons.tsx) so it's pixel-identical to the fold gutter's
  own markers (folding.ts's chevronMarkerDOM) at rest.
*/
const POINTS = {
  expanded: "6 10 12 16 18 10",
  collapsed: "9 6 15 12 9 18"
};

/*
  Spring-morphs between the fold gutter's own expanded (chevron-down) and collapsed
  (chevron-right) marker shapes, plus a scale "boop" pop on interaction (IconFolder/IconDiffGutter's
  own technique) layered on top. Used by FoldingToggle as the "enable/disable code folding" icon.
*/
export default function IconFolding({
  size = 16,
  isEnabled,
  accentColor,
  status = "idle",
  style,
  ...delegated
}: IconFoldingProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const boopStyle = useTransformBoop(status === "booped", { scaleX: 1.12, scaleY: 1.12 });
  // Prevents the initial mount from animating — the icon snaps to its starting shape.
  const isMounted = useRef(false);

  const [spring, api] = useSpring(() => ({
    points: POINTS.expanded,
    config: { ...SPRINGS.quick, clamp: true }
  }));

  useEffect(() => {
    isMounted.current = true;
  }, []);

  // Drives the polyline to the target shape whenever isEnabled or motion preference changes.
  useEffect(() => {
    api.start({
      points: isEnabled ? POINTS.expanded : POINTS.collapsed,
      immediate: !isMounted.current || prefersReducedMotion
    });
  }, [isEnabled, prefersReducedMotion, api]);

  return (
    <>
      <svg
        {...defaultAttributes}
        width={size}
        height={size}
        fill="none"
        stroke={isEnabled ? accentColor : "currentColor"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: "block", overflow: "visible", opacity: isEnabled || status !== "idle" ? 1 : 0.7, ...style }}
        {...delegated}
      >
        <animated.g style={boopStyle}>
          <animated.polyline {...spring} />
        </animated.g>
      </svg>
    </>
  );
}

IconFolding.displayName = "IconFolding";
