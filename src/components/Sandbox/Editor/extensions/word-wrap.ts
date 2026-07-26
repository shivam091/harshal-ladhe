import { Compartment, type Extension } from "@codemirror/state";

/*
  Word wrap toggle — reconfigured entirely in/out of state via a Compartment, the same way
  folding.ts's codeFolding()/foldGutter() bundle is. Off by default, matching most code editors'
  (VS Code, Sublime) default of horizontal scroll over wrapped lines.
*/
export const wordWrapCompartment = new Compartment();

export const sandboxWordWrapExtensions: Extension[] = [
  wordWrapCompartment.of([])
];
