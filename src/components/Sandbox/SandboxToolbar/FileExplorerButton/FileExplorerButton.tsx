"use client";

import type { JSX } from "react";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import IconFolder from "@/icons/IconFolder";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import type { FileExplorerButtonProps } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.types";

// The explorer starts closed so code gets the room; this brings it back for multi-file sandboxes.
export default function FileExplorerButton({ size = 14 }: FileExplorerButtonProps): JSX.Element {
  const { showFileExplorer, toggleFileExplorer } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();

  return (
    <>
      <ActionButton
        type="button"
        data-active={showFileExplorer}
        aria-pressed={showFileExplorer}
        aria-label={
          showFileExplorer ? "Hide file explorer" : "Show file explorer"
        }
        title={showFileExplorer ? "Hide file explorer (Ctrl/⌘+Shift+E)" : "Show file explorer (Ctrl/⌘+Shift+E)"}
        onClick={toggleFileExplorer}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <IconFolder isOpen={showFileExplorer} status={status} size={size} />
        <VisuallyHidden>
          {showFileExplorer ? "Hide file explorer" : "Show file explorer"}
        </VisuallyHidden>
      </ActionButton>
    </>
  );
}

FileExplorerButton.displayName = "FileExplorerButton";
