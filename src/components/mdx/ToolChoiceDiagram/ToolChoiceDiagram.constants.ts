import type { ToolRow } from "@/components/mdx/ToolChoiceDiagram/ToolChoiceDiagram.types";

// Column headings, split into two short lines so five columns fit the narrow canvas without shrinking the text.
export const CAPABILITIES: [string, string][] = [
  ["No", "JavaScript"],
  ["Entrance", "on mount"],
  ["Loops,", "3+ stops"],
  ["Data-", "driven"],
  ["Page-wide", "/ shared"],
];

// Ordered simplest to most powerful, so the first row that covers a need is the one to reach for.
export const TOOLS: ToolRow[] = [
  { name: "@starting-style", covers: [true, true, false, false, false] },
  { name: "@keyframes", covers: [true, true, true, false, false] },
  { name: "Web Animations API", covers: [false, true, true, true, false] },
  { name: "View Transitions", covers: [false, false, false, false, true] },
];

// Width reserved for tool names, which are the longest strings in the diagram.
export const LABEL_W = 110;

// Left edge of the first capability column, leaving a gutter after the names.
export const GRID_LEFT = 20 + LABEL_W;

// Width of each capability column, sized so the widest heading line still fits at the heading font size.
export const COLUMN_W = 58;

// Top of the first row, leaving room for the two-line headings.
export const FIRST_ROW_Y = 62;

// Height of each row, so the marker sits clear of its neighbours.
export const ROW_H = 36;
