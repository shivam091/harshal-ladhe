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
    title: "Git: Version Control from Basics to Internals",
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
    description: "Using git rebase — including interactive rebase, autosquash, and the trade-offs of rewriting shared history."
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
    description: "Building interfaces that work correctly for right-to-left languages like Arabic and Hebrew, without duplicating stylesheets."
  },
  "logical-properties": {
    title: "CSS Logical Properties Explained",
    description: "CSS Logical Properties — flow-relative alternatives to left/right/top/bottom that adapt across writing modes and directions."
  },
  "writing-modes": {
    title: "CSS Writing Modes",
    description: "The `writing-mode` property and how it reshapes the inline and block axes for vertical and horizontal scripts."
  },
  "i18n": {
    title: "i18n: Internationalization Techniques",
    description: "Content tagged with the i18n shorthand for internationalisation — adapting layout, text, and styling for a global audience."
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
    title: "Browser Support and Compatibility",
    description: "Checking feature support across browsers, and writing CSS and JavaScript that degrade gracefully where a feature isn't yet available."
  },
  "progressive-enhancement": {
    title: "Progressive Enhancement in CSS",
    description: "Building on broadly supported CSS first, with readable fallbacks and @supports guards, then layering on newer features for browsers that support them."
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
  "theming": {
    title: "Theming Websites with CSS",
    description: "Techniques for building switchable themes with custom properties, design tokens, and modern colour functions."
  },
  "design-tokens": {
    title: "Working with Design Tokens",
    description: "Using design tokens to keep colour, spacing, and typography consistent and easy to theme across a site."
  },
};
