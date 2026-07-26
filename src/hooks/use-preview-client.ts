"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadSandpackClient } from "@codesandbox/sandpack-client";
import type {
  SandpackClient,
  SandpackError
} from "@codesandbox/sandpack-client";
import type { ConsoleLogEntry } from "@/interfaces/sandbox";
import type { UsePreviewClientOptions } from "@/interfaces/sandbox";
import type { ConsoleLogMethod } from "@/types/sandbox";

// Caps accumulated console entries so a chatty sandbox can't grow the list unbounded.
const MAX_LOG_COUNT = 50;
// Longer than SandpackProvider's own default (200) to cut down on flicker while actively typing.
const RECOMPILE_DELAY = 500;

/*
  The bundler sometimes fails mutating a frozen Error's message internally and reports that
  secondary failure instead — the real message is still wrapped inside it; pull it back out.
*/
function cleanBundlerErrorMessage(message: string): string {
  const match = message.match(/^Cannot assign to read only property '.+?' of object '([\s\S]*)'$/);
  return match ? match[1] : message;
}

/*
  Best-effort line/column extraction from free-form error text, for when the bundler doesn't send
  structured error details. Skips path — parsed text may not match Sandpack's own path convention.
*/
function parseLineFromText(text: string ): { line: number; column?: number } | null {
  const withPath = text.match(/[^\s:()]+\.\w+:(\d+):(\d+)/);
  if (withPath) {
    return { line: Number(withPath[1]), column: Number(withPath[2]) };
  }
  const bare = text.match(/\((\d+):(\d+)\)/);
  if (bare) {
    return { line: Number(bare[1]), column: Number(bare[2]) };
  }
  return null;
}

