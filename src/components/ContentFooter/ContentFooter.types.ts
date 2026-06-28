import type { CopyrightLicense } from "@/data/copyright";

// Optional label and license let every content type reuse the footer without extra config.
export interface ContentFooterProps {
  // Pre-fills share text so shared links carry the page's title.
  title: string;
  contentLabel?: string;
  // Overrides the site-wide default for content released under a different license.
  license?: CopyrightLicense;
}
