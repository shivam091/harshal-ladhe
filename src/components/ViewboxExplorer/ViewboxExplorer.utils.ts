import { parseSvg } from "@/utils/svg-to-react-parse";
import { sanitiseTree } from "@/utils/svg-to-react";
import type { SvgElementNode } from "@/components/SvgToReactConverter/SvgToReactConverter.types";
import type {
  AlignPosition,
  AspectAlign,
  EaselHandle,
  MeetOrSlice,
  ParsedDrawing,
  TourStep,
  ViewBoxRect,
  ViewBoxTransform,
  ViewboxExplorerEditorState,
  ViewportSize
} from "@/components/ViewboxExplorer/ViewboxExplorer.types";

// Smallest print the paper sliders allow — about the size of an icon.
export const VIEWPORT_MIN = 40;

// Largest print the paper sliders allow — still fits the baseboard at true size on a laptop.
export const VIEWPORT_MAX = 480;

// The nine alignment keywords in reading order, so the 3 × 3 grid can map straight over them.
export const ALIGN_GRID: Exclude<AspectAlign, "none">[] = ["xMinYMin", "xMidYMin", "xMaxYMin", "xMinYMid", "xMidYMid", "xMaxYMid", "xMinYMax", "xMidYMax", "xMaxYMax"];

// Every legal alignment value, for validating anything read back from a permalink or autosave.
export const ALIGN_VALUES: AspectAlign[] = ["none", ...ALIGN_GRID];

// The auto-tour's route: none first, then all nine fits with borders, then all nine crops.
export const TOUR_STEPS: TourStep[] = [
  { align: "none", meetOrSlice: "meet" },
  ...ALIGN_GRID.map((align) => ({ align, meetOrSlice: "meet" as const })),
  ...ALIGN_GRID.map((align) => ({ align, meetOrSlice: "slice" as const }))
];

// Where a drawing with no usable viewBox or size is assumed to live — the same 100 × 100 grid the post starts from.
const FALLBACK_BOUNDS: ViewBoxRect = { x: 0, y: 0, width: 100, height: 100 };

// Local clamp so these maths stay self-contained and testable without the shared number utils.
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Readouts and exported markup should say "2.5", not "2.5000000001" or "-0".
export function formatNumber(value: number, decimals = 3): string {
  const rounded = Number(value.toFixed(decimals));
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

// The four numbers exactly as they'd be written inside a viewBox attribute.
export function formatViewBox(rect: ViewBoxRect): string {
  return [rect.x, rect.y, rect.width, rect.height].map((value) => formatNumber(value)).join(" ");
}

// "none" stands alone in the attribute; every other alignment carries its meet/slice partner.
export function formatPreserveAspectRatio(align: AspectAlign, meetOrSlice: MeetOrSlice): string {
  return align === "none" ? "none" : `${align} ${meetOrSlice}`;
}

// Splits a keyword into its two axes so each half can be applied and explained on its own.
export function parseAlign(align: AspectAlign): { x: AlignPosition; y: AlignPosition } | null {
  if (align === "none") return null;
  const match = /^x(Min|Mid|Max)Y(Min|Mid|Max)$/.exec(align);
  if (!match) return null;
  return { x: match[1].toLowerCase() as AlignPosition, y: match[2].toLowerCase() as AlignPosition };
}

// How far along the spare (or overhanging) space an alignment position sits — the multiplier the spec's steps 7 and 8 apply.
function alignFactor(position: AlignPosition): number {
  return position === "min" ? 0 : position === "mid" ? 0.5 : 1;
}

/*
  The SVG 2 "equivalent transform of an SVG viewport" algorithm, step for step: independent scale
  ratios, collapsed to the smaller (meet) or larger (slice) unless align is none, then translate by
  -viewBox origin × scale, then shift by the alignment share of whatever space is left over. The
  viewport's own e-x/e-y are 0 here because the print is the outermost element on the baseboard.
*/
export function computeViewBoxTransform(viewBox: ViewBoxRect, viewport: ViewportSize, align: AspectAlign, meetOrSlice: MeetOrSlice): ViewBoxTransform {
  let scaleX = viewport.width / viewBox.width;
  let scaleY = viewport.height / viewBox.height;

  const alignment = parseAlign(align);
  if (alignment) {
    const uniform = meetOrSlice === "meet" ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);
    scaleX = uniform;
    scaleY = uniform;
  }

  const spareX = viewport.width - viewBox.width * scaleX;
  const spareY = viewport.height - viewBox.height * scaleY;
  let translateX = -viewBox.x * scaleX;
  let translateY = -viewBox.y * scaleY;

  if (alignment) {
    translateX += spareX * alignFactor(alignment.x);
    translateY += spareY * alignFactor(alignment.y);
  }

  return {
    scaleX,
    scaleY,
    translateX,
    translateY,
    spareX,
    spareY,
    mapped: { x: translateX + viewBox.x * scaleX, y: translateY + viewBox.y * scaleY, width: viewBox.width * scaleX, height: viewBox.height * scaleY },
    visible: { x: -translateX / scaleX, y: -translateY / scaleY, width: viewport.width / scaleX, height: viewport.height / scaleY }
  };
}

