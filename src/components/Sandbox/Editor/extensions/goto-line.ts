import { EditorView } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";
import { toolbarIconButtonCx } from "@/components/Sandbox/Sandbox.styles";
import { createCloseIcon } from "@/components/Sandbox/Editor/extensions/search-icons";
import { closePanelAnimated } from "@/components/Sandbox/Editor/extensions/panel-motion";

// Line number, optional +/- relative prefix, optional :column, optional trailing % — same grammar
// as @codemirror/search's own gotoLine, kept compatible so muscle memory transfers.
const LINE_PATTERN = /^([+-])?(\d+)?(:\d+)?(%)?$/;

const PANEL_CLASS = "sandbox-goto-line-panel";

/*
  Replaces @codemirror/search's gotoLine (which renders via the generic showDialog/.cm-dialog
  panel) with a card docked top-center and flush with the editor's top edge — VS Code's Quick
  Input treatment for Go to Line — instead of a dimmed centered modal. view.dom (.cm-editor) is
  already position:relative in CodeMirror's own base theme, so the panel's absolute positioning
  resolves against exactly the editor pane, not the whole page.
*/
export function sandboxGotoLine(view: EditorView): boolean {
  if (view.dom.querySelector(`:scope > .${PANEL_CLASS}`)) {
    return true;
  }

  const startLine = view.state.doc.lineAt(view.state.selection.main.head);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = `sandbox-goto-line-close ${toolbarIconButtonCx}`;
  closeButton.setAttribute("aria-label", "Close");
  closeButton.append(createCloseIcon());

  const row = document.createElement("div");
  row.className = "sandbox-goto-line-row";

  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = "numeric";
  input.className = "sandbox-goto-line-input";
  input.name = "line";
  input.value = String(startLine.number);
  input.setAttribute("aria-label", "Line number");
  input.autocomplete = "off";
  input.spellcheck = false;

  row.append(input, closeButton);

  const hint = document.createElement("p");
  hint.className = "sandbox-goto-line-hint";
  hint.textContent = `Line 1–${view.state.doc.lines} · prefix with + or - to jump relative to the current line, or add % for a percentage`;

  const panel = document.createElement("div");
  panel.className = PANEL_CLASS;
  panel.append(row, hint);
  view.dom.append(panel);

  input.focus();
  input.select();

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };
  view.dom.addEventListener("keydown", onKeydown, true);

  // No dimming overlay to catch outside clicks anymore — watch for one directly, same close behavior.
  const onOutsideMousedown = (event: MouseEvent) => {
    if (!panel.contains(event.target as Node)) {
      close();
    }
  };
  view.dom.addEventListener("mousedown", onOutsideMousedown, true);

  function close() {
    view.dom.removeEventListener("keydown", onKeydown, true);
    view.dom.removeEventListener("mousedown", onOutsideMousedown, true);
    view.focus();
    closePanelAnimated(panel, () => panel.remove());
  }

  // Navigates live as the user types (no "Go" button/submit step) — silently no-ops on input
  // that doesn't yet parse (e.g. a bare "-" mid-typing) rather than closing or erroring.
  function navigate(value: string) {
    const match = LINE_PATTERN.exec(value.trim());
    if (!match) return;

    const [, sign, lineStr, columnStr, percent] = match;
    const state = view.state;
    const column = columnStr ? Number(columnStr.slice(1)) : 0;
    let line = lineStr ? Number(lineStr) : startLine.number;

    if (lineStr && percent) {
      let fraction = line / 100;
      if (sign) {
        fraction = fraction * (sign === "-" ? -1 : 1) + startLine.number / state.doc.lines;
      }
      line = Math.round(state.doc.lines * fraction);
    } else if (lineStr && sign) {
      line = line * (sign === "-" ? -1 : 1) + startLine.number;
    }

    const docLine = state.doc.line(Math.max(1, Math.min(state.doc.lines, line)));
    const selection = EditorSelection.cursor(docLine.from + Math.max(0, Math.min(column, docLine.length)));
    view.dispatch({
      effects: EditorView.scrollIntoView(selection.from, { y: "center" }),
      selection
    });
  }

  input.oninput = () => navigate(input.value);
  /*
    Sandpack's own CodeMirror wrapper (.sp-cm, an ancestor of this panel) swallows a plain Enter
    keydown somewhere in its bubble path without setting defaultPrevented or calling
    stopPropagation — harmless for typing inside the actual editor, but it silently defeats any
    reliance on native browser defaults for this key. Handling it explicitly here (and stopping
    it before it bubbles that far) sidesteps that rather than depending on such behavior. Since
    navigation already happened live as the user typed, Enter now just confirms and closes.
  */
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      close();
    }
  });
  closeButton.onclick = () => close();

  return true;
}
