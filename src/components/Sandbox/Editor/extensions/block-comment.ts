import { toggleBlockComment } from "@codemirror/commands";
import type { Extension } from "@codemirror/state";
import { keymap, type KeyBinding } from "@codemirror/view";

/*
  Fallback for CodeMirror's default Shift-Alt-a, since Alt combos are often claimed by browser
  extensions before the page sees them; Mod-Shift-/ is unclaimed in this editor.
*/
const blockCommentKeymap: readonly KeyBinding[] = [
  { key: "Mod-Shift-/", run: toggleBlockComment }
];

// Added alongside the default keymap rather than replacing it, so both bindings work.
export const sandboxBlockCommentExtensions: Extension[] = [keymap.of(blockCommentKeymap)];
