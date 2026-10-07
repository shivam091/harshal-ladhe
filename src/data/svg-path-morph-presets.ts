import type { MorphPresetMeta } from "@/components/SvgPathMorph/SvgPathMorph.types";

/*
  Recipes for the preset shelf, all drawn in a 0–100 box. Each one is chosen to exercise a
  different part of the matcher: arcs against straight lines, H/V against cubics, one subpath
  against two (relative commands after a z), open stroked lines with a collapsed partner, S
  reflections against plain C, and a three-keyframe chain with relative arcs.
*/
export const svgPathMorphPresets: MorphPresetMeta[] = [
  {
    slug: "circle-star",
    name: "Circle → star",
    keyframes: [
      "M50 10 A40 40 0 1 1 50 90 A40 40 0 1 1 50 10 Z",
      "M50 11 L60.58 38.44 L89.94 40.02 L67.12 58.56 L74.69 86.98 L50 71 L25.31 86.98 L32.88 58.56 L10.06 40.02 L39.42 38.44 Z"
    ],
    renderMode: "fill",
    durationMs: 900,
    easing: "ease-in-out"
  },
  {
    slug: "square-heart",
    name: "Square → heart",
    keyframes: [
      "M20 20 H80 V80 H20 Z",
      "M50 84 C30 70 12 54 12 35 C12 22 22 13 33 13 C41 13 47 18 50 24 C53 18 59 13 67 13 C78 13 88 22 88 35 C88 54 70 70 50 84 Z"
    ],
    renderMode: "fill",
    durationMs: 1000,
    easing: "sine"
  },
  {
    slug: "play-pause",
    name: "Play → pause",
    keyframes: ["M32 20 L78 50 L32 80 Z", "m24 20 h18 v60 h-18 z m34 0 h18 v60 h-18 z"],
    renderMode: "fill",
    durationMs: 450,
    easing: "ease-in-out"
  },
  {
    slug: "hamburger-close",
    name: "Hamburger → close",
    keyframes: ["M20 30 H80 M20 50 H80 M20 70 H80", "M26 26 L74 74 M50 50 L50 50 M26 74 L74 26"],
    renderMode: "stroke",
    durationMs: 500,
    easing: "quint-out"
  },
  {
    slug: "blob-blob",
    name: "Blob → blob",
    keyframes: [
      "M50 12 C68 10 88 24 86 46 C84 66 70 88 48 86 C26 84 12 68 14 48 C16 28 32 14 50 12 Z",
      "M52 16 C64 8 82 18 84 32 S92 58 78 70 S56 90 40 84 S10 70 14 52 S20 28 30 22 S44 20 52 16 Z"
    ],
    renderMode: "fill",
    durationMs: 1400,
    easing: "sine"
  },
  {
    slug: "transmutation",
    name: "Triangle → square → circle",
    keyframes: ["M50 14 L88 82 L12 82 Z", "M18 18 H82 V82 H18 Z", "M50 16 a34 34 0 1 1 0 68 a34 34 0 1 1 0 -68 z"],
    renderMode: "fill",
    durationMs: 800,
    easing: "ease-in-out"
  }
];
