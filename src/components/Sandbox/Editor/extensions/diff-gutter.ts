import { EditorView, GutterMarker, ViewPlugin, gutter, keymap, showTooltip, type Tooltip } from "@codemirror/view";
import { StateEffect, StateField, type Extension, type Text } from "@codemirror/state";
import { clamp } from "@/utils/number";
import { diffLines, hunkRange, formatHunkHeader, pairedLineText, type DiffHunk, type DiffRow } from "@/components/Sandbox/Editor/extensions/diff-engine";
import { createLineHighlighter, highlightRow, type LineHighlighter, type RenderSegment } from "@/components/Sandbox/Editor/extensions/diff-highlight";

/*
  Marks lines that differ from the original template, with a per-hunk popup, so readers can see
  what they've changed without leaving the editor. The original's path travels with its lines so
  the popup can highlight the right language.
*/
export interface OriginalFileInfo {
  lines: string[];
  filePath: string;
}

export const setOriginalLines = StateEffect.define<OriginalFileInfo | null>();

const originalLinesField = StateField.define<OriginalFileInfo | null>({
  create: () => null,
  update(value, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setOriginalLines)) return effect.value;
    }
    return value;
  }
});

// CodeMirror's Text is 1-indexed and line-addressed — flattens it into the plain, 0-indexed string array diffLines expects.
function docToLines(doc: Text): string[] {
  const lines: string[] = [];
  for (let n = 1; n <= doc.lines; n++) lines.push(doc.line(n).text);
  return lines;
}

// Recomputed only when the doc or the original content actually changes — everything else (scrolling, cursor moves) just reads this map.
const diffHunksField = StateField.define<Map<number, DiffHunk> | null>({
  create: () => null,
  update(value, tr) {
    const originalEffect = tr.effects.find((effect) => effect.is(setOriginalLines));
    if (!tr.docChanged && !originalEffect) return value;

    const original = originalEffect ? originalEffect.value : tr.startState.field(originalLinesField);
    if (!original) return null;

    const hunks = diffLines(original.lines, docToLines(tr.state.doc));
    const byLine = new Map<number, DiffHunk>();
    // A pure deletion has no lines of its own in the current doc, so it still gets just the one marker at curFrom. An insertion/change occupies curLines.length real lines — mark each so a two-line addition shows two green markers, not one.
    for (const hunk of hunks) {
      const lineCount = Math.max(hunk.curLines.length, 1);
      for (let offset = 0; offset < lineCount; offset++) byLine.set(hunk.curFrom + offset, hunk);
    }
    return byLine;
  }
});

// Independent of whether the active file actually has changes, so hiding the gutter sticks.
export const setDiffGutterEnabled = StateEffect.define<boolean>();

const diffGutterEnabledField = StateField.define<boolean>({
  create: () => true,
  update(value, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setDiffGutterEnabled)) return effect.value;
    }
    return value;
  }
});

// Collapses the gutter column once the file matches its original again, or once it's hidden, so no empty column is left behind.
export const sandboxDiffGutterVisibilityExtension: Extension = EditorView.updateListener.of((update) => {
  const hasDiff = (update.state.field(diffHunksField)?.size ?? 0) > 0;
  const enabled = update.state.field(diffGutterEnabledField);
  update.view.dom.classList.toggle("cm-has-diff", hasDiff && enabled);
});

export const setDiffTooltip = StateEffect.define<Tooltip | null>();

const diffTooltipField = StateField.define<Tooltip | null>({
  create: () => null,
  update(tooltip, tr) {
    // Hiding the gutter always closes whatever popup was open, regardless of what else this same transaction does.
    if (tr.effects.some((effect) => effect.is(setDiffGutterEnabled) && !effect.value)) return null;

    for (const effect of tr.effects) {
      if (effect.is(setDiffTooltip)) return effect.value;
    }
    // An edit or an explicit selection change (e.g. clicking elsewhere to place the caret) invalidates whatever the popup was anchored to.
    if (tooltip && (tr.docChanged || tr.selection)) return null;
    return tooltip;
  },
  provide: (field) => showTooltip.from(field)
});

// Classes carry the syntax colour; data-changed marks a word-level change within a replaced-line pair.
function buildSegmentSpan(segment: RenderSegment): HTMLElement {
  const span = document.createElement("span");
  if (segment.classes) span.className = segment.classes;
  if (segment.changed) span.dataset.changed = "true";
  span.textContent = segment.text;
  return span;
}

// One removed/added line inside the popup — a leading +/- marker plus the already-highlighted (buildSegmentSpan) text spans.
function buildDiffLineRow(row: Extract<DiffRow, { type: "added" | "removed" }>, segments: RenderSegment[]): HTMLElement {
  const line = document.createElement("div");
  line.className = `cm-sbx-diff-line cm-sbx-diff-line-${row.type}`;

  const marker = document.createElement("span");
  marker.className = "cm-sbx-diff-line-marker";
  marker.textContent = row.type === "added" ? "+" : "-";

  const textEl = document.createElement("span");
  textEl.className = "cm-sbx-diff-line-text";
  for (const segment of segments) textEl.appendChild(buildSegmentSpan(segment));

  line.append(marker, textEl);
  return line;
}

