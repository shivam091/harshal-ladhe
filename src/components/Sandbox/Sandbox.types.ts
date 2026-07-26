import type { SandboxFiles } from "@/lib/sandbox/sandbox";
import type { SplitPaneDirection } from "@/components/SplitPane/SplitPane.types";
import type { SandboxMeta } from "@/data/sandboxes";

// Props for the <Sandbox> MDX component — everything an author can configure per embed.
export interface SandboxProps {
  slug: string;
  height?: number;
  editorWidthPercentage?: number;
  // Runtime-toggleable via its own toolbar button; just seeds the initial state. Defaults to true.
  defaultShowLineNumbers?: boolean;
  /*
    Forces the split layout to start stacked ("vertical") or side-by-side ("horizontal") instead
    of the usual viewport-width-driven default — still runtime-toggleable via the layout cycle
    shortcut/button afterward. Omit (or null) for the normal responsive default.
  */
  defaultLayout?: SplitPaneDirection | null;
  /*
    Locks the sandbox to view-only: edits and code-changing actions are disabled while every visual
    toggle keeps working. An author-set embed flag, off by default.
  */
  readOnly?: boolean;
}

/*
  Console methods a rendered log entry can have. Excludes "clear" — the hook treats it as a
  control signal (wipes the log list) rather than a renderable entry, so it never reaches Log.
*/
export type ConsoleLogMethod =
  | "log"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "table"
  | "time"
  | "timeEnd"
  | "count"
  | "assert";

/*
  One resolved console call from the sandboxed iframe — id keys the React list, method drives
  color/styling, data holds the raw logged arguments (strings, objects, numbers, etc).
*/
export interface ConsoleLogEntry {
  id: string;
  method: ConsoleLogMethod;
  data: unknown[];
}

/*
  Snapshot of the code editor's primary cursor and current selection, 1-based like every other
  editor status bar (Ln/Col start at 1, not 0).
*/
export interface EditorCursorInfo {
  line: number;
  column: number;
  // 0 when nothing is selected.
  selectedChars: number;
  // 0 when nothing is selected; 1 for a selection within a single line; >1 for a multi-line span.
  selectedLines: number;
  // CodeMirror supports multiple simultaneous cursors/selections (Alt-click, Cmd+D, etc).
  selectionCount: number;
}

// Props for SandboxClientBody — everything below the Sandpack/UI/PreviewClient provider setup.
export interface SandboxClientBodyProps {
  meta: SandboxMeta;
  // Pre-edit files so the diff gutter can mark changed lines.
  files: SandboxFiles;
  height: number;
  editorWidthPercentage: number;
}

/*
  Props for SandboxClient — same as SandboxProps, but with `slug` already resolved to the
  metadata/files it points at (done server-side by Sandbox, which also handles the not-found case).
*/
export type SandboxClientProps = Omit<SandboxProps, "slug"> & {
  meta: SandboxMeta;
  files: SandboxFiles;
};
