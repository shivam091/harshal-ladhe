import { foldNodeProp, syntaxTree } from "@codemirror/language";
import type { EditorState, Extension, Line } from "@codemirror/state";
import { EditorView, ViewPlugin, type ViewUpdate } from "@codemirror/view";
import { highlightTree } from "@lezer/highlight";
import type { SyntaxNode } from "@lezer/common";
import { sandboxSyntaxHighlightStyle } from "@/components/Sandbox/Editor/extensions/syntax-colors";

/*
  Sticky scroll — VS Code-style: scrolling past a nested block's header pins it (and its
  ancestors' headers) to the top. Reuses foldNodeProp (same data codeFolding() reads) as "sticky".
*/

/*
  Caps how many ancestor headers can stack at once, VS Code-style, so a deep nest doesn't push
  the code half off-screen. Innermost ancestors win the cap (see `.slice` below).
*/
const MAX_STICKY_ROWS = 5;

/*
  Walks from `pos` up to the document root, keeping every foldable ancestor whose header has
  scrolled above `pos` but whose closing line hasn't yet. Returned outermost-first.
*/
function stickyAncestors(state: EditorState, pos: number): SyntaxNode[] {
  const result: SyntaxNode[] = [];
  const posLine = state.doc.lineAt(pos).number;
  for (
    let node: SyntaxNode | null = syntaxTree(state).resolveInner(pos, 1);
    node;
    node = node.parent
  ) {
    if (!node.type.prop(foldNodeProp)?.(node, state)) continue;
    const headerLine = state.doc.lineAt(node.from).number;
    const endLine = state.doc.lineAt(node.to).number;
    if (headerLine < posLine && posLine <= endLine) result.unshift(node);
  }
  return result.slice(-MAX_STICKY_ROWS);
}

/*
  Renders one line's real text (indentation included) as text nodes + cm-sbx-* colored spans, so
  a pinned row matches the real code's indent depth and syntax colors below it.
*/
function renderHighlightedLine(state: EditorState, line: Line): DocumentFragment {
  const fragment = document.createDocumentFragment();
  let pos = line.from;

  highlightTree(
    syntaxTree(state),
    sandboxSyntaxHighlightStyle,
    (from, to, classes) => {
      if (from > pos) {
        fragment.appendChild(document.createTextNode(state.doc.sliceString(pos, from)));
      }
      const span = document.createElement("span");
      span.className = classes;
      span.textContent = state.doc.sliceString(from, to);
      fragment.appendChild(span);
      pos = to;
    },
    line.from,
    line.to
  );

  if (pos < line.to) {
    fragment.appendChild(document.createTextNode(state.doc.sliceString(pos, line.to)));
  }

  return fragment;
}

/*
  Owns one absolutely-positioned overlay, appended to view.dom (not scrollDOM) so it stays put
  without manual scroll-offset math and doesn't pan horizontally with the code, VS Code-style.
*/
class StickyScrollWidget {
  readonly dom: HTMLElement;
  private readonly gutterResizeObserver: ResizeObserver | null = null;

  constructor(private view: EditorView) {
    this.dom = document.createElement("div");
    this.dom.className = "cm-sbx-sticky-scroll";
    this.dom.style.display = "none";
    view.dom.appendChild(this.dom);
    this.onScroll = this.onScroll.bind(this);
    view.scrollDOM.addEventListener("scroll", this.onScroll, { passive: true });

    /*
      The fold gutter's markers mount via a separate React root, painting async — so .cm-gutters
      can grow after this widget already measured it. A ResizeObserver catches that resize directly.
    */
    const gutters = view.dom.querySelector(".cm-gutters");
    if (gutters && typeof ResizeObserver !== "undefined") {
      this.gutterResizeObserver = new ResizeObserver(() => this.scheduleRender());
      this.gutterResizeObserver.observe(gutters);
    }

    this.scheduleRender();
  }

