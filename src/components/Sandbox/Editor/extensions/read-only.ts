import { Compartment, EditorState, type Extension } from "@codemirror/state";

/*
  Read-only mode — blocks user-originated edit transactions (typing, paste, drop, IME) via
  EditorState.readOnly alone.
*/
export const sandboxReadOnlyCoreExtension: Extension = [
  EditorState.readOnly.of(true)
];

/*
  Reconfigured by SandboxCodeEditor (driven by SandboxUIContext's readOnly flag) to
  sandboxReadOnlyCoreExtension or [] at runtime.
*/
export const readOnlyCompartment = new Compartment();

export const sandboxReadOnlyExtensions: Extension[] = [
  readOnlyCompartment.of([])
];
