// SEO/display metadata for a single tag archive page, keyed by tag slug in data/tags.ts.
export interface TagMeta {
  // Descriptive <h1> and <title> for the /tag/<slug> archive.
  title: string;
  // Meta description shown in <head> and as the archive's intro paragraph.
  description: string;
}

/*
  Keyed by slug so casing variants share one entry. Unlisted slugs still get an archive with
  fallback copy, and entries may exist ahead of the posts, tutorials, or snippets that use them.
*/
export const tagMeta: Record<string, TagMeta> = {
  "2d-layouts": {
    title: "Exploring 2D Layouts for Web Design",
    description: "Two-dimensional layout techniques for the web, primarily using CSS Grid and Flexbox for complex and structured designs."
  },
  "css-grid": {
    title: "Mastering CSS Grid Layout",
    description: "Core concepts and advanced techniques for mastering CSS Grid Layout for building robust, two-dimensional web interfaces."
  },
  "grid": {
    title: "Grid Systems and Layouts",
    description: "Creating grid-based layouts on the web, often involving CSS Grid or Flexbox."
  },
  "layout": {
    title: "Modern Web Layout Techniques and Best Practices",
    description: "Content focused on the structure and arrangement of web elements, including CSS Grid, Flexbox, and various responsive design techniques."
  },
  "fr-units": {
    title: "Understanding `fr` Units in CSS Grid",
    description: "How the 'fr' (fractional) unit works in CSS Grid to efficiently distribute available space among grid tracks."
  },
  "minmax": {
    title: "Mastering the `minmax()` Function in CSS",
    description: "Understanding the 'minmax()' function in CSS Grid for setting a flexible minimum and maximum size for grid tracks."
  },
  "auto-fill": {
    title: "'auto-fill' in CSS Grid Explained",
    description: "How the 'auto-fill' keyword in CSS Grid works with 'grid-template-columns' to create dynamic and responsive grids."
  },
  "auto-fit": {
    title: "'auto-fit' in CSS Grid Explained",
    description: "How the 'auto-fit' keyword in CSS Grid works for creating flexible and adaptive container layouts."
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
    description: "Using CSS Container Queries to style components based on the size of their parent container, not just the viewport."
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
    title: "Web Development for Beginners",
    description: "Posts, tutorials, and snippets tailored for web development beginners, covering foundational concepts in an easy-to-understand format."
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
    title: "All Content Tagged CSS",
    description: "All content tagged with CSS, covering topics from layout to styling, properties, and modern specifications."
  },
  "animation": {
    title: "CSS and JavaScript Animations",
    description: "All aspects of web animation, from fundamental principles to advanced techniques using CSS, JavaScript, and various libraries."
  },
  "transition": {
    title: "Mastering CSS Transitions for Smooth UI Effects",
    description: "Learn to use CSS `transition` properties for creating smooth, predictable state changes and hover effects in your user interface."
  },
  "will-change": {
    title: "Optimizing Animations with the `will-change` CSS Property",
    description: "Understanding the `will-change` property to hint to the browser about planned changes, allowing for better rendering and animation performance."
  },
  "performance": {
    title: "Techniques for High-Performance Web Animations",
    description: "Focus on optimizing animation speed, frame rate, and responsiveness using best practices, browser tools, and efficient code."
  },
  "gpu-acceleration": {
    title: "Leveraging GPU Acceleration for Smoother Animations",
    description: "Moving animations to the GPU (Graphics Processing Unit) using properties like `transform` and `opacity` for silky-smooth rendering."
  },
  "transform": {
    title: "Using the CSS `transform` Property for 2D and 3D Effects",
    description: "Using the powerful CSS `transform` property to translate, rotate, scale, and skew elements for creative visual effects."
  },
  "opacity": {
    title: "Animating Opacity and Transparency Effects",
    description: "Using the `opacity` property, a simple, performant way to animate fading and visibility changes in UI elements."
  },
  "timing-function": {
    title: "Exploring CSS Animation Timing Functions (`ease`, `steps`, `cubic-bezier`)",
    description: "Understand how to control the speed curve of your animations using built-in keywords, `steps()`, and custom `cubic-bezier()` and `linear()` timing functions."
  },
  "cubic-bezier": {
    title: "Designing Custom Curves with `cubic-bezier()`",
    description: "How the `cubic-bezier(x1, y1, x2, y2)` function works — control points, the time-vs-progress model, and hand-tuning your own easing curves.",
  },
  "easing": {
    title: "Understanding CSS Easing Curves",
    description: "The shape behind every named timing function — why `ease-in`, `ease-out`, and `ease-in-out` feel so different, and how to pick the right one.",
  },
  "overshoot": {
    title: "Overshoot and Anticipation Easing",
    description: "Curves that travel past their target or wind up before they move — how to build them with `cubic-bezier()` and `linear()`, and when the extra motion is worth it.",
  },
  "motion-design": {
    title: "Motion Design for the Web",
    description: "The design thinking behind interface motion — choosing curves, durations, and personality so movement explains what's happening instead of decorating it.",
  },
  "microinteractions": {
    title: "Designing and Implementing Effective Microinteractions",
    description: "Focus on small, subtle animations and feedback loops that enhance user experience, usability, and delight in a web application."
  },
  "ui-design": {
    title: "User Interface (UI) Design Principles",
    description: "Content covering the visual and interactive elements of interface design, from color, gradients, and borders to motion that communicates state and flow."
  },
  "keyframes": {
    title: "Animating with CSS `@keyframes`",
    description: "Using the `@keyframes` at-rule to build multi-step, self-running animation timelines, independent of `:hover` or other state-driven transitions."
  },
  "transform-origin": {
    title: "Controlling Pivot Points with `transform-origin`",
    description: "Setting the `transform-origin` property to control the pivot point for rotation and scaling, including the quirks unique to animating SVG elements."
  },
  "transform-box": {
    title: "The `transform-box` Property for SVG Animation",
    description: "Understanding `transform-box` and how switching an SVG element's reference frame to its own bounding box fixes unexpected rotation and scaling behavior."
  },
  "stroke-dasharray": {
    title: "Dashed Strokes with SVG `stroke-dasharray`",
    description: "Using `stroke-dasharray` to break an SVG stroke into a repeating pattern of dashes and gaps, the foundation of the line-drawing animation technique."
  },
  "stroke-dashoffset": {
    title: "Line-Draw Animations with `stroke-dashoffset`",
    description: "Animating `stroke-dashoffset` to create the classic self-drawing line effect, paired with `stroke-dasharray` and the `pathLength` attribute."
  },
  "clip-path": {
    title: "Revealing Shapes with CSS `clip-path`",
    description: "Animating the `clip-path` property to wipe a shape, image, or entire group into view, using `inset()` and other clip-region shapes."
  },
  "text-path": {
    title: "Animating Text Along a Path",
    description: "Laying text along a curve with SVG's `<textPath>` element, and moving text along a path with `offset-path` where animation is the goal."
  },
  "animation-timeline": {
    title: "Scroll-Driven Animation with `animation-timeline`",
    description: "Tying `@keyframes` progress to scroll position instead of time using `animation-timeline` and `animation-range`, with no scroll event listener required."
  },
  "animation-delay": {
    title: "Staggering Animations with `animation-delay`",
    description: "Using `animation-delay` to offset when each element in a group starts its animation, turning synchronized motion into a rippling, staggered wave."
  },
  "offset-path": {
    title: "Motion Path Animation with `offset-path`",
    description: "Moving an element along an arbitrary SVG path using `offset-path`, `offset-distance`, and `offset-rotate`, without hand-rolled trigonometry."
  },
  "motion-path": {
    title: "CSS Motion Path Techniques",
    description: "Animating elements along a defined path in space, covering `offset-path`, `offset-distance`, and `offset-rotate` for curved motion."
  },
  "shape-morphing": {
    title: "Morphing SVG Shapes by Animating `d`",
    description: "Techniques for smoothly transforming one SVG path into another by animating the `d` attribute, and when that trade-off is worth its performance cost."
  },
  "git": {
    title: "All Content Tagged Git",
    description: "Everything tagged Git — staging, committing, branching, merging, rebasing, and the advanced commands that come up once a repo gets real."
  },
  "version-control": {
    title: "Version Control Concepts and Practices",
    description: "Core version control concepts — snapshots, history, branching models, and collaborative workflows — mostly explored through Git."
  },
  "github": {
    title: "Working with GitHub: Remotes, PRs, and Collaboration",
    description: "Collaborating through GitHub — remotes, pull requests, forks, and branch-protection workflows built on top of Git."
  },
  "branching": {
    title: "Git Branching Strategies and Commands",
    description: "Everything about Git branches — creating, switching, renaming, tracking, and choosing a branching strategy for your team."
  },
  "merging": {
    title: "Merging Branches in Git",
    description: "Fast-forward vs. three-way merges, resolving conflicts, and choosing merge strategies when bringing branches together."
  },
  "cli": {
    title: "Command-Line Tooling and Workflows",
    description: "Practical command-line usage and workflows, from everyday commands to productivity aliases and configuration."
  },
  "gitignore": {
    title: "Using .gitignore to Exclude Files from Git",
    description: "Writing and troubleshooting .gitignore files — pattern syntax, ignoring already-tracked files, and keeping build artifacts and secrets out of a repo."
  },
  "stash": {
    title: "Stashing Changes with Git",
    description: "Setting aside uncommitted work with git stash — stashing, listing, applying, and managing multiple stashes without a throwaway commit."
  },
  "rebase": {
    title: "Git Rebase: Interactive Rebasing and History Rewriting",
    description: "Using git rebase — including interactive rebase, autosquash, and the tradeoffs of rewriting shared history."
  },
  "git-workflow": {
    title: "Git Workflows for Teams",
    description: "Branching and release models like Git Flow, GitHub Flow, and trunk-based development, and how to pick one for your team."
  },
  "reflog": {
    title: "Recovering Lost Work with Git Reflog",
    description: "Using git reflog and related recovery techniques to get back commits, branches, and work that seem to be gone for good."
  },
  "cherry-pick": {
    title: "Cherry-Picking Commits in Git",
    description: "Applying individual commits from one branch onto another with git cherry-pick, including conflict resolution and cherry-picking ranges."
  },
  "git-internals": {
    title: "How Git Works Under the Hood",
    description: "Git's object model, the .git directory, refs, and the plumbing commands that power everyday Git usage."
  },
  "advanced": {
    title: "Advanced Topics for Experienced Developers",
    description: "Deeper dives past the fundamentals — for readers already comfortable with the basics and ready for edge cases and internals."
  },
  "svg": {
    title: "Scalable Vector Graphics for the Web",
    description: "Master Scalable Vector Graphics (SVG). Learn to create resolution-independent, DOM-friendly, and performant graphics using XML-based code."
  },
  "graphics": {
    title: "Creating High-Quality Web Graphics",
    description: "A look into both vector and raster graphics for the web, focusing on clarity, performance, and the right format for the right task."
  },
  "gpu-performance": {
    title: "GPU-Accelerated Animation Performance",
    description: "Techniques for keeping animations smooth by favoring properties the browser can hand off to the GPU instead of the main thread."
  },
  "multi-step": {
    title: "Multi-Step Animation Sequences",
    description: "Building animations with more than two states, using percentage-based checkpoints to choreograph complex motion."
  },
  "web-motion": {
    title: "Web Motion Design and Implementation",
    description: "Designing and implementing purposeful motion across web interfaces, from micro-interactions to full-page effects."
  },
  "scroll-animation": {
    title: "Scroll-Driven Animation Techniques",
    description: "Tying animation progress to a user's scroll position instead of a fixed time-based duration."
  },
  "view-timeline": {
    title: "CSS `view()` Timelines Explained",
    description: "Understanding the `animation-timeline` property and `view()` timelines for animations that progress as an element moves through the viewport."
  },
  "advanced-css": {
    title: "Advanced CSS Techniques",
    description: "Deeper explorations of modern CSS features and specifications that go beyond foundational layout and styling concepts."
  },
  "vector-graphics": {
    title: "Mastering Vector Graphics and Scalability",
    description: "Explore the world of vector-based design where images are defined by mathematical paths, ensuring they stay sharp at any resolution or screen size."
  },
  "web-graphics": {
    title: "Optimizing Graphics for Modern Web Performance",
    description: "Implementing and optimising icons, illustrations, and data visualizations to keep web applications fast and visually stunning."
  },
  "ui-development": {
    title: "Modern UI Development and Implementation",
    description: "Focusing on the bridge between design and code, covering how to build interactive, accessible, and responsive user interface components."
  },
  "coordinate-system": {
    title: "Understanding the SVG Coordinate System",
    description: "How SVG canvas coordinates work, mastering the X-axis, Y-axis, and the 'top-left (0,0)' rule of the browser."
  },
  "viewbox": {
    title: "Mastering the SVG viewBox and Scaling",
    description: "Learn how to use the viewBox attribute to define virtual coordinate grids (User Units) and create graphics that scale perfectly in any container."
  },
  "path-data": {
    title: "Mastering SVG Path Data: The 'd' Attribute",
    description: "Decoding and writing SVG path data, from basic LineTo commands to complex Bézier curves and elliptical arcs."
  },
  "vector": {
    title: "Working with Scalable Vector Graphics (SVG)",
    description: "Principles of vector-based design for the web, focusing on resolution independence, mathematical paths, and sharp rendering at any scale."
  },
  "bezier-curves": {
    title: "Understanding Bézier Curves in Web Graphics",
    description: "Quadratic and Cubic Bézier curves, explaining the math and logic behind smooth, organic vector paths and animations."
  },
  "web-animation": {
    title: "High-Performance Web Animation and Motion",
    description: "Techniques for creating engaging web experiences using CSS transitions, @keyframes, and JavaScript-driven motion for SVG and UI elements."
  },
  "javascript": {
    title: "JavaScript: The Full Guide to Modern Development Logic",
    description: "Comprehensive resources covering the entire JavaScript ecosystem, from foundational syntax and logic to advanced runtime execution and modern web patterns."
  },
  "operators": {
    title: "A Complete Guide to JavaScript Operators",
    description: "A complete guide to JavaScript operators, including arithmetic, assignment, comparison, logical, and unary operators."
  },
  "es6": {
    title: "Modern JavaScript (ES6 and Beyond)",
    description: "Modern JavaScript features introduced in ECMAScript 2015 (ES6) and later versions, enhancing development efficiency."
  },
  "cheatsheet": {
    title: "Web Development Cheatsheets and References",
    description: "Quick references and cheatsheets for essential web development concepts and syntax, designed for easy recall."
  },
  "optional-chaining": {
    title: "Optional Chaining (`?.`) in JavaScript",
    description: "Using the `?.` operator to safely access deeply nested properties and call methods without manual null checks or try/catch guards."
  },
  "nullish-coalescing": {
    title: "Nullish Coalescing (`??`) in JavaScript",
    description: "Using the `??` operator to supply fallback values only for `null` or `undefined`, without accidentally overriding falsy values like 0 or an empty string."
  },
  "spread-operator": {
    title: "The JavaScript Spread Operator Explained",
    description: "Using `...` to expand arrays and objects into individual elements — for cloning, merging, and passing arguments to functions."
  },
  "ternary-operator": {
    title: "The JavaScript Ternary (Conditional) Operator",
    description: "Writing concise conditional expressions with `? :`, JavaScript's only operator that takes three operands, as a shorthand for simple if...else logic."
  },
  "type-coercion": {
    title: "Type Coercion in JavaScript",
    description: "How JavaScript implicitly converts values between types during comparisons, arithmetic, and boolean checks — and where it commonly surprises developers."
  },
  "polygon": {
    title: "Mastering SVG Polygons and Multi-Sided Shapes",
    description: "Learn to define closed geometric shapes using the SVG <polygon> element, mastering the points attribute to create everything from triangles to complex custom polygons."
  },
  "polyline": {
    title: "Creating Open Paths with SVG Polylines",
    description: "Using the <polyline> element for creating series of connected straight-line segments, perfect for open-ended shapes, sparklines, and technical drawings."
  },
  "shapes": {
    title: "SVG Basic Shapes and Geometric Primitives",
    description: "A comprehensive look at SVG's built-in shape elements, including rectangles, circles, ellipses, and lines, for building structured graphics without complex paths."
  },
  "fill-rule": {
    title: "Understanding SVG Fill Rules: nonzero vs. evenodd",
    description: "A technical breakdown of the fill-rule property, explaining how the 'nonzero' and 'evenodd' algorithms determine the interior area of complex, self-intersecting paths."
  },
  "stroke-miterlimit": {
    title: "SVG `stroke-miterlimit` and Sharp Corners",
    description: "How `stroke-miterlimit` decides when a sharp miter join falls back to a bevel, and how to keep star tips and chart corners crisp without runaway spikes."
  },
  "sparklines": {
    title: "Building Sparklines with SVG",
    description: "Word-sized, axis-free line charts built from SVG polylines — mapping data to points, stretching with preserveAspectRatio, and keeping strokes even."
  },
  "data-visualization": {
    title: "Data Visualization on the Web",
    description: "Turning data into charts and graphics with SVG and code, from line and area charts to sparklines, with an eye on clarity, performance, and accessibility."
  },
  "svg-animation": {
    title: "Animating SVG Shapes and Strokes",
    description: "Techniques for bringing SVG to life — draw-on stroke effects, shape morphing, SMIL, and CSS or JavaScript-driven motion for icons and illustrations."
  },
  "icons": {
    title: "Designing and Implementing Custom Web Icons",
    description: "Best practices for building, optimizing, and managing custom SVG icon systems that are accessible, performant, and easy to style."
  },
  "frontend-development": {
    title: "Frontend Engineering: Building for the Modern Web",
    description: "Comprehensive resources on the intersection of HTML, CSS, JavaScript, and SVG to build high-performance, accessible user interfaces."
  },
  "accessibility": {
    title: "Web Accessibility (a11y) Standards and Practices",
    description: "Web accessibility (a11y) standards, ensuring websites are usable by everyone, regardless of disability or device."
  },
  "rtl": {
    title: "Right-to-Left (RTL) Layout Techniques",
    description: "Building interfaces that work correctly for right-to-left languages like Arabic and Hebrew, without duplicating stylesheets.",
  },
  "logical-properties": {
    title: "CSS Logical Properties Explained",
    description: "CSS Logical Properties — flow-relative alternatives to left/right/top/bottom that adapt across writing modes and directions.",
  },
  "writing-modes": {
    title: "CSS Writing Modes",
    description: "The `writing-mode` property and how it reshapes the inline and block axes for vertical and horizontal scripts.",
  },
  "i18n": {
    title: "i18n: Internationalization Techniques",
    description: "Content tagged with the i18n shorthand for internationalisation — adapting layout, text, and styling for a global audience.",
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
    description: "Building layouts and effects that work with a baseline of broadly-supported CSS — readable fallbacks, @supports guards — then layering on newer features for browsers that support them."
  },
  "gradients": {
    title: "Mastering CSS Gradients and Color Blending",
    description: "Learn to create smooth color transitions and visual depth using various CSS gradient functions for background, borders, and text styling."
  },
  "background": {
    title: "Advanced CSS Background Styling and Patterns",
    description: "Explore the versatile background property, including shorthand syntax, multiple backgrounds, positioning, and sizing techniques for robust UI."
  },
  "linear-gradient": {
    title: "Directional Color: Guide to CSS Linear Gradients",
    description: "Create directional color transitions along a straight line, mastering angles, color stops, and transparency for modern web backgrounds."
  },
  "radial-gradient": {
    title: "Circular Effects with CSS Radial Gradients",
    description: "Build circular and elliptical color transitions, exploring shapes, sizes, and positioning for glow, shadow, and depth effects."
  },
  "conic-gradient": {
    title: "Angular Transitions with CSS Conic Gradients",
    description: "Master conic (polar) gradients to create pie charts, color wheels, and interesting angular patterns for modern, unique web design."
  },
  "repeating-gradient": {
    title: "Patterns and Textures with Repeating Gradients",
    description: "Use repeating-linear and repeating-radial gradients to create seamless patterns, stripes, and textured backgrounds without external image assets."
  },
  "modern-css": {
    title: "Exploring Modern CSS Features and Future Specs",
    description: "Stay updated with the latest CSS specifications, including subgrid, container queries, the :has() selector, and high-level layout modules."
  },
  "color-theory": {
    title: "Color Theory and Palette Design for the Web",
    description: "Understand the fundamentals of color psychology, harmony, and contrast to build accessible, balanced, and visually appealing color systems."
  },
  "oklch": {
    title: "Perceptual Color with OKLCH in Modern CSS",
    description: "The OKLCH color space for creating perceptually uniform, predictable, and high-gamut colors in modern browser environments."
  },
  "scss": {
    title: "Streamlined Styling with SCSS and Preprocessors",
    description: "Optimize your CSS workflow using SCSS (Sass) features like variables, nesting, mixins, and modular imports for scalable and maintainable code."
  },
  "mixins": {
    title: "Reusable Styles with Sass Mixins",
    description: "Write once, include everywhere: building reusable Sass @mixin blocks with named, defaulted arguments to keep repeated CSS patterns DRY and consistent."
  },
  "gradient-text": {
    title: "CSS Gradient Text Techniques",
    description: "Clipping gradients to typography with background-clip: text, from static headings to animated and stroke-outlined text effects."
  },
  "background-clip": {
    title: "Mastering the CSS background-clip Property",
    description: "Using background-clip: text and border-box/padding-box tricks for gradient text, gradient borders, and other clipped background effects."
  },
  "text-effects": {
    title: "Creative CSS Text Effects",
    description: "Techniques for styling typography beyond flat color, including gradients, strokes, shadows, and other CSS-only text treatments."
  },
  "typography": {
    title: "Styling Web Typography with CSS",
    description: "Styling text on the web with CSS, from readable, accessible type to decorative treatments like gradient fills and outlined headings."
  },
  "css-custom-properties": {
    title: "CSS Custom Properties (Variables) and @property",
    description: "Theming and runtime styling with CSS custom properties, and on registering typed properties with @property so values like angles and colors can animate."
  },
  "borders": {
    title: "Advanced CSS Border Styling",
    description: "Techniques for styling element borders beyond a flat color, including gradients, images, and animated effects using modern CSS."
  },
  "web-apis": {
    title: "Browser Web APIs for Modern Frontends",
    description: "Coverage of native browser APIs — beyond the core language — that power reactive, high-performance web applications."
  },
  "observer-pattern": {
    title: "The Observer Pattern in JavaScript",
    description: "The Observer (Pub/Sub) design pattern, both as implemented by native browser APIs and as a custom pattern for decoupled state updates."
  },
  "reactive-programming": {
    title: "Reactive Programming on the Web",
    description: "Content on writing code that responds to state and environment changes as they happen, rather than polling for them."
  },
  "event-listener": {
    title: "Event Listeners and DOM Events",
    description: "Using addEventListener, event delegation, and handling user interactions and browser events efficiently."
  },
  "mutation-observer": {
    title: "Working with MutationObserver",
    description: "Using MutationObserver to react to DOM structure and attribute changes without expensive polling."
  },
  "intersection-observer": {
    title: "IntersectionObserver in Practice",
    description: "Using IntersectionObserver for lazy loading, scrollspy navigation, infinite scroll, and visibility-triggered animations."
  },
  "resize-observer": {
    title: "ResizeObserver for Container-Aware Components",
    description: "Content on using ResizeObserver to react to an individual element's size changes, enabling truly container-aware, responsive components."
  },
  "dom": {
    title: "Working with the DOM",
    description: "Reading, updating, and reacting to changes in the Document Object Model from JavaScript."
  },
  "core-web-vitals": {
    title: "Core Web Vitals and Performance Metrics",
    description: "Measuring and improving Core Web Vitals like Largest Contentful Paint and Cumulative Layout Shift using browser performance APIs."
  },
  "lazy-loading": {
    title: "Lazy Loading Techniques",
    description: "Techniques for deferring the loading of images, components, and data until they're actually needed, improving initial page performance."
  },
  "async-javascript": {
    title: "Asynchronous JavaScript Explained",
    description: "Writing non-blocking JavaScript using callbacks, promises, and async/await, along with the event loop concepts that tie them together."
  },
  "modern-js": {
    title: "Modern JavaScript Features and Patterns",
    description: "Content focused on contemporary JavaScript syntax and idioms, from ES2017+ features to current best practices for writing clean, maintainable code."
  },
  "async": {
    title: "Understanding Asynchronous Programming",
    description: "Foundational and advanced content on asynchronous execution in JavaScript, including concurrency, timing, and coordination patterns."
  },
  "callbacks": {
    title: "Callback Functions in JavaScript",
    description: "The callback pattern in JavaScript — passing functions as arguments to run after an operation completes — and its trade-offs at scale."
  },
  "promises": {
    title: "Mastering JavaScript Promises",
    description: "The Promise API, its states and resolution rules, chaining, and the static utility methods like Promise.all and Promise.race."
  },
  "async-await": {
    title: "Async/Await in Modern JavaScript",
    description: "Using async and await to write asynchronous JavaScript that reads like synchronous code, including error handling with try/catch."
  },
  "event-loop": {
    title: "The JavaScript Event Loop Explained",
    description: "The JavaScript runtime model — the call stack, Web APIs, task queues, and the event loop that ties them together."
  },
  "microtasks": {
    title: "Microtasks and the Priority Queue",
    description: "The microtask queue that backs Promises and queueMicrotask, and how it's prioritized ahead of macrotasks like setTimeout."
  },
  "css3": {
    title: "CSS3 Features",
    description: "CSS3 specifications and the modern features they introduced for styling and animating the web."
  },
  "css-animation": {
    title: "CSS Animation Techniques",
    description: "Animating elements with CSS, from timing functions to keyframe sequencing."
  },
  "steps": {
    title: "The CSS `steps()` Timing Function",
    description: "The `steps()` timing function for discrete, frame-based animation jumps instead of continuous easing."
  },
  "linear-easing": {
    title: "The CSS `linear()` Easing Function",
    description: "Guides to the `linear()` timing function — piecewise-linear curves with an open-ended list of stops, for shapes a single `cubic-bezier()` can't express, like spring and bounce easing.",
  },
  "css-tricks": {
    title: "Handy CSS Tricks and Techniques",
    description: "Practical, lesser-known CSS techniques and tricks for solving common styling and animation problems."
  },
  "discrete-animation": {
    title: "Discrete (Stepped) Animation Techniques",
    description: "Animations that jump between fixed states rather than interpolating smoothly, such as those built with `steps()`."
  },
  "typewriter-effect": {
    title: "Building CSS Typewriter Effects",
    description: "Recreating the classic typewriter text-reveal effect using CSS animations and the `steps()` timing function."
  },
  "sprite-animation": {
    title: "CSS Sprite Sheet Animation",
    description: "Techniques for animating sprite sheets on the web by stepping through `background-position` frames with CSS."
  },
  "web-performance": {
    title: "Web Performance Optimization",
    description: "Content focused on keeping web interfaces fast and responsive, from rendering pipelines to animation efficiency."
  },
  "ui-animation": {
    title: "UI Animation Design and Implementation",
    description: "Animating interface elements to communicate state, guide attention, and improve perceived responsiveness."
  },
  "z-index": {
    title: "Understanding CSS z-index",
    description: "How the CSS `z-index` property layers overlapping elements, why it sometimes has no effect, and how to manage it at scale."
  },
  "stacking-context": {
    title: "CSS Stacking Contexts Explained",
    description: "CSS stacking contexts — what creates them, how they group elements when painting, and how they cause and solve layering bugs."
  },
  "isolation": {
    title: "The CSS `isolation` Property",
    description: "Using `isolation: isolate` to create stacking contexts without side effects, contain `z-index`, and keep `mix-blend-mode` inside a group."
  },
  "positioning": {
    title: "CSS Positioning Techniques",
    description: "How `position: relative`, `absolute`, `fixed`, and `sticky` work, and how positioned elements interact with layout and layering."
  },
  "mix-blend-mode": {
    title: "Blending with `mix-blend-mode`",
    description: "Techniques for blending elements with what's beneath them using `mix-blend-mode`, and for keeping blends contained."
  },
  "debugging": {
    title: "Debugging Front-End Code",
    description: "Practical, step-by-step approaches and DevTools techniques for finding and fixing front-end bugs."
  },
  "objectfreeze": {
    title: "Using `Object.freeze()` in JavaScript",
    description: "How `Object.freeze()` locks an object's properties, where its shallow behaviour falls short, and how to freeze nested structures."
  },
  "deep-freeze": {
    title: "Deep Freezing Objects in JavaScript",
    description: "Recursive techniques for freezing every level of a JavaScript object so nested data can't be mutated by accident."
  },
  "immutability": {
    title: "Immutability in JavaScript",
    description: "Patterns for keeping data immutable in JavaScript — freezing objects, avoiding shared mutation, and making state changes predictable."
  },
  "secure-coding": {
    title: "Secure Coding Practices",
    description: "Defensive coding techniques that protect data and behaviour from accidental or malicious tampering."
  },
  "strict-mode": {
    title: "JavaScript Strict Mode",
    description: "How `\"use strict\"` changes JavaScript's behaviour, turning silent failures such as writes to frozen objects into thrown errors."
  },
  "closures": {
    title: "Understanding JavaScript Closures",
    description: "How closures capture their lexical scope, and how to use them for private state, factories, and encapsulated behaviour."
  },
  "encapsulation": {
    title: "Encapsulation Techniques in JavaScript",
    description: "Ways to hide internal state in JavaScript, from closure-based modules to native private class fields."
  },
  "design-patterns": {
    title: "Software Design Patterns",
    description: "Reusable solutions to recurring design problems, shown with practical JavaScript and front-end examples."
  },
  "functional-programming": {
    title: "Functional Programming in JavaScript",
    description: "Functional techniques in JavaScript — pure functions, closures, and composition — for writing predictable, testable code."
  },
  "private-state": {
    title: "Managing Private State",
    description: "Techniques for keeping internal state private so it can only change through a deliberate public interface."
  },
  "clean-code": {
    title: "Writing Clean, Maintainable Code",
    description: "Practices for writing readable, well-structured code that stays easy to change, test, and reason about."
  },
  "factory-pattern": {
    title: "The Factory Pattern in JavaScript",
    description: "Using factory functions to create objects with private state and shared behaviour, without classes or `new`."
  },
  "oop": {
    title: "Object-Oriented Programming in JavaScript",
    description: "Object-oriented techniques in JavaScript — classes, inheritance, and encapsulation — built on its prototype model."
  },
  "classes": {
    title: "JavaScript Classes",
    description: "Working with JavaScript classes, from constructors and methods to private fields and static members."
  },
  "react": {
    title: "All Content Tagged React",
    description: "React hooks, component patterns, and reusable logic for building interactive user interfaces."
  },
  "hooks": {
    title: "React Hooks",
    description: "Using and composing React hooks to manage state, effects, and browser events inside function components."
  },
  "custom-hooks": {
    title: "Building Custom React Hooks",
    description: "Building reusable custom React hooks that package stateful logic and browser APIs behind a small, clean interface."
  },
  "usepointerposition": {
    title: "The `usePointerPosition` React Hook",
    description: "A React hook that tracks pointer coordinates across mouse, touch, and pen input with a single Pointer Events listener."
  },
  "usemouseposition": {
    title: "Tracking Mouse Position in React",
    description: "Ways to track the cursor's position in React, including `useMousePosition` and its pointer-aware successor."
  },
  "pointer-events": {
    title: "The Pointer Events API",
    description: "Handling mouse, touch, and stylus input through one unified Pointer Events API instead of separate event families."
  },
  "typescript": {
    title: "All Content Tagged TypeScript",
    description: "TypeScript examples and patterns for adding static types to JavaScript, React components, and utility code."
  },
  "responsive-design": {
    title: "Responsive Design Techniques",
    description: "Building layouts, type, and spacing that adapt smoothly to every screen size, from small phones to wide desktops."
  },
  "holy-grail-layout": {
    title: "The Holy Grail Layout",
    description: "Building the classic header, footer, and three-column Holy Grail layout with modern CSS Grid."
  },
  "async-retry": {
    title: "Retrying Async Operations",
    description: "Retrying failed asynchronous operations in JavaScript with configurable attempts, delays, and backoff strategies."
  },
  "backoff": {
    title: "Backoff Strategies for Retries",
    description: "Spacing out retries with linear, exponential, and jittered backoff so failing services get time to recover."
  },
  "error-handling": {
    title: "Error Handling in JavaScript",
    description: "Catching, retrying, and reporting errors in JavaScript — especially in asynchronous, promise-based code."
  },
  "resilience": {
    title: "Building Resilient Applications",
    description: "Techniques that help applications survive network failures, flaky services, and transient errors gracefully."
  },
  "nodejs": {
    title: "All Content Tagged Node.js",
    description: "Node.js techniques and utilities for server-side JavaScript, from async workflows to resilient API calls."
  },
  "api-calls": {
    title: "Making Reliable API Calls",
    description: "Making network requests that cope with timeouts, failures, and rate limits without hammering the server."
  },
  "jitter": {
    title: "Adding Jitter to Retries",
    description: "Using randomised jitter to spread retry attempts out so clients don't all hit a recovering service at once."
  },
  "thundering-herd": {
    title: "The Thundering Herd Problem",
    description: "What causes the thundering herd problem and how backoff with jitter keeps synchronised clients from overwhelming a server."
  },
  "distributed-systems": {
    title: "Distributed Systems Concepts",
    description: "Concepts and patterns for building systems that stay reliable when many clients and services talk over the network."
  },
  "scalability": {
    title: "Building for Scalability",
    description: "Patterns that keep applications and services performing well as traffic and load grow."
  },
  "architecture": {
    title: "Software Architecture",
    description: "Structural decisions and patterns that shape how systems behave under load, failure, and change."
  },
  "reliability": {
    title: "Reliability Engineering",
    description: "Techniques for building software that keeps working through partial failures and unpredictable conditions."
  },
  "light-dark": {
    title: "The CSS `light-dark()` Function",
    description: "Using the CSS `light-dark()` function to declare light and dark colour values in a single line."
  },
  "color-scheme": {
    title: "The CSS `color-scheme` Property",
    description: "How `color-scheme` tells the browser which themes a page supports and unlocks theme-aware features like `light-dark()`."
  },
  "dark-mode": {
    title: "Building Dark Mode on the Web",
    description: "Approaches for adding dark mode to websites, from system-preference detection to theme-aware CSS colours."
  },
  "accent-color": {
    title: "Theming Controls with `accent-color`",
    description: "Using the CSS `accent-color` property to give native checkboxes, radios, switches, sliders and progress bars a brand colour."
  },
  "forms": {
    title: "Building HTML Forms",
    description: "Accessible, well-styled HTML forms and the native controls inside them."
  },
  "native-controls": {
    title: "Native Form Controls",
    description: "Getting the most from the browser's own form controls instead of rebuilding them as custom widgets."
  },
  "theming": {
    title: "Theming Websites with CSS",
    description: "Techniques for building switchable themes with custom properties, design tokens, and modern colour functions."
  },
  "design-tokens": {
    title: "Working with Design Tokens",
    description: "Using design tokens to keep colour, spacing, and typography consistent and easy to theme across a site."
  },
  "env": {
    title: "The CSS `env()` Function",
    description: "Reading browser-defined environment variables in CSS with `env()`, such as the safe-area insets around a device's notch."
  },
  "safe-area-inset": {
    title: "Safe Area Insets in CSS",
    description: "Using `safe-area-inset-*` values to keep content clear of notches, rounded corners, and home indicators."
  },
  "notch": {
    title: "Designing Around the Notch",
    description: "Keeping layouts usable on devices with notches, camera cut-outs, and rounded screen corners."
  },
  "viewport-fit": {
    title: "The `viewport-fit` Meta Setting",
    description: "How `viewport-fit=cover` extends a page edge to edge on notched devices, and how to pad content back into view."
  },
  "mobile-web": {
    title: "Mobile Web Development",
    description: "Techniques for building web pages that feel at home on phones, from viewport handling to device-specific quirks."
  },
  "clamp": {
    title: "The CSS `clamp()` Function",
    description: "Using `clamp()` to set values that scale fluidly between a minimum and a maximum, without media queries."
  },
  "min-max": {
    title: "The CSS `min()` and `max()` Functions",
    description: "Using `min()` and `max()` to let the browser choose the smaller or larger of several values at render time."
  },
  "css-functions": {
    title: "CSS Functions",
    description: "Modern CSS functions such as `clamp()`, `min()`, `max()`, and `if()` that compute values directly in the browser."
  },
  "corner-shape": {
    title: "Shaping Corners with `corner-shape`",
    description: "Using the CSS `corner-shape` property and `superellipse()` to turn rounded corners into squircles, bevels, scoops and notches."
  },
  "border-radius": {
    title: "Rounding Corners with `border-radius`",
    description: "Sizing element corners with `border-radius`, from simple rounding to the base that `corner-shape` builds on."
  },
  "reading-flow": {
    title: "Fixing Focus Order with `reading-flow`",
    description: "Using `reading-flow` and `reading-order` to make keyboard focus follow the visual order of flex and grid layouts."
  },
  "keyboard-navigation": {
    title: "Keyboard Navigation and Focus Order",
    description: "Making interfaces fully usable from the keyboard, with a focus order that matches what's on screen."
  },
  "flexbox": {
    title: "CSS Flexbox Layouts",
    description: "One-dimensional layouts with Flexbox — direction, wrapping, alignment and ordering."
  },
  "customizable-select": {
    title: "Styling `<select>` with `appearance: base-select`",
    description: "Opting the native `<select>` into a fully styleable mode with `appearance: base-select`, `::picker(select)` and `<selectedcontent>`, without losing its built-in behaviour."
  },
  "anchor-positioning": {
    title: "CSS Anchor Positioning",
    description: "Tethering popovers, pickers and tooltips to another element with anchor positioning and `position-area`, with no JavaScript measuring."
  },
  "scroll-state": {
    title: "Scroll-State Container Queries",
    description: "Styling elements from scroll state with `@container scroll-state()` — whether a sticky element is stuck, a container is scrollable or an item is snapped."
  },
  "scroll-snap": {
    title: "CSS Scroll Snap",
    description: "Building carousels and paged scrollers that settle on each item with `scroll-snap-type` and `scroll-snap-align`."
  },
  "text-box": {
    title: "Trimming Text with `text-box`",
    description: "Using `text-box`, `text-box-trim` and `text-box-edge` to trim the space above and below text for optically centred buttons and aligned headings."
  },
  "css-2025": {
    title: "Modern CSS Features of 2025",
    description: "Recently supported CSS features and units worth adopting now, from dynamic viewport units to conditional values."
  },
  "fluid-typography": {
    title: "Fluid Typography with CSS",
    description: "Scaling font sizes smoothly with the viewport or container using `clamp()` instead of fixed breakpoints."
  },
  "viewport-units": {
    title: "CSS Viewport Units",
    description: "Understanding viewport units — `vh`, `vw`, and the newer dynamic, small, large, and logical variants — and when to use each."
  },
  "dvh": {
    title: "Dynamic Viewport Height (`dvh`)",
    description: "Using `dvh`, `svh`, and `lvh` to size elements correctly as mobile browser toolbars appear and disappear."
  },
  "mobile": {
    title: "Mobile-Friendly Web Techniques",
    description: "CSS and layout techniques that account for mobile browser behaviour, small screens, and touch input."
  },
  "dvw": {
    title: "Dynamic Viewport Width (`dvw`)",
    description: "Using `dvw`, `svw`, and `lvw` for widths that respect the visible viewport, including full-bleed layouts."
  },
  "full-bleed": {
    title: "Full-Bleed Layouts in CSS",
    description: "Techniques for letting elements break out of a centred content column and span the full width of the viewport."
  },
  "if-function": {
    title: "The CSS `if()` Function",
    description: "Using the CSS `if()` function to choose property values inline based on media, support, or style queries."
  },
  "conditional-css": {
    title: "Conditional Logic in CSS",
    description: "Ways to apply styles conditionally in CSS, from queries and custom properties to the new `if()` function."
  },
  "css-reset": {
    title: "CSS Resets Explained",
    description: "What a modern CSS reset contains, why each rule exists, and how to tailor one to your own projects."
  },
  "box-sizing": {
    title: "The CSS `box-sizing` Property",
    description: "How `box-sizing` decides whether padding and borders count towards an element's width and height."
  },
  "interpolate-size": {
    title: "Animating to `auto` with `interpolate-size`",
    description: "Using `interpolate-size` to let CSS transitions animate to and from intrinsic sizes such as `height: auto`."
  },
  "text-wrap": {
    title: "The CSS `text-wrap` Property",
    description: "Using `text-wrap: balance` and `pretty` for tidier headings and paragraphs without manual line breaks."
  },
  "best-practices": {
    title: "Front-End Best Practices",
    description: "Established conventions and sensible defaults for writing robust, accessible, and maintainable front-end code."
  },
  "sibling-index": {
    title: "The CSS `sibling-index()` Function",
    description: "Using `sibling-index()` to read an element's own position among its siblings inside `calc()`, for staggered delays and index-driven styles without JavaScript."
  },
  "sibling-count": {
    title: "The CSS `sibling-count()` Function",
    description: "Using `sibling-count()` to read how many siblings an element has, for staggers, colours, and sizes that adapt to the length of a list."
  },
  "tree-counting-functions": {
    title: "CSS Tree-Counting Functions",
    description: "The `sibling-index()` and `sibling-count()` functions, which expose an element's position and sibling total to CSS calculations."
  },
  "staggered-animation": {
    title: "Staggered Animations in CSS",
    description: "Offsetting the start of each element's animation so a group ripples in one after another, from hand-written delays to `sibling-index()`."
  },
  "spring-animation": {
    title: "Spring-Based Animation on the Web",
    description: "Guides on spring-physics motion for the web — mass, stiffness, and damping-driven curves, and how to approximate them in CSS with `linear()`.",
  },
  "bounce-easing": {
    title: "Bounce Easing Curves",
    description: "Curves that overshoot and settle rather than ease smoothly to a stop — building bounce timing functions with `linear()` and `cubic-bezier()`.",
  },
  "html5": {
    title: "HTML5 Elements and Browser APIs",
    description: "Guides to HTML5 elements and the browser APIs behind them — from the <canvas> element and its drawing context to the modern features every frontend developer relies on.",
  },
  "canvas": {
    title: "Working with the HTML5 Canvas API",
    description: "Guides on drawing, animating, and structuring code around the HTML5 <canvas> element, from plain JavaScript to framework integrations.",
  },
  "canvas-api": {
    title: "HTML5 Canvas API Reference and Techniques",
    description: "Deep dives into specific HTML5 Canvas API methods and techniques — drawing, transforms, pixel manipulation, and performance.",
  },
  "webgl": {
    title: "WebGL and 3D Graphics on the Web",
    description: "Posts touching WebGL and 3D rendering in the browser, from raw context calls to higher-level libraries like Three.js and react-three-fiber.",
  },
};
