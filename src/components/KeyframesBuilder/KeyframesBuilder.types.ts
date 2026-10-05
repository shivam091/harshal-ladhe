// The four transform functions a stop can pin — kept as separate channels (rather than one free-form `transform` string) so each one can be opted into per stop and filled in independently when a sibling channel is set elsewhere.
export type TransformChannel = "translateX" | "translateY" | "rotate" | "scale";

// Every numeric property a stop can pin — the slider-driven ones, grouped so property metadata (range, unit, identity) can be looked up from one table.
export type NumericKeyframeProperty = TransformChannel | "opacity" | "borderRadius";

// Every property a stop can pin; background colour is the one non-numeric member, so it gets a colour input instead of a slider.
export type KeyframeProperty = NumericKeyframeProperty | "backgroundColor";

/*
  A stop's own pinned values — every key optional, since leaving a property unset at a stop is the
  whole point: the browser then interpolates that property straight across it from the neighbouring
  stops that do set it, exactly the way a hand-written @keyframes block behaves.
*/
export interface KeyframeValues {
  translateX?: number;
  translateY?: number;
  rotate?: number;
  scale?: number;
  opacity?: number;
  borderRadius?: number;
  // Always a `#rrggbb` hex — what <input type="color"> emits, and safe to drop into an injected <style> tag unescaped.
  backgroundColor?: string;
}

// One keyframe on the timeline. `id` is a deterministic counter-style key (not a random UUID) so the server render and the client's hydration render agree on it.
export interface KeyframeStop {
  id: string;
  // Position along the animation, 0–100 (%). Stored unsorted — the timeline keeps DOM order stable while a stop is dragged past its neighbours, and compilation sorts.
  offset: number;
  values: KeyframeValues;
  // Per-stop `animation-timing-function` override for the segment that STARTS at this stop; null falls back to the animation's own timing function.
  timingFunction: string | null;
}

// `animation-direction`'s four keywords, typed so the select can't produce anything the shorthand wouldn't accept.
export type AnimationDirection = "normal" | "reverse" | "alternate" | "alternate-reverse";

// `animation-fill-mode`'s four keywords, typed for the same reason as AnimationDirection.
export type AnimationFillMode = "none" | "forwards" | "backwards" | "both";

// A finite repeat count or CSS's own `infinite` keyword — kept as the literal keyword rather than Infinity so it survives JSON serialisation into a permalink.
export type IterationCount = number | "infinite";

// Everything the `animation` shorthand needs beyond the keyframes themselves.
export interface KeyframesAnimationSettings {
  name: string;
  durationMs: number;
  delayMs: number;
  iterationCount: IterationCount;
  direction: AnimationDirection;
  fillMode: AnimationFillMode;
  timingFunction: string;
}

// Full runtime builder state — the stops on the sheet, the animation's own settings, and which stop the inspector is editing.
export interface KeyframesBuilderState {
  stops: KeyframeStop[];
  settings: KeyframesAnimationSettings;
  selectedStopId: string | null;
}

// The only slice serialised into a permalink or autosave — excludes `selectedStopId` (pure UI state) so a shared link never depends on which stop the sender happened to have selected.
export type KeyframesBuilderShareableState = Omit<KeyframesBuilderState, "selectedStopId">;

// A preset's stop before it's placed on the sheet — no `id` yet, since ids are minted when the preset is applied so they never collide with the counter.
export interface KeyframesPresetStop {
  offset: number;
  values: KeyframeValues;
  timingFunction?: string;
}

// A curated starting animation shown in the preset gallery — stops plus the settings that make it read correctly (a spin wants `linear`, a heartbeat doesn't).
export interface KeyframesPresetMeta {
  slug: string;
  name: string;
  settings: KeyframesAnimationSettings;
  stops: KeyframesPresetStop[];
}

// Slider metadata for one numeric property — one table drives the inspector's sliders, the compiled CSS units, and the identity value interpolation anchors to.
export interface NumericPropertyMeta {
  key: NumericKeyframeProperty;
  label: string;
  min: number;
  max: number;
  step: number;
  // Appended in the compiled CSS (`px`, `deg`) — empty for unitless values like scale and opacity.
  unit: string;
  // The element's own un-animated value — what an implicit 0%/100% keyframe resolves to, and what a freshly enabled property starts at.
  identity: number;
}

