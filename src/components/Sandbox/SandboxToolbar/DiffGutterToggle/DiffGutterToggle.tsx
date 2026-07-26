"use client";

import { JSX } from "react";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import IconDiffGutter from "@/icons/IconDiffGutter";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import type { DiffGutterToggleProps } from "@/interfaces/sandbox";

// Icon stroke colour while diff markers are shown.
const ACCENT_COLOR = "var(--color-fg-accent)";

// Toolbar button that toggles the editor's diff gutter (changed-line markers + popup), animated via IconDiffGutter.
export default function DiffGutterToggle({ size = 14 }: DiffGutterToggleProps): JSX.Element {
  const { showDiffGutter, toggleDiffGutter } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();

  return (
    <>
      <RadixToolbar.Button asChild>
        <ActionButton
          type="button"
          onClick={toggleDiffGutter}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          aria-pressed={showDiffGutter}
          aria-label={showDiffGutter ? "Hide diff markers" : "Show diff markers"}
          title={showDiffGutter ? "Hide diff markers (Ctrl/⌘+Alt+U)" : "Show diff markers (Ctrl/⌘+Alt+U)"}
        >
          <IconDiffGutter
            isEnabled={showDiffGutter}
            accentColor={ACCENT_COLOR}
            status={status}
            size={size}
          />
          <VisuallyHidden>
            {showDiffGutter ? "Hide diff markers" : "Show diff markers"}
          </VisuallyHidden>
        </ActionButton>
      </RadixToolbar.Button>
    </>
  );
}

DiffGutterToggle.displayName = "DiffGutterToggle";
