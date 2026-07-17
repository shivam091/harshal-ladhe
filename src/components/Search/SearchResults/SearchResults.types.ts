import type { SearchHit } from "@/hooks/use-search-index";

// Props for the search results list / empty-state panel.
export interface SearchResultsProps {
  // Current query text, used only to decide which of the three panel states (prompt / no-results / list) to render.
  query: string;
  // Ranked hits to render as SearchResult rows.
  hits: SearchHit[];
  // True while a newer query is still being applied.
  isPending: boolean;
  // Passed straight through to each SearchResult row.
  handleDismiss: () => void;
}
