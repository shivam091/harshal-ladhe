"use client";

import * as RadixToolbar from "@radix-ui/react-toolbar";
import { rootClass, separatorClass } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.styles";
import FileExplorerButton from "@/components/Sandbox/SandboxToolbar/FileExplorerButton";
import FormatButton from "@/components/Sandbox/SandboxToolbar/FormatButton";
import ResetButton from "@/components/Sandbox/SandboxToolbar/ResetButton";
import LineNumbersToggle from "@/components/Sandbox/SandboxToolbar/LineNumbersToggle";
import WordWrapToggle from "@/components/Sandbox/SandboxToolbar/WordWrapToggle";
import MinimapToggle from "@/components/Sandbox/SandboxToolbar/MinimapToggle";
import IndentGuidesToggle from "@/components/Sandbox/SandboxToolbar/IndentGuidesToggle";
import FoldingToggle from "@/components/Sandbox/SandboxToolbar/FoldingToggle";
import DiffGutterToggle from "@/components/Sandbox/SandboxToolbar/DiffGutterToggle";
import DecreaseFontSizeButton from "@/components/Sandbox/SandboxToolbar/DecreaseFontSizeButton";
import ResetFontSizeButton from "@/components/Sandbox/SandboxToolbar/ResetFontSizeButton";
import IncreaseFontSizeButton from "@/components/Sandbox/SandboxToolbar/IncreaseFontSizeButton";
import OpenInCodeSandboxButton from "@/components/Sandbox/SandboxToolbar/OpenInCodeSandboxButton";
import KeyboardShortcutsButton from "@/components/Sandbox/SandboxToolbar/KeyboardShortcutsButton";
import FullscreenToggle from "@/components/Sandbox/SandboxToolbar/FullscreenToggle";
import DownloadZipButton from "@/components/Sandbox/SandboxToolbar/DownloadZipButton";
import CommandPaletteButton from "@/components/Sandbox/SandboxToolbar/CommandPaletteButton";

// Icon size for every toolbar button, set once here so each button stays reusable at other sizes elsewhere.
const TOOLBAR_ICON_SIZE = 16;

/*
  Sandbox header toolbar — every button is always present for every sandbox; FileExplorerButton/
  LineNumbersToggle/etc. read their own open/closed state from SandboxUIContext directly. Root is
  Radix's Toolbar.Root, so this row is a real role="toolbar" with arrow-key roving-tabindex across
  every button below.

  Buttons are split into three groups by two Toolbar.Separators, by what a button actually acts
  on rather than just visual balance:

    1. Editor actions (format, line numbers, word wrap, minimap, indent guides, code folding,
       diff markers, font size) — everything that reads/writes the active file's own code or view.
    2. Sandbox actions (file explorer, reset, fullscreen, download as .zip, open in CodeSandbox) —
       everything that acts on the whole embed (every file, the viewport, an export of the lot)
       rather than just the file currently open.
    3. Meta (command palette, keyboard shortcuts) — tools for finding/learning the other actions,
       not actions on the sandbox themselves, so they don't belong in either group above.

  Tab size, indent style, sticky rows, and breadcrumbs are niche/opt-in enough to skip a dedicated
  button — Ctrl/Cmd+Alt shortcut or the command palette (both listed in KeyboardShortcutsButton's
  modal) reach them instead, keeping this row from growing unbounded.
*/
export default function SandboxToolbar() {
  return (
    <>
      <RadixToolbar.Root className={rootClass}>
        <FormatButton size={TOOLBAR_ICON_SIZE} />
        <LineNumbersToggle size={TOOLBAR_ICON_SIZE} />
        <WordWrapToggle size={TOOLBAR_ICON_SIZE} />
        <MinimapToggle size={TOOLBAR_ICON_SIZE} />
        <IndentGuidesToggle size={TOOLBAR_ICON_SIZE} />
        <FoldingToggle size={TOOLBAR_ICON_SIZE} />
        <DiffGutterToggle size={TOOLBAR_ICON_SIZE} />
        <DecreaseFontSizeButton size={TOOLBAR_ICON_SIZE} />
        <ResetFontSizeButton size={TOOLBAR_ICON_SIZE} />
        <IncreaseFontSizeButton size={TOOLBAR_ICON_SIZE} />

        <RadixToolbar.Separator className={separatorClass} />

        <FileExplorerButton size={TOOLBAR_ICON_SIZE} />
        <ResetButton size={TOOLBAR_ICON_SIZE} />
        <FullscreenToggle size={TOOLBAR_ICON_SIZE} />
        <DownloadZipButton size={TOOLBAR_ICON_SIZE} />
        <OpenInCodeSandboxButton size={TOOLBAR_ICON_SIZE} />

        <RadixToolbar.Separator className={separatorClass} />

        <CommandPaletteButton size={TOOLBAR_ICON_SIZE} />
        <KeyboardShortcutsButton size={TOOLBAR_ICON_SIZE} />
      </RadixToolbar.Root>
    </>
  );
}

SandboxToolbar.displayName = "SandboxToolbar";
