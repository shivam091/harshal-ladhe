import type { GridAreaMap, GridTemplateBuilderPresetMeta, GridTrack, TrackUnit } from "@/interfaces/grid-template-builder";

/*
  Static, human-readable ids rather than generated ones — applyPreset (see
  helpers/grid-template-builder-editor.ts) regenerates every track's real id at the moment a preset
  is applied anyway, so these only ever need to be stable and unique within one preset's own arrays,
  the same convention LayoutPlayground's own preset data uses for its tracks/items.
*/
let nextId = 0;
function track(unit: TrackUnit, size = 1): GridTrack {
  nextId += 1;
  return { id: `preset-track-${nextId}`, unit, size, minUnit: "px", minSize: 100, maxUnit: "fr", maxSize: 1 };
}

// Row-major grid-template-areas source, written as one string per row so a preset's own layout reads the same way it would in a hand-written CSS declaration — split into PresetGalleryProps' actual GridAreaMap shape at the point of use.
function areas(rows: string[]): GridAreaMap {
  return rows.map((row) => row.trim().split(/\s+/));
}

/*
  Curated real-world layouts — deliberately spanning a plain equal-column grid, a two-column
  sidebar, and two named-area layouts of increasing complexity (Holy Grail's five fixed regions,
  Dashboard's mixed row/column spans) so loading a preset doubles as a tour of what named areas can
  do that bare tracks alone can't: give each region of a layout its own readable name instead of a
  numeric column/row position.
*/
export const gridTemplateBuilderPresets: GridTemplateBuilderPresetMeta[] = [
  {
    slug: "holy-grail",
    name: "Holy Grail",
    columns: [track("px", 160), track("fr", 1), track("px", 160)],
    rows: [track("px", 60), track("fr", 1), track("px", 60)],
    rowGap: 12,
    columnGap: 12,
    areas: areas(["header header header", "sidebar main aside", "footer footer footer"])
  },
  {
    slug: "sidebar-layout",
    name: "Sidebar Layout",
    columns: [track("px", 220), track("fr", 1)],
    rows: [track("fr", 1)],
    rowGap: 16,
    columnGap: 16,
    areas: areas(["sidebar main"])
  },
  {
    slug: "three-column-cards",
    name: "3-Column Cards",
    columns: [track("fr", 1), track("fr", 1), track("fr", 1)],
    rows: [track("auto")],
    rowGap: 16,
    columnGap: 16,
    areas: areas(["card1 card2 card3"])
  },
  {
    slug: "dashboard",
    name: "Dashboard",
    columns: [track("px", 180), track("fr", 1), track("fr", 1), track("fr", 1)],
    rows: [track("px", 64), track("fr", 1), track("fr", 1), track("px", 48)],
    rowGap: 12,
    columnGap: 12,
    // "nav" spans the full height of the two middle rows, "main" and "aside" each take one of those rows across the remaining three columns — the mixed-span layout the plain 1-cell-per-name presets above don't otherwise demonstrate.
    areas: areas(["header header header header", "nav main main aside", "nav main main aside", "footer footer footer footer"])
  }
];
