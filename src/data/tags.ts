// SEO/display metadata for a single tag archive page, keyed by tag slug in data/tags.ts.
export interface TagMeta {
  // Descriptive <h1> and <title> for the /tag/<slug> archive.
  title: string;
  // Meta description shown in <head> and as the archive's intro paragraph.
  description: string;
}

/*
  Per-tag SEO/display metadata, keyed by tag slug (the slugified form of the
  tags declared on each post in data/posts.ts). Drives the <h1>, <title>, and
  meta description of each /tag/<slug> archive.

  Slugs not listed here still generate an archive page — lib/tags.ts falls back
  to a "#<tag>" heading and a generated description. Entries may exist ahead of
  the posts that use them; only tags actually present on a post get a page.
*/
export const tagMeta: Record<string, TagMeta> = {
  "2d-layouts": {
    title: "Exploring 2D Layouts for Web Design",
    description: "Posts exploring two-dimensional layout techniques for the web, primarily using CSS Grid and Flexbox for complex and structured designs."
  },
  "css-grid": {
    title: "Comprehensive Guides to CSS Grid Layout",
    description: "Comprehensive guides and advanced techniques for mastering CSS Grid Layout for building robust, two-dimensional web interfaces."
  },
  "grid": {
    title: "All Posts on Grid Systems and Layouts",
    description: "General articles and tutorials related to creating grid-based layouts on the web, often involving CSS Grid or Flexbox."
  },
  "layout": {
    title: "Modern Web Layout Techniques and Best Practices",
    description: "Content focused on the structure and arrangement of web elements, including CSS Grid, Flexbox, and various responsive design techniques."
  },
  "fr-units": {
    title: "Understanding `fr` Units in CSS Grid",
    description: "Explanations and usage examples of the 'fr' (fractional) unit in CSS Grid to efficiently distribute available space among grid tracks."
  },
  "minmax": {
    title: "Mastering the `minmax()` Function in CSS",
    description: "Understanding the 'minmax()' function in CSS Grid for setting a flexible minimum and maximum size for grid tracks."
  },
  "auto-fill": {
    title: "'auto-fill' in CSS Grid Explained",
    description: "Deep dive into the 'auto-fill' keyword in CSS Grid, explaining how it works with 'grid-template-columns' to create dynamic and responsive grids."
  },
  "auto-fit": {
    title: "'auto-fit' in CSS Grid Explained",
    description: "Detailed explanations and examples of the 'auto-fit' keyword in CSS Grid for creating flexible and adaptive container layouts."
  },
  "grid-alignment": {
    title: "Aligning Items in CSS Grid",
    description: "Focus on alignment properties in CSS Grid like 'justify-items', 'align-items', 'justify-content', and 'align-content' for precise component placement."
  },
  "grid-template-areas": {
    title: "Using Grid Template Areas for Layout",
    description: "Using the 'grid-template-areas' property for visually mapping out CSS Grid layouts with named areas."
  },
  "container-queries": {
    title: "Exploring CSS Container Queries",
    description: "Posts on using CSS Container Queries to style components based on the size of their parent container, not just the viewport."
  },
  "media-queries": {
    title: "Mastering CSS Media Queries",
    description: "Mastering CSS Media Queries for creating responsive designs that adjust based on screen size, orientation, and other device characteristics."
  },
  "responsive": {
    title: "Responsive Web Design Strategies",
    description: "Techniques and strategies for building responsive web designs that look and function well on all screen sizes and devices."
  },
  "beginner": {
    title: "Guides for Beginner Web Developers",
    description: "Guides and tutorials specifically tailored for web development beginners, covering foundational concepts in an easy-to-understand format."
  },
  "frontend": {
    title: "Frontend Engineering: HTML, CSS, JS, and SVG",
    description: "Core frontend development topics including DOM manipulation, responsive design, and integrating code-based graphics into web applications."
  },
  "web-design": {
    title: "Principles of Web Design and UI/UX",
    description: "Principles and aesthetics of designing functional, accessible, and visually appealing user interfaces for the web."
  },
  "css": {
    title: "All Articles Tagged CSS",
    description: "All content tagged with CSS, covering topics from layout to styling, properties, and modern specifications."
  },
  "accessibility": {
    title: "Web Accessibility (a11y) Standards and Guides",
    description: "Articles focused on web accessibility (a11y) standards, ensuring websites are usable by everyone, regardless of disability or device."
  },
  "devtools": {
    title: "Debugging with Browser DevTools",
    description: "Using browser developer tools to inspect, debug, and fine-tune CSS layouts, styles, and computed values."
  },
  "subgrid": {
    title: "CSS Subgrid Explained",
    description: "Using the `subgrid` value for `grid-template-columns` and `grid-template-rows` to let nested grids inherit track sizing from their parent."
  },
  "named-grid-lines": {
    title: "Naming Grid Lines in CSS Grid",
    description: "Assigning custom names to grid lines in `grid-template-columns` and `grid-template-rows` for more readable, maintainable `grid-column`/`grid-row` placement."
  },
  "browser-support": {
    title: "CSS Browser Support and Compatibility",
    description: "Checking feature support across browsers and writing CSS that degrades gracefully where a property or value isn't yet available."
  },
  "progressive-enhancement": {
    title: "Progressive Enhancement in CSS",
    description: "Building layouts that work with a baseline of broadly-supported CSS, then layering on newer features for browsers that support them."
  },
};
