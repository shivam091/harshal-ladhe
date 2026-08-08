// Props for the share action bar rendered at the bottom of content pages.
export interface ShareBarProps {
  // Page or post title — pre-filled as share text on platforms that support it.
  title: string;
  // Human-readable label for the content type ("post", "snippet", etc.).
  contentLabel?: string;
}
