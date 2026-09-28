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
    slug: "path-m-command-demo",
    title: "Path Command: M (MoveTo)",
    controls: [
      { id: "coordinateSystem", label: "Coordinate System", type: "select", options: ["absolute", "relative"], defaultValue: "absolute" },
      { id: "x", label: "Start X", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 },
      { id: "y", label: "Start Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 }
    ],
    render: (values) => {
      const x = Number(values.x);
      const y = Number(values.y);
      const relative = values.coordinateSystem === "relative";
      const command = relative ? "m" : "M";

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Coordinate guides -->
  <line x1="${x}" y1="0" x2="${x}" y2="100" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.45" />
  <line x1="0" y1="${y}" x2="100" y2="${y}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.45" />

  <!-- MoveTo point -->
  <circle cx="${x}" cy="${y}" r="2" fill="#6366f1" opacity="0.2" />
  <circle cx="${x}" cy="${y}" r="1" fill="#6366f1" />

  <!-- M command -->
  <path d="${command} ${x} ${y}" fill="none" stroke="#6366f1" stroke-width="1" />
</svg>`;
    }
  },
  {
    slug: "path-l-command-demo",
    title: "Path Command: L (LineTo)",
    controls: [
      { id: "coordinateSystem", label: "Coordinate System", type: "select", options: ["absolute", "relative"], defaultValue: "absolute" },
      { id: "startX", label: "Start X", type: "range", min: 0, max: 100, step: 1, defaultValue: 10 },
      { id: "startY", label: "Start Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 10 },
      { id: "endX", label: "End X", type: "range", min: 0, max: 100, step: 1, defaultValue: 90 },
      { id: "endY", label: "End Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 90 }
    ],
    render: (values) => {
      const sx = Number(values.startX);
      const sy = Number(values.startY);
      const ex = Number(values.endX);
      const ey = Number(values.endY);
      const relative = values.coordinateSystem === "relative";
      const command = relative ? "l" : "L";
      const dx = ex - sx;
      const dy = ey - sy;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Coordinate guides -->
  <line x1="${sx}" y1="${sy}" x2="${ex}" y2="${sy}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />
  <line x1="${ex}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />

  <!-- Main path -->
  <path d="M ${sx} ${sy} ${command} ${relative ? dx : ex} ${relative ? dy : ey}" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" />

  <!-- Start point -->
  <circle cx="${sx}" cy="${sy}" r="2" fill="#6366f1" opacity="0.2" />
  <circle cx="${sx}" cy="${sy}" r="1" fill="#6366f1" />

  <!-- End point -->
  <circle cx="${ex}" cy="${ey}" r="2" fill="#6366f1" opacity="0.2" />
  <circle cx="${ex}" cy="${ey}" r="1" fill="#6366f1" />
</svg>`;
    }
  },
  {
    slug: "path-h-command-demo",
    title: "Path Command: H (Horizontal LineTo)",
    controls: [
      { id: "coordinateSystem", label: "Coordinate System", type: "select", options: ["absolute", "relative"], defaultValue: "absolute" },
      { id: "endX", label: "End X", type: "range", min: 0, max: 100, step: 1, defaultValue: 90 }
    ],
    render: (values) => {
      const x = Number(values.endX);
      const relative = values.coordinateSystem === "relative";
      const command = relative ? "h" : "H";
      const startX = 10;
      const y = 50;
      const dx = x - startX;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Horizontal construction guide -->
  <line x1="${startX}" y1="${y}" x2="${x}" y2="${y}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />

  <!-- Vertical guide to endpoint -->
  <line x1="${x}" y1="20" x2="${x}" y2="80" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.4" />

  <path d="M ${startX} ${y} ${command} ${relative ? dx : x}" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" />

  <!-- Start -->
  <circle cx="${startX}" cy="${y}" r="1" fill="var(--color-fg-muted)" />

  <!-- End -->
  <circle cx="${x}" cy="${y}" r="2" fill="#10b981" opacity="0.2" />
  <circle cx="${x}" cy="${y}" r="1" fill="#10b981" />
</svg>`;
    }
  },
  {
    slug: "path-v-command-demo",
    title: "Path Command: V (Vertical LineTo)",
    controls: [
      { id: "coordinateSystem", label: "Coordinate System", type: "select", options: ["absolute", "relative"], defaultValue: "absolute" },
      { id: "endY", label: "End Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 90 }
    ],
    render: (values) => {
      const y = Number(values.endY);
      const relative = values.coordinateSystem === "relative";
      const command = relative ? "v" : "V";
      const startY = 10;
      const x = 50;
      const dy = y - startY;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Vertical construction guide -->
  <line x1="${x}" y1="${startY}" x2="${x}" y2="${y}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />

  <!-- Horizontal guide -->
  <line x1="20" y1="${y}" x2="80" y2="${y}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.4" />

  <path d="M ${x} ${startY} ${command} ${relative ? dy : y}" fill="none" stroke="#f43f5e" stroke-width="1.5" stroke-linecap="round" />

  <!-- Start -->
  <circle cx="${x}" cy="${startY}" r="1" fill="var(--color-fg-muted)" />

  <!-- End -->
  <circle cx="${x}" cy="${y}" r="2" fill="#f43f5e" opacity="0.2" />
  <circle cx="${x}" cy="${y}" r="1" fill="#f43f5e" />
</svg>`;
    }
  },
  {
    slug: "path-z-command-demo",
    title: "Path Command: Z (ClosePath)",
    controls: [
      { id: "coordinateSystem", label: "Coordinate System", type: "select", options: ["absolute", "relative"], defaultValue: "absolute" },
      { id: "peakX", label: "Peak X", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "peakY", label: "Peak Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 },
      { id: "endX", label: "End X", type: "range", min: 0, max: 100, step: 1, defaultValue: 80 },
      { id: "endY", label: "End Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 80 }
    ],
    render: (values) => {
      const x = Number(values.peakX);
      const y = Number(values.peakY);
      const relative = values.coordinateSystem === "relative";
      const command = relative ? "l" : "L";
      const startX = 20;
      const startY = 80;
      const endX = Number(values.endX);
      const endY = Number(values.endY);
      const peakDX = x - startX;
      const peakDY = y - startY;
      const endDX = endX - x;
      const endDY = endY - y;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Closing edge guide -->
  <line x1="${endX}" y1="${endY}" x2="${startX}" y2="${startY}" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.6" />

  <!-- One L, two coordinate pairs — the second "L" is implicit, per the post's shorthand tricks. -->
  <path d="M ${startX} ${startY} ${command} ${relative ? peakDX : x} ${relative ? peakDY : y} ${relative ? endDX : endX} ${relative ? endDY : endY} Z" fill="#6366f1" fill-opacity="0.2" stroke="#6366f1" stroke-width="1.5" stroke-linejoin="round" />

  <!-- Start / close point -->
  <circle cx="${startX}" cy="${startY}" r="2" fill="#6366f1" opacity="0.2" />
  <circle cx="${startX}" cy="${startY}" r="1" fill="#6366f1" />

  <!-- Peak -->
  <circle cx="${x}" cy="${y}" r="2" fill="#6366f1" opacity="0.2" />
  <circle cx="${x}" cy="${y}" r="1" fill="#6366f1" />

  <!-- End -->
  <circle cx="${endX}" cy="${endY}" r="1" fill="var(--color-fg-muted)" />
</svg>`;
    }
  },
  {
    slug: "path-q-command-demo",
    title: "Path Command: Q (Quadratic Bézier)",
    controls: [
      { id: "coordinateSystem", label: "Coordinate System", type: "select", options: ["absolute", "relative"], defaultValue: "absolute" },
      { id: "startX", label: "Start X", type: "range", min: 0, max: 100, step: 1, defaultValue: 10 },
      { id: "startY", label: "Start Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "controlX", label: "Control X", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "controlY", label: "Control Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 10 },
      { id: "endX", label: "End X", type: "range", min: 0, max: 100, step: 1, defaultValue: 90 },
      { id: "endY", label: "End Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 }
    ],
    render: (values) => {
      const sx = Number(values.startX);
      const sy = Number(values.startY);
      const cx = Number(values.controlX);
      const cy = Number(values.controlY);
      const ex = Number(values.endX);
      const ey = Number(values.endY);
      const relative = values.coordinateSystem === "relative";
      const command = relative ? "q" : "Q";

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Bézier control skeleton -->
  <path d="M ${sx} ${sy} L ${cx} ${cy} ${ex} ${ey}" fill="none" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.7" />

  <!-- Main curve -->
  <path d="M ${sx} ${sy} ${command} ${relative ? cx - sx : cx} ${relative ? cy - sy : cy} ${relative ? ex - sx : ex} ${relative ? ey - sy : ey}" fill="none" stroke="#ec4899" stroke-width="1.5" stroke-linecap="round" />

  <!-- Start -->
  <circle cx="${sx}" cy="${sy}" r="1" fill="var(--color-fg-muted)" />

  <!-- Control point -->
  <circle cx="${cx}" cy="${cy}" r="2" fill="#ec4899" opacity="0.2" />
  <circle cx="${cx}" cy="${cy}" r="1" fill="#ec4899" />

  <!-- End -->
  <circle cx="${ex}" cy="${ey}" r="1" fill="var(--color-fg-muted)" />
</svg>`;
    }
  },
  {
    slug: "path-t-command-demo",
    title: "Path Command: T (Smooth Quadratic Bézier)",
    controls: [
      { id: "coordinateSystem", label: "Coordinate System", type: "select", options: ["absolute", "relative"], defaultValue: "absolute" },
      { id: "startX", label: "Start X", type: "range", min: 0, max: 50, step: 1, defaultValue: 10 },
      { id: "startY", label: "Start Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "controlX", label: "Q Control X", type: "range", min: 0, max: 100, step: 1, defaultValue: 30 },
      { id: "controlY", label: "Q Control Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 10 },
      { id: "junctionX", label: "Junction X", type: "range", min: 20, max: 80, step: 1, defaultValue: 50 },
      { id: "junctionY", label: "Junction Y", type: "range", min: 20, max: 80, step: 1, defaultValue: 50 },
      { id: "endX", label: "End X", type: "range", min: 50, max: 100, step: 1, defaultValue: 90 },
      { id: "endY", label: "End Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 }
    ],
    render: (values) => {
      const sx = Number(values.startX);
      const sy = Number(values.startY);
      const qx = Number(values.controlX);
      const qy = Number(values.controlY);
      const jx = Number(values.junctionX);
      const jy = Number(values.junctionY);
      const ex = Number(values.endX);
      const ey = Number(values.endY);
      const relative = values.coordinateSystem === "relative";
      const command = relative ? "q" : "Q";
      const tCommand = relative ? "t" : "T";

      const reflectedX = 2 * jx - qx;
      const reflectedY = 2 * jy - qy;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- First quadratic skeleton -->
  <path d="M ${sx} ${sy} L ${qx} ${qy} ${jx} ${jy}" fill="none" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.7" />

  <!-- Reflected control skeleton -->
  <path d="M ${jx} ${jy} L ${reflectedX} ${reflectedY} ${ex} ${ey}" fill="none" stroke="var(--color-fg-accent)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.6" />

  <!-- Main path -->
  <path d="M ${sx} ${sy} ${command} ${relative ? qx - sx : qx} ${relative ? qy - sy : qy} ${relative ? jx - sx : jx} ${relative ? jy - sy : jy} ${tCommand} ${relative ? ex - jx : ex} ${relative ? ey - jy : ey}" fill="none" stroke="#ec4899" stroke-width="1.5" stroke-linecap="round" />

  <!-- Start -->
  <circle cx="${sx}" cy="${sy}" r="1" fill="var(--color-fg-muted)" />

  <!-- Original control -->
  <circle cx="${qx}" cy="${qy}" r="2" fill="#ec4899" opacity="0.2" />
  <circle cx="${qx}" cy="${qy}" r="1" fill="#ec4899" />

  <!-- Junction -->
  <circle cx="${jx}" cy="${jy}" r="2" fill="var(--color-fg-muted)" opacity="0.2" />
  <circle cx="${jx}" cy="${jy}" r="1" fill="var(--color-fg-muted)" />

  <!-- Reflected/implicit T control -->
  <circle cx="${reflectedX}" cy="${reflectedY}" r="2" fill="none" stroke="#ec4899" stroke-width="0.75" stroke-dasharray="2 2" />

  <!-- End -->
  <circle cx="${ex}" cy="${ey}" r="1" fill="var(--color-fg-muted)" />
</svg>`;
    }
  },
  {
    slug: "path-c-command-demo",
    title: "Path Command: C (Cubic Bézier)",
    controls: [
      { id: "coordinateSystem", label: "Coordinate System", type: "select", options: ["absolute", "relative"], defaultValue: "absolute" },
      { id: "startX", label: "Start X", type: "range", min: 0, max: 100, step: 1, defaultValue: 10 },
      { id: "startY", label: "Start Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "control1X", label: "C1 (Entry) X", type: "range", min: 0, max: 50, step: 1, defaultValue: 30 },
      { id: "control1Y", label: "C1 (Entry) Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 10 },
      { id: "control2X", label: "C2 (Exit) X", type: "range", min: 50, max: 100, step: 1, defaultValue: 70 },
      { id: "control2Y", label: "C2 (Exit) Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 90 },
      { id: "endX", label: "End X", type: "range", min: 0, max: 100, step: 1, defaultValue: 90 },
      { id: "endY", label: "End Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 }
    ],
    render: (values) => {
      const sx = Number(values.startX);
      const sy = Number(values.startY);
      const c1x = Number(values.control1X);
      const c1y = Number(values.control1Y);
      const c2x = Number(values.control2X);
      const c2y = Number(values.control2Y);
      const ex = Number(values.endX);
      const ey = Number(values.endY);
      const relative = values.coordinateSystem === "relative";
      const command = relative ? "c" : "C";

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- First control handle -->
  <line x1="${sx}" y1="${sy}" x2="${c1x}" y2="${c1y}" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.7" />

  <!-- Second control handle -->
  <line x1="${ex}" y1="${ey}" x2="${c2x}" y2="${c2y}" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.7" />

  <!-- Main curve -->
  <path d="M ${sx} ${sy} ${command} ${relative ? c1x - sx : c1x} ${relative ? c1y - sy : c1y} ${relative ? c2x - sx : c2x} ${relative ? c2y - sy : c2y} ${relative ? ex - sx : ex} ${relative ? ey - sy : ey}" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" />

  <!-- Start -->
  <circle cx="${sx}" cy="${sy}" r="1" fill="var(--color-fg-muted)" />

  <!-- C1 -->
  <circle cx="${c1x}" cy="${c1y}" r="2" fill="#6366f1" opacity="0.2" />
  <circle cx="${c1x}" cy="${c1y}" r="1" fill="#6366f1" />

  <!-- C2 -->
  <circle cx="${c2x}" cy="${c2y}" r="2" fill="#6366f1" opacity="0.2" />
  <circle cx="${c2x}" cy="${c2y}" r="1" fill="#6366f1" />

  <!-- End -->
  <circle cx="${ex}" cy="${ey}" r="1" fill="var(--color-fg-muted)" />
</svg>`;
    }
  },
  {
    slug: "path-s-command-demo",
    title: "Path Command: S (Smooth Cubic Bézier)",
    controls: [
      { id: "coordinateSystem", label: "Coordinate System", type: "select", options: ["absolute", "relative"], defaultValue: "absolute" },
      { id: "startX", label: "Start X", type: "range", min: 0, max: 100, step: 1, defaultValue: 10 },
      { id: "startY", label: "Start Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "control2X", label: "C2 X", type: "range", min: 10, max: 50, step: 1, defaultValue: 40 },
      { id: "control2Y", label: "C2 Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 10 },
      { id: "junctionX", label: "Junction X", type: "range", min: 30, max: 70, step: 1, defaultValue: 50 },
      { id: "junctionY", label: "Junction Y", type: "range", min: 30, max: 70, step: 1, defaultValue: 50 },
      { id: "controlS2X", label: "S2 X", type: "range", min: 50, max: 100, step: 1, defaultValue: 80 },
      { id: "controlS2Y", label: "S2 Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 90 },
      { id: "endX", label: "End X", type: "range", min: 70, max: 100, step: 1, defaultValue: 90 },
      { id: "endY", label: "End Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 }
    ],
    render: (values) => {
      const sx = Number(values.startX);
      const sy = Number(values.startY);
      const c2x = Number(values.control2X);
      const c2y = Number(values.control2Y);
      const jx = Number(values.junctionX);
      const jy = Number(values.junctionY);
      const s2x = Number(values.controlS2X);
      const s2y = Number(values.controlS2Y);
      const ex = Number(values.endX);
      const ey = Number(values.endY);
      const relative = values.coordinateSystem === "relative";
      const command = relative ? "c" : "C";
      const sCommand = relative ? "s" : "S";

      const c1x = 20;
      const c1y = 10;
      const reflectedX = 2 * jx - c2x;
      const reflectedY = 2 * jy - c2y;

      const c1 = relative ? `${c1x - sx} ${c1y - sy}` : `${c1x} ${c1y}`;
      const c2 = relative ? `${c2x - sx} ${c2y - sy}` : `${c2x} ${c2y}`;
      const firstEnd = relative ? `${jx - sx} ${jy - sy}` : `${jx} ${jy}`;
      const sControl = relative ? `${s2x - jx} ${s2y - jy}` : `${s2x} ${s2y}`;
      const secondEnd = relative ? `${ex - jx} ${ey - jy}` : `${ex} ${ey}`;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Previous cubic control skeleton -->
  <path d="M ${sx} ${sy} L ${c1x} ${c1y} ${c2x} ${c2y} ${jx} ${jy}" fill="none" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.7" />

  <!-- Smooth reflected control -->
  <path d="M ${jx} ${jy} L ${reflectedX} ${reflectedY} ${s2x} ${s2y} ${ex} ${ey}" fill="none" stroke="var(--color-fg-accent)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.65" />

  <!-- Main path -->
  <path d="M ${sx} ${sy} ${command} ${c1} ${c2} ${firstEnd} ${sCommand} ${sControl} ${secondEnd}" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" />

  <!-- Start -->
  <circle cx="${sx}" cy="${sy}" r="1" fill="var(--color-fg-muted)" />

  <!-- Previous C2 -->
  <circle cx="${c2x}" cy="${c2y}" r="2" fill="#6366f1" opacity="0.2" />
  <circle cx="${c2x}" cy="${c2y}" r="1" fill="#6366f1" />

  <!-- Junction -->
  <circle cx="${jx}" cy="${jy}" r="2" fill="var(--color-fg-muted)" opacity="0.2" />
  <circle cx="${jx}" cy="${jy}" r="1" fill="var(--color-fg-muted)" />

  <!-- Implicit reflected control -->
  <circle cx="${reflectedX}" cy="${reflectedY}" r="2" fill="none" stroke="#6366f1" stroke-width="0.75" stroke-dasharray="2 2" />

  <!-- S second control -->
  <circle cx="${s2x}" cy="${s2y}" r="2" fill="#6366f1" opacity="0.2" />
  <circle cx="${s2x}" cy="${s2y}" r="1" fill="#6366f1" />

  <!-- End -->
  <circle cx="${ex}" cy="${ey}" r="1" fill="var(--color-fg-muted)" />
</svg>`;
    }
  },
  {
    slug: "path-a-command-demo",
    title: "Path Command: A (Elliptical Arc)",
    controls: [
      { id: "coordinateSystem", label: "Coordinate System", type: "select", options: ["absolute", "relative"], defaultValue: "absolute" },
      { id: "startX", label: "Start X", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 },
      { id: "startY", label: "Start Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "rx", label: "rx", type: "range", min: 10, max: 50, step: 1, defaultValue: 30 },
      { id: "ry", label: "ry", type: "range", min: 10, max: 50, step: 1, defaultValue: 20 },
      { id: "rotation", label: "Rotation", type: "range", min: 0, max: 360, step: 1, defaultValue: 0 },
      { id: "largeArc", label: "Large Arc", type: "checkbox", defaultValue: false },
      { id: "sweep", label: "Sweep", type: "checkbox", defaultValue: true },
      { id: "endX", label: "End X", type: "range", min: 0, max: 100, step: 1, defaultValue: 80 },
      { id: "endY", label: "End Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 }
    ],
    render: (values) => {
      const sx = Number(values.startX);
      const sy = Number(values.startY);
      const rx = Number(values.rx);
      const ry = Number(values.ry);
      const rotation = Number(values.rotation);
      const largeArc = Number(values.largeArc);
      const sweep = Number(values.sweep);
      const ex = Number(values.endX);
      const ey = Number(values.endY);
      const relative = values.coordinateSystem === "relative";
      const command = relative ? "a" : "A";

      const dx = ex - sx;
      const dy = ey - sy;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Approximate ellipse used to visualize rx / ry -->
  <ellipse cx="${(sx + ex) / 2}" cy="${(sy + ey) / 2}" rx="${rx}" ry="${ry}" fill="none" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.55" transform="rotate(${rotation} ${(sx + ex) / 2} ${(sy + ey) / 2})" />

  <!-- Start-to-end chord -->
  <line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.45" />

  <!-- Arc: flags written back-to-back (e.g. "01" instead of "0 1") — see the Path Element post's shorthand tricks. -->
  <path d="M ${sx} ${sy} ${command} ${rx} ${ry} ${rotation} ${largeArc}${sweep} ${relative ? dx : ex} ${relative ? dy : ey}" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" />

  <!-- Start point -->
  <circle cx="${sx}" cy="${sy}" r="2" fill="#10b981" opacity="0.2" />
  <circle cx="${sx}" cy="${sy}" r="1" fill="#10b981" />

  <!-- End point -->
  <circle cx="${ex}" cy="${ey}" r="2" fill="#10b981" opacity="0.2" />
  <circle cx="${ex}" cy="${ey}" r="1" fill="#10b981" />

  <!-- Arc midpoint / ellipse center -->
  <circle cx="${(sx + ex) / 2}" cy="${(sy + ey) / 2}" r="1" fill="var(--color-fg-muted)" />
</svg>`;
    }
  },
  {
    slug: "heart-shape-demo",
    title: "Practical Example: The Heart Shape",
    controls: [
      { id: "radius", label: "Hump Radius", type: "range", min: 15, max: 25, step: 1, defaultValue: 20 },
      { id: "tip", label: "Tip Depth", type: "range", min: 70, max: 100, step: 1, defaultValue: 95 },
      { id: "bulge", label: "Bulge", type: "range", min: 40, max: 80, step: 1, defaultValue: 65 }
    ],
    render: (values) => {
      const r = Number(values.radius);
      const tip = Number(values.tip);
      const bulge = Number(values.bulge);

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Construction guides -->
  <path d="M 90 35 L 90 ${bulge} 50 ${tip} 10 ${bulge} 10 35" fill="none" stroke="var(--color-fg-accent)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.45" />

  <!-- Horizontal center guide -->
  <line x1="10" y1="35" x2="90" y2="35" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.4" />

  <!--
    Heart: both arcs share the same rx/ry/rotation/flags, so the second "A" is implicit — one A,
    14 numbers (7 per arc) — plus the flags themselves jammed together ("01" instead of "0 1").
    Both are the shorthand covered in the post's Common Pitfalls section.
  -->
  <path d="M 10 35 A ${r} ${r} 0 01 50 35 ${r} ${r} 0 01 90 35 Q 90 ${bulge} 50 ${tip} Q 10 ${bulge} 10 35 Z" fill="#f43f5e" fill-opacity="0.2" stroke="#e11d48" stroke-width="1.5" stroke-linejoin="round" />

  <!-- Left hump center -->
  <circle cx="30" cy="35" r="1" fill="var(--color-fg-muted)" />

  <!-- Right hump center -->
  <circle cx="70" cy="35" r="1" fill="var(--color-fg-muted)" />

  <!-- Left bulge control -->
  <circle cx="90" cy="${bulge}" r="2" fill="#e11d48" opacity="0.2" />
  <circle cx="90" cy="${bulge}" r="1" fill="#e11d48" />

  <!-- Right bulge control -->
  <circle cx="10" cy="${bulge}" r="2" fill="#e11d48" opacity="0.2" />
  <circle cx="10" cy="${bulge}" r="1" fill="#e11d48" />

  <!-- Tip -->
  <circle cx="50" cy="${tip}" r="2" fill="#e11d48" opacity="0.2" />
  <circle cx="50" cy="${tip}" r="1" fill="#e11d48" />

  <!-- Start point -->
  <circle cx="10" cy="35" r="1" fill="var(--color-fg-muted)" />

  <!-- End / close point -->
  <circle cx="10" cy="35" r="1.5" fill="var(--color-fg-muted)" />
</svg>`;
    }
  },

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
  },
  {
    slug: "polygon-vs-polyline-generated-points",
    title: "Generated Points",
    controls: [
      { id: "sides", label: "Points / sides", type: "range", min: 3, max: 12, step: 1, defaultValue: 5 },
      { id: "shape", label: "Shape", type: "select", options: ["regular", "star"], defaultValue: "star" },
      { id: "innerRatio", label: "Inner radius (star)", type: "range", min: 0.2, max: 0.9, step: 0.05, defaultValue: 0.45 },
      { id: "rotation", label: "Rotation (deg)", type: "range", min: 0, max: 359, step: 1, defaultValue: 0 },
      { id: "fill", label: "Fill", type: "color", defaultValue: "#6366f1" },
      { id: "stroke", label: "Stroke", type: "color", defaultValue: "#4338ca" }
    ],
    // Mirrors the cos/sin generator from the post, so the points string shown in the code view is exactly what that function outputs.
    render: (values) => {
      const sides = Number(values.sides);
      const isStar = values.shape === "star";
      const count = isStar ? sides * 2 : sides;
      const outer = 42;
      const inner = outer * Number(values.innerRatio);
      // Starting at -90° puts the first vertex at 12 o'clock, since SVG's y-axis points down.
      const start = ((Number(values.rotation) - 90) * Math.PI) / 180;
      const points = Array.from({ length: count }, (_, i) => {
        const radius = isStar && i % 2 === 1 ? inner : outer;
        const angle = start + (i * 2 * Math.PI) / count;
        return `${(50 + radius * Math.cos(angle)).toFixed(1)},${(50 + radius * Math.sin(angle)).toFixed(1)}`;
      }).join(" ");

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- ${count} generated vertices around (50, 50), rounded to one decimal place. -->
  <polygon points="${points}" fill="${values.fill}" fill-opacity="0.25" stroke="${values.stroke}" stroke-width="2" stroke-linejoin="round" />
</svg>`;
    }
  },
  {
    slug: "polygon-vs-polyline-miterlimit",
    title: "Miter Limit",
    controls: [
      { id: "angle", label: "Corner angle (deg)", type: "range", min: 5, max: 170, step: 1, defaultValue: 25 },
      { id: "linejoin", label: "stroke-linejoin", type: "select", options: ["miter", "round", "bevel"], defaultValue: "miter" },
      { id: "miterlimit", label: "stroke-miterlimit", type: "range", min: 1, max: 8, step: 0.5, defaultValue: 4 },
      { id: "strokeWidth", label: "Stroke width", type: "range", min: 2, max: 10, step: 1, defaultValue: 8 },
      { id: "stroke", label: "Stroke", type: "color", defaultValue: "#0ea5e9" }
    ],
    // Reports the miter ratio next to the corner, so the moment it crosses the limit (and the join flips to bevel) is visible.
    render: (values) => {
      const halfAngle = (Number(values.angle) * Math.PI) / 360;
      const armLength = 50;
      const leftX = (60 - armLength * Math.sin(halfAngle)).toFixed(1);
      const rightX = (60 + armLength * Math.sin(halfAngle)).toFixed(1);
      const endY = (62 + armLength * Math.cos(halfAngle)).toFixed(1);
      const ratio = 1 / Math.sin(halfAngle);
      const limit = Number(values.miterlimit);
      const outcome = values.linejoin !== "miter" ? `${values.linejoin} join` : ratio <= limit ? "miter drawn" : "exceeds limit: bevel";

      return `
<svg viewBox="0 0 120 120" width="240" height="240">
  <!-- Readout: miter length ÷ stroke-width = 1 / sin(angle / 2) = ${ratio.toFixed(2)} -->
  <text x="60" y="10" font-size="7" text-anchor="middle" fill="currentColor">ratio ${ratio.toFixed(2)} vs limit ${limit}: ${outcome}</text>

  <!-- Corner: a two-segment polyline bending at (60, 62). -->
  <polyline points="${leftX},${endY} 60,62 ${rightX},${endY}" fill="none" stroke="${values.stroke}" stroke-width="${values.strokeWidth}" stroke-linejoin="${values.linejoin}" stroke-miterlimit="${limit}" />
</svg>`;
    }
  },
  {
    slug: "stagger-demo",
    title: "Interactive Example - Staggered Dots",
    controls: [
      { id: "count", label: "Dot count", type: "range", min: 2, max: 8, step: 1, defaultValue: 3 },
      { id: "delayStep", label: "Delay per dot (s)", type: "range", min: 0.05, max: 0.5, step: 0.05, defaultValue: 0.15 },
      { id: "duration", label: "Duration (s)", type: "range", min: 0.4, max: 2, step: 0.1, defaultValue: 1 },
      { id: "amplitude", label: "Bounce height", type: "range", min: 4, max: 20, step: 1, defaultValue: 10 },
      { id: "color", label: "Color", type: "color", defaultValue: "#6366f1" }
    ],
    // Same rationale as radar-demo: the preview pane is replaced wholesale via innerHTML, so every
    // dot's offset is baked into its own inline animation-delay rather than relying on :nth-child.
    render: (values) => {
      const count = Math.max(2, Math.round(Number(values.count)));
      const delayStep = Number(values.delayStep);
      const duration = Number(values.duration);
      const amplitude = Number(values.amplitude);
      const color = String(values.color);
      const spacing = 100 / (count + 1);

      const dots = Array.from({ length: count }, (_, i) => {
        const cx = (spacing * (i + 1)).toFixed(2);
        const delay = (i * delayStep).toFixed(2);
        return `  <circle class="dot" cx="${cx}" cy="20" r="7" fill="${color}" style="animation-delay: ${delay}s" />`;
      }).join("\n");

      return `
<svg viewBox="0 0 100 40" width="280" height="112">
  <style>
    .dot {
      animation: bounce ${duration}s ease-in-out infinite;
    }

    @keyframes bounce {
      0%,
      100% {
        transform: translateY(0);
        opacity: 0.4;
      }

      50% {
        transform: translateY(-${amplitude}px);
        opacity: 1;
      }
    }
  </style>
${dots}
</svg>`;
    }
  },
  {
    slug: "gradient-crossfade-demo",
    title: "Interactive Example - Gradient Crossfade",
    controls: [
      { id: "colorA", label: "Base gradient color", type: "color", defaultValue: "#6366f1" },
      { id: "colorB", label: "Alt gradient color", type: "color", defaultValue: "#ec4899" },
      { id: "duration", label: "Duration (s)", type: "range", min: 1, max: 8, step: 0.5, defaultValue: 4 }
    ],
    /*
      Same rationale as radar-demo: the cross-fade's animation has to be a CSS @keyframes tied to fresh
      markup. Both gradients are complete and static — only the top rect's opacity ever animates, so this
      never depends on a browser being able to animate stop-color (or a custom property feeding it) at all.
    */
    render: (values) => {
      const colorA = String(values.colorA);
      const colorB = String(values.colorB);
      const duration = Number(values.duration);

      return `
<svg viewBox="0 0 100 60" width="280" height="168">
  <defs>
    <linearGradient id="gradientBase" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${colorA}" />
      <stop offset="100%" stop-color="#4338ca" />
    </linearGradient>
    <linearGradient id="gradientAlt" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${colorB}" />
      <stop offset="100%" stop-color="#4338ca" />
    </linearGradient>
  </defs>
  <style>
    .gradient-fade {
      animation: crossfade-gradient ${duration}s ease-in-out infinite;
    }

    @keyframes crossfade-gradient {
      0%,
      100% {
        opacity: 0;
      }

      50% {
        opacity: 1;
      }
    }
  </style>
  <rect x="10" y="15" width="80" height="30" fill="url(#gradientBase)" />
  <rect class="gradient-fade" x="10" y="15" width="80" height="30" fill="url(#gradientAlt)" />
</svg>`;
    }
  },
  {
    slug: "motion-path-demo",
    title: "Interactive Example - Orbiting Comet",
    controls: [
      { id: "duration", label: "Orbit duration (s)", type: "range", min: 1, max: 8, step: 0.5, defaultValue: 3 },
      { id: "trackRadius", label: "Track radius", type: "range", min: 20, max: 45, step: 1, defaultValue: 40 },
      { id: "rotate", label: "Follow curve (offset-rotate: auto)", type: "checkbox", defaultValue: true },
      { id: "color", label: "Color", type: "color", defaultValue: "#f59e0b" }
    ],
    // Same rationale as radar-demo: orbit speed becomes an animation-duration and the track radius is
    // baked into the path data itself, since the preview pane is replaced wholesale on every change.
    render: (values) => {
      const duration = Number(values.duration);
      const radius = Number(values.trackRadius);
      const rotate = Boolean(values.rotate) ? "auto" : "0deg";
      const color = String(values.color);
      const top = (50 - radius).toFixed(2);
      // A full-circle arc back to its own starting point is degenerate, so the endpoint lands 0.1 units short.
      const track = `M50,${top} A${radius},${radius} 0 1,1 49.9,${top}`;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <style>
    .track {
      fill: none;
      stroke: var(--color-border-default);
      stroke-width: 0.5;
      opacity: 0.3;
    }

    .comet {
      offset-path: path("${track}");
      offset-rotate: ${rotate};
      animation: orbit ${duration}s linear infinite;
    }

    @keyframes orbit {
      to {
        offset-distance: 100%;
      }
    }
  </style>
  <path class="track" d="${track}" />
  <g class="comet">
    <circle cx="0" cy="0" r="4" fill="${color}" />
    <path d="M-12,0 L-3,-2.5 L-3,2.5 Z" fill="${color}" opacity="0.5" />
  </g>
</svg>`;
    }
  },
  {
    slug: "blob-morph-demo",
    title: "Interactive Example - Shape Morph",
    controls: [
      { id: "squareness", label: "Squareness", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: "fill", label: "Fill", type: "color", defaultValue: "#6366f1" },
      { id: "stroke", label: "Stroke", type: "color", defaultValue: "#4338ca" }
    ],
    /*
      Both shapes share the same "M + 4 C + Z" command sequence — only the coordinates differ. Lerping
      every coordinate directly (rather than relying on a CSS `transition: d`, which can't animate across
      the wholesale innerHTML replace every control change triggers) morphs the circle into a rounded
      square continuously as the slider moves.
    */
    render: (values) => {
      const t = Number(values.squareness) / 100;
      const fill = String(values.fill);
      const stroke = String(values.stroke);

      const circle = [
        [80, 66.6, 66.6, 80, 50, 80],
        [33.4, 80, 20, 66.6, 20, 50],
        [20, 33.4, 33.4, 20, 50, 20],
        [66.6, 20, 80, 33.4, 80, 50]
      ];
      const square = [
        [80, 72, 72, 80, 50, 80],
        [28, 80, 20, 72, 20, 50],
        [20, 28, 28, 20, 50, 20],
        [72, 20, 80, 28, 80, 50]
      ];

      const segments = circle.map((seg, i) => seg.map((from, j) => (from + (square[i][j] - from) * t).toFixed(2)).join(","));

      const d = `M80,50 C${segments[0]} C${segments[1]} C${segments[2]} C${segments[3]} Z`;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <path d="${d}" fill="${fill}" fill-opacity="0.3" stroke="${stroke}" stroke-width="2" />
</svg>`;
    }
  },
  {
    slug: "svg-line-draw-demo",
    title: "Interactive Example - Draw-On Animation",
    controls: [
      { id: "duration", label: "Duration (s)", type: "range", min: 0.5, max: 5, step: 0.1, defaultValue: 1.5 },
      { id: "strokeWidth", label: "Stroke width", type: "range", min: 2, max: 10, step: 1, defaultValue: 6 },
      { id: "stroke", label: "Stroke color", type: "color", defaultValue: "#10b981" },
      { id: "loop", label: "Loop (draw + erase)", type: "checkbox", defaultValue: true }
    ],
    // Same rationale as radar-demo: the preview pane is replaced wholesale via innerHTML, so the animation
    // has to be a CSS @keyframes tied to fresh markup rather than a JS rAF loop that would never run.
    render: (values) => {
      const duration = Number(values.duration);
      const strokeWidth = Number(values.strokeWidth);
      const stroke = String(values.stroke);
      const loop = Boolean(values.loop);
      const iterationCount = loop ? "infinite" : "1";
      const fillMode = loop ? "none" : "forwards";
      const keyframes = loop
        ? `0%, 100% { stroke-dashoffset: 100; } 50% { stroke-dashoffset: 0; }`
        : `from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; }`;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <style>
    @keyframes draw-line {
      ${keyframes}
    }

    #draw-path {
      animation: draw-line ${duration}s ease-in-out ${iterationCount};
      animation-fill-mode: ${fillMode};
    }
  </style>
  <!-- Shape: pathLength="100" normalizes the path to 100 units regardless of its real geometry, so stroke-dasharray/stroke-dashoffset can always run 0-100. -->
  <path id="draw-path" d="M20,55 L42,77 L82,27" pathLength="100" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="100" stroke-dashoffset="100" />

  <!-- Guidelines: a faint preview of the full path, visible ahead of the drawing animation. -->
  <path d="M20,55 L42,77 L82,27" fill="none" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />

  <!-- Guide points: the path's three vertices. -->
  <circle cx="20" cy="55" r="3" fill="${stroke}" opacity="0.2" />
  <circle cx="20" cy="55" r="2" fill="${stroke}" />
  <circle cx="42" cy="77" r="3" fill="${stroke}" opacity="0.2" />
  <circle cx="42" cy="77" r="2" fill="${stroke}" />
  <circle cx="82" cy="27" r="3" fill="${stroke}" opacity="0.2" />
  <circle cx="82" cy="27" r="2" fill="${stroke}" />
</svg>`;
    }
  },
  {
    slug: "text-anchor-baseline-demo",
    title: "Interactive Example - text-anchor & dominant-baseline",
    controls: [
      { id: "x", label: "x (anchor point)", type: "range", min: 10, max: 90, step: 1, defaultValue: 50 },
      { id: "y", label: "y (anchor point)", type: "range", min: 10, max: 90, step: 1, defaultValue: 50 },
      { id: "textAnchor", label: "text-anchor", type: "select", options: ["start", "middle", "end"], defaultValue: "middle" },
      { id: "dominantBaseline", label: "dominant-baseline", type: "select", options: ["auto", "middle", "hanging", "central"], defaultValue: "auto" }
    ],
    render: (values) => {
      const x = Number(values.x);
      const y = Number(values.y);
      const anchor = String(values.textAnchor);
      const baseline = String(values.dominantBaseline);

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Guides: a crosshair marking the (x, y) point the text is positioned against. -->
  <line x1="${x}" y1="0" x2="${x}" y2="100" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.45" />
  <line x1="0" y1="${y}" x2="100" y2="${y}" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.45" />

  <!-- Anchor point -->
  <circle cx="${x}" cy="${y}" r="2" fill="#6366f1" opacity="0.25" />
  <circle cx="${x}" cy="${y}" r="1" fill="#6366f1" />

  <!-- Shape: text-anchor decides horizontal alignment relative to (x, y); dominant-baseline decides vertical alignment. -->
  <text x="${x}" y="${y}" font-size="10" font-family="sans-serif" text-anchor="${anchor}" dominant-baseline="${baseline}" fill="#4338ca">Anchor</text>
</svg>`;
    }
  },
  {
    slug: "tspan-multiline-demo",
    title: "Interactive Example - Multi-Line Text with tspan",
    controls: [
      { id: "lineSpacing", label: "Line spacing (dy)", type: "range", min: 8, max: 20, step: 1, defaultValue: 12 },
      { id: "textAnchor", label: "text-anchor", type: "select", options: ["start", "middle", "end"], defaultValue: "start" },
      { id: "highlightColor", label: "Highlighted word color", type: "color", defaultValue: "#f43f5e" }
    ],
    render: (values) => {
      const dy = Number(values.lineSpacing);
      const anchor = String(values.textAnchor);
      const color = String(values.highlightColor);
      // Each tspan repeats x so it restarts at the same horizontal position dy moved it down from, rather than continuing the previous line's ending x.
      const x = anchor === "middle" ? 50 : anchor === "end" ? 90 : 10;
      const startY = 25;

      return `
<svg viewBox="0 0 100 100" width="260" height="220">
  <!-- Guides: one baseline per line, spaced by the live line-spacing value. -->
  <line x1="5" y1="${startY}" x2="95" y2="${startY}" stroke="var(--color-border-default)" stroke-width="0.4" stroke-dasharray="2 2" opacity="0.35" />
  <line x1="5" y1="${startY + dy}" x2="95" y2="${startY + dy}" stroke="var(--color-border-default)" stroke-width="0.4" stroke-dasharray="2 2" opacity="0.35" />
  <line x1="5" y1="${startY + dy * 2}" x2="95" y2="${startY + dy * 2}" stroke="var(--color-border-default)" stroke-width="0.4" stroke-dasharray="2 2" opacity="0.35" />

  <!-- Shape: a single <text> with three <tspan>s — x resets each line back to the anchor column, dy offsets it down by lineSpacing. -->
  <text x="${x}" y="${startY}" font-size="9" font-family="sans-serif" text-anchor="${anchor}" fill="currentColor">
    <tspan x="${x}" dy="0">SVG text wraps</tspan>
    <tspan x="${x}" dy="${dy}">only where you tell it,</tspan>
    <tspan x="${x}" dy="${dy}">one <tspan fill="${color}" font-weight="700">tspan</tspan> at a time.</tspan>
  </text>
</svg>`;
    }
  },
  {
    slug: "textpath-startoffset-demo",
    title: "Interactive Example - textPath startOffset and Path Direction",
    controls: [
      { id: "startOffset", label: "startOffset (%)", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: "curveShape", label: "Curve shape", type: "select", options: ["arch", "bowl"], defaultValue: "arch" },
      { id: "direction", label: "Path direction", type: "select", options: ["left to right", "right to left (reversed)"], defaultValue: "left to right" }
    ],
    // Flips which side the glyphs land on by reversing the path data itself — the portable alternative to side="right", which only Firefox implements.
    render: (values) => {
      const offset = Number(values.startOffset);
      const reversed = values.direction !== "left to right";
      const controlY = values.curveShape === "bowl" ? 90 : 10;
      const endY = values.curveShape === "bowl" ? 30 : 70;
      const curve = reversed ? `M 90 ${endY} Q 50 ${controlY} 10 ${endY}` : `M 10 ${endY} Q 50 ${controlY} 90 ${endY}`;

      return `
<svg viewBox="0 0 100 100" width="280" height="200">
  <defs>
    <!-- The path textPath below rides along — only referenced, never itself painted. -->
    <path id="text-curve" d="${curve}" />
    <!-- Arrowhead showing which way the path data travels — glyphs always stand on the left of that direction. -->
    <marker id="text-curve-direction" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
    </marker>
  </defs>

  <!-- Guide: a faint preview of the same curve, drawn separately since the <defs> copy has no stroke of its own. -->
  <path d="${curve}" fill="none" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" marker-end="url(#text-curve-direction)" />

  <!-- Shape: <textPath> lays this <text> along "#text-curve"; startOffset slides the start point along it from wherever the path data begins. -->
  <text font-size="9" font-family="sans-serif" fill="#be185d">
    <textPath href="#text-curve" startOffset="${offset}%">Riding the curve</textPath>
  </text>
</svg>`;
    }
  },
  {
    slug: "text-textlength-demo",
    title: "Interactive Example - textLength and lengthAdjust",
    controls: [
      { id: "textLength", label: "textLength", type: "range", min: 30, max: 90, step: 1, defaultValue: 80 },
      { id: "lengthAdjust", label: "lengthAdjust", type: "select", options: ["spacing", "spacingAndGlyphs"], defaultValue: "spacing" }
    ],
    // Guides mark the exact target width so it's visible that the text is forced to span it, whichever lengthAdjust mode does the fitting.
    render: (values) => {
      const length = Number(values.textLength);
      const adjust = String(values.lengthAdjust);

      return `
<svg viewBox="0 0 100 60" width="300" height="180">
  <!-- Guides: the start x and the start x + textLength the text is forced to fill. -->
  <line x1="10" y1="10" x2="10" y2="50" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" />
  <line x1="${10 + length}" y1="10" x2="${10 + length}" y2="50" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" />

  <!-- Shape: textLength sets the advance width; lengthAdjust picks whether only the gaps change or the glyphs stretch too. -->
  <text x="10" y="35" font-size="10" font-family="sans-serif" textLength="${length}" lengthAdjust="${adjust}" fill="#4338ca">Fit to width</text>
</svg>`;
    }
  },
  {
    slug: "clippath-star-reveal-demo",
    title: "Interactive Example - clipPath Star Reveal",
    controls: [
      { id: "points", label: "Star points", type: "range", min: 3, max: 10, step: 1, defaultValue: 5 },
      { id: "outerRadius", label: "Outer radius", type: "range", min: 20, max: 45, step: 1, defaultValue: 38 },
      { id: "innerRadius", label: "Inner radius (% of outer)", type: "range", min: 20, max: 80, step: 1, defaultValue: 45 }
    ],
    // Builds a star polygon from points/outerRadius/innerRadius and uses it as a <clipPath> — the checkerboard
    // "photo" stand-in is only ever visible where it overlaps the star, with no partial edge transparency.
    render: (values) => {
      const points = Math.round(Number(values.points));
      const outerRadius = Number(values.outerRadius);
      const innerRadius = outerRadius * (Number(values.innerRadius) / 100);
      const cx = 50;
      const cy = 50;
      const total = points * 2;

      const coords: string[] = [];
      for (let i = 0; i < total; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / points) * i - Math.PI / 2;
        const x = (cx + r * Math.cos(angle)).toFixed(2);
        const y = (cy + r * Math.sin(angle)).toFixed(2);
        coords.push(`${x},${y}`);
      }
      const starPoints = coords.join(" ");

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <defs>
    <!-- Stand-in for a photo/illustration: a plain checkerboard pattern, easy to see the hard clip edge against. -->
    <pattern id="clip-checker" width="10" height="10" patternUnits="userSpaceOnUse">
      <rect width="10" height="10" fill="#e0e7ff" />
      <rect width="5" height="5" fill="#6366f1" opacity="0.35" />
      <rect x="5" y="5" width="5" height="5" fill="#6366f1" opacity="0.35" />
    </pattern>
    <!-- The clip region: everything inside this star polygon stays, everything outside is gone with no in-between. -->
    <clipPath id="star-clip">
      <polygon points="${starPoints}" />
    </clipPath>
  </defs>

  <!-- Guide: a faint outline of the clip shape itself, since the clipPath's own polygon is never painted. -->
  <polygon points="${starPoints}" fill="none" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />

  <!-- Shape: the checkerboard rect hard-clipped to the star above via clip-path="url(#star-clip)". -->
  <rect x="0" y="0" width="100" height="100" fill="url(#clip-checker)" clip-path="url(#star-clip)" />
</svg>`;
    }
  },
  {
    slug: "mask-gradient-fade-demo",
    title: "Interactive Example - Mask Gradient Fade",
    controls: [
      { id: "angle", label: "Gradient angle (deg)", type: "range", min: 0, max: 360, step: 1, defaultValue: 0 },
      { id: "stopPosition", label: "White → black transition (%)", type: "range", min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: "fill", label: "Shape color", type: "color", defaultValue: "#6366f1" }
    ],
    // Masks a solid circle with a white-to-black linear gradient — angle rotates the fade's axis, stopPosition
    // slides where along that axis white gives way to black, and the circle's opacity follows the mask's
    // luminance continuously in between rather than snapping fully on or off.
    render: (values) => {
      const angle = Number(values.angle);
      const stopPosition = Number(values.stopPosition);
      const fill = String(values.fill);
      const rad = (angle * Math.PI) / 180;
      const x1 = (50 - 50 * Math.cos(rad)).toFixed(2);
      const y1 = (50 - 50 * Math.sin(rad)).toFixed(2);
      const x2 = (50 + 50 * Math.cos(rad)).toFixed(2);
      const y2 = (50 + 50 * Math.sin(rad)).toFixed(2);

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <defs>
    <linearGradient id="mask-fade" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="${stopPosition}%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <!-- The mask's own luminance drives opacity: white areas of this gradient show the circle fully, black hides it, gray fades it partially. -->
    <mask id="fade-mask">
      <rect x="0" y="0" width="100" height="100" fill="url(#mask-fade)" />
    </mask>
  </defs>

  <!-- Shape: a solid circle whose visible opacity follows the mask's white-to-black gradient rather than a hard edge. -->
  <circle cx="50" cy="50" r="42" fill="${fill}" mask="url(#fade-mask)" />
</svg>`;
    }
  },
  {
    slug: "pattern-dot-grid-demo",
    title: "Interactive Example - Pattern Tile Anatomy",
    controls: [
      { id: "tileWidth", label: "Tile width", type: "range", min: 8, max: 40, step: 1, defaultValue: 20 },
      { id: "tileHeight", label: "Tile height", type: "range", min: 8, max: 40, step: 1, defaultValue: 20 },
      { id: "dotRadius", label: "Dot radius", type: "range", min: 0.5, max: (values) => Math.min(Number(values.tileWidth), Number(values.tileHeight)) / 2, step: 0.01, defaultValue: 3 },
      { id: "alignToShape", label: "Anchor tiles to the rect (x=5 y=5)", type: "checkbox", defaultValue: true }
    ],
    // Unchecking alignToShape drops the pattern's x/y so tiles fall back to the user-space origin — the guide follows the real first tile, making the offset from the rect visible.
    render: (values) => {
      const tileWidth = Number(values.tileWidth);
      const tileHeight = Number(values.tileHeight);
      const dotRadius = Number(values.dotRadius);
      const alignToShape = Boolean(values.alignToShape);
      const cx = tileWidth / 2;
      const cy = tileHeight / 2;
      const origin = alignToShape ? 5 : 0;
      const anchorAttributes = alignToShape ? ` x="5" y="5"` : "";

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <defs>
    <!-- Tile: one repeatable unit in real user units (patternUnits="userSpaceOnUse"). x/y set where the first tile starts — without them, tiles start at the user-space origin (0,0), not at the rect's corner. -->
    <pattern id="dot-grid-tile" patternUnits="userSpaceOnUse"${anchorAttributes} width="${tileWidth}" height="${tileHeight}">
      <circle cx="${cx}" cy="${cy}" r="${dotRadius}" fill="#6366f1" />
    </pattern>
  </defs>

  <!-- Shape: any fillable element references the tile by id through fill="url(#...)". -->
  <rect x="5" y="5" width="90" height="90" fill="url(#dot-grid-tile)" stroke="var(--color-border-default)" stroke-width="0.5" />

  <!-- Guide: outlines the first tile, wherever the pattern's x/y actually put it. -->
  <rect x="${origin}" y="${origin}" width="${tileWidth}" height="${tileHeight}" fill="none" stroke="#4338ca" stroke-width="1" stroke-dasharray="2 2" />
</svg>`;
    }
  },
  {
    slug: "pattern-diagonal-stripes-demo",
    title: "Interactive Example - patternTransform Rotation",
    controls: [
      { id: "rotation", label: "Rotation (deg)", type: "range", min: 0, max: 90, step: 1, defaultValue: 45 },
      { id: "stripeWidth", label: "Stripe width", type: "range", min: 2, max: 10, step: 1, defaultValue: 4 },
      { id: "gap", label: "Gap", type: "range", min: 2, max: 10, step: 1, defaultValue: 6 }
    ],
    // The tile itself only ever contains flat horizontal stripes — patternTransform is the only thing rotating them, kept separate on purpose.
    render: (values) => {
      const rotation = Number(values.rotation);
      const stripeWidth = Number(values.stripeWidth);
      const gap = Number(values.gap);
      const tileHeight = stripeWidth + gap;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <defs>
    <!-- Tile: a plain horizontal stripe — patternTransform rotates the whole tile grid independently of how the stripe inside it is drawn. -->
    <pattern id="diagonal-stripe-tile" patternUnits="userSpaceOnUse" width="10" height="${tileHeight}" patternTransform="rotate(${rotation})">
      <rect x="0" y="0" width="10" height="${stripeWidth}" fill="#10b981" />
    </pattern>
  </defs>

  <!-- Shape: the same flat-stripe tile reads as diagonal once patternTransform rotates the grid it's tiled on. -->
  <rect x="5" y="5" width="90" height="90" fill="url(#diagonal-stripe-tile)" stroke="var(--color-border-default)" stroke-width="0.5" />
</svg>`;
    }
  },
  {
    slug: "symbol-use-gallery-demo",
    title: "Interactive Example - symbol + use Instances",
    controls: [
      { id: "size", label: "Instance size", type: "range", min: 12, max: 32, step: 1, defaultValue: 20 },
      { id: "color1", label: "Instance 1 color", type: "color", defaultValue: "#f59e0b" },
      { id: "color2", label: "Instance 2 color", type: "color", defaultValue: "#6366f1" },
      { id: "color3", label: "Instance 3 color", type: "color", defaultValue: "#10b981" }
    ],
    render: (values) => {
      const size = Number(values.size);
      const c1 = String(values.color1);
      const c2 = String(values.color2);
      const c3 = String(values.color3);
      const starPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

      return `
<svg viewBox="0 0 100 40" width="320" height="128">
  <defs>
    <!-- One definition, referenced three times below — its own viewBox lets each <use> rescale it independently. -->
    <symbol id="star-icon" viewBox="0 0 24 24">
      <path d="${starPath}" />
    </symbol>
  </defs>

  <!-- Shape: three independent instances — same symbol, different position/size/color, none of them touching the definition or each other. -->
  <use href="#star-icon" x="8" y="${20 - size / 2}" width="${size}" height="${size}" fill="${c1}" />
  <use href="#star-icon" x="40" y="${20 - size / 2}" width="${size}" height="${size}" fill="${c2}" />
  <use href="#star-icon" x="72" y="${20 - size / 2}" width="${size}" height="${size}" fill="${c3}" />
</svg>`;
    }
  },
  {
    slug: "use-without-symbol-demo",
    title: "Interactive Example - use Without symbol",
    controls: [
      { id: "duplicateHasOwnFill", label: "Give the duplicate its own fill", type: "checkbox", defaultValue: false }
    ],
    render: (values) => {
      const hasOwnFill = Boolean(values.duplicateHasOwnFill);
      const duplicateFill = hasOwnFill ? ' fill="#f59e0b"' : "";

      return `
<svg viewBox="0 0 100 60" width="280" height="168">
  <!-- Original: colored via the WRAPPING <g>'s inherited fill, not its own attribute. -->
  <g fill="#6366f1">
    <path id="leaf-shape" d="M0,20 C0,8 8,0 20,0 C20,12 12,20 0,20 Z" transform="translate(10,20)" />
  </g>

  <!-- Duplicate: the path's own translate(10,20) travels with the clone, so this extra translate(45,0) lands it beside the original. -->
  <!-- It does NOT inherit the <g>'s blue — it falls back to SVG's default black fill unless given its own. -->
  <use href="#leaf-shape" transform="translate(45,0)"${duplicateFill} />
</svg>`;
    }
  },
  {
    slug: "nested-svg-viewport-demo",
    title: "Interactive Example - Nested svg Viewport",
    controls: [
      { id: "width", label: "Nested svg width", type: "range", min: 20, max: 70, step: 1, defaultValue: 40 },
      { id: "height", label: "Nested svg height", type: "range", min: 20, max: 70, step: 1, defaultValue: 40 }
    ],
    render: (values) => {
      const width = Number(values.width);
      const height = Number(values.height);
      const x = (100 - width) / 2;
      const y = (100 - height) / 2;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Outer content, in the OUTER 100 x 100 coordinate system. -->
  <rect x="5" y="5" width="90" height="90" fill="none" stroke="var(--color-border-default)" stroke-width="1" />

  <!-- Nested svg: its OWN independent viewBox, sized/positioned like any other element from the outer document's point of view. -->
  <svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 10 10">
    <rect width="10" height="10" fill="#171a2b" />
    <circle cx="5" cy="5" r="3.5" fill="#6366f1" />
  </svg>
</svg>`;
    }
  },
  {
    slug: "group-opacity-demo",
    title: "Interactive Example - Group opacity vs. Per-Child opacity",
    controls: [
      { id: "mode", label: "Where the transparency is set", type: "select", options: ["opacity on the g", "opacity on each circle", "fill-opacity on the g"], defaultValue: "opacity on the g" },
      { id: "amount", label: "Value", type: "range", min: 0.2, max: 1, step: 0.05, defaultValue: 0.5 }
    ],
    // opacity isn't inherited, so "on the g" composites the pair once — only the per-shape modes let the overlap show through.
    render: (values) => {
      const mode = String(values.mode);
      const amount = Number(values.amount);
      const groupAttr = mode === "opacity on the g" ? ` opacity="${amount}"` : mode === "fill-opacity on the g" ? ` fill-opacity="${amount}"` : "";
      const childAttr = mode === "opacity on each circle" ? ` opacity="${amount}"` : "";

      return `
<svg viewBox="0 0 100 60" width="300" height="180">
  <!-- Backdrop stripe, so the transparency of whatever sits on top of it is visible. -->
  <rect x="0" y="26" width="100" height="8" fill="var(--color-fg-muted)" />

  <!-- The group: where the transparency lives decides whether the overlap between the circles shows through. -->
  <g${groupAttr}>
    <circle cx="38" cy="30" r="22" fill="#6366f1"${childAttr} />
    <circle cx="62" cy="30" r="22" fill="#f59e0b"${childAttr} />
  </g>
</svg>`;
    }
  },
  {
    slug: "use-theming-demo",
    title: "Interactive Example - Theming use Instances",
    controls: [
      { id: "primary", label: "color (currentColor) on the use", type: "color", defaultValue: "#6366f1" },
      { id: "accent", label: "--icon-accent on the use", type: "color", defaultValue: "#f59e0b" },
      { id: "setAccent", label: "Set --icon-accent on the second instance", type: "checkbox", defaultValue: true }
    ],
    // Both values ride in on the use element and inherit into the clone — the symbol itself never names a colour.
    render: (values) => {
      const primary = String(values.primary);
      const accent = String(values.accent);
      const setAccent = Boolean(values.setAccent);
      const secondStyle = setAccent ? `color: ${primary}; --icon-accent: ${accent};` : `color: ${primary};`;

      return `
<svg viewBox="0 0 100 44" width="300" height="132">
  <defs>
    <!-- Two-tone badge: the ring follows currentColor, the dot follows --icon-accent, falling back to currentColor. -->
    <symbol id="theming-badge" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.5" />
      <circle cx="12" cy="12" r="4" style="fill: var(--icon-accent, currentColor)" />
    </symbol>
  </defs>

  <!-- Instance 1: only color is set, so the dot falls back to currentColor. -->
  <use href="#theming-badge" x="10" y="6" width="32" height="32" style="color: ${primary};" />

  <!-- Instance 2: color plus the custom property, inherited into its own clone only. -->
  <use href="#theming-badge" x="58" y="6" width="32" height="32" style="${secondStyle}" />
</svg>`;
    }
  },
  {
    slug: "marker-attachment-demo",
    title: "Interactive Example - marker-start/mid/end",
    controls: [
      { id: "start", label: "marker-start", type: "select", options: ["none", "dot", "arrow"], defaultValue: "none" },
      { id: "mid", label: "marker-mid", type: "select", options: ["none", "dot", "arrow"], defaultValue: "dot" },
      { id: "end", label: "marker-end", type: "select", options: ["none", "dot", "arrow"], defaultValue: "arrow" }
    ],
    render: (values) => {
      const start = String(values.start);
      const mid = String(values.mid);
      const end = String(values.end);
      const ref = (which: string) => (which === "none" ? "none" : `url(#${which}-marker)`);

      return `
<svg viewBox="0 0 100 60" width="280" height="168">
  <defs>
    <marker id="dot-marker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
      <circle cx="5" cy="5" r="4" fill="#10b981" />
    </marker>
    <marker id="arrow-marker" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#6366f1" />
    </marker>
  </defs>

  <!-- Shape: a 4-point polyline — marker-start touches only point 1, marker-mid touches points 2 and 3, marker-end touches point 4. -->
  <polyline points="10,50 35,15 65,45 90,10" fill="none" stroke="var(--color-border-default)" stroke-width="2"
    marker-start="${ref(start)}" marker-mid="${ref(mid)}" marker-end="${ref(end)}" />
</svg>`;
    }
  },
  {
    slug: "marker-orient-units-demo",
    title: "Interactive Example - marker orient and markerUnits",
    controls: [
      { id: "orient", label: "orient", type: "select", options: ["auto", "0", "auto-start-reverse"], defaultValue: "auto" },
      { id: "markerUnits", label: "markerUnits", type: "select", options: ["strokeWidth", "userSpaceOnUse"], defaultValue: "strokeWidth" },
      { id: "strokeWidth", label: "Stroke width", type: "range", min: 0.5, max: 4, step: 0.5, defaultValue: 2 }
    ],
    render: (values) => {
      const orient = String(values.orient);
      const markerUnits = String(values.markerUnits);
      const strokeWidth = Number(values.strokeWidth);
      /*
        12 user units in userSpaceOnUse mode equals 6 stroke-widths at the default stroke width of 2, so both modes
        start out the same size and only diverge once the slider moves.
      */
      const markerSize = markerUnits === "userSpaceOnUse" ? 12 : 6;

      return `
<svg viewBox="0 0 100 60" width="280" height="168">
  <defs>
    <!-- Same marker referenced at BOTH ends — orient decides whether the two arrows point outward correctly or not. -->
    <!-- markerUnits decides whether markerWidth/markerHeight are multiples of stroke-width or plain user units. -->
    <marker id="orient-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="${markerSize}" markerHeight="${markerSize}"
      markerUnits="${markerUnits}" orient="${orient}">
      <path d="M0,0 L10,5 L0,10 Z" fill="#f59e0b" />
    </marker>
  </defs>

  <!-- Shape: a bent path — its two ends travel in different directions, making orient's effect obvious. -->
  <path d="M15,45 L50,15 L85,45" stroke="#f59e0b" stroke-width="${strokeWidth}" fill="none"
    marker-start="url(#orient-arrow)" marker-end="url(#orient-arrow)" />
</svg>`;
    }
  },
  {
    slug: "linear-gradient-vector-demo",
    title: "Interactive Example - linearGradient Vector",
    controls: [
      { id: "x1", label: "x1", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: "y1", label: "y1", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: "x2", label: "x2", type: "range", min: 0, max: 100, step: 1, defaultValue: 100 },
      { id: "y2", label: "y2", type: "range", min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: "color1", label: "Stop 1", type: "color", defaultValue: "#6366f1" },
      { id: "color2", label: "Stop 2", type: "color", defaultValue: "#f59e0b" }
    ],
    render: (values) => {
      const x1 = Number(values.x1);
      const y1 = Number(values.y1);
      const x2 = Number(values.x2);
      const y2 = Number(values.y2);
      const c1 = String(values.color1);
      const c2 = String(values.color2);

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <defs>
    <!-- x1/y1/x2/y2 define a VECTOR, not just an angle — its length and direction both matter. -->
    <linearGradient id="vector-demo-gradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>

  <!-- Guide: the vector line itself, so the gradient's direction is visible, not just its result. -->
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" />

  <rect x="5" y="5" width="90" height="90" rx="6" fill="url(#vector-demo-gradient)" />
</svg>`;
    }
  },
  {
    slug: "radial-gradient-focal-demo",
    title: "Interactive Example - radialGradient Focal Point",
    controls: [
      { id: "fx", label: "fx (focal x)", type: "range", min: 20, max: 80, step: 1, defaultValue: 50 },
      { id: "fy", label: "fy (focal y)", type: "range", min: 20, max: 80, step: 1, defaultValue: 50 },
      // fr is SVG 2's focal RADIUS — a slider makes it obvious it grows a circle rather than moving a point.
      { id: "fr", label: "fr (focal radius, SVG 2)", type: "range", min: 0, max: 20, step: 1, defaultValue: 0 }
    ],
    render: (values) => {
      const fx = Number(values.fx);
      const fy = Number(values.fy);
      const fr = Number(values.fr);

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <defs>
    <!-- cx/cy/r is the outer circle; fx/fy/fr is the focal circle the 0% stop starts from. -->
    <radialGradient id="focal-demo-gradient" cx="50%" cy="50%" r="45%" fx="${fx}%" fy="${fy}%" fr="${fr}%">
      <stop offset="0%" stop-color="#fef3c7" />
      <stop offset="100%" stop-color="#b45309" />
    </radialGradient>
  </defs>

  <circle cx="50" cy="50" r="45" fill="url(#focal-demo-gradient)" />
  <!-- Guide: the focal circle's outline (fr) and its center (fx, fy). -->
  <circle cx="${fx}" cy="${fy}" r="${fr}" fill="none" stroke="#111" stroke-opacity="0.5" stroke-width="0.5" stroke-dasharray="1.5 1" />
  <circle cx="${fx}" cy="${fy}" r="1.5" fill="#111" opacity="0.5" />
</svg>`;
    }
  },
  {
    slug: "gradient-transform-demo",
    title: "Interactive Example - gradientTransform rotate()",
    controls: [
      { id: "angle", label: "rotate angle (deg)", type: "range", min: 0, max: 180, step: 5, defaultValue: 45 },
      { id: "pivot", label: "Pivot", type: "select", options: ["none (origin)", "center"], defaultValue: "center" },
      { id: "shape", label: "Shape", type: "select", options: ["square", "wide (2:1)"], defaultValue: "square" },
      { id: "units", label: "gradientUnits", type: "select", options: ["objectBoundingBox", "userSpaceOnUse"], defaultValue: "objectBoundingBox" }
    ],
    render: (values) => {
      const angle = Number(values.angle);
      const centered = values.pivot === "center";
      const wide = values.shape === "wide (2:1)";
      const userSpace = values.units === "userSpaceOnUse";
      // Both shapes share a top-left corner and height, so switching shape changes only the aspect ratio.
      const rect = { x: 10, y: 10, width: wide ? 160 : 80, height: 80 };
      const cx = rect.x + rect.width / 2;
      const cy = rect.y + rect.height / 2;
      // objectBoundingBox measures in fractions of the box; userSpaceOnUse in the SVG's own user units.
      const vector = userSpace
        ? `gradientUnits="userSpaceOnUse" x1="${rect.x}" y1="${rect.y}" x2="${rect.x + rect.width}" y2="${rect.y}"`
        : `x1="0" y1="0" x2="1" y2="0"`;
      // The pivot's coordinates are in the same units as the vector — .5 .5 in bbox units, the rect's center in user space.
      const pivot = centered ? (userSpace ? ` ${cx} ${cy}` : " .5 .5") : "";
      const pivotDot = centered ? { x: cx, y: cy } : { x: userSpace ? 0 : rect.x, y: userSpace ? 0 : rect.y };

      return `
<svg viewBox="0 0 180 100" width="360" height="200">
  <defs>
    <!-- gradientTransform rotates the gradient's own coordinate space, not the shape. -->
    <linearGradient id="transform-demo-gradient" ${vector} gradientTransform="rotate(${angle}${pivot})">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="50%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>

  <rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="url(#transform-demo-gradient)" />
  <!-- Guide: the point the rotation pivots around. -->
  <circle cx="${pivotDot.x}" cy="${pivotDot.y}" r="2.5" fill="#111" opacity="0.6" />
</svg>`;
    }
  },
  {
    slug: "gaussian-blur-demo",
    title: "Interactive Example - feGaussianBlur",
    controls: [
      { id: "stdDeviationX", label: "stdDeviation (x)", type: "range", min: 0, max: 8, step: 0.25, defaultValue: 4 },
      { id: "stdDeviationY", label: "stdDeviation (y)", type: "range", min: 0, max: 8, step: 0.25, defaultValue: 4 },
      { id: "region", label: "Filter region", type: "select", options: ["default (-10% / 120%)", "expanded (-30% / 160%)"], defaultValue: "default (-10% / 120%)" }
    ],
    render: (values) => {
      const sx = Number(values.stdDeviationX);
      const sy = Number(values.stdDeviationY);
      const expanded = String(values.region).startsWith("expanded");
      // One value when both axes match, two when they differ — the attribute takes either form.
      const stdDeviation = sx === sy ? `${sx}` : `${sx} ${sy}`;
      const regionAttrs = expanded ? ` x="-30%" y="-30%" width="160%" height="160%"` : "";

      return `
<svg viewBox="0 0 100 100" width="220" height="220">
  <defs>
    <!-- ${expanded ? "Expanded region: room for the blur to spill outward." : "No x/y/width/height: the default -10%/120% region, only 6 units of margin here."} -->
    <filter id="blur-demo-filter"${regionAttrs}>
      <feGaussianBlur in="SourceGraphic" stdDeviation="${stdDeviation}" />
    </filter>
  </defs>

  <!-- Dashed outline: the rect's own bounding box, for reference. -->
  <rect x="20" y="20" width="60" height="60" fill="none" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" />
  <rect x="20" y="20" width="60" height="60" rx="8" fill="#6366f1" filter="url(#blur-demo-filter)" />
</svg>`;
    }
  },
  {
    slug: "drop-shadow-filter-demo",
    title: "Interactive Example - Hand-Built Drop Shadow",
    controls: [
      { id: "dx", label: "dx (offset x)", type: "range", min: -10, max: 10, step: 0.5, defaultValue: 4 },
      { id: "dy", label: "dy (offset y)", type: "range", min: -10, max: 10, step: 0.5, defaultValue: 4 },
      { id: "stdDeviation", label: "stdDeviation", type: "range", min: 0, max: 6, step: 0.25, defaultValue: 2 },
      { id: "shadowColor", label: "Shadow color", type: "color", defaultValue: "#1e1b4b" },
      { id: "shadowOpacity", label: "Shadow opacity", type: "range", min: 0, max: 1, step: 0.05, defaultValue: 0.5 }
    ],
    render: (values) => {
      const dx = Number(values.dx);
      const dy = Number(values.dy);
      const stdDeviation = Number(values.stdDeviation);
      const shadowColor = String(values.shadowColor);
      const shadowOpacity = Number(values.shadowOpacity);

      return `
<svg viewBox="0 0 100 100" width="220" height="220">
  <defs>
    <filter id="shadow-demo-filter" x="-50%" y="-50%" width="200%" height="200%">
      <!-- Blur the silhouette (SourceAlpha), not the colored source, so the shadow isn't tinted like the shape. -->
      <feGaussianBlur in="SourceAlpha" stdDeviation="${stdDeviation}" result="blur" />
      <feOffset in="blur" dx="${dx}" dy="${dy}" result="offsetBlur" />
      <!-- Paint a solid color, then keep it only where the offset silhouette is. -->
      <feFlood flood-color="${shadowColor}" flood-opacity="${shadowOpacity}" result="flood" />
      <feComposite in="flood" in2="offsetBlur" operator="in" result="shadow" />
      <!-- Stack the colored shadow BEHIND the crisp original. -->
      <feMerge>
        <feMergeNode in="shadow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect x="25" y="25" width="50" height="50" rx="8" fill="#f59e0b" filter="url(#shadow-demo-filter)" />
</svg>`;
    }
  },
  {
    slug: "filters-feblend-mode-demo",
    title: "Interactive Example - feBlend Modes",
    controls: [
      { id: "mode", label: "mode", type: "select", options: ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], defaultValue: "multiply" },
      { id: "floodColor", label: "flood-color", type: "color", defaultValue: "#f59e0b" }
    ],
    render: (values) => {
      const mode = String(values.mode);
      const floodColor = String(values.floodColor);

      return `
<svg viewBox="0 0 100 100" width="220" height="220">
  <defs>
    <linearGradient id="blend-demo-gradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6366f1" />
      <stop offset="1" stop-color="#10b981" />
    </linearGradient>
    <!-- No filter attributes: the default region is fine because nothing here spills outward. -->
    <filter id="blend-demo-filter">
      <!-- feFlood fills its subregion (the whole filter region by default) with one solid color. -->
      <feFlood flood-color="${floodColor}" result="flood" />
      <!-- in = top layer, in2 = bottom layer, combined like CSS mix-blend-mode. -->
      <feBlend in="flood" in2="SourceGraphic" mode="${mode}" result="blended" />
      <!-- Trim the flood back to the shape's own silhouette. -->
      <feComposite in="blended" in2="SourceAlpha" operator="in" />
    </filter>
  </defs>

  <circle cx="50" cy="50" r="38" fill="url(#blend-demo-gradient)" filter="url(#blend-demo-filter)" />
</svg>`;
    }
  },
  {
    slug: "feturbulence-noise-demo",
    title: "Interactive Example - feTurbulence",
    controls: [
      { id: "baseFrequency", label: "baseFrequency", type: "range", min: 0.01, max: 0.3, step: 0.01, defaultValue: 0.05 },
      { id: "type", label: "type", type: "select", options: ["fractalNoise", "turbulence"], defaultValue: "fractalNoise" },
      { id: "numOctaves", label: "numOctaves", type: "range", min: 1, max: 6, step: 1, defaultValue: 3 },
      { id: "seed", label: "seed", type: "range", min: 0, max: 50, step: 1, defaultValue: 0 },
      { id: "colorSpace", label: "color-interpolation-filters", type: "select", options: ["linearRGB", "sRGB"], defaultValue: "linearRGB" }
    ],
    render: (values) => {
      const baseFrequency = Number(values.baseFrequency);
      const type = String(values.type);
      const numOctaves = Number(values.numOctaves);
      const seed = Number(values.seed);
      const colorSpace = String(values.colorSpace);

      return `
<svg viewBox="0 0 100 100" width="220" height="220">
  <defs>
    <!-- The same noise numbers read as noticeably lighter under linearRGB (the default) than under sRGB. -->
    <filter id="turbulence-demo-filter" color-interpolation-filters="${colorSpace}">
      <feTurbulence type="${type}" baseFrequency="${baseFrequency}" numOctaves="${numOctaves}" seed="${seed}" />
    </filter>
  </defs>

  <rect x="0" y="0" width="100" height="100" filter="url(#turbulence-demo-filter)" />
</svg>`;
    }
  },
  {
    slug: "fedisplacementmap-demo",
    title: "Interactive Example - feDisplacementMap",
    controls: [
      { id: "scale", label: "scale", type: "range", min: 0, max: 40, step: 1, defaultValue: 15 },
      { id: "baseFrequency", label: "baseFrequency (noise)", type: "range", min: 0.005, max: 0.1, step: 0.005, defaultValue: 0.03 },
      { id: "xChannel", label: "xChannelSelector", type: "select", options: ["R", "G", "B", "A"], defaultValue: "R" },
      { id: "yChannel", label: "yChannelSelector", type: "select", options: ["R", "G", "B", "A"], defaultValue: "G" },
      { id: "colorSpace", label: "color-interpolation-filters", type: "select", options: ["sRGB", "linearRGB"], defaultValue: "sRGB" }
    ],
    render: (values) => {
      const scale = Number(values.scale);
      const baseFrequency = Number(values.baseFrequency);
      const xChannel = String(values.xChannel);
      const yChannel = String(values.yChannel);
      const colorSpace = String(values.colorSpace);

      return `
<svg viewBox="0 0 100 100" width="220" height="220">
  <defs>
    <!-- sRGB keeps the map's 0.5 grey at 0.5; under linearRGB the map values shift, and so does the "neutral" point. -->
    <filter id="displace-demo-filter" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="${colorSpace}">
      <!-- The noise's own color channels drive HOW MUCH (and which direction) each pixel of SourceGraphic shifts. -->
      <feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" numOctaves="2" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="${scale}" xChannelSelector="${xChannel}" yChannelSelector="${yChannel}" />
    </filter>
  </defs>

  <circle cx="50" cy="50" r="35" fill="none" stroke="#6366f1" stroke-width="4" filter="url(#displace-demo-filter)" />
</svg>`;
    }
  },
  {
    slug: "fecomposite-operator-demo",
    title: "Interactive Example - feComposite Operators",
    controls: [
      { id: "operator", label: "operator", type: "select", options: ["over", "in", "out", "atop", "xor", "arithmetic"], defaultValue: "in" },
      { id: "k1", label: "k1 (arithmetic only)", type: "range", min: -1, max: 1, step: 0.1, defaultValue: 0 },
      { id: "k2", label: "k2 (arithmetic only)", type: "range", min: -1, max: 1, step: 0.1, defaultValue: 1 },
      { id: "k3", label: "k3 (arithmetic only)", type: "range", min: -1, max: 1, step: 0.1, defaultValue: 1 },
      { id: "k4", label: "k4 (arithmetic only)", type: "range", min: -1, max: 1, step: 0.1, defaultValue: 0 }
    ],
    render: (values) => {
      const operator = String(values.operator);
      // Rounded so the slider's float steps (0.30000000000000004) don't leak into the displayed markup.
      const k = [values.k1, values.k2, values.k3, values.k4].map((value) => Math.round(Number(value) * 10) / 10);
      const kAttributes = operator === "arithmetic" ? ` k1="${k[0]}" k2="${k[1]}" k3="${k[2]}" k4="${k[3]}"` : "";

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <defs>
    <filter id="composite-demo-filter" filterUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
      <!-- in (A): a blue square — feFlood limited to a primitive subregion instead of the whole filter region. -->
      <feFlood x="12" y="12" width="48" height="48" flood-color="#6366f1" result="square" />
      <!-- in2 (B): the orange circle itself (SourceGraphic). The operator decides which parts of A and B survive. -->
      <feComposite in="square" in2="SourceGraphic" operator="${operator}"${kAttributes} />
    </filter>
  </defs>

  <circle cx="60" cy="60" r="28" fill="#f59e0b" filter="url(#composite-demo-filter)" />

  <!-- Dashed guides (outside the filter) mark where A and B sit, even when the operator hides them. -->
  <rect x="12" y="12" width="48" height="48" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />
  <circle cx="60" cy="60" r="28" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />
</svg>`;
    }
  },
  {
    slug: "fecolormatrix-presets-demo",
    title: "Interactive Example - feColorMatrix type=\"matrix\"",
    controls: [
      { id: "preset", label: "matrix preset", type: "select", options: ["identity", "greyscale", "sepia", "invert", "duotone", "swap R/B"], defaultValue: "greyscale" },
      { id: "colorSpace", label: "color-interpolation-filters", type: "select", options: ["sRGB", "linearRGB"], defaultValue: "sRGB" }
    ],
    render: (values) => {
      // Each row is one output channel (R′ G′ B′ A′); each column multiplies R G B A, and the last column is a constant offset.
      const presets: Record<string, string> = {
        identity: "1 0 0 0 0\n              0 1 0 0 0\n              0 0 1 0 0\n              0 0 0 1 0",
        greyscale: "0.2126 0.7152 0.0722 0 0\n              0.2126 0.7152 0.0722 0 0\n              0.2126 0.7152 0.0722 0 0\n              0      0      0      1 0",
        sepia: "0.393 0.769 0.189 0 0\n              0.349 0.686 0.168 0 0\n              0.272 0.534 0.131 0 0\n              0     0     0     1 0",
        invert: "-1  0  0 0 1\n               0 -1  0 0 1\n               0  0 -1 0 1\n               0  0  0 1 0",
        duotone: "0.184  0.619  0.063 0 0.118\n              0.137  0.460  0.046 0 0.106\n              -0.033 -0.109 -0.011 0 0.294\n              0      0      0     1 0",
        "swap R/B": "0 0 1 0 0\n              0 1 0 0 0\n              1 0 0 0 0\n              0 0 0 1 0"
      };
      const matrix = presets[String(values.preset)] ?? presets.identity;
      const colorSpace = String(values.colorSpace);

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <defs>
    <!-- The duotone offsets (navy → amber) are sRGB numbers, so the demo defaults to sRGB; flip to linearRGB to see them drift. -->
    <filter id="colormatrix-demo-filter" color-interpolation-filters="${colorSpace}">
      <feColorMatrix type="matrix"
        values="${matrix}" />
    </filter>
  </defs>

  <g filter="url(#colormatrix-demo-filter)">
    <rect x="5" y="5" width="90" height="90" rx="8" fill="#fef3c7" />
    <circle cx="35" cy="38" r="20" fill="#ef4444" />
    <circle cx="65" cy="38" r="20" fill="#22c55e" />
    <circle cx="50" cy="64" r="20" fill="#3b82f6" />
  </g>
</svg>`;
    }
  },
  {
    slug: "femorphology-demo",
    title: "Interactive Example - feMorphology",
    controls: [
      { id: "operator", label: "operator", type: "select", options: ["dilate", "erode"], defaultValue: "dilate" },
      { id: "radius", label: "radius", type: "range", min: 0, max: 5, step: 0.5, defaultValue: 1.5 },
      { id: "outline", label: "Outline recipe (dilate alpha, flood, merge under)", type: "checkbox", defaultValue: false }
    ],
    render: (values) => {
      const operator = String(values.operator);
      const radius = Number(values.radius);
      const outline = Boolean(values.outline);
      const primitives = outline
        ? `<!-- Grow (or shrink) the silhouette, paint it one flat color, then stack the original on top. -->
      <feMorphology in="SourceAlpha" operator="${operator}" radius="${radius}" result="grown" />
      <feFlood flood-color="#0f172a" />
      <feComposite in2="grown" operator="in" result="outline" />
      <feMerge>
        <feMergeNode in="outline" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>`
        : `<!-- Applied straight to SourceGraphic: every channel, color included, takes the min (erode) or max (dilate) of its neighbours. -->
      <feMorphology in="SourceGraphic" operator="${operator}" radius="${radius}" />`;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <defs>
    <filter id="morphology-demo-filter" x="-20%" y="-20%" width="140%" height="140%">
      ${primitives}
    </filter>
  </defs>

  <g filter="url(#morphology-demo-filter)">
    <text x="50" y="45" text-anchor="middle" font-size="26" font-weight="700" font-family="system-ui, sans-serif" fill="#f59e0b">Morph</text>
    <!-- A 1.5-unit hairline: erode past radius 0.75 and it disappears entirely. -->
    <line x1="15" y1="62" x2="85" y2="62" stroke="#6366f1" stroke-width="1.5" />
    <circle cx="50" cy="80" r="8" fill="#10b981" />
  </g>
</svg>`;
    }
  },
  {
    slug: "feconvolvematrix-kernel-demo",
    title: "Interactive Example - feConvolveMatrix",
    controls: [
      { id: "kernel", label: "kernelMatrix preset", type: "select", options: ["identity", "sharpen", "box blur", "emboss", "edge detect"], defaultValue: "emboss" },
      { id: "preserveAlpha", label: "preserveAlpha", type: "checkbox", defaultValue: true }
    ],
    render: (values) => {
      // 3×3 kernels, read row by row. The divisor defaults to the kernel's sum (or 1 when the sum is 0).
      const kernels: Record<string, string> = {
        identity: "0 0 0  0 1 0  0 0 0",
        sharpen: "0 -1 0  -1 5 -1  0 -1 0",
        "box blur": "1 1 1  1 1 1  1 1 1",
        emboss: "-2 -1 0  -1 1 1  0 1 2",
        "edge detect": "-1 -1 -1  -1 8 -1  -1 -1 -1"
      };
      const kernelMatrix = kernels[String(values.kernel)] ?? kernels.identity;
      const preserveAlpha = Boolean(values.preserveAlpha);

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <defs>
    <radialGradient id="convolve-demo-gradient" cx="40%" cy="35%" r="70%">
      <stop offset="0" stop-color="#fde68a" />
      <stop offset="1" stop-color="#b45309" />
    </radialGradient>
    <!-- The kernel runs over device pixels, so the same kernel reads stronger on a 1x screen than on a 2x one. -->
    <filter id="convolve-demo-filter">
      <feConvolveMatrix order="3" kernelMatrix="${kernelMatrix}" edgeMode="duplicate" preserveAlpha="${preserveAlpha}" />
    </filter>
  </defs>

  <g filter="url(#convolve-demo-filter)">
    <rect x="5" y="5" width="90" height="90" rx="6" fill="#e0e7ff" />
    <circle cx="50" cy="42" r="26" fill="url(#convolve-demo-gradient)" />
    <text x="50" y="86" text-anchor="middle" font-size="16" font-weight="700" font-family="system-ui, sans-serif" fill="#312e81">Kernel</text>
  </g>
</svg>`;
    }
  },
  {
    slug: "felighting-demo",
    title: "Interactive Example - feDiffuseLighting / feSpecularLighting",
    controls: [
      { id: "lighting", label: "primitive", type: "select", options: ["feDiffuseLighting", "feSpecularLighting"], defaultValue: "feDiffuseLighting" },
      { id: "azimuth", label: "azimuth (feDistantLight)", type: "range", min: 0, max: 360, step: 5, defaultValue: 225 },
      { id: "elevation", label: "elevation (feDistantLight)", type: "range", min: 0, max: 90, step: 1, defaultValue: 45 },
      { id: "surfaceScale", label: "surfaceScale", type: "range", min: 0, max: 10, step: 0.5, defaultValue: 4 },
      { id: "blur", label: "bump blur (stdDeviation)", type: "range", min: 0, max: 5, step: 0.5, defaultValue: 2 },
      { id: "clip", label: "Clip light to SourceAlpha (feComposite in)", type: "checkbox", defaultValue: true }
    ],
    render: (values) => {
      const specular = values.lighting === "feSpecularLighting";
      const azimuth = Number(values.azimuth);
      const elevation = Number(values.elevation);
      const surfaceScale = Number(values.surfaceScale);
      const blur = Number(values.blur);
      const clip = Boolean(values.clip);
      const lit = clip ? "litShape" : "light";
      const light = `<feDistantLight azimuth="${azimuth}" elevation="${elevation}" />`;
      const lightingPrimitive = specular
        ? `<feSpecularLighting in="bump" surfaceScale="${surfaceScale}" specularConstant="1" specularExponent="20" lighting-color="#ffffff" result="light">
        ${light}
      </feSpecularLighting>`
        : `<feDiffuseLighting in="bump" surfaceScale="${surfaceScale}" diffuseConstant="1" lighting-color="#ffffff" result="light">
        ${light}
      </feDiffuseLighting>`;
      const clipPrimitive = clip
        ? `
      <!-- Lighting output ignores the shape: cut it back to the silhouette. -->
      <feComposite in="light" in2="SourceAlpha" operator="in" result="litShape" />`
        : "";
      const combine = specular
        ? `<!-- Specular output is a highlight layer: ADD it to the source (k2 = source, k3 = highlight). -->
      <feComposite in="SourceGraphic" in2="${lit}" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />`
        : `<!-- Diffuse output is a shading layer: MULTIPLY the source by it. -->
      <feBlend in="SourceGraphic" in2="${lit}" mode="multiply" />`;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <defs>
    <filter id="lighting-demo-filter">
      <!-- The alpha channel is the height map; blurring it turns a hard cliff edge into a rounded bevel. -->
      <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="bump" />
      ${lightingPrimitive}${clipPrimitive}
      ${combine}
    </filter>
  </defs>

  <g filter="url(#lighting-demo-filter)">
    <circle cx="30" cy="50" r="18" fill="#f59e0b" />
    <rect x="54" y="28" width="36" height="44" rx="8" fill="#6366f1" />
  </g>
</svg>`;
    }
  },
  {
    slug: "smil-animate-pulse-demo",
    title: "Interactive Example - animate",
    controls: [
      { id: "dur", label: "dur (seconds)", type: "range", min: 0.3, max: 3, step: 0.1, defaultValue: 1 },
      { id: "repeatCount", label: "repeatCount", type: "select", options: ["indefinite", "1", "3"], defaultValue: "indefinite" }
    ],
    // SMIL animations run automatically once the markup is inserted — the controls here tune the
    // <animate> element's own attributes rather than driving a static frame the way other demos do.
    render: (values) => {
      const dur = Number(values.dur);
      const repeatCount = String(values.repeatCount);

      return `
<svg viewBox="0 0 100 100" width="220" height="220">
  <circle cx="50" cy="50" r="20" fill="#6366f1">
    <animate attributeName="r" values="20;35;20" keyTimes="0;0.5;1" dur="${dur}s" repeatCount="${repeatCount}" fill="freeze" />
  </circle>
</svg>`;
    }
  },
  {
    slug: "smil-animatetransform-spin-demo",
    title: "Interactive Example - animateTransform",
    controls: [
      { id: "dur", label: "dur (seconds)", type: "range", min: 0.5, max: 5, step: 0.25, defaultValue: 2 }
    ],
    render: (values) => {
      const dur = Number(values.dur);

      return `
<svg viewBox="0 0 100 100" width="220" height="220">
  <g transform="translate(50,50)">
    <rect x="-4" y="-28" width="8" height="20" rx="2" fill="#f59e0b">
      <!-- animate can't touch transform-related attributes — animateTransform is the dedicated element for exactly that. -->
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${dur}s" repeatCount="indefinite" />
    </rect>
  </g>
</svg>`;
    }
  },
  {
    slug: "smil-animatemotion-demo",
    title: "Interactive Example - animateMotion",
    controls: [
      { id: "dur", label: "dur (seconds)", type: "range", min: 1, max: 6, step: 0.5, defaultValue: 3 }
    ],
    render: (values) => {
      const dur = Number(values.dur);
      const curve = "M 10 70 Q 50 10 90 70";

      return `
<svg viewBox="0 0 100 100" width="220" height="220">
  <!-- Guide: the same curve the circle below actually rides along. -->
  <path d="${curve}" fill="none" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" />

  <circle r="4" fill="#10b981">
    <animateMotion dur="${dur}s" repeatCount="indefinite" path="${curve}" />
  </circle>
</svg>`;
    }
  },
  {
    slug: "image-preserve-aspect-ratio-demo",
    title: "Interactive Example - image preserveAspectRatio",
    controls: [
      {
        id: "align",
        label: "align",
        type: "select",
        options: ["xMinYMin", "xMidYMin", "xMaxYMin", "xMinYMid", "xMidYMid", "xMaxYMid", "xMinYMax", "xMidYMax", "xMaxYMax", "none"],
        defaultValue: "xMidYMid"
      },
      { id: "meetOrSlice", label: "meet vs. slice", type: "select", options: ["meet", "slice"], defaultValue: "meet" }
    ],
    // Self-contained "image" content (an inline data URI) so this demo never depends on an external network resource.
    render: (values) => {
      const align = String(values.align);
      // "none" stretches to fill and takes no meet/slice keyword, so it's emitted alone to keep the code view honest.
      const value = align === "none" ? "none" : `${align} ${String(values.meetOrSlice)}`;
      const inner = encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">' +
          '<rect width="160" height="90" fill="#0f1220" />' +
          '<circle cx="40" cy="45" r="28" fill="#6366f1" />' +
          '<rect x="90" y="15" width="55" height="60" fill="#f59e0b" />' +
        '</svg>'
      );

      return `
<svg viewBox="0 0 100 100" width="220" height="220">
  <!-- The source image is wide (160x90) but the target box below is square — preserveAspectRatio decides how it fits. -->
  <image href="data:image/svg+xml,${inner}" x="10" y="10" width="80" height="80"
    preserveAspectRatio="${value}" />
  <rect x="10" y="10" width="80" height="80" fill="none" stroke="var(--color-border-default)" stroke-width="0.75" />
</svg>`;
    }
  },
  {
    slug: "foreignobject-text-wrap-demo",
    title: "Interactive Example - foreignObject Text Wrap",
    controls: [
      { id: "width", label: "Box width", type: "range", min: 30, max: 90, step: 1, defaultValue: 55 },
      { id: "height", label: "Box height", type: "range", min: 20, max: 80, step: 1, defaultValue: 60 },
      { id: "overflow", label: "overflow", type: "select", options: ["hidden", "visible"], defaultValue: "hidden" }
    ],
    render: (values) => {
      const width = Number(values.width);
      const height = Number(values.height);
      const overflow = String(values.overflow);

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Native <text> has no automatic line-wrapping — foreignObject's real HTML does, driven by ordinary CSS width/wrapping. -->
  <foreignObject x="5" y="15" width="${width}" height="${height}" style="overflow: ${overflow};">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font: 8px sans-serif; color: currentColor; line-height: 1.4;">
      This paragraph wraps automatically, the way real HTML text always has — no manual tspan line breaks required.
    </div>
  </foreignObject>

  <!-- The region's own box, outlined so you can see where content is clipped (or spills past, with overflow: visible). -->
  <rect x="5" y="15" width="${width}" height="${height}" fill="none" stroke="#6366f1" stroke-width="0.5" stroke-dasharray="2 1.5" />
</svg>`;
    }
  },
  {
    slug: "svg-accessible-name-demo",
    title: "Interactive Example - title and role",
    controls: [
      { id: "decorative", label: "Purely decorative (aria-hidden)", type: "checkbox", defaultValue: false }
    ],
    // ARIA/title changes are invisible to a sighted reader by default, so this demo renders a live
    // text readout of what a screen reader would actually announce, right inside the SVG itself.
    render: (values) => {
      const decorative = Boolean(values.decorative);
      const attrs = decorative ? 'aria-hidden="true"' : 'role="img" aria-labelledby="chart-icon-title"';
      const titleEl = decorative ? "" : '<title id="chart-icon-title">Upward sales trend</title>';
      const announcement = decorative ? "(skipped entirely — not announced)" : '"Upward sales trend, image"';

      return `
<svg viewBox="0 0 100 70" width="260" height="182">
  <g ${attrs}>
    ${titleEl}
    <polyline points="10,50 30,35 50,42 70,15 90,20" fill="none" stroke="#10b981" stroke-width="3" />
  </g>
  <text x="10" y="65" font-size="7" fill="var(--color-fg-muted)">Screen reader announces: ${announcement}</text>
</svg>`;
    }
  },
];

// Looks up an interactive SVG demo's registry entry by slug.
export function getSvgDemoBySlug(slug: string): SvgDemoMeta | undefined {
  return svgDemos.find((demo) => demo.slug === slug);
}
