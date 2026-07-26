"use client";

import { JSX } from "react";
import { useSpring } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import { icons } from "@/icons/icons";
import type { IconCircleSlashProps } from "@/interfaces/icons/circle-slash";
import { RotatingGroup } from "@/icons/styles/IconCircleSlash.styles";

/*
  Spring-animated "clear" icon: spins a full 180° every time `rotation` steps up by 180, driven
  entirely by the caller (CodeSandboxClearConsoleButton increments it on each click). Renders the
  same glyph as the "circleSlash" entry in the icons registry (icons.tsx) so the static shape has
  one source of truth — this component only adds the spin + hover-opacity behaviour on top.
*/
export default function IconCircleSlash({ size = 16, status = "idle", rotation }: IconCircleSlashProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const spin = useSpring({
    transform: `rotate(${rotation}deg)`,
    config: SPRINGS.default,
    immediate: prefersReducedMotion,
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
        <RotatingGroup style={spin}>{icons.circleSlash.children}</RotatingGroup>
      </svg>
    </>
  );
}

IconCircleSlash.displayName = "IconCircleSlash";
