// SEO/display metadata for a single category archive page, keyed by category slug in data/categories.ts.
export interface CategoryMeta {
  // Descriptive <h1> and <title> for the /category/<slug> archive.
  title: string;
  // Meta description shown in <head> and as the archive's intro paragraph.
  description: string;
}

/*
  Keyed by slug so casing variants share one entry. Unlisted slugs still get an archive with
  fallback copy, and entries may exist ahead of the posts that use them.
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
  }
};
