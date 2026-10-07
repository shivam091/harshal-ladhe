import type { ViewboxPreset, ViewboxSample } from "@/components/ViewboxExplorer/ViewboxExplorer.types";

/*
  Built-in negatives for the light box. Each one is deliberately lopsided (a square in one corner, a
  sun off to one side, a lamp at the top) so every alignment and crop visibly changes what survives
  onto the print. Fills are theme tokens, so the samples repaint with the site theme.
*/
export const viewboxExplorerSamples: ViewboxSample[] = [
  {
    slug: "badge",
    name: "Badge (square)",
    source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="4" y="4" width="92" height="92" rx="10" fill="var(--color-bg-muted)" stroke="var(--color-border-default)" stroke-width="2" />
  <circle cx="50" cy="50" r="32" fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" stroke-width="3" />
  <path d="M50 30 L50 70 M30 50 L70 50" stroke="var(--color-fg-accent)" stroke-width="3" stroke-linecap="round" />
  <rect x="12" y="12" width="16" height="16" rx="3" fill="var(--color-fg-attention)" />
  <path d="M88 88 L68 88 L88 68 Z" fill="var(--color-fg-success)" />
</svg>`
  },
  {
    slug: "skyline",
    name: "Skyline (wide)",
    source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120">
  <rect x="0" y="0" width="240" height="120" fill="var(--color-bg-accent-muted)" />
  <circle cx="196" cy="32" r="16" fill="var(--color-fg-attention)" />
  <rect x="14" y="54" width="26" height="56" fill="var(--color-fg-muted)" />
  <rect x="46" y="30" width="22" height="80" fill="var(--color-fg-default)" />
  <rect x="74" y="66" width="34" height="44" fill="var(--color-fg-muted)" />
  <rect x="114" y="44" width="20" height="66" fill="var(--color-fg-accent)" />
  <rect x="140" y="74" width="40" height="36" fill="var(--color-fg-default)" />
  <rect x="186" y="60" width="24" height="50" fill="var(--color-fg-muted)" />
  <rect x="0" y="108" width="240" height="12" fill="var(--color-fg-success)" />
</svg>`
  },
  {
    slug: "lighthouse",
    name: "Lighthouse (tall)",
    source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 160">
  <rect x="0" y="0" width="80" height="160" fill="var(--color-bg-muted)" />
  <path d="M40 22 L80 4 L80 40 Z" fill="var(--color-fg-attention)" opacity="0.6" />
  <rect x="32" y="16" width="16" height="12" rx="2" fill="var(--color-fg-attention)" />
  <path d="M30 30 L50 30 L56 128 L24 128 Z" fill="var(--color-bg-default)" stroke="var(--color-fg-danger)" stroke-width="2" />
  <path d="M28 62 L52 62 L53 78 L27 78 Z M26 98 L54 98 L55 114 L25 114 Z" fill="var(--color-fg-danger)" />
  <path d="M0 128 Q20 120 40 128 T80 128 L80 160 L0 160 Z" fill="var(--color-fg-accent)" />
</svg>`
  }
];

// Curated framings, each isolating one idea — from the post's own square-in-square example to letterboxing, cropping, stretching and zooming.
export const viewboxExplorerPresets: ViewboxPreset[] = [
  {
    slug: "post-diagram",
    name: "Same ratio",
    hint: "The post's 100 × 100 canvas in a 200 × 200 window — nothing to align",
    sampleSlug: "badge",
    viewBox: { x: 0, y: 0, width: 100, height: 100 },
    viewport: { width: 200, height: 200 },
    align: "xMidYMid",
    meetOrSlice: "meet"
  },
  {
    slug: "letterbox",
    name: "Letterbox",
    hint: "A square canvas in a wide window — the default fits it with borders",
    sampleSlug: "badge",
    viewBox: { x: 0, y: 0, width: 100, height: 100 },
    viewport: { width: 360, height: 180 },
    align: "xMidYMid",
    meetOrSlice: "meet"
  },
  {
    slug: "cover",
    name: "Cover crop",
    hint: "A wide skyline in a tall window, cropped to fill like object-fit: cover",
    sampleSlug: "skyline",
    viewBox: { x: 0, y: 0, width: 240, height: 120 },
    viewport: { width: 180, height: 260 },
    align: "xMidYMid",
    meetOrSlice: "slice"
  },
  {
    slug: "stretch",
    name: "Stretched",
    hint: "none scales each axis on its own, so circles become ellipses",
    sampleSlug: "badge",
    viewBox: { x: 0, y: 0, width: 100, height: 100 },
    viewport: { width: 380, height: 150 },
    align: "none",
    meetOrSlice: "meet"
  },
  {
    slug: "zoom",
    name: "Zoom in",
    hint: "A smaller viewBox over the same window magnifies the middle",
    sampleSlug: "badge",
    viewBox: { x: 25, y: 25, width: 50, height: 50 },
    viewport: { width: 220, height: 220 },
    align: "xMidYMid",
    meetOrSlice: "meet"
  },
  {
    slug: "anchor-end",
    name: "Anchor to the end",
    hint: "xMaxYMax meet pushes a tall drawing hard against the right-hand edge",
    sampleSlug: "lighthouse",
    viewBox: { x: 0, y: 0, width: 80, height: 160 },
    viewport: { width: 340, height: 170 },
    align: "xMaxYMax",
    meetOrSlice: "meet"
  },
  {
    slug: "keep-the-top",
    name: "Keep the top",
    hint: "YMin slice keeps the lamp and crops the sea away from the bottom",
    sampleSlug: "lighthouse",
    viewBox: { x: 0, y: 0, width: 80, height: 160 },
    viewport: { width: 280, height: 160 },
    align: "xMidYMin",
    meetOrSlice: "slice"
  },
  {
    slug: "pan",
    name: "Pan past the edge",
    hint: "A viewBox can reach beyond the drawing — empty user space prints too",
    sampleSlug: "skyline",
    viewBox: { x: 120, y: -30, width: 160, height: 120 },
    viewport: { width: 320, height: 240 },
    align: "xMidYMid",
    meetOrSlice: "meet"
  }
];
