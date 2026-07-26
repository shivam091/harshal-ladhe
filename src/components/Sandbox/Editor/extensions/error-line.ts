import type { EditorState } from "@codemirror/state";
import {
  RangeSet,
  StateEffect,
  StateField,
  type Extension,
  type Range
} from "@codemirror/state";
import {
  Decoration,
  EditorView,
  GutterMarker,
  gutterLineClass,
  type DecorationSet
} from "@codemirror/view";

// Replaces Sandpack's built-in error highlight, which needs a SandpackProvider-registered client this sandbox doesn't have.

// Dispatch with a 1-based line number to highlight it, or null to clear.
export const setErrorLine = StateEffect.define<number | null>();

// Line decoration applied to the current error line.
const errorLineMark = Decoration.line({
  attributes: { class: "cm-sandbox-error-line" }
});

// Tracks which line (if any) is currently marked as the error line.
const errorLineField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(decorations, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setErrorLine)) {
        if (effect.value == null || effect.value < 1) return Decoration.none;
        const lineNumber = Math.min(effect.value, tr.state.doc.lines);
        const line = tr.state.doc.line(lineNumber);
        return Decoration.set([errorLineMark.range(line.from)]);
      }
    }
    // Keep tracking the same source line across unrelated edits (typing above/below it, etc).
    return tr.docChanged ? decorations.map(tr.changes) : decorations;
  },
  provide: (field) => EditorView.decorations.from(field)
});

/*
  Same-origin (the editor lives in our page, not the sandboxed preview iframe), so var(--...)
  resolves normally here with no opacity/cross-origin caveats.
*/
const errorLineTheme = EditorView.baseTheme({
  ".cm-sandbox-error-line": {
    backgroundColor: "var(--color-bg-danger-muted)",
    borderInlineStart: "3px solid var(--color-border-danger-emphasis)"
  }
});

/*
  Marker for the error line's own gutter cell — elementClass is all a GutterMarker needs to add
  a class to its gutter row, same pattern as @codemirror/view's own activeLineGutterMarker.
*/
class ErrorLineGutterMarker extends GutterMarker {
  elementClass = "cm-sandbox-error-line-gutter";
}
const errorLineGutterMarker = new ErrorLineGutterMarker();

/*
  Marks the error line's gutter cell, computed straight off errorLineField so it can never
  disagree with the content-area highlight about which line is erroring.
*/
const errorLineGutterHighlighter = gutterLineClass.compute(
  [errorLineField],
  (state: EditorState) => {
    const marks: Range<GutterMarker>[] = [];
    state.field(errorLineField).between(0, state.doc.length, (from) => {
      marks.push(errorLineGutterMarker.range(from));
    });
    return RangeSet.of(marks);
  }
);

// Bundled so the error highlight installs as one unit.
export const errorLineHighlightExtension: Extension = [
  errorLineField,
  errorLineTheme,
  errorLineGutterHighlighter
];
