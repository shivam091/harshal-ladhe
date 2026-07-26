"use client";

import { JSX } from "react";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import { animated } from "@react-spring/web";
import { Icon } from "@/components/Icon";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { ACCENT_COLOR } from "@/components/Sandbox/SandboxToolbar/constants";
import type { WordWrapToggleProps } from "@/interfaces/sandbox";

// Wraps the generic icon so react-spring can animate its transform
const AnimatedIcon = animated(Icon);

// Toolbar toggle for the editor's line-wrapping behavior — tinted via currentColor when enabled, matching the codebase's other toggles.
export default function WordWrapToggle({ size = 14 }: WordWrapToggleProps): JSX.Element {
  const { showWordWrap, toggleWordWrap } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();
  // Same scale boop as IconDiffGutter/IconIndentGuides — useTransformBoop already handles the spring and prefers-reduced-motion check, so there's no need to duplicate either here.
  const iconStyle = useTransformBoop(status === "booped", { scaleX: 1.1, scaleY: 1.1 });

  return (
    <>
      <RadixToolbar.Button asChild>
        <ActionButton
          type="button"
          onClick={toggleWordWrap}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          aria-pressed={showWordWrap}
          aria-label={showWordWrap ? "Disable word wrap" : "Enable word wrap"}
          title={showWordWrap ? "Disable word wrap (Ctrl/⌘+Alt+L)" : "Enable word wrap (Ctrl/⌘+Alt+L)"}
        >
          <AnimatedIcon
            name="wrapText"
            size={size}
            style={{
              overflow: "visible",
              opacity: showWordWrap || status !== "idle" ? 1 : 0.7,
              color: showWordWrap ? ACCENT_COLOR : undefined,
              ...iconStyle
            }}
          />
          <VisuallyHidden>
            {showWordWrap ? "Disable word wrap" : "Enable word wrap"}
          </VisuallyHidden>
        </ActionButton>
      </RadixToolbar.Button>
    </>
  );
}

WordWrapToggle.displayName = "WordWrapToggle";
