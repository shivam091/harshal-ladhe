"use client";

import type { JSX, SVGProps } from "react";
import { animated } from "@react-spring/web";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import { icons } from "@/icons/icons";
import type { IconToggleStatus } from "@/hooks/use-toggle-icon-status";

// Props for IconIndentGuides — static glyph with an isEnabled accent + boop pop, no shape morph.
export interface IconIndentGuidesProps extends SVGProps<SVGSVGElement> {
  size?: number;
  // When true, strokes render in accentColor instead of currentColor.
  isEnabled?: boolean;
  accentColor: string;
  status?: IconToggleStatus;
}

/*
  Only one glyph shape, so there's nothing to morph — state is shown by the accent stroke and
  dimming alone.
*/
export default function IconIndentGuides({
  size = 16,
  isEnabled,
  accentColor,
  status = "idle",
  style,
  ...delegated
}: IconIndentGuidesProps): JSX.Element {
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
        style={{ display: "block", overflow: "visible", opacity: isEnabled || status !== "idle" ? 1 : 0.7, ...style }}
        {...delegated}
      >
        <animated.g style={boopStyle}>{icons.indentGuides.children}</animated.g>
      </svg>
    </>
  );
}

IconIndentGuides.displayName = "IconIndentGuides";
