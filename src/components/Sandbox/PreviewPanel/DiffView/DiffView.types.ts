import type { SandboxFiles } from "@/lib/sandbox/sandbox";

// Props for DiffView — the Diff tab's full-file, contextual unified-diff readout.
export interface DiffViewProps {
  // Original (pre-edit) file tree, keyed the same way as Sandpack's own files — diffed against the active file's current content.
  originalFiles?: SandboxFiles;
}
