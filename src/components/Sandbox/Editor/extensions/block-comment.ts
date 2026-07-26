import { toggleBlockComment } from "@codemirror/commands";
import type { Extension } from "@codemirror/state";
import { keymap, type KeyBinding } from "@codemirror/view";

/*
  Extra binding for toggleBlockComment alongside CodeMirror's own default (Shift-Alt-a, from
  @codemirror/commands' defaultKeymap) — Alt-based combos are a common target for browser/extension
  shortcuts (e.g. a "search tabs" command assigned via chrome://extensions/shortcuts), which
  intercept the key at the browser-chrome level before the page ever sees it. Mod-Shift-/ isn't
  claimed by any other binding in this editor, so it works as a fallback regardless of what the
  browser or its extensions have claimed.
*/
const blockCommentKeymap: readonly KeyBinding[] = [
  { key: "Mod-Shift-/", run: toggleBlockComment }
];

export const sandboxBlockCommentExtensions: Extension[] = [keymap.of(blockCommentKeymap)];
