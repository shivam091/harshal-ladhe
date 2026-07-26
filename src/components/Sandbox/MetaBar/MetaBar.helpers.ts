import type { EditorCursorInfo } from "@/components/Sandbox/Sandbox.types";

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

/*
  Extension → human-readable language label, matching what most editors' own status bars show
  (VS Code's language-mode picker, etc.) rather than a raw parser/mimetype name.
*/
const LANGUAGE_LABELS_BY_EXTENSION: Record<string, string> = {
  js: "JavaScript",
  mjs: "JavaScript",
  cjs: "JavaScript",
  jsx: "JavaScript React",
  ts: "TypeScript",
  tsx: "TypeScript React",
  css: "CSS",
  scss: "SCSS",
  less: "LESS",
  html: "HTML",
  json: "JSON",
  md: "Markdown",
  markdown: "Markdown",
  yaml: "YAML",
  yml: "YAML",
  svg: "SVG"
};

/*
  Language label for the status line — falls back to the bare extension (e.g. "TXT") for anything unrecognized,
  or "Plain Text" for a path with none at all. Used by EditorMetaBar.
*/
export function getLanguageLabel(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase();
  if (!extension || extension === path.toLowerCase()) return "Plain Text";
  return LANGUAGE_LABELS_BY_EXTENSION[extension] ?? extension.toUpperCase();
}

/*
  Byte size (UTF-8 — what the content actually serializes to, not JS's in-memory UTF-16 length)
  of a file's current code, formatted like a file manager would ("312 B", "1.2 KB"). Used by
  EditorMetaBar.
*/
export function formatFileSize(code: string): string {
  const bytes = new TextEncoder().encode(code).length;

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
