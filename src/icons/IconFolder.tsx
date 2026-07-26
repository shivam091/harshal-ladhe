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
  Spring-animated folder icon: cross-fades between the closed `folder` and open `folderOpen`
  glyphs (icons.tsx) as `isOpen` toggles. Their path data isn't vertex-compatible for a direct
  d-attribute morph (different command counts/order), so opacity is the animated channel instead
  — plus a brief scale "boop" pop on interaction, same technique as IconHash/IconFormat. Renders
  the same static shapes as the icons registry so there's one source of truth for each glyph. Used
  by CodeSandboxFileExplorerButton as the icon for the "show/hide file explorer" toggle.
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
