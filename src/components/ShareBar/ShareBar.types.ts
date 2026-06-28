// Kept to the text the share targets need, since the URL comes from the current route.
export interface ShareBarProps {
  // Pre-fills the share text on platforms that accept one.
  title: string;
  // Lets the accessible heading name the content type rather than always saying "post".
  contentLabel?: string;
}
