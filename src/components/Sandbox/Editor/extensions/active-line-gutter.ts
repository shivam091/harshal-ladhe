import type { Extension } from "@codemirror/state";
import { highlightActiveLineGutter } from "@codemirror/view";

/*
  Sandpack only highlights the active content line, not its gutter — this adds the matching
  `cm-activeLineGutter` class to every registered gutter (line numbers + folding).
*/
export const sandboxActiveLineGutterExtension: Extension = highlightActiveLineGutter();
