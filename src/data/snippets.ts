import type { Snippet, SnippetNavigation } from "@/interfaces/snippet";

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
    changelog: [
      { date: "2026-08-05", change: "Initial publication with Full Jitter implementation." }
    ]
  },
  {
    slug: "custom-hook-use-debounce",
    title: "Custom Hook: useDebounce",
    excerpt: "Delay updating a value until the user stops typing, in a reusable hook.",
    description: "A generic React hook that debounces any fast-changing value — trim wasted search requests, filtering, and validation runs down to one call per pause in input.",
    category: ["React"],
    tags: [
      "react",
      "hooks",
      "custom-hooks",
      "use-debounce",
      "typescript",
      "performance",
      "search-input",
      "debounce"
    ],
    image: {
      path: "/assets/img/goodies/snippets/custom-hook-use-debounce/cover.png",
      width: 1536,
      height: 1024,
      alt: "Illustration of a search input with keystrokes settling into a single debounced request, representing the useDebounce React hook."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "render-props-vs-hooks",
    title: "Render Props vs. Hooks: Migrating to a Custom Hook",
    excerpt: "Turn a render-prop component into a plain custom hook — same logic, no wrapper element.",
    description: "Migrate a classic function-as-children render-prop component to a custom hook, and see exactly what disappears: the wrapper component, the JSX indirection, and the typed children callback.",
    category: ["React"],
    tags: [
      "react",
      "hooks",
      "render-props",
      "custom-hooks",
      "refactoring",
      "typescript",
      "design-patterns",
      "migration"
    ],
    image: {
      path: "/assets/img/goodies/snippets/render-props-vs-hooks/cover.png",
      width: 1536,
      height: 1024,
      alt: "Side-by-side comparison of a render-prop component wrapping JSX versus a custom hook returning a value directly."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "error-boundary-with-fallback",
    title: "Error Boundary with a Custom Fallback",
    excerpt: "Catch render-time errors in a subtree and show a recoverable fallback instead of a blank screen.",
    description: "Build a reusable ErrorBoundary component with a typed fallback render prop, an onError hook for logging, and a reset function — so one crashing widget doesn't take down the whole page.",
    category: ["React"],
    tags: [
      "react",
      "error-boundary",
      "error-handling",
      "componentDidCatch",
      "typescript",
      "resilience",
      "class-components",
      "fallback-ui"
    ],
    image: {
      path: "/assets/img/goodies/snippets/error-boundary-with-fallback/cover.png",
      width: 1536,
      height: 1024,
      alt: "Illustration of a React component tree with one crashed branch isolated behind a shield, replaced by a fallback error message."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "debounce-throttle",
    title: "Debounce and Throttle, Implemented Correctly",
    excerpt: "The classic pair, with proper this/argument forwarding and a cancel method.",
    description: "Build debounce and throttle from scratch — correct this-binding and argument forwarding via fn.apply, a trailing-call guarantee for throttle, and a cancel() escape hatch for both.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "debounce",
      "throttle",
      "performance",
      "event-handling",
      "closures",
      "typescript",
      "rate-limiting"
    ],
    image: {
      path: "/assets/img/goodies/snippets/debounce-throttle/cover.png",
      width: 1536,
      height: 1024,
      alt: "Comparison of raw, debounced, and throttled event streams, showing how each strategy reduces call frequency differently."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "structured-clone-deep-copy",
    title: "structuredClone() vs. JSON Round-Trip Cloning",
    excerpt: "Native deep cloning, and exactly what the JSON.parse(JSON.stringify()) trick silently breaks.",
    description: "Compare the native structuredClone() API against the classic JSON.parse(JSON.stringify()) trick — Dates, Maps, Sets, undefined values, and circular references handled correctly vs. silently corrupted.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "structuredClone",
      "deep-clone",
      "json",
      "serialization",
      "immutability",
      "circular-reference",
      "browser-apis"
    ],
    image: {
      path: "/assets/img/goodies/snippets/structured-clone-deep-copy/cover.png",
      width: 1536,
      height: 1024,
      alt: "Side-by-side comparison of an object cloned via JSON.stringify losing its Date and Map types versus structuredClone preserving them."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "memoize-function-results",
    title: "Generic Memoization Wrapper with Cache Invalidation",
    excerpt: "Cache expensive pure-function results with a custom resolver, an LRU size cap, and TTL expiry.",
    description: "A reusable memoize() wrapper: a custom key resolver for non-primitive arguments, an LRU-style maxSize eviction policy, and TTL-based expiry — plus clear() and size() for cache invalidation.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "memoization",
      "caching",
      "performance",
      "lru-cache",
      "typescript",
      "pure-functions",
      "optimization"
    ],
    image: {
      path: "/assets/img/goodies/snippets/memoize-function-results/cover.png",
      width: 1536,
      height: 1024,
      alt: "Diagram of a function call flowing into a cache lookup, showing a fast cache-hit path and a slower compute-and-store path."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "event-emitter-from-scratch",
    title: "Event Emitter from Scratch",
    excerpt: "A minimal, fully-typed pub/sub implementation in about 30 lines.",
    description: "Build a typed EventEmitter with on/once/off/emit — event names and payload shapes checked by TypeScript, plus the mid-emit mutation bug most hand-rolled versions get wrong.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "event-emitter",
      "pub-sub",
      "observer-pattern",
      "typescript",
      "design-patterns",
      "decoupling",
      "eventtarget"
    ],
    image: {
      path: "/assets/img/goodies/snippets/event-emitter-from-scratch/cover.png",
      width: 1536,
      height: 1024,
      alt: "Diagram of a publisher broadcasting an event to multiple independent subscribers, illustrating the observer/pub-sub pattern."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "abortcontroller-cancel-fetch",
    title: "Cancelling In-Flight Requests with AbortController",
    excerpt: "The 'latest request wins' pattern that fixes race conditions in search-as-you-type.",
    description: "Fix the classic search-as-you-type race condition — a stale response overwriting a newer one — by aborting the previous in-flight request every time a new one starts.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "abortcontroller",
      "fetch",
      "cancellation",
      "race-conditions",
      "async-await",
      "typescript",
      "search-input"
    ],
    image: {
      path: "/assets/img/goodies/snippets/abortcontroller-cancel-fetch/cover.png",
      width: 1536,
      height: 1024,
      alt: "Timeline showing an earlier in-flight request being aborted the moment a newer request starts, preventing a stale response race condition."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "promise-all-settled-error-handling",
    title: "Handling Partial Failures with Promise.allSettled",
    excerpt: "Promise.all throws away every success the instant one task fails — allSettled doesn't.",
    description: "Compare Promise.all's fail-fast behavior against Promise.allSettled's per-task outcome reporting, plus a small utility that partitions allSettled's results into fulfilled and rejected arrays.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "promises",
      "async-await",
      "promise-allsettled",
      "error-handling",
      "parallel-async",
      "typescript",
      "resilience"
    ],
    image: {
      path: "/assets/img/goodies/snippets/promise-all-settled-error-handling/cover.png",
      width: 1536,
      height: 1024,
      alt: "Comparison of Promise.all discarding all results after one rejection versus Promise.allSettled reporting every task's individual outcome."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "curry-and-compose",
    title: "Curry and Compose: Functional Composition Utilities",
    excerpt: "Build specialized functions from general ones, and chain transformations into a pipeline.",
    description: "A curry() implementation using fn.length to detect arity, plus compose() and pipe() for chaining single-argument transformations — the two primitives functional pipelines are built from.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "currying",
      "function-composition",
      "functional-programming",
      "typescript",
      "pipe",
      "compose",
      "higher-order-functions"
    ],
    image: {
      path: "/assets/img/goodies/snippets/curry-and-compose/cover.png",
      width: 1536,
      height: 1024,
      alt: "Diagram of small single-purpose functions chained together into a left-to-right pipeline, illustrating function composition."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "container-queries-responsive-cards",
    title: "Component-Level Responsiveness with Container Queries",
    excerpt: "@container queries respond to a component's own space, not the browser viewport.",
    description: "Use @container instead of @media to make a component reflow based on its own wrapper's width — so it looks right in a sidebar, a wide column, or a modal alike, regardless of the browser window size.",
    category: ["CSS"],
    tags: [
      "css",
      "container-queries",
      "responsive-design",
      "component-driven",
      "modern-css",
      "layout",
      "design-systems"
    ],
    image: {
      path: "/assets/img/goodies/snippets/container-queries-responsive-cards/cover.png",
      width: 1536,
      height: 1024,
      alt: "A card component reflowing from a stacked layout to a horizontal layout as its own container width increases, independent of the browser viewport."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "scroll-driven-animations",
    title: "Scroll-Driven Animations with animation-timeline",
    excerpt: "A reading-progress bar and scroll-reveal cards, driven entirely by CSS — no scroll listeners.",
    description: "Tie animation progress directly to scroll position with scroll-timeline and animation-timeline: view() — a reading-progress bar and per-element reveal-on-scroll effects with zero JavaScript.",
    category: ["CSS"],
    tags: [
      "css",
      "scroll-driven-animations",
      "animation-timeline",
      "scroll-timeline",
      "parallax",
      "modern-css",
      "performance",
      "scroll-effects"
    ],
    image: {
      path: "/assets/img/goodies/snippets/scroll-driven-animations/cover.png",
      width: 1536,
      height: 1024,
      alt: "A progress bar and a stack of cards animating in sync with scroll position, illustrating CSS scroll-driven animations."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "has-selector-parent-styling",
    title: "Parent-Based Styling with :has()",
    excerpt: "Style a parent based on its children — form validation and empty states without a JS class toggle.",
    description: "The relational :has() pseudo-class lets a parent react to its descendants' state directly: highlight a field wrapper on invalid input, show an empty-state message, or style a selectable card — all without JavaScript flipping a class.",
    category: ["CSS"],
    tags: [
      "css",
      "has-selector",
      "relational-selectors",
      "form-validation",
      "empty-states",
      "modern-css",
      "selectors"
    ],
    image: {
      path: "/assets/img/goodies/snippets/has-selector-parent-styling/cover.png",
      width: 1536,
      height: 1024,
      alt: "A form field wrapper highlighted red because the input inside it is invalid, illustrating the CSS :has() relational selector."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "css-nesting-native",
    title: "Native CSS Nesting vs. Sass",
    excerpt: "Nested selectors without a build step — and the specificity gotcha that comes with them.",
    description: "Native CSS nesting resolves at parse time instead of build time, with the same & parent reference as Sass — plus a real specificity gotcha when the parent selector is a comma-separated list.",
    category: ["CSS"],
    tags: [
      "css",
      "css-nesting",
      "sass",
      "specificity",
      "modern-css",
      "selectors",
      "cascade"
    ],
    image: {
      path: "/assets/img/goodies/snippets/css-nesting-native/cover.png",
      width: 1536,
      height: 1024,
      alt: "Side-by-side comparison of Sass nested selectors requiring a compiler versus native CSS nesting parsed directly by the browser."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "subgrid-alignment",
    title: "Aligning Nested Grids with Subgrid",
    excerpt: "Line up each card's title, body, and footer across a row, no matter how its content length differs.",
    description: "grid-template-rows: subgrid lets a nested grid inherit its parent's row (or column) tracks instead of sizing its own — the fix for card titles/bodies/footers drifting out of alignment across a row.",
    category: ["CSS"],
    tags: [
      "css",
      "subgrid",
      "css-grid",
      "layout",
      "alignment",
      "modern-css",
      "cards"
    ],
    image: {
      path: "/assets/img/goodies/snippets/subgrid-alignment/cover.png",
      width: 1536,
      height: 1024,
      alt: "A row of cards with mismatched title lengths, showing their internal title/body/footer rows snapping into shared aligned tracks via CSS subgrid."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "view-transitions-api",
    title: "Smooth Transitions with the View Transitions API",
    excerpt: "Native shared-element morphing between two page states — no animation library, no FLIP math.",
    description: "document.startViewTransition() and view-transition-name let the browser morph an element between two DOM states automatically — a thumbnail expanding into a detail card, with graceful fallback where unsupported.",
    category: ["CSS"],
    tags: [
      "css",
      "view-transitions-api",
      "view-transition-name",
      "animation",
      "shared-element-transitions",
      "modern-css",
      "javascript"
    ],
    image: {
      path: "/assets/img/goodies/snippets/view-transitions-api/cover.png",
      width: 1536,
      height: 1024,
      alt: "A small color swatch morphing smoothly into a large detail card, illustrating a shared-element transition via the View Transitions API."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "css-layers-cascade-control",
    title: "Managing Specificity Wars with @layer",
    excerpt: "Layer order beats specificity — the fix for utility classes that can't override components.",
    description: "@layer gives the cascade a priority axis that's checked before specificity, so a low-specificity utility class can reliably override a higher-specificity component rule without !important or selector escalation.",
    category: ["CSS"],
    tags: [
      "css",
      "cascade-layers",
      "specificity",
      "at-layer",
      "modern-css",
      "design-systems",
      "cascade"
    ],
    image: {
      path: "/assets/img/goodies/snippets/css-layers-cascade-control/cover.png",
      width: 1536,
      height: 1024,
      alt: "A low-specificity utility class overriding a higher-specificity component rule because it lives in a later CSS cascade layer, illustrating @layer priority."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "parallel-routes-modals",
    title: "Modal-Over-Page Routing with Parallel and Intercepting Routes",
    excerpt: "A modal that's a real page too — overlay on soft navigation, full page on a direct visit.",
    description: "Combine App Router parallel routes (@modal slots) with intercepting routes ((.)folder) to build a modal that opens as an overlay from a click but still renders as a full, shareable, refreshable page on its own.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "app-router",
      "parallel-routes",
      "intercepting-routes",
      "modal",
      "routing",
      "react"
    ],
    image: {
      path: "/assets/img/goodies/snippets/parallel-routes-modals/cover.png",
      width: 1536,
      height: 1024,
      alt: "A photo grid with one item opening as a modal overlay via a soft navigation, while the same URL renders as a full page on direct visit — illustrating Next.js intercepting routes."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "generate-static-params-dynamic",
    title: "generateStaticParams for Dynamic Segments",
    excerpt: "Pre-render the known pages at build time, let dynamicParams decide what happens to the rest.",
    description: "generateStaticParams tells Next.js which dynamic route params to pre-render at build time — paired with dynamicParams and revalidate for ISR-style on-demand rendering and background refresh of the long tail.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "app-router",
      "generateStaticParams",
      "ssg",
      "isr",
      "static-generation",
      "dynamic-routes"
    ],
    image: {
      path: "/assets/img/goodies/snippets/generate-static-params-dynamic/cover.png",
      width: 1536,
      height: 1024,
      alt: "A dynamic route generating a known set of static pages at build time, with additional pages rendered on demand and cached, illustrating generateStaticParams and ISR."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "streaming-with-suspense",
    title: "Streaming with loading.tsx and Suspense",
    excerpt: "Fast parts of a page render instantly — slow parts stream in independently, on their own timeline.",
    description: "loading.tsx gives a route an automatic Suspense boundary; granular <Suspense> around individual slow components streams each one in independently, so the slowest section never blocks the fastest.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "app-router",
      "suspense",
      "streaming",
      "loading-ui",
      "react-19",
      "server-components",
      "performance"
    ],
    image: {
      path: "/assets/img/goodies/snippets/streaming-with-suspense/cover.png",
      width: 1536,
      height: 1024,
      alt: "A page with a header rendering instantly while three independent sections stream in one after another, each inside its own Suspense boundary."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "server-actions-form-mutation",
    title: "Progressive-Enhancement Forms with Server Actions",
    excerpt: "A form that works before JavaScript loads, and gets pending/error states once it does.",
    description: "Wire a Next.js Server Action to a <form> with useActionState and useFormStatus — a genuinely progressively-enhanced form with typed pending state and structured error handling, no manual fetch/useState plumbing.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "server-actions",
      "use-server",
      "useActionState",
      "useFormStatus",
      "forms",
      "react-19",
      "progressive-enhancement"
    ],
    image: {
      path: "/assets/img/goodies/snippets/server-actions-form-mutation/cover.png",
      width: 1536,
      height: 1024,
      alt: "A subscribe form submitting through a Server Action, showing a pending state on the submit button before an inline success message appears."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "middleware-auth-redirect",
    title: "Auth Gating with Edge Middleware",
    excerpt: "One middleware.ts file guards a whole route subtree, before any page even starts running.",
    description: "A middleware.ts that redirects unauthenticated requests to protected routes before they reach any page, with a scoped matcher — plus NextResponse.next() vs. redirect() vs. rewrite() and Edge runtime constraints.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "middleware",
      "edge-runtime",
      "authentication",
      "authorization",
      "app-router",
      "routing"
    ],
    image: {
      path: "/assets/img/goodies/snippets/middleware-auth-redirect/cover.png",
      width: 1536,
      height: 1024,
      alt: "A request being intercepted by edge middleware before reaching a protected route, redirecting to a login page when unauthenticated."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
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
    slug: "color-mix-dynamic-tints",
    title: "Generating Tints and Shades with color-mix()",
    excerpt: "One brand color, a whole palette derived from it — recomputed live, no hardcoded hex ramp.",
    description: "color-mix() blends a base CSS variable toward white or black by any percentage, generating a full tint/shade ramp from a single color that stays in sync automatically when the base color changes.",
    category: ["CSS"],
    tags: [
      "css",
      "color-mix",
      "oklch",
      "design-tokens",
      "theming",
      "modern-css",
      "color-spaces"
    ],
    image: {
      path: "/assets/img/goodies/snippets/color-mix-dynamic-tints/cover.png",
      width: 1536,
      height: 1024,
      alt: "A row of color swatches forming a tint and shade ramp, all generated from a single base color via the CSS color-mix() function."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "text-wrap-balance-pretty",
    title: "Better Line Wrapping with text-wrap: balance / pretty",
    excerpt: "Even-looking headline wraps and no more orphaned last words in paragraphs — no JS, no markup changes.",
    description: "text-wrap: balance evens out headline line lengths; text-wrap: pretty avoids leaving a single short word stranded on a paragraph's last line — two narrow typography fixes with no CSS-only alternative until now.",
    category: ["CSS"],
    tags: [
      "css",
      "text-wrap",
      "typography",
      "balance",
      "pretty",
      "modern-css",
      "line-wrapping"
    ],
    image: {
      path: "/assets/img/goodies/snippets/text-wrap-balance-pretty/cover.png",
      width: 1536,
      height: 1024,
      alt: "A headline wrapping into evenly balanced lines next to a paragraph avoiding a single orphaned word on its last line, illustrating text-wrap: balance and pretty."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "accent-color-native-controls",
    title: "Theming Native Controls with accent-color",
    excerpt: "Brand-matched checkboxes, radios, sliders, and progress bars — without replacing them.",
    description: "The accent-color property themes the checked/filled state of native checkboxes, radios, range sliders, and progress bars to any color, keeping real browser controls with full native behavior and accessibility intact.",
    category: ["CSS"],
    tags: [
      "css",
      "accent-color",
      "forms",
      "native-controls",
      "theming",
      "accessibility",
      "modern-css"
    ],
    image: {
      path: "/assets/img/goodies/snippets/accent-color-native-controls/cover.png",
      width: 1536,
      height: 1024,
      alt: "Native checkboxes, a radio group, a range slider, and a progress bar all themed to a green brand color via the CSS accent-color property."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "css-trigonometric-functions",
    title: "Radial Layouts with CSS Trigonometric Functions",
    excerpt: "sin(), cos(), and atan2() move circular layout math out of JavaScript and into CSS.",
    description: "Native sin()/cos()/atan2() CSS functions for arranging items evenly around a circle and computing angles from a direction — the building blocks for radial layouts, clock-style UI, and pointer/compass indicators.",
    category: ["CSS"],
    tags: [
      "css",
      "trigonometric-functions",
      "sin",
      "cos",
      "atan2",
      "radial-layout",
      "modern-css",
      "calc"
    ],
    image: {
      path: "/assets/img/goodies/snippets/css-trigonometric-functions/cover.png",
      width: 1536,
      height: 1024,
      alt: "A ring of numbered dots evenly spaced around a circle, their positions computed with native CSS sin() and cos() trigonometric functions."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "anchor-positioning-tooltips",
    title: "Native Tooltips with CSS Anchor Positioning",
    excerpt: "Tether a tooltip to its trigger element's edge — no Popper, no Floating UI.",
    description: "anchor-name and position-anchor let CSS tether an element to another element's edge natively, with anchor() reference points and position-try-fallbacks for automatic flip-to-fit — the native answer to what JS positioning libraries solve.",
    category: ["CSS"],
    tags: [
      "css",
      "anchor-positioning",
      "tooltips",
      "popovers",
      "modern-css",
      "floating-ui",
      "positioning"
    ],
    image: {
      path: "/assets/img/goodies/snippets/anchor-positioning-tooltips/cover.png",
      width: 1536,
      height: 1024,
      alt: "Three tooltips tethered to their respective trigger buttons at different edges, illustrating native CSS anchor positioning."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "scope-styling-boundaries",
    title: "Limiting Selector Reach with @scope",
    excerpt: "Reuse generic class names like .title and .button across components with zero collisions.",
    description: "@scope gives a CSS rule an explicit DOM boundary instead of relying on BEM naming or CSS-in-JS generated class names — the same generic .title/.button styled independently per component, plus donut-scoping and proximity-based specificity.",
    category: ["CSS"],
    tags: [
      "css",
      "at-scope",
      "bem",
      "css-in-js",
      "specificity",
      "modern-css",
      "component-styling"
    ],
    image: {
      path: "/assets/img/goodies/snippets/scope-styling-boundaries/cover.png",
      width: 1536,
      height: 1024,
      alt: "Two card components using the identical generic class names .title and .button, styled independently without collision via CSS @scope."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "starting-style-entry-animations",
    title: "Entry Animations with @starting-style",
    excerpt: "Give a freshly-added element an actual 'before' state, so its transition has something to animate from.",
    description: "@starting-style defines a first-render starting state for an element, finally letting transitions run on entry — no display:none hacks or JavaScript double-render tricks, and pairs with allow-discrete to animate display itself.",
    category: ["CSS"],
    tags: [
      "css",
      "starting-style",
      "transitions",
      "entry-animations",
      "allow-discrete",
      "modern-css",
      "toasts"
    ],
    image: {
      path: "/assets/img/goodies/snippets/starting-style-entry-animations/cover.png",
      width: 1536,
      height: 1024,
      alt: "A toast notification fading and sliding into view on its first render, illustrating a CSS @starting-style entry animation."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "use-form-status-pending-ui",
    title: "Nested Pending UI with useFormStatus",
    excerpt: "A submit button, a fieldset, and a banner all react to one form's pending state — no prop-threading.",
    description: "useFormStatus lets any component nested inside a <form> read that form's pending state directly, independently of sibling consumers — no isPending prop threaded down from a parent.",
    category: ["React"],
    tags: [
      "react",
      "useFormStatus",
      "forms",
      "pending-state",
      "react-19",
      "react-dom",
      "hooks"
    ],
    image: {
      path: "/assets/img/goodies/snippets/use-form-status-pending-ui/cover.png",
      width: 1536,
      height: 1024,
      alt: "A form with three independent nested components — a banner, a fieldset, and a submit button — all reacting to the same pending state via useFormStatus."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "react-compiler-memoization",
    title: "What React Compiler Auto-Memoizes (and What Still Needs useMemo)",
    excerpt: "Automatic memoization handles most components — a specific minority of cases still need it by hand.",
    description: "React Compiler automatically inserts the equivalent of useMemo/useCallback/React.memo based on static data-flow analysis — this covers the vast majority of components, but untracked external state and Rules-of-React violations still need manual memoization.",
    category: ["React"],
    tags: [
      "react",
      "react-compiler",
      "useMemo",
      "useCallback",
      "memoization",
      "performance",
      "react-19",
      "build-tools"
    ],
    image: {
      path: "/assets/img/goodies/snippets/react-compiler-memoization/cover.png",
      width: 1536,
      height: 1024,
      alt: "A component's derived values and callbacks being automatically wrapped in memoization by React Compiler at build time, illustrating what it does versus what still needs manual useMemo."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "iterator-helpers-map-filter",
    title: "Native .map()/.filter()/.take() on Iterators",
    excerpt: "Lazy chains directly on any iterator or generator — no array conversion, works on infinite sequences.",
    description: "Iterator helpers put .map(), .filter(), .take(), .drop(), and .flatMap() directly on Iterator.prototype — lazy, chainable, and usable on infinite generators that could never be spread into an array first.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "iterator-helpers",
      "generators",
      "lazy-evaluation",
      "es2025",
      "functional-programming",
      "iterables"
    ],
    image: {
      path: "/assets/img/goodies/snippets/iterator-helpers-map-filter/cover.png",
      width: 1536,
      height: 1024,
      alt: "An infinite generator chained through .filter().map().take(), producing only the values actually requested, illustrating lazy native iterator helpers."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
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
