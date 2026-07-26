"use client";

import type { JSX, SVGProps } from "react";
import { useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconToggleStatus } from "@/hooks/use-toggle-icon-status";

// Props for IconWordWrap — spring-morphs between the centered no-wrap lines and the raised lines + drawn-in wrap arrow.
export interface IconWordWrapProps extends SVGProps<SVGSVGElement> {
  size?: number;
  // When true, strokes render in accentColor instead of currentColor.
  isEnabled?: boolean;
  accentColor: string;
  status?: IconToggleStatus;
}

// Line y-positions: centered (no-wrap) vs. raised to make room for the wrap arrow underneath.
const LINE_Y = {
  off: { top: 9, bottom: 15 },
  on: { top: 6, bottom: 12 }
};

// Hand-measured lengths of the two wrap-arrow segments below, so stroke-dasharray/dashoffset can "draw" each in as it appears.
const CURVE_LENGTH = 8.15; // "M20 14v2a2 2 0 0 1-2 2h-3"
const ARROW_LENGTH = 5.66; // "M17 20l-2-2 2-2"

/*
  Spring-animated word-wrap icon: at rest the two lines sit centered with no wrap indicator; once
  enabled — or while hovering/pressing/booping as a preview of what enabling would look like —
  they rise slightly and a curved arrow draws in underneath (stroke-dasharray reveal), reverting
  on release unless it's actually enabled. isEnabled also recolors the strokes to accentColor.
  Used by WordWrapToggle as the "enable/disable word wrap" icon.
*/
export default function IconWordWrap({
  size = 16,
  isEnabled = false,
  accentColor,
  status = "idle",
  style,
  ...delegated
}: IconWordWrapProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const boopStyle = useTransformBoop(status === "booped", { scaleX: 1.12, scaleY: 1.12 });
  // Prevents the initial mount from animating — the icon snaps to its starting shape.
  const isMounted = useRef(false);
  const showWrapShape = isEnabled || status !== "idle";

  const [spring, api] = useSpring(() => ({
    lineTopY: showWrapShape ? LINE_Y.on.top : LINE_Y.off.top,
    lineBottomY: showWrapShape ? LINE_Y.on.bottom : LINE_Y.off.bottom,
    draw: showWrapShape ? 1 : 0,
    config: { ...SPRINGS.quick, clamp: true }
  }));

  useEffect(() => {
    isMounted.current = true;
  }, []);

  // Drives the lines/arrow to their raised or resting shape whenever isEnabled, hover/press status, or motion preference changes.
  useEffect(() => {
    api.start({
      lineTopY: showWrapShape ? LINE_Y.on.top : LINE_Y.off.top,
      lineBottomY: showWrapShape ? LINE_Y.on.bottom : LINE_Y.off.bottom,
      draw: showWrapShape ? 1 : 0,
      immediate: !isMounted.current || prefersReducedMotion
    });
  }, [showWrapShape, prefersReducedMotion, api]);

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
          <animated.line x1={3} x2={21} y1={spring.lineTopY} y2={spring.lineTopY} />
          <animated.line x1={3} x2={21} y1={spring.lineBottomY} y2={spring.lineBottomY} />
          {/* Wrap curve dropping from the second line down into the arrowhead. */}
          <animated.path
            d="M20 14v2a2 2 0 0 1-2 2h-3"
            strokeDasharray={CURVE_LENGTH}
            strokeDashoffset={spring.draw.to((t) => CURVE_LENGTH * (1 - Math.min(t / 0.6, 1)))}
          />
          {/* Arrowhead, drawn in just after the curve. */}
          <animated.path
            d="M17 20l-2-2 2-2"
            strokeDasharray={ARROW_LENGTH}
            strokeDashoffset={spring.draw.to((t) => ARROW_LENGTH * (1 - Math.max(Math.min((t - 0.4) / 0.6, 1), 0)))}
          />
        </animated.g>
      </svg>
    </>
  );
}

IconWordWrap.displayName = "IconWordWrap";
