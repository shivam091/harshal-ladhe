// Static metadata for one runnable sandbox example — resolved server-side from its slug.
export interface SandboxMeta {
  slug: string;
  title: string;
  description: string;
  template: "react-ts" | "react" | "vanilla-ts" | "vanilla";
  entry: string;
  /*
    Absolute paths (e.g. "/shared/utils.ts") locked to view-only individually, behaving like the
    sandbox-wide read-only flag. Optional.
  */
  readOnlyFiles?: string[];
}

/*
  Each entry needs matching code files under /sandboxes/<slug>/; `entry` sets which file opens
  first. Declare newest-first.
*/
export const sandboxes: SandboxMeta[] = [
  {
    slug: "field-sizing-content-textarea",
    title: "Auto-Growing Textareas with field-sizing: content",
    description: "Type past the edge of either box — the left one grows with its content via field-sizing: content alone; the right one is a plain textarea, for comparison.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "native-css-masonry-layout",
    title: "Native CSS Masonry with grid-template-rows: masonry",
    description: "Nine variable-height tiles — toggle between grid-template-rows: masonry (packed into the shortest column) and a plain grid fallback to see exactly what the one property buys you.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-custom-functions-at-function",
    title: "Reusable CSS Logic with @function",
    description: "Every gap/padding/margin on the page is produced by one @function, --space(n) — drag the slider to change its base unit and watch every caller update together.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-cascade-layers",
    title: "Cascade Layers Specificity War",
    description: "Assign four real CSS rules of different specificity to declared layers, reorder the layers, and toggle !important per rule — a live stylesheet lets a real browser decide the winner while a readout explains exactly why.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "colored-text-overflow-ellipsis",
    title: "Coloured Ellipsis Playground",
    description: "Colour a native text-overflow ellipsis separately from its text, resize the cards to see which titles truncate, clamp them to two lines, and see a flex item without min-inline-size: 0 refuse to shrink.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-customizable-select",
    title: "Customisable select Playground",
    description: "A real <select> whose options hold colour swatches, styled with appearance: base-select, ::picker(select), ::picker-icon, ::checkmark and <selectedcontent>, with toggles to compare it against the classic select and to animate the picker open and closed.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "typed-custom-properties-at-property",
    title: "@property Playground",
    description: "Three demos of registered custom properties: a conic-gradient ring that sweeps round beside an unregistered one that jumps, a progress ring and counter driven by one animated <integer>, and a registered <color> falling back to its initial value on input that breaks an unregistered property.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-typed-attr",
    title: "Typed attr() Playground",
    description: "A progress bar, colour tag, grid and dial styled entirely from their own HTML attributes with typed attr() — read as a percentage, <color>, <integer> and <angle> — where the controls only edit attributes and an invalid colour shows the fallback.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-attr-content-tooltips",
    title: "attr() Tooltips Playground",
    description: "Hover over or Tab to any icon button: its tooltip text comes from an HTML attribute via content: attr(). Switch the source between data-tooltip and aria-label, flip tooltips above or below, and see how overflow: hidden clips them.",
    template: "vanilla",
    entry: "/index.html",
  },
  {
    slug: "container-queries-deep-dive",
    title: "Container Queries Playground",
    description: "Drag a container past a breakpoint while its title scales in cqi, retarget a named @container query between two nested containers, and flip a --theme custom property to trigger a live style query.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-corner-shape",
    title: "corner-shape Playground",
    description: "Shape one bordered, shadowed card with every corner-shape keyword or a superellipse() value, change its border-radius and morph it on hover, then browse squircles, bevels, scoops and notches doing real UI jobs.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "accent-color-native-controls",
    title: "Theming Native Controls with accent-color",
    description: "Every native control accent-color themes — checkbox, indeterminate checkbox, radio, switch, range slider, and determinate and indeterminate progress — shown beside its browser default, re-themed live from one colour picker, plus a <meter> to show what the property leaves alone.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-z-index-stacking-contexts",
    title: "z-index and Stacking Contexts Playground",
    description: "Three tabs of real HTML and CSS: free a z-index: 9999 tooltip trapped inside its card, watch where a z-index: -1 decoration lands as its parent gains a stacking context, and keep mix-blend-mode inside a group with isolation: isolate — each with a readout explaining what the browser painted and the CSS for exactly that state.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "html5-canvas",
    title: "HTML5 Canvas Playground",
    description: "Dozens of particles react to your mouse or finger in real time, or switch to a hand-rolled 3D scene — drag to spin a cube, pyramid, or octahedron and tune perspective, rotation speed, and wireframe mode live.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "sibling-index-count-functions",
    title: "Staggered Animation with sibling-index()",
    description: "A list whose items fade in one after another, with every delay calculated in CSS by sibling-index() — switch between a fixed 80ms step and a fixed 600ms total via sibling-count(), add or remove items to see the stagger recalculate live, and check whether your browser supports the functions or is using the all-at-once fallback.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "modern-css-reset",
    title: "Modern CSS Reset — Before/After",
    description: "Toggle a modern CSS reset on a sample page with a long heading, a long URL, a list, an oversized graphic, and a form field to see exactly what each rule changes against raw browser defaults.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-gradient-borders",
    title: "Gradient Border Playground",
    description: "Switch between linear and conic gradient borders, tune thickness, direction, and colors, and toggle animation — a background-position pan for linear, an @property spin for conic — with the generated CSS updating live.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-if-conditional-values",
    title: "Conditional CSS Values with if()",
    description: "A priority badge whose color is chosen entirely by if(style(--priority: ...)) in the stylesheet — pick a priority, or None to see the else branch, while a readout shows the live --priority value and whether your browser supports if() or is using the plain-gray fallback.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-gradient-text",
    title: "Gradient Text Playground",
    description: "Switch between linear, animated, and stroke gradient text, tune the angle and colors live, and toggle the multi-line wrap fix to see box-decoration-break in action.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-keyframe-steps",
    title: "Per-Keyframe steps() Playground",
    description: "A box eases through its first half, then ticks through the second — set via animation-timing-function inside a single @keyframes block instead of on the whole animation.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-sprite-sheet-animation",
    title: "Sprite Sheet Walk Cycle Playground",
    description: "A canvas-generated alien sprite sheet, stepped frame-by-frame with steps() against background-position — tune frame count, jump term, and cycle time live.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-step-based-progress-bar",
    title: "Step-based Progress Bar Playground",
    description: "A width transition run through steps() instead of easing — tune chunk count, jump term, and duration to see the loader fill in discrete jumps.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-digital-clock-second-hand",
    title: "Ticking Clock Second Hand Playground",
    description: "A second hand that ticks via steps() instead of sweeping via linear — tune ticks per revolution and revolution time to compare the two.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-step-timing-function",
    title: "CSS steps() Playground",
    description: "Compare a linear move against a stepped one live — tune step count, jump term, and duration to feel the difference.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-typewriter-effect",
    title: "CSS Typewriter Effect Playground",
    description: "A width reveal ticked out by steps(n, end) — one step per character — paired with a step-end blinking cursor. Swap the phrase and duration to see the step count recalculate live.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "will-change-property",
    title: "will-change Playground",
    description: "Pick a strategy — no hint, toggle before/after, or always on — and move a box, while the log shows the box's real, live will-change value at every step.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "promise-combinator-playground",
    title: "Promise Combinator Playground",
    description: "Three simulated tasks with adjustable delays and pass/fail switches — pick Promise.all, allSettled, race, or any and watch how each settles, plus which tasks keep running after it does.",
    template: "react-ts",
    entry: "/App.tsx"
  },
  {
    slug: "mastering-js-observers",
    title: "JavaScript Observers Playground",
    description: "Watch MutationObserver, IntersectionObserver, and ResizeObserver fire live — mutate the DOM, scroll targets into view, and resize a box while the console logs every callback.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "dynamic-viewport-height-units",
    title: "Dynamic Viewport Height Units Playground",
    description: "Toggle a simulated mobile address bar to see lvh and svh stay constant while dvh alone tracks the actual visible height live.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "dynamic-viewport-width-units",
    title: "Full-Bleed Breakout Playground",
    description: "Toggle a banner between a centered column and a true edge-to-edge full-bleed breakout using width: 100dvw, and watch the measured widths update live as you resize.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "dynamic-viewport-inline-block-units",
    title: "vi / vb Axis Swap Playground",
    description: "Toggle the root's writing-mode and watch two bars sized with real vi/vb values swap which physical dimension, width or height, they actually track.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "min-max-clamp-functions",
    title: "min() / max() / clamp() Playground",
    description: "Resize the frame and watch three common patterns resolve differently, live: a min(90%, 60ch) readable measure, a max(1rem, 4%) safe inset, and a clamp(200px, 50%, 500px) bounded card width.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "env-safe-area-insets",
    title: "env() Safe Area Playground",
    description: "Toggle a simulated notch and home indicator to see safe-area-inset padding move header and CTA content clear of them.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "fluid-typography-and-spacing",
    title: "Fluid Type & Spacing with clamp()",
    description: "Drag the width slider to resize the frame like a viewport, and flip between Fluid and Stepped mode to see clamp()'s smooth scaling next to fixed-breakpoint jumps for the same heading, body text, padding, and gap.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "light-dark-color-scheme",
    title: "light-dark()",
    description: "Toggle color-scheme on a panel and watch every light-dark() value re-resolve instantly — background, text, and border, from one declaration each.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "mastering-css-gradients",
    title: "CSS Gradients Playground",
    description: "Switch between linear, radial, conic, and repeating gradients, stack a live glassmorphism card, and preview all three animated gradient techniques from the post.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-scroll-driven-animations",
    title: "Scroll-Driven Animations Playground",
    description: "A scroll()-timeline progress bar and a view()-timeline reveal — tune animation-range live to see how each named range (entry, cover, contain) times the animation against scroll position.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "css-keyframes-guide",
    title: "CSS Keyframes Playground",
    description: "Tune duration, delay, timing function, iteration count, direction, and fill mode live against a multi-step @keyframes animation.",
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
    template: "vanilla",
    entry: "/index.html"
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
    description: "Set container-level justify-items/align-items (or the place-items/place-self shorthand), span and self-align a hero item, raise the item count past the explicit grid to watch implicit tracks appear, distribute fixed-size tracks with justify-content/align-content, and switch to the Template Areas tab to swap between named-region layout presets.",
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
