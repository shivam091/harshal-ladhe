import type { SvgDemoMeta, SvgDemoRangeControl, SvgDemoValues } from "@/interfaces/svg-demo";

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
      { id: "peakY", label: "Peak Y", type: "range", min: 0, max: 100, step: 1, defaultValue: 20 }
    ],
    render: (values) => {
      const x = Number(values.peakX);
      const y = Number(values.peakY);
      const relative = values.coordinateSystem === "relative";
      const command = relative ? "l" : "L";
      const startX = 20;
      const startY = 80;
      const endX = 80;
      const endY = 80;
      const peakDX = x - startX;
      const peakDY = y - startY;
      const endDX = endX - x;
      const endDY = endY - y;

      return `
<svg viewBox="0 0 100 100" width="240" height="240">
  <!-- Closing edge guide -->
  <line x1="80" y1="80" x2="20" y2="80" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.6" />

  <path d="M ${startX} ${startY} ${command} ${relative ? peakDX : x} ${relative ? peakDY : y} ${command} ${relative ? endDX : endX} ${relative ? endDY : endY} Z" fill="#6366f1" fill-opacity="0.2" stroke="#6366f1" stroke-width="1.5" stroke-linejoin="round" />

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
  <path d="M ${sx} ${sy} L ${cx} ${cy} L ${ex} ${ey}" fill="none" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.7" />

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
  <path d="M ${sx} ${sy} L ${qx} ${qy} L ${jx} ${jy}" fill="none" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.7" />

  <!-- Reflected control skeleton -->
  <path d="M ${jx} ${jy} L ${reflectedX} ${reflectedY} L ${ex} ${ey}" fill="none" stroke="var(--color-fg-accent)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.6" />

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
  <path d="M ${sx} ${sy} L ${c1x} ${c1y} L ${c2x} ${c2y} L ${jx} ${jy}" fill="none" stroke="var(--color-border-default)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.7" />

  <!-- Smooth reflected control -->
  <path d="M ${jx} ${jy} L ${reflectedX} ${reflectedY} L ${s2x} ${s2y} L ${ex} ${ey}" fill="none" stroke="var(--color-fg-accent)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.65" />

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
      { id: "largeArc", label: "Large Arc", type: "select", options: ["0", "1"], defaultValue: "0" },
      { id: "sweep", label: "Sweep", type: "select", options: ["0", "1"], defaultValue: "1" },
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

  <!-- Arc -->
  <path d="M ${sx} ${sy} ${command} ${rx} ${ry} ${rotation} ${largeArc} ${sweep} ${relative ? dx : ex} ${relative ? dy : ey}" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" />

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
  <path d="M 90 35 L 90 ${bulge} L 50 ${tip} L 10 ${bulge} L 10 35" fill="none" stroke="var(--color-fg-accent)" stroke-width="0.75" stroke-dasharray="2 2" opacity="0.45" />

  <!-- Horizontal center guide -->
  <line x1="10" y1="35" x2="90" y2="35" stroke="var(--color-border-default)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.4" />

  <!-- Heart -->
  <path d="M 10 35 A ${r} ${r} 0 0 1 50 35 A ${r} ${r} 0 0 1 90 35 Q 90 ${bulge} 50 ${tip} Q 10 ${bulge} 10 35 Z" fill="#f43f5e" fill-opacity="0.2" stroke="#e11d48" stroke-width="1.5" stroke-linejoin="round" />

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
  }
];

// Looks up an interactive SVG demo's registry entry by slug.
export function getSvgDemoBySlug(slug: string): SvgDemoMeta | undefined {
  return svgDemos.find((demo) => demo.slug === slug);
}
