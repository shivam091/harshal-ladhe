import { Prec, type Extension } from "@codemirror/state";
import { keymap, type KeyBinding } from "@codemirror/view";
import { search, searchKeymap } from "@codemirror/search";
import { SandboxSearchPanel } from "@/components/Sandbox/Editor/extensions/search-panel";
import { sandboxGotoLine } from "@/components/Sandbox/Editor/extensions/goto-line";

/*
  Search & replace — Mod-f opens the panel, Mod-g/Shift-Mod-g step through matches,
  Mod-Shift-l selects every occurrence of the current selection, Mod-Alt-g jumps to a line.
*/

// Swaps in sandboxGotoLine (a themed floating card, see ./goto-line) for the built-in gotoLine
// command, which renders through the generic, largely unstyled showDialog panel.
const sandboxSearchKeymap: readonly KeyBinding[] = searchKeymap.map((binding) =>
  binding.key === "Mod-Alt-g" ? { ...binding, run: sandboxGotoLine } : binding
);

/*
  Prec.high because @codemirror/commands' defaultKeymap already binds Ctrl-d to
  deleteCharForward — the same physical key as Mod-d on Windows/Linux — so this must win the tie.
*/
export const sandboxSearchExtensions: Extension[] = [
  search({ createPanel: (view) => new SandboxSearchPanel(view) }),
  Prec.high(keymap.of(sandboxSearchKeymap))
];
