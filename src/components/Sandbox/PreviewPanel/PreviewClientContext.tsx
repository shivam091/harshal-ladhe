"use client";

import type { JSX } from "react";
import { createContext, useMemo, useRef } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import type { SandpackError } from "@codesandbox/sandpack-client";
import { usePreviewClient } from "@/hooks/use-preview-client";
import type { ConsoleLogEntry } from "@/components/Sandbox/Sandbox.types";

// Shared through context because the components that need the preview client aren't parent and child.
export interface PreviewClientContextValue {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  error: SandpackError | null;
  logs: ConsoleLogEntry[];
  clearLogs: () => void;
  refresh: () => void;
  /*
    A plain refresh() right after resetting files can't reliably rerun the reset code, so resets
    go through this instead.
  */
  requestReset: () => void;
  isLoading: boolean;
  loadingMessage: string | null;
  // Timing stats for the status bar: init is set once, the last update after every recompile.
  initDurationMs: number | null;
  lastUpdateDurationMs: number | null;
}

// Exported so the consumer hook can read it without owning the Provider.
export const PreviewClientContext = createContext<PreviewClientContextValue | null>(null);

// Must render inside SandpackProvider because it reads Sandpack's own state.
export function PreviewClientProvider({ children }: { children: React.ReactNode; }): JSX.Element {
  const { sandpack } = useSandpack();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const {
    error,
    logs,
    clearLogs,
    refresh,
    requestReset,
    isLoading,
    loadingMessage,
    initDurationMs,
    lastUpdateDurationMs
  } = usePreviewClient({
    iframeRef,
    files: sandpack.files,
    environment: sandpack.environment
  });

  // Memoized so a field consumers don't read (e.g. a new log line) doesn't force every consumer to re-render.
  const value = useMemo<PreviewClientContextValue>(
    () => ({
      iframeRef,
      error,
      logs,
      clearLogs,
      refresh,
      requestReset,
      isLoading,
      loadingMessage,
      initDurationMs,
      lastUpdateDurationMs
    }),
    [
      error,
      logs,
      clearLogs,
      refresh,
      requestReset,
      isLoading,
      loadingMessage,
      initDurationMs,
      lastUpdateDurationMs
    ]
  );

  return (
    <PreviewClientContext.Provider value={value}>
      {children}
    </PreviewClientContext.Provider>
  );
}
