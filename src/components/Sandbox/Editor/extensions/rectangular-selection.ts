import type { Extension } from "@codemirror/state";
import { crosshairCursor, rectangularSelection } from "@codemirror/view";

/*
  Rectangular (column) selection — hold Alt and drag to select a block spanning multiple lines
  at the same column, VS Code/Sublime-style. crosshairCursor swaps the pointer to signal this.
*/

export const sandboxRectangularSelectionExtensions: Extension[] = [
  rectangularSelection(),
  crosshairCursor()
];
