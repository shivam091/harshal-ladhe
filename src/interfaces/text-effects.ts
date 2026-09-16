/*
  One `text-shadow` layer. `color`/`opacity` mirror ShadowLayer's own split from the box-shadow
  tool exactly (hex + a separate alpha slider, applied via CSS `color-mix()` — see
  compileLayerColor in utils/text-effects.ts) — but there's no spread or inset field here, because
  text-shadow's own syntax has neither: `text-shadow: <x> <y> <blur> <color>` is strictly shorter
  than `box-shadow`'s.
*/
export interface TextShadowLayer {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
  opacity: number;
}

// The three CSS gradient functions this tool's fill can compile to — deliberately excludes repeating variants, matching how far GradientFillControls' own simplified editor goes.
export type GradientFillType = "linear" | "radial" | "conic";

// One color stop in the gradient fill — position is a 0-100 percentage along the gradient, independent of however many stops exist on either side of it.
export interface GradientFillStop {
  id: string;
  color: string;
  position: number;
}

/*
  The `background-clip: text` fill — a separate, optional layer from shadowLayers rather than a
  mode this tool switches between, since gradient-filled text with a soft shadow behind it is a
  common, deliberate combination (the shadow paints from the glyph outlines regardless of the
  text's own fill color being transparent, so the two features compose rather than conflict).
*/
export interface GradientFillConfig {
  enabled: boolean;
  type: GradientFillType;
  angle: number;
  stops: GradientFillStop[];
}

/*
  Full runtime editor state. No ephemeral UI field beyond `selectedLayerId` is needed — this tool
  has no drag-to-select canvas interaction the way ClipPath/Gradient/BorderRadius do, just a plain
  layer list mirroring BoxShadowGenerator's own selection model.
*/
export interface TextEffectsEditorState {
  text: string;
  fontSize: number;
  fontWeight: number;
  // The glyphs' own solid color — only actually painted while gradientFill is off (the fill's `color: transparent` otherwise overrides it), but always kept in state so toggling the gradient back off restores a deliberate color instead of falling back to an unstyled default.
  textColor: string;
  shadowLayers: TextShadowLayer[];
  gradientFill: GradientFillConfig;
  pageColor: string;
  selectedLayerId: string | null;
}

// Deliberately narrower than TextEffectsEditorState — the only slice serialized into a permalink. Excludes `selectedLayerId` (pure UI state) so a shared link never depends on what the sender happened to have selected.
export type TextEffectsShareableState = Omit<TextEffectsEditorState, "selectedLayerId">;

/*
  A curated starting look shown in the preset gallery — deliberately excludes `text` (a preset is
  about the EFFECT, not forcing specific wording onto whatever the user already typed) but still
  carries font weight/size, since e.g. a 3D-text or emboss effect only reads correctly at a
  particular weight.
*/
export interface TextEffectsPresetMeta {
  slug: string;
  name: string;
  fontSize: number;
  fontWeight: number;
  textColor: string;
  shadowLayers: TextShadowLayer[];
  gradientFill: GradientFillConfig;
  pageColor: string;
}

/*
  Every mutation TextEffectsGenerator exposes to its children, bundled into one object (mirrors
  every other goodie's *Actions style) so subcomponents never touch the undo stack directly.
*/
export interface TextEffectsActions {
  setText: (text: string) => void;
  setFontSize: (size: number) => void;
  setFontWeight: (weight: number) => void;
  setTextColor: (color: string) => void;
  addShadowLayer: () => void;
  duplicateShadowLayer: (id: string) => void;
  removeShadowLayer: (id: string) => void;
  // Pure UI state (which layer's controls are showing) — not undo-tracked.
  selectLayer: (id: string | null) => void;
  // Live field update while dragging a slider or an open color picker — does not create an undo step; pair with commitDrag on release/blur.
  updateShadowLayer: (id: string, patch: Partial<Omit<TextShadowLayer, "id">>) => void;
  toggleGradientFill: (enabled: boolean) => void;
  setGradientType: (type: GradientFillType) => void;
  setGradientAngle: (angle: number) => void;
  addGradientStop: () => void;
  removeGradientStop: (id: string) => void;
  updateGradientStop: (id: string, patch: Partial<Omit<GradientFillStop, "id">>) => void;
  setPageColor: (color: string) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture or discrete edit, never per pointermove/input frame.
  commitDrag: () => void;
  applyPreset: (preset: TextEffectsPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetEffects: () => void;
}

// Props for TextControls — the subject text, font size/weight, and text/page color fields.
export interface TextControlsProps {
  state: TextEffectsEditorState;
  actions: TextEffectsActions;
}

// Props for ShadowLayerList — the manuscript-style spec sheet listing every text-shadow layer, plus add/duplicate/remove/select.
export interface ShadowLayerListProps {
  state: TextEffectsEditorState;
  actions: TextEffectsActions;
}

// Props for ShadowLayerControls — the offset/blur/opacity/color fields for whichever shadow layer is currently selected.
export interface ShadowLayerControlsProps {
  state: TextEffectsEditorState;
  actions: TextEffectsActions;
}

// Props for GradientFillControls — the enable toggle, type/angle, and stop list for the optional gradient text fill.
export interface GradientFillControlsProps {
  state: TextEffectsEditorState;
  actions: TextEffectsActions;
}

// Props for PreviewPane — read-only, it only ever renders the compiled result on the spotlight stage.
export interface PreviewPaneProps {
  state: TextEffectsEditorState;
}

// Props for ExportPanel — read-only, drives the CSS/Tailwind/React code readout.
export interface ExportPanelProps {
  state: TextEffectsEditorState;
}

// Props for PresetGallery — only needs actions.applyPreset, never reads state.
export interface PresetGalleryProps {
  actions: TextEffectsActions;
}

// Props for ShareControls — read-only, encodes state into the permalink.
export interface ShareControlsProps {
  state: TextEffectsEditorState;
}

// Props for the shared Slider wrapper around DemoControlField's range primitive.
export interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}
