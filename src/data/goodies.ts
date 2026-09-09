import type { Goodie } from "@/interfaces/goodie";

// Curated developer goodies rendered as cards on the /goodies page.
export const goodies: Goodie[] = [
  {
    name: "Snippets",
    description: "Concise code fragments to solve discrete challenges.",
    icon: "codeBlock",
    href: "/snippets"
  },
  {
    name: "CSS Grid Template Builder",
    description: "Visual grid-template-columns/rows/areas editor — a track list with px/rem/fr/auto/minmax() sizing, a click-and-drag named-areas painter that generates a real grid-template-areas string, a live CSS Grid preview, Holy Grail/Sidebar/Dashboard presets, and CSS/Tailwind/React code export.",
    icon: "columns",
    href: "/goodies/css-grid-template-builder"
  },
  {
    name: "Clip-Path Generator",
    description: "Draggable clip-path editor with bezier curve points, shape morphing, and multi-format code export.",
    icon: "diamonds",
    href: "/goodies/clip-path-generator"
  },
  {
    name: "SVG Path Generator",
    description: "Draggable pen-tool path editor with open/closed strokes, bezier curve points, stroke/fill styling, and raw <path d>, standalone SVG, and React code export.",
    icon: "penTool",
    href: "/goodies/svg-path-generator"
  },
  {
    name: "Gradient Generator",
    description: "Linear, radial, and conic gradient editor with multi-stop control, OKLCH/HSL/RGB interpolation, and multi-format code export.",
    icon: "gradient",
    href: "/goodies/gradient-generator"
  },
  {
    name: "Box-Shadow Generator",
    description: "Layered box-shadow editor with inset toggle, per-layer offset/blur/spread control, and live neumorphism/soft-UI presets.",
    icon: "boxShadow",
    href: "/goodies/box-shadow-generator"
  },
  {
    name: "Border-Radius Generator",
    description: "8-point corner radius editor with draggable handles, a squircle/superellipse mode, and organic blob presets.",
    icon: "blob",
    href: "/goodies/border-radius-generator"
  },
  {
    name: "Filter Generator",
    description: "Filter/backdrop-filter editor with blur, saturate, and 7 more functions, a glassmorphism preset, and a live preview over a gradient or photo.",
    icon: "frostedPanel",
    href: "/goodies/filter-generator"
  },
  {
    name: "Grid / Flexbox Playground",
    description: "Live CSS Grid and Flexbox editor — container and per-item controls, editable grid tracks, a Holy Grail layout preset, and CSS/Tailwind/React code export.",
    icon: "gridLayout",
    href: "/goodies/layout-playground"
  },
  {
    name: "Easing Curve Editor",
    description: "Draggable cubic-bezier() editor with a slide/scale/opacity/rotate preview animation, presets from the CSS Easing Functions guide, and CSS/Tailwind/React code export.",
    icon: "easingCurve",
    href: "/goodies/easing-curve-editor"
  },
  {
    name: "Text Effects Generator",
    description: "Layered text-shadow editor with an optional gradient text fill, neon/3D/glitch/chrome presets, and CSS/Tailwind/React code export.",
    icon: "textEffects",
    href: "/goodies/text-effects-generator"
  },
  {
    name: "Fluid Type Calculator",
    description: "Min/max viewport → clamp() font-size calculator with an arbitrary list of named steps, a draggable viewport-width live preview, and CSS custom-property/Tailwind/React export.",
    icon: "fluidType",
    href: "/goodies/fluid-type-calculator"
  },
  {
    name: "Color-Mix Space Playground",
    description: "color-mix() editor comparing srgb/hsl/hwb/lch/oklch/lab/oklab interpolation side by side on the same two colors, a ratio-driven result swatch, and CSS/Tailwind/React code export.",
    icon: "colorMix",
    href: "/goodies/color-mix-playground"
  },
  {
    name: "Color Palette & Contrast Checker",
    description: "WCAG contrast ratio checker with AA/AAA pass/fail badges, plus a shade/tint ramp generated from a single seed color — perceptually-uniform OKLCH or a naive RGB-mix ramp for comparison.",
    icon: "colorPalette",
    href: "/goodies/color-palette-generator"
  },
  {
    name: "Regex Tester",
    description: "Live match highlighting with numbered/named capture groups, a plain-English explain panel that breaks the pattern down piece by piece, and JavaScript/Python/Java export.",
    icon: "regex",
    href: "/goodies/regex-tester"
  },
  {
    name: "Cron Expression Builder",
    description: "Bidirectional cron builder — per-field mode widgets generate the 5-field string, a plain-English description reads it back, and a live next-5-runs preview with crontab/GitHub Actions/Kubernetes export.",
    icon: "cron",
    href: "/goodies/cron-expression-builder"
  },
  {
    name: "CSS Triangle / Arrow Generator",
    description: "Triangle and chevron/arrow shapes comparing two CSS techniques side by side — the classic border trick and clip-path polygon() — with direction/size/color controls and real-world tooltip/breadcrumb/carousel-arrow presets.",
    icon: "triangle",
    href: "/goodies/triangle-generator"
  },
  {
    name: "JSON ⇄ TS Interface Generator",
    description: "Bidirectional JSON/TypeScript converter — generate nested, de-duplicated interfaces with optional-field inference from JSON, or a sample JSON payload from hand-typed TS interfaces.",
    icon: "jsonToTs",
    href: "/goodies/json-to-ts"
  }
];
