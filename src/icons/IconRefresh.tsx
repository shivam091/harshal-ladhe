"use client";

import type { JSX } from "react";
import { useSpring } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import { icons } from "@/icons/icons";
import type { IconToggleStatus } from "@/hooks/use-toggle-icon-status";

// Props for IconRefresh — refresh glyph that spins 180° per click.
export interface IconRefreshProps {
  size?: number;
  status?: IconToggleStatus;
  // Cumulative rotation target in degrees — the caller increments this by 180 on each click.
  rotation: number;
}
import { RotatingGroup } from "@/icons/styles/IconRefresh.styles";

/*
  Spring-animated refresh icon: spins a full 180° every time `rotation` steps up by 180, driven
  entirely by the caller (CodeSandboxRerunButton increments it on each click). Renders the same
  glyph as the "refresh" entry in the icons registry (icons.tsx) so the static shape has one
  source of truth — this component only adds the spin + hover-opacity behaviour on top.
*/
export default function IconRefresh({ size = 16, status = "idle", rotation }: IconRefreshProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const spin = useSpring({
    transform: `rotate(${rotation}deg)`,
    config: SPRINGS.default,
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
        style={{ overflow: "visible", opacity: status !== "idle" ? 1 : 0.7 }}
      >
        <RotatingGroup style={spin}>{icons.refresh.children}</RotatingGroup>
      </svg>
    </>
  );
}

IconRefresh.displayName = "IconRefresh";
