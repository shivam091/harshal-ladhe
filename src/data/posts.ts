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
    tags: ["css", "grid", "css-grid", "beginner", "layout", "web-design", "frontend", "2d-layouts"],
    image: {
      path: "/assets/img/posts/css/getting-started-with-css-grid/cover.webp",
      width: 1200,
      height: 630,
      type: "image/webp",
      alt: "Flat-design digital illustration introducing CSS Grid fundamentals, featuring icons for grid containers, tracks, and layout structures."
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
    description: "Take your CSS Grid skills to the next level by mastering semantic layouts with grid areas, item alignment, and element spanning techniques.",
    category: ["CSS"],
    tags: ["css", "css-grid", "grid", "beginner", "layout", "grid-template-areas", "grid-alignment", "frontend"],
    image: {
      path: "/assets/img/posts/css/mastering-css-grid-alignment-spanning/cover.webp",
      width: 1200,
      height: 630,
      type: "image/webp",
      alt: "Stylized 2D illustration visualizing advanced CSS Grid techniques like alignment, named grid areas, and spanning elements across rows and columns."
    },
    signoff: "A lot of testing and refining went into getting these grid-area, alignment, and spanning examples just right, and I hope that effort shows in how clearly they click for you. Thanks for following along — hope your layouts feel a little more precise now. 📐",
    pinned: true,
    changelog: [
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
    tags: ["css", "grid", "beginner", "responsive", "layout", "fr-units", "minmax", "media-queries", "container-queries", "auto-fit", "auto-fill"],
    image: {
      path: "/assets/img/posts/css/responsive-css-grid-layouts/cover.webp",
      width: 1200,
      height: 630,
      type: "image/webp",
      alt: "Colorful flat-design illustration showcasing responsive CSS Grid techniques, including fr units, minmax(), auto-fit, media queries, and container queries."
    },
    signoff: "This one took a fair amount of work to put together — from fr units and minmax() to auto-fit, auto-fill, and container queries — and I hope it makes your layouts hold up wherever they're viewed. Really glad you stuck around for this one — go make your grids bend without breaking. 🎉",
    pinned: true,
    featured: true,
    changelog: [
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
      path: "/assets/img/posts/animations/css-transitions-guide/cover.webp",
      width: 1536,
      height: 1024,
      type: "image/webp",
      alt: "CSS Transitions cover image featuring a large “CSS Transitions” title, a glowing “Hover me” button with motion trails, transition properties such as opacity and transform, and a CSS code panel illustrating smooth state changes, easing, duration, delay, events, and performance."
    },
    signoff: "This one took a fair bit of tinkering to get the playground feeling just right, and I hope tuning duration, delay, and timing-function with your own hands makes transitions click in a way reading alone never quite does. Thanks for hovering, toggling, and sticking with me through it — go make your UI feel a little smoother. ✨",
    toc: { maxLevel: 3 },
    changelog: [
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
      path: "/assets/img/posts/git/git-basics-for-beginners/cover.webp",
      width: 1536,
      height: 1024,
      type: "image/webp",
      alt: "Git Basics: A Beginner’s Guide to Version Control — a dark neon tech illustration showing Git’s working directory, staging area, repository, branching and merging workflow, terminal commands, Git logo, and Git object model."
    },
    signoff: "This one's meant to be the guide I wish I'd had when Git still felt like a wall of unfamiliar commands — I hope it makes that first `git merge` conflict feel like a puzzle instead of a crisis. Part 2 picks up right where this leaves off. 🌱",
    pinned: true,
    changelog: [
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
      path: "/assets/img/posts/git/advanced-git-techniques-and-workflows/cover.webp",
      width: 1536,
      height: 1024,
      type: "image/webp",
      alt: "Advanced Git: Rebasing, Internals, and Real-World Workflows — a dark neon Git-themed illustration featuring interactive rebasing and commit graphs, Git’s blob-tree-commit-tag object model, advanced Git commands, reflog-based recovery, and GitHub Flow, Git Flow, and trunk-based development workflows."
    },
    signoff: "This half is the one that turns Git from \"a tool I follow instructions for\" into something you can actually reason about — I hope the internals section in particular makes the rest of it click. Thanks for sticking with the series through to the end. 🚀",
    pinned: true,
    changelog: [
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
      path: "/assets/img/posts/svg/svg-essentials-mastering-basic-shapes/cover.webp",
      width: 1536,
      height: 1024,
      type: "image/webp",
      alt: "SVG Essentials — Mastering Basic Shapes in SVG, featuring colorful geometric shapes, an SVG editor interface, coordinate system, viewBox, geometry rules, and SVG code on a vibrant dark gradient background."
    },
    signoff: "Between the six shape playgrounds, the presentation-attributes demo, and getting that radar sweep to pivot from exactly the right point, this ended up with more moving pieces than any SVG post so far — I hope tinkering with those sliders builds more intuition than the coordinate math alone ever could. Thanks for working through the whole toolkit with me. Go build something that scales without breaking a sweat. 🎯",
    changelog: [
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
      path: "/assets/img/posts/javascript/mastering-js-operators/cover.webp",
      width: 1536,
      height: 1024,
      type: "image/webp",
      alt: "Mastering JavaScript Operators — a colorful neon infographic showing JavaScript operator categories, code examples, and modern syntax for writing clean, efficient code."
    },
    toc: { maxLevel: 4 },
    signoff: "Every operator in this guide—from `+` to `??=`—got its own runnable example, and the precedence table alone went through more revisions than I'd like to admit before it was scannable at a glance. This is the most thorough reference on the site so far; thanks for working through all of it with me. Go write cleaner conditionals. ✨",
    changelog: [
      { date: "2025-08-23", change: "Initial publication" }
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
