import type { BorderRadiusPresetMeta, CornerName, CornerRadius } from "@/interfaces/border-radius";

// Builds a 4-corner map from a single shared radius — the common symmetric preset case.
function uniform(value: number): Record<CornerName, CornerRadius> {
  const corner: CornerRadius = { h: value, v: value };
  return { topLeft: corner, topRight: corner, bottomRight: corner, bottomLeft: corner };
}

// Builds a 4-corner map from four distinct corners — the asymmetric/organic preset case.
function corners(topLeft: CornerRadius, topRight: CornerRadius, bottomRight: CornerRadius, bottomLeft: CornerRadius): Record<CornerName, CornerRadius> {
  return { topLeft, topRight, bottomRight, bottomLeft };
}

/*
  Curated starting shapes shown in the preset shelf — each is a plain bundle so a thumbnail can
  render it with the exact same compileBlobValue call the main preview uses. Deliberately spans
  both families (plain rounded corners AND squircle) since switching family is one of this tool's
  core features, same reasoning as the gradient tool's presets spanning all three gradient types.
  Colors lean into the "Clay Studio" theme's warm stoneware/greige palette rather than the source
  branch's saturated brand colors.
*/
export const borderRadiusPresets: BorderRadiusPresetMeta[] = [
  { slug: "card", name: "Card", family: "rounded", corners: uniform(16), curvature: 4, surfaceColor: "#c98a63", pageColor: "#f1ede6", size: 200 },
  { slug: "pill", name: "Pill", family: "rounded", corners: uniform(999), curvature: 4, surfaceColor: "#b5673a", pageColor: "#f6efe4", size: 200 },
  {
    slug: "organic-blob-1",
    name: "Organic Blob",
    family: "rounded",
    corners: corners({ h: 80, v: 120 }, { h: 120, v: 70 }, { h: 70, v: 110 }, { h: 110, v: 80 }),
    curvature: 4,
    surfaceColor: "#8a6a4f",
    pageColor: "#f4efe8",
    size: 260
  },
  {
    slug: "organic-blob-2",
    name: "Melt",
    family: "rounded",
    corners: corners({ h: 140, v: 60 }, { h: 60, v: 60 }, { h: 60, v: 140 }, { h: 100, v: 100 }),
    curvature: 4,
    surfaceColor: "#a9764f",
    pageColor: "#f5efe6",
    size: 260
  },
  {
    slug: "pebble",
    name: "Pebble",
    family: "rounded",
    corners: corners({ h: 90, v: 70 }, { h: 70, v: 90 }, { h: 90, v: 70 }, { h: 70, v: 90 }),
    curvature: 4,
    surfaceColor: "#9c9284",
    pageColor: "#f2f0ec",
    size: 220
  },
  { slug: "squircle-icon", name: "Squircle Icon", family: "squircle", corners: uniform(60), curvature: 5, surfaceColor: "#96694a", pageColor: "#f3ede3", size: 160 },
  { slug: "squircle-soft", name: "Squircle Soft", family: "squircle", corners: uniform(48), curvature: 3, surfaceColor: "#c2b8a3", pageColor: "#f6f4f0", size: 200 },
  {
    slug: "neubrutalist-cut",
    name: "Cut Corner",
    family: "rounded",
    corners: corners({ h: 0, v: 0 }, { h: 32, v: 32 }, { h: 32, v: 32 }, { h: 32, v: 32 }),
    curvature: 4,
    surfaceColor: "#7a6452",
    pageColor: "#efe9e0",
    size: 200
  }
];
