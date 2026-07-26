import type { ReactNode } from "react";
import type { SandpackError } from "@codesandbox/sandpack-client";
import type { Extension } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import type { ConsoleLogMethod, PluginModule, PreviewPanelTab } from "@/types/sandbox";
import type { SplitPaneDirection } from "@/types/split-pane";

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
  // Defaults to false — the file explorer is opt-in per embed.
  defaultShowFileExplorer?: boolean;
  // Static per-embed visibility (no runtime toggle) — all default to true.
  showFormatButton?: boolean;
  showResetButton?: boolean;
  showOpenInSandboxButton?: boolean;
  /*
    Static — hides the "Files" toggle button itself, independent of defaultShowFileExplorer
    (which only seeds the panel's initial open/closed state). Defaults to false.
  */
  showFileExplorerButton?: boolean;
  /*
    Static, no runtime toggle; both default to false — they add permanent editor chrome only
    worth the space in longer/nested examples.
  */
  showBreadcrumbs?: boolean;
  showStickyScroll?: boolean;
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
  closableTabs: boolean;
  showLineNumbers: boolean;
  extensions: Extension[];
  style?: React.CSSProperties;
  // Reports Ln/Col + selection stats for the footer — omit to skip cursor tracking entirely.
  onCursorChange?: (info: EditorCursorInfo) => void;
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

// Props for PreviewPanel — the output/console tabbed pane.
export interface PreviewPanelProps {
  height: number | string;
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
  files: import("@codesandbox/sandpack-client").SandpackBundlerFiles;
  environment:
    import("@codesandbox/sandpack-react").SandboxEnvironment | undefined;
}

// Props for FileExplorerButton — the toolbar toggle for the sandbox's file explorer panel.
export interface FileExplorerButtonProps {
  size?: number;
}

// Props for FormatButton — the toolbar button that formats the active file with Prettier.
export interface FormatButtonProps {
  size?: number;
}

// Props for LineNumbersToggle — the toolbar toggle for the editor's line-number gutter.
export interface LineNumbersToggleProps {
  size?: number;
}

// Props for OpenInCodeSandboxButton — the toolbar button that opens the sandbox in a new tab.
export interface OpenInCodeSandboxButtonProps {
  size?: number;
}

// Props for ResetButton — the click-and-hold toolbar button that resets every file.
export interface ResetButtonProps {
  size?: number;
}

// Props for KeyboardShortcutsButton — the toolbar button that opens the shortcuts reference modal.
export interface KeyboardShortcutsButtonProps {
  size?: number;
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

// Props for Toolbar — assembles the file-explorer/format/reset/line-numbers/open-in-codesandbox buttons.
export interface ToolbarProps {
  showFileExplorerButton: boolean;
  showFormatButton: boolean;
  showResetButton: boolean;
  showOpenInSandboxButton: boolean;
}

// Props for SandboxClientBody — everything below the Sandpack/UI/PreviewClient provider setup.
export interface SandboxClientBodyProps {
  meta: SandboxMeta;
  height: number;
  editorWidthPercentage: number;
  showFormatButton: boolean;
  showResetButton: boolean;
  showOpenInSandboxButton: boolean;
  showFileExplorerButton: boolean;
  showBreadcrumbs: boolean;
  showStickyScroll: boolean;
}

/*
  Value exposed by SandboxUIContext — the file-explorer/line-numbers toggle state shared between
  SandboxClient itself and the toolbar's own FileExplorerButton/LineNumbersToggle, plus the
  output/console active tab (shared with PreviewPanel) and the manual split-layout override
  (shared with SandboxClientBody) — all state that a keyboard shortcut needs to reach from
  outside the component that would otherwise own it locally.
*/
export interface SandboxUIContextValue {
  showFileExplorer: boolean;
  toggleFileExplorer: () => void;
  showLineNumbers: boolean;
  toggleLineNumbers: () => void;
  activeTab: PreviewPanelTab;
  setActiveTab: (tab: PreviewPanelTab) => void;
  // null = automatic (viewport-driven via SplitPane's mobileBreakpoint); otherwise a forced direction that overrides it.
  layoutOverride: SplitPaneDirection | null;
  // Cycles null -> "vertical" -> "horizontal" -> null, so there's always a way back to the responsive default.
  cycleLayoutOverride: () => void;
}

// Props for SandboxUIProvider — seeds the initial file-explorer/line-numbers visibility.
export interface SandboxUIProviderProps {
  defaultShowFileExplorer: boolean;
  defaultShowLineNumbers: boolean;
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
