import { Compartment, type Extension } from "@codemirror/state";

// A Compartment so wrapping can be switched on and off at runtime.
export const wordWrapCompartment = new Compartment();

// Off by default, matching most code editors' preference for horizontal scroll over wrapped lines.
export const sandboxWordWrapExtensions: Extension[] = [
  wordWrapCompartment.of([])
];
