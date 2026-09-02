import type { BorderRadiusPresetMeta, CornerName, CornerRadius } from "@/interfaces/border-radius";

function uniform(value: number): Record<CornerName, CornerRadius> {
  const corner: CornerRadius = { h: value, v: value };
  return { topLeft: corner, topRight: corner, bottomRight: corner, bottomLeft: corner };
}

function corners(topLeft: CornerRadius, topRight: CornerRadius, bottomRight: CornerRadius, bottomLeft: CornerRadius): Record<CornerName, CornerRadius> {
  return { topLeft, topRight, bottomRight, bottomLeft };
}

/*
  Curated starting shapes shown in the preset gallery — each is a plain bundle so a thumbnail can
  render it with the exact same compileBlobValue call the main preview uses. Deliberately spans
  both families (plain rounded corners AND squircle) since switching family is one of this tool's
  core features, same reasoning as the gradient tool's presets spanning all three gradient types.
*/
export const borderRadiusPresets: BorderRadiusPresetMeta[] = [
  { slug: "card", name: "Card", family: "rounded", corners: uniform(16), curvature: 4, surfaceColor: "#6366f1", pageColor: "#f1f5f9", size: 200 },
  { slug: "pill", name: "Pill", family: "rounded", corners: uniform(999), curvature: 4, surfaceColor: "#ec4899", pageColor: "#fdf2f8", size: 200 },
  {
    slug: "organic-blob-1",
    name: "Organic Blob",
    family: "rounded",
    corners: corners({ h: 80, v: 120 }, { h: 120, v: 70 }, { h: 70, v: 110 }, { h: 110, v: 80 }),
    curvature: 4,
    surfaceColor: "#22c55e",
    pageColor: "#f0fdf4",
    size: 260
  },
  {
    slug: "organic-blob-2",
    name: "Melt",
    family: "rounded",
    corners: corners({ h: 140, v: 60 }, { h: 60, v: 60 }, { h: 60, v: 140 }, { h: 100, v: 100 }),
    curvature: 4,
    surfaceColor: "#f97316",
    pageColor: "#fff7ed",
    size: 260
  },
  {
    slug: "pebble",
    name: "Pebble",
    family: "rounded",
    corners: corners({ h: 90, v: 70 }, { h: 70, v: 90 }, { h: 90, v: 70 }, { h: 70, v: 90 }),
    curvature: 4,
    surfaceColor: "#94a3b8",
    pageColor: "#f8fafc",
    size: 220
  },
  { slug: "squircle-icon", name: "Squircle Icon", family: "squircle", corners: uniform(60), curvature: 5, surfaceColor: "#a855f7", pageColor: "#faf5ff", size: 160 },
  { slug: "squircle-soft", name: "Squircle Soft", family: "squircle", corners: uniform(48), curvature: 3, surfaceColor: "#0ea5e9", pageColor: "#f0f9ff", size: 200 },
  {
    slug: "neubrutalist-cut",
    name: "Cut Corner",
    family: "rounded",
    corners: corners({ h: 0, v: 0 }, { h: 32, v: 32 }, { h: 32, v: 32 }, { h: 32, v: 32 }),
    curvature: 4,
    surfaceColor: "#fde047",
    pageColor: "#fefce8",
    size: 200
  }
];
