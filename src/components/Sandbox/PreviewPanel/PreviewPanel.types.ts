import type { SandboxFiles } from "@/lib/sandbox/sandbox";

// Props for PreviewPanel — the output/console/diff tabbed pane.
export interface PreviewPanelProps {
  height: number | string;
  // Original (pre-edit) file tree — threaded through to DiffView, same as SandboxCodeEditor's own originalFiles.
  originalFiles?: SandboxFiles;
}
