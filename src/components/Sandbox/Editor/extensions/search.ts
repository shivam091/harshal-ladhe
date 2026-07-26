import { Prec, type Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { search, searchKeymap } from "@codemirror/search";

/*
  Search & replace — Mod-f opens the panel, Mod-g/Shift-Mod-g step through matches,
  Mod-Shift-l selects every occurrence of the current selection, Mod-Alt-g jumps to a line.
*/

/*
  Prec.high because @codemirror/commands' defaultKeymap already binds Ctrl-d to
  deleteCharForward — the same physical key as Mod-d on Windows/Linux — so this must win the tie.
*/
export const sandboxSearchExtensions: Extension[] = [
  search(),
  Prec.high(keymap.of(searchKeymap))
];
