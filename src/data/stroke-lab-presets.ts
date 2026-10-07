import type { StrokeLabPreset } from "@/components/StrokeLab/StrokeLab.types";

/*
  The pattern drawer's thread cards. Each preset shows off one property in isolation, laid over the
  default state, so loading one is a quick lesson rather than a random restyle.
*/
export const strokeLabPresets: StrokeLabPreset[] = [
  {
    slug: "running-stitch",
    name: "Running stitch",
    blurb: "Even dashes with round caps and joins along the zig-zag.",
    state: { subject: "zigzag", strokeWidth: 8, dashes: [14, 8], linecap: "round", linejoin: "round", strokeColour: "#d6336c" }
  },
  {
    slug: "sharp-star",
    name: "Sharp star",
    blurb: "Tips at ≈ 26.7° need a ratio of 4.32, so the default limit bevels them.",
    state: { subject: "star", strokeWidth: 16, linejoin: "miter", miterLimit: 4, strokeColour: "#7048e8", fillEnabled: true, fillColour: "#f2c14e" }
  },
  {
    slug: "marching-ants",
    name: "Marching ants",
    blurb: "A short square dash marching along the open curve.",
    state: { subject: "curve", strokeWidth: 4, dashes: [6, 6], linecap: "butt", march: true, marchSpeed: 30, strokeColour: "#1c7ed6", overlays: { caps: false, corners: false } }
  },
  {
    slug: "dotted-seam",
    name: "Dotted seam",
    blurb: "Zero-length dashes plus round caps make perfect dots.",
    state: { subject: "spiral", strokeWidth: 9, dashes: [0, 16], linecap: "round", strokeColour: "#2b8a3e", overlays: { caps: false } }
  },
  {
    slug: "odd-basting",
    name: "Odd basting",
    blurb: "An odd-length list (18 6 4) is repeated to 18 6 4 18 6 4.",
    state: { subject: "curve", strokeWidth: 7, dashes: [18, 6, 4], linecap: "butt", strokeColour: "#e8590c" }
  },
  {
    slug: "outlined-label",
    name: "Outlined label",
    blurb: "paint-order: stroke tucks the stroke's inner half under the fill.",
    state: { subject: "text", text: "Hem", strokeWidth: 12, linejoin: "round", paintOrder: "stroke", fillEnabled: true, fillColour: "#f2c14e", strokeColour: "#5f3dc4" }
  },
  {
    slug: "hairline-stretch",
    name: "Hairline stretch",
    blurb: "non-scaling-stroke keeps a 2-unit line crisp through a lopsided scale.",
    state: { subject: "spiral", strokeWidth: 2, nonScalingStroke: true, scaleX: 1.8, scaleY: 0.6, strokeColour: "#0b7285", overlays: { caps: false, corners: false } }
  },
  {
    slug: "square-tacks",
    name: "Square tacks",
    blurb: "Square caps grow every dash by w/2 at both ends.",
    state: { subject: "zigzag", strokeWidth: 10, dashes: [4, 18], linecap: "square", linejoin: "bevel", strokeColour: "#c92a2a" }
  }
];
