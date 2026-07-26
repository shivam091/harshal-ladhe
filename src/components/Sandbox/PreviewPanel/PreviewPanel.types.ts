import type { SandboxFiles } from "@/lib/sandbox/sandbox";

// Props for PreviewPanel — the output/console/diff tabbed pane.
export interface PreviewPanelProps {
  height: number | string;
  // Pre-edit files, so the Diff tab has something to compare against.
  originalFiles?: SandboxFiles;
}
