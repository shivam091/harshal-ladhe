import type { Extension } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import type { EditorCursorInfo } from "@/components/Sandbox/Sandbox.types";
import type { SandboxFiles } from "@/lib/sandbox/sandbox";
import type { SandboxTabSize, SandboxIndentStyle } from "@/components/Sandbox/Editor/extensions/tab-size";

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
  // Off by default.
  showStickyScroll: boolean;
  // Off by default.
  showBreadcrumbs: boolean;
  // On by default.
  showFolding: boolean;
  // Whether the diff gutter's markers/popup show at all — independent of showLineNumbers, defaults true.
  showDiffGutter?: boolean;
  // Off by default.
  showWordWrap: boolean;
  // On by default.
  showMinimap: boolean;
  // 2 or 4 spaces.
  tabSize: SandboxTabSize;
  // Soft (spaces) or hard (literal tab character) indentation.
  indentStyle: SandboxIndentStyle;
  // Changes force a remeasure, since CodeMirror caches its own geometry.
  fontSize: number;
  // Author-set so a sandbox can be view-only.
  readOnly: boolean;
  // Per-file counterpart to `readOnly`, scoped to the active file.
  readOnlyFiles: string[];
  extensions: Extension[];
  style?: React.CSSProperties;
  // Reports Ln/Col + selection stats for the footer — omit to skip cursor tracking entirely.
  onCursorChange?: (info: EditorCursorInfo) => void;
  // Pre-edit files so changed lines can be marked against the original.
  originalFiles?: SandboxFiles;
}
