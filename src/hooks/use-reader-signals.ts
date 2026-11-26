"use client";

import { useEffect } from "react";
import { getContentParams, trackEvent } from "@/lib/analytics";
import { mixpanelTrack } from "@/lib/mixpanel";

// Enough to see that something is breaking and where, without a looping error spending the month's events.
const MAX_ERRORS_PER_LOAD = 5;

// Mixpanel caps a property at 255 characters; a stack trace past that is cut anyway.
const MAX_ERROR_LENGTH = 255;

// Shorter copies are mostly a word grabbed to search for, not a passage taken away.
const MIN_COPY_LENGTH = 20;

/*
  Signals no component owns. Outbound clicks are left to GA's enhanced measurement; errors go to Mixpanel only, since
  GA has nowhere useful to show them.
*/
export function useReaderSignals(): void {
  useEffect(() => {
    let errorCount = 0;

    // The copy buttons write through the Clipboard API, which fires no copy event, so this only sees selected prose.
    function onCopy(): void {
      const length = window.getSelection()?.toString().trim().length ?? 0;
      if (length < MIN_COPY_LENGTH) return;
      trackEvent("text_copy", {
        event_label: window.location.pathname,
        copied_length: length,
        content_group: getContentParams(window.location.pathname).content_group
      });
    }

    function onBeforePrint(): void {
      trackEvent("print", { event_label: window.location.pathname });
    }

    function reportError(kind: "error" | "unhandled_rejection", message: string, source = "", line = 0): void {
      if (errorCount >= MAX_ERRORS_PER_LOAD) return;
      errorCount += 1;
      mixpanelTrack("js_error", {
        error_kind: kind,
        error_message: message.slice(0, MAX_ERROR_LENGTH),
        error_source: source.slice(0, MAX_ERROR_LENGTH),
        error_line: line,
        path: window.location.pathname
      });
    }

    // Script and image load failures arrive here too, without a message; those are the ad blockers', not the site's.
    function onError(e: ErrorEvent): void {
      if (!e.message) return;
      reportError("error", e.message, e.filename, e.lineno);
    }

    function onRejection(e: PromiseRejectionEvent): void {
      const reason: unknown = e.reason;
      reportError("unhandled_rejection", reason instanceof Error ? reason.message : String(reason));
    }

    document.addEventListener("copy", onCopy);
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      document.removeEventListener("copy", onCopy);
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
}
