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
      { date: "2026-11-08", change: "Added cross-reference to snippet '`git sync`: Update Your Branch from `main` in One Command'" },
      { date: "2026-11-08", change: "Added cross-reference to snippet 'Git Aliases Worth Adding to Your `~/.gitconfig`'" },
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
      { date: "2026-11-09", change: "Added cross-reference to snippet 'SVG Circular Progress Ring with CSS Variables'" },
      { date: "2026-11-09", change: "Added cross-reference to snippet 'SVG Marching Ants Border for Drop Zones and Selections'" },
      { date: "2026-11-09", change: "Added cross-reference to snippet 'SVG Three-Dot Loading Indicator with Staggered Delays'" },
      { date: "2026-11-07", change: "Initial publication." }
    ]
  },
  {
    slug: "git-aliases",
    title: "Git Aliases Worth Adding to Your `~/.gitconfig`",
    excerpt: "Tested Git aliases for history, undo, fixups, and search.",
    description: "Tested Git aliases for your `~/.gitconfig`: compact logs, safe undo, one-step fixups, WIP parking, and safe force-pushes.",
    category: ["Git"],
    tags: ["git", "git-commands", "gitconfig", "rebase", "force-with-lease", "cli"],
    link: {
      label: "Read the full post: Advanced Git: Rebasing, Internals, and Real-World Workflows",
      href: "/post/git/advanced-git-techniques-and-workflows"
    },
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/git-aliases/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Terminal-styled illustration of a ~/.gitconfig alias block with short Git commands expanding into their full versions.",
      caption: "Aliases grouped by task, beside a graph log and a one-step fixup."
    },
    changelog: [
      { date: "2026-11-08", change: "Added cross-reference to snippet '`git sync`: Update Your Branch from `main` in One Command'" },
      { date: "2026-11-08", change: "Added cross-reference to snippet '`git prune-branches`: Delete Merged and Squash-Merged Branches'" },
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "git-prune-branches",
    title: "`git prune-branches`: Delete Merged and Squash-Merged Branches",
    excerpt: "Delete merged, squash-merged and rebased local Git branches safely.",
    description: "A git prune-branches command that deletes local branches merged into main — including GitHub squash merges git branch --merged misses — with a restore command for each.",
    category: ["Git"],
    tags: ["git", "git-commands", "branching", "merging", "squash-merge", "bash", "cli"],
    link: {
      label: "Read the full post: Advanced Git: Rebasing, Internals, and Real-World Workflows",
      href: "/post/git/advanced-git-techniques-and-workflows"
    },
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/git-prune-branches/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Commit graph for git prune-branches, showing merged, rebase-merged and squash-merged branches being deleted from main.",
      caption: "Merged, rebase-merged and squash-merged branches pruned, with main kept."
    },
    changelog: [
      { date: "2026-11-08", change: "Added cross-reference to snippet '`git sync`: Update Your Branch from `main` in One Command'" },
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "git-sync",
    title: "`git sync`: Update Your Branch from `main` in One Command",
    excerpt: "Fetch, fast-forward main, and rebase your branch onto it.",
    description: "A `git sync` command that fetches, fast-forwards `main` without a checkout, and rebases or merges your branch onto it — with autostash and undo.",
    category: ["Git"],
    tags: ["git", "git-commands", "rebase", "merging", "bash", "cli"],
    link: {
      label: "Read the full post: Advanced Git: Rebasing, Internals, and Real-World Workflows",
      href: "/post/git/advanced-git-techniques-and-workflows"
    },
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/git-sync/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover graphic for the git sync command, showing a feature branch moving from behind origin/main to rebased on top of it in three steps.",
      caption: "A feature branch behind origin/main, before and after one git sync."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-three-dot-loader",
    title: "SVG Three-Dot Loading Indicator with Staggered Delays",
    excerpt: "Build a three-dot SVG loader with staggered delays.",
    description: "Build an accessible three-dot SVG loading indicator: three circles, one keyframes rule and negative animation-delay values, with reduced-motion support.",
    link: {
      label: "Read the full post: Animating SVG: A Guide to CSS Transitions and Keyframes",
      href: "/post/animations/svg-transitions-and-keyframes"
    },
    category: ["SVG"],
    tags: ["svg", "css", "loading-spinner", "svg-animation", "css-animation", "keyframes", "animation-delay", "staggered-animation", "transform-box", "transform-origin", "prefers-reduced-motion", "accessibility", "microinteractions"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-three-dot-loader/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover showing three glossy dots of different sizes labeled with delays of -0.32s, -0.16s and 0s.",
      caption: "Three dots shrinking left to right, labelled with delays of -0.32s, -0.16s and 0s."
    },
    changelog: [
      { date: "2026-11-10", change: "Updated browser support note for `sibling-index()`" },
      { date: "2026-11-09", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-marching-ants-border",
    title: "SVG Marching Ants Border for Drop Zones and Selections",
    excerpt: "Animate a marching dashed SVG border around any box.",
    description: "Build a marching ants border with an SVG rect and stroke-dashoffset: a seamless loop, a crisp overlay for any box size, and reduced-motion support.",
    link: {
      label: "Read the full post: Animating SVG: A Guide to CSS Transitions and Keyframes",
      href: "/post/animations/svg-transitions-and-keyframes"
    },
    category: ["SVG"],
    tags: ["svg", "css", "svg-animation", "css-animation", "stroke-dasharray", "stroke-dashoffset", "pathLength", "keyframes", "borders", "ui-components", "microinteractions", "prefers-reduced-motion", "accessibility"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-marching-ants-border/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover showing a dashed gradient border with clockwise arrows above a diagram of one 14-unit dash-and-gap period.",
      caption: "Dashes marching clockwise around a drop zone, looping every 14-unit period."
    },
    changelog: [
      { date: "2026-11-09", change: "Initial publication." }
    ]
  },
  {
    slug: "svg-circular-progress-ring",
    title: "SVG Circular Progress Ring with CSS Variables",
    excerpt: "Build an SVG progress ring from one CSS variable.",
    description: "Build an accessible SVG circular progress ring: pathLength and a --progress variable set the arc, with a gradient variant and smooth value transitions.",
    link: {
      label: "Read the full post: Animating SVG: A Guide to CSS Transitions and Keyframes",
      href: "/post/animations/svg-transitions-and-keyframes"
    },
    category: ["SVG"],
    tags: ["svg", "css", "progress-indicator", "stroke-dasharray", "pathLength", "css-custom-properties", "at-property", "css-transitions", "svg-animation", "javascript", "accessibility", "prefers-reduced-motion"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/svg-circular-progress-ring/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover showing a gradient progress arc floating above a faint track circle, with three numbered steps: track, value and rotate.",
      caption: "A gradient arc set by --progress: 75, lifted above its track, beside the three build steps."
    },
    changelog: [
      { date: "2026-11-09", change: "Initial publication." }
    ]
  },
  {
    slug: "atomics-pause-spin-wait",
    title: "JavaScript Spin-Wait Lock with `Atomics.pause()`",
    excerpt: "Spin briefly with Atomics.pause(), then block with Atomics.wait().",
    description: "A copy-paste JavaScript spin-then-sleep lock using ES2027 Atomics.pause() and Atomics.wait() over a SharedArrayBuffer, with Node.js and browser worker examples.",
    category: ["JavaScript"],
    tags: ["javascript", "atomics", "sharedarraybuffer", "web-workers", "concurrency", "es2027", "nodejs"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/atomics-pause-spin-wait/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Timeline of a JavaScript spin-wait lock: worker B spins with Atomics.pause() while worker A holds the lock, sleeps with Atomics.wait(), then wakes on notify() after unlock() and takes the lock.",
      caption: "Worker B spins, sleeps and wakes while worker A holds the lock."
    },
    changelog: [
      { date: "2026-11-14", change: "Initial publication." }
    ]
  }
];

// Array-order based rather than git-dated so the lookups stay client-safe — git can't be read in the browser.
export const { getBySlug: getSnippetBySlug, getNavigation: getSnippetNavigation } = createContentLookup(snippets);
