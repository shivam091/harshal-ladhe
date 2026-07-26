import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder, type Extension } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import {
  Decoration,
  ViewPlugin,
  type DecorationSet,
  type ViewUpdate
} from "@codemirror/view";

// Each opener's closer, so a depth can be pushed on one and popped on the other.
const OPEN_TO_CLOSE: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
// Openers alone, to tell a push from a pop.
const OPENERS = new Set(Object.keys(OPEN_TO_CLOSE));
// Every bracket character, so all other syntax nodes are skipped cheaply.
const ALL_BRACKETS = new Set([...OPENERS, ...Object.values(OPEN_TO_CLOSE)]);
/*
  Matches the 6 `cm-sbx-bracket-*` style rules — depth wraps back to colour 0 past this, same as
  VS Code's own bracket-pair colourisation.
*/
const BRACKET_COLOR_COUNT = 6;

/*
  Covers the whole document, not just the viewport, so colours stay consistent while scrolling.
  A RangeSetBuilder suffices since syntaxTree's iterate() already visits nodes in document order.
*/
function buildBracketDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const depthStack: number[] = [];
  syntaxTree(view.state).iterate({
    enter(node) {
      if (!ALL_BRACKETS.has(node.name)) return;
      let depth: number;
      if (OPENERS.has(node.name)) {
        depth = depthStack.length;
        depthStack.push(depth);
      } else {
        depth = depthStack.pop() ?? 0;
      }
      builder.add(
        node.from,
        node.to,
        Decoration.mark({ class: `cm-sbx-bracket-${depth % BRACKET_COLOR_COUNT}` })
      );
    }
  });
  return builder.finish();
}

/*
  Recomputed whenever the syntax tree itself changes — covers both direct edits and the parser
  catching up on a large document in the background, which docChanged alone would miss.
*/
const bracketColorPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildBracketDecorations(view);
    }

    update(update: ViewUpdate) {
      if (syntaxTree(update.state) !== syntaxTree(update.startState)) {
        this.decorations = buildBracketDecorations(update.view);
      }
    }
  },
  { decorations: (plugin) => plugin.decorations }
);

/*
  VS Code-style depth-cycled bracket colours, driven by the Lezer syntax tree rather than raw text
  so brackets inside strings, comments and JSX text are skipped.
*/
export const sandboxBracketColorExtensions: Extension[] = [bracketColorPlugin];
