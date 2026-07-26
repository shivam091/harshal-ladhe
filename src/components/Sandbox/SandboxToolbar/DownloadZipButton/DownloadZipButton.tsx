"use client";

import type { JSX} from "react";
import { useState } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import IconDownload from "@/icons/IconDownload";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { downloadSandboxZip } from "@/lib/sandbox/zip";
import { trackEvent } from "@/lib/analytics";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { ACCENT_COLOR } from "@/components/Sandbox/SandboxToolbar/constants";
import type { DownloadZipButtonProps } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.types";

// Includes unsaved edits so readers can take their experiment with them.
export default function DownloadZipButton({ size = 14 }: DownloadZipButtonProps): JSX.Element {
  const { sandpack } = useSandpack();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();
  const [isZipping, setIsZipping] = useState(false);
  const { slug } = useSandboxUIContext();

  async function handleDownload() {
    setIsZipping(true);
    try {
      await downloadSandboxZip(sandpack.files);
      trackEvent("sandbox_download", { event_label: slug, method: "button" });
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
