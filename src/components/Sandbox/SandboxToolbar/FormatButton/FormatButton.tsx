"use client";

import { JSX } from "react";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import { useActiveCode, useSandpack } from "@codesandbox/sandpack-react";
import { usePreviewClientContext } from "@/hooks/use-preview-client-context";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { useBoop } from "@/hooks/use-boop";
import { formatCode, isFormattable } from "@/lib/prettier-format";
import IconFormat from "@/icons/IconFormat";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { ACCENT_COLOR } from "@/components/Sandbox/SandboxToolbar/constants";
import type { FormatButtonProps } from "@/interfaces/sandbox";

/*
  Toolbar button that formats the active file with Prettier, animated via IconFormat's sparkle
  burst. Reruns the preview after so stale iframe state doesn't linger post-reformat.
*/
export default function FormatButton({ size = 14 }: FormatButtonProps): JSX.Element {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const { refresh } = usePreviewClientContext();
  const { readOnly } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } =
    useToggleIconStatus();
  const [isFormatting, triggerFormat] = useBoop();

  const formattable = !readOnly && isFormattable(sandpack.activeFile);

  async function handleClick() {
    if (!formattable) return;

    triggerFormat();
    try {
      const formatted = await formatCode(code, sandpack.activeFile);
      updateCode(formatted);
      refresh();
    } catch (error) {
      console.error(`Could not format "${sandpack.activeFile}" with Prettier:`, error);
    }
  }

  return (
    <>
      <RadixToolbar.Button asChild>
        <ActionButton
          type="button"
          onClick={handleClick}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          disabled={!formattable}
          aria-label="Format code with Prettier"
          title={
            formattable
              ? "Format code with Prettier (Shift+Alt+F)"
              : readOnly
                ? "Editing is disabled in read-only mode"
                : "Formatting isn't supported for this file type"
          }
        >
          <IconFormat
            status={status}
            isFormatting={isFormatting}
            accentColor={ACCENT_COLOR}
            size={size}
          />
          <VisuallyHidden>Format code with Prettier</VisuallyHidden>
        </ActionButton>
      </RadixToolbar.Button>
    </>
  );
}

FormatButton.displayName = "FormatButton";
