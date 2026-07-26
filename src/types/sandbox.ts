import type { Options } from "prettier";

/*
  A dynamically-imported Prettier plugin module (e.g. `import("prettier/plugins/babel")`) — just
  the shape `format()`'s `plugins` option actually needs. Used by prettier-format.ts.
*/
export type PluginModule = NonNullable<Options["plugins"]>[number];

/*
  One sandbox file's contents — either a bare code string, or an object form that also seeds
  Sandpack's own per-file flags (hidden from the tab bar, marked active on load, or read-only).
*/
export type SandboxFileEntry =
  | string
  | { code: string; hidden?: boolean; active?: boolean; readOnly?: boolean };

// A sandbox's full file tree, keyed by absolute path (e.g. "/App.tsx").
export type SandboxFiles = Record<string, SandboxFileEntry>;

/*
  Props for SandboxClient — same as SandboxProps, but with `slug` already resolved to the
  metadata/files it points at (done server-side by Sandbox, which also handles the not-found case).
*/
export type SandboxClientProps = Omit<
  import("@/interfaces/sandbox").SandboxProps,
  "slug"
> & {
  meta: import("@/interfaces/sandbox").SandboxMeta;
  files: SandboxFiles;
};

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

// Which pane PreviewPanel is currently showing — the raw output iframe, the console log, or the active file's full unified diff.
export type PreviewPanelTab = "output" | "console" | "diff";
