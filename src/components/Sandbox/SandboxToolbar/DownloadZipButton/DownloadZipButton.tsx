"use client";

import type { JSX} from "react";
import { useState } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import IconDownload from "@/icons/IconDownload";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { downloadSandboxZip } from "@/lib/sandbox/zip";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { ACCENT_COLOR } from "@/components/Sandbox/SandboxToolbar/constants";
import type { DownloadZipButtonProps } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.types";

// Toolbar button — downloads every current sandbox file (unsaved edits included) as a single .zip.
export default function DownloadZipButton({ size = 14 }: DownloadZipButtonProps): JSX.Element {
  const { sandpack } = useSandpack();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();
  const [isZipping, setIsZipping] = useState(false);

  async function handleDownload() {
    setIsZipping(true);
    try {
      await downloadSandboxZip(sandpack.files);
    } catch (error) {
      console.error("Could not build the sandbox .zip:", error);
    } finally {
      setIsZipping(false);
    }
  }

  return (
    <>
      <ActionButton
        type="button"
        onClick={handleDownload}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        disabled={isZipping}
        aria-label="Download sandbox as .zip"
        title="Download sandbox as .zip (Ctrl/⌘+Alt+Z)"
      >
        <IconDownload status={status} accentColor={ACCENT_COLOR} size={size} />
        <VisuallyHidden>Download sandbox as .zip</VisuallyHidden>
      </ActionButton>
    </>
  );
}

DownloadZipButton.displayName = "DownloadZipButton";
