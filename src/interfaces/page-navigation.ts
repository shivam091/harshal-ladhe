// A single previous/next destination in the page navigation.
export interface PageNavigationItem {
  href: string;
  title: string;
}

// Reusable prev/next navigation, shared by snippets, posts, and series pages.
export interface PageNavigationProps {
  previous?: PageNavigationItem | null;
  next?: PageNavigationItem | null;
  // Accessible label for the <nav>, e.g. "Post navigation" or "Snippet navigation".
  ariaLabel: string;
  // Override the default slot labels ("Older" / "Newer").
  previousLabel?: string;
  nextLabel?: string;
}
