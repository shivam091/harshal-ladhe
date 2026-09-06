// Which row this segment represents — kept consistent across both lanes so the two are comparable.
export type StreamingColorRole = "shell" | "list" | "comments";

// One row within a streaming timeline lane: a tree segment and the time (ms) at which it becomes
// visible to the user.
export interface StreamingRow {
  label: string;
  visibleAtMs: number;
  colorRole: StreamingColorRole;
}

// One lane: a caption describing the strategy, and its rows.
export interface StreamingLane {
  caption: string;
  rows: StreamingRow[];
}

// Fill/stroke pair for one row's "visible" segment.
export interface StreamingRowColor {
  fill: string;
  stroke: string;
}