// The same transform as an SVG/CSS matrix() call — b and c are always zero because viewBox never rotates or skews.
export function formatMatrix(transform: ViewBoxTransform): string {
  const { scaleX, scaleY, translateX, translateY } = transform;
  return `matrix(${[scaleX, 0, 0, scaleY, translateX, translateY].map((value) => formatNumber(value)).join(" ")})`;
}

// Sub-pixel leftovers from rounding shouldn't be described as a border or a crop.
const SPARE_EPSILON = 0.5;

// Plain words for each alignment position, per axis and per mode, so the explanation reads like a sentence rather than a keyword dump.
const ALIGN_WORDS: Record<"x" | "y", Record<MeetOrSlice, Record<AlignPosition, string>>> = {
  x: {
    meet: {
      min: "xMin pins the left edges together, so the whole border sits on the right",
      mid: "xMid centres the drawing, splitting the border evenly left and right",
      max: "xMax pins the right edges together, so the whole border sits on the left"
    },
    slice: {
      min: "xMin keeps the left edge and crops everything from the right",
      mid: "xMid crops evenly from the left and the right",
      max: "xMax keeps the right edge and crops everything from the left"
    }
  },
  y: {
    meet: {
      min: "YMin pins the top edges together, so the whole border sits underneath",
      mid: "YMid centres the drawing, splitting the border evenly above and below",
      max: "YMax pins the bottom edges together, so the whole border sits on top"
    },
    slice: {
      min: "YMin keeps the top edge and crops everything from the bottom",
      mid: "YMid crops evenly from the top and the bottom",
      max: "YMax keeps the bottom edge and crops everything from the top"
    }
  }
};

