import { clamp } from "@/utils/number";
import type { AnchorSide, PopoverAnchorEditorState, PopoverAnchorPresetMeta, PopoverContent, PopoverMode } from "@/interfaces/popover-anchor-builder";

// Nothing derives a narrower shareable shape from the editor state (see PopoverAnchorShareableState) — identity function kept only so every call site reads the same "editor state → shareable state" step every other goodie also has, rather than special-casing this one tool.
export function toShareableState(state: PopoverAnchorEditorState): PopoverAnchorEditorState {
  return state;
}

// A small tethered tooltip is the least surprising thing to land on first — bottom-anchored, auto-dismissing, animated in, with a fallback in case the viewport's too short below it.
export function createDefaultEditorState(): PopoverAnchorEditorState {
  return { anchorSide: "bottom", offset: 8, mode: "auto", backdrop: false, entranceAnimation: true, fallback: true, content: "text" };
}

export function setAnchorSide(state: PopoverAnchorEditorState, anchorSide: AnchorSide): PopoverAnchorEditorState {
  return { ...state, anchorSide };
}

// 0-64px covers everything from "touching" to a generously spaced flyout without the popover drifting so far it reads as unrelated to its trigger.
export function setOffset(state: PopoverAnchorEditorState, offset: number): PopoverAnchorEditorState {
  return { ...state, offset: clamp(offset, 0, 64) };
}

export function setMode(state: PopoverAnchorEditorState, mode: PopoverMode): PopoverAnchorEditorState {
  return { ...state, mode };
}

export function setBackdrop(state: PopoverAnchorEditorState, backdrop: boolean): PopoverAnchorEditorState {
  return { ...state, backdrop };
}

export function setEntranceAnimation(state: PopoverAnchorEditorState, entranceAnimation: boolean): PopoverAnchorEditorState {
  return { ...state, entranceAnimation };
}

export function setFallback(state: PopoverAnchorEditorState, fallback: boolean): PopoverAnchorEditorState {
  return { ...state, fallback };
}

export function setContent(state: PopoverAnchorEditorState, content: PopoverContent): PopoverAnchorEditorState {
  return { ...state, content };
}

export function applyPreset(state: PopoverAnchorEditorState, preset: PopoverAnchorPresetMeta): PopoverAnchorEditorState {
  const { anchorSide, offset, mode, backdrop, entranceAnimation, fallback, content } = preset;
  return { ...state, anchorSide, offset, mode, backdrop, entranceAnimation, fallback, content };
}

// Named to match every other goodie's own reset helper (see triangle-editor.ts's resetShape) even though this tool has no literal "shape" — kept for house consistency rather than inventing a one-off name for the same job.
export function resetShape(): PopoverAnchorEditorState {
  return createDefaultEditorState();
}
