import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { Prec, type Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";

/*
  Autocomplete — Sandpack only wires up closeBrackets(), not the completion popup itself, so this
  adds it; each open file's own language support feeds the popup automatically. Prec.highest so
  accepting/dismissing a suggestion wins over Sandpack's own Tab/Escape handlers while open.
*/
export const sandboxAutocompleteExtensions: Extension[] = [
  autocompletion(),
  Prec.highest(keymap.of(completionKeymap))
];
