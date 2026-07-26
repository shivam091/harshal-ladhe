import { Prec, type Extension } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import {
  diagnosticCount,
  lintGutter,
  lintKeymap,
  type Diagnostic
} from "@codemirror/lint";
import { clamp } from "@/utils/number";

/*
  Inline lint diagnostics — squiggly underline + gutter dot + hover tooltip for the current
  bundler error, fed from the same SandpackError driving errorLineHighlightExtension (error-line.ts).
*/

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
  lintGutter() always reserves its own column width even with no diagnostics — this toggles a
  "cm-has-diagnostics" class instead, so Sandbox.styles.ts can collapse the column when empty.
*/
export const sandboxLintGutterVisibilityExtension: Extension = EditorView.updateListener.of((update) => {
  update.view.dom.classList.toggle("cm-has-diagnostics", diagnosticCount(update.state) > 0);
});

/*
  Gutter/keymap chrome only — no linter(source) here, since CodeMirror's own auto-relint would
  fully replace the diagnostics list on its own schedule and clobber whichever of
  computeErrorDiagnostics/computeSyntaxDiagnostics didn't just run. Both are dispatched manually
  instead (see SandboxCodeEditor and createSyntaxLintExtension), each folding the other in.
*/
export const sandboxLintExtensions: Extension[] = [
  Prec.low(lintGutter()),
  keymap.of(lintKeymap),
  sandboxLintGutterVisibilityExtension
];
