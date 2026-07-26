import { addCursorAbove, addCursorBelow } from "@codemirror/commands";
import { EditorState, type Extension } from "@codemirror/state";
import { drawSelection, EditorView, keymap } from "@codemirror/view";

// drawSelection's baseTheme hardcodes a black/#ddd caret; a non-base theme re-themes it without !important.
const cursorColorTheme = EditorView.theme({
  ".cm-cursor, .cm-cursor-primary, .cm-cursor-secondary": {
    borderLeftColor: "var(--color-fg-default)"
  }
});

/*
  Fallback for CodeMirror's default Mod-Alt-ArrowUp/Down, which GNOME claims for workspace switching
  before the browser sees it; Mod-Shift-ArrowUp/Down is free on Linux and macOS alike.
*/
const addCursorKeymap = keymap.of([
  { key: "Mod-Shift-ArrowUp", run: addCursorAbove },
  { key: "Mod-Shift-ArrowDown", run: addCursorBelow }
]);

/*
  VS Code-style multicursor: Mod-d and Cmd/Ctrl-click are already bound, so only
  allowMultipleSelections is missing; drawSelection because the native caret renders one cursor.
*/
export const sandboxMulticursorExtensions: Extension[] = [
  EditorState.allowMultipleSelections.of(true),
  drawSelection(),
  cursorColorTheme,
  addCursorKeymap
];
