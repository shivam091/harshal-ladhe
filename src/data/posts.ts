import type { ChangelogEntry } from "@/components/Changelog/Changelog.types";

// Cover image used for social share previews and OG metadata.
export interface PostImage {
  // Relative or absolute image path.
  path: string;
  width: number;
  height: number;
  type?: string;
  // Required alt text for the share-preview image.
  alt: string;
}

// Per-post table-of-contents configuration.
export interface PostTocConfig {
  // Set false to hide the ToC sidebar entirely for this post. Defaults to true.
  show?: boolean;
  // Deepest heading level to include (2 = h2 only, 3 = h2+h3, 4 = h2+h3+h4). Defaults to 3.
  maxLevel?: 2 | 3 | 4;
}

// Registry record describing one post — drives the /posts list, prev/next nav, and the detail layout.
export interface Post {
  slug: string;
  title: string;
  // Short lead shown in the post header and list cards.
  excerpt?: string;
  // Longer SEO description shown in list cards and OG metadata.
  description: string;
  // Category slugs this post belongs to.
  category: string[];
  // Freeform tag slugs for this post.
  tags: string[];
  // Social share / OG cover image.
  image?: PostImage;
  // Table-of-contents display options; omit to use defaults.
  toc?: PostTocConfig;
  // Per-post closing message; overrides the built-in PageSignOff default.
  // Set to `false` to suppress the closing text — renders a bare divider instead.
  signoff?: string | false;
  // Surface this post in pinned / featured sections.
  pinned?: boolean;
  featured?: boolean;
  // History of substantive edits after initial publish; drives the "last modified" date shown to readers.
  changelog?: ChangelogEntry[];
}

// Minimal shape used for prev/next navigation links.
export interface PostNavLink {
  slug: string;
  title: string;
  category: string[];
}

// Previous (older) and next (newer) neighbours for a given post.
export interface PostNavigation {
  previous: PostNavLink | null;
  next: PostNavLink | null;
}

