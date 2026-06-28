import type { CopyrightLicense } from "@/types/copyright";

// Props for the license notice displayed at the bottom of content pages.
export interface ContentCopyrightProps {
  // License object with a name and an optional URL; if the URL is absent, the
  // name renders as plain text rather than a hyperlink.
  license: CopyrightLicense;
  // Human-readable label for the content type ("post", "snippet", etc.).
  contentLabel?: string;
}
