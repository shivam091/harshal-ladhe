import { parseSvg } from "@/utils/svg-to-react-parse";
import { sanitiseTree, inlineStyleSheets } from "@/utils/svg-to-react";
import { emitComponent, parseStyleDeclarations } from "@/utils/svg-to-react-jsx";
import type {
  SvgElementNode,
  SvgNode,
  SvgToReactOptions
} from "@/components/SvgToReactConverter/SvgToReactConverter.types";
import type {
  EasingDefinition,
  EasingKey,
  InheritedPaint,
  LineDrawingExportInput,
  LineDrawingSettings,
  LineDrawingShareableState,
  LineDrawingTimeline,
  PreparedArtwork,
  SelectorScheme,
  StrokeInfo,
  StrokeMeasurements,
  StrokeOverride,
  TimelineEntry
} from "@/components/LineDrawingAnimator/LineDrawingAnimator.types";

// The SVG basic shapes plus <path> — every element with a geometry the browser can measure with getTotalLength().
export const STROKEABLE_TAGS = new Set(["path", "line", "polyline", "polygon", "rect", "circle", "ellipse"]);

// Containers whose children are templates or paint servers rather than visible ink, so their shapes never join the sequence.
const NON_RENDERED_CONTAINERS = new Set(["defs", "clipPath", "mask", "marker", "pattern", "symbol", "linearGradient", "radialGradient", "filter"]);

// Paint keywords that mean "nothing is painted", so a shape carrying one has no stroke (or no fill) to animate.
const NO_PAINT = new Set(["none", "transparent"]);

// Floor for proportional durations — a tiny tick mark at constant speed would otherwise flash by in a single frame.
const MIN_STROKE_MS = 60;

// Outline width given to fill-only shapes when nothing else says how wide their stroke should be.
const DEFAULT_OUTLINE_WIDTH = 1.5;

// Above this many characters a `?state=` link starts breaking in chat apps and some servers, so bigger drawings share their settings only.
export const MAX_SHARE_STATE_LENGTH = 6000;

// The easing menu — "nib" is a slow-in, quick-settle curve that reads like a pen landing and then gliding.
export const EASINGS: EasingDefinition[] = [
  { key: "linear", label: "Linear (steady hand)", css: "linear", bezier: [0, 0, 1, 1] },
  { key: "ease", label: "Ease", css: "ease", bezier: [0.25, 0.1, 0.25, 1] },
  { key: "ease-in", label: "Ease in", css: "ease-in", bezier: [0.42, 0, 1, 1] },
  { key: "ease-out", label: "Ease out", css: "ease-out", bezier: [0, 0, 0.58, 1] },
  { key: "ease-in-out", label: "Ease in-out", css: "ease-in-out", bezier: [0.42, 0, 0.58, 1] },
  { key: "nib", label: "Nib (press and glide)", css: "cubic-bezier(0.55, 0, 0.25, 1)", bezier: [0.55, 0, 0.25, 1] }
];

// Looks an easing up by key, falling back to linear so a tampered permalink can't leave the preview without a curve.
export function getEasing(key: EasingKey): EasingDefinition {
  return EASINGS.find((easing) => easing.key === key) ?? EASINGS[0];
}

// Keeps a number inside a range — used for progress fractions and every clamped setting.
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/*
  Evaluates a CSS cubic-bezier() in JS, so the stage's hand-driven frames follow exactly the curve the
  exported CSS names. Newton–Raphson for speed, with a bisection fallback where the slope is too flat.
*/
export function createBezier([x1, y1, x2, y2]: [number, number, number, number]): (t: number) => number {
  if (x1 === y1 && x2 === y2) return (t) => t;
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const error = sampleX(t) - x;
      if (Math.abs(error) < 1e-6) return sampleY(t);
      const slope = slopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= error / slope;
    }
    let low = 0;
    let high = 1;
    t = x;
    for (let i = 0; i < 30; i++) {
      const value = sampleX(t);
      if (Math.abs(value - x) < 1e-6) break;
      if (value < x) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return sampleY(t);
  };
}

