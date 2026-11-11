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
      alt: "Diagram showing a webpage layout with header, footer, two sidebars, and a center content area."
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
      alt: "Illustration of exponential retry logic showing a circular retry loop, increasing delays, and a digital countdown timer."
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
      alt: "Visualization of exponential backoff with jitter, showing randomized retry intervals over time to prevent synchronized retries."
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
      alt: "One-Line Theme-Aware Colors with light-dark() cover showing light and dark mode interfaces, CSS code, and automatic theme switching."
    },
    changelog: [
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
      alt: "Padding Around the Notch with env() cover showing a smartphone notch and home indicator with CSS safe-area-inset code."
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
      alt: "min(), max(), and clamp() CSS infographic showing value comparison, responsive sizing, safe-area insets, and CSS code without media queries."
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
    tags: ["css", "fluid-typography", "clamp", "responsive-design", "container-queries", "container-units", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/fluid-typography-and-spacing/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "HD colorful infographic titled “Fluid Typography and Spacing with clamp()”, showing responsive mobile, tablet, and desktop layouts, a CSS clamp() code example, and visual explanations of fluid type, spacing, radii, container units, and accessibility."
    },
    changelog: [
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
      alt: "A modern dark-themed illustration explaining CSS will-change, showing layer promotion with smooth animation, a CSS code example, performance tips, and a comparison between animation with and without will-change."
    },
    changelog: [
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
      alt: "Dynamic viewport units (dvh, svh, and lvh) illustrated on three mobile screens, showing how each unit represents the dynamic, small, and large viewport heights."
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
      alt: "Dynamic viewport width units (dvw, svw, and lvw) illustrated with three mobile screens, showing large, small, and dynamic viewport widths, with a CSS example demonstrating a full-bleed section."
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
      alt: "HD cover illustration for ‘Viewport Inline & Block Units: vi and vb’, showing CSS vi and vb viewport units adapting between horizontal and vertical writing modes, with logical inline and block axes highlighted."
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
    tags: ["css", "if-function", "conditional-css", "css-custom-properties", "css-functions", "media-queries", "progressive-enhancement", "browser-support", "css-2025", "style-queries"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-if-conditional-values/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A priority badge changing color based on a custom property, driven entirely by an if(style(...)) conditional value in the stylesheet."
    },
    changelog: [
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
      alt: "A modern CSS reset tutorial cover showing a “Before” browser layout with default styles and an “After Reset” layout with clean, consistent styling, alongside CSS code and visual highlights for box sizing, margin removal, typography, media and form controls, transitions, and stacking contexts."
    },
    changelog: [
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
      alt: "CSS-only staggered animation concept showing a list of elements with progressively delayed motion, illustrating sibling-index() and sibling-count() for position-based animation timing without JavaScript."
    },
    changelog: [
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
      alt: "Cover for “Theming Native Controls with accent-color”, showing a green-accented checkbox, radio button, switch, range slider and progress bar beside a row of accent colour swatches."
    },
    changelog: [
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
      alt: "Vibrant CSS corner-shape tutorial cover showing a gradient squircle alongside colourful 3D examples of bevel, scoop, notch, round, and square corners, with a CSS code snippet and feature highlights on a blue-purple gradient background."
    },
    changelog: [
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
      alt: "CSS-only tooltips using attr() and content, featuring a styled “Save changes” tooltip, HTML and CSS code examples, and keyboard-friendly accessibility highlights on a vibrant gradient background."
    },
    changelog: [
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
      alt: "A vibrant gradient cover illustrating typed CSS attr(), showing HTML attributes transforming into real CSS values such as colours, lengths, and numbers, with code snippets and colourful UI elements on a dark background."
    },
    changelog: [
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
      alt: "CSS @property tutorial cover featuring animated gradient rings, typed custom property code, syntax examples, and smooth animation highlights."
    },
    changelog: [
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
      alt: "CSS customizable select tutorial cover featuring a styled dropdown with color swatches, CSS and HTML code examples, keyboard accessibility, and vibrant green, yellow, and orange gradients."
    },
    changelog: [
      { date: "2026-10-27", change: "Added cross-references to posts 'Mastering CSS z-index: Stacking Contexts, isolation, and Layering Bugs' and 'An Interactive Guide to CSS Transitions'" },
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
      alt: "Colourful CSS tutorial cover showing how to style text-overflow ellipses separately from text, with code examples, orange ellipsis dots, and vibrant gradient backgrounds."
    },
    changelog: [
      { date: "2026-10-31", change: "Added cross-references to post 'Responsive CSS Grid Layouts: `fr` Units, `minmax()`, `auto-fill`, and `auto-fit` Explained' and tutorial 'CSS-Only Tooltips with `attr()` and `content`'" },
      { date: "2026-10-31", change: "Initial publication." }
    ]
  },
  {
    slug: "css-custom-functions-at-function",
    title: "Reusable CSS Logic with @function",
    excerpt: "A real, live CSS function — reusable logic without a Sass mixin or a build step.",
    description: "@function defines a reusable, parameterized CSS function directly in a stylesheet — the same DRY win a Sass @function/mixin gives, minus the build step, and able to re-evaluate live against runtime custom property changes a compiled Sass value never could.",
    category: ["CSS"],
    tags: ["css", "at-function", "custom-properties", "sass", "css-2025", "design-systems"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-custom-functions-at-function/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Multiple card components sharing one --space() @function-defined spacing scale, all updating together as a base-unit slider is dragged."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "native-css-masonry-layout",
    title: "Native CSS Masonry with grid-template-rows: masonry",
    excerpt: "Pinterest-style packed columns, one Grid property, no JS measuring pass.",
    description: "grid-template-rows: masonry packs variable-height grid items tightly into whichever column is currently shortest, in source order — replacing a JS masonry library's measure-then-reposition pass or a column-count hack that breaks reading order.",
    category: ["CSS"],
    tags: ["css", "grid", "masonry", "layout", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/native-css-masonry-layout/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A gallery of variable-height tiles packed tightly into three columns using grid-template-rows: masonry, compared against a plain grid layout with gaps."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "field-sizing-content-textarea",
    title: "Auto-Growing Textareas with field-sizing: content",
    excerpt: "The scrollHeight-measuring JS every auto-grow textarea has shipped, replaced by one CSS line.",
    description: "field-sizing: content sizes a textarea (or input) to its own content, growing and shrinking as the user types — replacing the scrollHeight-measuring input listener that's been the only way to build an auto-growing text field until now.",
    category: ["CSS"],
    tags: ["css", "forms", "textarea", "field-sizing", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/field-sizing-content-textarea/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Two textareas side by side — one growing automatically with typed content via field-sizing: content, the other a plain fixed-size textarea scrolling internally."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "native-css-carousel-scroll-markers",
    title: "CSS-Only Carousel Pagination with ::scroll-marker",
    excerpt: "Dots and prev/next arrows generated from a scroll-snap container — zero JS.",
    description: "::scroll-marker and ::scroll-button() generate a carousel's pagination dots and navigation arrows directly from a scroll-snap container, with the active dot tracked automatically via :target-current — replacing the JS a carousel library exists purely to provide.",
    category: ["CSS"],
    tags: ["css", "carousel", "scroll-snap", "pagination", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/native-css-carousel-scroll-markers/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A horizontally scrolling carousel with pagination dots and circular prev/next arrows, all generated by CSS ::scroll-marker and ::scroll-button()."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "shape-function-clip-path",
    title: "Path-Based clip-path with the shape() Function",
    excerpt: "SVG-style path commands as real CSS syntax — calc() and custom properties work inside.",
    description: "The shape() function brings SVG-style path drawing commands (line to, curve to, arc to) into real CSS function syntax, letting calc() and custom properties drive individual coordinates — something path()'s static SVG path-data string can never do.",
    category: ["CSS"],
    tags: ["css", "clip-path", "shape-function", "svg", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/shape-function-clip-path/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A speech bubble shape with a movable tail, its clip-path drawn using the shape() function with a calc()-driven coordinate."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "interpolate-size-auto-animations",
    title: "Animating Height to auto with interpolate-size",
    excerpt: "The one CSS line that makes height:auto genuinely animatable — no JS measuring.",
    description: "interpolate-size: allow-keywords makes height/width transitions to and from auto (and min-content/max-content/fit-content) directly animatable, replacing the grid-template-rows 0fr-to-1fr trick and scrollHeight-measuring JS every accordion has needed until now.",
    category: ["CSS"],
    tags: ["css", "animations", "transitions", "accordion", "layout", "css-2025"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/interpolate-size-auto-animations/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "An accordion panel smoothly animating its height between 0 and its natural auto content height."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "array-fromasync-async-iterables",
    title: "Array.fromAsync() for Async Iterables",
    excerpt: "Collects an async generator's yielded values into a real array in one call.",
    description: "Array.fromAsync() awaits an entire async iterable — a generator, a paginated fetch loop, a ReadableStream — and collects it into a real array, replacing the manual for-await-of loop pushing into an accumulator.",
    category: ["JavaScript"],
    tags: ["javascript", "async-await", "generators", "iterables", "esnext", "arrays"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/array-fromasync-async-iterables/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "An async generator yielding paginated results one at a time, collected into a single array by Array.fromAsync()."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "promise-try-uniform-error-handling",
    title: "Promise.try() for Uniform Sync/Async Error Handling",
    excerpt: "Catches a synchronous throw and an async rejection in the exact same .catch().",
    description: "A function that's usually async can still throw synchronously before returning a promise, which plain .then()/.catch() chaining won't catch. Promise.try() wraps the call so both a synchronous throw and an asynchronous rejection land in the same .catch(), without an async IIFE wrapper.",
    category: ["JavaScript"],
    tags: ["javascript", "promises", "error-handling", "async-await", "esnext"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/promise-try-uniform-error-handling/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A validate() function that throws synchronously in one case and returns a rejected promise in another, both caught by the same Promise.try().catch() chain."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "set-methods-union-intersection",
    title: "Native Set union, intersection, and difference",
    excerpt: "Set algebra methods replace the spread-filter-rebuild pattern for comparing two Sets.",
    description: "Set.prototype.union/intersection/difference/symmetricDifference/isSubsetOf/isSupersetOf/isDisjointFrom compute standard set operations directly, replacing the array-spread-and-filter pattern that's been the only way to compare two Sets until now.",
    category: ["JavaScript"],
    tags: ["javascript", "set", "data-structures", "esnext", "algorithms"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/set-methods-union-intersection/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Two role permission sets compared with native Set methods — union, intersection, and difference results shown for each."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "immutable-array-methods",
    title: "toSorted, toReversed, toSpliced, and with() — Immutable Array Updates",
    excerpt: "Every mutating array method now has a non-mutating twin that returns a new array.",
    description: "toSorted(), toReversed(), toSpliced(), and with() are non-mutating counterparts to sort(), reverse(), splice(), and index assignment — returning a new array instead of mutating in place, replacing the spread-into-a-copy-first pattern immutable state (React, Redux) has always needed.",
    category: ["JavaScript"],
    tags: ["javascript", "arrays", "immutability", "react", "esnext", "state-management"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/immutable-array-methods/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "An original array left unchanged after several non-mutating method calls, each producing a new array shown side by side."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "uint8array-base64-native",
    title: "Native Base64 Encoding with Uint8Array",
    excerpt: "Uint8Array.fromBase64/toBase64 fix btoa()'s original sin: it never understood real bytes.",
    description: "btoa()/atob() only accept Latin1 'binary strings' and throw on Unicode text. Uint8Array.prototype.toBase64()/fromBase64() operate on real bytes, working correctly for any text via TextEncoder/TextDecoder, no unescape/encodeURIComponent hack required.",
    category: ["JavaScript"],
    tags: ["javascript", "base64", "uint8array", "text-encoder", "binary-data", "esnext"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/uint8array-base64-native/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Side-by-side comparison of btoa() throwing on unicode text versus Uint8Array.prototype.toBase64() encoding it correctly."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "import-attributes-json",
    title: "Importing JSON as a Module with Import Attributes",
    excerpt: "Standard `with { type: \"json\" }` syntax, replacing bundler-specific JSON import magic.",
    description: "Import attributes make importing a JSON file standard ES module syntax — with { type: \"json\" } tells the loader explicitly how to interpret the file, portable across bundlers and runtimes instead of relying on bundler-specific resolution.",
    category: ["JavaScript"],
    tags: ["javascript", "es-modules", "import-attributes", "json", "esnext", "modules"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/import-attributes-json/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A config.json file imported directly as an ES module using the with type json import attribute, its parsed values rendered on the page."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "css-progress-function",
    title: "Mapping Ranges in CSS with `progress()`",
    excerpt: "Turn any value into a 0-to-1 number and scale anything with it.",
    description: "Use CSS progress() to find where a value sits between two others and map it onto any range: fluid type, container-aware components, colour mixing, fallbacks and pitfalls.",
    category: ["CSS"],
    tags: ["css", "progress-function", "css-functions", "fluid-typography", "container-units", "responsive-design", "modern-css", "progressive-enhancement"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-progress-function/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A card in a resizable container whose heading size, padding and accent colour change together, driven by one progress() value between 0 and 1."
    },
    changelog: [
      { date: "2026-11-11", change: "Initial publication." }
    ]
  },
  {
    slug: "css-text-decoration-inset",
    title: "Shorter, Longer and Animated Underlines with `text-decoration-inset`",
    excerpt: "Move the ends of a real underline, no pseudo-elements needed.",
    description: "Use CSS text-decoration-inset to shorten, extend or shift underlines and strike-throughs, animate an underline from the centre, and fall back cleanly where it isn't supported.",
    category: ["CSS"],
    tags: ["css", "text-decoration", "typography", "underline", "css-animation", "microinteractions", "modern-css", "progressive-enhancement"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-text-decoration-inset/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Navigation links whose underlines grow from the centre on hover, above a heading with a shortened underline and a price with an extended strike-through."
    },
    changelog: [
      { date: "2026-11-11", change: "Initial publication." }
    ]
  },
  {
    slug: "css-animation-trigger",
    title: "Scroll-Triggered Animations with `animation-trigger`",
    excerpt: "Play an animation when it scrolls into view, without JavaScript.",
    description: "Use CSS timeline-trigger and animation-trigger to play, reverse, pause or replay animations as elements scroll into view, with trigger-scope, fallbacks and the pitfalls to avoid.",
    category: ["CSS"],
    tags: ["css", "animation-trigger", "scroll-animation", "css-animation", "view-timeline", "intersection-observer", "modern-css", "progressive-enhancement"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-animation-trigger/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cards in a scrolling list sliding into place one by one as each becomes fully visible, each driven by its own timeline trigger."
    },
    changelog: [
      { date: "2026-11-11", change: "Initial publication." }
    ]
  },
  {
    slug: "css-border-shape",
    title: "Non-Rectangular Borders with CSS `border-shape`",
    excerpt: "Draw a real border, background and shadow along any shape.",
    description: "Use CSS border-shape to draw borders along polygons, circles and shape() paths, fill between two shapes, keep shadows that follow the outline, and fall back where it isn't supported.",
    category: ["CSS"],
    tags: ["css", "border-shape", "borders", "shapes", "shape-function", "clip-path", "modern-css", "progressive-enhancement"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/tutorials/css-border-shape/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A hexagon, a speech bubble and a pointed tag, each with a border and shadow that follow the shape, beside a clip-path version that cuts them off."
    },
    changelog: [
      { date: "2026-11-11", change: "Initial publication." }
    ]
  }
];

// Array-order based rather than git-dated so the lookups stay client-safe — git can't be read in the browser.
export const { getBySlug: getTutorialBySlug, getNavigation: getTutorialNavigation } = createContentLookup(tutorials);
