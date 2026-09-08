import { createContentLookup, type ContentEntry } from "@/data/content";

// Tutorial registry entries share their shape with snippets — see @/data/content.
export type Tutorial = ContentEntry;

/*
  Registry of every tutorial. Each entry has a matching content file at
  app/(site)/(internal)/tutorial/<slug>/page.mdx. This drives the /tutorials list,
  the detail chrome, and prev/next nav.

  Note: publish / last-modified dates come from git history at build time
  (lib/tutorials.ts for the list; the remark-content-metadata plugin for the detail).
  Prev/next nav follows this array's order (declare newest-first).
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
      alt: "Diagram showing a webpage layout with header, footer, two sidebars, and a center content area."
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
      alt: "Illustration of exponential retry logic showing a circular retry loop, increasing delays, and a digital countdown timer."
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
      alt: "Visualization of exponential backoff with jitter, showing randomized retry intervals over time to prevent synchronized retries."
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
      alt: "One-Line Theme-Aware Colors with light-dark() cover showing light and dark mode interfaces, CSS code, and automatic theme switching."
    },
    changelog: [
      { date: "2026-09-08", change: "Initial publication." }
    ]
  }
];

/*
  getTutorialBySlug looks up a single tutorial by its slug. getTutorialNavigation
  returns its previous/next neighbours by this array's order (client-safe —
  used by the tutorial layout, which can't read git dates in the browser). The
  registry is oldest-first (new tutorials appended to the end), so "previous"
  is the entry just before (older) and "next" is the one just after (newer).
*/
export const { getBySlug: getTutorialBySlug, getNavigation: getTutorialNavigation } = createContentLookup(tutorials);