// Small seeded PRNG (mulberry32) — a "random" order must reshuffle identically from the same seed, or a permalink wouldn't reproduce it.
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Durations read best as ms when short and seconds when long.
export function formatMs(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`;
}

// Trims trailing zeros so generated CSS reads `12.5%` rather than `12.500%`.
function formatNumber(value: number, decimals = 2): string {
  return String(Number(value.toFixed(decimals)));
}

// Reads one attribute — trees keep attributes as ordered pairs, so lookups go through this rather than an index.
function getAttribute(node: SvgElementNode, name: string): string | undefined {
  return node.attributes.find(([attributeName]) => attributeName === name)?.[1];
}

// Sets (or appends) one attribute while keeping its original position, so rewritten attributes don't jump around in the export.
function setAttribute(node: SvgElementNode, name: string, value: string): void {
  const existing = node.attributes.find(([attributeName]) => attributeName === name);
  if (existing) existing[1] = value;
  else node.attributes.push([name, value]);
}

// Drops one attribute, used to retarget or untag elements between the stage tree and the export tree.
function removeAttribute(node: SvgElementNode, name: string): void {
  node.attributes = node.attributes.filter(([attributeName]) => attributeName !== name);
}

// A paint property as the element itself sets it — an inline style declaration beats the presentation attribute, as in CSS.
function ownPaint(node: SvgElementNode, property: string): string | undefined {
  const style = getAttribute(node, "style");
  const declared = style ? parseStyleDeclarations(style).find(([name]) => name === property)?.[1] : undefined;
  return (declared ?? getAttribute(node, property))?.trim();
}

// A short human label for the ledger, so "path #7" can be told apart from "path #8" without opening devtools.
function summarise(node: SvgElementNode): string {
  const read = (name: string) => getAttribute(node, name) ?? "0";
  switch (node.name) {
    case "path": {
      const d = (getAttribute(node, "d") ?? "").replace(/\s+/g, " ").trim();
      return d.length > 26 ? `${d.slice(0, 26)}…` : d;
    }
    case "line":
      return `(${read("x1")}, ${read("y1")}) → (${read("x2")}, ${read("y2")})`;
    case "polyline":
    case "polygon":
      return `${(getAttribute(node, "points") ?? "").trim().split(/[\s,]+/).filter(Boolean).length / 2} points`;
    case "rect":
      return `${read("width")} × ${read("height")}`;
    case "circle":
      return `r ${read("r")}`;
    default:
      return `${read("rx")} × ${read("ry")}`;
  }
}

/*
  Tags every stroke-able element with data-ld="n" (1-based document order) and records what its
  resolved paint says about it. Paint is resolved statically from attributes and inline styles
  rather than getComputedStyle, so ledger labels and exports don't have to wait for a render.
*/
function annotateStrokes(node: SvgElementNode, inherited: InheritedPaint, strokes: StrokeInfo[], hidden: boolean): void {
  const pick = (property: string, parent: string) => {
    const value = ownPaint(node, property);
    return !value || value === "inherit" ? parent : value;
  };
  const paint: InheritedPaint = {
    stroke: pick("stroke", inherited.stroke),
    strokeWidth: pick("stroke-width", inherited.strokeWidth),
    fill: pick("fill", inherited.fill),
    fillOpacity: pick("fill-opacity", inherited.fillOpacity)
  };
  const isHidden = hidden || NON_RENDERED_CONTAINERS.has(node.name);
  removeAttribute(node, "data-ld");

  if (!isHidden && STROKEABLE_TAGS.has(node.name)) {
    const index = strokes.length + 1;
    const hasStroke = !NO_PAINT.has(paint.stroke.toLowerCase()) && parseFloat(paint.strokeWidth) !== 0;
    const hasFill = node.name !== "line" && !NO_PAINT.has(paint.fill.toLowerCase());
    const fillOpacity = parseFloat(paint.fillOpacity);
    setAttribute(node, "data-ld", String(index));
    strokes.push({
      index,
      tag: node.name,
      summary: summarise(node),
      hasStroke,
      hasFill,
      fillColour: hasFill && !paint.fill.startsWith("url(") ? paint.fill : null,
      fillOpacity: Number.isFinite(fillOpacity) ? clamp(fillOpacity, 0, 1) : 1
    });
  }

  for (const child of node.children) {
    if (child.kind === "element") annotateStrokes(child, paint, strokes, isHidden);
  }
}

// Leftover <style> sheets (anything inlineStyleSheets couldn't flatten) would restyle the whole page once on the stage, and would fight the exported animation sheet.
function removeStyleSheets(node: SvgElementNode): number {
  let removed = 0;
  node.children = node.children.filter((child) => {
    if (child.kind === "element" && child.name === "style") {
      removed++;
      return false;
    }
    return true;
  });
  for (const child of node.children) {
    if (child.kind === "element") removed += removeStyleSheets(child);
  }
  return removed;
}

// A root without a viewBox can't scale to the paper, so one is derived from plain numeric width/height when possible.
function ensureViewBox(root: SvgElementNode): void {
  if (getAttribute(root, "viewBox")) return;
  const width = parseFloat(getAttribute(root, "width") ?? "");
  const height = parseFloat(getAttribute(root, "height") ?? "");
  if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) setAttribute(root, "viewBox", `0 0 ${width} ${height}`);
}

/*
  Parses, sanitises (via the SVG → React converter's own pass: no scripts, on* handlers or
  javascript: URLs), flattens class-based <style> rules onto elements, and tags every stroke. The
  stage, ledger and every export all read this one result, so they can never disagree about which
  element is stroke #n.
*/
export function prepareArtwork(source: string): PreparedArtwork {
  const parsed = parseSvg(source);
  if (!parsed.root) return { root: null, strokes: [], error: parsed.error, removed: 0 };

  const root = structuredClone(parsed.root);
  const counts = sanitiseTree(root);
  inlineStyleSheets(root);
  removeStyleSheets(root);
  ensureViewBox(root);

  const strokes: StrokeInfo[] = [];
  annotateStrokes(root, { stroke: "none", strokeWidth: "1", fill: "black", fillOpacity: "1" }, strokes, false);
  const error = strokes.length === 0 ? "No path, line, polyline, polygon, rect, circle or ellipse found to draw." : null;
  return { root, strokes, error, removed: counts.elements + counts.handlers + counts.urls };
}

/*
  Resolves the drawing sequence as a list of document indices. Spatial and length orders fall back
  to document order until the stage has measured, and stay stable on ties so equal strokes keep
  their authored order.
*/
export function resolveOrder(strokes: StrokeInfo[], measurements: StrokeMeasurements, settings: LineDrawingSettings, customOrder: number[] | null): number[] {
  const indices = strokes.map((stroke) => stroke.index);
  const measured = (index: number) => measurements[index] ?? { length: 0, x: 0, y: 0 };
  const byKey = (key: (index: number) => number) => [...indices].sort((a, b) => key(a) - key(b) || a - b);

  switch (settings.order) {
    case "reverse":
      return [...indices].reverse();
    case "left-right":
      return byKey((index) => measured(index).x + measured(index).y * 1e-3);
    case "top-bottom":
      return byKey((index) => measured(index).y + measured(index).x * 1e-3);
    case "longest":
      return byKey((index) => -measured(index).length);
    case "random": {
      const random = seededRandom(settings.seed);
      const shuffled = [...indices];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    case "custom": {
      const valid = new Set(indices);
      const kept = (customOrder ?? []).filter((index, position, list) => valid.has(index) && list.indexOf(index) === position);
      return [...kept, ...indices.filter((index) => !kept.includes(index))];
    }
    default:
      return indices;
  }
}

/*
  Lays every stroke out on one shared clock. Each stroke hands over to the next after
  (1 − overlap) of its own duration, plus the pen-lift stagger — so overlap 0 / stagger 0 is
  strictly sequential and overlap 100 starts everything together, staggered only by the pause.
*/
export function buildTimeline(
  artwork: PreparedArtwork,
  order: number[],
  measurements: StrokeMeasurements,
  settings: LineDrawingSettings,
  overrides: Record<string, StrokeOverride>
): LineDrawingTimeline {
  const byIndex = new Map(artwork.strokes.map((stroke) => [stroke.index, stroke]));
  const entries: TimelineEntry[] = [];
  let cursor = 0;
  let drawEnd = 0;

  order.forEach((index, position) => {
    const info = byIndex.get(index);
    if (!info) return;
    const override = overrides[String(index)] ?? {};
    const length = measurements[index]?.length ?? 0;
    const draws = !override.excluded && (info.hasStroke || settings.outlineFills);
    const entry: TimelineEntry = { index, position: position + 1, draws, start: 0, duration: 0, length, colour: null, width: null, fade: null };

    if (draws) {
      const natural = settings.durationMode === "fixed" ? settings.duration : Math.max(MIN_STROKE_MS, (length / Math.max(1, settings.speed)) * 1000);
      entry.duration = Math.max(1, override.duration ?? natural);
      entry.start = cursor;
      entry.colour = override.colour ?? (settings.overrideColour ? settings.strokeColour : info.hasStroke ? null : (info.fillColour ?? "currentColor"));
      entry.width = override.width ?? (settings.overrideWidth ? settings.strokeWidth : info.hasStroke ? null : DEFAULT_OUTLINE_WIDTH);
      cursor = entry.start + entry.duration * (1 - settings.overlap / 100) + settings.stagger;
      drawEnd = Math.max(drawEnd, entry.start + entry.duration);
    }
    if (settings.fillFade !== "off" && info.hasFill && !override.excluded) {
      // Placeholder start of -1 marks "after the last stroke" — resolved once drawEnd is known.
      const start = settings.fillFade === "each" && draws ? entry.start + entry.duration : -1;
      entry.fade = { start, duration: settings.fillDuration, to: info.fillOpacity };
    }
    entries.push(entry);
  });

  let total = drawEnd;
  for (const entry of entries) {
    if (!entry.fade) continue;
    if (entry.fade.start < 0) entry.fade.start = drawEnd;
    total = Math.max(total, entry.fade.start + entry.fade.duration);
  }
  return { entries, drawEnd, total, cycle: total + (settings.loop === "once" ? 0 : settings.hold) };
}

/*
  Maps the free-running playhead onto a moment within the drawing: clamped for "once", wrapped for
  "loop", and folded back on itself for "yoyo". An infinite playhead means "show it finished",
  which is how reduced motion parks the stage.
*/
export function cycleTime(playhead: number, timeline: LineDrawingTimeline, loop: LineDrawingSettings["loop"]): number {
  if (!Number.isFinite(playhead)) return timeline.total;
  if (loop === "once" || timeline.cycle <= 0) return clamp(playhead, 0, timeline.total);
  const within = playhead % timeline.cycle;
  if (loop === "loop") return Math.min(within, timeline.total);
  const forwards = Math.floor(playhead / timeline.cycle) % 2 === 0;
  return Math.min(forwards ? within : timeline.cycle - within, timeline.total);
}

// One stroke's draw (eased) and fill (linear) progress at a moment — the single source of truth for the stage's frames.
export function sampleEntry(entry: TimelineEntry, time: number, ease: (t: number) => number): { draw: number; fill: number } {
  const draw = entry.draws ? ease(clamp((time - entry.start) / entry.duration, 0, 1)) : 1;
  const fill = entry.fade ? clamp((time - entry.fade.start) / Math.max(1, entry.fade.duration), 0, 1) * entry.fade.to : -1;
  return { draw, fill };
}

// Plain JSON → base64 → URL-safe character swap. Mirrors every other goodie's own serialiser exactly.
export function encodeShareableState(state: LineDrawingShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null (rather than throwing) on any malformed `?state=` so callers fall back gracefully.
export function decodeShareableState(encoded: string): LineDrawingShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const parsed = JSON.parse(decodeURIComponent(escape(atob(base64)))) as LineDrawingShareableState;
    return parsed && typeof parsed === "object" && parsed.settings ? parsed : null;
  } catch {
    return null;
  }
}

// ─── Exports ────────────────────────────────────────────────────────────────

// Selectors for the SVG and React exports, whose markup carries data-ld / data-ld-fade attributes.
const DATA_SCHEME: SelectorScheme = {
  drawBase: "[data-ld]",
  fadeBase: "[data-ld-fade]",
  draw: (index) => `[data-ld="${index}"]`,
  fade: (index) => `[data-ld-fade="${index}"]`
};

// Selectors for the CSS-only export — classes are easier to hand-apply to an existing SVG than data attributes.
const CLASS_SCHEME: SelectorScheme = {
  drawBase: ".ld-stroke",
  fadeBase: ".ld-fade",
  draw: (index) => `.ld-${index}`,
  fade: (index) => `.ld-${index}`
};

// Whether a stroke can use pathLength="1" — a stroke the stage never managed to measure always falls back to it.
function usesPathLength(input: LineDrawingExportInput, entry: TimelineEntry): boolean {
  return input.settings.normalise || entry.length <= 0;
}

/*
  A stroke's dash pattern and starting offset. The gap is twice the dash and the offset pushes the
  dash's end just past the path's start — with a plain "L L" pattern the dash ends exactly at the
  start, and round line caps paint a dot there before the stroke has begun.
*/
function dashValues(input: LineDrawingExportInput, entry: TimelineEntry): { array: string; offset: string } {
  if (usesPathLength(input, entry)) return { array: "1 2", offset: "1.01" };
  const length = Math.ceil(entry.length) + 1;
  return { array: `${length} ${length * 2}`, offset: String(length) };
}

// Percentage of the loop cycle, for per-stroke @keyframes stops.
function percentOf(ms: number, cycle: number): string {
  return `${formatNumber(clamp((ms / Math.max(1, cycle)) * 100, 0, 100), 3)}%`;
}

/*
  The animation stylesheet behind the SVG, React and CSS exports. A single play-through uses one
  shared @keyframes with per-stroke animation-delay; a loop can't (delays only apply to the first
  iteration), so each stroke gets its own @keyframes placed on one shared cycle instead.
*/
function buildStylesheet(input: LineDrawingExportInput, scheme: SelectorScheme, header: string[]): string {
  const { timeline, settings } = input;
  const easing = getEasing(settings.easing).css;
  const looping = settings.loop !== "once";
  const draws = timeline.entries.filter((entry) => entry.draws);
  const fades = timeline.entries.filter((entry) => !entry.draws && entry.fade);
  const lines: string[] = [...header];
  const loopTiming = [`  animation-duration: ${Math.round(timeline.cycle)}ms;`, "  animation-timing-function: linear;", "  animation-iteration-count: infinite;", ...(settings.loop === "yoyo" ? ["  animation-direction: alternate;"] : [])];

  if (draws.length > 0) {
    lines.push(`${scheme.drawBase} {`);
    if (settings.normalise) lines.push("  stroke-dasharray: 1 2;", "  stroke-dashoffset: 1.01;");
    lines.push("  animation-fill-mode: both;", ...(looping ? loopTiming : ["  animation-name: ld-draw;", `  animation-timing-function: ${easing};`]), "}", "");
  }
  if (fades.length > 0) {
    lines.push(`${scheme.fadeBase} {`, "  animation-fill-mode: both;", ...(looping ? loopTiming : ["  animation-name: ld-fill;", "  animation-timing-function: linear;"]), "}", "");
  }

  for (const entry of draws) {
    const body: string[] = [];
    if (!settings.normalise) body.push(`  stroke-dasharray: ${dashValues(input, entry).array};`, `  stroke-dashoffset: ${dashValues(input, entry).offset};`);
    if (entry.colour) body.push(`  stroke: ${entry.colour};`);
    if (entry.width !== null) body.push(`  stroke-width: ${entry.width};`);
    if (looping) {
      body.push(`  animation-name: ld-draw-${entry.index}${entry.fade ? `, ld-fill-${entry.index}` : ""};`);
    } else if (entry.fade) {
      body.push(
        "  animation-name: ld-draw, ld-fill;",
        `  animation-duration: ${Math.round(entry.duration)}ms, ${Math.round(entry.fade.duration)}ms;`,
        `  animation-delay: ${Math.round(entry.start)}ms, ${Math.round(entry.fade.start)}ms;`,
        `  animation-timing-function: ${easing}, linear;`
      );
    } else {
      body.push(`  animation-duration: ${Math.round(entry.duration)}ms;`, `  animation-delay: ${Math.round(entry.start)}ms;`);
    }
    lines.push(`${scheme.draw(entry.index)} {`, ...body, "}", "");
  }

  for (const entry of fades) {
    if (!entry.fade) continue;
    const body = looping
      ? [`  animation-name: ld-fill-${entry.index};`]
      : [`  animation-duration: ${Math.round(entry.fade.duration)}ms;`, `  animation-delay: ${Math.round(entry.fade.start)}ms;`];
    lines.push(`${scheme.fade(entry.index)} {`, ...body, "}", "");
  }

  if (looping) {
    for (const entry of timeline.entries) {
      if (entry.draws) {
        const dash = dashValues(input, entry).offset;
        lines.push(
          `@keyframes ld-draw-${entry.index} {`,
          `  0%, ${percentOf(entry.start, timeline.cycle)} { stroke-dashoffset: ${dash}; animation-timing-function: ${easing}; }`,
          `  ${percentOf(entry.start + entry.duration, timeline.cycle)}, 100% { stroke-dashoffset: 0; }`,
          "}",
          ""
        );
      }
      if (entry.fade) {
        lines.push(
          `@keyframes ld-fill-${entry.index} {`,
          `  0%, ${percentOf(entry.fade.start, timeline.cycle)} { fill-opacity: 0; }`,
          `  ${percentOf(entry.fade.start + entry.fade.duration, timeline.cycle)}, 100% { fill-opacity: ${formatNumber(entry.fade.to)}; }`,
          "}",
          ""
        );
      }
    }
  } else {
    if (draws.length > 0) lines.push("@keyframes ld-draw {", "  to { stroke-dashoffset: 0; }", "}", "");
    if (timeline.entries.some((entry) => entry.fade)) lines.push("/* No `to` stop, so each shape fades up to its own fill-opacity. */", "@keyframes ld-fill {", "  from { fill-opacity: 0; }", "}", "");
  }

  lines.push(
    "/* Reduced motion: show the finished drawing straight away. */",
    "@media (prefers-reduced-motion: reduce) {",
    `  ${[draws.length > 0 ? scheme.drawBase : "", fades.length > 0 ? scheme.fadeBase : ""].filter(Boolean).join(", ") || scheme.drawBase} {`,
    "    animation: none;",
    "    stroke-dashoffset: 0;",
    "  }",
    "}"
  );
  return lines.join("\n");
}

// A one-line summary comment every export opens with, so a pasted snippet says what it is.
function summaryLine(input: LineDrawingExportInput): string {
  const drawn = input.timeline.entries.filter((entry) => entry.draws).length;
  const loop = input.settings.loop === "once" ? "plays once" : input.settings.loop === "yoyo" ? "yoyos forever" : "loops forever";
  return `Line drawing — ${drawn} stroke${drawn === 1 ? "" : "s"}, ${formatMs(input.timeline.total)}, ${loop}.`;
}

/*
  The artwork rewritten for export: drawn strokes keep data-ld (plus pathLength="1" when
  normalising), fill-only fades are re-tagged data-ld-fade, and excluded strokes lose their tag
  entirely so no rule can reach them.
*/
function buildExportTree(input: LineDrawingExportInput, stylesheet: string): SvgElementNode | null {
  if (!input.artwork.root) return null;
  const root = structuredClone(input.artwork.root);
  const byIndex = new Map(input.timeline.entries.map((entry) => [entry.index, entry]));

  const visit = (node: SvgElementNode) => {
    const tag = getAttribute(node, "data-ld");
    if (tag) {
      const entry = byIndex.get(Number(tag));
      removeAttribute(node, "data-ld");
      if (entry?.draws) {
        setAttribute(node, "data-ld", tag);
        if (usesPathLength(input, entry)) setAttribute(node, "pathLength", "1");
      } else if (entry?.fade) {
        setAttribute(node, "data-ld-fade", tag);
      }
    }
    for (const child of node.children) if (child.kind === "element") visit(child);
  };
  visit(root);

  if (!getAttribute(root, "xmlns")) root.attributes.unshift(["xmlns", "http://www.w3.org/2000/svg"]);
  const style: SvgNode = { kind: "element", name: "style", attributes: [], children: [{ kind: "text", value: stylesheet }] };
  root.children.unshift(style);
  return root;
}

// Escapes an attribute value for double-quoted XML output.
function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

// Prints a tree back to indented SVG markup — the stylesheet is printed verbatim, indented to sit inside its <style>.
function serialiseNode(node: SvgNode, indent: number, parent: string): string[] {
  const pad = "  ".repeat(indent);
  if (node.kind === "comment") return [`${pad}<!-- ${node.value.replace(/--/g, "- -")} -->`];
  if (node.kind === "text") {
    if (parent === "style") return node.value.split("\n").map((line) => (line ? `${pad}${line}` : ""));
    return [`${pad}${node.value.replace(/&/g, "&amp;").replace(/</g, "&lt;")}`];
  }
  const attributes = node.attributes.map(([name, value]) => ` ${name}="${escapeAttribute(value)}"`).join("");
  if (node.children.length === 0) return [`${pad}<${node.name}${attributes} />`];
  const onlyText = node.children.length === 1 && node.children[0].kind === "text" && node.name !== "style";
  if (onlyText) return [`${pad}<${node.name}${attributes}>${serialiseNode(node.children[0], 0, node.name)[0]}</${node.name}>`];
  return [`${pad}<${node.name}${attributes}>`, ...node.children.flatMap((child) => serialiseNode(child, indent + 1, node.name)), `${pad}</${node.name}>`];
}

// The self-contained animated SVG — drop it into a page or open it directly and it draws itself.
export function buildSvgExport(input: LineDrawingExportInput): string {
  const tree = buildExportTree(input, buildStylesheet(input, DATA_SCHEME, [`/* ${summaryLine(input)} */`, ""]));
  return tree ? `${serialiseNode(tree, 0, "").join("\n")}\n` : "";
}

/*
  The stylesheet alone, keyed by classes, with a comment listing which element gets which class —
  for an SVG that already lives in someone's markup and only needs the motion added.
*/
export function buildCssExport(input: LineDrawingExportInput): string {
  const byIndex = new Map(input.artwork.strokes.map((stroke) => [stroke.index, stroke]));
  const listing = input.timeline.entries
    .filter((entry) => entry.draws || entry.fade)
    .map((entry) => {
      const info = byIndex.get(entry.index);
      const classes = entry.draws ? `ld-stroke ld-${entry.index}` : `ld-fade ld-${entry.index}`;
      const pathLength = entry.draws && usesPathLength(input, entry) ? ' pathLength="1"' : "";
      return `  #${entry.index} <${info?.tag ?? "path"}> ${info?.summary ?? ""}\n      → class="${classes}"${pathLength}`;
    });
  const header = [
    "/*",
    `  ${summaryLine(input)}`,
    "  Add these classes to the matching elements (numbered in document order,",
    "  skipping anything inside <defs>, <clipPath>, <mask> or <symbol>):",
    ...listing.map((line) => line.replace("*/", "* /")),
    "*/",
    ""
  ];
  return `${buildStylesheet(input, CLASS_SCHEME, header)}\n`;
}

// Options for the SVG → React converter's emitter — a plain TypeScript component with props spread onto the root.
const REACT_EXPORT_OPTIONS: SvgToReactOptions = {
  camelCaseProps: true,
  stripCruft: true,
  inlineStyles: false,
  removeDimensions: false,
  currentColor: "off",
  spreadProps: true,
  titleProp: false,
  sizeProp: false,
  forwardRef: false,
  memo: false,
  typescript: true,
  exportStyle: "default",
  reactNative: false
};

// A React component with the stylesheet embedded, emitted by the SVG → React converter so the JSX matches that tool's output exactly.
export function buildReactExport(input: LineDrawingExportInput): string {
  const tree = buildExportTree(input, buildStylesheet(input, DATA_SCHEME, []));
  if (!tree) return "";
  return `// ${summaryLine(input)}\n${emitComponent(tree, "LineDrawing", REACT_EXPORT_OPTIONS, 0)}`;
}

/*
  A Web Animations API version that works on the user's original SVG as-is: strokes are found by
  the same document-order count the tool uses, so no attributes need adding first. Loops are
  expressed with keyframe offsets on one shared cycle, for the same reason the CSS loop is.
*/
export function buildWaapiExport(input: LineDrawingExportInput): string {
  const { timeline, settings } = input;
  const looping = settings.loop !== "once";
  const strokes = timeline.entries
    .filter((entry) => entry.draws || entry.fade)
    .map((entry) => {
      const parts = [`index: ${entry.index - 1}`];
      if (entry.draws) {
        const dash = dashValues(input, entry);
        parts.push(`dasharray: "${dash.array}"`, `offset: ${dash.offset}`, `normalise: ${usesPathLength(input, entry)}`, `delay: ${Math.round(entry.start)}`, `duration: ${Math.round(entry.duration)}`);
        if (entry.colour) parts.push(`colour: ${JSON.stringify(entry.colour)}`);
        if (entry.width !== null) parts.push(`width: ${entry.width}`);
      }
      if (entry.fade) parts.push(`fade: { delay: ${Math.round(entry.fade.start)}, duration: ${Math.round(entry.fade.duration)}, to: ${formatNumber(entry.fade.to)} }`);
      return `  { ${parts.join(", ")} }`;
    });

  return [
    `// ${summaryLine(input)}`,
    "// Call drawLines(svgElement) once the SVG is in the DOM; it returns the Animation objects for pausing or seeking.",
    "",
    `const SHAPES = "${[...STROKEABLE_TAGS].join(", ")}";`,
    `const HIDDEN = "${[...NON_RENDERED_CONTAINERS].join(", ")}";`,
    `const EASING = "${getEasing(settings.easing).css}";`,
    `const LOOP = ${looping ? `{ cycle: ${Math.round(timeline.cycle)}, direction: "${settings.loop === "yoyo" ? "alternate" : "normal"}" }` : "null"};`,
    "",
    "const STROKES = [",
    strokes.join(",\n"),
    "];",
    "",
    "// One property tween, either delayed (single play) or placed on the shared loop cycle by offsets.",
    "function tween(element, property, from, to, delay, duration, easing) {",
    "  if (!LOOP) return element.animate([{ [property]: from }, { [property]: to }], { delay, duration, easing, fill: \"both\" });",
    "  const start = Math.min(1, delay / LOOP.cycle);",
    "  const end = Math.min(1, (delay + duration) / LOOP.cycle);",
    "  return element.animate(",
    "    [{ offset: 0, [property]: from }, { offset: start, [property]: from, easing }, { offset: end, [property]: to }, { offset: 1, [property]: to }],",
    "    { duration: LOOP.cycle, iterations: Infinity, direction: LOOP.direction, fill: \"both\" }",
    "  );",
    "}",
    "",
    "export function drawLines(svg) {",
    "  const reduceMotion = window.matchMedia(\"(prefers-reduced-motion: reduce)\").matches;",
    "  const shapes = [...svg.querySelectorAll(SHAPES)].filter((element) => !element.parentElement.closest(HIDDEN));",
    "  const animations = [];",
    "",
    "  for (const stroke of STROKES) {",
    "    const element = shapes[stroke.index];",
    "    if (!element) continue;",
    "    if (stroke.colour) element.style.stroke = stroke.colour;",
    "    if (stroke.width) element.style.strokeWidth = String(stroke.width);",
    "    if (reduceMotion) continue;",
    "    if (stroke.duration) {",
    "      if (stroke.normalise) element.setAttribute(\"pathLength\", \"1\");",
    "      element.style.strokeDasharray = stroke.dasharray;",
    "      animations.push(tween(element, \"strokeDashoffset\", stroke.offset, 0, stroke.delay, stroke.duration, EASING));",
    "    }",
    "    if (stroke.fade) animations.push(tween(element, \"fillOpacity\", 0, stroke.fade.to, stroke.fade.delay, stroke.fade.duration, \"linear\"));",
    "  }",
    "  return animations;",
    "}",
    ""
  ].join("\n");
}
