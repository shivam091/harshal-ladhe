import type { Snippet, SnippetNavigation } from "@/interfaces/snippet";

/*
  Registry of every snippet. Each entry has a matching content file at
  app/(site)/(internal)/snippet/<slug>/page.mdx. This drives the /snippets list,
  the detail chrome, and prev/next nav.

  Note: publish / last-modified dates come from git history at build time
  (lib/snippets.ts for the list; the remark-snippet-meta plugin for the detail).
  Prev/next nav follows this array's order (declare newest-first).
*/
export const snippets: Snippet[] = [
  {
    slug: "use-sync-external-store",
    title: "Safely Subscribing to Outside State with useSyncExternalStore",
    excerpt: "The tear-safe way to read a value React doesn't own, under concurrent rendering.",
    description: "useSyncExternalStore subscribes a component to external state (a browser API, a vanilla store) via a subscribe/getSnapshot contract, guaranteed never to tear across components under concurrent rendering the way a plain useEffect plus setState subscription can.",
    category: ["React"],
    tags: ["react", "use-sync-external-store", "concurrent-rendering", "external-store", "hooks"],
    image: {
      path: "/assets/img/goodies/snippets/use-sync-external-store/cover.png",
      width: 1536,
      height: 1024,
      alt: "Two independent UI panels both reading the same external counter store via useSyncExternalStore, staying perfectly in sync as the store updates from outside React."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "use-deferred-value-vs-transition",
    title: "useDeferredValue vs. useTransition",
    excerpt: "Wrap the update when you own the setter, defer the value when you don't.",
    description: "useDeferredValue hands back a version of a value that's allowed to lag behind during expensive rendering, solving the same urgent-vs-expensive-update problem useTransition does but from the value side rather than the state-update side — useful whenever the expensive computation's input arrives as a prop or a value outside your own setState call.",
    category: ["React"],
    tags: ["react", "use-deferred-value", "use-transition", "concurrent-rendering", "performance"],
    image: {
      path: "/assets/img/goodies/snippets/use-deferred-value-vs-transition/cover.png",
      width: 1536,
      height: 1024,
      alt: "A search input staying responsive while a large filtered list below it, driven by a deferred value, visibly lags and dims a beat behind before catching up."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "discriminated-unions-exhaustiveness-never",
    title: "Discriminated Unions and Exhaustiveness Checking with never",
    excerpt: "A forgotten case in a switch becomes a compile error, not a silent runtime gap.",
    description: "A discriminated union models a value's distinct shapes as separate object types joined by a shared literal field, letting TypeScript narrow between them — and a never-typed exhaustiveness check in a switch's default case proves every member was actually handled, failing the build the moment a new case is added and forgotten.",
    category: ["TypeScript"],
    tags: ["typescript", "discriminated-unions", "exhaustiveness", "never", "type-narrowing"],
    image: {
      path: "/assets/img/goodies/snippets/discriminated-unions-exhaustiveness-never/cover.png",
      width: 1536,
      height: 1024,
      alt: "A switch statement over a discriminated union's status field, with a never-typed exhaustiveness check in its default case."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "as-const-literal-types",
    title: "Locking In Literal Types with as const",
    excerpt: "Derive a union type from a real array instead of maintaining two lists that can drift apart.",
    description: "as const turns off TypeScript's default literal-widening, keeping a string/array/object exactly as written — readonly and as narrow as possible — enabling the (typeof arr)[number] pattern that derives a union type from one real source-of-truth array instead of a hand-maintained type that can fall out of sync with it.",
    category: ["TypeScript"],
    tags: ["typescript", "as-const", "literal-types", "type-inference", "readonly"],
    image: {
      path: "/assets/img/goodies/snippets/as-const-literal-types/cover.png",
      width: 1536,
      height: 1024,
      alt: "An array of theme names marked as const, with a Theme union type derived directly from it via (typeof THEMES)[number]."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "broadcast-channel-cross-tab",
    title: "Cross-Tab Messaging with BroadcastChannel",
    excerpt: "A direct, same-origin channel between tabs — no server, no storage event side-channel.",
    description: "BroadcastChannel opens a direct, same-origin messaging channel between tabs, windows, and workers — postMessage() on it delivers to every other open instance on that channel name instantly, replacing a localStorage 'storage' event side-channel or a server round-trip for same-origin cross-tab coordination.",
    category: ["JavaScript"],
    tags: ["javascript", "broadcastchannel", "cross-tab", "web-apis", "messaging"],
    image: {
      path: "/assets/img/goodies/snippets/broadcast-channel-cross-tab/cover.png",
      width: 1536,
      height: 1024,
      alt: "Two browser tab panels side by side, a message sent from one instantly appearing in the other's log via a shared BroadcastChannel."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "intl-segmenter-grapheme-splitting",
    title: "Splitting Text Correctly with Intl.Segmenter",
    excerpt: "A naive [...text] splits family/flag emoji into broken fragments — this doesn't.",
    description: "Intl.Segmenter splits text by grapheme cluster, word, or sentence — matching what a reader actually perceives as one character or word — replacing a naive .split(\"\")/[...text] that breaks apart multi-code-point emoji and doesn't work at all for languages without spaces between words.",
    category: ["JavaScript"],
    tags: ["javascript", "intl", "unicode", "strings", "internationalization", "esnext"],
    image: {
      path: "/assets/img/goodies/snippets/intl-segmenter-grapheme-splitting/cover.png",
      width: 1536,
      height: 1024,
      alt: "The same string split two ways side by side — a naive code-point split breaking a family emoji into fragments, and Intl.Segmenter keeping it as one grapheme cluster."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "proxy-reflect-metaprogramming",
    title: "Intercepting Property Access with Proxy and Reflect",
    excerpt: "obj.value = 5 still looks like a plain assignment — a trap function decides what it actually does.",
    description: "Proxy intercepts ordinary property access itself — get/set traps run before a read or write actually happens — while Reflect gives each trap a clean way to invoke the default behavior it's intercepting, enabling validation, logging, and reactivity without converting every property into a getter/setter pair.",
    category: ["JavaScript"],
    tags: ["javascript", "proxy", "reflect", "metaprogramming", "validation", "reactivity"],
    image: {
      path: "/assets/img/goodies/snippets/proxy-reflect-metaprogramming/cover.png",
      width: 1536,
      height: 1024,
      alt: "A settings object's volume property being read and written through a Proxy, with a log showing each get/set trap firing and an out-of-range write being rejected."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "abortsignal-timeout",
    title: "Built-In Fetch Timeouts with AbortSignal.timeout()",
    excerpt: "Replaces the controller + setTimeout + clearTimeout trio with one expression.",
    description: "AbortSignal.timeout(ms) returns a signal that aborts itself after the given delay, with cleanup already handled internally — a drop-in replacement for the manual AbortController + setTimeout + clearTimeout pattern every timed fetch() call has needed until now.",
    category: ["JavaScript"],
    tags: ["javascript", "abortsignal", "fetch", "timeout", "async-await", "esnext"],
    image: {
      path: "/assets/img/goodies/snippets/abortsignal-timeout/cover.png",
      width: 1536,
      height: 1024,
      alt: "A request given a fixed time budget via AbortSignal.timeout(), completing when fast enough and timing out automatically when it isn't."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "accessibility-media-features",
    title: "prefers-reduced-motion, prefers-contrast, and forced-colors",
    excerpt: "prefers-color-scheme isn't the only accessibility preference CSS can read directly.",
    description: "prefers-reduced-motion, prefers-contrast, and forced-colors let CSS react to real OS-level accessibility preferences the same way prefers-color-scheme does — gating large animation, offering a genuine higher-contrast mode, and auditing how a page behaves once the OS remaps its colors under a forced-colors mode like Windows High Contrast Mode.",
    category: ["CSS"],
    tags: ["css", "accessibility", "prefers-reduced-motion", "prefers-contrast", "forced-colors", "a11y"],
    image: {
      path: "/assets/img/goodies/snippets/accessibility-media-features/cover.png",
      width: 1536,
      height: 1024,
      alt: "Three UI panels reacting to real OS accessibility preferences: a spinner stopping under prefers-reduced-motion, a card gaining a thicker border under prefers-contrast, and a button repainted with flat system colors under forced-colors."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "container-style-queries",
    title: "Reacting to an Ancestor's Custom Property with @container style()",
    excerpt: "One custom property on a shared ancestor, and every descendant's style query reacts.",
    description: "@container style() extends container queries from checking a container's SIZE to checking a custom property's current VALUE on it, letting deeply nested descendants react to a theme/variant token set once on a shared ancestor instead of threading a variant class through every element that cares.",
    category: ["CSS"],
    tags: ["css", "container-queries", "style-queries", "design-tokens", "custom-properties", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/container-style-queries/cover.png",
      width: 1536,
      height: 1024,
      alt: "A product card whose badge, border color, and visibility all change based on a single --variant custom property set on an ancestor, queried via @container style()."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "content-visibility-render-performance",
    title: "Skipping Off-Screen Rendering with content-visibility",
    excerpt: "One CSS property gives long lists a lightweight version of what virtualization libraries do.",
    description: "content-visibility: auto skips layout, style, and paint work for an element entirely while it's off-screen, substituting a contain-intrinsic-size placeholder in the meantime — a native, dependency-free way to cut rendering cost on long lists and card grids without unmounting anything from the DOM.",
    category: ["CSS"],
    tags: ["css", "content-visibility", "performance", "rendering", "core-web-vitals", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/content-visibility-render-performance/cover.png",
      width: 1536,
      height: 1024,
      alt: "A long scrolling list of rows with off-screen rows shown as lightweight placeholders via content-visibility: auto, and a timer comparing forced-layout cost with it on versus off."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "dialog-element-native-modals",
    title: "Real Modals with the <dialog> Element",
    excerpt: "showModal() gives you focus trapping, a backdrop, and return-focus — for free.",
    description: "The <dialog> element's showModal() method natively handles what a hand-rolled modal usually gets wrong — focus trapping, a dimmed ::backdrop, and returning focus on close — while show() opens the same element as a lightweight, non-blocking panel instead.",
    category: ["HTML"],
    tags: ["html", "dialog", "modals", "accessibility", "forms", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/dialog-element-native-modals/cover.png",
      width: 1536,
      height: 1024,
      alt: "A confirmation dialog opened with showModal(), dimming the page behind it, next to the same dialog opened with show() while the rest of the page stays interactive."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "popover-api-native-overlays",
    title: "Zero-JS Dropdowns and Overlays with the Popover API",
    excerpt: "One HTML attribute replaces the click-outside/Escape/z-index pile every overlay needed.",
    description: "The popover attribute promotes an element to the browser's top layer and wires up outside-click/Escape dismissal natively, replacing the hand-rolled listener + z-index management every dropdown, tooltip, or flyout panel has needed until now.",
    category: ["CSS"],
    tags: ["css", "html", "popover", "overlays", "accessibility", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/popover-api-native-overlays/cover.png",
      width: 1536,
      height: 1024,
      alt: "A dropdown menu opened via the popover attribute, floating above the page in the top layer with a dimmed backdrop behind it."
    },
    changelog: [{ date: "2026-09-09", change: "Initial publication." }]
  },
  {
    slug: "import-attributes-json",
    title: "Importing JSON as a Module with Import Attributes",
    excerpt: "Standard `with { type: \"json\" }` syntax, replacing bundler-specific JSON import magic.",
    description: "Import attributes make importing a JSON file standard ES module syntax — with { type: \"json\" } tells the loader explicitly how to interpret the file, portable across bundlers and runtimes instead of relying on bundler-specific resolution.",
    category: ["JavaScript"],
    tags: ["javascript", "es-modules", "import-attributes", "json", "esnext", "modules"],
    image: {
      path: "/assets/img/goodies/snippets/import-attributes-json/cover.png",
      width: 1536,
      height: 1024,
      alt: "A config.json file imported directly as an ES module using the with type json import attribute, its parsed values rendered on the page."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "uint8array-base64-native",
    title: "Native Base64 Encoding with Uint8Array",
    excerpt: "Uint8Array.fromBase64/toBase64 fix btoa()'s original sin: it never understood real bytes.",
    description: "btoa()/atob() only accept Latin1 'binary strings' and throw on Unicode text. Uint8Array.prototype.toBase64()/fromBase64() operate on real bytes, working correctly for any text via TextEncoder/TextDecoder, no unescape/encodeURIComponent hack required.",
    category: ["JavaScript"],
    tags: ["javascript", "base64", "uint8array", "text-encoder", "binary-data", "esnext"],
    image: {
      path: "/assets/img/goodies/snippets/uint8array-base64-native/cover.png",
      width: 1536,
      height: 1024,
      alt: "Side-by-side comparison of btoa() throwing on unicode text versus Uint8Array.prototype.toBase64() encoding it correctly."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "immutable-array-methods",
    title: "toSorted, toReversed, toSpliced, and with() — Immutable Array Updates",
    excerpt: "Every mutating array method now has a non-mutating twin that returns a new array.",
    description: "toSorted(), toReversed(), toSpliced(), and with() are non-mutating counterparts to sort(), reverse(), splice(), and index assignment — returning a new array instead of mutating in place, replacing the spread-into-a-copy-first pattern immutable state (React, Redux) has always needed.",
    category: ["JavaScript"],
    tags: ["javascript", "arrays", "immutability", "react", "esnext", "state-management"],
    image: {
      path: "/assets/img/goodies/snippets/immutable-array-methods/cover.png",
      width: 1536,
      height: 1024,
      alt: "An original array left unchanged after several non-mutating method calls, each producing a new array shown side by side."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "set-methods-union-intersection",
    title: "Native Set union, intersection, and difference",
    excerpt: "Set algebra methods replace the spread-filter-rebuild pattern for comparing two Sets.",
    description: "Set.prototype.union/intersection/difference/symmetricDifference/isSubsetOf/isSupersetOf/isDisjointFrom compute standard set operations directly, replacing the array-spread-and-filter pattern that's been the only way to compare two Sets until now.",
    category: ["JavaScript"],
    tags: ["javascript", "set", "data-structures", "esnext", "algorithms"],
    image: {
      path: "/assets/img/goodies/snippets/set-methods-union-intersection/cover.png",
      width: 1536,
      height: 1024,
      alt: "Two role permission sets compared with native Set methods — union, intersection, and difference results shown for each."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "promise-try-uniform-error-handling",
    title: "Promise.try() for Uniform Sync/Async Error Handling",
    excerpt: "Catches a synchronous throw and an async rejection in the exact same .catch().",
    description: "A function that's usually async can still throw synchronously before returning a promise, which plain .then()/.catch() chaining won't catch. Promise.try() wraps the call so both a synchronous throw and an asynchronous rejection land in the same .catch(), without an async IIFE wrapper.",
    category: ["JavaScript"],
    tags: ["javascript", "promises", "error-handling", "async-await", "esnext"],
    image: {
      path: "/assets/img/goodies/snippets/promise-try-uniform-error-handling/cover.png",
      width: 1536,
      height: 1024,
      alt: "A validate() function that throws synchronously in one case and returns a rejected promise in another, both caught by the same Promise.try().catch() chain."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "array-fromasync-async-iterables",
    title: "Array.fromAsync() for Async Iterables",
    excerpt: "Collects an async generator's yielded values into a real array in one call.",
    description: "Array.fromAsync() awaits an entire async iterable — a generator, a paginated fetch loop, a ReadableStream — and collects it into a real array, replacing the manual for-await-of loop pushing into an accumulator.",
    category: ["JavaScript"],
    tags: ["javascript", "async-await", "generators", "iterables", "esnext", "arrays"],
    image: {
      path: "/assets/img/goodies/snippets/array-fromasync-async-iterables/cover.png",
      width: 1536,
      height: 1024,
      alt: "An async generator yielding paginated results one at a time, collected into a single array by Array.fromAsync()."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "interpolate-size-auto-animations",
    title: "Animating Height to auto with interpolate-size",
    excerpt: "The one CSS line that makes height:auto genuinely animatable — no JS measuring.",
    description: "interpolate-size: allow-keywords makes height/width transitions to and from auto (and min-content/max-content/fit-content) directly animatable, replacing the grid-template-rows 0fr-to-1fr trick and scrollHeight-measuring JS every accordion has needed until now.",
    category: ["CSS"],
    tags: ["css", "animations", "transitions", "accordion", "layout", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/interpolate-size-auto-animations/cover.png",
      width: 1536,
      height: 1024,
      alt: "An accordion panel smoothly animating its height between 0 and its natural auto content height."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "shape-function-clip-path",
    title: "Path-Based clip-path with the shape() Function",
    excerpt: "SVG-style path commands as real CSS syntax — calc() and custom properties work inside.",
    description: "The shape() function brings SVG-style path drawing commands (line to, curve to, arc to) into real CSS function syntax, letting calc() and custom properties drive individual coordinates — something path()'s static SVG path-data string can never do.",
    category: ["CSS"],
    tags: ["css", "clip-path", "shape-function", "svg", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/shape-function-clip-path/cover.png",
      width: 1536,
      height: 1024,
      alt: "A speech bubble shape with a movable tail, its clip-path drawn using the shape() function with a calc()-driven coordinate."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "native-css-carousel-scroll-markers",
    title: "CSS-Only Carousel Pagination with ::scroll-marker",
    excerpt: "Dots and prev/next arrows generated from a scroll-snap container — zero JS.",
    description: "::scroll-marker and ::scroll-button() generate a carousel's pagination dots and navigation arrows directly from a scroll-snap container, with the active dot tracked automatically via :target-current — replacing the JS a carousel library exists purely to provide.",
    category: ["CSS"],
    tags: ["css", "carousel", "scroll-snap", "pagination", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/native-css-carousel-scroll-markers/cover.png",
      width: 1536,
      height: 1024,
      alt: "A horizontally scrolling carousel with pagination dots and circular prev/next arrows, all generated by CSS ::scroll-marker and ::scroll-button()."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "sibling-index-count-functions",
    title: "CSS-Only Staggered Animations with sibling-index()",
    excerpt: "An element's own position among its siblings, usable directly inside calc().",
    description: "sibling-index() and sibling-count() give an element its own 1-based position (and total sibling count) directly inside calc(), replacing the JS-loop-sets-a---i-custom-property pattern that's been the only way to drive staggered, index-dependent CSS animations.",
    category: ["CSS"],
    tags: ["css", "animations", "sibling-index", "stagger", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/sibling-index-count-functions/cover.png",
      width: 1536,
      height: 1024,
      alt: "A list of items fading in with a staggered delay computed purely in CSS via sibling-index()."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "typed-custom-properties-at-property",
    title: "Animatable, Type-Checked Custom Properties with @property",
    excerpt: "Registers a custom property's real type, turning it from an opaque string into an animatable value.",
    description: "@property registers a custom property with a real syntax type (<angle>, <color>, <length>, and more), making it genuinely animatable — a plain custom property is an opaque string to CSS and can't be smoothly transitioned or animated at all.",
    category: ["CSS"],
    tags: ["css", "custom-properties", "css-variables", "animations", "houdini", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/typed-custom-properties-at-property/cover.png",
      width: 1536,
      height: 1024,
      alt: "Two identical conic-gradient rings — one with a typed, registered custom property smoothly animating, the other with a plain custom property snapping instantly."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "field-sizing-content-textarea",
    title: "Auto-Growing Textareas with field-sizing: content",
    excerpt: "The scrollHeight-measuring JS every auto-grow textarea has shipped, replaced by one CSS line.",
    description: "field-sizing: content sizes a textarea (or input) to its own content, growing and shrinking as the user types — replacing the scrollHeight-measuring input listener that's been the only way to build an auto-growing text field until now.",
    category: ["CSS"],
    tags: ["css", "forms", "textarea", "field-sizing", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/field-sizing-content-textarea/cover.png",
      width: 1536,
      height: 1024,
      alt: "Two textareas side by side — one growing automatically with typed content via field-sizing: content, the other a plain fixed-size textarea scrolling internally."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "native-css-masonry-layout",
    title: "Native CSS Masonry with grid-template-rows: masonry",
    excerpt: "Pinterest-style packed columns, one Grid property, no JS measuring pass.",
    description: "grid-template-rows: masonry packs variable-height grid items tightly into whichever column is currently shortest, in source order — replacing a JS masonry library's measure-then-reposition pass or a column-count hack that breaks reading order.",
    category: ["CSS"],
    tags: ["css", "grid", "masonry", "layout", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/native-css-masonry-layout/cover.png",
      width: 1536,
      height: 1024,
      alt: "A gallery of variable-height tiles packed tightly into three columns using grid-template-rows: masonry, compared against a plain grid layout with gaps."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "css-custom-functions-at-function",
    title: "Reusable CSS Logic with @function",
    excerpt: "A real, live CSS function — reusable logic without a Sass mixin or a build step.",
    description: "@function defines a reusable, parameterized CSS function directly in a stylesheet — the same DRY win a Sass @function/mixin gives, minus the build step, and able to re-evaluate live against runtime custom property changes a compiled Sass value never could.",
    category: ["CSS"],
    tags: ["css", "at-function", "custom-properties", "sass", "css-2025", "design-systems"],
    image: {
      path: "/assets/img/goodies/snippets/css-custom-functions-at-function/cover.png",
      width: 1536,
      height: 1024,
      alt: "Multiple card components sharing one --space() @function-defined spacing scale, all updating together as a base-unit slider is dragged."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "css-if-conditional-values",
    title: "Conditional CSS Values with the if() Function",
    excerpt: "A single value, chosen by a media/supports/style condition, right inside a declaration.",
    description: "The if() function picks between several values inside one CSS declaration based on a media(), supports(), or style() condition — collapsing what used to require duplicating an entire rule under @media/@supports, or a JS class toggle, into one line. Limited support as of 2025.",
    category: ["CSS"],
    tags: ["css", "if-function", "conditional-css", "custom-properties", "css-2025"],
    image: {
      path: "/assets/img/goodies/snippets/css-if-conditional-values/cover.png",
      width: 1536,
      height: 1024,
      alt: "A priority badge changing color based on a custom property, driven entirely by an if(style(...)) conditional value in the stylesheet."
    },
    changelog: [{ date: "2026-09-02", change: "Initial publication." }]
  },
  {
    slug: "deep-freeze-objects",
    title: "Deep Freeze Objects in JavaScript",
    excerpt: "Recursively lock every object level for true immutability",
    description: "Lock objects and their children immutably — prevent accidental mutations and enforce deep immutability in strict mode.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "Object.freeze",
      "deep-freeze",
      "immutability",
      "secure-coding",
      "strict-mode"
    ],
    image: {
      path: "/assets/img/goodies/snippets/deep-freeze-objects/cover.png",
      width: 1536,
      height: 1024,
      alt: "Promotional digital graphic showing the phrase ‘JavaScript deepFreeze()’ with code-themed visuals and design elements aligned to the left."
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication" }
    ]
  },
  {
    slug: "encapsulation-closure",
    title: "Encapsulation with Closures",
    excerpt: "Encapsulate private variables using JavaScript closure patterns.",
    description:
      "Master the functional approach to data encapsulation in JavaScript by leveraging lexical scoping to create immutable private variables.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "closures",
      "encapsulation",
      "design-patterns",
      "functional-programming",
      "private-state",
      "clean-code",
      "factory-pattern"
    ],
    image: {
      path: "/assets/img/goodies/snippets/encapsulation-closure/cover.png",
      width: 1536,
      height: 1024,
      alt: "Cover image illustrating private state encapsulation in JavaScript using closures, symbolized by a shield protecting internal variables."
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication." }
    ]
  },
  {
    slug: "encapsulation-private-class-fields",
    title: "Encapsulation with Private Class Fields",
    excerpt: "Use native #private syntax to protect class properties in JavaScript.",
    description:
      "Implement native engine-level privacy in your OOP structures using ES2022+ private class fields and memory-efficient prototype methods.",
    category: ["JavaScript"],
    tags: ["javascript", "oop", "encapsulation", "classes", "clean-code"],
    image: {
      path: "/assets/img/goodies/snippets/encapsulation-private-class-fields/cover.png",
      width: 1536,
      height: 1024,
      alt: "Representation of a JavaScript Class with a locked vault icon for private fields."
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication." }
    ]
  },
  {
    slug: "holy-grail-layout",
    title: "The Holy Grail Layout (Grid Edition)",
    excerpt: "A responsive Holy Grail layout built with CSS Grid and grid-template-areas — no floats, no hacks.",
    description: "Build the classic Holy Grail layout using modern CSS Grid — a clean, responsive header, sidebars, main content, and footer without floats or layout hacks.",
    category: ["CSS"],
    tags: [
      "css",
      "css-grid",
      "layout",
      "responsive-design",
      "web-design",
      "holy-grail-layout"
    ],
    image: {
      path: "/assets/img/goodies/snippets/holy-grail-layout/cover.png",
      width: 1536,
      height: 1024,
      alt: "Diagram showing a webpage layout with header, footer, two sidebars, and a center content area."
    },
    changelog: [
      { date: "2026-07-27", change: "Initial publication" }
    ]
  },
  {
    slug: "async-retry-exponential-backoff",
    title: "Exponential Backoff Retry Utility",
    excerpt: "Retry async operations with exponential backoff and caps.",
    description: "A production-ready recursive utility to retry failed asynchronous operations with a configurable delay that doubles and caps to prevent infinite wait times.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "async-retry",
      "backoff",
      "promises",
      "error-handling",
      "resilience",
      "nodejs",
      "async-await",
      "api-calls",
      "clean-code"
    ],
    image: {
      path: "/assets/img/goodies/snippets/async-retry-exponential-backoff/cover.png",
      width: 1536,
      height: 1024,
      alt: "Illustration of exponential retry logic showing a circular retry loop, increasing delays, and a digital countdown timer."
    },
    changelog: [
      { date: "2026-08-05", change: "Initial publication with Options Object and Max Delay support." }
    ]
  },
  {
    slug: "exponential-backoff-with-jitter",
    title: "Exponential Backoff with Jitter",
    excerpt: "Prevent server traffic spikes using random retry jitter.",
    description: "Enhance your retry logic with 'Full Jitter' to decohere client requests and protect your infrastructure during recovery.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "jitter",
      "thundering-herd",
      "backoff",
      "distributed-systems",
      "scalability",
      "architecture",
      "reliability"
    ],
    image: {
      path: "/assets/img/goodies/snippets/exponential-backoff-with-jitter/cover.png",
      width: 1536,
      height: 1024,
      alt: "Visualization of exponential backoff with jitter, showing randomized retry intervals over time to prevent synchronized retries."
    },
    changelog: [
      { date: "2026-08-05", change: "Initial publication with Full Jitter implementation." }
    ]
  },
  {
    slug: "custom-hook-use-debounce",
    title: "Custom Hook: useDebounce",
    excerpt: "Delay updating a value until the user stops typing, in a reusable hook.",
    description: "A generic React hook that debounces any fast-changing value — trim wasted search requests, filtering, and validation runs down to one call per pause in input.",
    category: ["React"],
    tags: [
      "react",
      "hooks",
      "custom-hooks",
      "use-debounce",
      "typescript",
      "performance",
      "search-input",
      "debounce"
    ],
    image: {
      path: "/assets/img/goodies/snippets/custom-hook-use-debounce/cover.png",
      width: 1536,
      height: 1024,
      alt: "Illustration of a search input with keystrokes settling into a single debounced request, representing the useDebounce React hook."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "render-props-vs-hooks",
    title: "Render Props vs. Hooks: Migrating to a Custom Hook",
    excerpt: "Turn a render-prop component into a plain custom hook — same logic, no wrapper element.",
    description: "Migrate a classic function-as-children render-prop component to a custom hook, and see exactly what disappears: the wrapper component, the JSX indirection, and the typed children callback.",
    category: ["React"],
    tags: [
      "react",
      "hooks",
      "render-props",
      "custom-hooks",
      "refactoring",
      "typescript",
      "design-patterns",
      "migration"
    ],
    image: {
      path: "/assets/img/goodies/snippets/render-props-vs-hooks/cover.png",
      width: 1536,
      height: 1024,
      alt: "Side-by-side comparison of a render-prop component wrapping JSX versus a custom hook returning a value directly."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "error-boundary-with-fallback",
    title: "Error Boundary with a Custom Fallback",
    excerpt: "Catch render-time errors in a subtree and show a recoverable fallback instead of a blank screen.",
    description: "Build a reusable ErrorBoundary component with a typed fallback render prop, an onError hook for logging, and a reset function — so one crashing widget doesn't take down the whole page.",
    category: ["React"],
    tags: [
      "react",
      "error-boundary",
      "error-handling",
      "componentDidCatch",
      "typescript",
      "resilience",
      "class-components",
      "fallback-ui"
    ],
    image: {
      path: "/assets/img/goodies/snippets/error-boundary-with-fallback/cover.png",
      width: 1536,
      height: 1024,
      alt: "Illustration of a React component tree with one crashed branch isolated behind a shield, replaced by a fallback error message."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "debounce-throttle",
    title: "Debounce and Throttle, Implemented Correctly",
    excerpt: "The classic pair, with proper this/argument forwarding and a cancel method.",
    description: "Build debounce and throttle from scratch — correct this-binding and argument forwarding via fn.apply, a trailing-call guarantee for throttle, and a cancel() escape hatch for both.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "debounce",
      "throttle",
      "performance",
      "event-handling",
      "closures",
      "typescript",
      "rate-limiting"
    ],
    image: {
      path: "/assets/img/goodies/snippets/debounce-throttle/cover.png",
      width: 1536,
      height: 1024,
      alt: "Comparison of raw, debounced, and throttled event streams, showing how each strategy reduces call frequency differently."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "structured-clone-deep-copy",
    title: "structuredClone() vs. JSON Round-Trip Cloning",
    excerpt: "Native deep cloning, and exactly what the JSON.parse(JSON.stringify()) trick silently breaks.",
    description: "Compare the native structuredClone() API against the classic JSON.parse(JSON.stringify()) trick — Dates, Maps, Sets, undefined values, and circular references handled correctly vs. silently corrupted.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "structuredClone",
      "deep-clone",
      "json",
      "serialization",
      "immutability",
      "circular-reference",
      "browser-apis"
    ],
    image: {
      path: "/assets/img/goodies/snippets/structured-clone-deep-copy/cover.png",
      width: 1536,
      height: 1024,
      alt: "Side-by-side comparison of an object cloned via JSON.stringify losing its Date and Map types versus structuredClone preserving them."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "memoize-function-results",
    title: "Generic Memoization Wrapper with Cache Invalidation",
    excerpt: "Cache expensive pure-function results with a custom resolver, an LRU size cap, and TTL expiry.",
    description: "A reusable memoize() wrapper: a custom key resolver for non-primitive arguments, an LRU-style maxSize eviction policy, and TTL-based expiry — plus clear() and size() for cache invalidation.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "memoization",
      "caching",
      "performance",
      "lru-cache",
      "typescript",
      "pure-functions",
      "optimization"
    ],
    image: {
      path: "/assets/img/goodies/snippets/memoize-function-results/cover.png",
      width: 1536,
      height: 1024,
      alt: "Diagram of a function call flowing into a cache lookup, showing a fast cache-hit path and a slower compute-and-store path."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "event-emitter-from-scratch",
    title: "Event Emitter from Scratch",
    excerpt: "A minimal, fully-typed pub/sub implementation in about 30 lines.",
    description: "Build a typed EventEmitter with on/once/off/emit — event names and payload shapes checked by TypeScript, plus the mid-emit mutation bug most hand-rolled versions get wrong.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "event-emitter",
      "pub-sub",
      "observer-pattern",
      "typescript",
      "design-patterns",
      "decoupling",
      "eventtarget"
    ],
    image: {
      path: "/assets/img/goodies/snippets/event-emitter-from-scratch/cover.png",
      width: 1536,
      height: 1024,
      alt: "Diagram of a publisher broadcasting an event to multiple independent subscribers, illustrating the observer/pub-sub pattern."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "abortcontroller-cancel-fetch",
    title: "Cancelling In-Flight Requests with AbortController",
    excerpt: "The 'latest request wins' pattern that fixes race conditions in search-as-you-type.",
    description: "Fix the classic search-as-you-type race condition — a stale response overwriting a newer one — by aborting the previous in-flight request every time a new one starts.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "abortcontroller",
      "fetch",
      "cancellation",
      "race-conditions",
      "async-await",
      "typescript",
      "search-input"
    ],
    image: {
      path: "/assets/img/goodies/snippets/abortcontroller-cancel-fetch/cover.png",
      width: 1536,
      height: 1024,
      alt: "Timeline showing an earlier in-flight request being aborted the moment a newer request starts, preventing a stale response race condition."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "promise-all-settled-error-handling",
    title: "Handling Partial Failures with Promise.allSettled",
    excerpt: "Promise.all throws away every success the instant one task fails — allSettled doesn't.",
    description: "Compare Promise.all's fail-fast behavior against Promise.allSettled's per-task outcome reporting, plus a small utility that partitions allSettled's results into fulfilled and rejected arrays.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "promises",
      "async-await",
      "promise-allsettled",
      "error-handling",
      "parallel-async",
      "typescript",
      "resilience"
    ],
    image: {
      path: "/assets/img/goodies/snippets/promise-all-settled-error-handling/cover.png",
      width: 1536,
      height: 1024,
      alt: "Comparison of Promise.all discarding all results after one rejection versus Promise.allSettled reporting every task's individual outcome."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "curry-and-compose",
    title: "Curry and Compose: Functional Composition Utilities",
    excerpt: "Build specialized functions from general ones, and chain transformations into a pipeline.",
    description: "A curry() implementation using fn.length to detect arity, plus compose() and pipe() for chaining single-argument transformations — the two primitives functional pipelines are built from.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "currying",
      "function-composition",
      "functional-programming",
      "typescript",
      "pipe",
      "compose",
      "higher-order-functions"
    ],
    image: {
      path: "/assets/img/goodies/snippets/curry-and-compose/cover.png",
      width: 1536,
      height: 1024,
      alt: "Diagram of small single-purpose functions chained together into a left-to-right pipeline, illustrating function composition."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "container-queries-responsive-cards",
    title: "Component-Level Responsiveness with Container Queries",
    excerpt: "@container queries respond to a component's own space, not the browser viewport.",
    description: "Use @container instead of @media to make a component reflow based on its own wrapper's width — so it looks right in a sidebar, a wide column, or a modal alike, regardless of the browser window size.",
    category: ["CSS"],
    tags: [
      "css",
      "container-queries",
      "responsive-design",
      "component-driven",
      "modern-css",
      "layout",
      "design-systems"
    ],
    image: {
      path: "/assets/img/goodies/snippets/container-queries-responsive-cards/cover.png",
      width: 1536,
      height: 1024,
      alt: "A card component reflowing from a stacked layout to a horizontal layout as its own container width increases, independent of the browser viewport."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "scroll-driven-animations",
    title: "Scroll-Driven Animations with animation-timeline",
    excerpt: "A reading-progress bar and scroll-reveal cards, driven entirely by CSS — no scroll listeners.",
    description: "Tie animation progress directly to scroll position with scroll-timeline and animation-timeline: view() — a reading-progress bar and per-element reveal-on-scroll effects with zero JavaScript.",
    category: ["CSS"],
    tags: [
      "css",
      "scroll-driven-animations",
      "animation-timeline",
      "scroll-timeline",
      "parallax",
      "modern-css",
      "performance",
      "scroll-effects"
    ],
    image: {
      path: "/assets/img/goodies/snippets/scroll-driven-animations/cover.png",
      width: 1536,
      height: 1024,
      alt: "A progress bar and a stack of cards animating in sync with scroll position, illustrating CSS scroll-driven animations."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "has-selector-parent-styling",
    title: "Parent-Based Styling with :has()",
    excerpt: "Style a parent based on its children — form validation and empty states without a JS class toggle.",
    description: "The relational :has() pseudo-class lets a parent react to its descendants' state directly: highlight a field wrapper on invalid input, show an empty-state message, or style a selectable card — all without JavaScript flipping a class.",
    category: ["CSS"],
    tags: [
      "css",
      "has-selector",
      "relational-selectors",
      "form-validation",
      "empty-states",
      "modern-css",
      "selectors"
    ],
    image: {
      path: "/assets/img/goodies/snippets/has-selector-parent-styling/cover.png",
      width: 1536,
      height: 1024,
      alt: "A form field wrapper highlighted red because the input inside it is invalid, illustrating the CSS :has() relational selector."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "css-nesting-native",
    title: "Native CSS Nesting vs. Sass",
    excerpt: "Nested selectors without a build step — and the specificity gotcha that comes with them.",
    description: "Native CSS nesting resolves at parse time instead of build time, with the same & parent reference as Sass — plus a real specificity gotcha when the parent selector is a comma-separated list.",
    category: ["CSS"],
    tags: [
      "css",
      "css-nesting",
      "sass",
      "specificity",
      "modern-css",
      "selectors",
      "cascade"
    ],
    image: {
      path: "/assets/img/goodies/snippets/css-nesting-native/cover.png",
      width: 1536,
      height: 1024,
      alt: "Side-by-side comparison of Sass nested selectors requiring a compiler versus native CSS nesting parsed directly by the browser."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "subgrid-alignment",
    title: "Aligning Nested Grids with Subgrid",
    excerpt: "Line up each card's title, body, and footer across a row, no matter how its content length differs.",
    description: "grid-template-rows: subgrid lets a nested grid inherit its parent's row (or column) tracks instead of sizing its own — the fix for card titles/bodies/footers drifting out of alignment across a row.",
    category: ["CSS"],
    tags: [
      "css",
      "subgrid",
      "css-grid",
      "layout",
      "alignment",
      "modern-css",
      "cards"
    ],
    image: {
      path: "/assets/img/goodies/snippets/subgrid-alignment/cover.png",
      width: 1536,
      height: 1024,
      alt: "A row of cards with mismatched title lengths, showing their internal title/body/footer rows snapping into shared aligned tracks via CSS subgrid."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "view-transitions-api",
    title: "Smooth Transitions with the View Transitions API",
    excerpt: "Native shared-element morphing between two page states — no animation library, no FLIP math.",
    description: "document.startViewTransition() and view-transition-name let the browser morph an element between two DOM states automatically — a thumbnail expanding into a detail card, with graceful fallback where unsupported.",
    category: ["CSS"],
    tags: [
      "css",
      "view-transitions-api",
      "view-transition-name",
      "animation",
      "shared-element-transitions",
      "modern-css",
      "javascript"
    ],
    image: {
      path: "/assets/img/goodies/snippets/view-transitions-api/cover.png",
      width: 1536,
      height: 1024,
      alt: "A small color swatch morphing smoothly into a large detail card, illustrating a shared-element transition via the View Transitions API."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "css-layers-cascade-control",
    title: "Managing Specificity Wars with @layer",
    excerpt: "Layer order beats specificity — the fix for utility classes that can't override components.",
    description: "@layer gives the cascade a priority axis that's checked before specificity, so a low-specificity utility class can reliably override a higher-specificity component rule without !important or selector escalation.",
    category: ["CSS"],
    tags: [
      "css",
      "cascade-layers",
      "specificity",
      "at-layer",
      "modern-css",
      "design-systems",
      "cascade"
    ],
    image: {
      path: "/assets/img/goodies/snippets/css-layers-cascade-control/cover.png",
      width: 1536,
      height: 1024,
      alt: "A low-specificity utility class overriding a higher-specificity component rule because it lives in a later CSS cascade layer, illustrating @layer priority."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "parallel-routes-modals",
    title: "Modal-Over-Page Routing with Parallel and Intercepting Routes",
    excerpt: "A modal that's a real page too — overlay on soft navigation, full page on a direct visit.",
    description: "Combine App Router parallel routes (@modal slots) with intercepting routes ((.)folder) to build a modal that opens as an overlay from a click but still renders as a full, shareable, refreshable page on its own.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "app-router",
      "parallel-routes",
      "intercepting-routes",
      "modal",
      "routing",
      "react"
    ],
    image: {
      path: "/assets/img/goodies/snippets/parallel-routes-modals/cover.png",
      width: 1536,
      height: 1024,
      alt: "A photo grid with one item opening as a modal overlay via a soft navigation, while the same URL renders as a full page on direct visit — illustrating Next.js intercepting routes."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "generate-static-params-dynamic",
    title: "generateStaticParams for Dynamic Segments",
    excerpt: "Pre-render the known pages at build time, let dynamicParams decide what happens to the rest.",
    description: "generateStaticParams tells Next.js which dynamic route params to pre-render at build time — paired with dynamicParams and revalidate for ISR-style on-demand rendering and background refresh of the long tail.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "app-router",
      "generateStaticParams",
      "ssg",
      "isr",
      "static-generation",
      "dynamic-routes"
    ],
    image: {
      path: "/assets/img/goodies/snippets/generate-static-params-dynamic/cover.png",
      width: 1536,
      height: 1024,
      alt: "A dynamic route generating a known set of static pages at build time, with additional pages rendered on demand and cached, illustrating generateStaticParams and ISR."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "streaming-with-suspense",
    title: "Streaming with loading.tsx and Suspense",
    excerpt: "Fast parts of a page render instantly — slow parts stream in independently, on their own timeline.",
    description: "loading.tsx gives a route an automatic Suspense boundary; granular <Suspense> around individual slow components streams each one in independently, so the slowest section never blocks the fastest.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "app-router",
      "suspense",
      "streaming",
      "loading-ui",
      "react-19",
      "server-components",
      "performance"
    ],
    image: {
      path: "/assets/img/goodies/snippets/streaming-with-suspense/cover.png",
      width: 1536,
      height: 1024,
      alt: "A page with a header rendering instantly while three independent sections stream in one after another, each inside its own Suspense boundary."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "server-actions-form-mutation",
    title: "Progressive-Enhancement Forms with Server Actions",
    excerpt: "A form that works before JavaScript loads, and gets pending/error states once it does.",
    description: "Wire a Next.js Server Action to a <form> with useActionState and useFormStatus — a genuinely progressively-enhanced form with typed pending state and structured error handling, no manual fetch/useState plumbing.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "server-actions",
      "use-server",
      "useActionState",
      "useFormStatus",
      "forms",
      "react-19",
      "progressive-enhancement"
    ],
    image: {
      path: "/assets/img/goodies/snippets/server-actions-form-mutation/cover.png",
      width: 1536,
      height: 1024,
      alt: "A subscribe form submitting through a Server Action, showing a pending state on the submit button before an inline success message appears."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "middleware-auth-redirect",
    title: "Auth Gating with Edge Middleware",
    excerpt: "One middleware.ts file guards a whole route subtree, before any page even starts running.",
    description: "A middleware.ts that redirects unauthenticated requests to protected routes before they reach any page, with a scoped matcher — plus NextResponse.next() vs. redirect() vs. rewrite() and Edge runtime constraints.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "middleware",
      "edge-runtime",
      "authentication",
      "authorization",
      "app-router",
      "routing"
    ],
    image: {
      path: "/assets/img/goodies/snippets/middleware-auth-redirect/cover.png",
      width: 1536,
      height: 1024,
      alt: "A request being intercepted by edge middleware before reaching a protected route, redirecting to a login page when unauthenticated."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "light-dark-color-scheme",
    title: "One-Line Theme-Aware Colors with light-dark()",
    excerpt: "A single declaration per color, resolved automatically for both light and dark mode.",
    description: "The light-dark() CSS function collapses a light value and a dark value into one declaration, resolved by color-scheme — no duplicate custom properties, no @media (prefers-color-scheme) block per themed property.",
    category: ["CSS"],
    tags: [
      "css",
      "light-dark",
      "color-scheme",
      "dark-mode",
      "theming",
      "modern-css",
      "design-tokens"
    ],
    image: {
      path: "/assets/img/goodies/snippets/light-dark-color-scheme/cover.png",
      width: 1536,
      height: 1024,
      alt: "A card component's background and text color switching between light and dark values from a single light-dark() declaration."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "color-mix-dynamic-tints",
    title: "Generating Tints and Shades with color-mix()",
    excerpt: "One brand color, a whole palette derived from it — recomputed live, no hardcoded hex ramp.",
    description: "color-mix() blends a base CSS variable toward white or black by any percentage, generating a full tint/shade ramp from a single color that stays in sync automatically when the base color changes.",
    category: ["CSS"],
    tags: [
      "css",
      "color-mix",
      "oklch",
      "design-tokens",
      "theming",
      "modern-css",
      "color-spaces"
    ],
    image: {
      path: "/assets/img/goodies/snippets/color-mix-dynamic-tints/cover.png",
      width: 1536,
      height: 1024,
      alt: "A row of color swatches forming a tint and shade ramp, all generated from a single base color via the CSS color-mix() function."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "text-wrap-balance-pretty",
    title: "Better Line Wrapping with text-wrap: balance / pretty",
    excerpt: "Even-looking headline wraps and no more orphaned last words in paragraphs — no JS, no markup changes.",
    description: "text-wrap: balance evens out headline line lengths; text-wrap: pretty avoids leaving a single short word stranded on a paragraph's last line — two narrow typography fixes with no CSS-only alternative until now.",
    category: ["CSS"],
    tags: [
      "css",
      "text-wrap",
      "typography",
      "balance",
      "pretty",
      "modern-css",
      "line-wrapping"
    ],
    image: {
      path: "/assets/img/goodies/snippets/text-wrap-balance-pretty/cover.png",
      width: 1536,
      height: 1024,
      alt: "A headline wrapping into evenly balanced lines next to a paragraph avoiding a single orphaned word on its last line, illustrating text-wrap: balance and pretty."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "accent-color-native-controls",
    title: "Theming Native Controls with accent-color",
    excerpt: "Brand-matched checkboxes, radios, sliders, and progress bars — without replacing them.",
    description: "The accent-color property themes the checked/filled state of native checkboxes, radios, range sliders, and progress bars to any color, keeping real browser controls with full native behavior and accessibility intact.",
    category: ["CSS"],
    tags: [
      "css",
      "accent-color",
      "forms",
      "native-controls",
      "theming",
      "accessibility",
      "modern-css"
    ],
    image: {
      path: "/assets/img/goodies/snippets/accent-color-native-controls/cover.png",
      width: 1536,
      height: 1024,
      alt: "Native checkboxes, a radio group, a range slider, and a progress bar all themed to a green brand color via the CSS accent-color property."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "css-trigonometric-functions",
    title: "Radial Layouts with CSS Trigonometric Functions",
    excerpt: "sin(), cos(), and atan2() move circular layout math out of JavaScript and into CSS.",
    description: "Native sin()/cos()/atan2() CSS functions for arranging items evenly around a circle and computing angles from a direction — the building blocks for radial layouts, clock-style UI, and pointer/compass indicators.",
    category: ["CSS"],
    tags: [
      "css",
      "trigonometric-functions",
      "sin",
      "cos",
      "atan2",
      "radial-layout",
      "modern-css",
      "calc"
    ],
    image: {
      path: "/assets/img/goodies/snippets/css-trigonometric-functions/cover.png",
      width: 1536,
      height: 1024,
      alt: "A ring of numbered dots evenly spaced around a circle, their positions computed with native CSS sin() and cos() trigonometric functions."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "anchor-positioning-tooltips",
    title: "Native Tooltips with CSS Anchor Positioning",
    excerpt: "Tether a tooltip to its trigger element's edge — no Popper, no Floating UI.",
    description: "anchor-name and position-anchor let CSS tether an element to another element's edge natively, with anchor() reference points and position-try-fallbacks for automatic flip-to-fit — the native answer to what JS positioning libraries solve.",
    category: ["CSS"],
    tags: [
      "css",
      "anchor-positioning",
      "tooltips",
      "popovers",
      "modern-css",
      "floating-ui",
      "positioning"
    ],
    image: {
      path: "/assets/img/goodies/snippets/anchor-positioning-tooltips/cover.png",
      width: 1536,
      height: 1024,
      alt: "Three tooltips tethered to their respective trigger buttons at different edges, illustrating native CSS anchor positioning."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "scope-styling-boundaries",
    title: "Limiting Selector Reach with @scope",
    excerpt: "Reuse generic class names like .title and .button across components with zero collisions.",
    description: "@scope gives a CSS rule an explicit DOM boundary instead of relying on BEM naming or CSS-in-JS generated class names — the same generic .title/.button styled independently per component, plus donut-scoping and proximity-based specificity.",
    category: ["CSS"],
    tags: [
      "css",
      "at-scope",
      "bem",
      "css-in-js",
      "specificity",
      "modern-css",
      "component-styling"
    ],
    image: {
      path: "/assets/img/goodies/snippets/scope-styling-boundaries/cover.png",
      width: 1536,
      height: 1024,
      alt: "Two card components using the identical generic class names .title and .button, styled independently without collision via CSS @scope."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "starting-style-entry-animations",
    title: "Entry Animations with @starting-style",
    excerpt: "Give a freshly-added element an actual 'before' state, so its transition has something to animate from.",
    description: "@starting-style defines a first-render starting state for an element, finally letting transitions run on entry — no display:none hacks or JavaScript double-render tricks, and pairs with allow-discrete to animate display itself.",
    category: ["CSS"],
    tags: [
      "css",
      "starting-style",
      "transitions",
      "entry-animations",
      "allow-discrete",
      "modern-css",
      "toasts"
    ],
    image: {
      path: "/assets/img/goodies/snippets/starting-style-entry-animations/cover.png",
      width: 1536,
      height: 1024,
      alt: "A toast notification fading and sliding into view on its first render, illustrating a CSS @starting-style entry animation."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "use-form-status-pending-ui",
    title: "Nested Pending UI with useFormStatus",
    excerpt: "A submit button, a fieldset, and a banner all react to one form's pending state — no prop-threading.",
    description: "useFormStatus lets any component nested inside a <form> read that form's pending state directly, independently of sibling consumers — no isPending prop threaded down from a parent.",
    category: ["React"],
    tags: [
      "react",
      "useFormStatus",
      "forms",
      "pending-state",
      "react-19",
      "react-dom",
      "hooks"
    ],
    image: {
      path: "/assets/img/goodies/snippets/use-form-status-pending-ui/cover.png",
      width: 1536,
      height: 1024,
      alt: "A form with three independent nested components — a banner, a fieldset, and a submit button — all reacting to the same pending state via useFormStatus."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "react-compiler-memoization",
    title: "What React Compiler Auto-Memoizes (and What Still Needs useMemo)",
    excerpt: "Automatic memoization handles most components — a specific minority of cases still need it by hand.",
    description: "React Compiler automatically inserts the equivalent of useMemo/useCallback/React.memo based on static data-flow analysis — this covers the vast majority of components, but untracked external state and Rules-of-React violations still need manual memoization.",
    category: ["React"],
    tags: [
      "react",
      "react-compiler",
      "useMemo",
      "useCallback",
      "memoization",
      "performance",
      "react-19",
      "build-tools"
    ],
    image: {
      path: "/assets/img/goodies/snippets/react-compiler-memoization/cover.png",
      width: 1536,
      height: 1024,
      alt: "A component's derived values and callbacks being automatically wrapped in memoization by React Compiler at build time, illustrating what it does versus what still needs manual useMemo."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "iterator-helpers-map-filter",
    title: "Native .map()/.filter()/.take() on Iterators",
    excerpt: "Lazy chains directly on any iterator or generator — no array conversion, works on infinite sequences.",
    description: "Iterator helpers put .map(), .filter(), .take(), .drop(), and .flatMap() directly on Iterator.prototype — lazy, chainable, and usable on infinite generators that could never be spread into an array first.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "iterator-helpers",
      "generators",
      "lazy-evaluation",
      "es2025",
      "functional-programming",
      "iterables"
    ],
    image: {
      path: "/assets/img/goodies/snippets/iterator-helpers-map-filter/cover.png",
      width: 1536,
      height: 1024,
      alt: "An infinite generator chained through .filter().map().take(), producing only the values actually requested, illustrating lazy native iterator helpers."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "array-grouping-object-groupby",
    title: "Object.groupBy() and Map.groupBy()",
    excerpt: "Built-in array grouping that replaces the reduce-based groupBy every codebase hand-rolled once.",
    description: "Object.groupBy() and Map.groupBy() replace the classic reduce-based groupBy helper — the same idea built into the language, with one key difference: Object.groupBy coerces keys to strings, Map.groupBy keeps them as their real type.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "object-groupby",
      "map-groupby",
      "array-grouping",
      "es2024",
      "reduce",
      "data-transformation"
    ],
    image: {
      path: "/assets/img/goodies/snippets/array-grouping-object-groupby/cover.png",
      width: 1536,
      height: 1024,
      alt: "A flat list of items splitting into labeled groups via Object.groupBy and Map.groupBy, replacing a manual reduce-based grouping helper."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "temporal-api-date-handling",
    title: "Temporal.PlainDate: Fixing Date's Footguns",
    excerpt: "Zero-indexed months, in-place mutation, and silent month-end rollover — gone.",
    description: "Temporal.PlainDate replaces Date's classic footguns — zero-indexed months, in-place mutation, and silent month-end overflow — with an immutable, calendar-only date type and explicit overflow handling.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "temporal-api",
      "plaindate",
      "date-handling",
      "immutability",
      "tc39",
      "date-object"
    ],
    image: {
      path: "/assets/img/goodies/snippets/temporal-api-date-handling/cover.png",
      width: 1536,
      height: 1024,
      alt: "January 31st plus one month rolling into March with legacy Date versus clamping correctly to February's last day with Temporal.PlainDate."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "explicit-resource-management-using",
    title: "Deterministic Cleanup with using / await using",
    excerpt: "Resources dispose automatically, in reverse order, even when the block throws.",
    description: "The using and await using declarations call an object's Symbol.dispose/Symbol.asyncDispose automatically at the end of scope, in reverse acquisition order, replacing nested try/finally blocks with a flat, declarative alternative.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "using-declarations",
      "explicit-resource-management",
      "symbol-dispose",
      "tc39",
      "try-finally",
      "resource-cleanup"
    ],
    image: {
      path: "/assets/img/goodies/snippets/explicit-resource-management-using/cover.png",
      width: 1536,
      height: 1024,
      alt: "Three resources acquired in order and disposed automatically in reverse order at the end of a using block, even after a thrown error, illustrating explicit resource management."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "web-locks-api-coordination",
    title: "Coordinating Tabs with the Web Locks API",
    excerpt: "One named lock, serialized (or shared) automatically across every tab on the same origin.",
    description: "navigator.locks.request() coordinates access to a named resource across every tab, iframe, and worker sharing an origin — mutual exclusion or shared access, with automatic release if the holding tab closes, and no BroadcastChannel wiring of your own.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "web-locks-api",
      "navigator-locks",
      "cross-tab-coordination",
      "concurrency",
      "browser-apis",
      "mutual-exclusion"
    ],
    image: {
      path: "/assets/img/goodies/snippets/web-locks-api-coordination/cover.png",
      width: 1536,
      height: 1024,
      alt: "Two browser tabs requesting the same named lock, with the second tab's callback queued until the first releases it, illustrating the Web Locks API."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "structured-concurrency-abortsignal-any",
    title: "Composing Cancellation with AbortSignal.any()",
    excerpt: "Merge a timeout, a manual cancel, and a parent's signal into one — whichever fires first wins.",
    description: "AbortSignal.any() merges multiple abort sources — a manual AbortController, AbortSignal.timeout(), a parent operation's own signal — into a single combined signal, the building block for cascading cancellation through a multi-step async pipeline.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "abortsignal-any",
      "abortsignal-timeout",
      "structured-concurrency",
      "cancellation",
      "async-await",
      "abortcontroller"
    ],
    image: {
      path: "/assets/img/goodies/snippets/structured-concurrency-abortsignal-any/cover.png",
      width: 1536,
      height: 1024,
      alt: "A manual cancel signal and a timeout signal merging into one combined AbortSignal via AbortSignal.any(), whichever fires first aborting the operation."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "origin-private-file-system",
    title: "Fast Client-Side Files with OPFS",
    excerpt: "Real file handles and directories, persisted per-origin — no IndexedDB schema or transactions.",
    description: "The Origin Private File System gives an origin a real private file system — file and directory handles, read/write streams, and a worker-only synchronous access mode — replacing IndexedDB's schema and transaction boilerplate for file-shaped data.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "opfs",
      "origin-private-file-system",
      "file-system-access-api",
      "indexeddb",
      "browser-storage",
      "client-side-storage"
    ],
    image: {
      path: "/assets/img/goodies/snippets/origin-private-file-system/cover.png",
      width: 1536,
      height: 1024,
      alt: "A text file being written to and read back from the Origin Private File System's root directory, with no IndexedDB schema or transaction involved."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "use-hook-suspense-data",
    title: "Reading Promises and Context with use()",
    excerpt: "One API for suspending on a promise or reading context — and the only one callable conditionally.",
    description: "The use() API reads a promise (suspending via the nearest Suspense boundary until it resolves) or a context, and unlike every other Hook, can be called conditionally, in loops, and after early returns.",
    category: ["React"],
    tags: [
      "react",
      "use-hook",
      "suspense",
      "context",
      "react-19",
      "async-rendering",
      "server-components"
    ],
    image: {
      path: "/assets/img/goodies/snippets/use-hook-suspense-data/cover.png",
      width: 1536,
      height: 1024,
      alt: "A component suspending on a cached promise via use() until it resolves, and a second component reading context conditionally inside an if statement."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "use-optimistic-updates",
    title: "Instant Feedback with useOptimistic",
    excerpt: "Render the predicted result immediately, then let React revert it automatically on failure.",
    description: "useOptimistic renders a predicted new value immediately while a real async update is in flight, then automatically falls back to the real state once it settles — success or failure — with no manual rollback code.",
    category: ["React"],
    tags: [
      "react",
      "use-optimistic",
      "optimistic-ui",
      "react-19",
      "server-actions",
      "use-transition",
      "forms"
    ],
    image: {
      path: "/assets/img/goodies/snippets/use-optimistic-updates/cover.png",
      width: 1536,
      height: 1024,
      alt: "A comment appearing instantly in dimmed pending state, then either confirming or automatically rolling back once a simulated server response arrives, illustrating useOptimistic."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "use-transition-non-blocking-updates",
    title: "Keeping Input Responsive with useTransition",
    excerpt: "Mark an expensive re-render as non-urgent so typing itself never lags behind it.",
    description: "useTransition lets an expensive state update be marked non-urgent and interruptible, so a fast-changing input stays responsive while a costly derived re-render (like filtering a large list) catches up shortly after, with isPending acknowledging the gap.",
    category: ["React"],
    tags: [
      "react",
      "use-transition",
      "concurrent-rendering",
      "performance",
      "is-pending",
      "react-18",
      "search-input"
    ],
    image: {
      path: "/assets/img/goodies/snippets/use-transition-non-blocking-updates/cover.png",
      width: 1536,
      height: 1024,
      alt: "A search input staying responsive while a deliberately expensive list filter lags a beat behind, marked non-urgent via useTransition, versus the same filter blocking the input when run synchronously."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "partial-prerendering-ppr",
    title: "Partial Prerendering: Static Shell, Dynamic Streams",
    excerpt: "One route, one request — a cached static shell with personalized slices streamed in around it.",
    description: "Partial Prerendering serves a route's static shell instantly from a build-time cache while dynamic Suspense boundaries stream in per-request personalized content — combining static generation's speed with dynamic rendering's personalization in a single route.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "partial-prerendering",
      "ppr",
      "app-router",
      "suspense",
      "static-generation",
      "streaming"
    ],
    image: {
      path: "/assets/img/goodies/snippets/partial-prerendering-ppr/cover.png",
      width: 1536,
      height: 1024,
      alt: "A page's static shell served instantly from cache while a small personalized recommendations section streams in separately, illustrating Next.js Partial Prerendering."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "use-cache-directive",
    title: "Granular Caching with \"use cache\"",
    excerpt: "Cache any async function, component, or file — not just fetch() calls — with time- or tag-based invalidation.",
    description: "The \"use cache\" directive extends caching to any async function, Server Component render, or entire file, with cacheLife for time-based freshness and cacheTag + revalidateTag for on-demand invalidation — not limited to fetch() the way Next.js's earlier caching model was.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "use-cache",
      "caching",
      "cachelife",
      "cachetag",
      "revalidatetag",
      "app-router"
    ],
    image: {
      path: "/assets/img/goodies/snippets/use-cache-directive/cover.png",
      width: 1536,
      height: 1024,
      alt: "A direct database query inside a Server Component being cached via the \"use cache\" directive, tagged for on-demand invalidation, illustrating Next.js's granular function-level caching."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "after-function-background-work",
    title: "Background Work After the Response with after()",
    excerpt: "Log, notify, or analyze after the response is sent — without a fire-and-forget call risking getting cut off.",
    description: "next/server's after() schedules a callback to run once the response has been sent, without delaying it — and unlike a bare fire-and-forget call, guarantees the execution context stays alive until that callback finishes, even on serverless/edge platforms.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "next-after",
      "background-work",
      "analytics",
      "route-handlers",
      "server-actions",
      "app-router"
    ],
    image: {
      path: "/assets/img/goodies/snippets/after-function-background-work/cover.png",
      width: 1536,
      height: 1024,
      alt: "A page response streaming to the client immediately while an analytics logging call scheduled with after() runs afterward on the server, illustrating next/server's after() function."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "edge-runtime-vs-nodejs-runtime",
    title: "Choosing a Runtime: Edge vs. Node.js",
    excerpt: "A single export const runtime line — and a real trade-off between cold-start speed and API compatibility.",
    description: "Edge Runtime and the Node.js runtime are genuinely different execution environments, configurable per route — Edge trades full Node.js API access for fast cold starts and global distribution, Node.js trades that speed for complete compatibility.",
    category: ["Next.js"],
    tags: [
      "nextjs",
      "edge-runtime",
      "nodejs-runtime",
      "middleware",
      "app-router",
      "cold-start",
      "deployment"
    ],
    image: {
      path: "/assets/img/goodies/snippets/edge-runtime-vs-nodejs-runtime/cover.png",
      width: 1536,
      height: 1024,
      alt: "A lightweight route running on a fast-starting, globally distributed Edge Runtime isolate next to a heavier route running on a full Node.js process, illustrating the Next.js per-route runtime choice."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "satisfies-operator-inference",
    title: "Validating Without Widening: the satisfies Operator",
    excerpt: "Check a value against a type and keep its precise inferred type — instead of picking one or the other.",
    description: "The satisfies operator validates an expression against a type while preserving its own precise inferred type afterward, instead of widening to the annotation's type the way an explicit `: Type` annotation does — validation and literal precision, no longer a trade-off.",
    category: ["TypeScript"],
    tags: [
      "typescript",
      "satisfies",
      "type-inference",
      "type-widening",
      "keyof",
      "as-const",
      "typescript-4-9"
    ],
    image: {
      path: "/assets/img/goodies/snippets/satisfies-operator-inference/cover.png",
      width: 1536,
      height: 1024,
      alt: "A route config object validated against a Record type while keeping its exact literal keys for autocomplete, illustrating TypeScript's satisfies operator."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "const-type-parameters",
    title: "Literal-Preserving Inference with const Type Parameters",
    excerpt: "Get as const's precision on every call site — without requiring callers to write as const.",
    description: "A const modifier on a generic type parameter infers the narrowest possible literal type for every call automatically, moving the effect of `as const` from something each caller has to remember into a default the function's own signature guarantees.",
    category: ["TypeScript"],
    tags: [
      "typescript",
      "const-type-parameters",
      "generics",
      "as-const",
      "type-inference",
      "literal-types",
      "typescript-5-0"
    ],
    image: {
      path: "/assets/img/goodies/snippets/const-type-parameters/cover.png",
      width: 1536,
      height: 1024,
      alt: "A generic function inferring the exact literal union of an array argument's values automatically via a const type parameter, with no as const needed at the call site."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "template-literal-types-routing",
    title: "Type-Safe Route Builders with Template Literal Types",
    excerpt: "Extract a route pattern's required params as a type, derived straight from the pattern string.",
    description: "Template literal types give string shapes the same precision object shapes have — and combined with infer, can extract named :param segments from a route pattern into a required params object type, keeping a route builder's pattern and its params in sync automatically.",
    category: ["TypeScript"],
    tags: [
      "typescript",
      "template-literal-types",
      "infer",
      "type-safe-routing",
      "type-inference",
      "generics",
      "string-types"
    ],
    image: {
      path: "/assets/img/goodies/snippets/template-literal-types-routing/cover.png",
      width: 1536,
      height: 1024,
      alt: "A route pattern string like /users/:userId/posts/:postId being parsed at the type level into a required { userId, postId } params object, illustrating TypeScript template literal type inference."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "custom-elements-lightweight",
    title: "A Dependency-Free Web Component with Custom Elements",
    excerpt: "A real HTML tag, backed by one class — no framework, no build step, no runtime dependency.",
    description: "The Custom Elements API turns a class extending HTMLElement into a real, usable HTML tag — lifecycle callbacks, observed attributes, and shadow DOM encapsulation, framework-agnostic and usable anywhere HTML is.",
    category: ["HTML"],
    tags: [
      "html",
      "web-components",
      "custom-elements",
      "shadow-dom",
      "framework-agnostic",
      "encapsulation",
      "browser-apis"
    ],
    image: {
      path: "/assets/img/goodies/snippets/custom-elements-lightweight/cover.png",
      width: 1536,
      height: 1024,
      alt: "Two independent <like-button> custom elements on a page, each with its own internal click count, defined by a single HTMLElement subclass with no framework involved."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "declarative-shadow-dom",
    title: "SSR-Friendly Shadow DOM, No Hydration Needed",
    excerpt: "A shadow root attached directly by the HTML parser — present from first paint, zero JavaScript required.",
    description: "Declarative Shadow DOM lets <template shadowrootmode=\"open\"> attach a real shadow root during HTML parsing itself, making Shadow DOM genuinely server-renderable for the first time — content visible from first paint, with no script execution needed just to show it.",
    category: ["HTML"],
    tags: [
      "html",
      "shadow-dom",
      "declarative-shadow-dom",
      "web-components",
      "ssr",
      "hydration",
      "browser-apis"
    ],
    image: {
      path: "/assets/img/goodies/snippets/declarative-shadow-dom/cover.png",
      width: 1536,
      height: 1024,
      alt: "A card's shadow DOM content appearing instantly from a declarative <template shadowrootmode> element, while an equivalent imperatively-attached shadow root is still missing while its script loads."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "intersection-observer-lazy-reveal",
    title: "Scroll-Triggered Reveal with IntersectionObserver",
    excerpt: "Reveal elements as they enter view, without a throttled scroll listener doing the math by hand.",
    description: "IntersectionObserver reports when an element's visibility relative to a container (viewport or a specific scrollable ancestor) changes, replacing a manually-throttled scroll event listener for reveal animations, lazy-loading, and infinite-scroll triggers.",
    category: ["HTML"],
    tags: [
      "html",
      "intersection-observer",
      "scroll-reveal",
      "lazy-loading",
      "infinite-scroll",
      "performance",
      "browser-apis"
    ],
    image: {
      path: "/assets/img/goodies/snippets/intersection-observer-lazy-reveal/cover.png",
      width: 1536,
      height: 1024,
      alt: "A stack of cards inside a scrollable container fading and sliding into view one by one as they cross a visibility threshold, watched by a single IntersectionObserver instead of a scroll event listener."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  },
  {
    slug: "resize-observer-container-sync",
    title: "Reacting to Element Size with ResizeObserver",
    excerpt: "The actual question most \"responsive\" JS logic asks — has this element's size changed, not the window's.",
    description: "ResizeObserver watches a specific element's own size directly, firing whenever it changes for any reason — a manual resize, a sibling's layout shift, content changing — none of which a window resize listener would ever catch.",
    category: ["HTML"],
    tags: [
      "html",
      "resize-observer",
      "responsive-design",
      "container-queries",
      "canvas",
      "layout",
      "browser-apis"
    ],
    image: {
      path: "/assets/img/goodies/snippets/resize-observer-container-sync/cover.png",
      width: 1536,
      height: 1024,
      alt: "A manually resized box switching between a compact and wide layout label purely from its own size, tracked by ResizeObserver instead of a window resize listener."
    },
    changelog: [
      { date: "2026-09-02", change: "Initial publication." }
    ]
  }
];

// Look up a single snippet by its slug.
export function getSnippetBySlug(slug: string): Snippet | undefined {
  return snippets.find((snippet) => snippet.slug === slug);
}

// Previous/next neighbours by this array's order (client-safe — used by the
// snippet layout, which can't read git dates in the browser). The registry is
// oldest-first (new snippets appended to the end), so "previous" is the entry
// just before (older) and "next" is the one just after (newer).
export function getSnippetNavigation(slug: string): SnippetNavigation {
  const index = snippets.findIndex((snippet) => snippet.slug === slug);
  if (index === -1) return { previous: null, next: null };

  const previous = index > 0 ? snippets[index - 1] : null;
  const next = index < snippets.length - 1 ? snippets[index + 1] : null;

  return {
    previous: previous ? { slug: previous.slug, title: previous.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null
  };
}
