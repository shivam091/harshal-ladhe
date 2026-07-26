"use client";

import type { JSX } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconToggleStatus } from "@/hooks/use-toggle-icon-status";

// Props for IconDiffGutter — springs its two colored marker bars in/out as isEnabled toggles.
export interface IconDiffGutterProps {
  size?: number;
  // When true, the gutter's own divider/code-line strokes render in accentColor instead of currentColor.
  isEnabled?: boolean;
  accentColor: string;
  status?: IconToggleStatus;
}
import { Group } from "@/icons/styles/IconDiffGutter.styles";

// Full width the added/removed marker bars spring open to, next to the gutter divider — 0 is fully collapsed.
const BAR_WIDTH = 3;

/*
  Marker bars use the real diff gutter's green/red tokens so the icon previews exactly what the
  toggle shows.
*/
export default function IconDiffGutter({ size = 16, isEnabled = false, accentColor, status = "idle" }: IconDiffGutterProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const bars = useSpring({
    width: isEnabled ? BAR_WIDTH : 0,
    opacity: isEnabled ? 1 : 0,
    config: SPRINGS.quick,
    immediate: prefersReducedMotion
  });

  const boopStyle = useTransformBoop(status === "booped", { scaleX: 1.12, scaleY: 1.12 });
  const strokeColor = isEnabled ? accentColor : "currentColor";

  return (
    <>
      <svg
        {...defaultAttributes}
        width={size}
        height={size}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ overflow: "visible", opacity: status !== "idle" ? 1 : 0.7 }}
      >
        <Group style={boopStyle}>
          {/* Gutter divider. */}
          <line x1="4" y1="4" x2="4" y2="20" />
          {/* Three "code lines" to its right — the middle one is left as plain unchanged context. */}
          <line x1="9" y1="7" x2="19" y2="7" />
          <line x1="9" y1="12" x2="16" y2="12" />
          <line x1="9" y1="17" x2="19" y2="17" />
          {/* Added-line marker, next to the first code line. */}
          <animated.rect x={5.5} y={5.5} height={3} rx={1} fill="var(--color-code-syntax-inserted-text)" stroke="none" width={bars.width} style={{ opacity: bars.opacity }} />
          {/* Removed-line marker, next to the third code line. */}
          <animated.rect x={5.5} y={15.5} height={3} rx={1} fill="var(--color-code-syntax-deleted-text)" stroke="none" width={bars.width} style={{ opacity: bars.opacity }} />
        </Group>
      </svg>
    </>
  );
}

IconDiffGutter.displayName = "IconDiffGutter";