// One labelled timing-function choice — a curated whitelist rather than free text, so a value read from a permalink can never inject arbitrary CSS into the preview's <style> tag.
export interface TimingFunctionOption {
  value: string;
  label: string;
}

/*
  Every mutation KeyframesBuilder exposes to its children, bundled into one object (mirrors every
  other goodie's *Actions style) so subcomponents never touch the undo stack directly.
*/
export interface KeyframesActions {
  // Adds a fresh, empty stop and selects it — a discrete edit, so it records its own undo step.
  addStop: (offset: number) => void;
  // Live update while dragging or arrow-nudging a stop — no undo step; pair with commitDrag on release/keyup.
  moveStop: (id: string, offset: number) => void;
  removeStop: (id: string) => void;
  selectStop: (id: string | null) => void;
  // Live update while a property slider or colour picker moves — pair with commitDrag.
  setStopValue: (id: string, key: KeyframeProperty, value: number | string) => void;
  toggleStopProperty: (id: string, key: KeyframeProperty, enabled: boolean) => void;
  setStopTimingFunction: (id: string, timingFunction: string | null) => void;
  // Live update for continuous settings (sliders, the name field) — pair with commitDrag.
  setSettingLive: <K extends keyof KeyframesAnimationSettings>(key: K, value: KeyframesAnimationSettings[K]) => void;
  // Discrete settings (selects, checkboxes) — records its own undo step.
  setSetting: <K extends keyof KeyframesAnimationSettings>(key: K, value: KeyframesAnimationSettings[K]) => void;
  // Checkpoints the current state onto the undo stack — once per drag gesture or settled edit, never per frame.
  commitDrag: () => void;
  applyPreset: (preset: KeyframesPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetBuilder: () => void;
}

// What the preview reads back from the live element each frame — decomposed into the sheet's own channels so the readout speaks the same language as the inspector.
export interface PlayheadReadout {
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  opacity: number;
  borderRadius: number;
  backgroundColor: string;
}

// The playback store's snapshot — one immutable object, replaced only when something visibly changed, so useSyncExternalStore subscribers don't re-render every frame for nothing.
export interface PlayheadSnapshot {
  // Directed progress through the current iteration, 0–100 — i.e. which keyframe offset is on screen right now, already accounting for reverse/alternate.
  progress: number;
  readout: PlayheadReadout | null;
}

/*
  Playback controller shared by the preview stage and the timeline — the WAAPI handle on the real CSS
  animation plus a tiny external store for the playhead, so only the playhead's own subscribers
  re-render per frame rather than the whole builder.
*/
export interface KeyframesPlayback {
  // Callback ref for the preview element — a setter rather than a RefObject so the playback object can be passed through render freely.
  setTarget: (element: HTMLDivElement | null) => void;
  isPlaying: boolean;
  toggle: () => void;
  restart: () => void;
  // Pauses and jumps the preview to `percent` (a keyframe offset, 0–100) within the first iteration.
  seek: (percent: number) => void;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => PlayheadSnapshot;
}

// The timeline edits stops and drives the playhead, so it needs the state, the actions, and the playback controller.
export interface TimelineProps {
  state: KeyframesBuilderState;
  actions: KeyframesActions;
  playback: KeyframesPlayback;
}

// The preview only reads state — playback carries everything it controls.
export interface PreviewStageProps {
  state: KeyframesBuilderState;
  playback: KeyframesPlayback;
}

// The inspector edits the selected stop, so it needs both state and actions.
export interface StopInspectorProps {
  state: KeyframesBuilderState;
  actions: KeyframesActions;
}

// Settings edit the shorthand's own values, so state and actions both.
export interface AnimationSettingsProps {
  state: KeyframesBuilderState;
  actions: KeyframesActions;
}

// Export is read-only — it compiles whatever state it's given.
export interface ExportPanelProps {
  state: KeyframesBuilderState;
}

// Presets replace the sheet outright, so only the actions are needed.
export interface PresetGalleryProps {
  actions: KeyframesActions;
}

// Share only needs state to encode the permalink.
export interface ShareControlsProps {
  state: KeyframesBuilderState;
}

// The local slider's props — `id` ties the visible label to the input for screen readers.
export interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  // Formats the floating bubble's readout — opacity reads better as a percentage than as 0.35.
  format?: (value: number) => string;
  onChange: (value: number) => void;
  onCommit: () => void;
}
