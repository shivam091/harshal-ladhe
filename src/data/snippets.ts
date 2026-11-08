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
    slug: "atomics-pause-spin-wait",
    title: "Friendlier Spin-Waits with `Atomics.pause()`",
    excerpt: "Spin briefly with a CPU hint, then sleep with Atomics.wait().",
    description: "Use ES2027's Atomics.pause() in a bounded spin-then-Atomics.wait() lock over a SharedArrayBuffer, with worker examples, main-thread rules and cross-origin isolation headers.",
    category: ["JavaScript"],
    tags: ["javascript", "atomics", "sharedarraybuffer", "web-workers", "concurrency", "es2027", "nodejs"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/atomics-pause-spin-wait/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Two worker threads sharing one lock in a SharedArrayBuffer: one spins briefly with Atomics.pause() before falling back to Atomics.wait() until the other releases it.",
      caption: "A bounded spin with Atomics.pause(), then a sleep with Atomics.wait()."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "uint8array-hex-encoding",
    title: "Bytes to Hex and Back with `Uint8Array.fromHex()` and `toHex()`",
    excerpt: "Convert bytes to hex strings and back without padStart loops.",
    description: "Encode bytes as hex with ES2026's Uint8Array toHex(), decode with fromHex() and setFromHex(), with SHA-256 digests, colours, error cases and a padStart fallback.",
    category: ["JavaScript"],
    tags: ["javascript", "es2026", "typed-arrays", "binary-data", "hex-encoding", "web-crypto", "polyfills"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/uint8array-hex-encoding/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A row of byte values converted by toHex() into the string 48656c6c6f and back into bytes with Uint8Array.fromHex().",
      caption: "Bytes to a hex string with toHex(), and back again with fromHex()."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "intl-durationformat",
    title: "Format Durations with `Intl.DurationFormat`",
    excerpt: "Localised durations in long, short, narrow or digital style.",
    description: "Format durations with Intl.DurationFormat: long, short, narrow and digital styles, locales, fractionalDigits, per-unit options, formatToParts and Temporal.Duration.",
    category: ["JavaScript"],
    tags: ["javascript", "intl", "i18n", "date-time", "temporal"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/intl-durationformat/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "One duration of 1 hour, 46 minutes and 40 seconds formatted four ways: long, short, narrow and digital as 1:46:40.",
      caption: "The same duration in long, short, narrow and digital styles."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  },
  {
    slug: "css-playing-paused-pseudo-classes",
    title: "`:playing` and `:paused`: Style Media by Playback State",
    excerpt: "Style audio and video players from their playback state.",
    description: "Style audio and video by playback state with CSS :playing, :paused, :buffering and :muted, plus :has() patterns and a JavaScript fallback.",
    category: ["CSS"],
    tags: ["css", "media-pseudo-classes", "pseudo-classes", "has-selector", "progressive-enhancement", "browser-support", "css-2027"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/css-playing-paused-pseudo-classes/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "A custom video player showing a large play icon while paused and faded controls while playing, beside a playlist whose currently playing track is highlighted by :has(audio:playing).",
      caption: "A video player and playlist styled from :playing and :paused, with no state classes."
    },
    changelog: [
      { date: "2026-11-08", change: "Initial publication." }
    ]
  }
];

// Array-order based rather than git-dated so the lookups stay client-safe — git can't be read in the browser.
export const { getBySlug: getSnippetBySlug, getNavigation: getSnippetNavigation } = createContentLookup(snippets);
