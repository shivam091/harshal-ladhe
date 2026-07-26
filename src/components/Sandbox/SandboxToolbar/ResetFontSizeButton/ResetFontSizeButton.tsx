"use client";

import type { JSX } from "react";
import { animated } from "@react-spring/web";
import { Icon } from "@/components/Icon";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import type { ResetFontSizeButtonProps } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.types";

// Wraps the generic icon so react-spring can animate its transform
const AnimatedIcon = animated(Icon);

/*
  Toolbar button — restores the editor/gutter font size to its default (see SandboxUIProvider);
  disabled once canResetFontSize is already false.
*/
export default function ResetFontSizeButton({ size = 14 }: ResetFontSizeButtonProps): JSX.Element {
  const { resetFontSize, canResetFontSize } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();
  const iconStyle = useTransformBoop(status === "booped", { scaleX: 1.1, scaleY: 1.1 });

  return (
    <>
      <ActionButton
        type="button"
        onClick={resetFontSize}
        disabled={!canResetFontSize}
        aria-label="Reset editor font size"
        title="Reset editor font size (Ctrl/⌘+Alt+0)"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <AnimatedIcon
          name="textSize"
          size={size}
          style={{ overflow: "visible", opacity: status !== "idle" ? 1 : 0.7, ...iconStyle }}
        />
        <VisuallyHidden>Reset editor font size</VisuallyHidden>
      </ActionButton>
    </>
  );
}

ResetFontSizeButton.displayName = "ResetFontSizeButton";
