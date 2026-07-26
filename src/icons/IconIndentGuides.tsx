"use client";

import type { JSX } from "react";
import { animated } from "@react-spring/web";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import { icons } from "@/icons/icons";
import type { IconIndentGuidesProps } from "@/interfaces/icons/indent-guides";

/*
  Static indent-guide glyph (icons.tsx) with the same isEnabled/status treatment as IconHash —
  accent stroke while guides are shown, a brief scale "boop" pop on interaction, dimmed at rest
  otherwise. There's only one glyph shape here, so unlike IconFolder there's nothing to
  cross-fade. Used by IndentGuidesToggle as the "show/hide indent guides" toggle's icon.
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
