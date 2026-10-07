import { fillRulePresets } from "@/data/fill-rule-visualiser-presets";
import { clamp } from "@/utils/number";
import { CANVAS_SIZE, normaliseAngle, parsePathData, reverseSubpath, round } from "@/components/FillRuleVisualiser/FillRuleVisualiser.utils";
import type {
  FillRuleEditorState,
  FillRuleNode,
  FillRulePoint,
  FillRulePreset,
  FillRuleProbe,
  FillRuleShareableState,
  FillRuleSubpath,
  FillRuleViewSettings
} from "@/components/FillRuleVisualiser/FillRuleVisualiser.types";

// The table opens side by side with direction chevrons on — the clearest first view of why the rules differ.
export const DEFAULT_VIEW: FillRuleViewSettings = { mode: "side", windingMap: false, arrows: true, split: CANVAS_SIZE / 2 };

// Keeps every anchor and control on the table, so a drag or nudge can never lose a handle off the edge.
function clampPoint(point: FillRulePoint): FillRulePoint {
  return { x: round(clamp(point.x, 0, CANVAS_SIZE)), y: round(clamp(point.y, 0, CANVAS_SIZE)) };
}

// Replaces one subpath immutably — every edit below goes through it so undo snapshots never share arrays.
function updateSubpath(state: FillRuleEditorState, index: number, update: (subpath: FillRuleSubpath) => FillRuleSubpath): FillRuleEditorState {
  return { subpaths: state.subpaths.map((subpath, i) => (i === index ? update(subpath) : subpath)) };
}

// Turns a preset's d string into editor state; presets are hand-checked, so a parse failure falls back to an empty table.
export function stateFromPreset(preset: FillRulePreset): FillRuleEditorState {
  const parsed = parsePathData(preset.d);
  return { subpaths: parsed.ok ? parsed.subpaths : [] };
}

// Opens on the pentagram — the exact shape the post's ray diagram uses, so the tool picks up where the post leaves off.
export function defaultPreset(): FillRulePreset {
  return fillRulePresets.find((preset) => preset.slug === "pentagram") ?? fillRulePresets[0];
}

// A fresh table: the default preset's geometry, its ray, and the default view.
export function createDefaultShareableState(): FillRuleShareableState {
  const preset = defaultPreset();
  return { subpaths: stateFromPreset(preset).subpaths, probe: { ...preset.probe }, view: { ...DEFAULT_VIEW } };
}

/*
  Moves an anchor and carries its two neighbouring control points with it (the incoming cubic's
  second control and the outgoing cubic's first), so dragging a curved vertex shifts the bend with
  it instead of kinking the curve.
*/
export function moveNode(state: FillRuleEditorState, subpathIndex: number, nodeIndex: number, target: FillRulePoint): FillRuleEditorState {
  return updateSubpath(state, subpathIndex, ({ nodes }) => {
    const node = nodes[nodeIndex];
    if (!node) return { nodes };
    const point = clampPoint(target);
    const dx = point.x - node.x;
    const dy = point.y - node.y;
    const nextIndex = (nodeIndex + 1) % nodes.length;
    return {
      nodes: nodes.map((current, i) => {
        let next: FillRuleNode = current;
        if (i === nodeIndex) {
          next = { ...next, x: point.x, y: point.y };
          if (next.c2) next.c2 = clampPoint({ x: next.c2.x + dx, y: next.c2.y + dy });
        }
        if (i === nextIndex && nodes.length > 1 && next.c1) {
          next = { ...next, c1: clampPoint({ x: next.c1.x + dx, y: next.c1.y + dy }) };
        }
        return next;
      })
    };
  });
}

// Moves one control point in isolation — the fine-tuning counterpart to moveNode.
export function moveControl(state: FillRuleEditorState, subpathIndex: number, nodeIndex: number, which: "c1" | "c2", target: FillRulePoint): FillRuleEditorState {
  return updateSubpath(state, subpathIndex, ({ nodes }) => ({
    nodes: nodes.map((node, i) => (i === nodeIndex && node[which] ? { ...node, [which]: clampPoint(target) } : node))
  }));
}

/*
  Inserts a point straight after `afterIndex` (or at the end when nothing is selected), which is
  how a pen tool feels: keep clicking and the outline grows from wherever you left off.
*/
export function insertNode(state: FillRuleEditorState, subpathIndex: number, afterIndex: number | null, point: FillRulePoint): FillRuleEditorState {
  const safeIndex = state.subpaths[subpathIndex] ? subpathIndex : state.subpaths.length;
  const base = safeIndex === state.subpaths.length ? { subpaths: [...state.subpaths, { nodes: [] }] } : state;
  return updateSubpath(base, safeIndex, ({ nodes }) => {
    const position = afterIndex === null ? nodes.length : clamp(afterIndex + 1, 0, nodes.length);
    const next = [...nodes];
    next.splice(position, 0, clampPoint(point));
    return { nodes: next };
  });
}

// Removes an anchor; the curve that arrived at it is dropped too, so the neighbours join with whatever edge the next node already had.
export function deleteNode(state: FillRuleEditorState, subpathIndex: number, nodeIndex: number): FillRuleEditorState {
  return updateSubpath(state, subpathIndex, ({ nodes }) => ({ nodes: nodes.filter((_, i) => i !== nodeIndex) }));
}

