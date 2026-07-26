"use client";

import type { JSX } from "react";
import IconWordWrap from "@/icons/IconWordWrap";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { ACCENT_COLOR } from "@/components/Sandbox/SandboxToolbar/constants";
import type { WordWrapToggleProps } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.types";

// Toolbar toggle for the editor's line-wrapping behavior, animated via IconWordWrap.
export default function WordWrapToggle({ size = 14 }: WordWrapToggleProps): JSX.Element {
  const { showWordWrap, toggleWordWrap } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();

  return (
    <>
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
        <IconWordWrap
          isEnabled={showWordWrap}
          accentColor={ACCENT_COLOR}
          status={status}
          size={size}
        />
        <VisuallyHidden>
          {showWordWrap ? "Disable word wrap" : "Enable word wrap"}
        </VisuallyHidden>
      </ActionButton>
    </>
  );
}

WordWrapToggle.displayName = "WordWrapToggle";