// A real unified-diff header line ("@@ -5,10 +5,12 @@") for just this hunk — no surrounding context, unlike DiffView's full-file readout.
function buildDiffHunkHeaderRow(hunk: DiffHunk): HTMLElement {
  const header = document.createElement("div");
  header.className = "cm-sbx-diff-hunk-header";
  header.textContent = formatHunkHeader(hunkRange(hunk));
  return header;
}

// Caches each side's syntax highlighter across popup opens, keyed by object identity, so hovering several markers back to back without editing in between doesn't reparse the same unchanged text from scratch each time.
const originalHighlighterCache = new WeakMap<OriginalFileInfo, LineHighlighter>();
const currentHighlighterCache = new WeakMap<Text, LineHighlighter>();

function getOriginalHighlighter(original: OriginalFileInfo | null): LineHighlighter {
  if (!original) return createLineHighlighter("", "");

  const cached = originalHighlighterCache.get(original);
  if (cached) return cached;

  const highlighter = createLineHighlighter(original.lines.join("\n"), original.filePath);
  originalHighlighterCache.set(original, highlighter);
  return highlighter;
}

function getCurrentHighlighter(doc: Text, filePath: string): LineHighlighter {
  const cached = currentHighlighterCache.get(doc);
  if (cached) return cached;

  const highlighter = createLineHighlighter(doc.toString(), filePath);
  currentHighlighterCache.set(doc, highlighter);
  return highlighter;
}

/*
  Header, then removed, then added — the order a unified diff reads a replaced line in. Each side
  gets its own highlighter because removed lines no longer exist in the live document.
*/
function buildDiffTooltipDOM(view: EditorView, hunk: DiffHunk): HTMLElement {
  const original = view.state.field(originalLinesField);
  const filePath = original?.filePath ?? "";
  const origHighlighter = getOriginalHighlighter(original);
  const curHighlighter = getCurrentHighlighter(view.state.doc, filePath);

  const dom = document.createElement("div");
  dom.className = "cm-tooltip-diff";
  dom.appendChild(buildDiffHunkHeaderRow(hunk));

  hunk.origLines.forEach((text, index) => {
    const row = { type: "removed" as const, text, oldLine: hunk.origFrom + index, pairedText: pairedLineText(hunk, "removed", index) };
    dom.appendChild(buildDiffLineRow(row, highlightRow(row, origHighlighter, curHighlighter)));
  });
  hunk.curLines.forEach((text, index) => {
    const row = { type: "added" as const, text, newLine: hunk.curFrom + index, pairedText: pairedLineText(hunk, "added", index) };
    dom.appendChild(buildDiffLineRow(row, highlightRow(row, origHighlighter, curHighlighter)));
  });

  return dom;
}

// Unconditionally opens (or replaces) the popup for `hunk`, anchored to `markerEl`.
function openDiffTooltip(view: EditorView, markerEl: HTMLElement, hunk: DiffHunk): void {
  const line = view.state.doc.line(clamp(hunk.curFrom, 1, view.state.doc.lines));
  view.dispatch({
    effects: setDiffTooltip.of({
      pos: line.from,
      above: false,
      clip: false,
      create: () => ({ dom: buildDiffTooltipDOM(view, hunk), getCoords: () => markerEl.getBoundingClientRect() })
    })
  });
}

// Opens the popup for `hunk`, or closes it if it's already showing for this exact marker (click-to-toggle, not click-to-only-open).
function toggleDiffTooltip(view: EditorView, markerEl: HTMLElement, hunk: DiffHunk): void {
  const line = view.state.doc.line(clamp(hunk.curFrom, 1, view.state.doc.lines));
  const current = view.state.field(diffTooltipField);

  if (current && current.pos === line.from) {
    view.dispatch({ effects: setDiffTooltip.of(null) });
    return;
  }

  openDiffTooltip(view, markerEl, hunk);
}

// Matches @codemirror/lint's own lintGutter hover delay, so both gutters feel identical to hover over.
const DIFF_HOVER_DELAY_MS = 300;

