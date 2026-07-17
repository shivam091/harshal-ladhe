import type { RefObject } from "react";
import type { SearchHit } from "@/types/search";

// Props for the decorative cloud SVG anchored to the bottom of the search modal.
export interface CloudBottomProps {
  // Forwarded to the root Wrapper so callers (Search.styles' StyledCloud) can attach positioning styles.
  className?: string;
}

// id ties aria-controls on the header's search trigger to this dialog; onClose triggers the closing animation.
export interface SearchProps {
  // Dialog element id — matched by the header's search trigger's aria-controls for a11y.
  id: string;
  // Invoked to dismiss the dialog, e.g. on overlay click, Escape, or the close button.
  onClose: () => void;
}

// Args for useClearSearch — the lifted query state it drives, plus the input to refocus once cleared.
export interface UseClearSearchArgs {
  // Current text in the search input, read each tick to know how many characters are left to delete.
  inputValue: string;
  // Setter for the lifted query state — called once per tick to peel off the trailing character.
  setInputValue: (value: string) => void;
  // Ref to the search input, refocused once the melt-away animation finishes clearing it.
  inputRef: RefObject<HTMLInputElement | null>;
}

// Props for the search input row rendered inside SearchModal.
export interface SearchBoxProps {
  // The literal, un-deferred text currently in the input.
  query: string;
  // Updates the query — SearchBox calls this on every keystroke.
  setQuery: (query: string) => void;
  // True while React is still applying the deferred (startTransition'd) query update — see SearchModal.
  isPending: boolean;
  // Dismisses the whole dialog, e.g. via the mobile-only close button rendered inside SearchBox.
  handleDismiss: () => void;
}

// Props for a single search result row.
export interface SearchResultProps {
  // The ranked hit to render — its item plus title match ranges and exact-match flag.
  hit: SearchHit;
  // Dims the row to 50% opacity while a newer query is still being applied — see SearchModal's useTransition.
  isPending: boolean;
  // Dismisses the dialog once a result is clicked (unless opened in a new tab via Cmd/Ctrl-click).
  handleDismiss: () => void;
}

// Props for the search results list / empty-state panel.
export interface SearchResultsProps {
  // Current query text, used only to decide which of the three panel states (prompt / no-results / list) to render.
  query: string;
  // Ranked hits to render as SearchResult rows.
  hits: SearchHit[];
  // True while React is still applying a newer (startTransition'd) query — see SearchModal.
  isPending: boolean;
  // Passed straight through to each SearchResult row.
  handleDismiss: () => void;
}