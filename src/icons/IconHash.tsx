"use client";

import type { JSX, SVGProps } from "react";
import { useSprings } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconToggleStatus } from "@/hooks/use-toggle-icon-status";
import getLineData from "@/icons/IconHash.helpers";
import { Line } from "@/icons/styles/IconHash.styles";

// Props for IconHash — spring-morphs between a "#" (on) and a collapsed "+" (off) shape.
export interface IconHashProps extends SVGProps<SVGSVGElement> {
  size?: number;
  // When true, strokes render in accentColor instead of currentColor.
  isEnabled?: boolean;
  accentColor: string;
  status?: IconToggleStatus;
}

// Snappier, near-instant spring used only for the "pressed" (toggled-off) shape.
const PRESSED_SPRING = {
  tension: SPRINGS.springy.tension * 2,
  friction: SPRINGS.springy.friction * 3
};

/*
  Spring-animated hash icon: morphs between a "#" shape and a collapsed "+" shape, with a brief
  1px "boop" wiggle on interaction. Used by CodeSandboxLineNumberToggle as the line-number
  toggle button's icon — isEnabled/status are driven entirely by the caller.
*/
export default function IconHash({
  size = 16,
  isEnabled,
  accentColor,
  status = "idle",
  style,
  ...delegated
}: IconHashProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const lineData = getLineData(status);

  const [springs] = useSprings(
    lineData.length,
    (index) => ({
      to: lineData[index],
      config: status === "pressed" ? PRESSED_SPRING : SPRINGS.springy,
      immediate: prefersReducedMotion
    }),
    [status]
  );

  const opacity = isEnabled || status !== "idle" ? 1 : 0.7;

  return (
    <>
      <svg
        {...defaultAttributes}
        width={size}
        height={size}
        fill="none"
        stroke={isEnabled ? accentColor : "currentColor"}
        style={{ display: "block", overflow: "visible", opacity, ...style }}
        {...delegated}
      >
        {springs.map((spring, index) => (
          <Line key={index} {...spring} />
        ))}
      </svg>
    </>
  );
}

IconHash.displayName = "IconHash";
