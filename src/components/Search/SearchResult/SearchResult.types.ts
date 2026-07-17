import type { SearchHit } from "@/hooks/use-search-index";

// Props for a single search result row.
export interface SearchResultProps {
  // The ranked hit to render — its item plus title match ranges and exact-match flag.
  hit: SearchHit;
  // Dims the row to 50% opacity while a newer query is still being applied — see SearchModal's useTransition.
  isPending: boolean;
  // Dismisses the dialog once a result is clicked (unless opened in a new tab via Cmd/Ctrl-click).
  handleDismiss: () => void;
}
