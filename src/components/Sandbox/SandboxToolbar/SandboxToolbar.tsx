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
  A real role="toolbar" for arrow-key navigation. Buttons are grouped by what they act on — the
  active file, the whole embed, or finding other actions — rather than visual balance. Niche
  settings skip a button and live behind shortcuts and the command palette, so the row doesn't
  grow unbounded.
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
