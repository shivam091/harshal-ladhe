import type { EditorCursorInfo } from "@/components/Sandbox/Sandbox.types";

// Props for EditorMetaBar — the status bar under the editor column.
export interface EditorMetaBarProps {
  cursorInfo: EditorCursorInfo | null;
}
