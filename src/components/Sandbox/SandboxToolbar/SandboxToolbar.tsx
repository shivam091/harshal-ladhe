"use client";

import * as RadixToolbar from "@radix-ui/react-toolbar";
import { rootClass, separatorClass } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.styles";
import FileExplorerButton from "@/components/Sandbox/SandboxToolbar/FileExplorerButton";
import FormatButton from "@/components/Sandbox/SandboxToolbar/FormatButton";
import ResetButton from "@/components/Sandbox/SandboxToolbar/ResetButton";
import LineNumbersToggle from "@/components/Sandbox/SandboxToolbar/LineNumbersToggle";
import OpenInCodeSandboxButton from "@/components/Sandbox/SandboxToolbar/OpenInCodeSandboxButton";
import KeyboardShortcutsButton from "@/components/Sandbox/SandboxToolbar/KeyboardShortcutsButton";

// Icon size for every toolbar button, set once here so each button stays reusable at other sizes elsewhere.
const TOOLBAR_ICON_SIZE = 16;

/*
  Sandbox header toolbar — every button is always present for every sandbox; FileExplorerButton/
  LineNumbersToggle/etc. read their own open/closed state from SandboxUIContext directly. Root is
  Radix's Toolbar.Root, so this row is a real role="toolbar" with arrow-key roving-tabindex across
  every button below.

  Buttons are split into two groups by a Toolbar.Separator: editor actions (format, line
  numbers — act on the active file's code) on the start side, sandbox actions (file explorer,
  reset, open in CodeSandbox, keyboard shortcuts — act on the whole embed) on the end side.
*/
export default function SandboxToolbar() {
  return (
    <>
      <RadixToolbar.Root className={rootClass}>
        <FormatButton size={TOOLBAR_ICON_SIZE} />
        <LineNumbersToggle size={TOOLBAR_ICON_SIZE} />

        <RadixToolbar.Separator className={separatorClass} />

        <FileExplorerButton size={TOOLBAR_ICON_SIZE} />
        <ResetButton size={TOOLBAR_ICON_SIZE} />
        <OpenInCodeSandboxButton size={TOOLBAR_ICON_SIZE} />
        <KeyboardShortcutsButton size={TOOLBAR_ICON_SIZE} />
      </RadixToolbar.Root>
    </>
  );
}

SandboxToolbar.displayName = "SandboxToolbar";
