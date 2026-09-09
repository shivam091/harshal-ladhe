import type { ChangelogEntry } from "@/components/Changelog/Changelog.types";

// Cover image used for social share previews and OG metadata.
export interface PostImage {
  // Relative or absolute image path.
  path: string;
  width: number;
  height: number;
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
      path: "/assets/img/posts/css/getting-started-with-css-grid/cover.png",
      width: 1200,
      height: 630,
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
    slug: "mastering-css-grid",
    title: "Mastering CSS Grid: Grid Areas, Item Alignment, and Spanning",
    excerpt: "Structure with clarity, align with precision.",
    description: "Take your CSS Grid skills to the next level by mastering semantic layouts with grid areas, named lines, item alignment, spanning, subgrid, and accessible ordering.",
    category: ["CSS"],
    tags: ["css", "css-grid", "grid", "beginner", "layout", "grid-template-areas", "grid-alignment", "frontend", "subgrid", "named-grid-lines", "accessibility"],
    image: {
      path: "/assets/img/posts/css/mastering-css-grid-alignment-spanning/cover.png",
      width: 1200,
      height: 630,
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
      path: "/assets/img/posts/css/responsive-css-grid-layouts/cover.png",
      width: 1200,
      height: 630,
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
      path: "/assets/img/posts/animations/css-transitions-guide/cover.png",
      width: 1536,
      height: 1024,
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
      path: "/assets/img/posts/git/git-basics-for-beginners/cover.png",
      width: 1536,
      height: 1024,
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
      path: "/assets/img/posts/git/advanced-git-techniques-and-workflows/cover.png",
      width: 1536,
      height: 1024,
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
      path: "/assets/img/posts/svg/svg-essentials-mastering-basic-shapes/cover.png",
      width: 1536,
      height: 1024,
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
      path: "/assets/img/posts/javascript/mastering-js-operators/cover.png",
      width: 1536,
      height: 1024,
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
      path: "/assets/img/posts/svg/polygon-vs-polyline/cover.png",
      width: 1536,
      height: 1024,
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
      path: "/assets/img/posts/css/css-logical-properties/cover.png",
      width: 1536,
      height: 1024,
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
      path: "/assets/img/posts/css/mastering-css-gradients/cover.png",
      width: 1536,
      height: 1024,
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
      path: "/assets/img/posts/animations/svg-transitions-and-keyframes/cover.png",
      width: 1536,
      height: 1024,
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
      path: "/assets/img/posts/svg/svg-essentials-mastering-the-path-element/cover.png",
      width: 1536,
      height: 1024,
      alt: "SVG Essentials cover featuring a neon Bézier path, SVG code, path commands, curves, arcs, and a vector-design workspace with a laptop."
    },
    toc: { maxLevel: 4 },
    signoff: "Getting ten interactive command demos, a full heart-shape decode, and the fill-rule, pathLength, and CSS path() sections to all click together took a fair share of iteration, and I hope it leaves you able to read — and write — a `d` string without flinching. Thanks for sticking with me through the whole alphabet of path commands — go draw something only you could have coded. ✏️",
    changelog: [
      { date: "2026-09-08", change: "Initial publication" }
    ],
  },
  {
    slug: "svg-essentials-mastering-text",
    title: "SVG Essentials: Text, tspan, and textPath",
    excerpt: "Position, style, and curve real SVG text.",
    description: "Learn how to position, style, and curve real SVG text — the <text> element's baseline model, text-anchor and dominant-baseline, multi-line layout with <tspan>, curved text with <textPath>, presentation attributes vs. CSS, viewBox-relative scaling, and accessibility.",
    category: ["SVG"],
    tags: ["svg", "text", "tspan", "textpath", "typography", "accessibility", "fill", "font-size", "viewbox", "data-visualization", "frontend-development"],
    toc: { maxLevel: 3 },
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-essentials-clippath-and-mask",
    title: "SVG Essentials: clipPath and mask",
    excerpt: "Hard edges with clipPath, soft fades with mask.",
    description: "A complete guide to SVG's <clipPath> and <mask> elements — hard-edged clipping vs. luminance- and alpha-driven masking, clipPathUnits, maskUnits/maskContentUnits, compound multi-shape clip regions, mask-type, and production gotchas like id collisions and performance at scale.",
    category: ["SVG"],
    tags: ["svg", "clip-path", "clippath", "mask", "masking", "luminance", "alpha-channel", "vector-graphics", "frontend", "web-design", "css"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-essentials-pattern-element",
    title: "SVG Essentials: The pattern Element",
    excerpt: "Tile fills natively with SVG's <pattern> element.",
    description: "A complete guide to the SVG pattern element — tile anatomy, patternUnits and patternContentUnits, patternTransform, href-based pattern inheritance, hatched chart fills for accessible data viz, and production caveats like id collisions and tiny-tile performance.",
    category: ["SVG"],
    tags: ["svg", "pattern", "patternunits", "patterntransform", "graphics", "vector-graphics", "data-viz", "accessibility", "frontend-development", "web-design"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-essentials-g-defs-symbol-and-use",
    title: "SVG Essentials: g, defs, symbol, and use",
    excerpt: "SVG's native component system predates every JS framework's.",
    description: "A complete guide to SVG's four container elements — g for grouping shared attributes, defs for reference-only definitions, symbol and use for independently-scaled, independently-styled reusable instances, nested svg for a viewport within a viewport, and switch for conditional rendering.",
    category: ["SVG"],
    tags: ["svg", "g", "defs", "symbol", "use", "nested-svg", "icon-sprites", "reuse", "vector-graphics", "frontend-development"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-essentials-marker-element",
    title: "SVG Essentials: The marker Element",
    excerpt: "Attach reusable arrowheads and ticks to a path's own vertices.",
    description: "A complete guide to the SVG marker element — attaching markers via marker-start/mid/end, defining a marker's viewBox/refX/refY anchor point, orient auto and auto-start-reverse for direction-following arrowheads, markerUnits, and building a real reusable arrowhead for diagrams and charts.",
    category: ["SVG"],
    tags: ["svg", "marker", "arrowheads", "orient", "markerunits", "diagrams", "data-visualization", "vector-graphics", "frontend-development"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-essentials-gradients",
    title: "SVG Essentials: linearGradient, radialGradient, and stop",
    excerpt: "Reusable gradient definitions, not one-off inline values.",
    description: "A complete guide to SVG's linearGradient and radialGradient elements — the x1/y1/x2/y2 gradient vector, objectBoundingBox vs. userSpaceOnUse, radial focal points, gradientTransform, spreadMethod, and href-based stop reuse, contrasted with CSS's gradient() functions.",
    category: ["SVG"],
    tags: ["svg", "gradients", "lineargradient", "radialgradient", "stop", "gradientunits", "vector-graphics", "frontend-development", "web-design"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-essentials-filters-fundamentals",
    title: "SVG Essentials: Filter Fundamentals",
    excerpt: "A filter is a chain of primitives, not one single effect.",
    description: "A complete guide to SVG filter fundamentals — the filter region, SourceGraphic/SourceAlpha, chaining primitives via in/in2/result, feGaussianBlur, feOffset, feMerge, feFlood, feBlend, and building a real hand-crafted drop shadow from scratch.",
    category: ["SVG"],
    tags: ["svg", "filters", "fegaussianblur", "feoffset", "femerge", "drop-shadow", "vector-graphics", "frontend-development"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-essentials-advanced-filter-primitives",
    title: "SVG Essentials: Advanced Filter Primitives",
    excerpt: "Color manipulation, compositing, noise, displacement, and lighting.",
    description: "A complete guide to SVG's advanced filter primitives — feColorMatrix, feComponentTransfer, feComposite's compositing operators, feTurbulence procedural noise, feDisplacementMap warping, the feDropShadow shorthand, and the feDiffuseLighting/feSpecularLighting family.",
    category: ["SVG"],
    tags: ["svg", "filters", "fecolormatrix", "fecomposite", "feturbulence", "fedisplacementmap", "fedropshadow", "vector-graphics", "frontend-development"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-essentials-smil-animation",
    title: "SVG Essentials: Native Animation with animate, animateTransform, and animateMotion",
    excerpt: "Path-following motion and zero-JS event-triggered animation.",
    description: "A complete guide to SVG's native SMIL animation elements — animate, animateTransform, animateMotion with mpath, set, keyTimes/calcMode timing control, zero-JavaScript event-triggered animation via begin, and how SMIL compares to CSS animation and the Web Animations API.",
    category: ["SVG"],
    tags: ["svg", "smil", "animate", "animatetransform", "animatemotion", "animation", "vector-graphics", "frontend-development"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-essentials-image-and-foreignobject",
    title: "SVG Essentials: image and foreignObject",
    excerpt: "SVG's two escape hatches into raster images and real HTML.",
    description: "A complete guide to SVG's image and foreignObject elements — preserveAspectRatio's meet/slice fitting behavior, why <image> beats a plain <img> for vector-manipulable embedding, auto-wrapping real HTML text via foreignObject, and the XML-namespace gotchas that matter for standalone SVG files.",
    category: ["SVG"],
    tags: ["svg", "image", "foreignobject", "preserveaspectratio", "embedding", "vector-graphics", "frontend-development"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "svg-essentials-metadata-and-interactivity",
    title: "SVG Essentials: Metadata, Links, and Interactivity",
    excerpt: "Accessible names, native links, deep-linkable views, and a real XSS warning.",
    description: "The closing post in the SVG Essentials series — title and desc as accessible names, ARIA roles in SVG, native <a> hyperlinks, deep-linkable <view> viewports, <style>/<script> inside SVG and the real XSS risk they carry, and <metadata>.",
    category: ["SVG"],
    tags: ["svg", "accessibility", "aria", "title", "a11y", "xss", "security", "vector-graphics", "frontend-development"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "css-custom-properties-beyond-variables",
    title: "CSS Custom Properties: Beyond Simple Variables",
    excerpt: "Variables that compute, cascade, and animate — not just store a value.",
    description: "A deep dive into CSS custom properties beyond basic theming — the cascade and inheritance rules that set them apart from Sass variables, @property for typed, animatable, inheritance-controlled properties, fallback values, the toggle trick for boolean-like state, and where computed-value timing quietly breaks a calc().",
    category: ["CSS"],
    tags: ["css", "custom-properties", "css-variables", "at-property", "cascade", "theming", "design-tokens", "frontend"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "modern-css-selectors-has-is-where-and-nesting",
    title: "Modern CSS Selectors: :has(), :is(), :where(), and Nesting",
    excerpt: ":has() turns CSS into a selector that can finally look forward.",
    description: "A complete guide to modern CSS selectors — :is() and :where() for compact, low- or zero-specificity selector lists, :has() as CSS's first real parent/relational selector, native CSS nesting with &, and the advanced selectors — attribute matching, :not() selector lists, and :nth-child(An+B of S) — that round out the toolkit.",
    category: ["CSS"],
    tags: ["css", "selectors", "has-selector", "is-selector", "where-selector", "css-nesting", "specificity", "frontend"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "spring-physics-animations-on-the-web",
    title: "Spring Physics Animations on the Web",
    excerpt: "Motion that responds to the current state, not a fixed timeline.",
    description: "How spring physics animation works on the web — mass, stiffness, and damping instead of duration and easing curves, why springs handle interruption better than keyframes, approximating springs in pure CSS with linear(), and driving a real spring loop with requestAnimationFrame and the Web Animations API.",
    category: ["Animations"],
    tags: ["animation", "spring-physics", "easing", "linear-easing-function", "web-animations-api", "motion-design", "frontend"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "web-animations-api",
    title: "The Web Animations API: JS-Driven Animation Without CSS",
    excerpt: "Animation as a first-class JavaScript object, not a declarative side effect.",
    description: "A complete guide to the Web Animations API — element.animate(), keyframe and timing-option syntax, controlling playback with play/pause/reverse/finish, composite operations, commitStyles, and when JS-driven animation earns its keep over CSS transitions and @keyframes.",
    category: ["Animations"],
    tags: ["javascript", "web-animations-api", "animation", "keyframes", "animation-timeline", "frontend"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "git-hooks-automating-your-workflow",
    title: "Git Hooks: Automating Your Workflow",
    excerpt: "Let Git run your checks before a habit has to.",
    description: "A complete guide to Git hooks — every local hook type and when it fires, writing a real pre-commit and commit-msg hook, exit-code semantics, sharing hooks across a team with core.hooksPath or Husky, and why a slow hook quietly trains people to reach for --no-verify.",
    category: ["Git"],
    tags: ["git", "git-hooks", "automation", "husky", "cli", "developer-workflow"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
    ]
  },
  {
    slug: "git-worktrees-multiple-branches",
    title: "Git Worktrees: Working on Multiple Branches at Once",
    excerpt: "A second working directory, not a second clone.",
    description: "A complete guide to git worktree — what it solves that stash and a second clone don't, add/list/remove/prune/lock, how a linked worktree is actually stored under .git/worktrees, and the gotchas around shared branches, build artifacts, and IDE indexing.",
    category: ["Git"],
    tags: ["git", "git-worktree", "branching", "cli", "developer-workflow"],
    changelog: [
      { date: "2026-09-09", change: "Initial publication" }
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
