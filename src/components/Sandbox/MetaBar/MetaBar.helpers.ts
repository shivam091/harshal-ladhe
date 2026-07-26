import type { EditorCursorInfo } from "@/interfaces/sandbox";

/*
  Formats the status line's selection text (e.g. "2 lines, 42 selected", "3 selections").
  Used by EditorMetaBar.
*/
export function formatSelection(info: EditorCursorInfo): string | null {
  if (info.selectionCount > 1) {
    return `${info.selectionCount} selections`;
  }
  if (info.selectedChars === 0) {
    return null;
  }
  if (info.selectedLines > 1) {
    return `${info.selectedLines} lines, ${info.selectedChars} selected`;
  }
  return `${info.selectedChars} selected`;
}
