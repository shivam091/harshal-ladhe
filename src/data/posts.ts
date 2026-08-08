import type { Post, PostNavigation } from "@/interfaces/post";

/*
  Registry of every post. Each entry has a matching content file at
  app/(site)/(internal)/(post)/post/<slug>/page.mdx. This drives the /posts list,
  the detail chrome, and prev/next nav.

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
      path: "/assets/img/posts/css/getting-started-with-css-grid/cover.png",
      width: 1200,
      height: 630,
      alt: "Flat-design digital illustration introducing CSS Grid fundamentals, featuring icons for grid containers, tracks, and layout structures."
    },
    signoff: "This one took a good deal of care to get the fundamentals right, and I hope it gives you a solid footing with containers, tracks, and your first 2D layout. Appreciate you taking the time to work through it with me — happy gridding. 🧱",
    pinned: true,
    changelog: [
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
      path: "/assets/img/posts/css/mastering-css-grid-alignment-spanning/cover.png",
      width: 1200,
      height: 630,
      alt: "Stylized 2D illustration visualizing advanced CSS Grid techniques like alignment, named grid areas, and spanning elements across rows and columns."
    },
    signoff: "A lot of testing and refining went into getting these grid-area, alignment, and spanning examples just right, and I hope that effort shows in how clearly they click for you. Thanks for following along — hope your layouts feel a little more precise now. 📐",
    pinned: true,
    changelog: [
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
      path: "/assets/img/posts/css/responsive-css-grid-layouts/cover.png",
      width: 1200,
      height: 630,
      alt: "Colorful flat-design illustration showcasing responsive CSS Grid techniques, including fr units, minmax(), auto-fit, media queries, and container queries."
    },
    signoff: "This one took a fair amount of work to put together — from fr units and minmax() to auto-fit, auto-fill, and container queries — and I hope it makes your layouts hold up wherever they're viewed. Really glad you stuck around for this one — go make your grids bend without breaking. 🎉",
    pinned: true,
    featured: true,
    changelog: [
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
      path: "/assets/img/posts/css/css-transitions-guide/cover.png",
      width: 1536,
      height: 1024,
      alt: "CSS Transitions cover image featuring a large “CSS Transitions” title, a glowing “Hover me” button with motion trails, transition properties such as opacity and transform, and a CSS code panel illustrating smooth state changes, easing, duration, delay, events, and performance."
    },
    toc: { maxLevel: 3 },
    changelog: [
      { date: "2026-08-08", change: "Initial publication" }
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
    previous: previous ? { slug: previous.slug, title: previous.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  };
}
