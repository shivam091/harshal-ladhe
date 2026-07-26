import type { SandboxFiles } from "@/lib/sandbox/sandbox";

// Props for DiffView — the Diff tab's full-file, contextual unified-diff readout.
export interface DiffViewProps {
  // Pre-edit files the active file is diffed against.
  originalFiles?: SandboxFiles;
}
