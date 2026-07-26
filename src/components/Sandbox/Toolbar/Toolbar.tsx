"use client";

import { Root } from "@/components/Sandbox/Toolbar/Toolbar.styles";
import FileExplorerButton from "@/components/Sandbox/Toolbar/FileExplorerButton";
import FormatButton from "@/components/Sandbox/Toolbar/FormatButton";
import ResetButton from "@/components/Sandbox/Toolbar/ResetButton";
import LineNumbersToggle from "@/components/Sandbox/Toolbar/LineNumbersToggle";
import OpenInCodeSandboxButton from "@/components/Sandbox/Toolbar/OpenInCodeSandboxButton";
import KeyboardShortcutsButton from "@/components/Sandbox/Toolbar/KeyboardShortcutsButton";
import type { ToolbarProps } from "@/interfaces/sandbox";

// Icon size for every toolbar button, set once here so each button stays reusable at other sizes elsewhere.
const TOOLBAR_ICON_SIZE = 16;

/*
  Sandbox header toolbar. FileExplorerButton/LineNumbersToggle read their open/closed state
  from SandboxUIContext directly (SandboxClient needs the same state); only each button's
  visibility flag comes from props.
*/
export default function Toolbar({
  showFileExplorerButton,
  showFormatButton,
  showResetButton,
  showOpenInSandboxButton
}: ToolbarProps) {
  return (
    <>
      <Root>
        {showFileExplorerButton && <FileExplorerButton size={TOOLBAR_ICON_SIZE} /> }
        {showFormatButton && <FormatButton size={TOOLBAR_ICON_SIZE} />}
        {showResetButton && <ResetButton size={TOOLBAR_ICON_SIZE} />}
        <LineNumbersToggle size={TOOLBAR_ICON_SIZE} />
        {showOpenInSandboxButton && <OpenInCodeSandboxButton size={TOOLBAR_ICON_SIZE} /> }
        <KeyboardShortcutsButton size={TOOLBAR_ICON_SIZE} />
      </Root>
    </>
  );
}

Toolbar.displayName = "Toolbar";
