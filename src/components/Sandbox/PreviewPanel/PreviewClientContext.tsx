"use client";

import type { JSX } from "react";
import { createContext, useMemo, useRef } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { usePreviewClient } from "@/hooks/use-preview-client";
import type { PreviewClientContextValue } from "@/interfaces/sandbox";

/*
  Backing context for usePreviewClientContext — exported so that hook can read it without owning
  the Provider itself.
*/
export const PreviewClientContext = createContext<PreviewClientContextValue | null>(null);

/*
  Bridges the custom preview client to sibling components (PreviewPanel, toolbar buttons) that
  aren't parent/child of each other. Must be rendered inside SandpackProvider (uses useSandpack()).
*/
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
