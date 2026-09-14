import { Prec, type Extension } from "@codemirror/state";
import { EditorView, keymap, type KeyBinding } from "@codemirror/view";
import { search, searchKeymap } from "@codemirror/search";
import { SandboxSearchPanel, closeSandboxSearchPanel } from "@/components/Sandbox/Editor/extensions/search-panel";
import { sandboxGotoLine } from "@/components/Sandbox/Editor/extensions/goto-line";

/*
  Search & replace — Mod-f opens the panel, Mod-g/Shift-Mod-g step through matches,
  Mod-Shift-l selects every occurrence of the current selection, Mod-Alt-g jumps to a line.
*/

/*
  Swaps in sandboxGotoLine (a themed floating card, see ./goto-line) for the built-in gotoLine
  command, which renders through the generic, largely unstyled showDialog panel, and
  closeSandboxSearchPanel (which plays a slide-up/fade-out first) for the built-in closeSearchPanel,
  so Escape animates the panel out the same way its close button does.
*/
const sandboxSearchKeymap: readonly KeyBinding[] = searchKeymap.map((binding) => {
  if (binding.key === "Mod-Alt-g") return { ...binding, run: sandboxGotoLine };
  if (binding.key === "Escape") return { ...binding, run: closeSandboxSearchPanel };
  return binding;
});

/*
  Both the search/replace card and the goto-line card are absolutely-positioned overlays docked
  flush to the editor's top edge, rendered outside CodeMirror's own in-flow panel accounting
  (search-panel.styles.ts forces .cm-panels to display:contents so its card can position against
  .cm-editor directly, and goto-line.ts's card was never registered as a CodeMirror panel at all)
  — so the built-in per-panel scrollMargin (which only ever measures .cm-panels itself, see
  PanelGroup.scrollMargin in @codemirror/view) never reserves space for either. Without this,
  scrollIntoView (used by findNext/findPrevious/replaceNext and goto-line's own jump) can consider
  a line "in view" while it's still hidden behind whichever card is open. Measuring the actual
  rendered card here instead keeps jumps and match navigation landing below it.
*/
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
