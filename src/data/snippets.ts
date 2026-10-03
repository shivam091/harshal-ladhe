import { createContentLookup, type ContentEntry } from "@/data/content";

// Aliased so snippet code reads in its own terms while sharing the common content shape.
export type Snippet = ContentEntry;

/*
  Each entry needs a matching app/(site)/(internal)/(snippet)/snippet/<slug>/page.mdx.
  Dates are deliberately absent — they come from git history at build time.
  Keep it oldest-first (append new snippets), since prev/next nav follows array order.
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
      type: "image/png",
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
    slug: "circular-reveal-theme-toggle",
    title: "Circular Reveal Theme Toggle with View Transitions",
    excerpt: "Reveal the new theme in a circle from the toggle.",
    description: "Switch between light and dark themes with a circle that grows out of the toggle button, using document.startViewTransition() and a clip-path animation on ::view-transition-new(root), with an optional shrink-back, keyboard-friendly origin, and an instant fallback for reduced motion or unsupported browsers.",
    category: ["CSS", "JavaScript"],
    tags: ["css", "javascript", "view-transitions-api", "clip-path", "dark-mode", "theme-toggle", "animation", "prefers-reduced-motion"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/circular-reveal-theme-toggle/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a page split between light and dark themes, with the dark theme expanding in a circle from a moon-shaped toggle button."
    },
    changelog: [
      { date: "2026-10-03", change: "Initial publication." }
    ]
  },
  {
    slug: "hamburger-to-close-morph",
    title: "Hamburger to ✕ Morph with SVG and CSS",
    excerpt: "Fold three menu bars into a close icon.",
    description: "Morph a three-line hamburger icon into a ✕ with SVG lines and the individual translate and rotate properties — a two-step fold driven by aria-expanded, reversed on close, with no JavaScript animation and a reduced-motion fallback.",
    category: ["CSS", "SVG"],
    tags: ["css", "svg", "hamburger-menu", "icon-animation", "transitions", "micro-interactions", "accessibility", "prefers-reduced-motion"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/hamburger-to-close-morph/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a three-line hamburger menu icon folding step by step into a ✕ close icon."
    },
    changelog: [
      { date: "2026-10-03", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-spinning-loader",
    title: "Spinning SVG Loader from One Circle",
    excerpt: "A rotating arc from one circle and dashes.",
    description: "Build a lightweight loading spinner from a single SVG circle — pathLength and stroke-dasharray cut the arc, a CSS rotation spins it, and an optional dash animation makes it grow and shrink — with accessible labelling and reduced-motion handling.",
    link: {
      label: "Read the full post: Animating SVG: A Guide to CSS Transitions and Keyframes",
      href: "/post/animations/svg-transitions-and-keyframes"
    },
    category: ["SVG", "CSS"],
    tags: ["svg", "css", "loader", "spinner", "stroke-dasharray", "pathLength", "keyframes", "prefers-reduced-motion"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-spinning-loader/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a circular loading spinner made from a single glowing arc on a faint circular track."
    },
    changelog: [
      { date: "2026-10-03", change: "Initial publication." }
    ]
  }
];

// Array-order based rather than git-dated so the lookups stay client-safe — git can't be read in the browser.
export const { getBySlug: getSnippetBySlug, getNavigation: getSnippetNavigation } = createContentLookup(snippets);
