// Props for the search input row rendered inside SearchModal.
export interface SearchBoxProps {
  // The literal, un-deferred text currently in the input.
  query: string;
  // Updates the query — SearchBox calls this on every keystroke.
  setQuery: (query: string) => void;
  // True while the deferred query update is still being applied.
  isPending: boolean;
  // Dismisses the whole dialog, e.g. via the mobile-only close button rendered inside SearchBox.
  handleDismiss: () => void;
}
