"use client";

import { JSX } from "react";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import { UnstyledOpenInCodeSandboxButton } from "@codesandbox/sandpack-react";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import VisuallyHidden from "@/components/VisuallyHidden";
import IconExternalLink from "@/icons/IconExternalLink";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { ACCENT_COLOR } from "@/components/Sandbox/SandboxToolbar/constants";
import type { OpenInCodeSandboxButtonProps } from "@/interfaces/sandbox";

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
      <RadixToolbar.Button asChild>
        <ActionButton
          as={UnstyledOpenInCodeSandboxButton}
          data-sandbox-action="open-in-codesandbox"
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          aria-label="Open in CodeSandbox"
          title="Open in CodeSandbox (Ctrl/⌘+Alt+O)"
        >
          <IconExternalLink
            status={status}
            accentColor={ACCENT_COLOR}
            size={size}
          />
          <VisuallyHidden>Open in CodeSandbox</VisuallyHidden>
        </ActionButton>
      </RadixToolbar.Button>
    </>
  );
}

OpenInCodeSandboxButton.displayName = "OpenInCodeSandboxButton";