  /*
    Sticky content depends on scroll position — CodeMirror's update() cycle doesn't reliably fire
    on a plain scroll with no doc/viewport change, so this listens to the scroller directly.
  */
  private onScroll() {
    this.scheduleRender();
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged || update.geometryChanged) {
      this.scheduleRender();
    }
  }

  /*
    Layout reads must happen in requestMeasure's read phase, not the constructor/update() (both
    run mid-update; CodeMirror throws if layout is read there). `key: this` collapses a burst of
    scroll/update calls down to the last one scheduled.
  */
  private scheduleRender() {
    this.view.requestMeasure({
      key: this,
      read: (view) => {
        const topBlock = view.lineBlockAtHeight(view.scrollDOM.scrollTop);
        const rows = stickyAncestors(view.state, topBlock.from);
        /*
          .cm-gutters bundles all gutter columns as one element, so measure .cm-lineNumbers
          specifically for the number cell width; the rest becomes a blank spacer below.
        */
        const lineNumberWidth = view.dom.querySelector(".cm-lineNumbers")?.getBoundingClientRect().width ?? 0;
        const totalGutterWidth = view.dom.querySelector(".cm-gutters")?.getBoundingClientRect().width ?? 0;
        const otherGutterWidth = Math.max(0, totalGutterWidth - lineNumberWidth);
        /*
          Breadcrumbs and sticky scroll are independent per-embed toggles — measuring the bar's
          actual rendered height (not a fixed constant) keeps this correct either way.
        */
        const breadcrumbHeight = view.dom.querySelector(".cm-sbx-breadcrumb-bar")?.getBoundingClientRect().height ?? 0;
        return { rows, lineNumberWidth, otherGutterWidth, breadcrumbHeight };
      },
      write: ({ rows, lineNumberWidth, otherGutterWidth, breadcrumbHeight }, view) =>
        this.applyRows(view, rows, lineNumberWidth, otherGutterWidth, breadcrumbHeight)
    });
  }

  private applyRows(
    view: EditorView,
    rows: SyntaxNode[],
    lineNumberWidth: number,
    otherGutterWidth: number,
    breadcrumbHeight: number
  ) {
    this.dom.style.insetBlockStart = `${breadcrumbHeight}px`;

    this.dom.replaceChildren();
    if (!rows.length) {
      this.dom.style.display = "none";
      return;
    }
    this.dom.style.display = "block";

    for (const node of rows) {
      const line = view.state.doc.lineAt(node.from);
      const row = document.createElement("div");
      row.className = "cm-sbx-sticky-row";
      row.style.blockSize = `${view.defaultLineHeight}px`;
      row.style.lineHeight = `${view.defaultLineHeight}px`;

      /*
        Own mini "gutter" cell, VS Code-style — same width as the real line-number gutter below
        (not the fold/lint gutters beside it), so the digits themselves line up.
      */
      const lineNumber = document.createElement("span");
      lineNumber.className = "cm-sbx-sticky-linenumber";
      lineNumber.style.inlineSize = `${lineNumberWidth}px`;
      lineNumber.textContent = String(line.number);

      /*
        Blank stand-in for the fold/lint gutter columns the real code sits after too — without
        this, the code text below would start right after the line number, one gutter early.
      */
      const gutterSpacer = document.createElement("span");
      gutterSpacer.className = "cm-sbx-sticky-gutter-spacer";
      gutterSpacer.style.inlineSize = `${otherGutterWidth}px`;

      /*
        Not trimmed — the line's own real leading indentation is what makes a deeply nested
        pinned row read as deeply nested (white-space:pre on the container preserves it).
      */
      const text = document.createElement("span");
      text.className = "cm-sbx-sticky-linetext";
      text.appendChild(renderHighlightedLine(view.state, line));

      row.append(lineNumber, gutterSpacer, text);

      /*
        mousedown (not click), fires before CodeMirror tries to place the caret from this
        overlay's own on-screen coordinates, which don't map to a real document position.
      */
      row.addEventListener("mousedown", (event) => {
        event.preventDefault();
        view.dispatch({
          selection: { anchor: node.from },
          effects: EditorView.scrollIntoView(node.from, { y: "start" })
        });
        view.focus();
      });
      this.dom.appendChild(row);
    }
  }

  destroy() {
    this.view.scrollDOM.removeEventListener("scroll", this.onScroll);
    this.gutterResizeObserver?.disconnect();
    this.dom.remove();
  }
}

export const sandboxStickyScrollExtensions: Extension[] = [
  ViewPlugin.fromClass(StickyScrollWidget)
];
