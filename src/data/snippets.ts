import { createContentLookup, type ContentEntry } from "@/data/content";

// Aliased so snippet code reads in its own terms while sharing the common content shape.
export type Snippet = ContentEntry;

/*
  Each entry needs a matching app/(site)/(internal)/(snippet)/snippet/<slug>/page.mdx.
  Dates are deliberately absent — they come from git history at build time.
  Keep it oldest-first (append new snippets), since prev/next nav follows array order.
*/
export const snippets: Snippet[] = [
  {
    slug: "deep-freeze-objects",
    title: "Deep Freeze Objects in JavaScript",
    excerpt: "Recursively lock every object level for true immutability",
    description: "Lock objects and their children immutably — prevent accidental mutations and enforce deep immutability in strict mode.",
    category: ["JavaScript"],
    tags: ["javascript", "Object.freeze", "deep-freeze", "immutability", "secure-coding", "strict-mode"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/deep-freeze-objects/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Promotional digital graphic showing the phrase ‘JavaScript deepFreeze()’ with code-themed visuals and design elements aligned to the left.",
      caption: "Freezing a JavaScript object and every object nested inside it."
    },
    changelog: [
      { date: "2026-11-04", change: "Added cross-reference to tutorial 'Native JavaScript Set Methods: union, intersection and difference'" },
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-07-12", change: "Initial publication" }
    ]
  },
  {
    slug: "encapsulation-closure",
    title: "Encapsulation with Closures",
    excerpt: "Encapsulate private variables using JavaScript closure patterns.",
    description: "Master the functional approach to data encapsulation in JavaScript by leveraging lexical scoping to create immutable private variables.",
    category: ["JavaScript"],
    tags: ["javascript", "closures", "encapsulation", "design-patterns", "functional-programming", "private-state", "clean-code", "factory-pattern"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/encapsulation-closure/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover image illustrating private state encapsulation in JavaScript using closures, symbolized by a shield protecting internal variables.",
      caption: "Private state kept safely inside a closure, out of outside reach."
    },
    changelog: [
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-07-12", change: "Initial publication." }
    ]
  },
  {
    slug: "encapsulation-private-class-fields",
    title: "Encapsulation with Private Class Fields",
    excerpt: "Use native #private syntax to protect class properties in JavaScript.",
    description: "Implement native engine-level privacy in your OOP structures using ES2022+ private class fields and memory-efficient prototype methods.",
    category: ["JavaScript"],
    tags: ["javascript", "oop", "encapsulation", "classes", "clean-code"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/encapsulation-private-class-fields/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Representation of a JavaScript Class with a locked vault icon for private fields.",
      caption: "A class locking its internals away behind private # fields."
    },
    changelog: [
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-07-12", change: "Initial publication." }
    ]
  },
  {
    slug: "use-pointer-position",
    title: "`usePointerPosition`: Track Cursor & Touch Position in React",
    excerpt: "Track pointer position across mouse, touch, and pen input.",
    description: "Build a usePointerPosition hook using the Pointer Events API to track pointer coordinates in React state — one listener covers mouse, touch, and stylus input, with a useMousePosition alias for drop-in compatibility.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "usePointerPosition", "useMousePosition", "pointer-events", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-pointer-position/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React usePointerPosition hook tracking cursor and touch coordinates across mouse, touch, and pen input, with viewport and element-relative pointer tracking examples.",
      caption: "Cursor and touch coordinates tracked across mouse, touch and pen input."
    },
    changelog: [
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-09-23", change: "Initial publication." }
    ]
  },
  {
    slug: "git-fix-dates",
    title: "`git fix-dates`: Fix GitHub Commit Dates After a Rebase",
    excerpt: "Reset committer dates to author dates, then safely force-push.",
    description: "A git fix-dates command that resets committer dates to author dates after a rebase or amend, keeps merges intact, and force-pushes safely.",
    category: ["Git"],
    tags: ["git", "git-commands", "rebase", "commit-dates", "force-with-lease", "filter-branch", "bash", "cli"],
    link: {
      label: "Read the full post: Advanced Git: Rebasing, Internals, and Real-World Workflows",
      href: "/post/git/advanced-git-techniques-and-workflows"
    },
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/git-fix-dates/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Git fix-dates cover showing how to align GitHub commit dates after a rebase, with before-and-after comparisons, safe force-pushing, and preserved merge history.",
      caption: "Commit dates realigned after a rebase, before and after."
    },
    changelog: [
      { date: "2026-11-02", change: "Added Frequently Asked Questions section" },
      { date: "2026-10-26", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-spinning-loader",
    title: "CSS & SVG Loading Spinner from One Circle",
    excerpt: "Build an SVG loading spinner from one circle.",
    description: "Build an accessible SVG loading spinner from one circle: pathLength and stroke-dasharray draw the arc, CSS spins it, with reduced-motion support.",
    link: {
      label: "Read the full post: Animating SVG: A Guide to CSS Transitions and Keyframes",
      href: "/post/animations/svg-transitions-and-keyframes"
    },
    category: ["SVG"],
    tags: ["svg", "css", "loading-spinner", "svg-animation", "css-animation", "stroke-dasharray", "pathLength", "keyframes", "prefers-reduced-motion", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-spinning-loader/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a circular loading spinner made from a single glowing arc on a faint circular track.",
      caption: "A single glowing arc on a faint track, spinning as a loader."
    },
    changelog: [
      { date: "2026-11-07", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-circular-progress-ring",
    title: "SVG Circular Progress Ring with CSS Variables",
    excerpt: "Build an SVG progress ring driven by one CSS variable.",
    description: "Build an accessible SVG circular progress ring: pathLength and a --progress variable set the arc, with a gradient variant and smooth value transitions.",
    link: {
      label: "Read the full post: Animating SVG: A Guide to CSS Transitions and Keyframes",
      href: "/post/animations/svg-transitions-and-keyframes"
    },
    category: ["SVG"],
    tags: ["svg", "css", "progress-indicator", "stroke-dasharray", "pathLength", "css-custom-properties", "at-property", "css-transitions", "linear-gradient", "javascript", "accessibility", "prefers-reduced-motion"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-circular-progress-ring/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a circular progress ring with a glowing arc filling most of a faint circular track and a percentage in the centre.",
      caption: "A glowing arc on a faint track, filled to the current progress."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-animated-checkmark",
    title: "Animated SVG Checkmark: Success Tick Draw-On",
    excerpt: "Draw a success tick on with one SVG path and CSS.",
    description: "Animate an SVG checkmark that draws itself on with pathLength and stroke-dashoffset, plus a circle-first variant and reduced-motion support.",
    link: {
      label: "Read the full post: Animating SVG: A Guide to CSS Transitions and Keyframes",
      href: "/post/animations/svg-transitions-and-keyframes"
    },
    category: ["SVG"],
    tags: ["svg", "css", "svg-animation", "css-animation", "stroke-dasharray", "stroke-dashoffset", "pathLength", "keyframes", "animation-delay", "microinteractions", "icons", "prefers-reduced-motion", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-animated-checkmark/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a glowing checkmark being drawn inside a glowing circle.",
      caption: "A glowing success tick drawing itself inside a circle."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-line-draw-animation",
    title: "SVG Line-Draw Animation with stroke-dashoffset",
    excerpt: "Make any SVG stroke draw itself with pathLength and CSS.",
    description: "Make SVG paths draw themselves: pathLength, stroke-dasharray and stroke-dashoffset, with staggered paths, getTotalLength() and scroll triggers.",
    link: {
      label: "Read the full post: Animating SVG: A Guide to CSS Transitions and Keyframes",
      href: "/post/animations/svg-transitions-and-keyframes"
    },
    category: ["SVG"],
    tags: ["svg", "css", "svg-animation", "css-animation", "stroke-dasharray", "stroke-dashoffset", "pathLength", "keyframes", "staggered-animation", "animation-delay", "intersection-observer", "javascript", "prefers-reduced-motion"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-line-draw-animation/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a glowing line tracing a mountain and sun drawing, with part of the stroke still being drawn.",
      caption: "A glowing line drawing itself stroke by stroke."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-three-dot-loader",
    title: "SVG Three-Dot Loading Indicator with Staggered Delay",
    excerpt: "Build a three-dot SVG loader with staggered delays.",
    description: "Build an accessible three-dot SVG loading indicator: three circles, one keyframes rule and negative animation-delay values, with reduced-motion support.",
    link: {
      label: "Read the full post: Animating SVG: A Guide to CSS Transitions and Keyframes",
      href: "/post/animations/svg-transitions-and-keyframes"
    },
    category: ["SVG"],
    tags: ["svg", "css", "loading-spinner", "svg-animation", "css-animation", "keyframes", "animation-delay", "staggered-animation", "transform-box", "transform-origin", "opacity", "prefers-reduced-motion", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-three-dot-loader/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of three glowing dots in a row, pulsing one after another as a loading indicator.",
      caption: "Three glowing dots pulsing in a staggered wave."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-marching-ants-border",
    title: "SVG Marching Ants Border for Drop Zones and Selections",
    excerpt: "Animate a dashed SVG border that marches around any box.",
    description: "Build a marching ants border with an SVG rect and stroke-dashoffset: a seamless loop, a crisp overlay for any box size, and reduced-motion support.",
    link: {
      label: "Read the full post: Animating SVG: A Guide to CSS Transitions and Keyframes",
      href: "/post/animations/svg-transitions-and-keyframes"
    },
    category: ["SVG"],
    tags: ["svg", "css", "svg-animation", "css-animation", "stroke-dasharray", "stroke-dashoffset", "pathLength", "keyframes", "borders", "drag-and-drop", "ui-components", "prefers-reduced-motion"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-marching-ants-border/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a glowing dashed outline marching around a rounded rectangle drop zone.",
      caption: "A glowing dashed border marching around a drop zone."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-wave-section-divider",
    title: "SVG Wave Section Divider with currentColor",
    excerpt: "Add a reusable SVG wave between page sections.",
    description: "A reusable SVG wave divider: currentColor fill, preserveAspectRatio=\"none\" for full width, display: block, flipping, layered waves and seam fixes.",
    link: {
      label: "Read the full post: SVG Essentials: Mastering the Path Element",
      href: "/post/svg/svg-essentials-mastering-the-path-element"
    },
    category: ["SVG"],
    tags: ["svg", "css", "path-data", "bezier-curves", "currentColor", "preserveAspectRatio", "viewbox", "section-divider", "custom-properties", "web-design", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-wave-section-divider/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of two glowing layered waves dividing two coloured page sections.",
      caption: "Layered glowing waves dividing two page sections."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-icon-sprite-symbol-use",
    title: "SVG Icon Sprite with symbol and use",
    excerpt: "Build an accessible SVG icon sprite with symbol and use.",
    description: "Build an SVG icon sprite with symbol and use: CSS sizing, currentColor, a two-tone custom property, accessible icons and same-origin sprite files.",
    category: ["SVG"],
    tags: ["svg", "css", "icons", "svg-sprite", "symbol", "use", "currentColor", "custom-properties", "accessibility", "frontend-development"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-icon-sprite-symbol-use/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a glowing sprite sheet of icons, with copies of a star, heart and check mark drawn from it in different colours.",
      caption: "One glowing sprite sheet feeding many coloured icons."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-animated-hamburger-icon",
    title: "Animated SVG Hamburger to Close Icon with aria-expanded",
    excerpt: "Turn an SVG hamburger icon into a close icon with CSS.",
    description: "Animate an SVG hamburger icon into a close (✕) icon with CSS keyed off aria-expanded, transform-box: fill-box and a tiny JavaScript toggle.",
    link: {
      label: "Read the full post: Animating SVG: A Guide to CSS Transitions and Keyframes",
      href: "/post/animations/svg-transitions-and-keyframes"
    },
    category: ["SVG"],
    tags: ["svg", "css", "icons", "hamburger-menu", "aria-expanded", "css-transitions", "transform", "transform-box", "transform-origin", "microinteractions", "ui-components", "javascript", "prefers-reduced-motion", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-animated-hamburger-icon/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a glowing three-line hamburger icon morphing into a close cross.",
      caption: "A glowing hamburger icon turning into a close cross."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-arrowhead-marker",
    title: "SVG Arrowheads with `<marker>`",
    excerpt: "Add single and double arrowheads to SVG lines with one marker.",
    description: "Reusable SVG arrowheads with <marker>: refX/refY to place the tip, markerUnits for sizing, and orient=\"auto-start-reverse\" for double arrows.",
    category: ["SVG"],
    tags: ["svg", "svg-markers", "markerUnits", "orient", "currentColor", "data-visualization", "icons", "browser-support", "progressive-enhancement", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-arrowhead-marker/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of two glowing lines, one with a single arrowhead and one with arrowheads pointing outward at both ends.",
      caption: "One marker definition giving a single and a double-headed arrow."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-drop-shadow-filter",
    title: "SVG Drop Shadow Filter That Follows Any Shape",
    excerpt: "Build an SVG drop shadow that follows any outline.",
    description: "Build an SVG drop shadow from feGaussianBlur, feOffset, feFlood and feMerge, size the filter region so it never clips, and compare feDropShadow and CSS.",
    category: ["SVG"],
    tags: ["svg", "svg-filters", "drop-shadow", "feDropShadow", "feGaussianBlur", "feComposite", "filter-region", "graphics"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-drop-shadow-filter/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a glowing rounded square and circle floating above soft, offset shadows that follow their outlines.",
      caption: "Soft shadows that follow each shape's outline, built from an SVG filter."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-inner-shadow",
    title: "SVG Inner Shadow Filter for Any Shape",
    excerpt: "Add an inset shadow to any SVG shape with a filter.",
    description: "Add an inner shadow or inner glow to any SVG shape: invert a blurred silhouette with feComposite out, colour it, and merge it over the fill.",
    category: ["SVG"],
    tags: ["svg", "svg-filters", "inner-shadow", "feComposite", "feGaussianBlur", "graphics"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-inner-shadow/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a rounded rectangle and a circle that look pressed into the surface, with dark shadows along their inner top-left edges.",
      caption: "Shapes pressed into the page with an SVG inner shadow."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-gooey-effect",
    title: "Gooey Blob Effect with SVG Filters and CSS",
    excerpt: "Make SVG shapes melt into each other like liquid.",
    description: "Create the gooey blob effect with feGaussianBlur and an alpha-contrast feColorMatrix, animate it with CSS, and fix clipping and non-merging shapes.",
    link: {
      label: "Read the full post: Animating SVG: A Guide to CSS Transitions and Keyframes",
      href: "/post/animations/svg-transitions-and-keyframes"
    },
    category: ["SVG"],
    tags: ["svg", "svg-filters", "gooey-effect", "feColorMatrix", "feGaussianBlur", "svg-animation", "css-animation", "keyframes", "prefers-reduced-motion"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-gooey-effect/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of glowing liquid blobs stretching apart, joined by thin gooey bridges.",
      caption: "Blobs that merge and stretch apart like liquid."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-text-wrap-javascript",
    title: "Wrap SVG Text with JavaScript",
    excerpt: "Wrap SVG text into lines by measuring words with JavaScript.",
    description: "SVG text doesn't wrap. Split it into tspan lines with getComputedTextLength(), safely re-runnable via data-text, or use foreignObject instead.",
    category: ["SVG"],
    tags: ["svg", "svg-text", "javascript", "getComputedTextLength", "tspan", "foreignObject", "data-attributes", "dom", "typography", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-text-wrap-javascript/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a long line of glowing text being broken into neat, stacked lines inside a dashed box.",
      caption: "A single line of SVG text split into wrapped lines."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-gradient-not-showing-on-line",
    title: "Fix: SVG Gradient Not Showing on a Straight Line",
    excerpt: "Fix an SVG gradient that vanishes on a horizontal or vertical line.",
    description: "Why an SVG gradient stroke vanishes on a horizontal or vertical line, and how gradientUnits=\"userSpaceOnUse\" with user coordinates fixes it.",
    category: ["SVG"],
    tags: ["svg", "gradients", "svg-gradient", "gradientUnits", "objectBoundingBox", "debugging", "coordinate-system"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-gradient-not-showing-on-line/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of an empty dashed outline where a line should be, above a glowing horizontal line with an indigo to amber gradient.",
      caption: "A missing gradient line next to its fixed, glowing counterpart."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-text-on-circle",
    title: "SVG Text on a Circle with `<textPath>`",
    excerpt: "Put text around a circular badge with SVG textPath.",
    description: "Curve text around a circle with SVG <textPath>: upright top and bottom arcs, centring with startOffset, full rings with textLength, and accessible labels.",
    category: ["SVG"],
    tags: ["svg", "svg-text", "text-path", "startOffset", "textLength", "typography", "text-effects", "svg-animation", "prefers-reduced-motion", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-text-on-circle/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a circular badge with glowing text arching over the top and curving under the bottom between two rings.",
      caption: "A circular badge with text following its top and bottom arcs."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-responsive-clip-path-html",
    title: "Responsive SVG Clip Path for HTML Elements",
    excerpt: "Clip any HTML element to a blob that scales with it.",
    description: "Clip images and HTML elements to a curved SVG shape that scales with them, using objectBoundingBox clipPathUnits and clip-path: url(#id).",
    link: {
      label: "Read the full post: SVG Essentials: Mastering the Path Element",
      href: "/post/svg/svg-essentials-mastering-the-path-element"
    },
    category: ["SVG"],
    tags: ["svg", "css", "clip-path", "clipPathUnits", "objectBoundingBox", "responsive", "aspect-ratio", "object-fit", "shape-function", "pointer-events"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-responsive-clip-path-html/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a glowing gradient blob shape clipping a square image, repeated at three different sizes.",
      caption: "One SVG blob clip path scaling with HTML elements of different sizes."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-diagonal-stripes-pattern",
    title: "Seamless Diagonal Stripes with an SVG Pattern",
    excerpt: "Draw seamless diagonal stripes and crosshatch with an SVG pattern.",
    description: "Seamless diagonal stripes with an SVG pattern and patternTransform, plus a crosshatch variant, currentColor recolouring and a CSS data URI background.",
    category: ["SVG"],
    tags: ["svg", "css", "svg-pattern", "patternTransform", "patternUnits", "currentColor", "data-uri", "background", "vector-graphics"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-diagonal-stripes-pattern/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of a rounded rectangle filled with glowing diagonal stripes beside a matching crosshatch tile.",
      caption: "Glowing diagonal stripes and a crosshatch, tiled with an SVG pattern."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-dot-grid-pattern",
    title: "SVG Dot Grid Background Pattern",
    excerpt: "Build a dot grid background from one circle in an SVG pattern.",
    description: "Build a dot grid background with an SVG pattern: adjustable spacing and dot size, a soft mask fade at the edges, and a CSS background version.",
    category: ["SVG"],
    tags: ["svg", "css", "svg-pattern", "patternUnits", "svg-mask", "data-uri", "background", "currentColor", "ui-design"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-dot-grid-pattern/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of an evenly spaced grid of glowing dots that fades out towards the edges.",
      caption: "A glowing dot grid fading softly at its edges."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  }
];

// Array-order based rather than git-dated so the lookups stay client-safe — git can't be read in the browser.
export const { getBySlug: getSnippetBySlug, getNavigation: getSnippetNavigation } = createContentLookup(snippets);
