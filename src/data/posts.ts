import type { ChangelogEntry } from "@/components/Changelog/Changelog.types";

// One image serves both the post page and share previews, so each field has to suit readers as well as social cards.
export interface PostImage {
  // Relative or absolute image path.
  path: string;
  width: number;
  height: number;
  type?: string;
  // Required so the visible cover is never announced to screen readers as a bare file name.
  alt: string;
  // Written for sighted readers, so it adds to the image instead of repeating its alt description.
  caption: string;
}

// Per-post table-of-contents configuration.
export interface PostTocConfig {
  // Set false to hide the ToC sidebar entirely for this post. Defaults to true.
  show?: boolean;
  // Deepest heading level to include (2 = h2 only, 3 = h2+h3, 4 = h2+h3+h4). Defaults to 3.
  maxLevel?: 2 | 3 | 4;
}

// Single source of truth for a post, so list cards, prev/next nav, and the page header can't drift apart.
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

// Trimmed to what a nav link shows so neighbours don't carry whole entries around.
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
  Each entry needs a matching app/(site)/(internal)/(post)/post/<category-slug>/<slug>/page.mdx,
  where <category-slug> is the slugified first `category`. Dates are deliberately absent — they
  come from git history at build time. Keep it oldest-first (append new posts), since prev/next
  nav follows array order.
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
      alt: "Flat-design digital illustration introducing CSS Grid fundamentals, featuring icons for grid containers, tracks, and layout structures.",
      caption: "Grid containers, tracks and cells — the building blocks of every 2D layout."
    },
    signoff: "This one took a good deal of care to get the fundamentals right, and I hope it gives you a solid footing with containers, tracks, and your first 2D layout. Appreciate you taking the time to work through it with me — happy gridding. 🧱",
    pinned: true,
    changelog: [
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
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/mastering-css-grid/cover.png",
      width: 1200,
      height: 630,
      type: "image/png",
      alt: "Stylized 2D illustration visualizing advanced CSS Grid techniques like alignment, named grid areas, and spanning elements across rows and columns.",
      caption: "Named grid areas, item alignment and spanning across rows and columns."
    },
    signoff: "A lot of testing and refining went into getting these grid-area, alignment, spanning, subgrid, and accessibility examples just right, and I hope that effort shows in how clearly they click for you. Thanks for following along — hope your layouts feel a little more precise now. 📐",
    pinned: true,
    changelog: [
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
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
      alt: "Colorful flat-design illustration showcasing responsive CSS Grid techniques, including fr units, minmax(), auto-fit, media queries, and container queries.",
      caption: "Responsive grids built from fr units, minmax(), auto-fill and auto-fit."
    },
    signoff: "This one took a fair amount of work to put together — from fr units and minmax() to auto-fit, auto-fill, and container queries — and I hope it makes your layouts hold up wherever they're viewed. Really glad you stuck around for this one — go make your grids bend without breaking. 🎉",
    pinned: true,
    featured: true,
    changelog: [
      { date: "2026-10-31", change: "Added cross-reference to tutorial 'Colouring a CSS `text-overflow` Ellipsis Separately from Its Text'" },
      { date: "2026-10-18", change: "Added cross-reference to post 'CSS Container Queries Deep Dive: Named Containers, `cqi` Units, and Style Queries'" },
      { date: "2026-10-08", change: "Added cross-reference to post 'Mastering CSS z-index: Stacking Contexts, isolation, and Layering Bugs'" },
      { date: "2026-09-19", change: "Added cross-reference to tutorial 'Dynamic Viewport Height Units'" },
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
      alt: "CSS Transitions cover image featuring a large “CSS Transitions” title, a glowing “Hover me” button with motion trails, transition properties such as opacity and transform, and a CSS code panel illustrating smooth state changes, easing, duration, delay, events, and performance.",
      caption: "A hover button easing between states as properties transition smoothly."
    },
    signoff: "This one took a fair bit of tinkering to get the playground feeling just right, and I hope tuning duration, delay, and timing-function with your own hands makes transitions click in a way reading alone never quite does. Thanks for hovering, toggling, and sticking with me through it — go make your UI feel a little smoother. ✨",
    toc: { maxLevel: 3 },
    changelog: [
      { date: "2026-11-06", change: "Added cross-references to posts 'Mastering CSS `@starting-style`: The Complete Beginner's Guide' and 'Animate Dialogs & Popovers with CSS `@starting-style`'" },
      { date: "2026-11-02", change: "Added cross-reference to tutorial 'Animating `height: auto` in CSS with `interpolate-size`'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-25", change: "Added cross-reference to tutorial 'CSS-Only Tooltips with `attr()` and `content`'" },
      { date: "2026-10-08", change: "Added cross-reference to post 'Mastering CSS z-index: Stacking Contexts, isolation, and Layering Bugs'" },
      { date: "2026-10-07", change: "Added cross-reference to post 'HTML5 Canvas Guide: Drawing, Animation, and Best Practices'" },
      { date: "2026-10-04", change: "Added cross-references to posts 'An Interactive Guide to CSS Easing Functions', 'An Interactive Guide to CSS cubic-bezier()' and 'An Interactive Guide to the CSS linear() Easing Function'" },
      { date: "2026-09-24", change: "Added cross-reference to post 'Mastering CSS steps() for Discrete, Stepped Animations'" },
      { date: "2026-09-13", change: "Added cross-reference to tutorial 'Hinting Layer Promotion with will-change'" },
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
      alt: "Git Basics: A Beginner’s Guide to Version Control — a dark neon tech illustration showing Git’s working directory, staging area, repository, branching and merging workflow, terminal commands, Git logo, and Git object model.",
      caption: "Git's working directory, staging area and repository, with branching and merging."
    },
    signoff: "This one's meant to be the guide I wish I'd had when Git still felt like a wall of unfamiliar commands — I hope it makes that first `git merge` conflict feel like a puzzle instead of a crisis. Part 2 picks up right where this leaves off. 🌱",
    pinned: true,
    changelog: [
      { date: "2026-11-08", change: "Added cross-reference to snippet '`git sync`: Update Your Branch from `main` in One Command'" },
      { date: "2026-11-08", change: "Added cross-reference to snippet '`git prune-branches`: Delete Merged and Squash-Merged Branches'" },
      { date: "2026-11-08", change: "Added cross-reference to snippet 'Git Aliases Worth Adding to Your `~/.gitconfig`'" },
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
      alt: "Advanced Git: Rebasing, Internals, and Real-World Workflows — a dark neon Git-themed illustration featuring interactive rebasing and commit graphs, Git’s blob-tree-commit-tag object model, advanced Git commands, reflog-based recovery, and GitHub Flow, Git Flow, and trunk-based development workflows.",
      caption: "Interactive rebasing, Git's object model, reflog recovery and team workflows."
    },
    signoff: "This half is the one that turns Git from \"a tool I follow instructions for\" into something you can actually reason about — I hope the internals section in particular makes the rest of it click. Thanks for sticking with the series through to the end. 🚀",
    pinned: true,
    changelog: [
      { date: "2026-11-08", change: "Added cross-reference to snippet '`git sync`: Update Your Branch from `main` in One Command'" },
      { date: "2026-11-08", change: "Added cross-reference to snippet '`git prune-branches`: Delete Merged and Squash-Merged Branches'" },
      { date: "2026-11-08", change: "Added cross-reference to snippet 'Git Aliases Worth Adding to Your `~/.gitconfig`'" },
      { date: "2026-10-26", change: "Added cross-reference to snippet '`git fix-dates`: Fix GitHub Commit Dates After a Rebase'" },
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
      alt: "SVG Essentials — Mastering Basic Shapes in SVG, featuring colorful geometric shapes, an SVG editor interface, coordinate system, viewBox, geometry rules, and SVG code on a vibrant dark gradient background.",
      caption: "SVG's basic shapes placed on its coordinate system and viewBox."
    },
    signoff: "Between the six shape playgrounds, the presentation-attributes demo, and getting that radar sweep to pivot from exactly the right point, this ended up with more moving pieces than any SVG post so far — I hope tinkering with those sliders builds more intuition than the coordinate math alone ever could. Thanks for working through the whole toolkit with me. Go build something that scales without breaking a sweat. 🎯",
    changelog: [
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-07", change: "Added cross-reference to post 'HTML5 Canvas Guide: Drawing, Animation, and Best Practices'" },
      { date: "2026-08-25", change: "Added cross-reference to post 'SVG Polygon vs Polyline: Differences, Fill Rules, and Use Cases'" },
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
      alt: "Mastering JavaScript Operators — a colorful neon infographic showing JavaScript operator categories, code examples, and modern syntax for writing clean, efficient code.",
      caption: "JavaScript's operator categories, from arithmetic to nullish coalescing."
    },
    toc: { maxLevel: 4 },
    signoff: "Every operator in this guide—from `+` to `??=`—got its own runnable example, and the precedence table alone went through more revisions than I'd like to admit before it was scannable at a glance. This is the most thorough reference on the site so far; thanks for working through all of it with me. Go write cleaner conditionals. ✨",
    changelog: [
      { date: "2026-11-10", change: "Added cross-reference to post 'What's New in ES2026: Every Feature Explained'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2025-08-23", change: "Initial publication" }
    ]
  },
  {
    slug: "polygon-vs-polyline",
    title: "SVG Polygon vs Polyline: Differences, Fill Rules, and Use Cases",
    excerpt: "Same points, open or closed: fill rules, miters, sparklines.",
    description: "The difference between SVG polygon and polyline: fill rules by ray-crossing, stroke-miterlimit, generated points, sparklines, animation and accessible charts.",
    category: ["SVG"],
    tags: ["svg", "polygon", "polyline", "shapes", "fill-rule", "stroke-miterlimit", "sparklines", "data-visualization", "svg-animation", "vector-graphics", "icons", "performance", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/svg/polygon-vs-polyline/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Split comparison of CSS <polyline> and <polygon>, showing an open, stroke-based polyline built from points alongside a closed, area-based polygon with fill-rule examples, miters, and related SVG graphics.",
      caption: "An open, stroked polyline beside a closed, filled polygon."
    },
    signoff: "From the point-scrambling playground that turns a clean square into a self-intersecting hourglass mid-drag and the square, hexagon, and star presets, to the ray diagram that finally shows why a star's centre winds twice, the miter-limit slider that snaps a spike into a bevel right at 29°, and the generated points behind a sparkline that stretches without its stroke going wonky, this post leaned on live demos to do work that formulas alone never quite pull off. Thanks for dragging every vertex, flipping every fill rule, and sharpening every corner with me — go close off a shape that's entirely your own. ⬡",
    featured: true,
    changelog: [
      { date: "2026-11-04", change: "Added cross-reference to tutorial 'The CSS `shape()` Function: Responsive `clip-path` Shapes'" },
      { date: "2026-10-17", change: "Added cross-reference to tutorial 'Squircles, Bevels and Scoops with `corner-shape`'" },
      { date: "2026-09-30", change: "Expanded with fill-rule, miter-limit, generated-points, sparkline, animation and switch-to-path sections, three diagrams and two playgrounds; corrected fill-rule and hole explanations" },
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
      alt: "Cover image for ‘CSS Logical Properties: Writing Modes, RTL, and Direction-Aware Layouts,’ showing physical properties compared with logical properties, LTR and RTL direction controls, horizontal and vertical writing modes, inline and block axis diagrams, and direction-aware layout mappings.",
      caption: "Physical properties mapped to logical ones across LTR, RTL and vertical writing modes."
    },
    signoff: "This one leaned harder on visuals than any post before it — four custom SVG diagrams built to keep the inline and block axes crossing the right way in every writing mode, plus the direction/writing-mode toggle above to prove it live. Chasing all sixty-some properties across sixteen categories down to their physical equivalents turned up a few surprises along the way — a couple of values that looked valid but aren't implemented anywhere, one that isn't even real syntax. I hope watching those arrows and toggles do their thing builds more intuition than the mapping tables alone ever could. Thanks for tracing every axis with me — go replace a `margin-left` with something that actually adapts. 🧭",
    changelog: [
      { date: "2026-11-02", change: "Added cross-reference to tutorial 'Pure CSS Carousels with `::scroll-marker` and `::scroll-button()`'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-17", change: "Added cross-reference to tutorial 'Squircles, Bevels and Scoops with `corner-shape`'" },
      { date: "2026-09-19", change: "Added cross-reference to tutorial 'Dynamic Viewport Height Units'" },
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
      alt: "Illustrated cover image for “Mastering CSS Gradients: Types, Use Cases & Best Practices,” featuring vibrant neon CSS gradients with linear, radial, conic, and repeating gradient examples, layered gradient effects, CSS code, animated gradient waves, OKLCH color interpolation, and SCSS utilities on a dark futuristic background.",
      caption: "Linear, radial, conic and repeating gradients, layered and blended in CSS."
    },
    signoff: "The five diagrams gave me the most trouble up front—getting the off-center radial boundaries to line up with the actual math, and the conic sweep to read as clockwise-from-the-top at a glance—and turning the playground into three real tabs (gradient types plus repeating, a toggleable glass layer stack, and all three animated demos with a reduced-motion switch) took a lot more wiring than the original single-panel version. I hope dragging every one of those controls makes gradients click in a way reading about them never quite does. Thanks for gradient-ing along with me. 🌈",
    changelog: [
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-11-01", change: "Added cross-reference to tutorial 'CSS Custom Functions with `@function`: Reusable Logic Without Sass'" },
      { date: "2026-10-07", change: "Added cross-reference to post 'HTML5 Canvas Guide: Drawing, Animation, and Best Practices'" },
      { date: "2026-09-28", change: "Added cross-reference to post 'CSS Gradient Borders: Complete Guide with Techniques & Examples'" },
      { date: "2026-09-27", change: "Added cross-reference to post 'CSS Gradient Text Guide: Background-Clip, Animation & Advanced Tricks'" },
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
      alt: "Cover image for “Animating SVG: A Guide to CSS Transitions and Keyframes,” featuring colorful animated SVG-inspired shapes, motion paths, shape morphing, rotating elements, CSS @keyframes code, and a dark gradient background. The image highlights transitions, keyframes, motion paths, and shape morphing.",
      caption: "SVG shapes rotating, morphing and following motion paths with CSS animation."
    },
    signoff: "Getting the radar's sweep to pivot from the right point back in the basic shapes post turned out to be the easy part. This round added five more interactive panels, each wiring its own live code and controls to real `@keyframes` — and the trickiest bug wasn't in the animation at all, it was figuring out why an elliptical arc needs to end 0.1 units short of its own starting point just to keep the motion-path math from collapsing into nothing. Thanks for hovering the heart and sun, looping the radar, dragging the draw-on and stagger sliders, toggling the comet's curve-following on and off, and watching a circle round itself into a square with me — go animate something that used to just sit there. 🎯",
    toc: { maxLevel: 3 },
    changelog: [
      { date: "2026-11-09", change: "Added cross-reference to snippet 'SVG Circular Progress Ring with CSS Variables'" },
      { date: "2026-11-09", change: "Added cross-reference to snippet 'SVG Marching Ants Border for Drop Zones and Selections'" },
      { date: "2026-11-09", change: "Added cross-reference to snippet 'SVG Three-Dot Loading Indicator with Staggered Delays'" },
      { date: "2026-11-07", change: "Added cross-reference to snippet 'CSS & SVG Loading Spinner from One Circle'" },
      { date: "2026-11-04", change: "Added cross-reference to tutorial 'The CSS `shape()` Function: Responsive `clip-path` Shapes'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-04", change: "Added cross-reference to post 'An Interactive Guide to CSS cubic-bezier()'" },
      { date: "2026-09-24", change: 'Added cross reference to post "Mastering CSS steps() for Discrete, Stepped Animations" from the radar scanner case study' },
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
      alt: "SVG Essentials cover featuring a neon Bézier path, SVG code, path commands, curves, arcs, and a vector-design workspace with a laptop.",
      caption: "A Bézier curve drawn with SVG path commands, curves and arcs."
    },
    toc: { maxLevel: 4 },
    signoff: "Getting ten interactive command demos, a full heart-shape decode, and the fill-rule, pathLength, and CSS path() sections to all click together took a fair share of iteration, and I hope it leaves you able to read — and write — a `d` string without flinching. Thanks for sticking with me through the whole alphabet of path commands — go draw something only you could have coded. ✏️",
    changelog: [
      { date: "2026-11-09", change: "Added cross-reference to snippet 'SVG Marching Ants Border for Drop Zones and Selections'" },
      { date: "2026-11-07", change: "Added cross-reference to snippet 'CSS & SVG Loading Spinner from One Circle'" },
      { date: "2026-11-04", change: "Added cross-reference to tutorial 'The CSS `shape()` Function: Responsive `clip-path` Shapes'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
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
      alt: "JavaScript observers diagram illustrating MutationObserver, IntersectionObserver, ResizeObserver, and PerformanceObserver in reactive web development.",
      caption: "Mutation, Intersection, Resize and Performance observers reacting to page changes."
    },
    toc: { maxLevel: 4 },
    signoff: "Four observer APIs, a custom Pub/Sub implementation, and a sandbox that lets you mutate, scroll, and resize your way through all three DOM observers live — getting the IntersectionObserver strike-zone math right for the scrollspy pattern took more whiteboarding than I expected. Thanks for reading all the way to the FAQ section; go replace a scroll listener with something that only runs when it actually needs to. 👀",
    changelog: [
      { date: "2026-11-12", change: "Added cross-reference to post 'What's New in ES2027: Temporal, using and More'" },
      { date: "2026-11-04", change: "Added cross-reference to tutorial 'Native JavaScript Set Methods: union, intersection and difference'" },
      { date: "2026-11-02", change: "Added cross-reference to tutorial 'Pure CSS Carousels with `::scroll-marker` and `::scroll-button()`'" },
      { date: "2026-09-13", change: "Added cross-reference to tutorial 'Hinting Layer Promotion with will-change'" },
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
      alt: "JavaScript event loop diagram with callbacks, promises, async/await, and microtask vs macrotask queues.",
      caption: "The event loop running callbacks, promises and async/await through its task queues."
    },
    toc: { maxLevel: 4 },
    signoff: "Getting the microtask-vs-macrotask ordering to click as a diagram instead of just a list of rules took a few passes, and building a live Promise.all/allSettled/race/any playground next to the section that explains them felt like the right way to make combinator choice concrete instead of theoretical. Thanks for following the whole callbacks → promises → async/await arc with me; go find an unnecessary sequential await in your own code and fix it. ⏱️",
    changelog: [
      { date: "2026-11-12", change: "Added cross-reference to post 'What's New in ES2027: Temporal, using and More'" },
      { date: "2026-11-07", change: "Added cross-reference to tutorial 'Collecting Async Iterables into Arrays with `Array.fromAsync()`'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
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
      alt: "Neon-themed CSS keyframes guide cover showing multi-step animation timelines, a bouncing gradient sphere, CSS @keyframes code, animation controls, smooth animation examples, and a laptop on a dark developer workspace.",
      caption: "A bouncing sphere driven through a multi-step @keyframes timeline."
    },
    toc: { maxLevel: 3 },
    signoff: "Between the core keyframes playground and a second sandbox built just to make `animation-timeline` and `animation-range` tangible — complete with a live range slider and its own feature-detection fallback for browsers that don't support scroll-driven animations yet — this one ended up needing two full interactive builds instead of one. Getting the `animation-range` diagram to actually line up entry/contain/cover/exit against a scrolling element took more iteration than the rest of the post combined. Thanks for tweaking every duration, delay, and range slider with me — go give your loops, spinners, and scroll reveals some real personality. 🎬",
    changelog: [
      { date: "2026-11-12", change: "Added cross-reference to post 'What's New in CSS in 2027: What to Expect'" },
      { date: "2026-11-11", change: "Added cross-reference to post 'Interop 2026 and CSS Snapshot 2026: What They Mean for CSS'" },
      { date: "2026-11-10", change: "Added cross-reference to post 'What's New in CSS in 2026: What You Can Use Now'" },
      { date: "2026-11-10", change: "Updated browser support for `animation-timeline`" },
      { date: "2026-11-09", change: "Added cross-reference to snippet 'SVG Three-Dot Loading Indicator with Staggered Delays'" },
      { date: "2026-11-07", change: "Added cross-reference to snippet 'CSS & SVG Loading Spinner from One Circle'" },
      { date: "2026-11-06", change: "Added cross-reference to post 'Mastering CSS `@starting-style`: The Complete Beginner's Guide'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-08", change: "Added cross-reference to post 'Mastering CSS z-index: Stacking Contexts, isolation, and Layering Bugs'" },
      { date: "2026-10-04", change: "Added cross-references to posts 'An Interactive Guide to CSS Easing Functions', 'An Interactive Guide to CSS cubic-bezier()' and 'An Interactive Guide to the CSS linear() Easing Function'" },
      { date: "2026-09-24", change: "Added cross-reference to post 'Mastering CSS steps() for Discrete, Stepped Animations'" },
      { date: "2026-09-13", change: "Added cross-reference to tutorial 'Hinting Layer Promotion with will-change'" },
      { date: "2026-09-13", change: "Initial publication" }
    ],
  },
  {
    slug: "css-step-timing-function",
    title: "Mastering CSS steps() for Discrete, Stepped Animations",
    excerpt: "Master discrete frame-based jumps in CSS animations.",
    description: "A comprehensive guide to the CSS steps() function, detailing its syntax, parameters, and practical applications for creating unique, stepped animation effects in web design. Boost your CSS animation skills.",
    category: ["Animations"],
    tags: ["css", "css3", "animation", "css-animation", "web-animation", "steps", "transition", "keyframes", "timing-function", "web-design", "css-tricks", "discrete-animation", "typewriter-effect", "sprite-animation", "web-performance", "ui-animation"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/animations/css-step-timing-function/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-themed CSS steps() guide cover showing a staircase progress curve, a ticking digital clock second hand, a typewriter text reveal, sprite-sheet animation frames, and CSS code panels illustrating discrete, stepped motion on a dark developer workspace.",
      caption: "A staircase timing curve behind ticking clocks, typewriter text and sprite frames."
    },
    toc: { maxLevel: 3 },
    signoff: "This one needed six separate playgrounds instead of one — a typewriter, a ticking clock, a chunked progress bar, a sprite-sheet walk cycle, per-keyframe steps, and a jump-term sandbox — plus a small SVG curve-plotting engine built from scratch just to make every jump-term's staircase, the step-start/step-end shorthands, and a six-way race between them visible instead of theoretical. Chasing down the off-by-one frames, the blank sprite flash, and the readouts that had to agree with what each jump term actually renders took longer than writing any single section. Thanks for ticking through every one of them with me — go find the one motion in your UI that wants to jump instead of glide. 🎞️",
    changelog: [
      { date: "2026-10-04", change: "Added cross-references to posts 'An Interactive Guide to CSS Easing Functions', 'An Interactive Guide to CSS cubic-bezier()' and 'An Interactive Guide to the CSS linear() Easing Function'" },
      { date: "2026-09-24", change: "Initial publication" },
    ],
  },
  {
    slug: "css-gradient-text",
    title: "CSS Gradient Text Guide: Background-Clip, Animation & Advanced Tricks",
    excerpt: "Create stunning gradient text effects with CSS",
    description: "Learn how to create CSS gradient text using background-clip, animation, stroke effects, @property, multi-line fixes, and accessible, responsive techniques with real-world examples.",
    category: ["CSS"],
    tags: ["css", "gradients", "gradient-text", "typography", "background-clip", "text-effects", "css-animation", "accessibility", "frontend-development", "web-design", "responsive", "advanced-css", "svg", "progressive-enhancement", "browser-support", "css-custom-properties"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/css-gradient-text/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-themed CSS gradient text guide cover featuring colorful “Gradient Text” typography, background-clip: text styling, a CSS code panel, gradient color controls, animation settings, and a list of gradient text techniques on a dark futuristic background.",
      caption: "Gradient-filled headline text cut out with background-clip: text."
    },
    toc: { maxLevel: 3 },
    signoff: "The four-line recipe was the easy part — the real work was proving every variant actually renders the way the prose claims. The stroke, blend-mode, and video examples all had to be rebuilt after testing them in a real browser, and the playground's wrap-fix toggle only started doing anything once the gradient moved onto an inline span the flex layout couldn't blockify. I hope flipping that toggle, and watching the readout print the exact CSS behind each change, makes the whole clipping trick click. Thanks for reading all the way to the last gradient stop. 🌈",
    changelog: [
      { date: "2026-10-25", change: "Added cross-reference to tutorial 'CSS-Only Tooltips with `attr()` and `content`'" },
      { date: "2026-10-08", change: "Added cross-reference to post 'Mastering CSS z-index: Stacking Contexts, isolation, and Layering Bugs'" },
      { date: "2026-09-27", change: "Initial publication" }
    ]
  },
  {
    slug: "css-gradient-borders",
    title: "CSS Gradient Borders: Complete Guide with Techniques & Examples",
    excerpt: "Build gradient borders using modern CSS techniques",
    description: "A complete guide to CSS gradient borders using border-image, background-clip, mask, conic and radial gradients, @property animations, and a reusable SCSS mixin with real-world examples.",
    category: ["CSS"],
    tags: ["css", "gradients", "borders", "background-clip", "scss", "mixins", "animation", "accessibility", "ui-design", "frontend"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/css-gradient-borders/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "CSS Gradient Borders tutorial banner featuring colorful neon gradient border techniques, including linear, conic, mask, animated, radial, and SCSS mixin examples, with the title “CSS Gradient Borders” and supporting technique icons.",
      caption: "Linear, conic, radial and animated gradient borders around UI boxes."
    },
    toc: { maxLevel: 3 },
    signoff: "Three techniques that look alike on a white page turned out to behave very differently once I put them over a striped background — which is how the see-through-center rule for picking mask over background-clip ended up at the heart of this post. Rebuilding the playground's conic animation around an @property angle, after the background-position version just zoomed into one flat hue, and reworking the mixin so every argument can be named, took more iterations than the rest of the post combined. I hope the side-by-side comparison saves you from guessing which one to reach for. Thanks for bordering on obsessive with me. 🖼️",
    changelog: [
      { date: "2026-11-09", change: "Added cross-reference to snippet 'SVG Marching Ants Border for Drop Zones and Selections'" },
      { date: "2026-10-17", change: "Added cross-reference to tutorial 'Squircles, Bevels and Scoops with `corner-shape`'" },
      { date: "2026-10-08", change: "Added cross-reference to post 'Mastering CSS z-index: Stacking Contexts, isolation, and Layering Bugs'" },
      { date: "2026-09-28", change: "Initial publication" }
    ]
  },
  {
    slug: "css-easing-functions-guide",
    title: "An Interactive Guide to CSS Easing Functions",
    excerpt: "Feel how the five easing keywords shape motion.",
    description: "A visual guide to CSS timing functions: how time maps to progress, why ease, linear, ease-in, ease-out and ease-in-out feel so different, and when to use each.",
    category: ["Animations"],
    tags: ["css", "animation", "transition", "timing-function", "easing", "css-animation", "microinteractions", "ui-design", "motion-design", "accessibility", "steps", "beginner", "frontend"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/animations/css-easing-functions-guide/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "CSS easing functions guide cover showing five easing curves—linear, ease, ease-in, ease-out, and ease-in-out—with comparison graphs, CSS timing-function examples, and animated race tracks illustrating how each curve affects motion.",
      caption: "Five easing curves racing side by side, from linear to ease-in-out."
    },
    toc: { maxLevel: 3 },
    signoff: "This one turned into far more build than prose: a shared plotting engine, a labelled graph for each of the five keywords, and races that solve every curve frame by frame so the marker moves exactly as the browser would. Checking every number in the prose against the curve it describes took longer than writing any single section. Thanks for racing and comparing your way through it with me — now go and give every entrance, exit and state change the curve it deserves. 📈",
    changelog: [
      { date: "2026-10-04", change: "Initial publication" }
    ]
  },
  {
    slug: "css-cubic-bezier-guide",
    title: "An Interactive Guide to CSS `cubic-bezier()`",
    excerpt: "Drag two control points, design your own curve.",
    description: "An interactive guide to CSS cubic-bezier(): what the four numbers control, how to build overshoot and anticipation curves, hand-tuned recipes, and a draggable curve playground.",
    category: ["Animations"],
    tags: ["css", "animation", "transition", "timing-function", "cubic-bezier", "easing", "css-animation", "microinteractions", "ui-design", "motion-design", "overshoot", "accessibility", "linear-easing", "frontend"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/animations/css-cubic-bezier-guide/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "CSS cubic-bezier easing guide showing colorful timing-function curves, control-point graphs, and animated motion examples for linear, ease, ease-in, ease-out, and ease-in-out.",
      caption: "Custom cubic-bezier() curves shaped by dragging their two control points."
    },
    toc: { maxLevel: 3 },
    signoff: "The draggable playground was the heart of this one — full keyboard control, a ghost-dot track, and a preview that respects reduced motion — alongside races for the supercharged, overshoot and recipe curves. Checking every number against the curve it describes, right down to how far a 1.25 control point really overshoots, took longer than writing any single section. Thanks for dragging and racing your way through it with me — now go and design a curve that's entirely yours. 🎛️",
    changelog: [
      { date: "2026-10-04", change: "Initial publication" }
    ]
  },
  {
    slug: "css-linear-easing-function-guide",
    title: "An Interactive Guide to the CSS `linear()` Easing Function",
    excerpt: "Chain custom stops into springs, bounces, and elastics.",
    description: "A deep, interactive guide to CSS's linear() easing function — comma-separated stops, percentage positions, and building spring and bounce curves cubic-bezier() can't express.",
    category: ["Animations"],
    tags: ["css", "animation", "css-animation", "timing-function", "easing", "linear-easing", "cubic-bezier", "spring-animation", "bounce-easing", "web-animation", "ui-design", "microinteractions", "accessibility", "advanced", "frontend"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/animations/css-linear-easing-function-guide/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "CSS linear() easing function with custom animation timing curves illustrating progress and motion.",
      caption: "Multi-point linear() curves approximating bounce and spring motion."
    },
    toc: { maxLevel: 3 },
    signoff: "Plotting straight lines sounds simple until every stop needs the browser's exact auto-spacing and clamping rules behind it. This one needed an open-ended playground — drag, pin, add, remove and type stops, with a live preview running the real linear() value — plus static graphs and races for every worked example, from the auto-spacing table to the ten-stop elastic settle and the flat-segment syntax. Getting the bounce, spring and wind-up presets to each feel distinct took more rounds of tuning than any curve on the cubic-bezier() side of the series. Thanks for tracing every stop with me — now go and chain together a curve of your own. 🌀",
    changelog: [
      { date: "2026-10-04", change: "Initial publication" }
    ]
  },
  {
    slug: "html5-canvas-guide",
    title: "HTML5 Canvas Guide: Drawing, Animation, and Best Practices",
    excerpt: "Draw, animate, and optimise graphics with the Canvas API.",
    description: "Learn the HTML5 Canvas API from first shapes to advanced techniques — paths, transforms, animation, input, high-DPI, OffscreenCanvas, pixels, and 3D.",
    category: ["JavaScript"],
    tags: ["canvas", "html5", "javascript", "canvas-api", "animation", "graphics", "webgl", "performance", "accessibility", "frontend"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/javascript/html5-canvas-guide/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "HTML5 Canvas illustration showcasing drawing, animation, shapes, transformations, pixel manipulation, interactivity, and 3D graphics.",
      caption: "Shapes, transforms, pixels and animation drawn on an HTML5 canvas."
    },
    toc: { maxLevel: 3 },
    signoff: "This one grew from a first `fillRect()` all the way to `OffscreenCanvas` workers, pixel manipulation, and a full cheat sheet, and the four diagrams carry the parts words kept fumbling — the y-axis running down, `arc()` angles turning clockwise, `rotate()` swinging around the origin until `translate()` moves it, and one canvas pixel smeared across a 2 × 2 block on a high-DPI screen. The playground took the most rounds: particles that collide by swapping velocity along the contact normal and answer mouse, touch, and pen alike, then a second mode that projects, depth-sorts, and flat-shades a cube, pyramid, and octahedron with nothing but maths on a plain 2D context. Thanks for drawing along with me — go paint something worth redrawing sixty times a second. 🎨",
    changelog: [
      { date: "2026-11-09", change: "Added cross-reference to snippet 'SVG Circular Progress Ring with CSS Variables'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-07", change: "Initial publication" }
    ]
  },
  {
    slug: "css-z-index-and-stacking-contexts",
    title: "Mastering CSS z-index: Stacking Contexts, isolation, and Layering Bugs",
    excerpt: "Layer confidently with z-index, stacking contexts, and isolation.",
    description: "Learn how CSS z-index really works — painting order, stacking contexts, negative z-index, isolation: isolate, the top layer, a scalable z-index scale, and a step-by-step way to debug layering bugs.",
    category: ["CSS"],
    tags: ["css", "z-index", "stacking-context", "isolation", "positioning", "mix-blend-mode", "layout", "debugging", "modern-css", "frontend"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/css-z-index-and-stacking-contexts/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "CSS z-index cover showing layered UI elements, stacking contexts, z-axis ordering, and z-index values.",
      caption: "Layered UI elements stacked along the z-axis inside separate stacking contexts."
    },
    toc: { maxLevel: 3 },
    signoff: "This one is built around three new pieces: an exploded view of the seven painting layers, a version-number tree showing why 9999 can lose to 10, and a three-tab sandbox that runs real HTML and CSS rather than pictures of them — the trapped tooltip, the negative z-index box, and the blend-mode circles — each with a readout explaining what the browser just painted. Getting the playground's readout to agree with the browser in every combination — ties, z-index: 0 versus auto, an opacity of 0.99 that changes almost nothing on screen yet everything underneath — meant re-deriving the painting order more times than I'd like to admit. I hope the next time a 9999 refuses to budge, you go looking for its parent instead of adding another 9. Thanks for stacking up with me. 🥞",
    changelog: [
      { date: "2026-11-06", change: "Added cross-reference to post 'Animate Dialogs & Popovers with CSS `@starting-style`'" },
      { date: "2026-10-31", change: "Added cross-reference to post 'CSS Cascade Layers (`@layer`): End Specificity Wars in Large Codebases'" },
      { date: "2026-10-27", change: "Added cross-reference to tutorial 'Styling a `<select>` Dropdown with CSS `appearance: base-select`'" },
      { date: "2026-10-25", change: "Added cross-reference to tutorial 'CSS-Only Tooltips with `attr()` and `content`'" },
      { date: "2026-10-18", change: "Added cross-reference to post 'CSS Container Queries Deep Dive: Named Containers, `cqi` Units, and Style Queries'" },
      { date: "2026-10-08", change: "Initial publication" }
    ]
  },
  {
    slug: "container-queries-deep-dive",
    title: "CSS Container Queries Deep Dive: Named Containers, `cqi` Units, and Style Queries",
    excerpt: "Make components respond to their container, not the viewport.",
    description: "Go beyond basic @container: inline-size vs size containment, named containers, cqi/cqb/cqmin/cqmax units, and style queries, with diagrams and a live sandbox.",
    category: ["CSS"],
    tags: ["css", "container-queries", "media-queries", "responsive-design", "component-driven-design", "named-containers", "container-units", "style-queries", "css-custom-properties", "theming", "layout", "modern-css", "debugging", "progressive-enhancement", "browser-support"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/container-queries-deep-dive/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Colorful CSS Container Queries infographic illustrating named containers, container query units (cqi, cqb, cqmin, cqmax), size-based responsive card layouts, style queries for light and dark themes, container types, adaptive SVG icons, and an interactive breakpoint playground.",
      caption: "Cards adapting to their container's size and style, rather than the viewport."
    },
    toc: { maxLevel: 3 },
    signoff: "This one is built around four diagrams and a three-tab sandbox: two containment panels that make the size-collapse pitfall impossible to miss, nested boxes where one arrow has to visibly skip past the nearer container, a single box showing cqmin and cqmax borrowing their values from cqi and cqb, and two identical cards that only a custom property tells apart. The named-container diagram took the most redrawing — an arrow that skips past a box can very easily look like one pointing at the wrong thing. The sandbox's middle tab is the one I'm proudest of: the same @container rule, the same 400px breakpoint, and a single radio button alone decides which box gets measured. Getting every tab's live CSS readout to match what the browser actually applies took more back-and-forth than I'd like to admit. I hope the next time a component looks wrong in a sidebar, you ask which box it's measuring before reaching for another media query. Thanks for containing yourself with me. 📦",
    changelog: [
      { date: "2026-11-11", change: "Added cross-reference to post 'Interop 2026 and CSS Snapshot 2026: What They Mean for CSS'" },
      { date: "2026-11-10", change: "Added cross-reference to post 'What's New in CSS in 2026: What You Can Use Now'" },
      { date: "2026-11-06", change: "Added cross-reference to post 'CSS `@starting-style` Entry Animations: Practical Patterns'" },
      { date: "2026-10-18", change: "Initial publication" }
    ]
  },
  {
    slug: "css-cascade-layers",
    title: "CSS Cascade Layers (`@layer`): End Specificity Wars in Large Codebases",
    excerpt: "Control CSS priority with layer order, not specificity.",
    description: "Learn how CSS cascade layers (@layer) set priority by layer order instead of specificity — unlayered styles, the !important reversal, revert-layer, layering third-party CSS, the full cascade sort order, migrating a large codebase and putting utility classes last.",
    category: ["CSS"],
    tags: ["css", "cascade-layers", "specificity", "css-architecture", "modern-css", "advanced", "debugging", "browser-support", "progressive-enhancement", "scss", "frontend"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/css-cascade-layers/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon infographic illustrating CSS cascade layers, showing layer priority, specificity, unlayered styles, !important reversal, revert-layer, and the utilities-last approach.",
      caption: "Cascade layers ordered by priority, with utilities placed last to win."
    },
    toc: { maxLevel: 3 },
    signoff: "This one is built around three diagrams — a one-class utility beating an ID selector through layer order alone, the same two rules swapping places the moment both turn !important, and an eight-rung ladder that puts @layer exactly where the cascade consults it — and a playground that rewrites a real <style> tag on every change, so four rules of rising specificity genuinely fight it out in your own browser. Getting its readout to name the criterion that actually decided each result — layer order, specificity, the !important reversal, or unlayered styles winning outright — took more edge-case testing than I'd like to admit. I hope the next time a utility class refuses to apply, you reach for a layer instead of another !important. Thanks for picking a side in the specificity war with me. 🗂️",
    changelog: [
      { date: "2026-11-18", change: "Added cross-reference to post 'CSS `@scope`: Scoped Styles Without Naming Conventions'" },
      { date: "2026-11-10", change: "Added cross-reference to post 'What's New in CSS in 2026: What You Can Use Now'" },
      { date: "2026-10-31", change: "Initial publication" }
    ]
  },
  {
    slug: "css-starting-style-guide",
    title: "Mastering CSS `@starting-style`: The Complete Beginner's Guide",
    excerpt: "Give entering elements a real \"before\" to animate.",
    description: "Why CSS transitions skip an element's first render, and how the @starting-style at-rule fixes it — syntax, the cascade, and fade, slide, and scale-in examples.",
    category: ["Animations"],
    tags: ["css", "starting-style", "animation", "transition", "css-animation", "css-transitions", "opacity", "transform", "browser-support", "progressive-enhancement", "modern-css", "beginner", "frontend"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/animations/css-starting-style-guide/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover graphic for the CSS @starting-style beginner’s guide, showing a card that pops in without it and eases in with it.",
      caption: "The single-frame collapse and its fix, with the three states and both syntax forms."
    },
    toc: { maxLevel: 3 },
    signoff: "This one's the foundation the rest of the series builds on, and the single-frame collapse was surprisingly hard to draw so it reads at a glance — that diagram, the trigger map beside it, and the side-by-side insert demo took more iterations than the prose did. I hope seeing both columns run makes the fix click faster than the spec ever could. Part 2 turns it into a full pattern library. 🌱",
    changelog: [
      { date: "2026-11-06", change: "Initial publication" }
    ]
  },
  {
    slug: "css-starting-style-entry-animations",
    title: "CSS `@starting-style` Entry Animations: Practical Patterns",
    excerpt: "Build cards, toasts, and menus with reusable entrances.",
    description: "Reusable @starting-style entry animation patterns: cards, toasts, sidebars, dropdowns, accordions, chat messages, and framework-rendered lists.",
    category: ["Animations"],
    tags: ["css", "starting-style", "entry-animation", "animation", "transition", "css-transitions", "css-animation", "microinteractions", "ui-design", "ui-animation", "frontend"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/animations/css-starting-style-entry-animations/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover graphic for CSS @starting-style entry animation patterns, showing cards, toasts and menus easing in with a stagger timeline.",
      caption: "A library of entrance patterns, plus a 40-card stagger capped to settle by 0.7s."
    },
    toc: { maxLevel: 3 },
    signoff: "Building this one meant testing every pattern in a real browser, then catching a few that looked right but quietly didn't animate — plus a stagger diagram, a keyed-list diagram, and a toast-and-card playground with an on/off switch so you can feel the difference. I hope it saves you the same trial and error. Part 3 tackles the entrance CSS can't do alone: display: none. 🍞",
    changelog: [
      { date: "2026-11-06", change: "Initial publication" }
    ]
  },
  {
    slug: "css-starting-style-dialogs-and-discrete-animations",
    title: "Animate Dialogs & Popovers with CSS `@starting-style`",
    excerpt: "Animate display: none, dialogs, and popovers in CSS.",
    description: "Animate display: none in CSS with allow-discrete and @starting-style — native <dialog> and Popover API examples, plus the top layer explained.",
    category: ["Animations"],
    tags: ["css", "starting-style", "allow-discrete", "top-layer", "dialog", "popover", "discrete-animation", "animation", "transition", "css-transitions", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/animations/css-starting-style-dialogs-and-discrete-animations/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover graphic for animating dialogs and popovers with CSS @starting-style, showing a dialog floating in the top layer above the page and timelines of when display flips.",
      caption: "The top layer above the page, and why display flips at 0% on entry but 100% on exit."
    },
    toc: { maxLevel: 3 },
    signoff: "Getting the display flip to land at the *start* of the entrance and the *end* of the exit — and drawing that asymmetry so it reads at a glance — took more iterations than I expected, as did the top-layer diagram and a playground where a real dialog and popover each snap back to the old behaviour on demand. I hope the timelines make that one rule stick. Part 4 closes the series with performance and accessibility. 🗂️",
    changelog: [
      { date: "2026-11-06", change: "Initial publication" }
    ]
  },
  {
    slug: "css-starting-style-performance-and-accessibility",
    title: "Advanced CSS `@starting-style`: Performance & Accessibility",
    excerpt: "Ship smooth, accessible, framework-friendly CSS entry animations.",
    description: "Keep @starting-style fast and accessible: rendering performance, prefers-reduced-motion, framework use, and comparisons with @keyframes and View Transitions.",
    category: ["Animations"],
    tags: ["css", "starting-style", "performance", "gpu-acceleration", "accessibility", "web-performance", "prefers-reduced-motion", "view-transitions", "web-animations-api", "keyframes", "react", "modern-css", "advanced", "frontend"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/animations/css-starting-style-performance-and-accessibility/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover graphic for advanced CSS @starting-style performance and accessibility, comparing a layout-heavy animation with a compositor-only one, plus a production checklist.",
      caption: "Height versus transform through the rendering pipeline, plus reduced motion and a production checklist."
    },
    toc: { maxLevel: 3 },
    signoff: "This half turns @starting-style from \"a neat trick\" into something you can ship — I hope the rendering-pipeline diagram, the tool-choice matrix, the framework side-by-sides, and the production checklist save you from reaching for a bigger tool than the job needs, or from shipping an entrance that's slow or uncomfortable for someone. Thanks for working through the whole series with me. 🚀",
    changelog: [
      { date: "2026-11-06", change: "Initial publication" }
    ]
  },
  {
    slug: "whats-new-in-css-2026",
    title: "What's New in CSS in 2026: What You Can Use Now",
    excerpt: "CSS features that reached every browser in 2026.",
    description: "What became usable in CSS in 2026: anchor positioning, scroll-driven animations, @scope, contrast-color() and more, plus Chromium-only and Safari-first CSS.",
    category: ["CSS"],
    tags: ["css", "css-2026", "modern-css", "browser-support", "anchor-positioning", "animation-timeline", "scroll-animation", "style-queries", "interop", "baseline", "progressive-enhancement"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/whats-new-in-css-2026/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover showing CSS features grouped by browser support: all three engines, two of three, Chromium only, and Safari first.",
      caption: "2026's CSS sorted by support: 12 features in all three engines, 5 in two, 9 in Chromium only and 2 that Safari shipped first, as of Chromium 157, Firefox 160 and Safari 27.2."
    },
    toc: { maxLevel: 3 },
    signoff: "Sorting a whole year of CSS into \"works everywhere\", \"two engines\" and \"Chromium only\" meant checking every feature against the compatibility data rather than the launch posts, and a few surprised me, Safari shipping masonry first among them. I hope it helps you decide what to reach for on your next project. 🎨",
    changelog: [
      { date: "2026-11-18", change: "Added cross-reference to post 'CSS `@scope`: Scoped Styles Without Naming Conventions'" },
      { date: "2026-11-18", change: "Added cross-reference to post 'CSS Anchor Positioning: Tooltips, Menus and Popovers Without JavaScript'" },
      { date: "2026-11-16", change: "Added cross-reference to tutorial 'CSS Custom Highlight API: `::highlight()` for Search Results'" },
      { date: "2026-11-15", change: "Added cross-reference to tutorial '`contrast-color()`: Automatic Readable Text on Any Background'" },
      { date: "2026-11-12", change: "Updated browser support for `random()`" },
      { date: "2026-11-12", change: "Added cross-reference to post 'What's New in CSS in 2027: What to Expect'" },
      { date: "2026-11-11", change: "Added cross-reference to post 'Interop 2026 and CSS Snapshot 2026: What They Mean for CSS'" },
      { date: "2026-11-10", change: "Initial publication" }
    ]
  },
  {
    slug: "whats-new-in-es2026",
    title: "What's New in ES2026: Every Feature Explained",
    excerpt: "Every ES2026 feature, with examples and browser support.",
    description: "Every ES2026 feature with examples: Map upsert, JSON.parse source text, Iterator.concat, Uint8Array Base64, Math.sumPrecise, Error.isError and Array.fromAsync.",
    category: ["JavaScript"],
    tags: ["javascript", "es2026", "ecmascript", "modern-js", "map-upsert", "iterator-helpers", "math-sumprecise", "error-iserror", "array-fromasync", "browser-support", "polyfills"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/javascript/whats-new-in-es2026/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover showing a code diff where old helper functions are replaced by seven new built-in JavaScript methods.",
      caption: "Seven lines out, seven in: each hand-rolled helper, from mapGetOrSet to collectAsync, replaced by its ES2026 built-in."
    },
    toc: { maxLevel: 3 },
    signoff: "No new syntax this year, just seven helpers I'm glad to delete from my own utility files. The time went into checking rather than writing: running the examples, matching every version number against MDN's compatibility data, and confirming each feature against the published specification, which is also how I untangled the Temporal and using mix-up that keeps doing the rounds. I hope the support table saves you a few searches. 🧰",
    changelog: [
      { date: "2026-11-15", change: "Added cross-reference to snippet 'Bytes to Hex and Back with `Uint8Array.fromHex()` and `toHex()`'" },
      { date: "2026-11-14", change: "Added cross-reference to post 'Backwards-Compatible JavaScript: Polyfills and Baseline'" },
      { date: "2026-11-12", change: "Added cross-reference to post 'What's New in ES2027: Temporal, using and More'" },
      { date: "2026-11-11", change: "Initial publication" }
    ]
  },
  {
    slug: "interop-2026-and-css-snapshot-2026",
    title: "Interop 2026 and CSS Snapshot 2026: What They Mean for CSS",
    excerpt: "What Interop 2026 and CSS Snapshot 2026 really mean.",
    description: "Interop 2026 and the W3C CSS Snapshot 2026 explained: the CSS focus areas, progress so far, Interop 2027, and how Baseline tells you what to ship.",
    category: ["CSS"],
    tags: ["css", "interop-2026", "css-snapshot-2026", "interop", "baseline", "browser-support", "web-standards", "modern-css", "progressive-enhancement"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/interop-2026-and-css-snapshot-2026/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover showing a three-circle diagram of Baseline, Interop and CSS Snapshot, with browser score rings, Snapshot stability tiers and the Interop 2027 timeline.",
      caption: "Baseline, Interop and the CSS Snapshot answer three different questions. Below them: Interop scores as of September 2026, the Snapshot's four stability groups and the Interop 2027 timeline."
    },
    toc: { maxLevel: 3 },
    signoff: "Every time a new Interop list or CSS Snapshot comes out, I see it shared as a list of things we can finally use, and I wanted one place that untangles the three sources that actually answer different questions. I hope the next time one of them lands in your feed, you know exactly which question it answers, and which tool to open for the rest. 🧭",
    changelog: [
      { date: "2026-11-16", change: "Added cross-reference to tutorial 'CSS Custom Highlight API: `::highlight()` for Search Results'" },
      { date: "2026-11-15", change: "Added cross-reference to tutorial '`contrast-color()`: Automatic Readable Text on Any Background'" },
      { date: "2026-11-12", change: "Added cross-reference to post 'What's New in CSS in 2027: What to Expect'" },
      { date: "2026-11-11", change: "Initial publication" }
    ]
  },
  {
    slug: "whats-new-in-css-2027",
    title: "What's New in CSS in 2027: What to Expect",
    excerpt: "CSS features closest to working everywhere in 2027.",
    description: "An evidence-based look at the CSS features most likely to work in every browser in 2027: typed attr(), customisable select, random(), @function and more.",
    category: ["CSS"],
    tags: ["css", "css-2027", "modern-css", "browser-support", "interop", "interop-2026", "baseline", "attr", "customizable-select", "at-function", "corner-shape", "progressive-enhancement"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/css/whats-new-in-css-2027/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Radar chart ranking CSS features by how close they are to working in every browser in 2027, from typed attr() and :playing at the centre to if() and display: grid-lanes on the outer ring.",
      caption: "The closer to the centre, the stronger the evidence that a feature lands in 2027."
    },
    toc: { maxLevel: 3 },
    signoff: "Predictions are easy to get wrong, so this post took far more checking than writing: browser release notes, the Interop 2026 announcement, preview builds and MDN's compatibility data, so that every prediction rests on something already shipping or in testing rather than a vendor promise. I'll revisit the list as 2027 unfolds, and I hope the tracking links help you keep score too. 🔭",
    changelog: [
      { date: "2026-11-16", change: "Added cross-reference to tutorial 'CSS Custom Highlight API: `::highlight()` for Search Results'" },
      { date: "2026-11-15", change: "Added cross-reference to tutorial '`contrast-color()`: Automatic Readable Text on Any Background'" },
      { date: "2026-11-12", change: "Initial publication" }
    ]
  },
  {
    slug: "whats-new-in-es2027",
    title: "What's New in ES2027: Temporal, using and More",
    excerpt: "Temporal, using and five more confirmed ES2027 features.",
    description: "Every confirmed ES2027 feature as of November 2026: Temporal, using, Iterator.zip, chunks, windows, join, includes and Atomics.pause, with examples.",
    category: ["JavaScript"],
    tags: ["javascript", "es2027", "ecmascript", "modern-js", "temporal", "explicit-resource-management", "iterator-helpers", "error-handling", "browser-support", "polyfills"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/javascript/whats-new-in-es2027/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover showing the title What's New in ES2027: Temporal, using and More beside a glowing JavaScript logo cube, with cards for Temporal, using, Iterator.zip(), chunks() and windows(), join() and includes(), and Atomics.pause().",
      caption: "Temporal, using and five more features confirmed for ES2027 as of November 2026, from dates and cleanup to iterators and Atomics."
    },
    toc: { maxLevel: 3 },
    signoff: "An unfinished edition is a moving target, so this one took more reading than writing: TC39's finished proposals list and meeting notes to pin down what's really in ES2027, and the compatibility data behind every number in the support table. Temporal and using are the two I've waited on longest, and I hope the examples show why. I also cross-checked the edition boundaries against the ES2026 post, which is how Map upsert ended up there instead. I'll update this post once ES2027 is published. ⏳",
    changelog: [
      { date: "2026-11-14", change: "Added cross-reference to snippet 'JavaScript Spin-Wait Lock with `Atomics.pause()`'" },
      { date: "2026-11-14", change: "Added cross-reference to post 'Backwards-Compatible JavaScript: Polyfills and Baseline'" },
      { date: "2026-11-12", change: "Initial publication" }
    ]
  },
  {
    slug: "backwards-compatible-javascript",
    title: "Backwards-Compatible JavaScript: Polyfills and Baseline",
    excerpt: "Use new JavaScript without breaking older browsers.",
    description: "Write backwards-compatible JavaScript: feature detection, safe core-js polyfills, transpiling vs polyfilling, Baseline and browserslist queries.",
    category: ["JavaScript"],
    tags: ["javascript", "polyfills", "feature-detection", "browser-support", "progressive-enhancement", "baseline", "browserslist", "transpilation", "core-js", "es2027", "best-practices"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/posts/javascript/backwards-compatible-javascript/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover for backwards-compatible JavaScript: modern code splits into a polyfill for missing APIs and a transpiler for missing syntax, so it still runs in older browsers, above a Baseline bar from limited to newly available to widely available.",
      caption: "Missing APIs get a polyfill, missing syntax gets transpiled, and Baseline's three statuses tell you when a feature is safe to ship."
    },
    toc: { maxLevel: 3 },
    signoff: "This one took more reading than writing: Baseline's status definitions and the 30-month rule, the core-js and Babel docs, TypeScript's release notes on downlevelling `using`, and the polyfill.io incident reports, so the advice rests on how the tools behave today rather than on habit. Most compatibility bugs I've chased came down to mixing up a missing API with missing syntax, which is why the whole post is built around that one table. I hope it helps you pick the right tool first time, and maybe delete a polyfill or two you no longer need. 🧰",
    changelog: [
      { date: "2026-11-15", change: "Added cross-reference to snippet 'Bytes to Hex and Back with `Uint8Array.fromHex()` and `toHex()`'" },
      { date: "2026-11-14", change: "Initial publication" }
    ]
  },
  {
    slug: "css-anchor-positioning-guide",
    title: "CSS Anchor Positioning: Tooltips, Menus and Popovers Without JavaScript",
    excerpt: "Position tooltips and menus using CSS alone.",
    description: "A practical guide to CSS anchor positioning: anchor-name, position-anchor, position-area, anchor(), fallbacks with position-try, popovers and browser support.",
    category: ["CSS"],
    tags: ["css", "anchor-positioning", "popover", "tooltips", "top-layer", "css-2026", "modern-css", "progressive-enhancement", "browser-support"],
    toc: { maxLevel: 3 },
    changelog: [
      { date: "2026-11-18", change: "Initial publication" }
    ]
  },
  {
    slug: "css-scope-at-rule-guide",
    title: "CSS `@scope`: Scoped Styles Without Naming Conventions",
    excerpt: "Limit styles to a component with @scope.",
    description: "Learn CSS @scope: scope roots, :scope, donut scopes with a lower limit, scoping proximity in the cascade, inline scoping, and how it compares with layers and BEM.",
    category: ["CSS"],
    tags: ["css", "at-scope", "scoped-styles", "specificity", "css-2026", "modern-css", "best-practices", "browser-support"],
    toc: { maxLevel: 3 },
    changelog: [
      { date: "2026-11-18", change: "Initial publication" }
    ]
  }
];

// Look up a single post by its slug.
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

// Array-order based rather than git-dated so it stays client-safe — git can't be read in the browser.
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
