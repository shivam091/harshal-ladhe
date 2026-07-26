"use client";

import type { JSX } from "react";
import { animated } from "@react-spring/web";
import { Icon } from "@/components/Icon";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import type { DecreaseFontSizeButtonProps } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.types";

// Wraps the generic icon so react-spring can animate its transform.
const AnimatedIcon = animated(Icon);

/*
  Toolbar button — steps the editor/gutter font size down (see SandboxUIProvider for the clamp/step);
  disabled once canDecreaseFontSize hits the min.
*/
export default function DecreaseFontSizeButton({ size = 14 }: DecreaseFontSizeButtonProps): JSX.Element {
  const { decreaseFontSize, canDecreaseFontSize } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();
  const iconStyle = useTransformBoop(status === "booped", { scaleX: 1.1, scaleY: 1.1 });

  return (
    <>
      <ActionButton
        type="button"
        onClick={decreaseFontSize}
        disabled={!canDecreaseFontSize}
        aria-label="Decrease editor font size"
        title="Decrease editor font size (Ctrl/⌘+Alt+-)"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <AnimatedIcon
          name="textSizeDecrease"
          size={size}
          style={{ overflow: "visible", opacity: status !== "idle" ? 1 : 0.7, ...iconStyle }}
        />
        <VisuallyHidden>Decrease editor font size</VisuallyHidden>
      </ActionButton>
    </>
  );
}

DecreaseFontSizeButton.displayName = "DecreaseFontSizeButton";
