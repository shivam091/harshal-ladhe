"use client";

import { JSX } from "react";
import { UnstyledOpenInCodeSandboxButton } from "@codesandbox/sandpack-react";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import VisuallyHidden from "@/components/VisuallyHidden";
import IconExternalLink from "@/icons/IconExternalLink";
import ActionButton from "@/components/Sandbox/Toolbar/ActionButton";
import type { OpenInCodeSandboxButtonProps } from "@/interfaces/sandbox";

// Icon stroke colour on hover — matches the toolbar's own accent token.
const ACCENT_COLOR = "var(--color-fg-accent)";

/*
  Opens the sandbox in a new CodeSandbox tab. Renders ActionButton as Sandpack's own
  UnstyledOpenInCodeSandboxButton, which already handles the click and hover tooltip.

  data-sandbox-action lets useSandboxShortcuts trigger this via Ctrl/Cmd+Alt+O by clicking this
  element's own DOM node — Sandpack exposes no hook for the underlying action.
*/
export default function OpenInCodeSandboxButton({ size = 12 }: OpenInCodeSandboxButtonProps): JSX.Element {
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();

  return (
    <>
      <ActionButton
        as={UnstyledOpenInCodeSandboxButton}
        data-sandbox-action="open-in-codesandbox"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        aria-label="Open in CodeSandbox"
      >
        <IconExternalLink
          status={status}
          accentColor={ACCENT_COLOR}
          size={size}
        />
        <VisuallyHidden>Open in CodeSandbox</VisuallyHidden>
      </ActionButton>
    </>
  );
}

OpenInCodeSandboxButton.displayName = "OpenInCodeSandboxButton";
