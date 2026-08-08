// Props for the copy-to-clipboard share action.
export interface CopyLinkProps {
  // Absolute URL to copy — typically the canonical page URL.
  url: string;
}

// Return shape of the useCopyLink hook.
export interface UseCopyLinkResult {
  // True for 2 seconds after a successful copy, then resets automatically.
  copied: boolean;
  // Writes the URL to the clipboard and sets copied; silently no-ops if the
  // Clipboard API is unavailable (e.g. insecure context or permission denied).
  copy: () => Promise<void>;
}
