"use client";

import type { JSX } from "react";
import { animated } from "@react-spring/web";
import { Icon } from "@/components/Icon";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import type { IncreaseFontSizeButtonProps } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.types";

// Wraps the generic icon so react-spring can animate its transform.
const AnimatedIcon = animated(Icon);

/*
  Toolbar button — steps the editor/gutter font size up (see SandboxUIProvider for the clamp/step);
  disabled once canIncreaseFontSize hits the max.
*/
export default function IncreaseFontSizeButton({ size = 14 }: IncreaseFontSizeButtonProps): JSX.Element {
  const { increaseFontSize, canIncreaseFontSize } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();
  const iconStyle = useTransformBoop(status === "booped", { scaleX: 1.1, scaleY: 1.1 });

  return (
    <>
      <ActionButton
        type="button"
        onClick={increaseFontSize}
        disabled={!canIncreaseFontSize}
        aria-label="Increase editor font size"
        title="Increase editor font size (Ctrl/⌘+Alt+=)"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <AnimatedIcon
          name="textSizeIncrease"
          size={size}
          style={{ overflow: "visible", opacity: status !== "idle" ? 1 : 0.7, ...iconStyle }}
        />
        <VisuallyHidden>Increase editor font size</VisuallyHidden>
      </ActionButton>
    </>
  );
}

IncreaseFontSizeButton.displayName = "IncreaseFontSizeButton";