/*
  Owns the preview iframe's bundler client directly via @codesandbox/sandpack-client, bypassing
  SandpackProvider's registry — the only way to get showErrorScreen: false to the bundler, since
  sandpack-react hardcodes it true. Console/error/refresh handling is reimplemented here to match.
*/
export function usePreviewClient({ iframeRef, files, environment }: UsePreviewClientOptions) {
  const clientRef = useRef<SandpackClient | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [error, setError] = useState<SandpackError | null>(null);
  const [logs, setLogs] = useState<ConsoleLogEntry[]>([]);
  /*
    Starts true — the client hasn't loaded yet, so we're inherently loading until the first
    "done" message says otherwise.
  */
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  /*
    initDurationMs is the first compile's duration; lastUpdateDurationMs is the most recent
    recompile's — recompileStartRef marks the current start, hasCapturedInitRef says which applies.
  */
  const [initDurationMs, setInitDurationMs] = useState<number | null>(null);
  const [lastUpdateDurationMs, setLastUpdateDurationMs] = useState<number | null>(null);
  const recompileStartRef = useRef<number | null>(null);
  const hasCapturedInitRef = useRef(false);

  const clearLogs = useCallback(() => setLogs([]), []);

  const refresh = useCallback(() => {
    clientRef.current?.dispatch({ type: "refresh" });
  }, []);

  // Set by requestReset(), consumed by the debounced files/environment effect below.
  const pendingFullResetRef = useRef(false);

  /*
    Reset must wait for the debounced files effect to pick up the post-reset state before
    refreshing — refreshing synchronously here would rerun against the stale pre-reset closure.
  */
  const requestReset = useCallback(() => {
    pendingFullResetRef.current = true;
  }, []);

  /*
    Mount: create the client once against the iframe's initial content; unmount: tear it down.
    Later file/environment edits are pushed via updateSandbox below, not by recreating the client.
  */
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let cancelled = false;

    recompileStartRef.current = performance.now();

    loadSandpackClient(
      iframe,
      { files, template: environment },
      {
        showOpenInCodeSandbox: false,
        showErrorScreen: false,
        showLoadingScreen: false
      }
    ).then((client) => {
      if (cancelled) {
        client.destroy();
        return;
      }
      clientRef.current = client;

      client.listen((message) => {
        if (
          (message.type === "start" && message.firstLoad) ||
          message.type === "refresh"
        ) {
          setLogs([]);
          setError(null);
          setIsLoading(true);
          setLoadingMessage(null);
          /*
            The very first load's start time was already seeded before loadSandpackClient was
            called, above — this only re-marks it for a manual refresh/reset happening later.
          */
          if (hasCapturedInitRef.current) {
            recompileStartRef.current = performance.now();
          }
          return;
        }

        /*
          Dependency-install progress ("[1/3] Downloading manifest", "[2/3] Downloaded x (n/total)",
          "[3/3] Starting") — mirrors sandpack-react's own useSandpackPreviewProgress mapping.
        */
        if (message.type === "dependencies") {
          setLoadingMessage((current) => {
            switch (message.data.state) {
              case "downloading_manifest":
                return "[1/3] Downloading manifest";
              case "downloaded_module":
                return `[2/3] Downloaded ${message.data.name} (${message.data.progress}/${message.data.total})`;
              case "starting":
                return "[3/3] Starting";
              default:
                return current;
            }
          });
          return;
        }

        if (message.type === "done") {
          setIsLoading(false);
          setLoadingMessage(null);

          if (recompileStartRef.current != null) {
            const duration = performance.now() - recompileStartRef.current;
            if (!hasCapturedInitRef.current) {
              setInitDurationMs(duration);
              hasCapturedInitRef.current = true;
            } else {
              setLastUpdateDurationMs(duration);
            }
            recompileStartRef.current = null;
          }

          if (message.compilatonError) {
            /*
              Richer "show-error" details may not arrive at all with showErrorScreen: false, so
              fall back to a generic message; only sets a value if nothing's been set yet.
            */
            setError((prev) => prev ?? { message: "Compilation failed. Check the browser console for details." });
          } else {
            setError(null);
          }
          return;
        }

        if (message.type === "action" && message.action === "show-error") {
          /*
            Built from the message's own fields rather than the library's extractErrorDetails()
            helper, which re-derives line/column and can throw for some SyntaxErrors, losing data.
          */
          setError({
            message: cleanBundlerErrorMessage(message.message),
            title: message.title,
            path: message.path,
            line: message.line,
            column: message.column
          });
          return;
        }

        if (
          message.type === "action" &&
          message.action === "notification" &&
          message.notificationType === "error"
        ) {
          setError((prev) => ({
            message: message.title,
            path: prev?.path,
            ...(prev?.line
              ? { line: prev.line, column: prev.column }
              : parseLineFromText(message.title))
          }));
          return;
        }

        if (message.type === "console") {
          setLogs((prev) => {
            const cleared = message.log.some((entry) => entry.method === "clear");
            const entries = message.log.filter((entry): entry is typeof entry & { method: ConsoleLogMethod } => entry.method !== "clear");
            const next = [...(cleared ? [] : prev), ...entries];

            return next.slice(Math.max(0, next.length - MAX_LOG_COUNT));
          });

          /*
            console mirroring is independent of showErrorScreen — an error-level entry is a
            fallback source of a line number when "show-error" hasn't given us one.
          */
          const errorEntry = message.log.find((entry) => entry.method === "error");
          if (errorEntry) {
            const text = errorEntry.data.join(" ");
            const location = parseLineFromText(text);

            if (location) {
              setError((prev) => prev?.line ? prev : { message: prev?.message ?? text, ...location });
            }
          }
        }
      });
    });

    return () => {
      cancelled = true;
      clientRef.current?.destroy();
      clientRef.current = null;
    };
  }, []);

  // Push file edits to the already-running client, debounced to match SandpackProvider's default.
  useEffect(() => {
    const client = clientRef.current;
    if (!client) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (client.status === "done") {
        /*
          Marks the start of *this* recompile — deliberately after the debounce delay, since that
          delay is our own batching, not time the sandbox spent doing anything.
        */
        recompileStartRef.current = performance.now();
        client.updateSandbox({ files, template: environment });

        /*
          See requestReset() above — only now, with the corrected files actually in flight, is it
          safe to also force the full runtime reset a reset-button press asked for.
        */
        if (pendingFullResetRef.current) {
          pendingFullResetRef.current = false;
          client.dispatch({ type: "refresh" });
        }
      }
    }, RECOMPILE_DELAY);

    return () => clearTimeout(debounceRef.current);
  }, [files, environment]);

  return {
    error,
    logs,
    clearLogs,
    refresh,
    requestReset,
    isLoading,
    loadingMessage,
    initDurationMs,
    lastUpdateDurationMs
  };
}
