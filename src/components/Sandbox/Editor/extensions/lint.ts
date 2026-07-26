import { Prec, type Extension } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import {
  diagnosticCount,
  lintGutter,
  lintKeymap,
  type Diagnostic
} from "@codemirror/lint";
import { clamp } from "@/utils/number";

// Fed from the same bundler error as the line highlight, so the two always agree.

/*
  Builds the (at most one) lint diagnostic for the current bundler error, or [] if none applies
  to the active file. Spans the whole line rather than a column, since bundler positions are approximate.
*/
export function computeErrorDiagnostics(
  view: EditorView,
  line: number | null,
  message: string | undefined
): Diagnostic[] {
  if (line == null) return [];

  const lineNumber = clamp(line, 1, view.state.doc.lines);
  const docLine = view.state.doc.line(lineNumber);

  return [
    {
      from: docLine.from,
      to: docLine.to,
      severity: "error",
      message: message ?? "Error"
    }
  ];
}

/*
  lintGutter() always reserves its column even with no diagnostics, so a class toggles on instead
  and lets the styles collapse the empty column.
*/
export const sandboxLintGutterVisibilityExtension: Extension = EditorView.updateListener.of((update) => {
  update.view.dom.classList.toggle("cm-has-diagnostics", diagnosticCount(update.state) > 0);
});

/*
  No linter(source) here, since CodeMirror's auto-relint would replace the diagnostics list on its
  own schedule and clobber whichever source didn't just run; both are dispatched manually instead.
*/
export const sandboxLintExtensions: Extension[] = [
  Prec.low(lintGutter()),
  keymap.of(lintKeymap),
  sandboxLintGutterVisibilityExtension
];
