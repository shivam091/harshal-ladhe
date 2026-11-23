import type { GitPickaxeCase } from "@/components/mdx/GitPickaxeDiagram/GitPickaxeDiagram.types";

// Width of each case card.
export const CARD_W = 140;

// y coordinate of every card's top edge.
export const CARD_Y = 16;

// Height of every case card.
export const CARD_H = 196;

// y coordinate of the first diff line inside a card.
export const DIFF_Y = 66;

// Vertical distance between diff lines.
export const DIFF_STEP = 18;

// y coordinate of the occurrence-count line.
export const COUNT_Y = 132;

// y coordinate of the -S and -G result rows.
export const RESULT_Y = [162, 186];

// The post's three MAX_AGE commits: one adds the constant, one changes its value, one moves it.
export const PICKAXE_CASES: GitPickaxeCase[] = [
  {
    x: 10,
    title: "Added",
    lines: [{ sign: "+", text: "MAX_AGE = 3600" }],
    before: 0,
    after: 1,
    matchesS: true,
    matchesG: true
  },
  {
    x: 160,
    title: "Value changed",
    lines: [
      { sign: "-", text: "MAX_AGE = 3600" },
      { sign: "+", text: "MAX_AGE = 7200" }
    ],
    before: 1,
    after: 1,
    matchesS: false,
    matchesG: true
  },
  {
    x: 310,
    title: "Moved",
    lines: [
      { sign: "-", text: "  MAX_AGE = 3600" },
      { sign: "+", text: "MAX_AGE = 3600" }
    ],
    before: 1,
    after: 1,
    matchesS: false,
    matchesG: true
  }
];
