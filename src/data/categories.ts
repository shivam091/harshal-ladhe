// SEO/display metadata for a single category archive page, keyed by category slug in data/categories.ts.
export interface CategoryMeta {
  // Descriptive <h1> and <title> for the /category/<slug> archive.
  title: string;
  // Meta description shown in <head> and as the archive's intro paragraph.
  description: string;
}

/*
  Per-category SEO/display metadata, keyed by category slug (the slugified form
  of the categories declared on each post in data/posts.ts). Drives the <h1>,
  <title>, and meta description of each /category/<slug> archive.

  Slugs not listed here still generate an archive page — lib/categories.ts falls
  back to the category name and a generated description. Entries may exist ahead
  of the posts that use them; only categories actually present on a post get a page.
*/
export const categoryMeta: Record<string, CategoryMeta> = {
  css: {
    title: "All Posts on CSS and Web Styling",
    description: "A collection of articles and tutorials on Cascading Style Sheets (CSS), covering modern layout techniques, responsive design, and best practices for web styling."
  },
  animations: {
    title: "Web Animations Masterclass (CSS, JS, SVG, and Spring)",
    description: "Dive into web animations! Explore tutorials and guides on CSS transitions, JavaScript-powered effects, SVG animation, spring physics, and performance optimization for stunning UI/UX."
  },
  git: {
    title: "Git and Version Control Guides",
    description: "In-depth guides on Git — from everyday staging, committing, and branching to advanced rebasing, history rewriting, and disaster recovery workflows."
  },
  svg: {
    title: "SVG and Vector Graphics Guides",
    description: "Guides on Scalable Vector Graphics (SVG) — from coordinates, the viewBox, and basic shapes to mastering the path element and building custom vector icons."
  },
  javascript: {
    title: "All Posts on JavaScript and Modern Web APIs",
    description: "Guides and deep dives into JavaScript — from asynchronous programming fundamentals to modern browser APIs like the Observer family — covering the language and platform features that power interactive web applications.",
  },
  docker: {
    title: "Docker and Containerization Guides",
    description: "Guides on Docker and containerization — from Dockerfile fundamentals and image layering to multi-stage builds, Compose-based dev environments, and production-grade image security."
  }
};
