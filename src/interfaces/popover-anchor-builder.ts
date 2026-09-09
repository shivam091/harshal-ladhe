// Which edge (or the center) of the trigger the popover tethers to via `anchor()` — drives both which physical sides get set in the compiled CSS and which glyph lights up in the compass-style side-picker.
export type AnchorSide = "top" | "right" | "bottom" | "left" | "center";

// Mirrors the two real values the HTML `popover` attribute accepts (excluding the newer "hint") — "auto" light-dismisses on outside click/Esc, "manual" only closes via an explicit popovertargetaction/JS call.
export type PopoverMode = "auto" | "manual";

// What renders inside the popover — purely a preview/export authoring convenience (not a CSS/anchor concern) so the 3+ presets can double as a tour of realistic popover contents rather than all showing the same placeholder text.
export type PopoverContent = "text" | "menu" | "dialog";

export interface PopoverAnchorEditorState {
  anchorSide: AnchorSide;
  // Gap, in px, between the anchor's edge and the popover — meaningless when anchorSide is "center" (the popover sits centered directly over the trigger regardless), which the UI notes.
  offset: number;
  mode: PopoverMode;
  // Whether `::backdrop` renders a dimming layer behind the open popover.
  backdrop: boolean;
  // Whether the popover fades/scales in via `@starting-style` + `allow-discrete`, or pops instantly with no transition.
  entranceAnimation: boolean;
  // Whether the exported/live CSS includes a `position-try-fallbacks` value for this side (a no-op when anchorSide is "center", which has no opposite side to flip to).
  fallback: boolean;
  content: PopoverContent;
}

// Nothing in this tool's state is UI-only (no selection, no scrubber position) — the shareable form is the whole state, same reasoning as TriangleShareableState.
export type PopoverAnchorShareableState = PopoverAnchorEditorState;

export interface PopoverAnchorPresetMeta {
  slug: string;
  name: string;
  anchorSide: AnchorSide;
  offset: number;
  mode: PopoverMode;
  backdrop: boolean;
  entranceAnimation: boolean;
  fallback: boolean;
  content: PopoverContent;
}

// Every mutation PopoverAnchorBuilder exposes to its children, bundled into one object — mirrors TriangleActions so subcomponents never touch the reducer/undo-stack directly.
export interface PopoverAnchorActions {
  setAnchorSide: (side: AnchorSide) => void;
  setOffset: (offset: number) => void;
  // Checkpoints the current state onto the undo stack — the offset slider's onCommit, called once per drag gesture rather than per input frame.
  commitDrag: () => void;
  setMode: (mode: PopoverMode) => void;
  setBackdrop: (backdrop: boolean) => void;
  setEntranceAnimation: (enabled: boolean) => void;
  setFallback: (enabled: boolean) => void;
  setContent: (content: PopoverContent) => void;
  applyPreset: (preset: PopoverAnchorPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetShape: () => void;
}

export interface AnchorSideControlsProps {
  state: PopoverAnchorEditorState;
  actions: PopoverAnchorActions;
}

export interface BehaviorControlsProps {
  state: PopoverAnchorEditorState;
  actions: PopoverAnchorActions;
}

export interface PreviewPaneProps {
  state: PopoverAnchorEditorState;
}

export interface ExportPanelProps {
  state: PopoverAnchorEditorState;
}

export interface PresetGalleryProps {
  actions: PopoverAnchorActions;
}

export interface ShareControlsProps {
  state: PopoverAnchorEditorState;
}

export interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
  // Local extension beyond TriangleGenerator's own Slider — the offset slider has no effect while anchorSide is "center", so AnchorSideControls disables it rather than leaving a control on screen that silently does nothing.
  disabled?: boolean;
}
