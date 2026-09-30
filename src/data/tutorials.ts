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
      { date: "2026-09-19", change: "Added cross-reference to tutorial 'Dynamic Viewport Height Units'" },
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
    link: {
      label: "Read the full post: Mastering Asynchronous JavaScript",
      href: "/post/javascript/mastering-async-javascript"
    },
    changelog: [
      { date: "2026-09-12", change: "Added cross-reference to post 'Mastering Asynchronous JavaScript: Callbacks, Promises, and Async/Await'" },
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
    link: {
      label: "Read the full post: Mastering Asynchronous JavaScript",
      href: "/post/javascript/mastering-async-javascript"
    },
    changelog: [
      { date: "2026-09-12", change: "Added cross-reference to post 'Mastering Asynchronous JavaScript: Callbacks, Promises, and Async/Await'" },
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
  },
  {
    slug: "min-max-clamp-functions",
    title: "`min()`, `max()`, and `clamp()` — CSS's Value-Bounding Functions",
    excerpt: "Three comparison functions that pick a value from a rule, without a single media query.",
    description: "min(), max(), and clamp() pick the smallest, largest, or a bounded value from a list of CSS expressions at the point of use, replacing media-query-driven overrides for readable measures, safe-area-aware insets, and bounded widths with one declaration each.",
    category: ["CSS"],
    tags: ["css", "clamp", "min-max", "responsive-design", "css-functions", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/min-max-clamp-functions/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "min(), max(), and clamp() CSS infographic showing value comparison, responsive sizing, safe-area insets, and CSS code without media queries.",
      caption: "Values bounded by min(), max() and clamp(), with no media queries needed."
    },
    changelog: [
      { date: "2026-09-10", change: "Initial publication." }
    ]
  },
  {
    slug: "fluid-typography-and-spacing",
    title: "Fluid Typography and Spacing with `clamp()`",
    excerpt: "One clamp() declaration scales type, padding, and gaps smoothly — no breakpoint ladder.",
    description: "clamp(min, preferred, max) — with a preferred value built from rem plus a viewport or container-relative unit — scales font-size, padding, and gaps continuously between a floor and ceiling instead of jumping at fixed breakpoints, replacing a media-query ladder with one line per property.",
    category: ["CSS"],
    tags: ["css", "fluid-typography", "clamp", "responsive-design", "container-queries", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/fluid-typography-and-spacing/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "HD colorful infographic titled “Fluid Typography and Spacing with clamp()”, showing responsive mobile, tablet, and desktop layouts, a CSS clamp() code example, and visual explanations of fluid type, spacing, radii, container units, and accessibility.",
      caption: "Type and spacing scaling smoothly from phone to tablet to desktop."
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
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/will-change-property/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A modern dark-themed illustration explaining CSS will-change, showing layer promotion with smooth animation, a CSS code example, performance tips, and a comparison between animation with and without will-change.",
      caption: "An element promoted to its own layer for smoother animation."
    },
    changelog: [{ date: "2026-09-13", change: "Initial publication." }]
  },
  {
    slug: "dynamic-viewport-height-units",
    title: "Dynamic Viewport Height Units: `dvh`, `svh`, and `lvh`",
    excerpt: "Tracks the mobile address bar's actual visible height live.",
    description: "100vh has always meant the LARGEST possible viewport on mobile, so content sits behind the address bar until it's scrolled away. svh assumes the smallest viewport, lvh assumes the largest, and dvh is the only one of the three that tracks the browser chrome's actual current state, live.",
    category: ["CSS"],
    tags: ["css", "viewport-units", "dvh", "responsive-design", "mobile", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/dynamic-viewport-height-units/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Dynamic viewport units (dvh, svh, and lvh) illustrated on three mobile screens, showing how each unit represents the dynamic, small, and large viewport heights.",
      caption: "Small, large and dynamic viewport heights as mobile browser bars show and hide."
    },
    changelog: [
      { date: "2026-09-19", change: "Initial publication." }
    ]
  },
  {
    slug: "dynamic-viewport-width-units",
    title: "Dynamic Viewport Width Units: `dvw`, `svw`, and `lvw`",
    excerpt: "Width-axis siblings of dvh/svh/lvh, useful for full-bleed breakouts.",
    description: "dvw, svw, and lvw mirror dvh/svh/lvh onto the width axis, but the browser chrome that makes dvh diverge from vh is a vertical UI element — so on virtually every current browser, all four width units render identically. Where they actually earn their place is different: full-bleed breakouts and edge-to-edge mobile carousels, not a live-resizing address bar.",
    category: ["CSS"],
    tags: ["css", "viewport-units", "dvw", "full-bleed", "responsive-design", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/dynamic-viewport-width-units/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Dynamic viewport width units (dvw, svw, and lvw) illustrated with three mobile screens, showing large, small, and dynamic viewport widths, with a CSS example demonstrating a full-bleed section.",
      caption: "Small, large and dynamic viewport widths behind a full-bleed section."
    },
    changelog: [
      { date: "2026-09-19", change: "Initial publication." }
    ]
  },
  {
    slug: "dynamic-viewport-inline-block-units",
    title: "Viewport Inline & Block Units: `vi` and `vb`",
    excerpt: "Viewport units that follow text flow, not fixed axes.",
    description: "vi and vb behave like vw and vh in the default horizontal-tb writing mode, but unlike vw/vh they aren't tied to a fixed screen direction — switch to a vertical writing mode and the two swap, with vi tracking height and vb tracking width. They also resolve against the root element's writing-mode specifically, never a locally-scoped one, which is the detail most likely to trip someone up.",
    category: ["CSS"],
    tags: ["css", "viewport-units", "logical-properties", "writing-modes", "i18n", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/dynamic-viewport-inline-block-units/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "HD cover illustration for ‘Viewport Inline & Block Units: vi and vb’, showing CSS vi and vb viewport units adapting between horizontal and vertical writing modes, with logical inline and block axes highlighted.",
      caption: "vi and vb units following the inline and block axes across writing modes."
    },
    changelog: [
      { date: "2026-09-19", change: "Initial publication." }
    ]
  },
  {
    slug: "css-if-conditional-values",
    title: "Conditional CSS Values with the `if()` Function",
    excerpt: "Swap CSS values by media, supports, or style conditions.",
    description: "The if() function picks between several values inside one CSS declaration based on a media(), supports(), or style() condition — collapsing what used to require duplicating an entire rule under @media/@supports, or a JS class toggle, into one line, with a fallback for browsers that don't support it yet.",
    category: ["CSS"],
    tags: ["css", "if-function", "conditional-css", "css-custom-properties", "css-functions", "media-queries", "progressive-enhancement", "browser-support", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-if-conditional-values/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A priority badge changing color based on a custom property, driven entirely by an if(style(...)) conditional value in the stylesheet.",
      caption: "A priority badge changing colour from a single if() value."
    },
    changelog: [
      { date: "2026-09-27", change: "Initial publication." }
    ]
  },
  {
    slug: "modern-css-reset",
    title: "A Modern CSS Reset, Explained Rule by Rule",
    excerpt: "A small, modern reset, and the reason behind every line.",
    description: "A compact modern CSS reset, explained rule by rule: border-box sizing, margin removal, keyword animations with interpolate-size, readable line-height, block-level media, form controls that inherit your font, overflow-wrap and text-wrap for better line breaks, and an isolated stacking context — plus optional extras and the edge cases to watch for.",
    category: ["CSS"],
    tags: ["css", "css-reset", "box-sizing", "interpolate-size", "text-wrap", "modern-css", "best-practices", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/modern-css-reset/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A modern CSS reset tutorial cover showing a “Before” browser layout with default styles and an “After Reset” layout with clean, consistent styling, alongside CSS code and visual highlights for box sizing, margin removal, typography, media and form controls, transitions, and stacking contexts.",
      caption: "A page before and after a modern reset smooths out browser defaults."
    },
    changelog: [
      { date: "2026-09-30", change: "Initial publication." }
    ]
  }
];

// Array-order based rather than git-dated so the lookups stay client-safe — git can't be read in the browser.
export const { getBySlug: getTutorialBySlug, getNavigation: getTutorialNavigation } = createContentLookup(tutorials);
