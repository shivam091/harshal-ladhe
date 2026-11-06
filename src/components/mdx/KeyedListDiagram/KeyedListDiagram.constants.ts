import type { KeyedListPanel } from "@/components/mdx/KeyedListDiagram/KeyedListDiagram.types";

// The data change both panels render: a new result N lands at the top of [A, B, C].
export const BEFORE = ["A", "B", "C"];

// Wide enough for a one-letter result to read clearly in each row.
export const ROW_W = 56;
// Compact, so the whole list fits inside the panel.
export const ROW_H = 24;
// Keeps neighbouring rows from merging, so each DOM node stays distinct.
export const ROW_GAP = 8;
// Leaves headroom above the lists for the panel heading.
export const LIST_Y = 70;
// Leaves room between the columns for the lines showing which node is reused.
export const COLUMN_GAP = 64;

/*
  Stable keys move A, B and C's existing nodes down and insert one new node for N, so N animates. Index keys
  reuse nodes 0–2 by position (now showing N, A, B) and append one new node at the end, so C animates instead.
*/
export const PANELS: KeyedListPanel[] = [
  {
    heading: "key={item.id}",
    x: 22,
    after: [
      { content: "N", reusedFrom: null },
      { content: "A", reusedFrom: 0 },
      { content: "B", reusedFrom: 1 },
      { content: "C", reusedFrom: 2 },
    ],
    caption: "N is the new node — N animates.",
  },
  {
    heading: "key={index}",
    x: 222,
    after: [
      { content: "N", reusedFrom: 0 },
      { content: "A", reusedFrom: 1 },
      { content: "B", reusedFrom: 2 },
      { content: "C", reusedFrom: null },
    ],
    caption: "The new node shows C — C animates.",
  },
];
