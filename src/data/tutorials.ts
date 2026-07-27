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