/*
  A short plain-English account of the current combination: which scale wins and why, how much
  paper is left over or cut off, and what each half of the alignment does with it — including when
  one half (or both) has nothing to do because that axis already fits exactly.
*/
export function describeCombination(state: ViewboxExplorerEditorState, transform: ViewBoxTransform): { title: string; body: string[] } {
  const { viewBox, viewport, align, meetOrSlice } = state;
  const ratioX = viewport.width / viewBox.width;
  const ratioY = viewport.height / viewBox.height;
  const alignment = parseAlign(align);

  if (!alignment) {
    const distorted = Math.abs(ratioX - ratioY) > 1e-3;
    return {
      title: "Stretch to the paper (none)",
      body: [
        `Each axis is scaled on its own: ×${formatNumber(ratioX)} across and ×${formatNumber(ratioY)} down, so the easel's corners land exactly on the paper's corners.`,
        distorted
          ? "Because the two ratios differ, the drawing is distorted — circles print as ellipses and lines change weight with direction."
          : "The two ratios happen to match, so nothing distorts this time.",
        "With none, the alignment and the meet/slice keyword are both ignored."
      ]
    };
  }

  const scale = transform.scaleX;
  const isMeet = meetOrSlice === "meet";
  const ratiosDiffer = Math.abs(ratioX - ratioY) > 1e-3;
  const ratioNote = ratiosDiffer ? ` (the width alone would ${isMeet ? "allow" : "need"} ×${formatNumber(ratioX)}, the height ×${formatNumber(ratioY)})` : "";
  const body: string[] = [
    isMeet
      ? `The whole easel has to fit on the paper, so both axes use the smaller ratio, ×${formatNumber(scale)}${ratioNote}.`
      : `The paper has to be covered edge to edge, so both axes use the larger ratio, ×${formatNumber(scale)}${ratioNote}.`
  ];

  const axes: Array<{ key: "x" | "y"; spare: number; direction: string; letter: string }> = [
    { key: "x", spare: transform.spareX, direction: "across the width", letter: "x" },
    { key: "y", spare: transform.spareY, direction: "down the height", letter: "Y" }
  ];
  const busyAxes = axes.filter((axis) => Math.abs(axis.spare) > SPARE_EPSILON);

  if (busyAxes.length === 0) {
    body.push("The easel and the paper share an aspect ratio, so there is nothing left over to align — every alignment prints the same.");
  }

  for (const axis of busyAxes) {
    const position = alignment[axis.key];
    if (isMeet) {
      body.push(`That leaves ${formatNumber(axis.spare, 1)}px of spare paper ${axis.direction}; ${ALIGN_WORDS[axis.key].meet[position]}.`);
    } else {
      const croppedUnits = Math.abs(axis.spare) / scale;
      body.push(`That overhangs the paper by ${formatNumber(-axis.spare, 1)}px ${axis.direction} — ${formatNumber(croppedUnits, 2)} user units of the easel never reach the print; ${ALIGN_WORDS[axis.key].slice[position]}.`);
    }
  }

  for (const axis of axes) {
    if (busyAxes.length > 0 && !busyAxes.includes(axis)) {
      body.push(`The ${axis.letter}${alignment[axis.key][0].toUpperCase()}${alignment[axis.key].slice(1)} half has no effect, because that axis already fits exactly.`);
    }
  }

  if (isMeet && busyAxes.length > 0) {
    body.push("Anything drawn outside the viewBox still prints into those borders — the viewBox chooses the framing, but only the viewport clips.");
  }

  return { title: isMeet ? `Fit with borders (${align} meet)` : `Crop to fill (${align} slice)`, body };
}

// Shown in place of the drawing in every export, since the point of the snippet is the framing, not the artwork.
const DRAWING_PLACEHOLDER = "your drawing, in viewBox user units";

// The plain markup version — attributes one per line, so the four that matter are easy to spot and tweak.
export function buildSvgSnippet(state: ViewboxExplorerEditorState): string {
  return [
    "<svg",
    '  xmlns="http://www.w3.org/2000/svg"',
    `  width="${formatNumber(state.viewport.width)}"`,
    `  height="${formatNumber(state.viewport.height)}"`,
    `  viewBox="${formatViewBox(state.viewBox)}"`,
    `  preserveAspectRatio="${formatPreserveAspectRatio(state.align, state.meetOrSlice)}"`,
    ">",
    `  <!-- ${DRAWING_PLACEHOLDER} -->`,
    "</svg>"
  ].join("\n");
}

// A React component with numeric width/height and props spread last, so callers can still override size or add a className.
export function buildReactSnippet(state: ViewboxExplorerEditorState): string {
  return [
    'import type { SVGProps } from "react";',
    "",
    "export default function Print(props: SVGProps<SVGSVGElement>) {",
    "  return (",
    "    <svg",
    '      xmlns="http://www.w3.org/2000/svg"',
    `      width={${formatNumber(state.viewport.width)}}`,
    `      height={${formatNumber(state.viewport.height)}}`,
    `      viewBox="${formatViewBox(state.viewBox)}"`,
    `      preserveAspectRatio="${formatPreserveAspectRatio(state.align, state.meetOrSlice)}"`,
    "      {...props}",
    "    >",
    `      {/* ${DRAWING_PLACEHOLDER} */}`,
    "    </svg>",
    "  );",
    "}"
  ].join("\n");
}

