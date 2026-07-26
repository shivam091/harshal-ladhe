"use client";

import type { JSX } from "react";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import IconFolding from "@/icons/IconFolding";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import { ACCENT_COLOR } from "@/components/Sandbox/SandboxToolbar/constants";
import type { FoldingToggleProps } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.types";

// Toolbar button that toggles the editor's code-folding gutter/keymap, animated via IconFolding.
export default function FoldingToggle({ size = 14 }: FoldingToggleProps): JSX.Element {
  const { showFolding, toggleFolding } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();

  return (
    <>
      <RadixToolbar.Button asChild>
        <ActionButton
          type="button"
          onClick={toggleFolding}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          aria-pressed={showFolding}
          aria-label={showFolding ? "Disable code folding" : "Enable code folding"}
          title={showFolding ? "Disable code folding (Ctrl/⌘+Alt+F)" : "Enable code folding (Ctrl/⌘+Alt+F)"}
        >
          <IconFolding
            isEnabled={showFolding}
            accentColor={ACCENT_COLOR}
            status={status}
            size={size}
          />
          <VisuallyHidden>
            {showFolding ? "Disable code folding" : "Enable code folding"}
          </VisuallyHidden>
        </ActionButton>
      </RadixToolbar.Button>
    </>
  );
}

FoldingToggle.displayName = "FoldingToggle";
