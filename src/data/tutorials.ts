import { createContentLookup, type ContentEntry } from "@/data/content";

// Aliased so tutorial code reads in its own terms while sharing the common content shape.
export type Tutorial = ContentEntry;

/*
  Each entry needs a matching app/(site)/(internal)/(tutorial)/tutorial/<slug>/page.mdx.
  Dates are deliberately absent — they come from git history at build time.
  Keep it oldest-first (append new tutorials), since prev/next nav follows array order.
*/
export const tutorials: Tutorial[] = [
  {
    slug: "holy-grail-layout",
    title: "The Holy Grail Layout (Grid Edition)",
    excerpt: "A responsive Holy Grail layout built with CSS Grid and grid-template-areas — no floats, no hacks.",
    description: "Build the classic Holy Grail layout using modern CSS Grid — a clean, responsive header, sidebars, main content, and footer without floats or layout hacks.",
    category: ["CSS"],
    tags: ["css", "css-grid", "layout", "responsive-design", "web-design", "holy-grail-layout"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/holy-grail-layout/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Diagram showing a webpage layout with header, footer, two sidebars, and a center content area.",
      caption: "The classic header, footer, two sidebars and centre column, built with Grid."
    },
    changelog: [
      { date: "2026-07-27", change: "Initial publication" }
    ]
  },
  {
    slug: "async-retry-exponential-backoff",
    title: "Exponential Backoff Retry Utility",
    excerpt: "Retry async operations with exponential backoff and caps.",
    description: "A production-ready recursive utility to retry failed asynchronous operations with a configurable delay that doubles and caps to prevent infinite wait times.",
    category: ["JavaScript"],
    tags: ["javascript", "async-retry", "backoff", "promises", "error-handling", "resilience", "nodejs", "async-await", "api-calls", "clean-code"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/async-retry-exponential-backoff/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Illustration of exponential retry logic showing a circular retry loop, increasing delays, and a digital countdown timer.",
      caption: "A retry loop waiting a little longer after each failed attempt."
    },
    changelog: [
      { date: "2026-08-05", change: "Initial publication with Options Object and Max Delay support." }
    ]
  },
  {
    slug: "exponential-backoff-with-jitter",
    title: "Exponential Backoff with Jitter",
    excerpt: "Prevent server traffic spikes using random retry jitter.",
    description: "Enhance your retry logic with 'Full Jitter' to decohere client requests and protect your infrastructure during recovery.",
    category: ["JavaScript"],
    tags: ["javascript", "jitter", "thundering-herd", "backoff", "distributed-systems", "scalability", "architecture", "reliability"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/exponential-backoff-with-jitter/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Visualization of exponential backoff with jitter, showing randomized retry intervals over time to prevent synchronized retries.",
      caption: "Randomised retry intervals spreading clients apart so they never retry in sync."
    },
    changelog: [
      { date: "2026-08-05", change: "Initial publication with Full Jitter implementation." }
    ]
  },
  {
    slug: "light-dark-color-scheme",
    title: "One-Line Theme-Aware Colors with `light-dark()`",
    excerpt: "A single declaration per color, resolved automatically for both light and dark mode.",
    description: "The light-dark() CSS function collapses a light value and a dark value into one declaration, resolved by color-scheme — no duplicate custom properties, no @media (prefers-color-scheme) block per themed property.",
    category: ["CSS"],
    tags: ["css", "light-dark", "color-scheme", "dark-mode", "theming", "modern-css", "design-tokens"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/light-dark-color-scheme/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "One-Line Theme-Aware Colors with light-dark() cover showing light and dark mode interfaces, CSS code, and automatic theme switching.",
      caption: "One colour declaration switching between light and dark themes automatically."
    },
    changelog: [
      { date: "2026-09-08", change: "Initial publication." }
    ]
  },
  {
    slug: "env-safe-area-insets",
    title: "Padding Around the Notch with `env()`",
    excerpt: "Pad fixed UI around notches with env().",
    description: "The env() CSS function reads environment variables the browser defines outside your stylesheet — most commonly the four safe-area-inset-* values — letting fixed/sticky content pad itself around a device's notch, home indicator, or rounded corners without hardcoding per-device pixel values.",
    category: ["CSS"],
    tags: ["css", "env", "safe-area-inset", "notch", "viewport-fit", "responsive-design", "modern-css", "mobile-web"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/env-safe-area-insets/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Padding Around the Notch with env() cover showing a smartphone notch and home indicator with CSS safe-area-inset code.",
      caption: "Content padded clear of a phone's notch and home indicator."
    },
    changelog: [
      { date: "2026-09-10", change: "Initial publication." }
    ]
  }
];

// Array-order based rather than git-dated so the lookups stay client-safe — git can't be read in the browser.
export const { getBySlug: getTutorialBySlug, getNavigation: getTutorialNavigation } = createContentLookup(tutorials);
