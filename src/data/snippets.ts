import { createContentLookup, type ContentEntry } from "@/data/content";

// Snippet registry entries share their shape with tutorials — see @/data/content.
export type Snippet = ContentEntry;

/*
  Registry of every snippet. Each entry has a matching content file at
  app/(site)/(internal)/snippet/<slug>/page.mdx. This drives the /snippets list,
  the detail chrome, and prev/next nav.

  Note: publish / last-modified dates come from git history at build time
  (lib/snippets.ts for the list; the remark-content-metadata plugin for the detail).
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
    slug: "use-pointer-position",
    title: "`usePointerPosition`: Track Cursor & Touch Position in React",
    excerpt: "Track pointer position across mouse, touch, and pen input.",
    description: "Build a usePointerPosition hook using the Pointer Events API to track pointer coordinates in React state — one listener covers mouse, touch, and stylus input, with a useMousePosition alias for drop-in compatibility.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "usePointerPosition", "useMousePosition", "pointer-events", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-pointer-position/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React usePointerPosition hook tracking cursor and touch coordinates across mouse, touch, and pen input, with viewport and element-relative pointer tracking examples."
    },
    changelog: [
      { date: "2026-09-23", change: "Initial publication." }
    ]
  },
  {
    slug: "use-boop",
    title: "`useBoop`: Add Springy Hover Micro-Interactions in React",
    excerpt: "Add a brief, springy boop effect to any element on hover or press.",
    description: "Build a dependency-free useBoop hook that applies a transient spring-like transform (translate, rotate, scale) on hover or click, then settles back — with built-in prefers-reduced-motion support.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "useBoop", "animation", "micro-interactions", "accessibility", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-boop/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React useBoop hook giving icons a springy wiggle and bounce on hover, with transform and cubic-bezier spring curve visuals."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-prefers-reduced-motion",
    title: "`usePrefersReducedMotion`: Respect Motion Preferences in React",
    excerpt: "Check the user's reduced-motion setting before firing any animation.",
    description: "Build an SSR-safe usePrefersReducedMotion hook with useSyncExternalStore that tracks the prefers-reduced-motion media query live, defaulting to reduced motion on the server for accessible animations.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "usePrefersReducedMotion", "accessibility", "prefers-reduced-motion", "useSyncExternalStore", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-prefers-reduced-motion/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React usePrefersReducedMotion hook detecting the OS reduce-motion setting and pausing animations, with media query and accessibility icons."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-sticky-state",
    title: "`useStickyState`: Persist State to localStorage in React",
    excerpt: "A drop-in useState that remembers its value between visits.",
    description: "Build a minimal useStickyState hook that mirrors the useState API while automatically persisting the value to localStorage — ideal for UI preferences like sidebar and view-mode settings.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "useStickyState", "localStorage", "state-management", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-sticky-state/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React useStickyState hook saving component state to localStorage and restoring it after a page refresh."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-has-mounted",
    title: "`useHasMounted`: Avoid Hydration Mismatches in React",
    excerpt: "Detect client-side mount to render browser-only content safely.",
    description: "Build a useHasMounted hook and ClientOnly wrapper that defer browser-only rendering until after hydration, preventing SSR hydration mismatch errors in React and Next.js.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "useHasMounted", "ssr", "hydration", "nextjs", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-has-mounted/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React useHasMounted hook bridging server-rendered HTML and client hydration, with a ClientOnly wrapper deferring browser-only content."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-toggle",
    title: "`useToggle`: Stable Boolean State Toggling in React",
    excerpt: "Manage boolean state with a stable toggle, set, and reset API.",
    description: "Build a useToggle hook that returns a boolean plus referentially stable toggle, set, and reset actions — safe to pass directly to onClick handlers and memoized children.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "useToggle", "useCallback", "state-management", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-toggle/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React useToggle hook flipping a boolean switch on and off, with stable toggle, set, and reset action controls."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-interval-and-timeout",
    title: "`useInterval` & `useTimeout`: Declarative, Stale-Free Timers in React",
    excerpt: "Run intervals and timeouts that always see the latest state.",
    description: "Build useInterval and useTimeout hooks with the saved-callback ref pattern — declarative setInterval/setTimeout wrappers that never read stale state, pause with a null delay, and expose reset/clear controls with automatic cleanup.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "useInterval", "useTimeout", "timers", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-interval-and-timeout/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React useInterval and useTimeout hooks, showing a ticking clock and countdown timer driven by a saved callback ref with pause and reset controls."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-retry-until-resolved",
    title: "`useRetryUntilResolved`: Retry & Poll Async Operations in React",
    excerpt: "Retry an async operation with backoff until it succeeds or gives up.",
    description: "Build a useRetryUntilResolved hook that polls or retries async work with a fixed interval or exponential backoff, caps attempts, passes an AbortSignal to each try, and cancels cleanly on unmount.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "useRetryUntilResolved", "polling", "retry", "exponential-backoff", "abort-controller", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-retry-until-resolved/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React useRetryUntilResolved hook retrying an async request with exponential backoff, showing pending, resolved, and failed states with an attempt counter."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-debounced-value",
    title: "`useDebouncedValue`: Debounce Fast-Changing Values in React",
    excerpt: "Update a value only after it stops changing.",
    description: "Build a useDebouncedValue hook that delays updates until a value has settled — perfect for search-as-you-type, autosave, and live validation without firing a request on every keystroke.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "useDebouncedValue", "debounce", "performance", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-debounced-value/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React useDebouncedValue hook smoothing rapid keystrokes in a search input into a single delayed API request."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-local-storage",
    title: "`useLocalStorage`: Synced, SSR-Safe Persistent State in React",
    excerpt: "Persist state to localStorage and keep it in sync across tabs and components.",
    description: "Build a full-featured useLocalStorage hook with useSyncExternalStore — SSR-safe reads, safe JSON parsing, functional updates, a remove() helper, and automatic sync across browser tabs and hook instances.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "useLocalStorage", "localStorage", "useSyncExternalStore", "ssr", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-local-storage/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React useLocalStorage hook persisting state to browser storage and syncing values across multiple tabs and components."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-intersection-observer",
    title: "`useIntersectionObserver`: Detect Element Visibility in React",
    excerpt: "Track when elements enter or leave the viewport.",
    description: "Build a useIntersectionObserver hook that wraps the IntersectionObserver API with a callback ref, threshold, root, rootMargin, and freezeOnceVisible — ideal for lazy loading, scroll reveals, and infinite scroll.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "useIntersectionObserver", "intersection-observer", "lazy-loading", "scroll-animation", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-intersection-observer/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React useIntersectionObserver hook detecting elements entering the viewport to lazy-load images and trigger scroll-reveal animations."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-media-query",
    title: "`useMediaQuery`: Subscribe to CSS Media Queries in React",
    excerpt: "Turn any CSS media query into live, SSR-safe React state.",
    description: "Build a useMediaQuery hook with useSyncExternalStore that tracks any CSS media query in React state, re-subscribes when the query changes, and returns a predictable server default to avoid hydration mismatches.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "useMediaQuery", "useSyncExternalStore", "media-queries", "responsive-design", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-media-query/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React useMediaQuery hook subscribing to CSS media queries, with breakpoint, prefers-color-scheme, and pointer: coarse examples switching UI in real time."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-copy-to-clipboard",
    title: "`useCopyToClipboard`: Copy Text with Instant Feedback in React",
    excerpt: "Copy text to the clipboard with a self-resetting \"copied\" status.",
    description: "Build a useCopyToClipboard hook around navigator.clipboard.writeText that exposes a transient copied/error status, captures failures, and manages its reset timer across repeated clicks and unmounts.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "useCopyToClipboard", "clipboard-api", "accessibility", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-copy-to-clipboard/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React useCopyToClipboard hook copying text with a copy button that flips to a transient \"Copied!\" confirmation and announces it via an aria-live region."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-event-listener",
    title: "`useEventListener`: Leak-Free, Typed DOM Events in React",
    excerpt: "Attach typed DOM listeners that clean themselves up automatically.",
    description: "Build a useEventListener hook with typed overloads for window, document, and element refs that keeps the latest handler in a ref, supports passive and capture options, and removes listeners automatically on cleanup.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "useEventListener", "dom-events", "event-listeners", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-event-listener/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React useEventListener hook attaching and detaching DOM event listeners on window, document, and element refs, with Escape-key and passive scroll examples."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "use-previous",
    title: "`usePrevious`: Compare Current and Previous Values in React",
    excerpt: "Capture a value from the previous render to detect how it changed.",
    description: "Build a usePrevious hook to read a value from the previous render, plus a render-safe usePreviousDistinct alternative that follows the React docs pattern for storing information from previous renders.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "usePrevious", "useRef", "state-management", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-previous/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React usePrevious hook comparing current and previous values, with a counter showing change direction and a price ticker flashing on updates."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "visually-hidden",
    title: "`<VisuallyHidden />`: Accessible Screen-Reader-Only Content in React",
    excerpt: "Hide content visually while keeping it available to screen readers.",
    description: "Build a VisuallyHidden React component that uses the clip/clip-path sr-only pattern to label icon-only buttons and visual-only cues for assistive technology, with a dev-only Alt-key toggle to reveal hidden labels.",
    category: ["React"],
    tags: ["react", "components", "VisuallyHidden", "accessibility", "a11y", "screen-readers", "sr-only", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/visually-hidden/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React VisuallyHidden component hiding a text label from view while a screen reader still announces it, next to an icon-only button."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "in-portal",
    title: "`<InPortal />`: SSR-Safe Portals for Modals & Tooltips in React",
    excerpt: "Render modals, tooltips, and dropdowns outside clipping ancestors safely.",
    description: "Build an SSR-safe InPortal component around React's createPortal that waits for mount, targets any container or element id, and creates and cleans up its own host node, so overlays escape overflow and z-index traps.",
    category: ["React"],
    tags: ["react", "components", "InPortal", "createPortal", "portals", "modals", "ssr", "nextjs", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/in-portal/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React InPortal component moving a modal and tooltip out of a clipped container into a separate layer at the document body."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "fade-in",
    title: "`<FadeIn />`: Reduced-Motion-Friendly Entrance Animations in React",
    excerpt: "Fade and slide content in on mount with a few simple props.",
    description: "Build a FadeIn React wrapper powered by CSS keyframes, with duration, delay, direction, and distance props, backwards fill mode for staggered lists, and an automatic opacity-only fallback for prefers-reduced-motion.",
    category: ["React"],
    tags: ["react", "components", "FadeIn", "animation", "css-keyframes", "prefers-reduced-motion", "accessibility", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/fade-in/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React FadeIn component showing staggered cards fading and sliding into place, with direction arrows and a reduced-motion toggle."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "shift-by",
    title: "`<ShiftBy />`: Pixel-Perfect Optical Alignment in React",
    excerpt: "Nudge elements by a few pixels without affecting layout.",
    description: "Build a tiny ShiftBy React component that uses transform: translate() to optically align icons and glyphs, moving what's drawn without the layout side effects of margins or relative positioning.",
    category: ["React"],
    tags: ["react", "components", "ShiftBy", "optical-alignment", "css-transforms", "design-details", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/shift-by/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React ShiftBy component nudging a play icon a few pixels inside a round button, with guide lines comparing mathematical and optical centering."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "compound-tabs",
    title: "Compound `<Tabs />`: Accessible, Composable Tabs with Context in React",
    excerpt: "Build accessible tabs from composable parts that share state through context.",
    description: "Build a compound Tabs component in React with Tabs.List, Tabs.Trigger, and Tabs.Panel sharing state via context — controlled or uncontrolled, with useId-based ARIA wiring, a roving tabindex, and Arrow/Home/End keyboard navigation.",
    category: ["React"],
    tags: ["react", "components", "compound-components", "context", "tabs", "accessibility", "aria", "keyboard-navigation", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/compound-tabs/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React Tabs compound component with a glowing tab list, active trigger, and linked content panel."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  }
];

/*
  getSnippetBySlug looks up a single snippet by its slug. getSnippetNavigation
  returns its previous/next neighbours by this array's order (client-safe —
  used by the snippet layout, which can't read git dates in the browser). The
  registry is oldest-first (new snippets appended to the end), so "previous"
  is the entry just before (older) and "next" is the one just after (newer).
*/
export const { getBySlug: getSnippetBySlug, getNavigation: getSnippetNavigation } = createContentLookup(snippets);
