// Static metadata for one runnable sandbox example — resolved server-side from its slug.
export interface SandboxMeta {
  slug: string;
  title: string;
  description: string;
  template: "react-ts" | "react" | "vanilla-ts" | "vanilla";
  entry: string;
}

/*
  Registry of every sandbox. Each entry has matching code files read from disk at
  /sandboxes/<slug>/ (see src/lib/sandbox-examples.ts). `entry` sets which file opens as the
  active tab. This drives any sandbox listing and the Sandbox component's metadata lookup.

  Declare newest-first.
*/
export const sandboxes: SandboxMeta[] = [
  {
    slug: "backdrop-filter-and-css-filters",
    title: "Filters & Glassmorphism Playground",
    description: "Chain 8 filter functions onto a photo, tune a real backdrop-filter glass card over a patterned backdrop, and compare a CSS blend-mode duotone against a real SVG feComponentTransfer filter — generated CSS shown live.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "color-mix-and-relative-color-syntax",
    title: "color-mix() & Relative Color Playground",
    description: "Blend two colors across srgb/hsl/oklch with a live hue-method switch, or derive a color live from relative color syntax with L/C/H/alpha sliders, generated CSS shown throughout.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "taming-image-and-video-boxes",
    title: "Image & Video Box Playground",
    description: "Tune object-fit, object-position, and box aspect-ratio live against a landscape photo, a portrait photo, and a mock video frame, then replay the aspect-ratio CLS fix on demand.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "container-queries-deep-dive",
    title: "Container Queries Playground",
    description: "Drag a container past a breakpoint while its title scales in cqi, retarget a named @container query between two nested containers, and flip a --theme custom property to trigger a live style query.",
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