// Tracks the pointer on `window` while a hover popup is open, closing it once it strays outside both the marker and the popup — mirrors @codemirror/lint's own `trackHoverOn`.
function trackDiffHoverOutside(view: EditorView, markerEl: HTMLElement): void {
  const onMouseMove = (event: MouseEvent) => {
    const rect = markerEl.getBoundingClientRect();
    if (event.clientX > rect.left - 10 && event.clientX < rect.right + 10 && event.clientY > rect.top - 10 && event.clientY < rect.bottom + 10) {
      return;
    }

    for (let target = event.target as Node | null; target; target = target.parentNode) {
      if (target instanceof Element && target.classList.contains("cm-tooltip-diff")) return;
    }

    window.removeEventListener("mousemove", onMouseMove);
    if (view.state.field(diffTooltipField)) view.dispatch({ effects: setDiffTooltip.of(null) });
  };

  window.addEventListener("mousemove", onMouseMove);
}

// Hovering a marker opens the same popup a click would, after a short delay — matches the lint gutter's own hover-to-preview behavior.
function scheduleDiffTooltipOnHover(view: EditorView, markerEl: HTMLElement, hunk: DiffHunk): void {
  function hovered() {
    openDiffTooltip(view, markerEl, hunk);
    markerEl.onmouseout = markerEl.onmousemove = null;
    trackDiffHoverOutside(view, markerEl);
  }

  let hoverTimeout = setTimeout(hovered, DIFF_HOVER_DELAY_MS);
  markerEl.onmouseout = () => {
    clearTimeout(hoverTimeout);
    markerEl.onmouseout = markerEl.onmousemove = null;
  };
  markerEl.onmousemove = () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(hovered, DIFF_HOVER_DELAY_MS);
  };
}

// Reserves the gutter's width even on lines with nothing to show, so the editor's content doesn't shift once the first changed line appears.
class DiffSpacerMarker extends GutterMarker {
  toDOM(): HTMLElement {
    const el = document.createElement("div");
    el.className = "cm-sbx-diff-spacer";
    return el;
  }
}

/*
  One line's marker. Carries its own hunk (for the click handler and for `eq` below) rather than
  discovering it from the marker's screen position the way the lint gutter does — diffHunksField
  already knows exactly which line each hunk belongs to, so there's nothing to look up.
*/
class DiffLineMarker extends GutterMarker {
  constructor(
    readonly hunk: DiffHunk,
    private readonly isAdded: boolean
  ) {
    super();
  }

  // Same hunk object (diffHunksField only produces a new one when the doc/original actually changes) plus same kind — skip re-rendering this row's DOM.
  eq(other: DiffLineMarker): boolean {
    return other.hunk === this.hunk && other.isAdded === this.isAdded;
  }

  toDOM(view: EditorView): HTMLElement {
    const el = document.createElement("div");
    el.className = `cm-sbx-diff-marker cm-sbx-diff-marker-${this.isAdded ? "added" : "removed"}`;
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", this.isAdded ? "View added lines" : "View removed lines");
    el.onclick = (event) => {
      event.stopPropagation();
      toggleDiffTooltip(view, el, this.hunk);
    };
    el.onmouseover = () => scheduleDiffTooltipOnHover(view, el, this.hunk);
    return el;
  }
}

const spacerMarker = new DiffSpacerMarker();

// Closes on any outside click, since touch devices have no pointerleave to rely on.
const dismissDiffTooltipOnOutsideClick = ViewPlugin.fromClass(
  class {
    private readonly handlePointerDown = (event: PointerEvent) => {
      if (!this.view.state.field(diffTooltipField)) return;

      const target = event.target;
      if (target instanceof Element && (target.closest(".cm-tooltip-diff") || target.closest(".cm-sbx-diff-gutter"))) {
        return;
      }

      this.view.dispatch({ effects: setDiffTooltip.of(null) });
    };

    constructor(private readonly view: EditorView) {
      document.addEventListener("pointerdown", this.handlePointerDown);
    }

    destroy(): void {
      document.removeEventListener("pointerdown", this.handlePointerDown);
    }
  }
);

// Escape closes an open diff popup; falls through (returns false) when none is open so Escape still does whatever it'd normally do.
const diffTooltipKeymap = keymap.of([
  {
    key: "Escape",
    run(view) {
      if (!view.state.field(diffTooltipField)) return false;
      view.dispatch({ effects: setDiffTooltip.of(null) });
      return true;
    }
  }
]);

// Bundled so the diff gutter installs as one unit.
export const sandboxDiffGutterExtensions: Extension[] = [
  originalLinesField,
  diffHunksField,
  diffGutterEnabledField,
  diffTooltipField,
  sandboxDiffGutterVisibilityExtension,
  dismissDiffTooltipOnOutsideClick,
  diffTooltipKeymap,
  gutter({
    class: "cm-sbx-diff-gutter",
    initialSpacer: () => spacerMarker,
    lineMarker(view, block) {
      const hunks = view.state.field(diffHunksField);
      if (!hunks) return null;

      const line = view.state.doc.lineAt(block.from);
      const hunk = hunks.get(line.number);
      if (!hunk) return null;

      return new DiffLineMarker(hunk, hunk.curLines.length > 0);
    }
  })
];
