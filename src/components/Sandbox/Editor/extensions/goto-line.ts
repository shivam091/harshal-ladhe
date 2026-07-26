import { EditorView } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";
import { toolbarIconButtonCx } from "@/components/Sandbox/Sandbox.styles";
import { createCloseIcon } from "@/components/Sandbox/Editor/extensions/search-icons";

// Line number, optional +/- relative prefix, optional :column, optional trailing % — same grammar
// as @codemirror/search's own gotoLine, kept compatible so muscle memory transfers.
const LINE_PATTERN = /^([+-])?(\d+)?(:\d+)?(%)?$/;

const OVERLAY_CLASS = "sandbox-goto-line-overlay";

/*
  Replaces @codemirror/search's gotoLine (which renders via the generic showDialog/.cm-dialog
  panel) with a floating card centered over the editor — view.dom (.cm-editor) is already
  position:relative in CodeMirror's own base theme, so an absolutely-positioned inset:0 overlay
  here covers exactly the editor pane, not the whole page.
*/
export function sandboxGotoLine(view: EditorView): boolean {
  if (view.dom.querySelector(`:scope > .${OVERLAY_CLASS}`)) {
    return true;
  }

  const startLine = view.state.doc.lineAt(view.state.selection.main.head);

  const overlay = document.createElement("div");
  overlay.className = OVERLAY_CLASS;

  const card = document.createElement("div");
  card.className = "sandbox-goto-line-card";

  const heading = document.createElement("p");
  heading.className = "sandbox-goto-line-heading";
  heading.textContent = "Go to line";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = `sandbox-goto-line-close ${toolbarIconButtonCx}`;
  closeButton.setAttribute("aria-label", "Close");
  closeButton.append(createCloseIcon());

  const header = document.createElement("div");
  header.className = "sandbox-goto-line-header";
  header.append(heading, closeButton);

  const form = document.createElement("form");
  form.className = "sandbox-goto-line-form";

  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = "numeric";
  input.className = "cm-textfield sandbox-goto-line-input";
  input.name = "line";
  input.value = String(startLine.number);
  input.setAttribute("aria-label", "Line number");
  input.autocomplete = "off";
  input.spellcheck = false;

  const goButton = document.createElement("button");
  goButton.type = "submit";
  goButton.className = "sandbox-goto-line-go";
  goButton.textContent = "Go";

  form.append(input, goButton);

  const hint = document.createElement("p");
  hint.className = "sandbox-goto-line-hint";
  hint.textContent = `Line 1–${view.state.doc.lines} · prefix with + or - to jump relative to the current line, or add % for a percentage`;

  card.append(header, form, hint);
  overlay.append(card);
  view.dom.append(overlay);

  input.focus();
  input.select();

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };
  view.dom.addEventListener("keydown", onKeydown, true);

  function close() {
    overlay.remove();
    view.dom.removeEventListener("keydown", onKeydown, true);
    view.focus();
  }

  function submit(value: string) {
    const match = LINE_PATTERN.exec(value.trim());
    if (!match) {
      close();
      return;
    }

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
    close();
  }

  form.onsubmit = (event) => {
    event.preventDefault();
    submit(input.value);
  };
  closeButton.onclick = () => close();
  overlay.onmousedown = (event) => {
    if (event.target === overlay) {
      close();
    }
  };

  return true;
}
