"use client";

import { useState, useCallback } from "react";

// Exposes a flag alongside the action so callers can show confirmation without their own state.
interface UseCopyLinkResult {
  // Resets on its own so a "Copied!" state can't get stuck on screen.
  copied: boolean;
  // Never throws — the Clipboard API can be missing (insecure context) or denied.
  copy: () => Promise<void>;
}

// Owns the confirmation timeout so every copy button shows "Copied!" feedback the same way.
export function useCopyLink(url: string): UseCopyLinkResult {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Failing silently beats an error for a convenience action the user can redo by hand.
    }
  }, [url]);

  return { copied, copy };
}
