/*
  Value type a single control produces — kept broad since one values object holds every control's
  current value regardless of type.
*/
export type SvgDemoValue = number | string | boolean;

// Live values keyed by control id.
export type SvgDemoValues = Record<string, SvgDemoValue>;

// A numeric slider control — produces a number.
export interface SvgDemoRangeControl {
  id: string;
  label: string;
  type: "range";
  min: number;
  // A function derives the bound from the demo's live values (e.g. rx capped at width / 2) instead of a fixed number.
  max: number | ((values: SvgDemoValues) => number);
  /*
    Defaults to 1 when omitted. Use "any" when max can be fractional (e.g. derived from another value) — an integer
    step paired with a fractional max leaves the native thumb's step grid unable to land on the true value, so it
    visually snaps back to the nearest valid step instead of tracking the number the control actually holds.
  */
  step?: number | "any";
  defaultValue: number;
}

// A color-picker control — produces a hex string.
export interface SvgDemoColorControl {
  id: string;
  label: string;
  type: "color";
  defaultValue: string;
}

// A fixed-choice dropdown — produces one of `options`.
export interface SvgDemoSelectControl {
  id: string;
  label: string;
  type: "select";
  options: string[];
  defaultValue: string;
}

// An on/off toggle — produces a boolean.
export interface SvgDemoCheckboxControl {
  id: string;
  label: string;
  type: "checkbox";
  defaultValue: boolean;
}

// Discriminated union of every control an InteractiveSvgPanel demo can expose — `type` narrows to the matching shape.
export type SvgDemoControl = SvgDemoRangeControl | SvgDemoColorControl | SvgDemoSelectControl | SvgDemoCheckboxControl;

// Static metadata for one interactive SVG demo — resolved by slug, mirrors SandboxMeta's registry pattern.
export interface SvgDemoMeta {
  slug: string;
  title: string;
  controls: SvgDemoControl[];
  // Builds the SVG markup for the current control values — the same string drives the live code view and the rendered preview.
  render: (values: SvgDemoValues) => string;
}

