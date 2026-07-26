import { syntaxTree } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import {
  Decoration,
  EditorView,
  ViewPlugin,
  type DecorationSet,
  type ViewUpdate
} from "@codemirror/view";
import type { SyntaxNode } from "@lezer/common";

/*
  Tag-pair highlighting on cursor — VS Code's "Highlight Matching Tag": when the caret sits inside
  an opening or closing tag, both tag names light up together. CodeMirror has no built-in tag
  matcher (bracketMatching() only covers (), [], {}), so this walks the Lezer syntax tree directly,
  same approach bracket-colors.ts uses for depth coloring, but keyed off the cursor instead of the
  whole document.
*/

/*
  One entry per grammar this covers. JSX (js/ts/jsx/tsx, via @codemirror/lang-javascript's jsx
  dialect) nests open/close tags as JSXOpenTag/JSXCloseTag under JSXElement; HTML nests OpenTag/
  CloseTag under Element. Self-closing tags (JSXSelfClosingTag/SelfClosingTag) are structurally
  flat — no OpenTag/CloseTag descendants — so they never match here, correctly skipping the
  highlight since there's nothing to pair.
*/
const TAG_GRAMMARS: Array<{ open: string; close: string; nameNodes: Set<string> }> = [
  {
    open: "JSXOpenTag",
    close: "JSXCloseTag",
    nameNodes: new Set(["JSXIdentifier", "JSXNamespacedName", "JSXMemberExpression"])
  },
  { open: "OpenTag", close: "CloseTag", nameNodes: new Set(["TagName"]) }
];

/*
  First direct child of an OpenTag/CloseTag node whose name identifies it as the tag's own name (as
  opposed to the surrounding `<`/`</`/`>` tokens or attributes).
*/
function tagNameChild(tag: SyntaxNode, nameNodes: Set<string>): SyntaxNode | null {
  for (let child = tag.firstChild; child; child = child.nextSibling) {
    if (nameNodes.has(child.name)) return child;
  }
  return null;
}

/*
  Walks up from the node resolved at `pos`, looking for an OpenTag/CloseTag ancestor. Only fires
  when `pos` resolves inside that tag's own subtree — an OpenTag is a sibling of the element's
  content, never an ancestor of it, so merely having the cursor inside an element's children (not
  its markup) correctly climbs past Element/JSXElement without ever matching.
*/
function findTagNamePair(
  view: EditorView,
  pos: number
): { open: SyntaxNode; close: SyntaxNode } | null {
  const tree = syntaxTree(view.state);
  for (const side of [1, -1] as const) {
    for (let node: SyntaxNode | null = tree.resolveInner(pos, side); node; node = node.parent) {
      const grammar = TAG_GRAMMARS.find((g) => g.open === node!.name || g.close === node!.name);
      if (!grammar) continue;
      const parent = node.parent;
      if (!parent) return null;
      const openTag = parent.getChild(grammar.open);
      const closeTag = parent.getChild(grammar.close);
      if (!openTag || !closeTag) return null;
      const openName = tagNameChild(openTag, grammar.nameNodes);
      const closeName = tagNameChild(closeTag, grammar.nameNodes);
      if (!openName || !closeName) return null;
      return { open: openName, close: closeName };
    }
  }
  return null;
}

// Builds the (at most two) decorations for the tag pair enclosing the primary cursor, or none.
function buildTagMatchDecorations(view: EditorView): DecorationSet {
  const pair = findTagNamePair(view, view.state.selection.main.head);
  if (!pair) return Decoration.none;

  const mark = Decoration.mark({ class: "cm-sbx-tag-match" });
  return Decoration.set(
    [mark.range(pair.open.from, pair.open.to), mark.range(pair.close.from, pair.close.to)].sort(
      (a, b) => a.from - b.from
    )
  );
}

/*
  Recomputed on every selection/doc change — a bounded upward walk from the cursor, not a full-tree
  scan, so this stays cheap on every keystroke/click.
*/
const tagMatchPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildTagMatchDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet) {
        this.decorations = buildTagMatchDecorations(update.view);
      }
    }
  },
  { decorations: (plugin) => plugin.decorations }
);

export const sandboxTagMatchExtensions: Extension[] = [tagMatchPlugin];
