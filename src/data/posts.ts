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
    tags: ["javascript", "operators", "es6+", "frontend", "cheatsheet", "optional-chaining", "nullish-coalescing", "spread-operator", "ternary-operator", "type-coercion"],
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
    slug: "container-queries-deep-dive",
    title: "Container Queries Deep Dive: Component-Level Responsive Design",
    excerpt: "Build components that don't care where they're dropped.",
    description: "Go beyond basic @container syntax with containment types and their pitfalls, named containers, container query units (cqi/cqb/cqmin/cqmax), and the new @container style() queries — plus a real inline-SVG case study.",
    category: ["CSS"],
    tags: ["css", "container-queries", "responsive-design", "component-driven-design", "container-units", "style-queries", "named-containers", "modern-css", "cqi", "svg"],
    signoff: "The named-container diagram took the most redrawing—getting an arrow to visually 'skip past' the nearer box without looking like it was just pointing at the wrong thing turned out to be harder than the math-heavy gradient diagrams. The sandbox's middle tab is the one I'm most pleased with: the exact same @container rule and breakpoint number, and flipping one radio button alone is enough to change which box gets measured. I hope that makes the nearest-vs-named distinction click faster than the CSS alone ever could. Thanks for containing yourself with me. 📦",
    changelog: [
      { date: "2026-09-06", change: "Initial publication" }
    ]
  },
  {
    slug: "taming-image-and-video-boxes",
    title: "object-fit, object-position, and aspect-ratio: Taming Image and Video Boxes",
    excerpt: "Fit it, crop it, reserve its space.",
    description: "A beginner-to-advanced guide to object-fit, object-position, and aspect-ratio — how browsers size and crop images, video, and canvas, and how to reserve layout space up front to eliminate layout shift.",
    category: ["CSS"],
    tags: ["css", "layout", "responsive", "beginner", "advanced", "frontend", "browser-support", "progressive-enhancement", "modern-css", "accessibility", "object-fit", "object-position", "aspect-ratio", "images", "responsive-images", "video", "cls"],
    signoff: "The aspect-ratio/CLS diagram ended up being the trickiest of the three — getting a 'before' row that visibly jumps and an 'after' row that visibly doesn't, without any actual animation to lean on, took more iterating than a static SVG usually asks for. I hope watching one shared object-fit/object-position/aspect-ratio setting crop a landscape photo, a portrait photo, and a mock video frame all at once in the playground makes it click faster than five keyword definitions ever could on their own. Thanks for taming a few boxes with me. 🖼️",
    changelog: [
      { date: "2026-09-06", change: "Initial publication" }
    ]
  },
  {
    slug: "color-mix-and-relative-color-syntax",
    title: "color-mix() and Relative Color Syntax: The New Color Functions",
    excerpt: "Derive colors natively — no Sass required.",
    description: "A beginner-to-advanced guide to CSS color-mix() and relative color syntax, covering color-space interpolation, hue methods, and native design-token theming.",
    category: ["CSS"],
    tags: ["css", "modern-css", "color-theory", "oklch", "color-mix", "relative-color-syntax", "design-tokens", "theming", "hue-interpolation", "scss", "advanced", "browser-support", "progressive-enhancement", "frontend"],
    signoff: "Getting the srgb-vs-oklch comparison diagram's 50% swatch to land on a real, provable mid-gray — not just an eyeballed one — took more color math than any diagram since the gradients post, and the hue-interpolation wheel needed a redraw once I realized 'shorter' and 'longer' only make sense once you can actually see both arcs at once. I hope dragging one brand color through the Relative Color tab makes an entire token ramp feel like one property instead of ten. Thanks for deriving a palette with me. 🎨",
    changelog: [
      { date: "2026-09-06", change: "Initial publication" }
    ]
  },
  {
    slug: "backdrop-filter-and-css-filters",
    title: "backdrop-filter and Filters: Blur, Glassmorphism, and Duotone Effects",
    excerpt: "Blur what's behind it, not what's on it.",
    description: "A beginner-to-advanced guide to CSS filter and backdrop-filter — the full function list, the crucial distinction between the two properties, chaining order, drop-shadow() vs box-shadow, and building glassmorphism cards and duotone effects both as a CSS approximation and a real SVG filter.",
    category: ["CSS"],
    tags: ["css", "filters", "backdrop-filter", "glassmorphism", "duotone", "blur", "ui-design", "modern-css", "browser-support", "progressive-enhancement", "performance", "gpu-acceleration", "advanced", "beginner", "frontend", "svg"],
    signoff: "Getting the real SVG feComponentTransfer duotone filter to update live from two color pickers — rewriting its transfer-function tables on every input instead of just swapping a precomputed image — took more wiring than the CSS-approximation tab sitting right next to it. I hope toggling between filter and backdrop-filter on the exact same blurred scene makes that one distinction click faster than the definitions alone ever could. Thanks for blurring the right layer with me. 🪟",
    changelog: [
      { date: "2026-09-06", change: "Initial publication" }
    ]
  },
  {
    slug: "css-cascade-layers",
    title: "Cascade Layers (@layer): Taming Specificity Wars in Large Codebases",
    excerpt: "Priority by declaration order, not by selector warfare.",
    description: "How CSS @layer lets you control cascade priority by declared layer order instead of specificity — ending the !important arms race in large codebases, design systems, and utility-class stacks.",
    category: ["CSS"],
    tags: ["css", "cascade-layers", "specificity", "css-architecture", "modern-css", "advanced", "browser-support", "progressive-enhancement", "frontend", "scss"],
    signoff: "The sandbox rewrites a real <style> tag on every control change instead of faking the outcome, so the four rules genuinely fight it out in your own browser's cascade — getting the plain-English \"why\" readout to name the actual deciding rule (layer order, specificity, the !important reversal, or unlayered-wins) took more edge-case testing than any playground logic I've written for this site. I hope watching a real browser make that call live sticks better than the sort-order table alone. Thanks for picking a side in the specificity war with me. 🗂️",
    changelog: [
      { date: "2026-09-06", change: "Initial publication" }
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
