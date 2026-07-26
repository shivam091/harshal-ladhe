import type { ReactNode } from "react";
import type { SandpackError, SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import type { SandboxEnvironment } from "@codesandbox/sandpack-react";
import type { Extension } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import type {
  ConsoleLogMethod,
  PluginModule,
  PreviewPanelTab,
  SandboxFiles
} from "@/types/sandbox";
import type { SplitPaneDirection } from "@/types/split-pane";
import type { SandboxTabSize, SandboxIndentStyle } from "@/components/Sandbox/Editor/extensions/tab-size";

// Static metadata for one runnable sandbox example — resolved server-side from its slug.
export interface SandboxMeta {
  slug: string;
  title: string;
  description: string;
  template: "react-ts" | "react" | "vanilla-ts" | "vanilla";
  entry: string;
}

// Props for the <Sandbox> MDX component — everything an author can configure per embed.
export interface SandboxProps {
  slug: string;
  height?: number;
  editorWidthPercentage?: number;
  // Runtime-toggleable via its own toolbar button; just seeds the initial state. Defaults to true.
  defaultShowLineNumbers?: boolean;
  /*
    Forces the split layout to start stacked ("vertical") or side-by-side ("horizontal") instead
    of the usual viewport-width-driven default — still runtime-toggleable via the layout cycle
    shortcut/button afterward. Omit (or null) for the normal responsive default.
  */
  defaultLayout?: SplitPaneDirection | null;
  /*
    Locks the sandbox to view-only: the CodeMirror instance itself refuses edits, FormatButton/
    ResetButton (and their command-palette/keyboard-shortcut equivalents) are disabled, and a
    "Read-only" badge appears over the editor's bottom-right corner. Every visual-only toggle
    (line numbers, folding, syntax highlighting, minimap, etc.) stays fully functional — this only
    gates actions that would mutate code. Not runtime-toggleable; an author-set embed flag. Off by
    default.
  */
  readOnly?: boolean;
}

/*
  One resolved console call from the sandboxed iframe — id keys the React list, method drives
  color/styling, data holds the raw logged arguments (strings, objects, numbers, etc).
*/
export interface ConsoleLogEntry {
  id: string;
  method: ConsoleLogMethod;
  data: unknown[];
}

/*
  Snapshot of the code editor's primary cursor and current selection, 1-based like every other
  editor status bar (Ln/Col start at 1, not 0).
*/
export interface EditorCursorInfo {
  line: number;
  column: number;
  // 0 when nothing is selected.
  selectedChars: number;
  // 0 when nothing is selected; 1 for a selection within a single line; >1 for a multi-line span.
  selectedLines: number;
  // CodeMirror supports multiple simultaneous cursors/selections (Alt-click, Cmd+D, etc).
  selectionCount: number;
}

/*
  Matches @codesandbox/sandpack-react's internal CodeMirrorRef shape (not exported from the
  package root, only from an internal subpath) — declared locally to avoid a deep import.
*/
export interface CodeMirrorHandle {
  getCodemirror: () => EditorView | undefined;
}

// Props for SandboxCodeEditor — the CodeMirror-backed editor pane wrapping SandpackCodeEditor.
export interface SandboxCodeEditorProps {
  showLineNumbers: boolean;
  showIndentGuides: boolean;
  // Off by default — see SandboxUIProvider.
  showStickyScroll: boolean;
  // Off by default — see SandboxUIProvider.
  showBreadcrumbs: boolean;
  // On by default — see SandboxUIProvider.
  showFolding: boolean;
  // Whether the diff gutter's markers/popup show at all — independent of showLineNumbers, defaults true.
  showDiffGutter?: boolean;
  // Off by default — see SandboxUIProvider. Reconfigured via wordWrapCompartment (see word-wrap.ts).
  showWordWrap: boolean;
  // On by default — see SandboxUIProvider. Reconfigured via minimapCompartment (see minimap.ts).
  showMinimap: boolean;
  // 2 or 4 spaces — see SandboxUIProvider. Reconfigured via tabSizeCompartment (see tab-size.ts).
  tabSize: SandboxTabSize;
  // Soft (spaces) or hard (literal tab character) indentation — see SandboxUIProvider. Reconfigured via tabSizeCompartment alongside tabSize (see tab-size.ts).
  indentStyle: SandboxIndentStyle;
  // Drives a forced CodeMirror remeasure on change — see SandboxCodeEditor's fontSize effect for why.
  fontSize: number;
  // Author-set via SandboxUIProvider's readOnly prop — see SandboxProps.readOnly. Reconfigured via readOnlyCompartment (see read-only.ts).
  readOnly: boolean;
  extensions: Extension[];
  style?: React.CSSProperties;
  // Reports Ln/Col + selection stats for the footer — omit to skip cursor tracking entirely.
  onCursorChange?: (info: EditorCursorInfo) => void;
  // Original (pre-edit) file tree, keyed the same way as Sandpack's own files — read by the diff gutter to mark changed lines.
  originalFiles?: SandboxFiles;
}

// Props for EditorMetaBar — the status bar under the editor column.
export interface EditorMetaBarProps {
  cursorInfo: EditorCursorInfo | null;
}

// Props for MetaBar — the thin status bar shared by the editor and preview columns.
export interface MetaBarProps {
  children?: ReactNode;
}

// Props for Console — the plain-text console output panel.
export interface ConsoleProps {
  logs: ConsoleLogEntry[];
}

// Props for Log — one rendered console entry.
export interface LogProps {
  entry: ConsoleLogEntry;
}

// Props for PreviewErrorOverlay — the compile/runtime error screen over the preview iframe.
export interface PreviewErrorOverlayProps {
  error: SandpackError | null;
  onRestart: () => void;
}

// Props for PreviewLoadingOverlay — the bundler-startup/progress screen over the preview iframe.
export interface PreviewLoadingOverlayProps {
  isLoading: boolean;
  message: string | null;
}

// Props for PreviewPanel — the output/console/diff tabbed pane.
export interface PreviewPanelProps {
  height: number | string;
  // Original (pre-edit) file tree — threaded through to DiffView, same as SandboxCodeEditor's own originalFiles.
  originalFiles?: SandboxFiles;
}

// Props for DiffView — the Diff tab's full-file, contextual unified-diff readout.
export interface DiffViewProps {
  // Original (pre-edit) file tree, keyed the same way as Sandpack's own files — diffed against the active file's current content.
  originalFiles?: SandboxFiles;
}

/*
  Value exposed by PreviewClientContext — bridges the custom preview client (see
  use-preview-client.ts) to components that need it without a parent/child relationship.
*/
export interface PreviewClientContextValue {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  error: SandpackError | null;
  logs: ConsoleLogEntry[];
  clearLogs: () => void;
  refresh: () => void;
  /*
    For the reset button specifically — see use-preview-client.ts's requestReset() for why a
    plain refresh() right after resetAllFiles() can't be used to reliably rerun the reset code.
  */
  requestReset: () => void;
  isLoading: boolean;
  loadingMessage: string | null;
  /*
    Timing stats surfaced in PreviewPanel's metadata bar (see use-preview-client.ts for what each
    measures) — initDurationMs is set once, lastUpdateDurationMs updates every recompile after.
  */
  initDurationMs: number | null;
  lastUpdateDurationMs: number | null;
}

/*
  Options for the usePreviewClient hook — the iframe to attach to, and the files/environment to
  bootstrap and keep it in sync with.
*/
export interface UsePreviewClientOptions {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  files: SandpackBundlerFiles;
  environment: SandboxEnvironment | undefined;
}

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

// Props for WordWrapToggle — the toolbar toggle for the editor's line-wrapping behavior.
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

/*
  One entry in the command palette's action list — `keywords` widen fuzzy-match beyond `label`
  (e.g. matching "print margin" to the ruler toggle) without cluttering the visible label.
*/
export interface CommandPaletteAction {
  id: string;
  label: string;
  keywords?: string[];
  // Platform-variant key combos, shown as a hint alongside the label — omitted when the action has no bound shortcut.
  shortcut?: string[];
  run: () => void;
}

/*
  One shortcut row — `keys` holds one chip-group per platform variant actually bound (a single
  entry when the combo is identical across platforms); `note` is optional trailing text for a
  secondary combo that isn't worth its own chip (e.g. "or Ctrl+Y").
*/
export interface SandboxKeyboardShortcut {
  description: string;
  keys: string[];
  note?: string;
}

/*
  A titled group of related shortcuts (e.g. "Search", "Code folding") shown together in the
  shortcuts reference modal.
*/
export interface SandboxKeyboardShortcutGroup {
  title: string;
  shortcuts: SandboxKeyboardShortcut[];
}

// Props for SandboxClientBody — everything below the Sandpack/UI/PreviewClient provider setup.
export interface SandboxClientBodyProps {
  meta: SandboxMeta;
  // Original (pre-edit) file tree — threaded down to SandboxCodeEditor's originalFiles for the diff gutter.
  files: SandboxFiles;
  height: number;
  editorWidthPercentage: number;
}

/*
  Value exposed by SandboxUIContext — the file-explorer/line-numbers/indent-guides toggle state
  shared between SandboxClient itself and the toolbar's own FileExplorerButton/LineNumbersToggle/
  IndentGuidesToggle, plus the output/console active tab (shared with PreviewPanel) and the manual
  split-layout override (shared with SandboxClientBody) — all state that a keyboard shortcut needs
  to reach from outside the component that would otherwise own it locally.
*/
export interface SandboxUIContextValue {
  showFileExplorer: boolean;
  toggleFileExplorer: () => void;
  showLineNumbers: boolean;
  toggleLineNumbers: () => void;
  // Off by default — see SandboxUIProvider.
  showIndentGuides: boolean;
  toggleIndentGuides: () => void;
  // Off by default — see SandboxUIProvider.
  showStickyScroll: boolean;
  toggleStickyScroll: () => void;
  // Off by default — see SandboxUIProvider.
  showBreadcrumbs: boolean;
  toggleBreadcrumbs: () => void;
  // On by default, unlike the other editor-view toggles above — see SandboxUIProvider.
  showFolding: boolean;
  toggleFolding: () => void;
  // Whether the diff gutter's markers/popup show at all, independent of whether the active file actually has any changes.
  showDiffGutter: boolean;
  toggleDiffGutter: () => void;
  // Off by default — see SandboxUIProvider.
  showWordWrap: boolean;
  toggleWordWrap: () => void;
  // On by default, matching VS Code's own default — see SandboxUIProvider.
  showMinimap: boolean;
  toggleMinimap: () => void;
  // 2 spaces by default, matching CodeMirror's own indentUnit default — see SandboxUIProvider.
  tabSize: SandboxTabSize;
  toggleTabSize: () => void;
  // Soft tabs (spaces) by default, matching CodeMirror's own indentUnit default — see SandboxUIProvider.
  indentStyle: SandboxIndentStyle;
  toggleIndentStyle: () => void;
  // Whether the Diff tab renders old/new side by side instead of one flattened readout — off by default (unified), see SandboxUIProvider.
  showSplitDiffView: boolean;
  toggleSplitDiffView: () => void;
  // Whether the Diff tab's diffing ignores whitespace-only differences (matching `git diff -w`) — off by default, see SandboxUIProvider.
  hideWhitespaceDiff: boolean;
  toggleHideWhitespaceDiff: () => void;
  // Editor + gutter font size in px, clamped between SandboxUIProvider's min/max.
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  // Restores fontSize to its starting default (see SandboxUIProvider).
  resetFontSize: () => void;
  // Whether increase/decreaseFontSize would actually change fontSize — lets the toolbar buttons disable at the clamped bounds instead of silently no-oping.
  canIncreaseFontSize: boolean;
  canDecreaseFontSize: boolean;
  // Whether fontSize is already at its default — lets ResetFontSizeButton disable instead of offering a no-op reset.
  canResetFontSize: boolean;
  activeTab: PreviewPanelTab;
  setActiveTab: (tab: PreviewPanelTab) => void;
  // null = automatic (viewport-driven via SplitPane's mobileBreakpoint); otherwise a forced direction that overrides it.
  layoutOverride: SplitPaneDirection | null;
  // Cycles null -> "vertical" -> "horizontal" -> null, so there's always a way back to the responsive default.
  cycleLayoutOverride: () => void;
  // The Fullscreen API's target — FullscreenToggle/SandboxWrapper share it since neither renders the other.
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  // Same DOM node as wrapperRef, but as reactive state — for consumers (CommandPaletteButton, KeyboardShortcutsButton) that need it as a value during render, e.g. a Dialog's portal container.
  wrapperEl: HTMLDivElement | null;
  // Attach as SandboxWrapper's own `ref` in place of wrapperRef directly — keeps wrapperRef.current and wrapperEl in sync from one attach point.
  wrapperRefCallback: (node: HTMLDivElement | null) => void;
  // Whether SandboxWrapper currently fills the viewport via the Fullscreen API.
  showFullscreen: boolean;
  toggleFullscreen: () => void;
  // Whether the command palette dialog is open — read by CommandPaletteButton, toggled by useSandboxShortcuts' Ctrl/Cmd+K binding.
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  /*
    Author-set embed flag (see SandboxProps.readOnly) — not locally toggleable, so unlike every
    other flag above there's no matching toggle/setter here. Read by SandboxCodeEditor (to
    reconfigure readOnlyCompartment), FormatButton/ResetButton/CommandPaletteButton (to disable
    the actions that mutate code), useSandboxShortcuts (to gate the same actions' key combos), and
    SandboxClientBody (to render the "Read-only" badge).
  */
  readOnly: boolean;
}

// Props for SandboxUIProvider — seeds the initial line-numbers visibility.
export interface SandboxUIProviderProps {
  defaultShowLineNumbers: boolean;
  // Seeds layoutOverride — null (the default) leaves the initial layout to the responsive viewport-width check.
  defaultLayout?: SplitPaneDirection | null;
  // Straight passthrough into SandboxUIContextValue.readOnly — see SandboxProps.readOnly. Defaults to false.
  readOnly?: boolean;
  children: ReactNode;
}

/*
  Parser name plus the plugin bundle it needs, loaded lazily so formatting a .css file never
  pulls in the (much larger) JS/TS parsers, and vice versa.
*/
export interface ParserEntry {
  parser: string;
  loadPlugins: () => Promise<PluginModule[]>;
}