// The same print with the viewBox maths done by hand — proof that viewBox plus preserveAspectRatio is only ever a scale and a translate.
export function buildMatrixSnippet(state: ViewboxExplorerEditorState, transform: ViewBoxTransform): string {
  return [
    `<!-- Equivalent to viewBox="${formatViewBox(state.viewBox)}" preserveAspectRatio="${formatPreserveAspectRatio(state.align, state.meetOrSlice)}" -->`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${formatNumber(state.viewport.width)}" height="${formatNumber(state.viewport.height)}">`,
    `  <g transform="${formatMatrix(transform)}">`,
    "    <!-- your drawing, unchanged -->",
    "  </g>",
    "</svg>"
  ].join("\n");
}

// Plain JSON → base64 → URL-safe character swap, the same encoding every other goodie's permalink uses.
export function encodeShareableState(state: ViewboxExplorerEditorState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Finite, positive numbers only — a zero or negative viewBox size disables rendering in the spec, so it's never accepted from outside.
function isPositive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

// Finite numbers of any sign, for viewBox origins that may legitimately sit left of or above zero.
function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/*
  Validates anything read back from a permalink or autosave into a full editor state, or null when
  it can't be trusted — the caller then falls back to the next source rather than rendering a
  half-broken print.
*/
export function normaliseState(raw: unknown): ViewboxExplorerEditorState | null {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<ViewboxExplorerEditorState>;
  const { viewBox, viewport } = candidate;
  if (!viewBox || !isFiniteNumber(viewBox.x) || !isFiniteNumber(viewBox.y) || !isPositive(viewBox.width) || !isPositive(viewBox.height)) return null;
  if (!viewport || !isPositive(viewport.width) || !isPositive(viewport.height)) return null;
  if (typeof candidate.sampleSlug !== "string") return null;

  return {
    sampleSlug: candidate.sampleSlug,
    customSource: typeof candidate.customSource === "string" ? candidate.customSource : null,
    viewBox: { x: viewBox.x, y: viewBox.y, width: viewBox.width, height: viewBox.height },
    viewport: { width: clamp(viewport.width, VIEWPORT_MIN, VIEWPORT_MAX), height: clamp(viewport.height, VIEWPORT_MIN, VIEWPORT_MAX) },
    align: ALIGN_VALUES.includes(candidate.align as AspectAlign) ? (candidate.align as AspectAlign) : "xMidYMid",
    meetOrSlice: candidate.meetOrSlice === "slice" ? "slice" : "meet"
  };
}

// Reverses encodeShareableState; null (never a throw) on a malformed or tampered `?state=` value.
export function decodeShareableState(encoded: string): ViewboxExplorerEditorState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return normaliseState(JSON.parse(json));
  } catch {
    return null;
  }
}

