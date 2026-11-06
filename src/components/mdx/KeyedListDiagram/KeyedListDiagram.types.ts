// One row in the "after" list: the content it shows and which DOM node renders it.
export interface KeyedListRow {
  // Result shown in the row, e.g. "N".
  content: string;
  // Index of the "before" node reused for this row, or null for a brand-new node (the one that animates).
  reusedFrom: number | null;
}

// One panel: a keying strategy and the after-list it produces from the same data change.
export interface KeyedListPanel {
  // Panel heading naming the key strategy.
  heading: string;
  // x coordinate of the panel's "before" column.
  x: number;
  // Rows of the "after" list, top to bottom.
  after: KeyedListRow[];
  // Verdict printed under the panel.
  caption: string;
}
