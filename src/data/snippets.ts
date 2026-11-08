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
    slug: "iterator-take-first-n-matches",
    title: "Lazy First N Matches with `Iterator.prototype.take()`",
    excerpt: "Get the first N matches and stop reading.",
    description: "Return the first N matches from any iterable with Iterator.from(), filter() and take(), stopping as soon as it has enough, even on infinite sequences.",
    link: {
      label: "Read the full tutorial: Iterator Helpers: Lazy Pipelines over Any Iterator",
      href: "/tutorial/iterator-helpers-lazy-pipelines"
    },
    category: ["JavaScript"],
    tags: ["javascript", "iterator-helpers", "lazy-evaluation", "generators", "es2025", "polyfills"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/iterator-take-first-n-matches/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A long list scanned from the top, with filter and take stopping after the third match while the rest of the list is left unread.",
      caption: "filter() and take() stop at the third match instead of scanning the whole list."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "regexp-escape-user-input",
    title: "Escape User Input for a Regex with `RegExp.escape()`",
    excerpt: "Escape user input for new RegExp(), with a fallback.",
    description: "Escape user input before building a regular expression with RegExp.escape(), plus a one-line fallback for older engines and a safe search highlighter.",
    link: {
      label: "Read the full tutorial: Safer Dynamic Regex: RegExp.escape(), Modifiers and Duplicate Named Groups",
      href: "/tutorial/regexp-escape-and-modifiers"
    },
    category: ["JavaScript"],
    tags: ["javascript", "regex", "es2025", "secure-coding", "polyfills", "feature-detection"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/regexp-escape-user-input/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A search box containing c++ and $5.00, escaped by RegExp.escape() and highlighted as literal matches in a paragraph of text.",
      caption: "Search terms with regex syntax escaped and highlighted literally."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "set-dedupe-and-compare",
    title: "Dedupe Two Lists, Then Compare Them with Set Methods",
    excerpt: "Dedupe two lists and diff them with native Set methods.",
    description: "Remove duplicates with new Set(), then compare two lists with union, intersection, difference, symmetricDifference and the subset checks: tags, permissions and IDs.",
    link: {
      label: "Read the full tutorial: Native JavaScript Set Methods: union, intersection and difference",
      href: "/tutorial/set-methods-union-intersection"
    },
    category: ["JavaScript"],
    tags: ["javascript", "set-methods", "data-structures", "es2025", "deduplication"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/set-dedupe-and-compare/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Two lists of tags with duplicates collapsed into two Sets, then compared to show added, removed and kept values.",
      caption: "Old and new tag lists deduped, then diffed into added, removed and kept."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "getorinsertcomputed-lazy-cache",
    title: "A Lazy Cache with `getOrInsertComputed()`",
    excerpt: "Memoise results and dedupe requests in one line per cache.",
    description: "Build lazy caches with ES2026's getOrInsertComputed(): memoised functions, a WeakMap per-object cache, and a promise cache that dedupes requests and evicts failures.",
    link: {
      label: "Read the full tutorial: `Map.prototype.getOrInsert()` and `getOrInsertComputed()`: Upsert Without the Boilerplate",
      href: "/tutorial/map-upsert-getorinsert"
    },
    category: ["JavaScript"],
    tags: ["javascript", "map-upsert", "memoization", "caching", "weakmap", "promises", "es2026"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/getorinsertcomputed-lazy-cache/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Three requests for the same key sharing one cached promise, with a failed promise being evicted from the Map so the next call retries.",
      caption: "Concurrent calls sharing one cached promise, and a failure evicted for retry."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  }
];

// Array-order based rather than git-dated so the lookups stay client-safe — git can't be read in the browser.
export const { getBySlug: getSnippetBySlug, getNavigation: getSnippetNavigation } = createContentLookup(snippets);
