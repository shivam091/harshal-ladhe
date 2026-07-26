import { addCursorAbove, addCursorBelow } from "@codemirror/commands";
import { EditorState, type Extension } from "@codemirror/state";
import { drawSelection, EditorView, keymap } from "@codemirror/view";

/*
  Multicursor — VS Code/Sublime-style "select next occurrence" (Mod-d) + Cmd/Ctrl-click to add a
  cursor. Both bindings already exist elsewhere; allowMultipleSelections is the one thing missing.
  drawSelection is also bundled in since the native caret can only ever render one cursor.
*/

/*
  drawSelection's baseTheme hardcodes .cm-cursor to a plain black/#ddd border — this non-base
  theme wins without !important, matching var(--color-fg-default) used elsewhere in the editor.
*/
const cursorColorTheme = EditorView.theme({
  ".cm-cursor, .cm-cursor-primary, .cm-cursor-secondary": {
    borderLeftColor: "var(--color-fg-default)"
  }
});

/*
  Extra binding for addCursorAbove/addCursorBelow alongside CodeMirror's own default
  (Mod-Alt-ArrowUp/Down, from @codemirror/commands' defaultKeymap) — Ctrl+Alt+Up/Down is claimed
  by GNOME's default workspace-switching shortcuts on Linux (and Shift+Ctrl+Alt+Up/Down for
  move-window-to-workspace), intercepted at the OS level before the browser ever sees the key.
  Mod-Shift-ArrowUp/Down isn't reserved by GNOME or macOS (whose own Mission Control/App Windows
  bindings are plain Ctrl-Up/Down, no Shift), so it works as a fallback on every platform.
*/
const addCursorKeymap = keymap.of([
  { key: "Mod-Shift-ArrowUp", run: addCursorAbove },
  { key: "Mod-Shift-ArrowDown", run: addCursorBelow }
]);

export const sandboxMulticursorExtensions: Extension[] = [
  EditorState.allowMultipleSelections.of(true),
  drawSelection(),
  cursorColorTheme,
  addCursorKeymap
];
