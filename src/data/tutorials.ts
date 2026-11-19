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
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
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
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
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
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
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
      { date: "2026-11-15", change: "Added cross-reference to tutorial '`contrast-color()`: Automatic Readable Text on Any Background'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-08", change: "Added cross-reference to tutorial 'Theming Native Controls with `accent-color`'" },
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
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
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
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-11-01", change: "Added cross-reference to tutorial 'CSS Custom Functions with `@function`: Reusable Logic Without Sass'" },
      { date: "2026-09-10", change: "Initial publication." }
    ]
  },
  {
    slug: "fluid-typography-and-spacing",
    title: "Fluid Typography and Spacing with `clamp()`",
    excerpt: "One clamp() declaration scales type, padding, and gaps smoothly — no breakpoint ladder.",
    description: "clamp(min, preferred, max) — with a preferred value built from rem plus a viewport or container-relative unit — scales font-size, padding, and gaps continuously between a floor and ceiling instead of jumping at fixed breakpoints, replacing a media-query ladder with one line per property.",
    category: ["CSS"],
    tags: ["css", "fluid-typography", "clamp", "responsive-design", "container-queries", "container-units", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/fluid-typography-and-spacing/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "HD colorful infographic titled “Fluid Typography and Spacing with clamp()”, showing responsive mobile, tablet, and desktop layouts, a CSS clamp() code example, and visual explanations of fluid type, spacing, radii, container units, and accessibility.",
      caption: "Type and spacing scaling smoothly from phone to tablet to desktop."
    },
    changelog: [
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-11-01", change: "Added cross-reference to tutorial 'CSS Custom Functions with `@function`: Reusable Logic Without Sass'" },
      { date: "2026-10-18", change: "Added tag 'container-units'" },
      { date: "2026-10-18", change: "Added cross-reference to post 'CSS Container Queries Deep Dive: Named Containers, `cqi` Units, and Style Queries'" },
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
    changelog: [
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-08", change: "Added cross-reference to post 'Mastering CSS z-index: Stacking Contexts, isolation, and Layering Bugs'" },
      { date: "2026-09-13", change: "Initial publication." }
    ]
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
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
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
      { date: "2026-11-02", change: "Added cross-reference to tutorial 'Pure CSS Carousels with `::scroll-marker` and `::scroll-button()`'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
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
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-09-19", change: "Initial publication." }
    ]
  },
  {
    slug: "css-if-conditional-values",
    title: "Conditional CSS Values with the `if()` Function",
    excerpt: "Swap CSS values by media, supports, or style conditions.",
    description: "The if() function picks between several values inside one CSS declaration based on a media(), supports(), or style() condition — collapsing what used to require duplicating an entire rule under @media/@supports, or a JS class toggle, into one line, with a fallback for browsers that don't support it yet.",
    category: ["CSS"],
    tags: ["css", "if-function", "conditional-css", "css-custom-properties", "css-functions", "media-queries", "progressive-enhancement", "browser-support", "css-2025", "style-queries"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-if-conditional-values/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A priority badge changing color based on a custom property, driven entirely by an if(style(...)) conditional value in the stylesheet.",
      caption: "A priority badge changing colour from a single if() value."
    },
    changelog: [
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-11-01", change: "Added cross-reference to tutorial 'CSS Custom Functions with `@function`: Reusable Logic Without Sass'" },
      { date: "2026-10-25", change: "Added cross-reference to tutorial 'HTML Attributes as Real CSS Values with Typed `attr()`'" },
      { date: "2026-10-18", change: "Added tag 'style-queries'" },
      { date: "2026-10-18", change: "Added cross-reference to post 'CSS Container Queries Deep Dive: Named Containers, `cqi` Units, and Style Queries'" },
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
      { date: "2026-11-02", change: "Added cross-reference to tutorial 'Animating `height: auto` in CSS with `interpolate-size`'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-11-01", change: "Added cross-reference to tutorial 'Auto-Growing Textareas with CSS `field-sizing: content`'" },
      { date: "2026-10-31", change: "Added cross-reference to post 'CSS Cascade Layers (`@layer`): End Specificity Wars in Large Codebases'" },
      { date: "2026-10-08", change: "Added cross-reference to tutorial 'Theming Native Controls with `accent-color`'" },
      { date: "2026-10-08", change: "Added cross-reference to post 'Mastering CSS z-index: Stacking Contexts, isolation, and Layering Bugs'" },
      { date: "2026-09-30", change: "Initial publication." }
    ]
  },
  {
    slug: "sibling-index-count-functions",
    title: "CSS-Only Staggered Animations with `sibling-index()` and `sibling-count()`",
    excerpt: "Stagger animations from each element's own position, without JavaScript.",
    description: "sibling-index() and sibling-count() give an element its own 1-based position and its sibling total directly inside calc() — replacing the JavaScript loop that sets a --i custom property, with fixed-step and fixed-total staggers, index-driven colours and rotations, fallbacks, and reduced-motion handling.",
    category: ["CSS"],
    tags: ["css", "sibling-index", "sibling-count", "tree-counting-functions", "staggered-animation", "animation-delay", "css-animation", "css-functions", "progressive-enhancement", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/sibling-index-count-functions/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "CSS-only staggered animation concept showing a list of elements with progressively delayed motion, illustrating sibling-index() and sibling-count() for position-based animation timing without JavaScript.",
      caption: "List items animating in one after another, timed by their position alone."
    },
    changelog: [
      { date: "2026-11-10", change: "Added cross-reference to post 'What's New in CSS in 2026: What You Can Use Now'" },
      { date: "2026-11-10", change: "Updated browser support for `sibling-index()` and `sibling-count()`" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-25", change: "Added cross-reference to tutorial 'HTML Attributes as Real CSS Values with Typed `attr()`'" },
      { date: "2026-10-08", change: "Added cross-reference to post 'Mastering CSS z-index: Stacking Contexts, isolation, and Layering Bugs'" },
      { date: "2026-10-02", change: "Initial publication." }
    ]
  },
  {
    slug: "accent-color-native-controls",
    title: "Theming Native Controls with `accent-color`",
    excerpt: "Theme native checkboxes, radios and sliders with one property.",
    description: "The accent-color property themes the checked and filled parts of native checkboxes, radio buttons, switches, range sliders and progress bars — including their indeterminate states — while keeping real browser controls with full native behaviour and accessibility, plus how it pairs with color-scheme and what it leaves alone.",
    category: ["CSS"],
    tags: ["css", "accent-color", "forms", "native-controls", "theming", "accessibility", "modern-css"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/accent-color-native-controls/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover for “Theming Native Controls with accent-color”, showing a green-accented checkbox, radio button, switch, range slider and progress bar beside a row of accent colour swatches.",
      caption: "Native checkboxes, radios, sliders and progress bars recoloured with one property."
    },
    changelog: [
      { date: "2026-11-15", change: "Added cross-reference to tutorial '`contrast-color()`: Automatic Readable Text on Any Background'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-11-01", change: "Added cross-reference to tutorial 'Auto-Growing Textareas with CSS `field-sizing: content`'" },
      { date: "2026-10-27", change: "Added cross-reference to tutorial 'Styling a `<select>` Dropdown with CSS `appearance: base-select`'" },
      { date: "2026-10-08", change: "Initial publication." }
    ]
  },
  {
    slug: "css-corner-shape",
    title: "Squircles, Bevels and Scoops with `corner-shape`",
    excerpt: "Shape corners into squircles, bevels, scoops and notches.",
    description: "The corner-shape property gives border-radius corners a shape — round, squircle, square, bevel, scoop, notch or any superellipse() — with borders, shadows and outlines that follow it, per-corner values, smooth animation, and an automatic rounded fallback in browsers without support.",
    category: ["CSS"],
    tags: ["css", "corner-shape", "border-radius", "shapes", "ui-design", "css-animation", "progressive-enhancement", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-corner-shape/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Vibrant CSS corner-shape tutorial cover showing a gradient squircle alongside colourful 3D examples of bevel, scoop, notch, round, and square corners, with a CSS code snippet and feature highlights on a blue-purple gradient background.",
      caption: "Squircle, bevel, scoop and notch corners shaped with corner-shape."
    },
    changelog: [
      { date: "2026-11-12", change: "Updated browser support for `corner-shape`" },
      { date: "2026-11-12", change: "Added cross-reference to post 'What's New in CSS in 2027: What to Expect'" },
      { date: "2026-11-04", change: "Added cross-reference to tutorial 'The CSS `shape()` Function: Responsive `clip-path` Shapes'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-17", change: "Initial publication." }
    ]
  },
  {
    slug: "css-attr-content-tooltips",
    title: "CSS-Only Tooltips with `attr()` and `content`",
    excerpt: "Styled, keyboard-friendly tooltips from one HTML attribute — no JavaScript.",
    description: "Build CSS-only tooltips that read their text from an HTML attribute with content: attr() — positioned with a ::after pseudo-element, given an arrow, revealed on hover and keyboard focus, flipped below the element and kept gentle under reduced motion — plus the accessibility limits and pitfalls to know before shipping one.",
    category: ["CSS"],
    tags: ["css", "tooltips", "attr", "pseudo-elements", "data-attributes", "focus-visible", "accessibility", "ui-components"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-attr-content-tooltips/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "CSS-only tooltips using attr() and content, featuring a styled “Save changes” tooltip, HTML and CSS code examples, and keyboard-friendly accessibility highlights on a vibrant gradient background.",
      caption: "A tooltip whose text is read straight from an HTML attribute."
    },
    changelog: [
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-31", change: "Added cross-reference to tutorial 'Colouring a CSS `text-overflow` Ellipsis Separately from Its Text'" },
      { date: "2026-10-25", change: "Initial publication." }
    ]
  },
  {
    slug: "css-typed-attr",
    title: "HTML Attributes as Real CSS Values with Typed `attr()`",
    excerpt: "Read HTML attributes as CSS colours, lengths and numbers.",
    description: "Typed attr() reads an HTML attribute as a real CSS value — type(<color>), type(<integer>), a unit like % or px, or raw-string — for any property on any element, not just text in content. Covers fallbacks for missing or invalid values, patterns for layout, transitions and view transitions, safe fallbacks in browsers without support, and when a custom property is the better choice.",
    category: ["CSS"],
    tags: ["css", "attr", "css-functions", "data-attributes", "custom-properties", "progressive-enhancement", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-typed-attr/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A vibrant gradient cover illustrating typed CSS attr(), showing HTML attributes transforming into real CSS values such as colours, lengths, and numbers, with code snippets and colourful UI elements on a dark background.",
      caption: "HTML attributes turning into real CSS colours, lengths and numbers."
    },
    changelog: [
      { date: "2026-11-12", change: "Added cross-reference to post 'What's New in CSS in 2027: What to Expect'" },
      { date: "2026-11-11", change: "Updated browser support for typed `attr()`" },
      { date: "2026-11-11", change: "Added cross-reference to post 'Interop 2026 and CSS Snapshot 2026: What They Mean for CSS'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-26", change: "Added cross-reference to tutorial 'Animate and Type-Check CSS Variables with `@property`'" },
      { date: "2026-10-25", change: "Initial publication." }
    ]
  },
  {
    slug: "typed-custom-properties-at-property",
    title: "Animate and Type-Check CSS Variables with `@property`",
    excerpt: "Give CSS custom properties real types so they animate.",
    description: "Register CSS custom properties (CSS variables) with @property — a syntax, an inherits rule and an initial value — so they animate in transitions and keyframes, fall back safely on invalid values and always have a default. Covers rotating gradients, counting numbers and per-axis motion, CSS.registerProperty(), performance, browser fallbacks and common pitfalls.",
    category: ["CSS"],
    tags: ["css", "at-property", "custom-properties", "css-animation", "transition", "keyframes", "gradients", "houdini", "progressive-enhancement"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/typed-custom-properties-at-property/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "CSS @property tutorial cover featuring animated gradient rings, typed custom property code, syntax examples, and smooth animation highlights.",
      caption: "Gradient rings animating smoothly through typed custom properties."
    },
    changelog: [
      { date: "2026-11-09", change: "Added cross-reference to snippet 'SVG Circular Progress Ring with CSS Variables'" },
      { date: "2026-11-04", change: "Added cross-reference to tutorial 'The CSS `shape()` Function: Responsive `clip-path` Shapes'" },
      { date: "2026-11-02", change: "Added cross-reference to tutorial 'Animating `height: auto` in CSS with `interpolate-size`'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-11-01", change: "Added cross-reference to tutorial 'CSS Custom Functions with `@function`: Reusable Logic Without Sass'" },
      { date: "2026-10-26", change: "Initial publication." }
    ]
  },
  {
    slug: "css-customizable-select",
    title: "Styling a `<select>` Dropdown with CSS `appearance: base-select`",
    excerpt: "Style a real select's dropdown, options and arrow.",
    description: "appearance: base-select opts a native <select> into a fully styleable mode — rich HTML in options, <selectedcontent> in the closed button, and ::picker(select), ::picker-icon and ::checkmark for the dropdown, arrow and tick — while keeping its keyboard support, accessibility and form behaviour, with a plain select as the fallback.",
    category: ["CSS"],
    tags: ["css", "customizable-select", "forms", "anchor-positioning", "accessibility", "progressive-enhancement", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-customizable-select/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "CSS customizable select tutorial cover featuring a styled dropdown with color swatches, CSS and HTML code examples, keyboard accessibility, and vibrant green, yellow, and orange gradients.",
      caption: "A fully styled select dropdown with colour swatches, still keyboard accessible."
    },
    changelog: [
      { date: "2026-11-19", change: "Added cross-reference to tutorial 'The `:open` Pseudo-Class for `<details>`, `<dialog>` and `<select>`'" },
      { date: "2026-11-12", change: "Updated browser support for `appearance: base-select`" },
      { date: "2026-11-12", change: "Added cross-reference to post 'What's New in CSS in 2027: What to Expect'" },
      { date: "2026-11-06", change: "Added cross-reference to post 'Animate Dialogs & Popovers with CSS `@starting-style`'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-27", change: "Initial publication." }
    ]
  },
  {
    slug: "colored-text-overflow-ellipsis",
    title: "Colouring a CSS `text-overflow` Ellipsis Separately from Its Text",
    excerpt: "Give truncated text's ellipsis a colour of its own.",
    description: "Change the colour of a CSS text-overflow: ellipsis without faking it — the dots take their styles from the truncating container, so an inline span can colour the text separately. Covers the truncation basics, flex and grid items, multi-line line-clamp, detecting truncation in JavaScript, accessibility and common pitfalls.",
    category: ["CSS"],
    tags: ["css", "text-overflow", "text-truncation", "line-clamp", "typography", "flexbox", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/colored-text-overflow-ellipsis/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Colourful CSS tutorial cover showing how to style text-overflow ellipses separately from text, with code examples, orange ellipsis dots, and vibrant gradient backgrounds.",
      caption: "A truncated line whose ellipsis is coloured apart from its text."
    },
    changelog: [
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-31", change: "Initial publication." }
    ]
  },
  {
    slug: "css-custom-functions-at-function",
    title: "CSS Custom Functions with `@function`: Reusable Logic Without Sass",
    excerpt: "Native, reusable CSS functions with parameters — no Sass needed.",
    description: "Define native CSS custom functions with @function: typed parameters, defaults, fallbacks for older browsers, how they differ from Sass, and when to use them.",
    category: ["CSS"],
    tags: ["css", "at-function", "css-functions", "custom-properties", "scss", "design-tokens", "progressive-enhancement", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-custom-functions-at-function/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Multiple card components sharing one --space() @function-defined spacing scale, all updating together as a base-unit slider is dragged.",
      caption: "Cards sharing one spacing scale defined with a CSS @function."
    },
    changelog: [
      { date: "2026-11-12", change: "Updated browser support for `@function`" },
      { date: "2026-11-12", change: "Added cross-reference to post 'What's New in CSS in 2027: What to Expect'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-11-01", change: "Initial publication." }
    ]
  },
  {
    slug: "field-sizing-content-textarea",
    title: "Auto-Growing Textareas with CSS `field-sizing: content`",
    excerpt: "Auto-grow textareas with one line of CSS, no JavaScript.",
    description: "Make a textarea grow and shrink with its text using CSS field-sizing: content: no scrollHeight JavaScript, plus size limits, fallbacks and browser support.",
    category: ["CSS"],
    tags: ["css", "field-sizing", "forms", "native-controls", "progressive-enhancement", "accessibility", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/field-sizing-content-textarea/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover graphic for auto-growing textareas with CSS field-sizing: content, comparing a growing and a fixed textarea.",
      caption: "A textarea growing with its content beside a fixed-height one."
    },
    changelog: [
      { date: "2026-11-10", change: "Added cross-reference to post 'What's New in CSS in 2026: What You Can Use Now'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-11-01", change: "Initial publication." }
    ]
  },
  {
    slug: "interpolate-size-auto-animations",
    title: "Animating `height: auto` in CSS with `interpolate-size`",
    excerpt: "Animate height to auto in pure CSS, no JavaScript.",
    description: "Animate height: auto in CSS with interpolate-size and calc-size(): smooth accordions and details panels without JavaScript, plus fallbacks and reduced motion.",
    category: ["Animations"],
    tags: ["css", "interpolate-size", "transition", "css-animation", "ui-components", "accessibility", "progressive-enhancement", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/interpolate-size-auto-animations/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover graphic for animating height auto in CSS with interpolate-size, showing a 3D accordion opening and a snap versus smooth chart.",
      caption: "An accordion opening smoothly to its natural height, rather than snapping."
    },
    changelog: [
      { date: "2026-11-06", change: "Added cross-reference to post 'Animate Dialogs & Popovers with CSS `@starting-style`'" },
      { date: "2026-11-02", change: "Initial publication." }
    ]
  },
  {
    slug: "native-css-carousel-scroll-markers",
    title: "Pure CSS Carousels with `::scroll-marker` and `::scroll-button()`",
    excerpt: "Build carousel dots and arrows with pure CSS.",
    description: "Build CSS-only carousel dots and prev/next arrows with ::scroll-marker, ::scroll-button() and :target-current: no JavaScript, plus accessibility and fallbacks.",
    category: ["CSS"],
    tags: ["css", "carousel", "scroll-snap", "scroll-marker", "pseudo-elements", "ui-components", "accessibility", "progressive-enhancement", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/native-css-carousel-scroll-markers/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "CSS carousel with sunset mountain slides, navigation arrows, indicator dots, and code for ::scroll-marker and ::scroll-button()",
      caption: "A carousel with arrows and indicator dots, built without JavaScript."
    },
    changelog: [
      { date: "2026-11-02", change: "Initial publication." }
    ]
  },
  {
    slug: "shape-function-clip-path",
    title: "The CSS `shape()` Function: Responsive `clip-path` Shapes",
    excerpt: "Cut responsive curved shapes with CSS shape() and clip-path.",
    description: "Draw responsive clip-path shapes with the CSS shape() function: lines, curves and arcs in %, calc() and custom properties, plus browser support and fallbacks.",
    category: ["CSS"],
    tags: ["css", "clip-path", "shape-function", "css-functions", "custom-properties", "progressive-enhancement", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/shape-function-clip-path/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover graphic for the CSS shape() function, showing a curved speech bubble with editable points and the same shape at three widths.",
      caption: "A speech bubble whose curved tail is drawn with CSS shape()."
    },
    changelog: [
      { date: "2026-11-11", change: "Added cross-reference to post 'Interop 2026 and CSS Snapshot 2026: What They Mean for CSS'" },
      { date: "2026-11-10", change: "Added cross-reference to post 'What's New in CSS in 2026: What You Can Use Now'" },
      { date: "2026-11-04", change: "Initial publication." }
    ]
  },
  {
    slug: "set-methods-union-intersection",
    title: "Native JavaScript Set Methods: union, intersection and difference",
    excerpt: "Compare two Sets natively, with no array conversion.",
    description: "Compare JavaScript Sets with native union(), intersection(), difference() and more: usage, browser support, edge cases and a fallback.",
    category: ["JavaScript"],
    tags: ["javascript", "set-methods", "data-structures", "es2025", "polyfills"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/set-methods-union-intersection/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Infographic illustrating native JavaScript Set methods: union, intersection, difference, and symmetric difference, with Venn diagrams and code examples for comparing two Sets without array conversion.",
      caption: "Two role sets compared with native Set methods."
    },
    changelog: [
      { date: "2026-11-14", change: "Added cross-reference to post 'Backwards-Compatible JavaScript: Polyfills and Baseline'" },
      { date: "2026-11-04", change: "Initial publication." }
    ]
  },
  {
    slug: "array-fromasync-async-iterables",
    title: "Collecting Async Iterables into Arrays with `Array.fromAsync()`",
    excerpt: "Collect any async iterable into an array, one await.",
    description: "Use JavaScript's Array.fromAsync() to collect async generators and iterables into an array: mapping, error handling, sequential vs Promise.all, and browser support.",
    category: ["JavaScript"],
    tags: ["javascript", "array-fromasync", "async-await", "async-iterators", "promises", "async-javascript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/array-fromasync-async-iterables/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "An async generator handing back paginated results one at a time, collected into a single array by Array.fromAsync().",
      caption: "Three pages from an async generator collected into one array, beside the loop it replaces, its one-at-a-time timing and its all-or-nothing errors."
    },
    changelog: [
      { date: "2026-11-14", change: "Added cross-reference to post 'Backwards-Compatible JavaScript: Polyfills and Baseline'" },
      { date: "2026-11-12", change: "Added cross-reference to post 'What's New in ES2027: Temporal, using and More'" },
      { date: "2026-11-11", change: "Added cross-reference to post 'What's New in ES2026: Every Feature Explained'" },
      { date: "2026-11-07", change: "Initial publication." }
    ]
  },
  {
    slug: "css-contrast-color",
    title: "`contrast-color()`: Automatic Readable Text on Any Background",
    excerpt: "Let CSS choose readable white or black text automatically.",
    description: "Use CSS contrast-color() to pick white or black text for any background colour: how the spec defines it, custom properties and brand colours, buttons and tags, pairing with light-dark(), mid-tone limits, and an @supports fallback.",
    category: ["CSS"],
    tags: ["css", "contrast-color", "accessibility", "wcag", "css-functions", "design-tokens", "light-dark", "progressive-enhancement", "css-2027"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-contrast-color/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover titled contrast-color(): Automatic Readable Text on Any Background, showing eight colour cards from yellow to navy, each with a large Aa sample in black or white and a black or white label, above the rule color: contrast-color(var(--bg)).",
      caption: "Eight background colours, each with black or white text chosen by one contrast-color() rule."
    },
    changelog: [
      { date: "2026-11-15", change: "Initial publication." }
    ]
  },
  {
    slug: "css-custom-highlight-api",
    title: "CSS Custom Highlight API: `::highlight()` for Search Results",
    excerpt: "Highlight search matches with CSS without touching the DOM.",
    description: "Highlight search results with the CSS Custom Highlight API: ::highlight(), CSS.highlights, StaticRange, priority, accessibility and a mark fallback.",
    category: ["CSS"],
    tags: ["css", "custom-highlight-api", "text-search", "pseudo-elements", "web-apis", "dom", "accessibility", "progressive-enhancement", "css-2026"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-custom-highlight-api/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover titled CSS Custom Highlight API: ::highlight() for Search Results, showing a code card with new Range(), new Highlight(range), CSS.highlights.set() and a ::highlight() rule, beside a search box for light at match 2 of 5 over a paragraph with every match highlighted yellow and the current match orange, and a panel reading 0 mark elements added.",
      caption: "Search matches painted with ::highlight(), with 0 mark elements added to the DOM."
    },
    changelog: [
      { date: "2026-11-16", change: "Initial publication." }
    ]
  },
  {
    slug: "css-open-pseudo-class",
    title: "The `:open` Pseudo-Class for `<details>`, `<dialog>` and `<select>`",
    excerpt: "Style anything that opens, selects included, with one pseudo-class.",
    description: "Style the open state of <details>, <dialog> and <select> with the CSS :open pseudo-class. Compare it with [open], :popover-open and :modal, with fallbacks.",
    category: ["CSS"],
    tags: ["css", "open-pseudo-class", "pseudo-classes", "details-element", "dialog", "customizable-select", "starting-style", "progressive-enhancement", "css-2027"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-open-pseudo-class/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "The CSS :open pseudo-class for details, dialog and select: three cards showing a Shipping disclosure, a Choose a plan drop-down and a Delete this draft dialog, each in its closed and open state.",
      caption: "Disclosures, drop-downs and dialogs styled in their open state with one pseudo-class."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  }
];

// Array-order based rather than git-dated so the lookups stay client-safe — git can't be read in the browser.
export const { getBySlug: getTutorialBySlug, getNavigation: getTutorialNavigation } = createContentLookup(tutorials);
