import { Prec, type Extension } from "@codemirror/state";
import { EditorView, keymap, type KeyBinding } from "@codemirror/view";
import { search, searchKeymap } from "@codemirror/search";
import { SandboxSearchPanel, closeSandboxSearchPanel } from "@/components/Sandbox/Editor/extensions/search-panel";
import { sandboxGotoLine } from "@/components/Sandbox/Editor/extensions/goto-line";

/*
  Search & replace — Mod-f opens the panel, Mod-g/Shift-Mod-g step through matches,
  Mod-Shift-l selects every occurrence of the current selection, Mod-Alt-g jumps to a line.
*/

// Overrides the goto-line and close-panel commands with the sandbox's own versions.
const sandboxSearchKeymap: readonly KeyBinding[] = searchKeymap.map((binding) => {
  if (binding.key === "Mod-Alt-g") return { ...binding, run: sandboxGotoLine };
  if (binding.key === "Escape") return { ...binding, run: closeSandboxSearchPanel };
  return binding;
});

// Reserves scroll margin for the search or goto-line panel, if open.
const overlayPanelScrollMargin = EditorView.scrollMargins.of((view) => {
  const panel = view.dom.querySelector<HTMLElement>(".sandbox-search-panel, .sandbox-goto-line-panel");
  return panel ? { top: panel.getBoundingClientRect().height } : null;
});

/*
  Prec.high because @codemirror/commands' defaultKeymap already binds Ctrl-d to
  deleteCharForward — the same physical key as Mod-d on Windows/Linux — so this must win the tie.
*/
export const sandboxSearchExtensions: Extension[] = [
  search({ createPanel: (view) => new SandboxSearchPanel(view) }),
  overlayPanelScrollMargin,
  Prec.high(keymap.of(sandboxSearchKeymap))
];
