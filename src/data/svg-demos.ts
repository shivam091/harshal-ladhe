import type { SvgDemoMeta, SvgDemoRangeControl, SvgDemoValues } from "@/interfaces/svg-demo";

/*
  Registry of every interactive SVG demo, resolved by slug (mirrors sandboxes.ts). Each entry's
  `render` is the single source of truth for that demo — its output drives both the live code
  view and the live rendered preview in <InteractiveSvgPanel>.

  This "circle-demo" entry is a worked example to prove the machinery end-to-end; swap it out or
  add more once a post has decided which shapes/attributes it actually wants to showcase.

  Declare newest-first.
*/

/*
  Resolves a range control's effective max against the demo's live values (e.g. rx capped at width / 2).
  Floored at `min` so a dependency shrinking too far can't produce an inverted (max < min) native range.
*/
export function resolveRangeMax(control: SvgDemoRangeControl, values: SvgDemoValues): number {
  const resolved = typeof control.max === "function" ? control.max(values) : control.max;
  return Math.max(control.min, resolved);
}

export const svgDemos: SvgDemoMeta[] = [
  {
    slug: "line-demo",
    title: "Interactive Example - Line",
    controls: [
      { id: "x1", label: "x1", type: "range", min: 0, max: 100, step: 1, defaultValue: 10 },
      { id: "y1", label: "y1", type: "range", min: 0, max: 100, step: 1, defaultValue: 10 },
      { id: "x2", label: "x2", type: "range", min: 0, max: 100, step: 1, defaultValue: 90 },
      { id: "y2", label: "y2", type: "range", min: 0, max: 100, step: 1, defaultValue: 90 }
    ],
    render: (values) => {
      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- A line connects two points: (x1, y1) → (x2, y2). -->
  <line x1="${values.x1}" y1="${values.y1}" x2="${values.x2}" y2="${values.y2}" stroke="#6366f1" stroke-width="2" stroke-linecap="round" />
</svg>`;
    }
  },
  {
    slug: "rect-demo",
    title: "Interactive Example - Rectangle",
    controls: [
      { id: "x", label: "x", type: "range", min: 0, max: 100, step: 1, defaultValue: 15 },
      { id: "y", label: "y", type: "range", min: 0, max: 100, step: 1, defaultValue: 15 },
      { id: "width", label: "width", type: "range", min: 1, max: 100, step: 1, defaultValue: 70 },
      { id: "height", label: "height", type: "range", min: 1, max: 100, step: 1, defaultValue: 50 },
      { id: "rx", label: "rx (horizontal corner radius)", type: "range", min: 0, max: (values) => Number(values.width) / 2, step: 0.01, defaultValue: 10 },
      { id: "ry", label: "ry (vertical corner radius)", type: "range", min: 0, max: (values) => Number(values.height) / 2, step: 0.01, defaultValue: 10 }
    ],
    render: (values) => {
      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- A rectangle starts at (x, y) and extends by width × height. -->
  <!-- rx and ry round the horizontal and vertical corners. -->
  <rect x="${values.x}" y="${values.y}" width="${values.width}" height="${values.height}" rx="${values.rx}" ry="${values.ry}" fill="#6366f1" fill-opacity="0.2" stroke="#4338ca" stroke-width="2" />
</svg>`;
    }
  },
  {
    slug: "circle-demo",
    title: "Interactive Example - Circle",
    controls: [
      { id: "cx", label: "cx (center x)", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "cy", label: "cy (center y)", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "r", label: "r (radius)", type: "range", min: 1, max: 50, step: 1, defaultValue: 30 }
    ],
    render: (values) => {
      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- A circle is defined by its center point (cx, cy) and radius r. -->
  <circle cx="${values.cx}" cy="${values.cy}" r="${values.r}" fill="#f43f5e" fill-opacity="0.2" stroke="#be123c" stroke-width="2" />
</svg>`;
    }
  },
  {
    slug: "ellipse-demo",
    title: "Interactive Example - Ellipse",
    controls: [
      { id: "cx", label: "cx (center x)", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "cy", label: "cy (center y)", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "rx", label: "rx (horizontal radius)", type: "range", min: 1, max: 50, step: 1, defaultValue: 40 },
      { id: "ry", label: "ry (vertical radius)", type: "range", min: 1, max: 50, step: 1, defaultValue: 25 }
    ],
    render: (values) => {
      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- An ellipse uses two radii: rx controls horizontal size and ry controls vertical size. -->
  <ellipse cx="${values.cx}" cy="${values.cy}" rx="${values.rx}" ry="${values.ry}" fill="#ec4899" fill-opacity="0.2" stroke="#be185d" stroke-width="2" />
</svg>`;
    }
  },
  {
    slug: "polyline-demo",
    title: "Interactive Example - Polyline",
    controls: [
      { id: "x1", label: "x1 (start)", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 },
      { id: "y1", label: "y1 (start)", type: "range", min: 0, max: 100, step: 1, defaultValue: 80 },
      { id: "x2", label: "x2 (apex)", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "y2", label: "y2 (apex)", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 },
      { id: "x3", label: "x3 (end)", type: "range", min: 0, max: 100, step: 1, defaultValue: 80 },
      { id: "y3", label: "y3 (end)", type: "range", min: 0, max: 100, step: 1, defaultValue: 80 }
    ],
    render: (values) => {
      const points = `${values.x1},${values.y1} ${values.x2},${values.y2} ${values.x3},${values.y3}`;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- A polyline connects multiple points but does not automatically close the final segment. -->
  <polyline points="${points}" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;
    }
  },
  {
    slug: "polygon-demo",
    title: "Interactive Example - Polygon",
    controls: [
      { id: "x1", label: "x1 (top vertex)", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "y1", label: "y1 (top vertex)", type: "range", min: 0, max: 100, step: 1, defaultValue: 15 },
      { id: "x2", label: "x2 (right vertex)", type: "range", min: 0, max: 100, step: 1, defaultValue: 85 },
      { id: "y2", label: "y2 (right vertex)", type: "range", min: 0, max: 100, step: 1, defaultValue: 85 },
      { id: "x3", label: "x3 (left vertex)", type: "range", min: 0, max: 100, step: 1, defaultValue: 15 },
      { id: "y3", label: "y3 (left vertex)", type: "range", min: 0, max: 100, step: 1, defaultValue: 85 }
    ],
    render: (values) => {
      const points = `${values.x1},${values.y1} ${values.x2},${values.y2} ${values.x3},${values.y3}`;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- A polygon connects multiple points and automatically closes the shape. -->
  <polygon points="${points}" fill="#f59e0b" fill-opacity="0.2" stroke="#b45309" stroke-width="2" stroke-linejoin="round" />
</svg>`;
    }
  },
  {
    slug: "presentation-attributes-demo",
    title: "Presentation Attributes",
    controls: [
      { id: "closed", label: "Closed shape (polygon)", type: "checkbox", defaultValue: true },
      { id: "fill", label: "Fill", type: "color", defaultValue: "#6366f1" },
      { id: "fillOpacity", label: "Fill opacity", type: "range", min: 0, max: 1, step: 0.05, defaultValue: 0.3 },
      { id: "stroke", label: "Stroke", type: "color", defaultValue: "#4338ca" },
      { id: "strokeWidth", label: "Stroke width", type: "range", min: 1, max: 12, step: 1, defaultValue: 2 },
      { id: "strokeOpacity", label: "Stroke opacity", type: "range", min: 0, max: 1, step: 0.05, defaultValue: 1 },
      { id: "strokeDasharray", label: "Stroke dasharray", type: "select", options: ["none", "4 2", "8 4", "2 6", "1 4"], defaultValue: "none" },
      { id: "strokeLinecap", label: "Stroke linecap", type: "select", options: ["butt", "round", "square"], defaultValue: "round" },
      { id: "strokeLinejoin", label: "Stroke linejoin", type: "select", options: ["miter", "round", "bevel"], defaultValue: "round" }
    ],
    render: (values) => {
      const tag = values.closed ? "polygon" : "polyline";
      const fillAttr = values.closed ? `fill="${values.fill}" fill-opacity="${values.fillOpacity}"` : `fill="none"`;
      const dasharrayAttr = values.strokeDasharray === "none" ? "" : ` stroke-dasharray="${values.strokeDasharray}"`;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <${tag} points="10,80 30,20 50,80 70,20 90,80" ${fillAttr} stroke="${values.stroke}" stroke-opacity="${values.strokeOpacity}" stroke-width="${values.strokeWidth}" stroke-linecap="${values.strokeLinecap}" stroke-linejoin="${values.strokeLinejoin}"${dasharrayAttr} />
</svg>`;
    }
  },
  {
    slug: "radar-demo",
    title: "Radar Scanner",
    controls: [
      { id: "speed", label: "Rotation speed", type: "range", min: 0, max: 10, step: 0.5, defaultValue: 2 },
      { id: "pulse", label: "Pulse intensity", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 }
    ],
    /*
      The preview pane is replaced wholesale via innerHTML on every control change, so a JS
      requestAnimationFrame loop can't persist across renders — CSS animations can, since the
      browser drives them independently once the markup is in place. Rotation speed becomes an
      animation-duration (derived from the old rAF's degrees-added-per-frame value at 60fps) and
      pulse intensity becomes the keyframe's peak scale, so both sliders still drive the motion,
      just through CSS instead of a script tag that would never execute inside dangerouslySetInnerHTML.
    */
    render: (values) => {
      const speed = Number(values.speed);
      const pulseScale = (1 + Number(values.pulse) / 100).toFixed(2);
      const duration = speed > 0 ? (360 / (speed * 60)).toFixed(2) : "0";
      const playState = speed > 0 ? "running" : "paused";

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <defs>
    <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0.6" />
    </linearGradient>
  </defs>
  <style>
    .grid-line {
      stroke: var(--color-fg-accent);
      opacity: 0.2;
    }

    @keyframes radar-sweep {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    @keyframes radar-pulse {
      0%,
      100% {
        transform: scale(1);
      }

      50% {
        transform: scale(${pulseScale});
      }
    }

    #radar-group {
      transform-origin: 50px 50px;
      animation: radar-sweep ${duration}s linear infinite;
      animation-play-state: ${playState};
    }

    #pulse-circle {
      transform-origin: 50px 50px;
      animation: radar-pulse 1.26s ease-in-out infinite;
    }
  </style>
  <circle cx="50" cy="50" r="40" fill="none" class="grid-line" stroke-width="0.5" />
  <circle cx="50" cy="50" r="25" fill="none" class="grid-line" stroke-width="0.5" />
  <line x1="10" y1="50" x2="90" y2="50" class="grid-line" stroke-width="0.5" />
  <line x1="50" y1="10" x2="50" y2="90" class="grid-line" stroke-width="0.5" />
  <circle id="pulse-circle" cx="50" cy="50" r="5" fill="#6366f1" opacity="0.5" />
  <g id="radar-group">
    <path id="radar-beam" d="M50,50 L50,10 A40,40 0 0,1 90,50 Z" fill="url(#beamGradient)" />
    <line x1="50" y1="50" x2="50" y2="10" stroke="#6366f1" stroke-width="1" stroke-linecap="round" />
  </g>
</svg>`;
    }
  }
];

// Looks up an interactive SVG demo's registry entry by slug.
export function getSvgDemoBySlug(slug: string): SvgDemoMeta | undefined {
  return svgDemos.find((demo) => demo.slug === slug);
}
