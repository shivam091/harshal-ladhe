import { syntaxTree } from "@codemirror/language";
import type { EditorState, Extension } from "@codemirror/state";
import { EditorView, ViewPlugin, type ViewUpdate } from "@codemirror/view";
import type { SyntaxNode } from "@lezer/common";
import { createToggleField } from "@/components/Sandbox/Editor/extensions/toggle-field";
import { createChevronRightIcon } from "@/components/Sandbox/Editor/extensions/search-icons";

/*
  Breadcrumb bar — the named function/class/method/rule/tag enclosing the cursor, e.g. "Foo › bar".
  Unlike sticky scroll (any foldable block, keyed off scroll), this only surfaces *named* symbols
  keyed off the cursor. Opt-in per embed (SandboxUIContext's showBreadcrumbs), off by default —
  see setShowBreadcrumbs.
*/

// Off by default: BreadcrumbBarWidget stays hidden until toggleBreadcrumbs turns this on.
const { effect: setShowBreadcrumbs, field: showBreadcrumbsField } = createToggleField(false);

// Dispatch with true/false to show or hide the breadcrumb bar — see SandboxUIContext's toggleBreadcrumbs.
export { setShowBreadcrumbs };

// One clickable breadcrumb segment — `from` is the node's own document offset (click-to-jump target).
interface BreadcrumbSegment {
  label: string;
  from: number;
}

/*
  Returns this node's own symbol name, or null if it isn't a symbol-defining node — covers the
  four grammars Sandpack ever parses (JS/TS, CSS, HTML), each with its own node shape for a name.
*/
function symbolLabel(node: SyntaxNode, state: EditorState): string | null {
  switch (node.name) {
    case "FunctionDeclaration":
    case "ClassDeclaration": {
      const name = node.getChild("VariableDefinition");
      return name ? state.doc.sliceString(name.from, name.to) : null;
    }
    case "MethodDeclaration":
    case "Property": {
      const name = node.getChild("PropertyDefinition");
      return name ? state.doc.sliceString(name.from, name.to) : null;
    }
    case "ArrowFunction":
    case "FunctionExpression": {
      if (node.parent?.name !== "VariableDeclaration") return null;
      const name = node.parent.getChild("VariableDefinition");
      return name ? state.doc.sliceString(name.from, name.to) : null;
    }
    case "RuleSet":
    case "MediaStatement": {
      const line = state.doc.lineAt(node.from);
      return state.doc.sliceString(node.from, line.to).trim();
    }
    case "Element": {
      const name = node.getChild("OpenTag")?.getChild("TagName");
      return name ? `<${state.doc.sliceString(name.from, name.to)}>` : null;
    }
    default:
      return null;
  }
}

/*
  Builds one "›" separator between breadcrumb segments as a plain inline SVG — this bar re-renders
  on every doc/selection change while visible, and a mounted React root per separator would leak a
  fiber tree each time since render() below replaces the DOM directly, never unmounting it first.
*/
function chevronSeparatorDOM(): HTMLElement {
  const container = document.createElement("span");
  container.className = "cm-sbx-breadcrumb-separator";
  container.append(createChevronRightIcon(12));
  return container;
}

/*
  Walks from `pos` up to the document root, collecting every enclosing named symbol, returned
  outermost-first so segments read left-to-right, e.g. "Foo › bar".
*/
function breadcrumbAncestors(state: EditorState, pos: number): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [];
  for (
    let node: SyntaxNode | null = syntaxTree(state).resolveInner(pos, 1);
    node;
    node = node.parent
  ) {
    const label = symbolLabel(node, state);
    if (label) segments.unshift({ label, from: node.from });
  }
  return segments;
}

/*
  Owns one normal-flow row, inserted as .cm-editor's first child (not appended) so it reserves
  its own height in the flex column, pushing .cm-scroller down automatically. Unlike
  StickyScrollWidget, this never touches DOM layout, so it can render directly, no requestMeasure.
*/
class BreadcrumbBarWidget {
  readonly dom: HTMLElement;

  constructor(private view: EditorView) {
    this.dom = document.createElement("div");
    this.dom.className = "cm-sbx-breadcrumb-bar";
    view.dom.insertBefore(this.dom, view.dom.firstChild);
    this.render();
  }

  update(update: ViewUpdate) {
    const toggled = update.startState.field(showBreadcrumbsField) !== update.state.field(showBreadcrumbsField);

    if (update.docChanged || update.selectionSet || toggled) this.render();
  }

  private render() {
    const view = this.view;

    if (!view.state.field(showBreadcrumbsField)) {
      this.dom.style.display = "none";
      this.dom.replaceChildren();
      return;
    }
    this.dom.style.display = "";

    const segments = breadcrumbAncestors(
      view.state,
      view.state.selection.main.head
    );

    this.dom.replaceChildren();
    if (!segments.length) {
      const empty = document.createElement("span");
      empty.className = "cm-sbx-breadcrumb-empty";
      empty.textContent = "—";
      this.dom.appendChild(empty);
      return;
    }

    segments.forEach((segment, index) => {
      if (index > 0) this.dom.appendChild(chevronSeparatorDOM());

      const button = document.createElement("button");
      button.type = "button";
      button.className = "cm-sbx-breadcrumb-segment";
      button.textContent = segment.label;
      // mousedown (not click), fires before CodeMirror tries to place the caret from this bar's
      // own on-screen coordinates, which don't map to a real document position.
      button.addEventListener("mousedown", (event) => {
        event.preventDefault();
        view.dispatch({
          selection: { anchor: segment.from },
          effects: EditorView.scrollIntoView(segment.from, { y: "center" })
        });
        view.focus();
      });
      this.dom.appendChild(button);
    });
  }

  destroy() {
    this.dom.remove();
  }
}

export const sandboxBreadcrumbBarExtensions: Extension[] = [
  showBreadcrumbsField,
  ViewPlugin.fromClass(BreadcrumbBarWidget)
];
