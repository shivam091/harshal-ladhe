import { getIndentUnit } from "@codemirror/language";
import type { Extension, Text } from "@codemirror/state";
import {
  Decoration,
  EditorView,
  ViewPlugin,
  type DecorationSet,
  type ViewUpdate
} from "@codemirror/view";
import { createToggleField } from "@/components/Sandbox/Editor/extensions/toggle-field";

// Off by default: guides only draw once IndentGuidesToggle turns them on.
const { effect: setShowIndentGuides, field: showIndentGuidesField } = createToggleField(false);

// Dispatch with true/false to show or hide the guides — see IndentGuidesToggle.
export { setShowIndentGuides };

/*
  Indent guides — one vertical guide per nesting level, matching how VS Code's guides stop at
  (not through) the line's own text. Blank lines are the one exception, also matching VS Code:
  a blank line has no indentation of its own to measure, so it borrows the deeper of its nearest
  non-blank neighbours' levels instead of showing no guide at all.

  The guide at the caret's own nesting depth is additionally highlighted (VS Code's "active
  indent guide"), drawn in `--color-border-default` instead of `--color-border-muted` across
  every contiguous line at that depth or deeper — starting on the caret's own line, not the
  line after it, and ending on the last such line before the block dedents back out.
*/

/*
  A line's leading indentation width in columns — spaces count as 1, a tab counts as one full
  `unit` (tabs are treated as a single indent step regardless of their configured display width).
*/
function indentWidth(text: string, unit: number): number {
  let width = 0;

  for (const ch of text) {
    if (ch === " ") width += 1;
    else if (ch === "\t") width += unit;
    else break;
  }

  return width;
}

function isBlank(text: string): boolean {
  return text.trim().length === 0;
}

/*
  Walks the doc from `lineNumber` in `direction` (+1/-1) to the nearest non-blank line's indent
  level, stopping at the document boundary — returns null if every remaining line that way is
  also blank.
*/
function nearestIndentLevel(doc: Text, lineNumber: number, unit: number, direction: 1 | -1): number | null {
  for (let n = lineNumber + direction; n >= 1 && n <= doc.lines; n += direction) {
    const line = doc.line(n);
    if (!isBlank(line.text)) return Math.floor(indentWidth(line.text, unit) / unit);
  }

  return null;
}

/*
  A line's guide level: how many indent-unit guides it should show. Blank lines borrow the
  deeper of their nearest non-blank neighbours' levels, same rule `buildGuides` used to apply
  inline — factored out so `activeBlockRange` can walk levels line-by-line too.
*/
function lineLevel(doc: Text, lineNumber: number, unit: number): number {
  const line = doc.line(lineNumber);
  if (!isBlank(line.text)) return Math.floor(indentWidth(line.text, unit) / unit);

  return Math.max(
    nearestIndentLevel(doc, lineNumber, unit, -1) ?? 0,
    nearestIndentLevel(doc, lineNumber, unit, 1) ?? 0
  );
}

/*
  The vertical extent of the block the caret sits in, at the caret's own nesting depth: every
  contiguous line — starting from the caret's own line, in both directions — whose level is at
  least the caret's level. Returns null at the top level, where VS Code shows no active guide.
*/
function activeBlockRange(
  doc: Text,
  caretLine: number,
  unit: number
): { from: number; to: number; index: number } | null {
  const level = lineLevel(doc, caretLine, unit);
  if (level === 0) return null;

  let from = caretLine;
  while (from > 1 && lineLevel(doc, from - 1, unit) >= level) {
    from--;
  }

  let to = caretLine;
  while (to < doc.lines && lineLevel(doc, to + 1, unit) >= level) {
    to++;
  }

  return { from, to, index: level - 1 };
}

/*
  A line's guide background: a flat repeating pattern in the common case, or — for lines inside
  the caret's active block — the same pattern rebuilt as explicit hard stops so just the guide
  at `activeIndex` renders in the emphasis color while the rest stay default.
*/
function guideBackground(level: number, unit: number, activeIndex: number | null): string {
  const unitWidth = `${unit}ch`;

  if (activeIndex === null) {
    return (
      `background-image: repeating-linear-gradient(to right, var(--color-border-default) 0, var(--color-border-default) 1px, transparent 1px, transparent ${unitWidth});` +
      `background-size: calc(${level} * ${unitWidth}) 100%;` +
      `background-repeat: no-repeat;`
    );
  }

  const stops: string[] = [];
  for (let i = 0; i < level; i++) {
    const color = i === activeIndex ? "var(--color-border-accent-muted)" : "var(--color-border-default)";
    const start = `calc(${i} * ${unitWidth})`;
    const end = `calc(${i} * ${unitWidth} + 1px)`;
    const next = `calc(${i + 1} * ${unitWidth})`;
    stops.push(`${color} ${start}`, `${color} ${end}`, `transparent ${end}`, `transparent ${next}`);
  }

  return `background-image: linear-gradient(to right, ${stops.join(", ")});background-repeat: no-repeat;`;
}

/*
  Builds one line decoration per visible, indented line. Lines inside the caret's active block
  (per `activeBlockRange`) get the highlighted variant; everything else gets the flat pattern.
*/
function buildGuides(view: EditorView): DecorationSet {
  if (!view.state.field(showIndentGuidesField)) return Decoration.none;

  const unit = getIndentUnit(view.state) || 2;
  const doc = view.state.doc;
  const caretLine = doc.lineAt(view.state.selection.main.head).number;
  const active = activeBlockRange(doc, caretLine, unit);
  const decorations = [];

  for (const block of view.viewportLineBlocks) {
    const line = doc.lineAt(block.from);
    const level = lineLevel(doc, line.number, unit);

    if (level > 0) {
      const activeIndex = active !== null && line.number >= active.from && line.number <= active.to ? active.index : null;

      decorations.push(
        Decoration.line({
          attributes: { style: guideBackground(level, unit, activeIndex) }
        }).range(line.from)
      );
    }
  }

  return Decoration.set(decorations, true);
}

/*
  Recomputes the guide decorations whenever the doc changes, a different part of it scrolls into
  view, the caret moves — which is what keeps the active-block highlight in sync with the caret on
  plain cursor movement, not just edits (mirrors the update-gating pattern used by the folding
  extensions in folding.ts, extended with `selectionSet`) — or the toggle itself flips.
*/
const indentGuidesPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildGuides(view);
    }

    update(update: ViewUpdate) {
      const toggled = update.startState.field(showIndentGuidesField) !== update.state.field(showIndentGuidesField);

      if (update.docChanged || update.viewportChanged || update.selectionSet || toggled) {
        this.decorations = buildGuides(update.view);
      }
    }
  },
  { decorations: (plugin) => plugin.decorations }
);

export const sandboxIndentGuideExtensions: Extension[] = [showIndentGuidesField, indentGuidesPlugin];
