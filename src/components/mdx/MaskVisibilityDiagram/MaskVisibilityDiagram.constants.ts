// Shared width/height of each of the 4 swatches (2 sources, 2 results) in the diagram.
export const SWATCH_W = 200;
export const SWATCH_H = 56;

// Size of one checkerboard tile used to render "transparent" areas, matching common image-editor conventions.
export const CHECKER_TILE = 8;

/*
  The two mask-mode columns. `mechanism` is the plain-English label for what the browser actually reads from
  the source gradient in each mode — the one distinction this diagram exists to make concrete: alpha mode reads
  opacity (so the source is written `black, transparent`), luminance mode reads brightness (so the source is
  written `white, black`, fully opaque throughout).
*/
export const MASK_VISIBILITY_COLUMNS = [
  {
    key: "alpha",
    x: 20,
    title: "mask-mode: alpha (default)",
    mechanism: "reads the source's opacity",
    sourceLabel: "black → transparent",
    // Fully opaque black fading to fully transparent black — an alpha-based fade.
    sourceStops: [
      { offset: "0%", color: "#000000", opacity: 1 },
      { offset: "100%", color: "#000000", opacity: 0 }
    ]
  },
  {
    key: "luminance",
    x: 260,
    title: "mask-mode: luminance",
    mechanism: "reads the source's brightness",
    sourceLabel: "white → black",
    // Fully opaque white fading to fully opaque black — a brightness-based fade, no transparency involved.
    sourceStops: [
      { offset: "0%", color: "#ffffff", opacity: 1 },
      { offset: "100%", color: "#000000", opacity: 1 }
    ]
  }
];

// Start/end colors of the decorative "photo" stand-in shown in each column's masked result swatch.
export const PHOTO_GRADIENT_FROM = "#fb923c";
export const PHOTO_GRADIENT_TO = "#6366f1";
