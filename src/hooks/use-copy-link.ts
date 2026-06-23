"use client";

import { useState, useCallback } from "react";
import { UseCopyLinkResult } from "@/interfaces/copy-link";

/*
  Copies a URL to the clipboard and exposes a transient `copied` flag.
  The flag resets after 2 seconds so callers can drive a "Copied!" confirmation
  UI without managing their own timeout.
*/
export function useCopyLink(url: string): UseCopyLinkResult {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  }, [url]);

  return { copied, copy };
}
