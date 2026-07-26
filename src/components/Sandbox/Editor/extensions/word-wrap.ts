import { Compartment, type Extension } from "@codemirror/state";

/*
  Off by default, matching most code editors' preference for horizontal scroll over wrapped lines.
*/
export const wordWrapCompartment = new Compartment();

export const sandboxWordWrapExtensions: Extension[] = [
  wordWrapCompartment.of([])
];
