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
