"use client";

import type { JSX, SVGProps } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconToggleStatus } from "@/hooks/use-toggle-icon-status";
import { Group } from "@/icons/styles/IconFolder.styles";

// Props for IconFolding — springs the code lines' left edge and the gutter chevron's walk-in position/opacity.
export interface IconFoldingProps extends SVGProps<SVGSVGElement> {
  size?: number;
  // When true, strokes render in accentColor instead of currentColor.
  isEnabled?: boolean;
  accentColor: string;
  status?: IconToggleStatus;
}

// Line x-endpoints: full width at rest, trimmed in from the left once the fold gutter is shown to make room for the chevron.
const LINE_X1 = { off: 3, on: 9 };
const LINE_X2 = 21;

// How far left of its resting spot the chevron starts before walking in.
const CHEVRON_WALK_IN = 6;

/*
  Hover previews what enabling looks like — lines trim in and the fold chevron walks in — and
  reverts on release unless it's actually enabled.
*/
export default function IconFolding({
  size = 16,
  isEnabled = false,
  accentColor,
  status = "idle"
}: IconFoldingProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const showChevronShape = isEnabled || status !== "idle";

  const spring = useSpring({
    lineX1: showChevronShape ? LINE_X1.on : LINE_X1.off,
    chevronX: showChevronShape ? 0 : -CHEVRON_WALK_IN,
    chevronOpacity: showChevronShape ? 1 : 0,
    config: SPRINGS.quick,
    immediate: prefersReducedMotion
  });

  const boopStyle = useTransformBoop(status === "booped", { scaleX: 1.12, scaleY: 1.12 });

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
        style={{ overflow: "visible", opacity: isEnabled || status !== "idle" ? 1 : 0.7 }}
      >
        <Group style={boopStyle}>
          {/* Code lines — trim in from the left as the gutter chevron walks in to take their place. */}
          <animated.line x1={spring.lineX1} y1="7" x2={LINE_X2} y2="7" />
          <animated.line x1={spring.lineX1} y1="17" x2={LINE_X2} y2="17" />
          <animated.g
            style={{
              opacity: spring.chevronOpacity,
              transform: spring.chevronX.to((x) => `translateX(${x}px)`)
            }}
          >
            <polyline points="3 9 6 12 3 15" />
          </animated.g>
        </Group>
      </svg>
    </>
  );
}

IconFolding.displayName = "IconFolding";
