// Only href and title, so any content type can map its neighbours in.
export interface PageNavigationItem {
  href: string;
  title: string;
}

// Slot labels are props because "Older"/"Newer" suits dated posts but not every sequence.
export interface PageNavigationProps {
  previous?: PageNavigationItem | null;
  next?: PageNavigationItem | null;
  // Required so several <nav> landmarks on a page stay distinguishable to screen readers.
  ariaLabel: string;
  previousLabel?: string;
  nextLabel?: string;
}