/*
  Toggles the edge arriving at a node between a straight line and a cubic. A new curve gets controls
  at the thirds, pushed out sideways, so the bend is visible straight away rather than sitting flat
  on the old line.
*/
export function toggleCurve(state: FillRuleEditorState, subpathIndex: number, nodeIndex: number): FillRuleEditorState {
  return updateSubpath(state, subpathIndex, ({ nodes }) => {
    if (nodes.length < 2) return { nodes };
    const previous = nodes[(nodeIndex - 1 + nodes.length) % nodes.length];
    return {
      nodes: nodes.map((node, i) => {
        if (i !== nodeIndex) return node;
        if (node.c1 && node.c2) return { x: node.x, y: node.y };
        const dx = node.x - previous.x;
        const dy = node.y - previous.y;
        const length = Math.hypot(dx, dy) || 1;
        const bulge = Math.min(60, length / 3);
        const nx = (-dy / length) * bulge;
        const ny = (dx / length) * bulge;
        return {
          ...node,
          c1: clampPoint({ x: previous.x + dx / 3 + nx, y: previous.y + dy / 3 + ny }),
          c2: clampPoint({ x: previous.x + (2 * dx) / 3 + nx, y: previous.y + (2 * dy) / 3 + ny })
        };
      })
    };
  });
}

// Starts an empty subpath at the end of the list — the next clicks on the table fill it in.
export function addSubpath(state: FillRuleEditorState): FillRuleEditorState {
  return { subpaths: [...state.subpaths, { nodes: [] }] };
}

// Drops a whole subpath, e.g. to compare the star with and without an inner ring.
export function deleteSubpath(state: FillRuleEditorState, subpathIndex: number): FillRuleEditorState {
  return { subpaths: state.subpaths.filter((_, i) => i !== subpathIndex) };
}

// Flips one subpath's drawing direction — the button that turns a nonzero "filled hole" back into a real hole.
export function reverseOne(state: FillRuleEditorState, subpathIndex: number): FillRuleEditorState {
  return updateSubpath(state, subpathIndex, reverseSubpath);
}

// Strips empty subpaths before sharing, since they carry nothing and only lengthen the permalink.
export function toShareableState(state: FillRuleEditorState, probe: FillRuleProbe, view: FillRuleViewSettings): FillRuleShareableState {
  return {
    subpaths: state.subpaths.filter((subpath) => subpath.nodes.length > 0),
    probe: { x: round(probe.x), y: round(probe.y), angle: round(normaliseAngle(probe.angle)) },
    view: { ...view }
  };
}

// True for a finite number — the one check every field of a decoded permalink needs.
function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

// Validates a decoded node shape-by-shape, so a tampered permalink can't smuggle NaN into the geometry.
function sanitiseNode(value: unknown): FillRuleNode | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<FillRuleNode>;
  if (!isNumber(raw.x) || !isNumber(raw.y)) return null;
  const node: FillRuleNode = clampPoint({ x: raw.x, y: raw.y });
  if (raw.c1 && raw.c2 && isNumber(raw.c1.x) && isNumber(raw.c1.y) && isNumber(raw.c2.x) && isNumber(raw.c2.y)) {
    node.c1 = clampPoint(raw.c1);
    node.c2 = clampPoint(raw.c2);
  }
  return node;
}

/*
  Rebuilds a full shareable state from untrusted JSON (a permalink or an old autosave), filling
  anything missing from the defaults and rejecting the lot if the geometry itself is unusable.
*/
export function sanitiseShareableState(value: unknown): FillRuleShareableState | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<FillRuleShareableState>;
  if (!Array.isArray(raw.subpaths)) return null;
  const subpaths: FillRuleSubpath[] = [];
  for (const subpath of raw.subpaths) {
    if (!subpath || !Array.isArray(subpath.nodes)) return null;
    const nodes = subpath.nodes.map(sanitiseNode);
    if (nodes.some((node) => node === null)) return null;
    subpaths.push({ nodes: nodes as FillRuleNode[] });
  }
  const fallback = createDefaultShareableState();
  const probe =
    raw.probe && isNumber(raw.probe.x) && isNumber(raw.probe.y) && isNumber(raw.probe.angle)
      ? { ...clampPoint(raw.probe), angle: normaliseAngle(raw.probe.angle) }
      : fallback.probe;
  const view = raw.view ?? fallback.view;
  return {
    subpaths,
    probe,
    view: {
      mode: view.mode === "split" || view.mode === "overlay" ? view.mode : "side",
      windingMap: view.windingMap === true,
      arrows: view.arrows !== false,
      split: isNumber(view.split) ? clamp(view.split, 0, CANVAS_SIZE) : DEFAULT_VIEW.split
    }
  };
}

// Plain JSON → base64 → URL-safe characters, the same permalink encoding every other goodie uses.
export function encodeShareableState(state: FillRuleShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState, returning null on anything malformed so the page falls back instead of crashing.
export function decodeShareableState(encoded: string): FillRuleShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return sanitiseShareableState(JSON.parse(json));
  } catch {
    return null;
  }
}
