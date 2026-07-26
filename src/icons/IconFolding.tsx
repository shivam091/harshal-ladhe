"use client";

import type { JSX } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconFoldingProps } from "@/interfaces/icons/folding";
import { Group } from "@/icons/styles/IconFolder.styles";

// Line x-endpoints: full width at rest, trimmed in from the left once the fold gutter is shown to make room for the chevron.
const LINE_X1 = { off: 3, on: 9 };
const LINE_X2 = 21;

// How far left of its resting spot the chevron starts before walking in.
const CHEVRON_WALK_IN = 6;

/*
  Spring-animated fold icon: two full-width code lines trim in from the left once enabled — or
  while hovering/pressing/booping as a preview of what enabling would look like — while a chevron
  marker, the same shape folding.ts's own gutter marker renders, walks in from the left to fill
  the space they left behind, reverting on release unless it's actually enabled. isEnabled also
  recolors the strokes to accentColor. Plus a brief scale "boop" pop on interaction, same technique
  as IconFolder/IconHash. Used by FoldingToggle as the icon for the fold-gutter visibility toggle.
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
