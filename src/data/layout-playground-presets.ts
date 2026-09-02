import type {
  FlexContainerConfig,
  FlexItemProps,
  GridContainerConfig,
  GridItemProps,
  GridTrack,
  LayoutItem,
  LayoutPresetMeta
} from "@/interfaces/layout-playground";

const ITEM_COLORS = ["#6366f1", "#ec4899", "#22c55e", "#f97316", "#0ea5e9", "#a855f7", "#eab308", "#14b8a6"];

function flexDefaults(): FlexItemProps {
  return { order: 0, grow: 0, shrink: 1, basis: "auto", alignSelf: "auto" };
}
function gridDefaults(): GridItemProps {
  return { columnStart: 1, columnSpan: 1, rowStart: 1, rowSpan: 1, justifySelf: "stretch", alignSelf: "stretch" };
}

// Builds `count` items with cycling colors and sequential ids/labels, then applies per-item overrides (by 0-based index) — presets mostly just need "N plain boxes plus a couple with a span or a grow," not every field spelled out for every item.
function items(count: number, overrides: Record<number, Partial<{ flex: Partial<FlexItemProps>; grid: Partial<GridItemProps> }>> = {}): LayoutItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    label: `${i + 1}`,
    color: ITEM_COLORS[i % ITEM_COLORS.length],
    flex: { ...flexDefaults(), ...overrides[i]?.flex },
    grid: { ...gridDefaults(), ...overrides[i]?.grid }
  }));
}

function flexContainer(overrides: Partial<FlexContainerConfig> = {}): FlexContainerConfig {
  return { direction: "row", wrap: "nowrap", justifyContent: "flex-start", alignItems: "stretch", alignContent: "stretch", ...overrides };
}

function track(size: number, unit: GridTrack["unit"], id: string): GridTrack {
  return { id, size, unit };
}

function gridContainer(columns: GridTrack[], rows: GridTrack[], overrides: Partial<GridContainerConfig> = {}): GridContainerConfig {
  return { columns, rows, autoFlow: "row", justifyItems: "stretch", alignItems: "stretch", justifyContent: "flex-start", alignContent: "stretch", ...overrides };
}

/*
  Curated starting layouts shown in the preset gallery — each is a plain bundle so a thumbnail can
  render it with the exact same compileContainerStyle/compileItemStyle calls the main preview uses.
  Spans both modes (and "Holy Grail" specifically exercises per-item column/row spanning) since
  switching mode and placing items are this tool's two core features.
*/
export const layoutPlaygroundPresets: LayoutPresetMeta[] = [
  {
    slug: "navbar",
    name: "Navbar",
    mode: "flex",
    gap: 16,
    containerWidth: 480,
    flexContainer: flexContainer({ justifyContent: "space-between", alignItems: "center" }),
    gridContainer: gridContainer([track(1, "fr", "navbar-col")], [track(1, "fr", "navbar-row")]),
    items: items(3)
  },
  {
    slug: "card-row",
    name: "Card Row",
    mode: "flex",
    gap: 16,
    containerWidth: 480,
    flexContainer: flexContainer({ wrap: "wrap" }),
    gridContainer: gridContainer([track(1, "fr", "cards-col")], [track(1, "fr", "cards-row")]),
    items: items(6, Object.fromEntries(Array.from({ length: 6 }, (_, i) => [i, { flex: { basis: "120px" } }])))
  },
  {
    slug: "centered-box",
    name: "Centered Box",
    mode: "flex",
    gap: 16,
    containerWidth: 480,
    flexContainer: flexContainer({ justifyContent: "center", alignItems: "center" }),
    gridContainer: gridContainer([track(1, "fr", "center-col")], [track(1, "fr", "center-row")]),
    items: items(1)
  },
  {
    slug: "equal-columns",
    name: "Equal Columns",
    mode: "flex",
    gap: 16,
    containerWidth: 480,
    flexContainer: flexContainer(),
    gridContainer: gridContainer([track(1, "fr", "eq-col")], [track(1, "fr", "eq-row")]),
    items: items(4, Object.fromEntries(Array.from({ length: 4 }, (_, i) => [i, { flex: { grow: 1 } }])))
  },
  {
    slug: "pricing-cards",
    name: "Pricing Cards",
    mode: "flex",
    gap: 24,
    containerWidth: 480,
    flexContainer: flexContainer({ justifyContent: "center", alignItems: "stretch" }),
    gridContainer: gridContainer([track(1, "fr", "pricing-col")], [track(1, "fr", "pricing-row")]),
    items: items(3, { 1: { flex: { grow: 1.4 } } })
  },
  {
    slug: "sidebar-layout",
    name: "Sidebar Layout",
    mode: "grid",
    gap: 16,
    containerWidth: 480,
    flexContainer: flexContainer(),
    gridContainer: gridContainer([track(140, "px", "sidebar-col-1"), track(1, "fr", "sidebar-col-2")], [track(1, "fr", "sidebar-row")]),
    items: items(2, { 1: { grid: { columnStart: 2 } } })
  },
  {
    slug: "photo-gallery",
    name: "Photo Gallery",
    mode: "grid",
    gap: 12,
    containerWidth: 480,
    flexContainer: flexContainer(),
    gridContainer: gridContainer(
      [track(1, "fr", "gallery-c1"), track(1, "fr", "gallery-c2"), track(1, "fr", "gallery-c3"), track(1, "fr", "gallery-c4")],
      [track(1, "fr", "gallery-r1"), track(1, "fr", "gallery-r2")]
    ),
    // Every item's grid placement is always explicit in this tool (GridItemProps has no "auto" state — see its own comment), so a preset can't rely on the auto-placement algorithm to spread items across cells; each of the 8 photos is placed by hand into its own cell of the 4x2 grid instead.
    items: items(8, {
      0: { grid: { columnStart: 1, rowStart: 1 } },
      1: { grid: { columnStart: 2, rowStart: 1 } },
      2: { grid: { columnStart: 3, rowStart: 1 } },
      3: { grid: { columnStart: 4, rowStart: 1 } },
      4: { grid: { columnStart: 1, rowStart: 2 } },
      5: { grid: { columnStart: 2, rowStart: 2 } },
      6: { grid: { columnStart: 3, rowStart: 2 } },
      7: { grid: { columnStart: 4, rowStart: 2 } }
    })
  },
  {
    slug: "holy-grail",
    name: "Holy Grail",
    mode: "grid",
    gap: 12,
    containerWidth: 560,
    flexContainer: flexContainer(),
    gridContainer: gridContainer(
      [track(120, "px", "hg-col-1"), track(1, "fr", "hg-col-2"), track(120, "px", "hg-col-3")],
      [track(48, "px", "hg-row-1"), track(1, "fr", "hg-row-2"), track(48, "px", "hg-row-3")]
    ),
    items: items(5, {
      0: { grid: { columnStart: 1, columnSpan: 3, rowStart: 1, rowSpan: 1 } },
      1: { grid: { columnStart: 1, columnSpan: 1, rowStart: 2, rowSpan: 1 } },
      2: { grid: { columnStart: 2, columnSpan: 1, rowStart: 2, rowSpan: 1 } },
      3: { grid: { columnStart: 3, columnSpan: 1, rowStart: 2, rowSpan: 1 } },
      4: { grid: { columnStart: 1, columnSpan: 3, rowStart: 3, rowSpan: 1 } }
    })
  }
];
