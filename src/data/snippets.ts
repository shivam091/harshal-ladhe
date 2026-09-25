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
  },
  {
    slug: "polymorphic-box",
    title: "`<Box />`: Type-Safe Polymorphic `as` Prop Component in React",
    excerpt: "Render any element or component with fully inferred, type-safe props.",
    description: "Build a polymorphic Box component in React and TypeScript whose as prop infers the chosen element's props, omits conflicting native props, and forwards refs using React 19's ref-as-prop — with a reusable PolymorphicProps helper.",
    category: ["React"],
    tags: ["react", "components", "polymorphic-components", "as-prop", "generics", "design-systems", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/polymorphic-box/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React Box component morphing between div, anchor, and Link elements under a single as prop."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "error-boundary",
    title: "`<ErrorBoundary />`: Catch Render Errors with Reset & Retry in React",
    excerpt: "Contain render crashes with a fallback UI that can retry and reset.",
    description: "Build a typed class-based ErrorBoundary in React with a fallback render prop receiving error and reset, an onError callback for logging, and resetKeys that auto-recover when data changes — plus how it relates to Next.js error.tsx.",
    category: ["React"],
    tags: ["react", "components", "error-boundary", "error-handling", "resilience", "nextjs", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/error-boundary/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React ErrorBoundary component shielding an app from a crashing widget, with a glowing retry button."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "toast-stack",
    title: "`<ToastProvider />`: Accessible Toast Notification Stack in React",
    excerpt: "Show accessible, auto-dismissing toasts from anywhere via a portal.",
    description: "Build a portal-based toast notification system in React with a ToastProvider and useToast() hook — info, success, and error variants, auto-dismiss with pause on hover and focus, and ARIA live regions for screen-reader announcements.",
    category: ["React"],
    tags: ["react", "components", "toast", "notifications", "context", "portal", "accessibility", "aria-live", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/toast-stack/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React ToastProvider component showing a glowing stack of info, success, and error notifications in the screen corner."
    },
    changelog: [
      { date: "2026-09-24", change: "Initial publication." }
    ]
  },
  {
    slug: "range-number-array",
    title: "`range(start, end, step)`: Generate a Number Array in JavaScript",
    excerpt: "Generate number sequences with an exclusive end, negative steps, and decimals.",
    description: "A typed range(start, end, step) helper for JavaScript and TypeScript — Python-like exclusive end, automatic count-down, negative and decimal steps without floating-point drift, and a RangeError for a zero step.",
    category: ["JavaScript"],
    tags: ["javascript", "typescript", "arrays", "range", "array-from", "utilities"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/range-number-array/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the JavaScript range() helper showing a glowing row of evenly spaced numbers counting up by a step."
    },
    changelog: [
      { date: "2026-09-25", change: "Initial publication." }
    ]
  },
  {
    slug: "random-number-in-range",
    title: "`random(min, max)`: Random Numbers and Integers Within Bounds",
    excerpt: "Get evenly distributed random floats, integers, and array picks within a range.",
    description: "Small random(min, max), randomInt(min, max), and pick() helpers for JavaScript and TypeScript — correct scaling of Math.random(), inclusive integer bounds without off-by-one or rounding bias, and notes on when to reach for crypto instead.",
    category: ["JavaScript"],
    tags: ["javascript", "typescript", "math-random", "random", "utilities", "numbers"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/random-number-in-range/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the JavaScript random() helper showing glowing dice and a number line with a highlighted range between min and max."
    },
    changelog: [
      { date: "2026-09-25", change: "Initial publication." }
    ]
  },
  {
    slug: "sleep-promise-delay",
    title: "`sleep(ms)`: A Promise-Based, Cancellable Delay",
    excerpt: "Await a pause in async code, and cancel it with an AbortSignal.",
    description: "Wrap setTimeout in a promise so async functions and loops can await sleep(ms) — with optional AbortSignal support to cancel pending delays on unmount, plus patterns for polling, rate limiting, and minimum loader times.",
    category: ["JavaScript"],
    tags: ["javascript", "typescript", "async-await", "promises", "settimeout", "abortcontroller", "utilities"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/sleep-promise-delay/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the JavaScript sleep() helper showing a glowing hourglass beside an await keyword on a timeline."
    },
    changelog: [
      { date: "2026-09-25", change: "Initial publication." }
    ]
  },
  {
    slug: "deep-equal-comparator",
    title: "`deepEqual(a, b)`: Structural Equality Without a Library",
    excerpt: "Compare nested objects, arrays, Maps, Sets, and Dates by value — cycles included.",
    description: "A dependency-free deepEqual(a, b) for JavaScript and TypeScript — key-order independent, NaN-safe via Object.is, aware of Date, RegExp, Map, Set, and typed arrays, and guarded against circular references, without JSON.stringify's silent gaps.",
    category: ["JavaScript"],
    tags: ["javascript", "typescript", "deep-equal", "comparison", "objects", "recursion", "utilities"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/deep-equal-comparator/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the JavaScript deepEqual() helper showing two glowing, identical nested object trees connected by an equals sign."
    },
    changelog: [
      { date: "2026-09-25", change: "Initial publication." }
    ]
  },
  {
    slug: "result-type-error-handling",
    title: "`Result<T, E>`: Exception-Free Error Handling in TypeScript",
    excerpt: "Return typed success or failure values instead of throwing invisible exceptions.",
    description: "Model failure in the return type with a Result<T, E> discriminated union in TypeScript — ok() and err() constructors, tryCatch helpers for throwing and async code, and typed error variants the compiler forces every caller to handle.",
    category: ["TypeScript"],
    tags: ["typescript", "error-handling", "result-type", "discriminated-unions", "type-narrowing", "functional-programming"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/result-type-error-handling/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the TypeScript Result type showing a glowing path splitting into an ok branch and an error branch."
    },
    changelog: [
      { date: "2026-09-25", change: "Initial publication." }
    ]
  },
  {
    slug: "branded-types-nominal-ids",
    title: "Branded Types: Nominal IDs and Units in TypeScript",
    excerpt: "Stop mixing up UserId and OrderId with zero-cost compile-time brands.",
    description: "Add nominal typing to TypeScript with a Brand<T, Name> helper built on a unique symbol — incompatible UserId and OrderId strings, validated units like Cents, and type-guard branding, all erased at runtime.",
    category: ["TypeScript"],
    tags: ["typescript", "branded-types", "nominal-typing", "unique-symbol", "type-guards", "type-safety"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/branded-types-nominal-ids/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of TypeScript branded types showing two identical glowing strings stamped with different UserId and OrderId labels."
    },
    changelog: [
      { date: "2026-09-25", change: "Initial publication." }
    ]
  },
  {
    slug: "deep-partial-deep-readonly",
    title: "`DeepPartial<T>` and `DeepReadonly<T>`: Recursive Utility Types",
    excerpt: "Make every nested field optional or readonly, not just the top level.",
    description: "Recursive DeepPartial<T> and DeepReadonly<T> utility types for TypeScript — conditional types that skip primitives, dates, and functions, and correctly handle nested objects, arrays, Maps, and Sets for config overrides, fixtures, and immutable state.",
    category: ["TypeScript"],
    tags: ["typescript", "utility-types", "conditional-types", "mapped-types", "immutability", "recursion"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/deep-partial-deep-readonly/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of TypeScript DeepPartial and DeepReadonly types showing a glowing nested object tree with lock and question-mark icons on every level."
    },
    changelog: [
      { date: "2026-09-25", change: "Initial publication." }
    ]
  },
  {
    slug: "prettify-type-helper",
    title: "`Prettify<T>`: Flatten Intersection Types for Readable Tooltips",
    excerpt: "Turn T & U & Omit<...> hovers into one flat, readable object type.",
    description: "A one-line Prettify<T> helper for TypeScript that resolves intersections, Omit, and Pick into a single flat object type — so editor hovers, autocompletion, and error messages show the final properties instead of the type expression.",
    category: ["TypeScript"],
    tags: ["typescript", "utility-types", "mapped-types", "intersection-types", "developer-experience"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/prettify-type-helper/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the TypeScript Prettify helper showing a tangled stack of intersected types flattening into one clean glowing object tooltip."
    },
    changelog: [
      { date: "2026-09-25", change: "Initial publication." }
    ]
  },
  {
    slug: "non-empty-array-type",
    title: "`NonEmptyArray<T>`: Arrays With at Least One Element",
    excerpt: "Prove an array isn't empty with a tuple type and a narrowing guard.",
    description: "Encode \"at least one item\" in TypeScript with a NonEmptyArray<T> variadic tuple, an isNonEmpty type guard, and an assertNonEmpty assertion function — so items[0] is safely typed and empty-list bugs are caught at the boundary.",
    category: ["TypeScript"],
    tags: ["typescript", "tuples", "type-guards", "assertion-functions", "arrays", "type-safety"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/non-empty-array-type/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the TypeScript NonEmptyArray type showing a glowing array whose first slot is locked in place and always filled."
    },
    changelog: [
      { date: "2026-09-25", change: "Initial publication." }
    ]
  },
  {
    slug: "scale-on-hover-pseudo-element",
    title: "Scale-on-Hover With a Pseudo-Element, Without Distorting Content",
    excerpt: "Grow a card's background on hover while its text stays crisp and still.",
    description: "Scale a ::before background layer instead of the element itself for hover and press effects in CSS — no blurred or shifting text, no growing icons or borders, with isolation: isolate, focus-visible parity, and reduced-motion support.",
    category: ["CSS"],
    tags: ["css", "hover-effects", "transform", "pseudo-elements", "isolation", "micro-interactions", "prefers-reduced-motion"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/scale-on-hover-pseudo-element/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a CSS card whose glowing background layer scales up on hover while the text on top stays sharp and unchanged."
    },
    changelog: [
      { date: "2026-09-25", change: "Initial publication." }
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
