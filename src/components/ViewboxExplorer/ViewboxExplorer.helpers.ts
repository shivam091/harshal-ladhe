import { viewboxExplorerPresets, viewboxExplorerSamples } from "@/data/viewbox-explorer-presets";
import { boundsFromSource, clamp, decodeShareableState, normaliseState, VIEWPORT_MAX, VIEWPORT_MIN } from "@/components/ViewboxExplorer/ViewboxExplorer.utils";
import type {
  AspectAlign,
  MeetOrSlice,
  TourStep,
  ViewBoxRect,
  ViewboxExplorerEditorState,
  ViewboxExplorerShareableState,
  ViewboxPreset,
  ViewboxSample,
  ViewportSize
} from "@/components/ViewboxExplorer/ViewboxExplorer.types";

// Namespaced like every other goodie's key, so clearing one tool's autosave never touches another's.
export const STORAGE_KEY = "viewbox-explorer:state";

// Looks a sample up by slug, falling back to the first so a stale permalink still shows a drawing.
export function findSample(slug: string): ViewboxSample {
  return viewboxExplorerSamples.find((sample) => sample.slug === slug) ?? viewboxExplorerSamples[0];
}

// The source actually on the light box — a pasted drawing wins over the sample while it's loaded.
export function activeSource(state: ViewboxExplorerEditorState): string {
  return state.customSource ?? findSample(state.sampleSlug).source;
}

// Copied rather than passed by reference, so the live undo-stack object never reaches JSON.stringify or a URL encoder.
export function toShareableState(state: ViewboxExplorerEditorState): ViewboxExplorerShareableState {
  return { ...state, viewBox: { ...state.viewBox }, viewport: { ...state.viewport } };
}

// A preset as a fresh editor state — any pasted drawing is dropped, since the preset's numbers only make sense over its own sample.
export function applyPreset(preset: ViewboxPreset): ViewboxExplorerEditorState {
  return {
    sampleSlug: preset.sampleSlug,
    customSource: null,
    viewBox: { ...preset.viewBox },
    viewport: { ...preset.viewport },
    align: preset.align,
    meetOrSlice: preset.meetOrSlice
  };
}

// Opens on the letterbox preset: a square canvas in a wide window is the mismatch that makes preserveAspectRatio matter at all.
export function createDefaultEditorState(): ViewboxExplorerEditorState {
  const preset = viewboxExplorerPresets.find((p) => p.slug === "letterbox") ?? viewboxExplorerPresets[0];
  return applyPreset(preset);
}

/*
  Loads the strongest available starting state: a shared `?state=` link first, then this browser's
  own autosave, then the default — the same priority order every other goodie uses.
*/
export function loadInitialState(sharedState: string | null): ViewboxExplorerEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const saved = raw ? normaliseState(JSON.parse(raw)) : null;
      if (saved) return saved;
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default rather than crash the page.
    }
  }
  return createDefaultEditorState();
}

// Pure swap; clamping against the light box happens where the extent is known, before this is called.
export function setViewBox(state: ViewboxExplorerEditorState, viewBox: ViewBoxRect): ViewboxExplorerEditorState {
  return { ...state, viewBox };
}

// Whole pixels only, inside the slider's range — a fractional viewport would just blur the print.
export function setViewport(state: ViewboxExplorerEditorState, viewport: ViewportSize): ViewboxExplorerEditorState {
  return {
    ...state,
    viewport: { width: clamp(Math.round(viewport.width), VIEWPORT_MIN, VIEWPORT_MAX), height: clamp(Math.round(viewport.height), VIEWPORT_MIN, VIEWPORT_MAX) }
  };
}

// Alignment on its own — meet/slice is kept, so flicking back from none restores the previous mode.
export function setAlign(state: ViewboxExplorerEditorState, align: AspectAlign): ViewboxExplorerEditorState {
  return { ...state, align };
}

// Choosing a mode while on none also picks the centred alignment, otherwise the click would appear to do nothing.
export function setMeetOrSlice(state: ViewboxExplorerEditorState, meetOrSlice: MeetOrSlice): ViewboxExplorerEditorState {
  return { ...state, meetOrSlice, align: state.align === "none" ? "xMidYMid" : state.align };
}

// One tour stop sets both halves of the attribute together.
export function setTourStep(state: ViewboxExplorerEditorState, step: TourStep): ViewboxExplorerEditorState {
  return { ...state, align: step.align, meetOrSlice: step.meetOrSlice };
}

// A new sample brings its own coordinate system, so the easel resets to frame the whole of it.
export function selectSample(state: ViewboxExplorerEditorState, slug: string): ViewboxExplorerEditorState {
  const sample = findSample(slug);
  const bounds = boundsFromSource(sample.source) ?? state.viewBox;
  return { ...state, sampleSlug: sample.slug, customSource: null, viewBox: { ...bounds } };
}

// A pasted drawing likewise reframes the easel around the drawing's own declared bounds.
export function loadCustomDrawing(state: ViewboxExplorerEditorState, source: string, bounds: ViewBoxRect): ViewboxExplorerEditorState {
  return { ...state, customSource: source, viewBox: { ...bounds } };
}

// Snaps the easel back to the drawing's authored viewBox — the natural "undo all my framing" move.
export function fitToDrawing(state: ViewboxExplorerEditorState, bounds: ViewBoxRect): ViewboxExplorerEditorState {
  return { ...state, viewBox: { ...bounds } };
}

/*
  Reshapes the easel to the paper's aspect ratio about its own centre, so alignment and meet/slice
  stop mattering — the post's advice for predictable maths, made one click. Shrinks to fit inside
  the light box if the new shape would overflow it.
*/
export function matchViewportRatio(state: ViewboxExplorerEditorState, extent: ViewBoxRect): ViewboxExplorerEditorState {
  const ratio = state.viewport.width / state.viewport.height;
  const { viewBox } = state;
  let width = viewBox.width;
  let height = width / ratio;
  const fit = Math.min(1, extent.width / width, extent.height / height);
  width *= fit;
  height *= fit;
  const centreX = viewBox.x + viewBox.width / 2;
  const centreY = viewBox.y + viewBox.height / 2;
  const x = clamp(centreX - width / 2, extent.x, extent.x + extent.width - width);
  const y = clamp(centreY - height / 2, extent.y, extent.y + extent.height - height);
  const tidy = (value: number) => Number(value.toFixed(3));
  return { ...state, viewBox: { x: tidy(x), y: tidy(y), width: tidy(width), height: tidy(height) } };
}

// Back to the opening letterbox — the toolbar's escape hatch after an experiment has wandered too far.
export function resetExplorer(): ViewboxExplorerEditorState {
  return createDefaultEditorState();
}
