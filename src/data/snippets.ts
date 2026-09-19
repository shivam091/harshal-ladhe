import type { ChangelogEntry } from "@/components/Changelog/Changelog.types";

// Snippet changelog entries reuse the shared changelog entry shape.
export type SnippetChangelogEntry = ChangelogEntry;

// Cover image used for social/OG/Twitter share previews (not rendered in the body).
export interface SnippetImage {
  path: string;
  width: number;
  height: number;
  type?: string;
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
    tags: ["javascript", "Object.freeze", "deep-freeze", "immutability", "secure-coding", "strict-mode"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/deep-freeze-objects/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
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
    description: "Master the functional approach to data encapsulation in JavaScript by leveraging lexical scoping to create immutable private variables.",
    category: ["JavaScript"],
    tags: ["javascript", "closures", "encapsulation", "design-patterns", "functional-programming", "private-state", "clean-code", "factory-pattern"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/encapsulation-closure/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
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
    description: "Implement native engine-level privacy in your OOP structures using ES2022+ private class fields and memory-efficient prototype methods.",
    category: ["JavaScript"],
    tags: ["javascript", "oop", "encapsulation", "classes", "clean-code"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/encapsulation-private-class-fields/cover.png",
      width: 1536,
      height: 1024,
      type: "image/webp",
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
    tags: ["css", "css-grid", "layout", "responsive-design", "web-design", "holy-grail-layout"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/holy-grail-layout/cover.png",
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
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/async-retry-exponential-backoff/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Illustration of exponential retry logic showing a circular retry loop, increasing delays, and a digital countdown timer."
    },
    link: {
      label: "Read the full post: Mastering Asynchronous JavaScript",
      href: "/post/javascript/mastering-async-javascript"
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
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/exponential-backoff-with-jitter/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Visualization of exponential backoff with jitter, showing randomized retry intervals over time to prevent synchronized retries."
    },
    link: {
      label: "Read the full post: Mastering Asynchronous JavaScript",
      href: "/post/javascript/mastering-async-javascript"
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
    tags: ["css", "light-dark", "color-scheme", "dark-mode", "theming", "modern-css", "design-tokens"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/light-dark-color-scheme/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "One-Line Theme-Aware Colors with light-dark() cover showing light and dark mode interfaces, CSS code, and automatic theme switching."
    },
    changelog: [
      { date: "2026-09-08", change: "Initial publication." }
    ]
  },
  {
    slug: "env-safe-area-insets",
    title: "Padding Around the Notch with env()",
    excerpt: "Pad fixed UI around notches with env().",
    description: "The env() CSS function reads environment variables the browser defines outside your stylesheet — most commonly the four safe-area-inset-* values — letting fixed/sticky content pad itself around a device's notch, home indicator, or rounded corners without hardcoding per-device pixel values.",
    category: ["CSS"],
    tags: ["css", "env", "safe-area-inset", "notch", "viewport-fit", "responsive-design", "modern-css", "mobile-web"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/env-safe-area-insets/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Padding Around the Notch with env() cover showing a smartphone notch and home indicator with CSS safe-area-inset code."
    },
    changelog: [
      { date: "2026-09-10", change: "Initial publication." }
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
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/min-max-clamp-functions/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "min(), max(), and clamp() CSS infographic showing value comparison, responsive sizing, safe-area insets, and CSS code without media queries."
    },
    changelog: [
      { date: "2026-09-10", change: "Initial publication." }
    ]
  },
  {
    slug: "fluid-typography-and-spacing",
    title: "Fluid Typography and Spacing with clamp()",
    excerpt: "One clamp() declaration scales type, padding, and gaps smoothly — no breakpoint ladder.",
    description: "clamp(min, preferred, max) — with a preferred value built from rem plus a viewport or container-relative unit — scales font-size, padding, and gaps continuously between a floor and ceiling instead of jumping at fixed breakpoints, replacing a media-query ladder with one line per property.",
    category: ["CSS"],
    tags: ["css", "fluid-typography", "clamp", "responsive-design", "container-queries", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/fluid-typography-and-spacing/cover.png",
      width: 1536,
      height: 1024,
      type: "image/webp",
      alt: "HD colorful infographic titled “Fluid Typography and Spacing with clamp()”, showing responsive mobile, tablet, and desktop layouts, a CSS clamp() code example, and visual explanations of fluid type, spacing, radii, container units, and accessibility."
    },
    changelog: [
      { date: "2026-09-10", change: "Initial publication." }
    ]
  },
  {
    slug: "will-change-property",
    title: "Hinting Layer Promotion with `will-change`",
    excerpt: "Tell the browser what's about to change, before it changes — then take the hint back.",
    description: "will-change hints to the browser that a property is about to change, letting it promote an element to its own compositor layer ahead of time instead of during the first frame of a transition. A live sandbox compares no hint, always-on, and the recommended toggle-before/after pattern against the element's real, live will-change value.",
    category: ["CSS"],
    tags: ["css", "will-change", "performance", "gpu-acceleration", "transition", "animation"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/will-change-property/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A modern dark-themed illustration explaining CSS will-change, showing layer promotion with smooth animation, a CSS code example, performance tips, and a comparison between animation with and without will-change."
    },
    changelog: [{ date: "2026-09-13", change: "Initial publication." }]
  },
  {
    slug: "equal-height-cards-with-flexbox",
    title: "Equal-Height Cards with Flexbox",
    excerpt: "align-items: stretch is the default — equal-height cards are free, not built.",
    description: "Use Flexbox's default align-items: stretch to give a row of cards equal height automatically, then pin each card's button to the bottom with a nested flex context and margin-top: auto.",
    link: {
      label: "Mastering Flexbox Alignment",
      href: "/post/css/mastering-flexbox-alignment"
    },
    category: ["CSS"],
    tags: ["css", "flexbox", "align-items", "layout", "web-design", "frontend"],
    image: {
      path: "/assets/img/goodies/snippets/equal-height-cards-with-flexbox/cover.webp",
      width: 1536,
      height: 1024,
      type: "image/webp",
      alt: "Three pricing cards of equal height in a flex row, with buttons aligned flush at the bottom despite differing amounts of description text."
    },
    changelog: [
      { date: "2026-09-19", change: "Initial publication" }
    ]
  },
  {
    slug: "flexbox-gap-fallback-for-safari",
    title: "Flexbox gap Fallback for Older Safari",
    excerpt: "gap on flex containers only works from Safari 14.1 onward — here's the margin-based fallback.",
    description: "A margin-based fallback for Flexbox gap support in Safari versions older than 14.1, using the adjacent-sibling owl selector and an @supports feature-detection block that switches to real gap once it's available.",
    link: {
      label: "Mastering Flexbox Alignment",
      href: "/post/css/mastering-flexbox-alignment"
    },
    category: ["CSS"],
    tags: ["css", "flexbox", "gap", "browser-support", "progressive-enhancement", "safari"],
    image: {
      path: "/assets/img/goodies/snippets/flexbox-gap-fallback-for-safari/cover.webp",
      width: 1536,
      height: 1024,
      type: "image/webp",
      alt: "A row of flex items with margin-based spacing on one side and gap-based spacing on the other, joined by an @supports feature-detection bracket."
    },
    changelog: [
      { date: "2026-09-19", change: "Initial publication" }
    ]
  },
  {
    slug: "flex-shorthand-explained",
    title: "The flex: 1 1 0% Shorthand Explained",
    excerpt: "flex: 1 is flex: 1 1 0% — and that's not the same thing as flex: auto.",
    description: "A quick-reference card for the flex shorthand's keyword and single-number forms — what each one expands to, and why flex: 1 and flex: auto produce visibly different final widths despite looking almost identical.",
    link: {
      label: "Mastering Flexbox: Sizing Algorithm Deep Dive",
      href: "/post/css/flexbox-sizing-algorithm-deep-dive"
    },
    category: ["CSS"],
    tags: ["css", "flexbox", "flex-grow", "flex-shrink", "flex-basis", "cheatsheet"],
    image: {
      path: "/assets/img/goodies/snippets/flex-shorthand-explained/cover.webp",
      width: 1536,
      height: 1024,
      type: "image/webp",
      alt: "Reference card showing the flex shorthand expanding into flex-grow, flex-shrink, and flex-basis, with flex: 1 and flex: auto compared side by side."
    },
    changelog: [
      { date: "2026-09-19", change: "Initial publication" }
    ]
  },
  {
    slug: "sticky-footer-with-flexbox",
    title: "Sticky Footer with Flexbox",
    excerpt: "min-height: 100vh plus one growable item is the whole trick.",
    description: "A footer that sits at the bottom of the viewport when the page is short, and gets pushed down naturally when it's long, using a min-height: 100vh flex column and flex: 1 0 auto on the content area.",
    link: {
      label: "Getting Started with Flexbox",
      href: "/post/css/getting-started-with-flexbox"
    },
    category: ["CSS"],
    tags: ["css", "flexbox", "flex-grow", "layout", "web-design"],
    image: {
      path: "/assets/img/goodies/snippets/sticky-footer-with-flexbox/cover.webp",
      width: 1536,
      height: 1024,
      type: "image/webp",
      alt: "A page layout diagram showing a header, a growing content area, and a footer pinned flush to the bottom of the viewport."
    },
    changelog: [
      { date: "2026-09-19", change: "Initial publication" }
    ]
  },
  {
    slug: "perfect-centering-with-flexbox",
    title: "Perfect Centering with Flexbox",
    excerpt: "display: flex, align-items: center, justify-content: center — no known width or height required.",
    description: "Center anything on both axes with three Flexbox declarations, plus the newer place-content: center one-liner and why place-items: center doesn't work the same way on a flex container.",
    link: {
      label: "Mastering Flexbox Alignment",
      href: "/post/css/mastering-flexbox-alignment"
    },
    category: ["CSS"],
    tags: ["css", "flexbox", "justify-content", "align-items", "centering", "layout"],
    image: {
      path: "/assets/img/goodies/snippets/perfect-centering-with-flexbox/cover.webp",
      width: 1536,
      height: 1024,
      type: "image/webp",
      alt: "A single box perfectly centered inside a container on both axes, with justify-content and align-items arrows pointing along the horizontal and vertical directions."
    },
    changelog: [
      { date: "2026-09-19", change: "Initial publication" }
    ]
  }
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
