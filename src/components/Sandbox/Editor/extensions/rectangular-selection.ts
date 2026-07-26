import type { Extension } from "@codemirror/state";
import { crosshairCursor, rectangularSelection } from "@codemirror/view";

/*
  Alt-drag column selection, VS Code/Sublime-style; crosshairCursor swaps the pointer so the mode
  is visible.
*/
export const sandboxRectangularSelectionExtensions: Extension[] = [
  rectangularSelection(),
  crosshairCursor()
];