/*
  Registry of every interactive SVG demo, resolved by slug (mirrors sandboxes.ts). Each entry's
  `render` is the single source of truth for that demo — its output drives both the live code
  view and the live rendered preview in <InteractiveSvgPanel>.

  This "circle-demo" entry is a worked example to prove the machinery end-to-end; swap it out or
  add more once a post has decided which shapes/attributes it actually wants to showcase.
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
  <!-- Shape: a line connects two points, (x1, y1) → (x2, y2). -->
  <line x1="${values.x1}" y1="${values.y1}" x2="${values.x2}" y2="${values.y2}" stroke="#6366f1" stroke-width="2" stroke-linecap="round" />

  <!-- Guidelines: trace the bounding box between the two endpoints. -->
  <line x1="${values.x1}" y1="${values.y1}" x2="${values.x2}" y2="${values.y1}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />
  <line x1="${values.x2}" y1="${values.y1}" x2="${values.x2}" y2="${values.y2}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />

  <!-- Guide points: (x1, y1) and (x2, y2). -->
  <circle cx="${values.x1}" cy="${values.y1}" r="3" fill="#6366f1" opacity="0.2" />
  <circle cx="${values.x1}" cy="${values.y1}" r="2" fill="#6366f1" />
  <circle cx="${values.x2}" cy="${values.y2}" r="3" fill="#6366f1" opacity="0.2" />
  <circle cx="${values.x2}" cy="${values.y2}" r="2" fill="#6366f1" />
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
      const x = Number(values.x);
      const y = Number(values.y);
      const x2 = x + Number(values.width);
      const y2 = y + Number(values.height);
      const guideTopY = Math.max(2, y - 6);
      const guideRightX = Math.min(98, x2 + 6);

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Shape: a rectangle starts at (x, y) and extends by width × height. -->
  <!-- rx and ry round the horizontal and vertical corners. -->
  <rect x="${values.x}" y="${values.y}" width="${values.width}" height="${values.height}" rx="${values.rx}" ry="${values.ry}" fill="#6366f1" fill-opacity="0.2" stroke="#4338ca" stroke-width="2" />

  <!-- Guidelines: mark the width and height, offset outside the rectangle. -->
  <line x1="${x}" y1="${guideTopY}" x2="${x2}" y2="${guideTopY}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />
  <line x1="${guideRightX}" y1="${y}" x2="${guideRightX}" y2="${y2}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />

  <!-- Guide points: the (x, y) anchor and the derived (x + width, y + height) corner. -->
  <circle cx="${x}" cy="${y}" r="3" fill="#4338ca" opacity="0.2" />
  <circle cx="${x}" cy="${y}" r="2" fill="#4338ca" />
  <circle cx="${x2}" cy="${y2}" r="3" fill="#4338ca" opacity="0.2" />
  <circle cx="${x2}" cy="${y2}" r="2" fill="#4338ca" />
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
      const cx = Number(values.cx);
      const cy = Number(values.cy);
      const edgeX = cx + Number(values.r);

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Shape: a circle is defined by its center point (cx, cy) and radius r. -->
  <circle cx="${values.cx}" cy="${values.cy}" r="${values.r}" fill="#f43f5e" fill-opacity="0.2" stroke="#be123c" stroke-width="2" />

  <!-- Guidelines: a dashed radius guide reaching from the center to the edge. -->
  <line x1="${cx}" y1="${cy}" x2="${edgeX}" y2="${cy}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />

  <!-- Guide points: the center and the point r units to its right. -->
  <circle cx="${cx}" cy="${cy}" r="3" fill="#be123c" opacity="0.2" />
  <circle cx="${cx}" cy="${cy}" r="2" fill="#be123c" />
  <circle cx="${edgeX}" cy="${cy}" r="3" fill="#be123c" opacity="0.2" />
  <circle cx="${edgeX}" cy="${cy}" r="2" fill="#be123c" />
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
      const cx = Number(values.cx);
      const cy = Number(values.cy);
      const edgeX = cx + Number(values.rx);
      const edgeY = cy + Number(values.ry);

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Shape: an ellipse uses two radii, rx for horizontal size and ry for vertical size. -->
  <ellipse cx="${values.cx}" cy="${values.cy}" rx="${values.rx}" ry="${values.ry}" fill="#ec4899" fill-opacity="0.2" stroke="#be185d" stroke-width="2" />

  <!-- Guidelines: separate dashed guides for rx and ry, reaching from the center to each edge. -->
  <line x1="${cx}" y1="${cy}" x2="${edgeX}" y2="${cy}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />
  <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${edgeY}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />

  <!-- Guide points: the center and the rx/ry edge points. -->
  <circle cx="${cx}" cy="${cy}" r="3" fill="#be185d" opacity="0.2" />
  <circle cx="${cx}" cy="${cy}" r="2" fill="#be185d" />
  <circle cx="${edgeX}" cy="${cy}" r="3" fill="#be185d" opacity="0.2" />
  <circle cx="${edgeX}" cy="${cy}" r="2" fill="#be185d" />
  <circle cx="${cx}" cy="${edgeY}" r="3" fill="#be185d" opacity="0.2" />
  <circle cx="${cx}" cy="${edgeY}" r="2" fill="#be185d" />
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
  <!-- Shape: a polyline connects multiple points but does not automatically close the final segment. -->
  <polyline points="${points}" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Guide points: one marker per vertex from the points list. -->
  <circle cx="${values.x1}" cy="${values.y1}" r="3" fill="#10b981" opacity="0.2" />
  <circle cx="${values.x1}" cy="${values.y1}" r="2" fill="#10b981" />
  <circle cx="${values.x2}" cy="${values.y2}" r="3" fill="#10b981" opacity="0.2" />
  <circle cx="${values.x2}" cy="${values.y2}" r="2" fill="#10b981" />
  <circle cx="${values.x3}" cy="${values.y3}" r="3" fill="#10b981" opacity="0.2" />
  <circle cx="${values.x3}" cy="${values.y3}" r="2" fill="#10b981" />
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
  <!-- Shape: a polygon connects multiple points and automatically closes the shape. -->
  <polygon points="${points}" fill="#f59e0b" fill-opacity="0.2" stroke="#b45309" stroke-width="2" stroke-linejoin="round" />

  <!-- Guide points: one marker per vertex, including the last one the browser auto-connects back to the first. -->
  <circle cx="${values.x1}" cy="${values.y1}" r="3" fill="#b45309" opacity="0.2" />
  <circle cx="${values.x1}" cy="${values.y1}" r="2" fill="#b45309" />
  <circle cx="${values.x2}" cy="${values.y2}" r="3" fill="#b45309" opacity="0.2" />
  <circle cx="${values.x2}" cy="${values.y2}" r="2" fill="#b45309" />
  <circle cx="${values.x3}" cy="${values.y3}" r="3" fill="#b45309" opacity="0.2" />
  <circle cx="${values.x3}" cy="${values.y3}" r="2" fill="#b45309" />
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
      // Guide points scale with stroke-width so they stay visible past a thick stroke instead of getting swallowed by it.
      const dotR = Number(values.strokeWidth) + 1;
      const haloR = dotR + 1;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Shape: a fixed zigzag whose presentation attributes the controls above edit. -->
  <${tag} points="10,80 30,20 50,80 70,20 90,80" ${fillAttr} stroke="${values.stroke}" stroke-opacity="${values.strokeOpacity}" stroke-width="${values.strokeWidth}" stroke-linecap="${values.strokeLinecap}" stroke-linejoin="${values.strokeLinejoin}"${dasharrayAttr} />

  <!-- Guide points: the five fixed vertices from the points list. -->
  <circle cx="10" cy="80" r="${haloR}" fill="${values.stroke}" opacity="0.2" />
  <circle cx="10" cy="80" r="${dotR}" fill="${values.stroke}" />
  <circle cx="30" cy="20" r="${haloR}" fill="${values.stroke}" opacity="0.2" />
  <circle cx="30" cy="20" r="${dotR}" fill="${values.stroke}" />
  <circle cx="50" cy="80" r="${haloR}" fill="${values.stroke}" opacity="0.2" />
  <circle cx="50" cy="80" r="${dotR}" fill="${values.stroke}" />
  <circle cx="70" cy="20" r="${haloR}" fill="${values.stroke}" opacity="0.2" />
  <circle cx="70" cy="20" r="${dotR}" fill="${values.stroke}" />
  <circle cx="90" cy="80" r="${haloR}" fill="${values.stroke}" opacity="0.2" />
  <circle cx="90" cy="80" r="${dotR}" fill="${values.stroke}" />
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
  },
  {
    slug: "polygon-vs-polyline-demo",
    title: "Free-Form Points",
    controls: [
      { id: "mode", label: "Element", type: "select", options: ["polygon", "polyline"], defaultValue: "polygon" },
      { id: "x1", label: "Point 1 x", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 },
      { id: "y1", label: "Point 1 y", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 },
      { id: "x2", label: "Point 2 x", type: "range", min: 0, max: 100, step: 1, defaultValue: 80 },
      { id: "y2", label: "Point 2 y", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 },
      { id: "x3", label: "Point 3 x", type: "range", min: 0, max: 100, step: 1, defaultValue: 80 },
      { id: "y3", label: "Point 3 y", type: "range", min: 0, max: 100, step: 1, defaultValue: 80 },
      { id: "x4", label: "Point 4 x", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 },
      { id: "y4", label: "Point 4 y", type: "range", min: 0, max: 100, step: 1, defaultValue: 80 },
      { id: "fill", label: "Fill", type: "color", defaultValue: "#6366f1" },
      { id: "stroke", label: "Stroke", type: "color", defaultValue: "#4338ca" },
      { id: "strokeWidth", label: "Stroke width", type: "range", min: 1, max: 6, step: 1, defaultValue: 2 }
    ],
    // Swapping to "polyline" drops the auto-close and the fill, so the same scrambled points that make a self-intersecting polygon also show the open "phantom fill" contrast.
    render: (values) => {
      const tag = values.mode === "polyline" ? "polyline" : "polygon";
      const points = `${values.x1},${values.y1} ${values.x2},${values.y2} ${values.x3},${values.y3} ${values.x4},${values.y4}`;
      const fillAttr = values.mode === "polyline" ? `fill="none"` : `fill="${values.fill}" fill-opacity="0.25"`;
      // Guide points scale with stroke-width so they stay visible past a thick stroke instead of getting swallowed by it.
      const dotR = Number(values.strokeWidth) + 1;
      const haloR = dotR + 1;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Shape: the four draggable points, closed as a polygon or left open as a polyline. -->
  <${tag} points="${points}" ${fillAttr} stroke="${values.stroke}" stroke-width="${values.strokeWidth}" stroke-linejoin="round" stroke-linecap="round" />

  <!-- Guide points: the four vertices from the controls above. -->
  <circle cx="${values.x1}" cy="${values.y1}" r="${haloR}" fill="${values.stroke}" opacity="0.2" />
  <circle cx="${values.x1}" cy="${values.y1}" r="${dotR}" fill="${values.stroke}" />
  <circle cx="${values.x2}" cy="${values.y2}" r="${haloR}" fill="${values.stroke}" opacity="0.2" />
  <circle cx="${values.x2}" cy="${values.y2}" r="${dotR}" fill="${values.stroke}" />
  <circle cx="${values.x3}" cy="${values.y3}" r="${haloR}" fill="${values.stroke}" opacity="0.2" />
  <circle cx="${values.x3}" cy="${values.y3}" r="${dotR}" fill="${values.stroke}" />
  <circle cx="${values.x4}" cy="${values.y4}" r="${haloR}" fill="${values.stroke}" opacity="0.2" />
  <circle cx="${values.x4}" cy="${values.y4}" r="${dotR}" fill="${values.stroke}" />
</svg>`;
    }
  },
  {
    slug: "polygon-vs-polyline-shape-presets",
    title: "Shape Presets",
    controls: [
      { id: "preset", label: "Preset", type: "select", options: ["square", "hexagon", "star"], defaultValue: "square" },
      { id: "mode", label: "Element", type: "select", options: ["polygon", "polyline"], defaultValue: "polygon" },
      { id: "fill", label: "Fill", type: "color", defaultValue: "#6366f1" },
      { id: "stroke", label: "Stroke", type: "color", defaultValue: "#4338ca" },
      { id: "strokeWidth", label: "Stroke width", type: "range", min: 1, max: 6, step: 1, defaultValue: 2 }
    ],
    render: (values) => {
      type Point = [number, number];

      const presets: Record<string, Point[]> = {
        // Four corners of a square, listed clockwise from the top-left.
        square: [
          [25, 25],
          [75, 25],
          [75, 75],
          [25, 75]
        ],

        // Six vertices forming a regular-looking hexagon.
        hexagon: [
          [50, 10],
          [85, 30],
          [85, 70],
          [50, 90],
          [15, 70],
          [15, 30]
        ],

        // Ten alternating outer and inner vertices forming a five-pointed star.
        star: [
          [50, 5],
          [61, 35],
          [95, 35],
          [67, 55],
          [78, 85],
          [50, 65],
          [22, 85],
          [33, 55],
          [5, 35],
          [39, 35]
        ]
      };

      const preset = String(values.preset);
      const points: Point[] = presets[preset] ?? presets.square;
      const pointsString = points.map(([x, y]: Point) => `${x},${y}`).join(" ");
      const tag = values.mode === "polyline" ? "polyline" : "polygon";
      const fillAttr = values.mode === "polyline" ? `fill="none"` : `fill="${values.fill}" fill-opacity="0.25"`;
      // Guide points scale with stroke-width so they stay visible past a thick stroke instead of getting swallowed by it.
      const dotR = Number(values.strokeWidth) + 1;
      const haloR = dotR + 1;
      const guidePoints = points
        .map(
          ([x, y]: Point) => `
  <circle cx="${x}" cy="${y}" r="${haloR}" fill="${values.stroke}" opacity="0.2" />
  <circle cx="${x}" cy="${y}" r="${dotR}" fill="${values.stroke}" />`
        )
        .join("");

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Shape: the selected preset's vertices, closed as a polygon or left open as a polyline. -->
  <${tag} points="${pointsString}" ${fillAttr} stroke="${values.stroke}" stroke-width="${values.strokeWidth}" stroke-linejoin="round" stroke-linecap="round" />

  <!-- Guide points: every vertex of the current preset. -->${guidePoints}
</svg>`;
    }
  }
];

// Looks up an interactive SVG demo's registry entry by slug.
export function getSvgDemoBySlug(slug: string): SvgDemoMeta | undefined {
  return svgDemos.find((demo) => demo.slug === slug);
}
