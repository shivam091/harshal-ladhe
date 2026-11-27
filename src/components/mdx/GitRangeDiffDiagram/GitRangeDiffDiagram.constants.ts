import type {
  GitRangeDiffMarker, GitRangeDiffMarkerStyle, GitRangeDiffRow
} from "@/components/mdx/GitRangeDiffDiagram/GitRangeDiffDiagram.types";

// Left edge of the old-range column (feature@{1}).
export const OLD_X = 20;

// Left edge of the new-range column (feature).
export const NEW_X = 300;

// Width of every commit box in either column.
export const BOX_W = 200;

// Height of every commit box in either column.
export const BOX_H = 28;

// x coordinate of the marker badges, centred between the two columns.
export const MARKER_X = 260;

// Radius of each marker badge.
export const MARKER_R = 12;

// y coordinate of the first row's centre.
export const ROW_START_Y = 64;

// Vertical distance between row centres.
export const ROW_GAP = 40;

// y coordinate of the legend row.
export const LEGEND_Y = 270;

// The post's own example: debug logging dropped, rate limiting amended, and a remember-me commit added during the rebase.
export const ROWS: GitRangeDiffRow[] = [
  { marker: "=", oldLabel: "1: Add login form", newLabel: "1: Add login form" },
  { marker: "=", oldLabel: "2: Add validation", newLabel: "2: Add validation" },
  { marker: "<", oldLabel: "3: Add debug logging", newLabel: null },
  { marker: "!", oldLabel: "4: Add rate limiting", newLabel: "3: Add rate limiting" },
  { marker: ">", oldLabel: null, newLabel: "4: Add remember-me option" }
];

// Neutral for unchanged pairs; attention, danger, and success colours for changed, dropped, and added commits.
export const MARKER_STYLES: Record<GitRangeDiffMarker, GitRangeDiffMarkerStyle> = {
  "=": {
    fill: "var(--color-bg-muted)",
    stroke: "var(--color-border-default)",
    text: "var(--color-fg-muted)",
    label: "unchanged"
  },
  "!": {
    fill: "var(--color-bg-attention-muted)",
    stroke: "var(--color-border-attention-emphasis)",
    text: "var(--color-fg-attention)",
    label: "changed"
  },
  "<": {
    fill: "var(--color-bg-danger-muted)",
    stroke: "var(--color-border-danger-emphasis)",
    text: "var(--color-fg-danger)",
    label: "only in old"
  },
  ">": {
    fill: "var(--color-bg-success-muted)",
    stroke: "var(--color-border-success-emphasis)",
    text: "var(--color-fg-success)",
    label: "only in new"
  }
};

// Legend order follows how often each marker tends to appear in real output.
export const LEGEND_MARKERS: GitRangeDiffMarker[] = ["=", "!", "<", ">"];

// Horizontal spacing between legend entries.
export const LEGEND_GAP = 130;
