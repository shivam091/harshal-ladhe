import type { ImageFormatKind, ImageFormatColor } from "@/components/mdx/ImageFormatNegotiationDiagram/ImageFormatNegotiationDiagram.types";

/*
  Maps an outcome's kind to the colors its boxes and connecting line render with — success/green for
  AVIF (the best-case, smallest-file outcome), accent/indigo for WebP (the middle-ground outcome), and
  neutral for the original format (the safe fallback every browser can render, so it doesn't need to
  read as either "good" or "bad").
*/
export function getImageFormatColor(kind: ImageFormatKind): ImageFormatColor {
  switch (kind) {
    case "avif":
      return { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" };
    case "webp":
      return { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" };
    default:
      return { fill: "var(--color-bg-neutral-muted)", stroke: "var(--color-border-neutral-muted)" };
  }
}