// Reads the drawing's own coordinate system straight from its opening tag, so bounds are known even where DOMParser isn't.
export function boundsFromSource(source: string): ViewBoxRect | null {
  const openingTag = /<svg\b[^>]*>/i.exec(source)?.[0];
  if (!openingTag) return null;

  const viewBoxValue = /\sviewBox\s*=\s*["']([^"']+)["']/i.exec(openingTag)?.[1];
  if (viewBoxValue) {
    const numbers = viewBoxValue.trim().split(/[\s,]+/).map(Number);
    if (numbers.length === 4 && numbers.every(Number.isFinite) && numbers[2] > 0 && numbers[3] > 0) {
      return { x: numbers[0], y: numbers[1], width: numbers[2], height: numbers[3] };
    }
  }

  const width = parseFloat(/\swidth\s*=\s*["']([\d.]+)(?:px)?["']/i.exec(openingTag)?.[1] ?? "");
  const height = parseFloat(/\sheight\s*=\s*["']([\d.]+)(?:px)?["']/i.exec(openingTag)?.[1] ?? "");
  if (width > 0 && height > 0) return { x: 0, y: 0, width, height };
  return null;
}

/*
  Parses and sanitises a drawing with the SVG → React converter's own pipeline (scripts, handlers
  and javascript: URLs stripped), so a pasted file is held to the same safety bar as that tool's
  preview. Bounds fall back to a 100 × 100 grid when the file declares neither viewBox nor size.
*/
export function parseDrawing(source: string): ParsedDrawing {
  const result = parseSvg(source);
  if (result.root) sanitiseTree(result.root);
  return { tree: result.root, bounds: boundsFromSource(source) ?? FALLBACK_BOUNDS, error: result.error };
}

// Attributes that belong to the pasted file's own outer frame — dropped so the drawing's contents sit in raw user space under this tool's viewBox instead.
const FRAME_ATTRIBUTES = new Set(["width", "height", "viewBox", "preserveAspectRatio", "x", "y", "xmlns", "xmlns:xlink", "version", "style", "class", "id"]);

// Re-roots the drawing as a <g> so its presentation attributes (fill, stroke…) still cascade but its own viewBox can't fight the one being explored.
export function drawingAsGroup(tree: SvgElementNode): SvgElementNode {
  return { ...tree, name: "g", attributes: tree.attributes.filter(([name]) => !FRAME_ATTRIBUTES.has(name)) };
}

// The light box shows half the drawing's size again on every side, so the easel can be dragged off the artwork to show that empty user space prints too.
export function computeExtent(bounds: ViewBoxRect, viewBox: ViewBoxRect): ViewBoxRect {
  const pad = Math.max(bounds.width, bounds.height) * 0.5;
  const left = Math.min(bounds.x - pad, viewBox.x);
  const top = Math.min(bounds.y - pad, viewBox.y);
  const right = Math.max(bounds.x + bounds.width + pad, viewBox.x + viewBox.width);
  const bottom = Math.max(bounds.y + bounds.height + pad, viewBox.y + viewBox.height);
  return { x: left, y: top, width: right - left, height: bottom - top };
}

// Rounds down to a 1/2/5 × 10ⁿ value, so grid lines and snapping land on numbers people would actually type.
export function niceStep(value: number): number {
  if (!(value > 0)) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalised = value / magnitude;
  return (normalised >= 5 ? 5 : normalised >= 2 ? 2 : 1) * magnitude;
}

// The easel snaps and nudges in steps sized to the drawing — whole units for a 100-unit icon, tenths for a 10-unit one.
export function snapStepFor(extent: ViewBoxRect): number {
  return niceStep(Math.max(extent.width, extent.height) / 200);
}

// Grid lines roughly a dozen across the light box, on round numbers.
export function gridStepFor(extent: ViewBoxRect): number {
  return niceStep(Math.max(extent.width, extent.height) / 12);
}

// Keeps the easel from collapsing below a few snap steps, where the handles would sit on top of one another.
export function minimumSizeFor(extent: ViewBoxRect): number {
  return Math.max(snapStepFor(extent) * 2, Math.max(extent.width, extent.height) / 50);
}

// Snaps to the step and strips floating-point fuzz in one go, so 0.1 + 0.2 never shows up in a viewBox.
export function roundToStep(value: number, step: number): number {
  return Number((Math.round(value / step) * step).toFixed(6));
}

// Holds a rectangle inside the light box and above the minimum size, shrinking it before moving it.
export function clampViewBox(rect: ViewBoxRect, extent: ViewBoxRect, minSize: number): ViewBoxRect {
  const width = clamp(rect.width, minSize, extent.width);
  const height = clamp(rect.height, minSize, extent.height);
  return {
    x: clamp(rect.x, extent.x, extent.x + extent.width - width),
    y: clamp(rect.y, extent.y, extent.y + extent.height - height),
    width,
    height
  };
}

// Which edges each handle owns — the corners own two, the blades one, the body all four.
const HANDLE_EDGES: Record<EaselHandle, { left: boolean; right: boolean; top: boolean; bottom: boolean }> = {
  move: { left: true, right: true, top: true, bottom: true },
  n: { left: false, right: false, top: true, bottom: false },
  s: { left: false, right: false, top: false, bottom: true },
  e: { left: false, right: true, top: false, bottom: false },
  w: { left: true, right: false, top: false, bottom: false },
  nw: { left: true, right: false, top: true, bottom: false },
  ne: { left: false, right: true, top: true, bottom: false },
  sw: { left: true, right: false, top: false, bottom: true },
  se: { left: false, right: true, top: false, bottom: true }
};

/*
  Applies one pointer or keyboard delta (in user units) to the easel from the rectangle it had when
  the gesture began. Moving shifts the whole frame and stops at the light box edge; a blade or
  corner moves only its own edges and stops before crossing the opposite one.
*/
export function adjustViewBox(start: ViewBoxRect, handle: EaselHandle, dx: number, dy: number, extent: ViewBoxRect, step: number): ViewBoxRect {
  const minSize = minimumSizeFor(extent);
  const extentRight = extent.x + extent.width;
  const extentBottom = extent.y + extent.height;
  let left = start.x;
  let top = start.y;
  let right = start.x + start.width;
  let bottom = start.y + start.height;

  if (handle === "move") {
    const shiftX = clamp(roundToStep(dx, step), extent.x - left, extentRight - right);
    const shiftY = clamp(roundToStep(dy, step), extent.y - top, extentBottom - bottom);
    return { x: roundToStep(left + shiftX, step / 100), y: roundToStep(top + shiftY, step / 100), width: start.width, height: start.height };
  }

  const edges = HANDLE_EDGES[handle];
  if (edges.left) left = clamp(roundToStep(left + dx, step), extent.x, right - minSize);
  if (edges.right) right = clamp(roundToStep(right + dx, step), left + minSize, extentRight);
  if (edges.top) top = clamp(roundToStep(top + dy, step), extent.y, bottom - minSize);
  if (edges.bottom) bottom = clamp(roundToStep(bottom + dy, step), top + minSize, extentBottom);

  return { x: left, y: top, width: Number((right - left).toFixed(6)), height: Number((bottom - top).toFixed(6)) };
}

// A rectangle as path data, so two can be combined into one evenodd ring for the borders and crop shading.
export function rectPath(rect: ViewBoxRect): string {
  return `M ${rect.x} ${rect.y} h ${rect.width} v ${rect.height} h ${-rect.width} Z`;
}

// Arrow keys as unit deltas, so every handle shares one keyboard map and only decides how far a step goes.
export function arrowDelta(key: string): [number, number] | null {
  if (key === "ArrowLeft") return [-1, 0];
  if (key === "ArrowRight") return [1, 0];
  if (key === "ArrowUp") return [0, -1];
  if (key === "ArrowDown") return [0, 1];
  return null;
}

// Positions of every grid line that falls inside a region, so both the light box and the print draw the same user-space grid.
export function gridLines(start: number, length: number, step: number): number[] {
  const lines: number[] = [];
  const first = Math.ceil(start / step) * step;
  for (let value = first; value <= start + length + 1e-9 && lines.length < 400; value += step) {
    lines.push(Number(value.toFixed(6)));
  }
  return lines;
}

// Text fields keep their own native undo history; hijacking Ctrl+Z there would rewind a whole typing run when someone meant to undo one word.
export function isTextEditingTarget(target: EventTarget): boolean {
  if (target instanceof HTMLTextAreaElement) return true;
  return target instanceof HTMLInputElement && ["text", "search", "url", "email", "number"].includes(target.type);
}
