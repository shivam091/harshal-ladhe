"use client";

import { JSX } from "react";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import IconHash from "@/icons/IconHash";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/Toolbar/ActionButton";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import type { LineNumbersToggleProps } from "@/interfaces/sandbox";

// Icon stroke colour while line numbers are shown.
const ACCENT_COLOR = "var(--color-fg-accent)";

// Toolbar button that toggles the editor's line-number gutter, animated via IconHash.
export default function LineNumbersToggle({ size = 14 }: LineNumbersToggleProps): JSX.Element {
  const { showLineNumbers, toggleLineNumbers } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();

  return (
    <>
      <ActionButton
        type="button"
        onClick={toggleLineNumbers}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        aria-pressed={showLineNumbers}
        aria-label={showLineNumbers ? "Hide line numbers" : "Show line numbers"}
        title={showLineNumbers ? "Hide line numbers" : "Show line numbers"}
      >
        <IconHash
          isEnabled={showLineNumbers}
          accentColor={ACCENT_COLOR}
          status={status}
          size={size}
        />
        <VisuallyHidden>
          {showLineNumbers ? "Hide line numbers" : "Show line numbers"}
        </VisuallyHidden>
      </ActionButton>
    </>
  );
}

LineNumbersToggle.displayName = "LineNumbersToggle";
