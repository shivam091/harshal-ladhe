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
