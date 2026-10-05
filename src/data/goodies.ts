import type { IconName } from "@/icons/icons";

// A single entry in the Goodies grid — an icon, a name, a blurb, and where it links.
interface Goodie {
  name: string;
  description: string;
  // Icon registry key rendered inside the goodie card.
  icon: IconName;
  // Destination route for the card link.
  href: string;
}

// Curated developer goodies rendered as cards on the /goodies page.
export const goodies: Goodie[] = [
  {
    name: "Snippets",
    description: "Concise code fragments to solve discrete challenges.",
    icon: "codeBlock",
    href: "/snippets"
  },
  {
    name: "Cron Expression Builder",
    description: "Bidirectional cron builder — per-field mode widgets generate the 5-field string, a plain-English description reads it back, and a live next-5-runs preview with crontab/GitHub Actions/Kubernetes export.",
    icon: "cron",
    href: "/goodies/cron-expression-builder"
  },
  {
    name: "Regex Tester",
    description: "Live regex tester — matches highlight directly in your test string, numbered/named capture groups surface as their own tags, a plain-English explain panel reads the pattern back, and it exports to JavaScript/Python/Java.",
    icon: "regex",
    href: "/goodies/regex-tester"
  },
  {
    name: "Gradient Generator",
    description: "Live gradient builder — the gradient itself is the backdrop, with a large draggable angle dial and position pad, multi-stop color editing with OKLCH/HSL/RGB interpolation, curated presets, and CSS/Tailwind/React export.",
    icon: "gradient",
    href: "/goodies/gradient-generator"
  },
  {
    name: "Box Shadow Generator",
    description: "Layered box-shadow editor — stack, reorder, and duplicate per-layer offset/blur/spread/color/inset shadows, tune the surface and page colors, start from neumorphism/material/neon presets, and export to CSS/Tailwind/React.",
    icon: "boxShadow",
    href: "/goodies/box-shadow-generator"
  },
  {
    name: "Text Effects Generator",
    description: "Live text-effects editor — an oversized preview on its own spotlit stage, a solid or gradient text fill, a stack of text-shadow layers for glow/emboss/outline/3D-extrude looks, curated presets, and CSS/Tailwind/React export.",
    icon: "textEffects",
    href: "/goodies/text-effects-generator"
  },
  {
    name: "Filter & Backdrop Generator",
    description: "Optics-bench filter editor — slot CSS filter functions into an ordered lens rack, aim them at the preview subject or through a translucent backdrop-filter panel, start from a glassmorphism/vintage/vivid preset, and export to CSS/Tailwind/React.",
    icon: "frostedPanel",
    href: "/goodies/filter-backdrop-generator"
  },
  {
    name: "Border Radius Generator",
    description: "Clay-studio border-radius editor — pinch each corner's radius by dragging directly on the shape or typing exact values, jump between quick shapes from sharp to pill, circle, blob, and squircle, tune the clay and worktable colors, and export to CSS/Tailwind/React.",
    icon: "blob",
    href: "/goodies/border-radius-generator"
  },
  {
    name: "Layout Playground",
    description: "Blueprint-drafted Flexbox/Grid playground — container and per-item controls compile live, the preview reads as an annotated technical drawing with dimension-lined gaps, a parts-schedule item list, curated presets, and CSS/Tailwind/React export.",
    icon: "gridLayout",
    href: "/goodies/layout-playground"
  },
  {
    name: "Color Palette Generator",
    description: "Print-shop swatch-fan palette builder — seed a color to generate a full 50-950 OKLCH lightness ramp, check WCAG contrast against a foreground/background pair with a stamped pass/fail seal, start from curated presets, and export to CSS/Tailwind/React.",
    icon: "colorPalette",
    href: "/goodies/color-palette-generator"
  },
  {
    name: "Popover / Anchor-Positioning Builder",
    description: "Radar-tower popover builder — combine the real HTML popover attribute with real CSS anchor positioning via a compass-style anchor-side picker, offset, auto/manual dismiss, backdrop, and entrance-animation/fallback toggles, with an automatic static-position fallback for unsupported browsers, plus CSS/HTML/React code export.",
    icon: "link",
    href: "/goodies/popover-anchor-positioning-builder"
  },
  {
    name: "CSS Grid Template Builder",
    description: "Ledger-sheet grid-template-columns/rows/areas editor — a track list with px/rem/fr/auto/minmax() sizing, a click-and-drag named-areas painter that generates a real grid-template-areas string, a live CSS Grid preview, Holy Grail/Sidebar/Dashboard presets, and CSS/Tailwind/React code export.",
    icon: "columns",
    href: "/goodies/css-grid-template-builder"
  },
  {
    name: "Clip-Path Generator",
    description: "Cutting-mat clip-path editor — drag pen-tool bezier points or circle/ellipse/inset handles directly on the preview, morph between two shapes with ready @keyframes export, and output CSS/Tailwind/React/SVG code.",
    icon: "diamonds",
    href: "/goodies/clip-path-generator"
  },
  {
    name: "SVG Path Generator",
    description: "Backlit light-table pen-tool path editor with open/closed strokes, bezier curve points, stroke/fill styling, and raw <path d>, standalone SVG, and React code export.",
    icon: "penTool",
    href: "/goodies/svg-path-generator"
  },
  {
    name: "Easing Curve Editor",
    description: "Oscilloscope-styled cubic-bezier() editor with a slide/scale/opacity/rotate preview animation, presets from the CSS Easing Functions guide, and CSS/Tailwind/React code export.",
    icon: "easingCurve",
    href: "/goodies/easing-curve-editor"
  },
  {
    name: "Color-Mix Space Playground",
    description: "Mixing-bench color-mix() editor comparing srgb/hsl/hwb/lch/oklch/lab/oklab interpolation side by side on the same two colors, a ratio-driven result swatch, and CSS/Tailwind/React code export.",
    icon: "colorMix",
    href: "/goodies/color-mix-playground"
  },
  {
    name: "Fluid Type Calculator",
    description: "Type-specimen min/max viewport → clamp() font-size calculator with an arbitrary list of named steps, a draggable viewport-width live preview, and CSS custom-property/Tailwind/React export.",
    icon: "fluidType",
    href: "/goodies/fluid-type-calculator"
  },
  {
    name: "CSS Triangle / Arrow Generator",
    description: "Chalkboard triangle and chevron/arrow generator comparing two CSS techniques side by side — the classic border trick and clip-path polygon() — with direction/size/color controls and real-world tooltip/breadcrumb/carousel-arrow presets.",
    icon: "triangle",
    href: "/goodies/triangle-generator"
  },
  {
    name: "JSON ⇄ TS Interface Generator",
    description: "Terminal-styled bidirectional JSON/TypeScript converter — generate nested, de-duplicated interfaces with optional-field inference from JSON, or a sample JSON payload from hand-typed TS interfaces.",
    icon: "jsonToTs",
    href: "/goodies/json-to-ts"
  },
  {
    name: "CSS Unit Converter",
    description: "Tailor's-bench px ⇄ rem/em/vw/vh/cqi/%/pt converter with editable root/parent/viewport/container context, a true-scale measuring tape with a parallel ruler per unit, batch spacing-scale conversion, and CSS custom-property/Tailwind/Sass/JS export.",
    icon: "unitConverter",
    href: "/goodies/css-unit-converter"
  },
  {
    name: "Keyframes Animation Builder",
    description: "Dope-sheet @keyframes builder — click a frame-ruled exposure track to add keyframes, drag or arrow-key them into place, pin translate/rotate/scale/opacity/colour/radius per stop (unset properties interpolate across), scrub a live preview with onion skins, start from bounce/pulse/shake/heartbeat presets, and export to CSS/Tailwind/React.",
    icon: "keyframes",
    href: "/goodies/keyframes-animation-builder"
  },
  {
    name: "SVG → React Component Converter",
    description: "Circuit-board SVG-to-JSX converter — camelCases attributes, strips editor cruft, inlines <style> classes, swaps colours for currentColor and wires title/size/ref props, with a sanitised side-by-side preview and a transforms log.",
    icon: "svgToReact",
    href: "/goodies/svg-to-react"
  },
  {
    name: "Meta / Open Graph Preview",
    description: "Corkboard-styled share-preview pinboard — edit metadata or paste an existing <head>, compare pinned X, LinkedIn, Slack, Facebook, Discord, iMessage, and Google previews with per-card light/dark, audit lengths/image size/alt/absolute URLs, and export HTML/Next.js metadata/React <Head>.",
    icon: "openGraph",
    href: "/goodies/open-graph-preview"
  },
  {
    name: "Event Loop Visualiser",
    description: "Signal-box event loop visualiser — build a script from setTimeout, Promise.then, queueMicrotask, async/await, fakeFetch, and requestAnimationFrame blocks, then step, play, or scrub through the call stack, Web APIs, microtask/task queues, render step, and console with a per-step explanation, plus a predict-the-output mode.",
    icon: "eventLoop",
    href: "/goodies/event-loop-visualiser"
  }
];
