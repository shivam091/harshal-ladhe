import type { ChangelogEntry } from "@/components/Changelog/Changelog.types";

// Snippet changelog entries reuse the shared changelog entry shape.
export type SnippetChangelogEntry = ChangelogEntry;

// Cover image used for social/OG/Twitter share previews (not rendered in the body).
export interface SnippetImage {
  // Public path, e.g. /assets/img/goodies/snippets/<slug>/cover.png
  path: string;
  width: number;
  height: number;
  alt: string;
}

// Optional CTA link rendered at the top of the snippet page, e.g. a full post that expands on it.
export interface SnippetLink {
  label: string;
  href: string;
}

// Registry record describing one snippet — drives the /snippets list, prev/next nav, and the detail header.
export interface Snippet {
  // URL slug; also the content file name at src/content/snippets/<slug>.mdx.
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  // Shown under the excerpt when set — omit when there's no related post/page to link to.
  link?: SnippetLink;
  category: string[];
  tags: string[];
  // Social share / OG cover image.
  image: SnippetImage;
  changelog: SnippetChangelogEntry[];
}

// Minimal shape used for the previous/next navigation links.
export interface SnippetNavLink {
  slug: string;
  title: string;
}

// Previous (older) and next (newer) neighbours for a given snippet.
export interface SnippetNavigation {
  previous: SnippetNavLink | null;
  next: SnippetNavLink | null;
}

