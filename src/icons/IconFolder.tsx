"use client";

import type { JSX } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import { icons } from "@/icons/icons";
import type { IconToggleStatus } from "@/hooks/use-toggle-icon-status";

// Props for IconFolder — cross-fades between the closed `folder` and open `folderOpen` glyphs as isOpen toggles.
export interface IconFolderProps {
  size?: number;
  isOpen?: boolean;
  status?: IconToggleStatus;
}
import { Group } from "@/icons/styles/IconFolder.styles";

/*
  Cross-fades rather than morphs because the closed and open paths aren't vertex-compatible;
  shapes match the registry so each glyph has one source of truth.
*/
export default function IconFolder({ size = 16, isOpen = false, status = "idle" }: IconFolderProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const crossfade = useSpring({
    openOpacity: isOpen ? 1 : 0,
    closedOpacity: isOpen ? 0 : 1,
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
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ overflow: "visible", opacity: status !== "idle" ? 1 : 0.7 }}
      >
        <Group style={boopStyle}>
          <animated.g style={{ opacity: crossfade.closedOpacity }}>{icons.folder.children}</animated.g>
          <animated.g style={{ opacity: crossfade.openOpacity }}>{icons.folderOpen.children}</animated.g>
        </Group>
      </svg>
    </>
  );
}

IconFolder.displayName = "IconFolder";
