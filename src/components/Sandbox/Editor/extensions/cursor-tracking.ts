import type { Extension } from "@codemirror/state";
import { EditorView, type ViewUpdate } from "@codemirror/view";
import type { EditorCursorInfo } from "@/components/Sandbox/Sandbox.types";

// Cursor tracking — feeds EditorMetaBar's Ln/Col + selection readout.

/*
  Derives Ln/Col + selection stats for the primary cursor. Exported separately so
  SandboxCodeEditor can also call it once on mount/tab-switch, before any transaction fires.
*/
export function computeCursorInfo(view: EditorView): EditorCursorInfo {
  const { state } = view;
  const { main, ranges } = state.selection;
  const line = state.doc.lineAt(main.head);
  const isEmpty = main.from === main.to;

  return {
    line: line.number,
    column: main.head - line.from + 1,
    selectedChars: isEmpty ? 0 : main.to - main.from,
    selectedLines: isEmpty
      ? 0
      : state.doc.lineAt(main.to).number -
        state.doc.lineAt(main.from).number +
        1,
    selectionCount: ranges.length
  };
}

/*
  Reports the primary cursor's position and selection stats on every edit/selection change.
  `onChange` is expected to be a stable reference (e.g. a useState setter) — passing a
  freshly-created function every render would reconfigure the CodeMirror view on every render.
*/
export function createCursorTrackingExtension(
  onChange: (info: EditorCursorInfo) => void
): Extension {
  return EditorView.updateListener.of((update: ViewUpdate) => {
    if (!update.docChanged && !update.selectionSet) return;
    onChange(computeCursorInfo(update.view));
  });
}
