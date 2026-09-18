import type { FluidTypePresetMeta, FluidTypeStep } from "@/interfaces/fluid-type";

function step(id: string, name: string, minSize: number, maxSize: number): FluidTypeStep {
  return { id, name, minSize, maxSize };
}

/*
  Curated starting scales shown in the preset gallery — deliberately spanning a tight editorial
  range, a wide hero/display range, a shrinking-headline edge case, and the common 320→1280
  "Utopia-style" defaults, since a fluid-type tool's main value is in the viewport-range/step-count
  combination, not any single number.
*/
export const fluidTypePresets: FluidTypePresetMeta[] = [
  {
    slug: "utopia-default",
    name: "Utopia Default",
    minViewport: 320,
    maxViewport: 1280,
    rootFontSize: 16,
    pageColor: "#f8fafc",
    steps: [
      step("utopia-h1", "H1", 32, 56),
      step("utopia-h2", "H2", 24, 36),
      step("utopia-h3", "H3", 20, 28),
      step("utopia-body", "Body", 16, 18),
      step("utopia-small", "Small", 13, 14)
    ]
  },
  {
    slug: "subtle-editorial",
    name: "Subtle Editorial",
    minViewport: 375,
    maxViewport: 1440,
    rootFontSize: 16,
    pageColor: "#fdf4ff",
    // A narrow growth band — an article body that barely moves across devices, matching print-like editorial layouts more than an app UI.
    steps: [step("editorial-h1", "H1", 28, 38), step("editorial-h2", "H2", 22, 27), step("editorial-body", "Body", 17, 19)]
  },
  {
    slug: "dramatic-hero",
    name: "Dramatic Hero",
    minViewport: 360,
    maxViewport: 1920,
    rootFontSize: 16,
    pageColor: "#0f172a",
    // A wide viewport span with an aggressive headline jump — a landing-page hero that reads as a small stack of words on mobile and a full-bleed display headline on a wide desktop.
    steps: [step("hero-display", "Display", 40, 128), step("hero-sub", "Subhead", 18, 32), step("hero-body", "Body", 16, 18)]
  },
  {
    slug: "mobile-first-article",
    name: "Mobile-First Article",
    minViewport: 320,
    maxViewport: 768,
    rootFontSize: 16,
    pageColor: "#f0fdf4",
    // Stops scaling past tablet width on purpose — a reading-focused layout that caps growth at 768px rather than continuing to scale on desktop.
    steps: [step("article-h1", "H1", 24, 32), step("article-h2", "H2", 20, 24), step("article-body", "Body", 16, 18), step("article-caption", "Caption", 13, 14)]
  },
  {
    slug: "compact-ui",
    name: "Compact UI",
    minViewport: 320,
    maxViewport: 1024,
    rootFontSize: 16,
    pageColor: "#fff7ed",
    // Everything within a few px of each other — dense app-chrome text (labels, buttons, nav) that should feel stable rather than dramatically fluid.
    steps: [step("ui-title", "Title", 18, 22), step("ui-label", "Label", 14, 15), step("ui-caption", "Caption", 12, 13)]
  },
  {
    slug: "shrinking-headline",
    name: "Shrinking Headline",
    minViewport: 320,
    maxViewport: 1600,
    rootFontSize: 16,
    pageColor: "#1c1917",
    // maxSize < minSize on purpose — a headline sized for a narrow mobile column that's deliberately allowed to shrink once a wide desktop layout gives it more surrounding whitespace instead of more raw space to fill.
    steps: [step("shrink-h1", "H1", 48, 34), step("shrink-body", "Body", 17, 16)]
  }
];
