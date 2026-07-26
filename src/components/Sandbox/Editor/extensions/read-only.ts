import { Compartment, EditorState, type Extension } from "@codemirror/state";

/*
  Read-only mode — blocks user-originated edit transactions (typing, paste, drop, IME) via
  EditorState.readOnly alone.
*/
export const sandboxReadOnlyCoreExtension: Extension = [
  EditorState.readOnly.of(true)
];

// A Compartment so read-only can be switched on and off at runtime.
export const readOnlyCompartment = new Compartment();

// Starts empty, so a sandbox is editable unless the embed or active file says otherwise.
export const sandboxReadOnlyExtensions: Extension[] = [
  readOnlyCompartment.of([])
];