/*
  Registry of every post. Each entry has a matching content file at
  app/(site)/(internal)/(post)/post/<category-slug>/<slug>/page.mdx, where
  <category-slug> is the slugified form of this entry's first `category`.
  This drives the /posts list, the detail chrome, and prev/next nav.

  Dates come from git history at build time (lib/posts.ts for the list;
  remark-post-meta for the detail). New posts are appended to the end, so the
  registry reads oldest-first: "previous" is the entry just before (older),
  "next" is the one just after (newer).
*/
export const posts: Post[] = [
  {
    slug: "getting-started-with-css-grid",
    title: "Getting Started with CSS Grid: A Beginner's Guide to 2D Layouts",
    excerpt: "Lay the foundation, shape the grid.",
    description: "A beginner-friendly introduction to CSS Grid that covers core concepts and guides you through building your first 2D layouts with real-world examples.",
    category: ["CSS"],
    tags: ["css", "grid", "css-grid", "beginner", "layout", "web-design", "frontend", "2d-layouts", "devtools"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/getting-started-with-css-grid/cover.png",
      width: 1200,
      height: 630,
      type: "image/png",
      alt: "Flat-design digital illustration introducing CSS Grid fundamentals, featuring icons for grid containers, tracks, and layout structures."
    },
    signoff: "This one took a good deal of care to get the fundamentals right, and I hope it gives you a solid footing with containers, tracks, and your first 2D layout. Appreciate you taking the time to work through it with me — happy gridding. 🧱",
    pinned: true,
    changelog: [
      { date: "2026-09-01", change: "Added a browser DevTools grid-debugging walkthrough and a common beginner mistakes checklist" },
      { date: "2026-08-31", change: "Added a grid terminology diagram and removed the CodePen link" },
      { date: "2026-08-15", change: "Added interactive playground for column/row templates and gap" },
      { date: "2026-07-05", change: "Initial publication" }
    ]
  },
  {
    slug: "mastering-css-grid-alignment-spanning",
    title: "Mastering CSS Grid: Grid Areas, Item Alignment, and Spanning",
    excerpt: "Structure with clarity, align with precision.",
    description: "Take your CSS Grid skills to the next level by mastering semantic layouts with grid areas, named lines, item alignment, spanning, subgrid, and accessible ordering.",
    category: ["CSS"],
    tags: ["css", "css-grid", "grid", "beginner", "layout", "grid-template-areas", "grid-alignment", "frontend", "subgrid", "named-grid-lines", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/mastering-css-grid-alignment-spanning/cover.png",
      width: 1200,
      height: 630,
      type: "image/png",
      alt: "Stylized 2D illustration visualizing advanced CSS Grid techniques like alignment, named grid areas, and spanning elements across rows and columns."
    },
    signoff: "A lot of testing and refining went into getting these grid-area, alignment, spanning, subgrid, and accessibility examples just right, and I hope that effort shows in how clearly they click for you. Thanks for following along — hope your layouts feel a little more precise now. 📐",
    pinned: true,
    changelog: [
      { date: "2026-09-05", change: "Added a Distributing Grid Tracks section covering justify-content/align-content/place-content (with a new diagram comparing space-between, space-around, and space-evenly), plus a matching Content Distribution tab in the interactive playground" },
      { date: "2026-09-01", change: "Added named grid lines, subgrid, and accessible-ordering sections (each with a new diagram), plus a common mistakes checklist for alignment and spanning" },
      { date: "2026-08-31", change: "Replaced ASCII diagrams with interactive SVG illustrations, linked the Holy Grail Layout snippet, and removed CodePen links" },
      { date: "2026-08-16", change: "Added a Template Areas mode to the interactive playground" },
      { date: "2026-08-15", change: "Added interactive playground for alignment, spanning, and implicit tracks" },
      { date: "2026-07-05", change: "Initial publication" }
    ]
  },
  {
    slug: "responsive-css-grid-layouts",
    title: "Responsive CSS Grid Layouts: `fr` Units, `minmax()`, `auto-fill`, and `auto-fit` Explained",
    excerpt: "Smarter layouts without rigid breakpoints.",
    description: 'Learn how to build truly responsive CSS Grid layouts using "fr" units, "minmax()", "auto-fit", "auto-fill", and modern media & container queries.',
    category: ["CSS"],
    tags: ["css", "grid", "beginner", "responsive", "layout", "fr-units", "minmax", "media-queries", "container-queries", "auto-fit", "auto-fill", "browser-support", "progressive-enhancement"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/responsive-css-grid-layouts/cover.png",
      width: 1200,
      height: 630,
      type: "image/png",
      alt: "Colorful flat-design illustration showcasing responsive CSS Grid techniques, including fr units, minmax(), auto-fit, media queries, and container queries."
    },
    signoff: "This one took a fair amount of work to put together — from fr units and minmax() to auto-fit, auto-fill, and container queries — and I hope it makes your layouts hold up wherever they're viewed. Really glad you stuck around for this one — go make your grids bend without breaking. 🎉",
    pinned: true,
    featured: true,
    changelog: [
      { date: "2026-09-01", change: "Added a common pitfalls section and a browser support & fallbacks section with an @supports example" },
      { date: "2026-08-31", change: "Added an auto-fit vs auto-fill diagram, linked the Holy Grail Layout snippet, and removed CodePen links" },
      { date: "2026-08-15", change: "Added interactive auto-fit vs auto-fill and container query playground" },
      { date: "2026-07-05", change: "Initial publication" }
    ]
  },
  {
    slug: "css-transitions-guide",
    title: "An Interactive Guide to CSS Transitions",
    excerpt: "Craft high-performance, responsive UI motion with CSS transitions and transforms",
    description: "Master CSS transitions for responsive UI. Learn to use duration, delay, timing-function, and transform for GPU-accelerated performance and smooth micro-interactions.",
    category: ["Animations"],
    tags: ["css", "animation", "transition", "will-change", "performance", "gpu-acceleration", "transform", "opacity", "timing-function", "microinteractions", "ui-design"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/animations/css-transitions-guide/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "CSS Transitions cover image featuring a large “CSS Transitions” title, a glowing “Hover me” button with motion trails, transition properties such as opacity and transform, and a CSS code panel illustrating smooth state changes, easing, duration, delay, events, and performance."
    },
    signoff: "This one took a fair bit of tinkering to get the playground feeling just right, and I hope tuning duration, delay, and timing-function with your own hands makes transitions click in a way reading alone never quite does. Thanks for hovering, toggling, and sticking with me through it — go make your UI feel a little smoother. ✨",
    toc: { maxLevel: 3 },
    changelog: [
      { date: "2026-08-31", change: "Added an interactive timing-function curve diagram and playground cross-references" },
      { date: "2026-08-08", change: "Initial publication" }
    ]
  },
  {
    slug: "git-basics-for-beginners",
    title: "Git Basics: A Beginner's Guide to Version Control",
    excerpt: "Master Git's core workflow, from commit to merge.",
    description: "A beginner-friendly guide to Git covering setup, the staging area, everyday commands like add/commit/diff/log, .gitignore, branching, merging, undoing mistakes, stashing, remotes, and tags.",
    category: ["Git"],
    tags: ["git", "version-control", "github", "gitignore", "branching", "merging", "cli", "beginner"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/git/git-basics-for-beginners/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Git Basics: A Beginner’s Guide to Version Control — a dark neon tech illustration showing Git’s working directory, staging area, repository, branching and merging workflow, terminal commands, Git logo, and Git object model."
    },
    signoff: "This one's meant to be the guide I wish I'd had when Git still felt like a wall of unfamiliar commands — I hope it makes that first `git merge` conflict feel like a puzzle instead of a crisis. Part 2 picks up right where this leaves off. 🌱",
    pinned: true,
    changelog: [
      { date: "2026-08-01", change: "Added a Git core model diagram, fast-forward/three-way merge diagrams, and a git reset modes comparison diagram" },
      { date: "2026-08-15", change: "Initial publication" }
    ]
  },
  {
    slug: "advanced-git-techniques-and-workflows",
    title: "Advanced Git: Rebasing, Internals, and Real-World Workflows",
    excerpt: "Rebase confidently, understand internals, and recover from anywhere.",
    description: "An advanced Git guide covering interactive rebasing, cherry-picking, bisect, Git internals (objects, refs, the .git directory), submodules, worktrees, hooks, reflog-based recovery, and real branching workflows.",
    category: ["Git"],
    tags: ["git", "rebase", "git-workflow", "git-internals", "reflog", "advanced"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/git/advanced-git-techniques-and-workflows/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Advanced Git: Rebasing, Internals, and Real-World Workflows — a dark neon Git-themed illustration featuring interactive rebasing and commit graphs, Git’s blob-tree-commit-tag object model, advanced Git commands, reflog-based recovery, and GitHub Flow, Git Flow, and trunk-based development workflows."
    },
    signoff: "This half is the one that turns Git from \"a tool I follow instructions for\" into something you can actually reason about — I hope the internals section in particular makes the rest of it click. Thanks for sticking with the series through to the end. 🚀",
    pinned: true,
    changelog: [
      { date: "2026-09-01", change: "Added GitHub Flow, Git Flow, and trunk-based development workflow diagrams" },
      { date: "2026-08-31", change: "Added a rebase before/after diagram, a git bisect binary search diagram, and a Git object graph diagram" },
      { date: "2026-08-15", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-essentials-mastering-basic-shapes",
    title: "SVG Essentials: Mastering Shapes, Coordinates, and Styling",
    excerpt: "Build sharp, scalable graphics with basic shapes.",
    description: "Learn how to build resolution-independent SVG graphics. Master the viewBox, coordinates, essential shapes, and CSS styling with fill, stroke, and hover animations.",
    category: ["SVG"],
    tags: ["svg", "graphics", "advanced-css", "frontend", "web-design", "vector-graphics", "web-graphics", "transition", "ui-development", "coordinate-system", "viewbox"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/svg/svg-essentials-mastering-basic-shapes/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "SVG Essentials — Mastering Basic Shapes in SVG, featuring colorful geometric shapes, an SVG editor interface, coordinate system, viewBox, geometry rules, and SVG code on a vibrant dark gradient background."
    },
    signoff: "Between the six shape playgrounds, the presentation-attributes demo, and getting that radar sweep to pivot from exactly the right point, this ended up with more moving pieces than any SVG post so far — I hope tinkering with those sliders builds more intuition than the coordinate math alone ever could. Thanks for working through the whole toolkit with me. Go build something that scales without breaking a sweat. 🎯",
    changelog: [
      { date: "2026-08-25", change: "Added cross reference to `<polygon>` vs. `<polyline>` post" },
      { date: "2026-08-21", change: "Initial publication" }
    ]
  },
  {
    slug: "mastering-js-operators",
    title: "Mastering JavaScript Operators: A Complete Guide with Examples",
    excerpt: "Transform, compare, assign—write cleaner code.",
    description: "A complete breakdown of all JavaScript operators including arithmetic, logical, assignment, comparison, bitwise, and special operators with syntax and real-world examples.",
    category: ["JavaScript"],
    tags: ["javascript", "operators", "es6", "frontend", "cheatsheet", "optional-chaining", "nullish-coalescing", "spread-operator", "ternary-operator", "type-coercion"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/javascript/mastering-js-operators/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Mastering JavaScript Operators — a colorful neon infographic showing JavaScript operator categories, code examples, and modern syntax for writing clean, efficient code."
    },
    toc: { maxLevel: 4 },
    signoff: "Every operator in this guide—from `+` to `??=`—got its own runnable example, and the precedence table alone went through more revisions than I'd like to admit before it was scannable at a glance. This is the most thorough reference on the site so far; thanks for working through all of it with me. Go write cleaner conditionals. ✨",
    changelog: [
      { date: "2025-08-23", change: "Initial publication" }
    ]
  },
  {
    slug: "polygon-vs-polyline",
    title: "SVG Polygon vs Polyline: Differences, Fill Rules, and Use Cases",
    excerpt: "Master SVG polygons, polylines, and fill rules.",
    description: "Learn the difference between SVG polygon and polyline: points syntax, fill-rule, accessibility, and real use cases like charts, icons, and UI shapes.",
    category: ["SVG"],
    tags: ["svg", "polygon", "polyline", "graphics", "vector-graphics", "shapes", "fill-rule", "web-design", "frontend-development", "icons", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/svg/polygon-vs-polyline/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Polygon vs Polyline comparison showing an open cyan polyline and a filled star-shaped polygon on a grid background, illustrating open versus closed SVG shapes."
    },
    signoff: "Between the point-scrambling playground that turns a clean square into a self-intersecting hourglass mid-drag, the preset switcher for square, hexagon, and star, and lining up the nonzero-vs-evenodd star comparison so the hollow center actually reads as hollow, this post leaned on live demos to do work that formulas alone never quite pull off. Thanks for dragging every vertex and flipping every fill rule with me — go close off a shape that's entirely your own. ⬡",
    featured: true,
    changelog: [
      { date: "2026-08-25", change: "Initial publication" }
    ],
  },
  {
    slug: "css-logical-properties",
    title: "CSS Logical Properties: Writing Modes, RTL, and Direction-Aware Layouts",
    excerpt: "Design once, adapt everywhere.",
    description: "CSS Logical Properties adapt your layout to any language, direction, or writing mode from one stylesheet — no more RTL hacks or duplicated styles.",
    category: ["CSS"],
    tags: ["css", "layout", "rtl", "logical-properties", "writing-modes", "i18n", "frontend", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/css-logical-properties/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover image for ‘CSS Logical Properties: Writing Modes, RTL, and Direction-Aware Layouts,’ showing physical properties compared with logical properties, LTR and RTL direction controls, horizontal and vertical writing modes, inline and block axis diagrams, and direction-aware layout mappings."
    },
    signoff: "This one leaned harder on visuals than any post before it — four custom SVG diagrams built to keep the inline and block axes crossing the right way in every writing mode, plus the direction/writing-mode toggle above to prove it live. Chasing all sixty-some properties across sixteen categories down to their physical equivalents turned up a few surprises along the way — a couple of values that looked valid but aren't implemented anywhere, one that isn't even real syntax. I hope watching those arrows and toggles do their thing builds more intuition than the mapping tables alone ever could. Thanks for tracing every axis with me — go replace a `margin-left` with something that actually adapts. 🧭",
    changelog: [
      { date: "2026-08-31", change: "Added interactive playground cross-references" },
      { date: "2026-08-30", change: "Initial publication" }
    ],
  },
  {
    slug: "mastering-css-gradients",
    title: "Mastering CSS Gradients: Types, Use Cases & Best Practices",
    excerpt: "Design modern UI backgrounds using CSS gradients",
    description: "A deep dive into CSS gradients—linear, radial, conic, repeating—with examples, SCSS helpers, animations, and practical best practices for modern web design.",
    category: ["CSS"],
    tags: ["css", "gradients", "background", "linear-gradient", "radial-gradient", "conic-gradient", "repeating-gradient", "modern-css", "ui-design", "color-theory", "oklch", "animation", "scss"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/mastering-css-gradients/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Illustrated cover image for “Mastering CSS Gradients: Types, Use Cases & Best Practices,” featuring vibrant neon CSS gradients with linear, radial, conic, and repeating gradient examples, layered gradient effects, CSS code, animated gradient waves, OKLCH color interpolation, and SCSS utilities on a dark futuristic background."
    },
    signoff: "The five diagrams gave me the most trouble up front—getting the off-center radial boundaries to line up with the actual math, and the conic sweep to read as clockwise-from-the-top at a glance—and turning the playground into three real tabs (gradient types plus repeating, a toggleable glass layer stack, and all three animated demos with a reduced-motion switch) took a lot more wiring than the original single-panel version. I hope dragging every one of those controls makes gradients click in a way reading about them never quite does. Thanks for gradient-ing along with me. 🌈",
    changelog: [
      { date: "2026-09-04", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-transitions-and-keyframes",
    title: "Animating SVG: A Guide to CSS Transitions and Keyframes",
    excerpt: "Bring static shapes to life with transitions and @keyframes.",
    description: "Learn how to animate SVG with CSS: transitions vs @keyframes, self-drawing lines, clip-path reveals, staggered delays, motion paths, shape morphing, and scroll-driven timelines.",
    category: ["Animations"],
    tags: ["svg", "animation", "css", "transition", "keyframes", "transform-origin", "transform-box", "stroke-dasharray", "stroke-dashoffset", "clip-path", "offset-path", "motion-path", "text-path", "shape-morphing", "animation-delay", "animation-timeline", "viewbox", "frontend", "web-design"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/animations/svg-transitions-and-keyframes/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover image for “Animating SVG: A Guide to CSS Transitions and Keyframes,” featuring colorful animated SVG-inspired shapes, motion paths, shape morphing, rotating elements, CSS @keyframes code, and a dark gradient background. The image highlights transitions, keyframes, motion paths, and shape morphing."
    },
    signoff: "Getting the radar's sweep to pivot from the right point back in the basic shapes post turned out to be the easy part. This round added five more interactive panels, each wiring its own live code and controls to real `@keyframes` — and the trickiest bug wasn't in the animation at all, it was figuring out why an elliptical arc needs to end 0.1 units short of its own starting point just to keep the motion-path math from collapsing into nothing. Thanks for hovering the heart and sun, looping the radar, dragging the draw-on and stagger sliders, toggling the comet's curve-following on and off, and watching a circle round itself into a square with me — go animate something that used to just sit there. 🎯",
    toc: { maxLevel: 3 },
    changelog: [
      { date: "2026-09-06", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-essentials-mastering-the-path-element",
    title: "SVG Essentials: Mastering the Path Element",
    excerpt: "Understand SVG paths, curves, and commands",
    description: "A complete guide to the SVG path element — path commands, coordinates, bézier curves, arcs, compound paths and fill-rule, pathLength-based line-draw animation, CSS's path() function, stroke rendering, and the shorthand tricks behind exported path data.",
    category: ["SVG"],
    tags: ["svg", "path-data", "vector", "javascript", "icons", "frontend-development", "bezier-curves", "web-animation", "ui-design", "fill-rule", "stroke-dasharray", "stroke-dashoffset", "clip-path", "offset-path", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/svg/svg-essentials-mastering-the-path-element/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "SVG Essentials cover featuring a neon Bézier path, SVG code, path commands, curves, arcs, and a vector-design workspace with a laptop."
    },
    toc: { maxLevel: 4 },
    signoff: "Getting ten interactive command demos, a full heart-shape decode, and the fill-rule, pathLength, and CSS path() sections to all click together took a fair share of iteration, and I hope it leaves you able to read — and write — a `d` string without flinching. Thanks for sticking with me through the whole alphabet of path commands — go draw something only you could have coded. ✏️",
    changelog: [
      { date: "2026-09-08", change: "Initial publication" }
    ],
  },
  {
    slug: "mastering-js-observers",
    title: "Mastering JavaScript Observers: A Complete Guide to Reactive Web APIs",
    excerpt: "Unlock reactive power with JavaScript Observer APIs.",
    description: "Master MutationObserver, IntersectionObserver, ResizeObserver, and PerformanceObserver. Learn to build high-performance, reactive web apps with real-world examples and best practices.",
    category: ["JavaScript"],
    tags: ["javascript", "web-apis", "observer-pattern", "frontend-development", "performance", "reactive-programming", "event-listener", "mutation-observer", "intersection-observer", "resize-observer", "dom", "core-web-vitals", "lazy-loading"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/javascript/mastering-js-observers/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "JavaScript observers diagram illustrating MutationObserver, IntersectionObserver, ResizeObserver, and PerformanceObserver in reactive web development."
    },
    toc: { maxLevel: 4 },
    signoff: "Four observer APIs, a custom Pub/Sub implementation, and a sandbox that lets you mutate, scroll, and resize your way through all three DOM observers live — getting the IntersectionObserver strike-zone math right for the scrollspy pattern took more whiteboarding than I expected. Thanks for reading all the way to the FAQ section; go replace a scroll listener with something that only runs when it actually needs to. 👀",
    changelog: [
      { date: "2026-09-12", change: "Initial publication" }
    ]
  },
  {
    slug: "mastering-async-javascript",
    title: "Mastering Asynchronous JavaScript: Callbacks, Promises, and Async/Await",
    excerpt: "Write clean, predictable asynchronous JavaScript",
    description: "A deep guide to asynchronous JavaScript covering the event loop, callbacks, promises, async/await, microtasks, concurrency patterns, and performance best practices for modern web development.",
    category: ["JavaScript"],
    tags: ["javascript", "async-javascript", "modern-js", "async", "callbacks", "promises", "async-await", "event-loop", "microtasks"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/javascript/mastering-async-javascript/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "JavaScript event loop diagram with callbacks, promises, async/await, and microtask vs macrotask queues."
    },
    toc: { maxLevel: 4 },
    signoff: "Getting the microtask-vs-macrotask ordering to click as a diagram instead of just a list of rules took a few passes, and building a live Promise.all/allSettled/race/any playground next to the section that explains them felt like the right way to make combinator choice concrete instead of theoretical. Thanks for following the whole callbacks → promises → async/await arc with me; go find an unnecessary sequential await in your own code and fix it. ⏱️",
    changelog: [
      { date: "2026-09-12", change: "Initial publication" }
    ],
  },
  {
    slug: "css-keyframes-guide",
    title: "An Interactive Guide to CSS Keyframes",
    excerpt: "Bring static designs to life with keyframes",
    description: "Master multi-step CSS animations using @keyframes. Learn control, performance, GPU optimization, and advanced web motion.",
    category: ["Animations"],
    tags: ["css", "keyframes", "animation", "gpu-performance", "multi-step", "web-motion", "ui-design", "frontend", "scroll-animation", "view-timeline", "advanced-css", "browser-support"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/animations/css-keyframes-guide/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-themed CSS keyframes guide cover showing multi-step animation timelines, a bouncing gradient sphere, CSS @keyframes code, animation controls, smooth animation examples, and a laptop on a dark developer workspace."
    },
    toc: { maxLevel: 3 },
    signoff: "Between the core keyframes playground and a second sandbox built just to make `animation-timeline` and `animation-range` tangible — complete with a live range slider and its own feature-detection fallback for browsers that don't support scroll-driven animations yet — this one ended up needing two full interactive builds instead of one. Getting the `animation-range` diagram to actually line up entry/contain/cover/exit against a scrolling element took more iteration than the rest of the post combined. Thanks for tweaking every duration, delay, and range slider with me — go give your loops, spinners, and scroll reveals some real personality. 🎬",
    changelog: [
      { date: "2026-09-13", change: "Initial publication" }
    ],
  },
  {
    slug: "dockerfile-basics-for-beginners",
    title: "Dockerfile Basics for Beginners",
    excerpt: "Learn Docker's core building blocks, one instruction at a time.",
    description: "A beginner's guide to Dockerfile basics — FROM, COPY, RUN, and CMD — plus the images-vs-containers mental model you need before anything else in Docker makes sense.",
    category: ["Docker"],
    tags: ["docker", "dockerfile", "containers", "containerization", "docker-images", "devops", "beginner", "cli"],
    signoff: "Every instruction in this one — FROM, WORKDIR, COPY, RUN, CMD — is something I still type from muscle memory years in, and I hope walking through the Express example line by line makes that same muscle memory click faster for you than it did for me. Thanks for building your first image with me — go containerize something. 🐳",
    changelog: [
      { date: "2026-09-19", change: "Initial publication" }
    ]
  },
  {
    slug: "docker-layers-and-caching",
    title: "Understanding Docker Layers and Caching",
    excerpt: "Why your Docker builds are slower than they need to be.",
    description: "Understand how Docker's layered filesystem and build cache actually work, why Dockerfile instruction order determines build speed, and how to stop paying for a full rebuild on every code change.",
    category: ["Docker"],
    tags: ["docker", "dockerfile", "docker-layers", "build-cache", "image-layers", "containerization", "beginner", "performance"],
    signoff: "The \"why is this build still slow\" question came up enough in my own projects that untangling exactly how the cache cascades felt worth writing down properly, whiteout layers and all. Thanks for sticking with the mechanics instead of just the rules of thumb — go reorder a Dockerfile and watch the CACHED lines stack up. ⚡",
    changelog: [
      { date: "2026-09-19", change: "Initial publication" }
    ]
  },
  {
    slug: "multi-stage-dockerfiles",
    title: "Writing Efficient Multi-Stage Dockerfiles",
    excerpt: "Ship the artifact, not the toolchain that built it.",
    description: "Learn to write efficient multi-stage Dockerfiles that separate build-time tooling from a slim final runtime image, using named stages, COPY --from, and --target.",
    category: ["Docker"],
    tags: ["docker", "dockerfile", "multi-stage-builds", "build-optimization", "slim-images", "containerization", "devops", "intermediate"],
    signoff: "Splitting a Dockerfile into a disposable build stage and a lean runtime stage is one of those techniques that feels like a trick the first time it clicks and completely obvious every time after. Thanks for working through the full TypeScript example with me — go shrink an image that's been quietly shipping a whole compiler toolchain it doesn't need. 📦",
    changelog: [
      { date: "2026-09-19", change: "Initial publication" }
    ]
  },
  {
    slug: "docker-compose-for-local-dev",
    title: "Docker Compose for Local Dev Environments",
    excerpt: "Run your whole local stack with one command.",
    description: "A practical guide to Docker Compose for local development — defining services, networking between containers, persisting data with volumes, and managing configuration with .env files.",
    category: ["Docker"],
    tags: ["docker", "docker-compose", "local-development", "containers", "networking", "volumes", "dotenv", "devops", "intermediate"],
    signoff: "Getting the service-name-not-localhost networking model to actually land took more than one confused debugging session of my own, so I tried to get ahead of that one early here. Thanks for wiring up services, volumes, and .env with me — go bring up a stack with one command instead of five. 🧩",
    changelog: [
      { date: "2026-09-19", change: "Initial publication" }
    ]
  },
  {
    slug: "advanced-dockerfile-optimization",
    title: "Advanced Dockerfile Techniques and Optimization",
    excerpt: "Push Dockerfile optimization past multi-stage builds.",
    description: "Advanced Dockerfile techniques using BuildKit — persistent cache mounts, secret mounts, distroless runtime images, and the real story behind layer squashing.",
    category: ["Docker"],
    tags: ["docker", "dockerfile", "buildkit", "cache-mounts", "distroless", "layer-squashing", "build-optimization", "advanced", "devops"],
    signoff: "Cache mounts and distroless bases are the kind of techniques that don't show up until you go looking for them, and I wanted this post to be the thing that surfaces them earlier than they surfaced for me. Thanks for going past multi-stage builds into BuildKit's sharper tools — go squeeze a build that's still slower than it should be. 🛠️",
    changelog: [
      { date: "2026-09-19", change: "Initial publication" }
    ]
  },
  {
    slug: "securing-docker-images",
    title: "Securing Your Docker Images",
    excerpt: "A lean image isn't automatically a safe one.",
    description: "Harden your Docker images with non-root users, minimal base images, vulnerability scanning with Docker Scout and Trivy, and safe secrets handling with BuildKit secret mounts.",
    category: ["Docker"],
    tags: ["docker", "docker-security", "non-root-user", "minimal-base-images", "vulnerability-scanning", "secrets-management", "containerization", "advanced", "devops"],
    signoff: "This felt like the right note to end the series on — all the optimization in the world doesn't matter much if the image ships root access and a leaked token in its history. Thanks for following the whole arc from FROM/COPY/RUN to hardened, scanned, secrets-safe images — go audit one of your own. 🔒",
    changelog: [
      { date: "2026-09-19", change: "Initial publication" }
    ]
  }
];

// Look up a single post by its slug.
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/*
  Previous/next neighbours by this array's order (client-safe — used by the
  post layout, which can't read git dates in the browser). The registry is
  oldest-first (new posts appended to the end), so "previous" is the entry
  just before (older) and "next" is the one just after (newer).
*/
export function getPostNavigation(slug: string): PostNavigation {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };

  const previous = index > 0 ? posts[index - 1] : null;
  const next = index < posts.length - 1 ? posts[index + 1] : null;

  return {
    previous: previous ? { slug: previous.slug, title: previous.title, category: previous.category } : null,
    next: next ? { slug: next.slug, title: next.title, category: next.category } : null
  };
}
