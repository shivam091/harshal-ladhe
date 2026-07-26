import type { SandpackError } from "@codesandbox/sandpack-client";

// Props for PreviewErrorOverlay — the compile/runtime error screen over the preview iframe.
export interface PreviewErrorOverlayProps {
  error: SandpackError | null;
  onRestart: () => void;
}
