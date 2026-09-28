// Left edge of the first capability column — everything left of it is reserved for the two-line row labels.
export const COLUMN_START_X = 230;

// One shared column width so the four embedding contexts read as a strict, comparable grid.
export const COLUMN_WIDTH = 110;

// Top of the first capability row, leaving room above for the two-line column headers.
export const ROW_START_Y = 64;

// Tall enough for a bold label line plus a muted example line underneath it.
export const ROW_HEIGHT = 42;

/*
  The four ways an SVG file can end up on a page, left-to-right from "most capable" to "least capable" — ordered
  so the grid visibly drains from green to red, which is the whole lesson: the same file loses powers as it moves
  from being part of the page's DOM, to being its own nested document, to being a flat picture.
*/
export const COLUMNS = [
  { lines: ["inline", "<svg>"] },
  { lines: ["<img> /", "CSS background"] },
  { lines: ["<object> /", "<iframe>"] },
  { lines: ["drawn to", "<canvas>"] }
];

// A single cell's verdict — `note` overrides the default "yes"/"no" word when the short answer needs qualifying.
export interface EmbedCell {
  ok: boolean;
  note?: string;
}

// A capability row: a bold label, a muted example line, and one verdict per column in COLUMNS order.
export interface EmbedRow {
  label: string;
  example: string;
  cells: EmbedCell[];
}

/*
  Only capabilities whose behaviour is settled across engines are encoded here — SVG-as-image is the spec's
  "secure animated" mode (no scripts, no external fetches, no interaction), while <object>/<iframe> give the SVG a
  full document of its own that the host page's stylesheets can't reach into.
*/
export const ROWS: EmbedRow[] = [
  {
    label: "External resources load",
    example: "linked images, web fonts, CSS",
    cells: [{ ok: true }, { ok: false }, { ok: true }, { ok: false }]
  },
  {
    label: "Scripts run",
    example: "<script>, onclick=\"…\"",
    cells: [{ ok: true }, { ok: false }, { ok: true }, { ok: false }]
  },
  {
    label: "Interactivity",
    example: ":hover, pointer events, <a> links",
    cells: [{ ok: true }, { ok: false }, { ok: true }, { ok: false }]
  },
  {
    label: "Declarative animation",
    example: "SMIL, CSS @keyframes",
    cells: [{ ok: true }, { ok: true }, { ok: true }, { ok: false, note: "1 frame" }]
  },
  {
    label: "Page CSS applies inside",
    example: "host stylesheet, currentColor",
    cells: [{ ok: true }, { ok: false }, { ok: false }, { ok: false }]
  },
  {
    label: "Text selectable & exposed",
    example: "to find-in-page, screen readers",
    cells: [{ ok: true }, { ok: false, note: "alt only" }, { ok: true }, { ok: false }]
  }
];
