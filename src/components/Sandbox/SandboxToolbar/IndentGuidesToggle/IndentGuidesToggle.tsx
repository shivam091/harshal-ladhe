"use client";

import type { JSX } from "react";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import IconIndentGuides from "@/icons/IconIndentGuides";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import { ACCENT_COLOR } from "@/components/Sandbox/SandboxToolbar/constants";
import type { IndentGuidesToggleProps } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.types";

// Toolbar button that toggles the editor's vertical indent-guide lines.
export default function IndentGuidesToggle({ size = 14 }: IndentGuidesToggleProps): JSX.Element {
  const { showIndentGuides, toggleIndentGuides } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();

  return (
    <>
      <ActionButton
        type="button"
        onClick={toggleIndentGuides}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        aria-pressed={showIndentGuides}
        aria-label={showIndentGuides ? "Hide indent guides" : "Show indent guides"}
        title={showIndentGuides ? "Hide indent guides (Ctrl/⌘+Alt+I)" : "Show indent guides (Ctrl/⌘+Alt+I)"}
      >
        <IconIndentGuides
          isEnabled={showIndentGuides}
          accentColor={ACCENT_COLOR}
          status={status}
          size={size}
        />
        <VisuallyHidden>
          {showIndentGuides ? "Hide indent guides" : "Show indent guides"}
        </VisuallyHidden>
      </ActionButton>
    </>
  );
}

IndentGuidesToggle.displayName = "IndentGuidesToggle";
