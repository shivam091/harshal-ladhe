/*
  Shared shape for every icon-only SandboxToolbar button/toggle — all of them only ever accept an
  optional icon `size`, so each component below aliases this instead of declaring its own copy.
*/
export interface SandboxToolbarButtonProps {
  size?: number;
}

// Props for FileExplorerButton — the toolbar toggle for the sandbox's file explorer panel.
export type FileExplorerButtonProps = SandboxToolbarButtonProps;

// Props for FormatButton — the toolbar button that formats the active file with Prettier.
export type FormatButtonProps = SandboxToolbarButtonProps;

// Props for DiffGutterToggle — the toolbar toggle for the editor's diff-marker gutter.
export interface DiffGutterToggleProps {
  size?: number;
}

// Props for LineNumbersToggle — the toolbar toggle for the editor's line-number gutter.
export type LineNumbersToggleProps = SandboxToolbarButtonProps;

// Props for IndentGuidesToggle — the toolbar toggle for the editor's vertical indent-guide lines.
export type IndentGuidesToggleProps = SandboxToolbarButtonProps;

// Props for FoldingToggle — the toolbar toggle for the editor's code-folding gutter/keymap.
export type FoldingToggleProps = SandboxToolbarButtonProps;

// Props for WordWrapToggle — the toolbar toggle for the editor's line-wrapping behaviour.
export type WordWrapToggleProps = SandboxToolbarButtonProps;

// Props for MinimapToggle — the toolbar toggle for the editor's overview-strip minimap.
export type MinimapToggleProps = SandboxToolbarButtonProps;

// Props for OpenInCodeSandboxButton — the toolbar button that opens the sandbox in a new tab.
export type OpenInCodeSandboxButtonProps = SandboxToolbarButtonProps;

// Props for ResetButton — the click-and-hold toolbar button that resets every file.
export type ResetButtonProps = SandboxToolbarButtonProps;

// Props for KeyboardShortcutsButton — the toolbar button that opens the shortcuts reference modal.
export type KeyboardShortcutsButtonProps = SandboxToolbarButtonProps;

// Props for FullscreenToggle — the toolbar toggle that fills the viewport via the Fullscreen API.
export type FullscreenToggleProps = SandboxToolbarButtonProps;

// Props for DownloadZipButton — the toolbar button that downloads every sandbox file as a .zip.
export type DownloadZipButtonProps = SandboxToolbarButtonProps;

// Props for IncreaseFontSizeButton — the toolbar button that steps up the editor/gutter font size.
export type IncreaseFontSizeButtonProps = SandboxToolbarButtonProps;

// Props for DecreaseFontSizeButton — the toolbar button that steps down the editor/gutter font size.
export type DecreaseFontSizeButtonProps = SandboxToolbarButtonProps;

// Props for ResetFontSizeButton — the toolbar button that restores the editor/gutter font size to its default.
export type ResetFontSizeButtonProps = SandboxToolbarButtonProps;

// Props for CommandPaletteButton — the toolbar button (and Cmd/Ctrl+K binding) that opens the command palette.
export type CommandPaletteButtonProps = SandboxToolbarButtonProps;