/*
  Registry of every snippet. Each entry has a matching content file at
  app/(site)/(internal)/snippet/<slug>/page.mdx. This drives the /snippets list,
  the detail chrome, and prev/next nav.

  Note: publish / last-modified dates come from git history at build time
  (lib/snippets.ts for the list; the remark-snippet-meta plugin for the detail).
  Prev/next nav follows this array's order (declare newest-first).
*/
export const snippets: Snippet[] = [
  {
    slug: "deep-freeze-objects",
    title: "Deep Freeze Objects in JavaScript",
    excerpt: "Recursively lock every object level for true immutability",
    description: "Lock objects and their children immutably — prevent accidental mutations and enforce deep immutability in strict mode.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "Object.freeze",
      "deep-freeze",
      "immutability",
      "secure-coding",
      "strict-mode"
    ],
    image: {
      path: "/assets/img/goodies/snippets/deep-freeze-objects/cover.png",
      width: 1536,
      height: 1024,
      alt: "Promotional digital graphic showing the phrase ‘JavaScript deepFreeze()’ with code-themed visuals and design elements aligned to the left."
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication" }
    ]
  },
  {
    slug: "encapsulation-closure",
    title: "Encapsulation with Closures",
    excerpt: "Encapsulate private variables using JavaScript closure patterns.",
    description:
      "Master the functional approach to data encapsulation in JavaScript by leveraging lexical scoping to create immutable private variables.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "closures",
      "encapsulation",
      "design-patterns",
      "functional-programming",
      "private-state",
      "clean-code",
      "factory-pattern"
    ],
    image: {
      path: "/assets/img/goodies/snippets/encapsulation-closure/cover.png",
      width: 1536,
      height: 1024,
      alt: "Cover image illustrating private state encapsulation in JavaScript using closures, symbolized by a shield protecting internal variables."
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication." }
    ]
  },
  {
    slug: "encapsulation-private-class-fields",
    title: "Encapsulation with Private Class Fields",
    excerpt: "Use native #private syntax to protect class properties in JavaScript.",
    description:
      "Implement native engine-level privacy in your OOP structures using ES2022+ private class fields and memory-efficient prototype methods.",
    category: ["JavaScript"],
    tags: ["javascript", "oop", "encapsulation", "classes", "clean-code"],
    image: {
      path: "/assets/img/goodies/snippets/encapsulation-private-class-fields/cover.png",
      width: 1536,
      height: 1024,
      alt: "Representation of a JavaScript Class with a locked vault icon for private fields."
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication." }
    ]
  },
  {
    slug: "holy-grail-layout",
    title: "The Holy Grail Layout (Grid Edition)",
    excerpt: "A responsive Holy Grail layout built with CSS Grid and grid-template-areas — no floats, no hacks.",
    description: "Build the classic Holy Grail layout using modern CSS Grid — a clean, responsive header, sidebars, main content, and footer without floats or layout hacks.",
    category: ["CSS"],
    tags: [
      "css",
      "css-grid",
      "layout",
      "responsive-design",
      "web-design",
      "holy-grail-layout"
    ],
    image: {
      path: "/assets/img/goodies/snippets/holy-grail-layout/cover.png",
      width: 1536,
      height: 1024,
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
    tags: [
      "javascript",
      "async-retry",
      "backoff",
      "promises",
      "error-handling",
      "resilience",
      "nodejs",
      "async-await",
      "api-calls",
      "clean-code"
    ],
    image: {
      path: "/assets/img/goodies/snippets/async-retry-exponential-backoff/cover.png",
      width: 1536,
      height: 1024,
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
    tags: [
      "javascript",
      "jitter",
      "thundering-herd",
      "backoff",
      "distributed-systems",
      "scalability",
      "architecture",
      "reliability"
    ],
    image: {
      path: "/assets/img/goodies/snippets/exponential-backoff-with-jitter/cover.png",
      width: 1536,
      height: 1024,
      alt: "Visualization of exponential backoff with jitter, showing randomized retry intervals over time to prevent synchronized retries."
    },
    link: {
      label: "dssdds",
      href: "/"
    },
    changelog: [
      { date: "2026-08-05", change: "Initial publication with Full Jitter implementation." }
    ]
  },
  {
    slug: "light-dark-color-scheme",
    title: "One-Line Theme-Aware Colors with light-dark()",
    excerpt: "A single declaration per color, resolved automatically for both light and dark mode.",
    description: "The light-dark() CSS function collapses a light value and a dark value into one declaration, resolved by color-scheme — no duplicate custom properties, no @media (prefers-color-scheme) block per themed property.",
    category: ["CSS"],
    tags: [
      "css",
      "light-dark",
      "color-scheme",
      "dark-mode",
      "theming",
      "modern-css",
      "design-tokens"
    ],
    image: {
      path: "/assets/img/goodies/snippets/light-dark-color-scheme/cover.png",
      width: 1536,
      height: 1024,
      alt: "A card component's background and text color switching between light and dark values from a single light-dark() declaration."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "min-max-clamp-functions",
    title: "min(), max(), and clamp() — CSS's Value-Bounding Functions",
    excerpt: "Three comparison functions that pick a value from a rule, without a single media query.",
    description: "min(), max(), and clamp() pick the smallest, largest, or a bounded value from a list of CSS expressions at the point of use, replacing media-query-driven overrides for readable measures, safe-area-aware insets, and bounded widths with one declaration each.",
    category: ["CSS"],
    tags: ["css", "clamp", "min-max", "responsive-design", "css-functions", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/min-max-clamp-functions/cover.png",
      width: 1536,
      height: 1024,
      alt: "Three boxes demonstrating min(), max(), and clamp() resolving to different widths and padding as a container is resized."
    },
    changelog: [{ date: "2026-09-08", change: "Initial publication." }]
  },
  {
    slug: "fluid-typography-and-spacing",
    title: "Fluid Typography and Spacing with clamp()",
    excerpt: "One clamp() declaration scales type, padding, and gaps smoothly — no breakpoint ladder.",
    description: "clamp(min, preferred, max) — with a preferred value built from rem plus a viewport or container-relative unit — scales font-size, padding, and gaps continuously between a floor and ceiling instead of jumping at fixed breakpoints, replacing a media-query ladder with one line per property.",
    category: ["CSS"],
    tags: ["css", "fluid-typography", "clamp", "responsive-design", "container-queries", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/fluid-typography-and-spacing/cover.png",
      width: 1536,
      height: 1024,
      alt: "A heading, paragraph, and card padding scaling smoothly across viewport widths via clamp(), next to the same elements jumping between fixed sizes at breakpoints."
    },
    changelog: [{ date: "2026-09-08", change: "Initial publication." }]
  },
  {
    slug: "dynamic-viewport-units",
    title: "Dynamic Viewport Units: dvh, svh, and lvh",
    excerpt: "The unit that actually tracks a mobile browser's address bar showing or hiding.",
    description: "100vh has always meant the LARGEST possible viewport on mobile, so content sits behind the address bar until it's scrolled away. svh assumes the smallest viewport, lvh assumes the largest, and dvh is the only one of the three that tracks the browser chrome's actual current state, live.",
    category: ["CSS"],
    tags: ["css", "viewport-units", "dvh", "responsive-design", "mobile", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/dynamic-viewport-units/cover.png",
      width: 1536,
      height: 1024,
      alt: "A mobile browser's address bar showing and hiding, with lvh and svh bars staying fixed while a dvh bar resizes to match."
    },
    changelog: [{ date: "2026-09-08", change: "Initial publication." }]
  },
];

// Look up a single snippet by its slug.
export function getSnippetBySlug(slug: string): Snippet | undefined {
  return snippets.find((snippet) => snippet.slug === slug);
}

// Previous/next neighbours by this array's order (client-safe — used by the
// snippet layout, which can't read git dates in the browser). The registry is
// oldest-first (new snippets appended to the end), so "previous" is the entry
// just before (older) and "next" is the one just after (newer).
export function getSnippetNavigation(slug: string): SnippetNavigation {
  const index = snippets.findIndex((snippet) => snippet.slug === slug);
  if (index === -1) return { previous: null, next: null };

  const previous = index > 0 ? snippets[index - 1] : null;
  const next = index < snippets.length - 1 ? snippets[index + 1] : null;

  return {
    previous: previous ? { slug: previous.slug, title: previous.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null
  };
}
