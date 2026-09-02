import type { SandboxMeta } from "@/interfaces/sandbox";

/*
  Registry of every sandbox. Each entry has matching code files read from disk at
  /sandboxes/<slug>/ (see src/lib/sandbox-examples.ts). `entry` sets which file opens as the
  active tab. This drives any sandbox listing and the Sandbox component's metadata lookup.

  Declare newest-first.
*/
export const sandboxes: SandboxMeta[] = [
  {
    slug: "text-wrap-balance-pretty",
    title: "text-wrap: balance / pretty",
    description: "Drag the width slider to compare default wrapping against balance (even headline lines) and pretty (no orphaned last word) at every width.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "color-mix-dynamic-tints",
    title: "Dynamic Tints with color-mix()",
    description: "Pick a base color — a full tint and shade ramp generates live from it via color-mix(), with no stored palette.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "light-dark-color-scheme",
    title: "light-dark()",
    description: "Toggle color-scheme on a panel and watch every light-dark() value re-resolve instantly — background, text, and border, from one declaration each.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "middleware-auth-redirect",
    title: "Edge Middleware: Auth Gating",
    description: "Pick a path and toggle authentication state to see the exact decision a real middleware.ts would make — allow the request through, or redirect to /login.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "server-actions-form-mutation",
    title: "Form Actions",
    description: "A real <form> posting through an action — submit an invalid email to see the error state, then a valid one to see the pending state resolve into success.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "streaming-with-suspense",
    title: "Streaming with Suspense",
    description: "Three sections stream in independently, each on its own delay inside its own Suspense boundary — restart to replay the sequence.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "css-layers-cascade-control",
    title: "@layer Cascade Layers",
    description: "The same low-specificity utility class fails to override a component rule without @layer, and wins reliably with it — side by side, identical selectors.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "view-transitions-api",
    title: "View Transitions API",
    description: "Click a color swatch to watch it morph smoothly into a detail card via view-transition-name — close it to see the reverse morph.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "subgrid-alignment",
    title: "Subgrid Alignment",
    description: "Three cards with mismatched title/body lengths — toggle subgrid to watch their internal rows snap into shared, aligned tracks across the row.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "css-nesting-native",
    title: "Native CSS Nesting",
    description: "Hover, focus, or toggle .active on a card styled entirely by one natively nested CSS rule, shown alongside the demo for reference.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "has-selector-parent-styling",
    title: ":has() — Parent-Based Styling",
    description: "Type an invalid email, add and remove tasks, and select a plan card — three parent elements reacting to their own descendants' state, entirely through :has().",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "scroll-driven-animations",
    title: "Scroll-Driven Animations",
    description: "Scroll the panel — a reading-progress bar and each card's fade-and-slide reveal are both driven purely by CSS scroll/view timelines, no JavaScript.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "container-queries-responsive-cards",
    title: "Container Queries vs. Media Queries",
    description: "Drag a slider to resize just one card's wrapper — the @container card reflows with it while the @media card only reacts to the actual browser viewport.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "curry-and-compose",
    title: "Composable Pipeline",
    description: "Toggle trim, lowercase, reverse, and truncate steps on and off — pipe() runs whichever are enabled, left to right, against your input text.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "promise-all-settled-error-handling",
    title: "Promise.all vs. Promise.allSettled",
    description: "Run six tasks with a ~40% failure rate through both strategies and compare: Promise.all discards everything on the first failure, Promise.allSettled reports every outcome.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "abortcontroller-cancel-fetch",
    title: "Cancelling In-Flight Requests",
    description: "Type quickly into the search box — each keystroke starts a simulated request and aborts whatever was still in flight, so only the latest one can ever resolve.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "event-emitter-from-scratch",
    title: "Event Emitter: Pub/Sub",
    description: "Publish a message and watch only the currently-subscribed listeners receive it — toggle subscribers on and off to see live (un)subscription in action.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "memoize-function-results",
    title: "Memoized Expensive Function",
    description: "Run a deliberately slow computation through a memoize() wrapper — repeat an input to see a near-instant cache hit versus a fresh, visibly slower computation.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "structured-clone-deep-copy",
    title: "structuredClone() vs. JSON Round-Trip",
    description: "Clone a sample object containing a Date, a Map, and an undefined property both ways and compare what survives — toggle a circular reference to see one method throw.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "debounce-throttle",
    title: "Debounce vs. Throttle",
    description: "Move your pointer across the panel and compare how often the raw, debounced, and throttled counters actually increment.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "error-boundary-with-fallback",
    title: "Error Boundary with Fallback",
    description: "Increment a counter that throws at 3 — the error boundary catches the crash and swaps in a fallback UI with a working reset button.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "render-props-vs-hooks",
    title: "Render Prop vs. Hook",
    description: "Toggle between a MouseTracker render-prop component and an equivalent useMousePosition hook — same tracked coordinates, two ways to consume them.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "css-gradient-borders",
    title: "Gradient Border Playground",
    description: "Switch between linear and conic gradient borders, tune thickness and direction, and toggle animation to see the generated background-clip CSS update live.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "css-gradient-text",
    title: "Gradient Text Playground",
    description: "Switch between linear, animated, and stroke gradient text, tune the angle and colors live, and toggle the multi-line wrap fix to see box-decoration-break in action.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "custom-hook-use-debounce",
    title: "useDebounce Search",
    description: "Type into the search box and watch the keystroke count race ahead of the search count — the debounced value (and the search it triggers) only updates once you pause.",
    template: "react-ts",
    entry: "/App.tsx",
  },
  {
    slug: "css-gradient-overlays",
    title: "Hero Overlay Playground",
    description: "Switch between flat, fade, diagonal, radial, and split overlay patterns, tune colors/opacity and angle, and toggle a background-blend-mode live to see how legible the heading stays over a busy photo.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "css-masking-deep-dive",
    title: "CSS Masking Playground",
    description: "Switch between a fade and a spotlight mask, toggle alpha vs. luminance mode to watch the generated gradient stops change, and tune repeat/size live.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "html5-canvas",
    title: "HTML5 Canvas Playground",
    description: "Dozens of particles react to your mouse in real time — toggle particle-to-particle collisions and switch between repel and attract to feel how each force changes the scene.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "css-step-timing-function",
    title: "CSS steps() Playground",
    description: "Compare a linear move against a stepped one live — tune step count, jump term, and duration, plus a matching typewriter reveal.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "css-keyframes-guide",
    title: "CSS Keyframes Playground",
    description: "Tune duration, delay, timing function, iteration count, direction, and fill mode live against a multi-step @keyframes animation.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "mastering-js-observers",
    title: "JavaScript Observers Playground",
    description: "Watch MutationObserver, IntersectionObserver, and ResizeObserver fire live — mutate the DOM, scroll targets into view, and resize a box while the console logs every callback.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "mastering-css-gradients",
    title: "CSS Gradients Playground",
    description: "Switch between linear, radial, and conic gradients, drag the midpoint off 50% to feel an interpolation hint, and toggle OKLCH interpolation live.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-transitions-guide",
    title: "CSS Transitions Playground",
    description: "Tune duration, delay, and timing function (preset, cubic-bezier, or steps) live against a transform + background-color transition.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-logical-properties",
    title: "Logical vs Physical Properties",
    description: "Flip direction and writing mode to see a logical-property card adapt while its physical-property twin stays put.",
    template: "react-ts",
    entry: "/App.tsx"
  },
  {
    slug: "holy-grail-layout",
    title: "Holy Grail Layout",
    description: "Header, two sidebars, main content, and footer — CSS Grid template areas with a responsive mobile stack.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "todo-list",
    title: "Todo List",
    description: "Add, toggle, and remove todos — TypeScript generics, useState with arrays.",
    template: "react-ts",
    entry: "/App.tsx"
  },
  {
    slug: "counter-app",
    title: "React Counter",
    description: "Increment, decrement, and reset a counter — useState fundamentals.",
    template: "react-ts",
    entry: "/App.tsx"
  },
  {
    slug: "async-retry-exponential-backoff",
    title: "Exponential Backoff Retry",
    description: "Simulates a flaky API call retried with doubling, capped delays — watch each attempt in the console.",
    template: "react-ts",
    entry: "/App.tsx"
  },
  {
    slug: "exponential-backoff-with-jitter",
    title: "Jitter vs. No Jitter",
    description: "Six concurrent clients retry a failing request — toggle Full Jitter to see retries scatter instead of stacking.",
    template: "react-ts",
    entry: "/App.tsx"
  },
  {
    slug: "responsive-css-grid-layouts",
    title: "Responsive Grid Playground",
    description: "Shrink the container and drop the card count live to see auto-fit collapse empty tracks while auto-fill keeps reserving space for them, then tune a @container breakpoint to watch a card reflow based on its own width.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "mastering-css-grid",
    title: "Grid Alignment, Spanning & Template Areas Playground",
    description: "Set container-level justify-items/align-items (or the place-items/place-self shorthand), span and self-align a hero item, raise the item count past the explicit grid to watch implicit tracks appear, and switch to the Template Areas tab to swap between named-region layout presets.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "getting-started-with-css-grid",
    title: "CSS Grid Track Builder",
    description: "Tune column count, row height, gap, and item count live to see grid-template-columns and grid-auto-rows reflow the grid.",
    template: "vanilla",
    entry: "/index.html"
  }
];

// Looks up a sandbox's registry entry by slug.
export function getSandboxBySlug(slug: string): SandboxMeta | undefined {
  return sandboxes.find((s) => s.slug === slug);
}
