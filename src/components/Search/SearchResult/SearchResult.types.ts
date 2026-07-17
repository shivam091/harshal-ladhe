import type { SearchHit } from "@/hooks/use-search-index";

// Props for a single search result row.
export interface SearchResultProps {
  // The ranked hit to render — its item plus title match ranges and exact-match flag.
  hit: SearchHit;
  // Dims the row while a newer query is still being applied, so stale results read as stale.
  isPending: boolean;
  // Dismisses the dialog once a result is clicked (unless opened in a new tab via Cmd/Ctrl-click).
  handleDismiss: () => void;
  // Sent with search_result_click, normalised the way useSearchTracking sends it so the two reports join up.
  searchTerm: string;
  // 1-based rank, so the admin can see whether readers find what they want near the top.
  position: number;
}
