import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder, type Extension } from "@codemirror/state";
import {
  Decoration,
  EditorView,
  ViewPlugin,
  type DecorationSet,
  type ViewUpdate
} from "@codemirror/view";

/*
  Bracket-pair colorization — every nested (), [], {} pair gets a depth-cycled color, VS
  Code-style. Walks the Lezer syntax tree (bracket leaf nodes) rather than scanning raw text, so
  brackets inside strings/comments/JSX text are skipped automatically.
*/

const OPEN_TO_CLOSE: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
const OPENERS = new Set(Object.keys(OPEN_TO_CLOSE));
const ALL_BRACKETS = new Set([...OPENERS, ...Object.values(OPEN_TO_CLOSE)]);
/*
  Matches the 6 `cm-sbx-bracket-*` rules in Sandbox.styles.ts — depth wraps back to color 0 past
  this, same as VS Code's own bracket-pair colorization.
*/
const BRACKET_COLOR_COUNT = 6;

/*
  Single pass over every bracket node, tracking nesting depth on a stack so each opener/closer
  pair shares one color; walks the whole document (not just the viewport) for consistent colors.
  Built directly with a RangeSetBuilder (not a plain array + Decoration.set) since syntaxTree's
  iterate() already visits nodes in ascending document order — exactly what the builder requires.
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

export const sandboxBracketColorExtensions: Extension[] = [bracketColorPlugin];
