import type { Extension, Range } from "@codemirror/state";
import {
  Decoration,
  EditorView,
  ViewPlugin,
  type DecorationSet,
  type ViewUpdate
} from "@codemirror/view";

/*
  Visible whitespace — marks whitespace within the current selection only (built by hand, per
  character, since @codemirror/view's own highlightWhitespace() marks the whole document
  unconditionally). See Sandbox.styles.ts for the actual dot/arrow glyphs.
*/

/*
  Walks every non-empty selection range, line by line, marking each space/tab character within it
  (clipped to the range's own start/end), plus a line-level marker for fully blank lines, which
  have no character of their own to wrap.
*/
function buildWhitespaceDecorations(view: EditorView): DecorationSet {
  const { state } = view;
  const decorations: Range<Decoration>[] = [];

  for (const range of state.selection.ranges) {
    if (range.empty) continue;

    const firstLine = state.doc.lineAt(range.from).number;
    const lastLine = state.doc.lineAt(range.to).number;

    for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber++) {
      const line = state.doc.line(lineNumber);
      const from = Math.max(line.from, range.from);
      const to = Math.min(line.to, range.to);

      if (line.length === 0) {
        decorations.push(
          Decoration.line({ class: "cm-sbx-blank-line-selected" }).range(
            line.from
          )
        );
        continue;
      }

      for (let pos = from; pos < to; pos++) {
        const ch = line.text[pos - line.from];
        if (ch === " ") {
          decorations.push(
            Decoration.mark({ class: "cm-highlightSpace" }).range(pos, pos + 1)
          );
        } else if (ch === "\t") {
          decorations.push(
            Decoration.mark({ class: "cm-highlightTab" }).range(pos, pos + 1)
          );
        }
      }
    }
  }

  return Decoration.set(decorations, true);
}

/*
  Recomputes whenever the doc or the selection itself changes — the selection is now the whole
  input to buildWhitespaceDecorations, not just an optimization gate.
*/
const whitespacePlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildWhitespaceDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet) {
        this.decorations = buildWhitespaceDecorations(update.view);
      }
    }
  },
  { decorations: (plugin) => plugin.decorations }
);

export const sandboxWhitespaceExtensions: Extension[] = [whitespacePlugin];
