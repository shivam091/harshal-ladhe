import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

/*
  Read-only mode — blocks user-originated edit transactions and drops contenteditable. Applied
  directly rather than through Sandpack's own `readOnly` prop, since that forces a render path
  that skips creating a live CodeMirror EditorView and would drop every other extension in this
  folder. Folding, line numbers, and syntax highlighting stay untouched either way.
*/
export const sandboxReadOnlyCoreExtension: Extension = [
  EditorState.readOnly.of(true),
  EditorView.editable.of(false)
];

/*
  Reconfigured by SandboxCodeEditor (driven by SandboxUIContext's readOnly flag) to
  sandboxReadOnlyCoreExtension or [] at runtime.
*/
export const readOnlyCompartment = new Compartment();

export const sandboxReadOnlyExtensions: Extension[] = [
  readOnlyCompartment.of([])
];
