import type { CopyrightLicense } from "@/types/copyright";

// Props for the bottom-of-content footer that pairs a license notice with share actions.
export interface ContentFooterProps {
  // Page or post title forwarded to ShareBar for pre-filled share text.
  title: string;
  // Human-readable label for the content type ("post", "snippet", etc.).
  contentLabel?: string;
  // License to display; defaults to the site-wide default from data/copyright.
  license?: CopyrightLicense;
}
