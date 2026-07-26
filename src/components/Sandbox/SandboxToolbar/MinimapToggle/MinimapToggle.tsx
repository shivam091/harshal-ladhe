"use client";

import type { JSX } from "react";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import { animated } from "@react-spring/web";
import { Icon } from "@/components/Icon";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { ACCENT_COLOR } from "@/components/Sandbox/SandboxToolbar/constants";
import type { MinimapToggleProps } from "@/interfaces/sandbox";

// Wraps the generic icon so react-spring can animate its transform.
const AnimatedIcon = animated(Icon);

/*
  Toolbar toggle for the editor's VS Code-style overview-strip minimap — tinted via currentColor when
  enabled, matching the codebase's other toggles.
*/
export default function MinimapToggle({ size = 14 }: MinimapToggleProps): JSX.Element {
  const { showMinimap, toggleMinimap } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();
  const iconStyle = useTransformBoop(status === "booped", { scaleX: 1.1, scaleY: 1.1 });

  return (
    <>
      <RadixToolbar.Button asChild>
        <ActionButton
          type="button"
          onClick={toggleMinimap}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          aria-pressed={showMinimap}
          aria-label={showMinimap ? "Hide minimap" : "Show minimap"}
          title={showMinimap ? "Hide minimap (Ctrl/⌘+Alt+A)" : "Show minimap (Ctrl/⌘+Alt+A)"}
        >
          <AnimatedIcon
            name="minimap"
            size={size}
            style={{
              overflow: "visible",
              opacity: showMinimap || status !== "idle" ? 1 : 0.7,
              color: showMinimap ? ACCENT_COLOR : undefined,
              ...iconStyle
            }}
          />
          <VisuallyHidden>
            {showMinimap ? "Hide minimap" : "Show minimap"}
          </VisuallyHidden>
        </ActionButton>
      </RadixToolbar.Button>
    </>
  );
}

MinimapToggle.displayName = "MinimapToggle";
