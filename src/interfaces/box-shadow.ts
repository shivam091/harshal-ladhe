// One `box-shadow` layer. `color` is always a hex string from a native <input type="color">
// (matching every other goodie's color convention); `opacity` is a separate 0-100 slider rather
// than baked into the hex — see compileLayerColor in utils/box-shadow.ts for why that needs no
// hex-parsing utility at all (CSS's own `color-mix()` adds the alpha).
export interface ShadowLayer {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

/*
  Full runtime editor state. surfaceColor/pageColor/borderRadius live here rather than being pure
  preview-only cosmetics because a layered shadow's legibility depends on them — neumorphism
  specifically only reads correctly when the surface and page colors are close to identical, so a
  preset needs to set both alongside its shadow layers.
*/
export interface BoxShadowEditorState {
  // Order is significant and matches CSS's own stacking rule — the first layer renders closest to the viewer (on top), each subsequent one further back.
  layers: ShadowLayer[];
  selectedLayerId: string | null;
  surfaceColor: string;
  pageColor: string;
  borderRadius: number;
}

// Deliberately narrower than BoxShadowEditorState — the only slice serialized into a permalink/autosave. Excludes `selectedLayerId` (pure UI state) so a shared link never depends on what the sender happened to have selected.
export type BoxShadowShareableState = Omit<BoxShadowEditorState, "selectedLayerId">;

// A curated starting look shown in the preset gallery — a plain {layers, surfaceColor, pageColor, borderRadius} bundle, so a thumbnail can render it with the exact same compileBoxShadowValue call the main preview uses.
export interface BoxShadowPresetMeta {
  slug: string;
  name: string;
  layers: ShadowLayer[];
  surfaceColor: string;
  pageColor: string;
  borderRadius: number;
}

/*
  Every mutation BoxShadowGenerator exposes to its children, bundled into one object so
  subcomponents never touch the undo stack directly.
*/
export interface BoxShadowActions {
  addLayer: () => void;
  duplicateLayer: (id: string) => void;
  removeLayer: (id: string) => void;
  // Pure UI state (which layer's controls are showing) — not undo-tracked.
  selectLayer: (id: string | null) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  // Live field update while dragging a slider or an open color picker — does not create an undo step; pair with commitDrag on release/blur.
  updateLayer: (id: string, patch: Partial<Omit<ShadowLayer, "id">>) => void;
  toggleInset: (id: string, inset: boolean) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture or discrete edit, never per pointermove/input frame.
  commitDrag: () => void;
  setSurfaceColor: (color: string) => void;
  setPageColor: (color: string) => void;
  setBorderRadius: (radius: number) => void;
  applyPreset: (preset: BoxShadowPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetShadow: () => void;
}

// Props for LayerList — the stacked-deck view of every layer, plus reordering/duplicate/remove/select.
export interface LayerListProps {
  state: BoxShadowEditorState;
  actions: BoxShadowActions;
}

// Props for LayerControls — the offset/blur/spread/opacity/color/inset fields for whichever layer is currently selected.
export interface LayerControlsProps {
  state: BoxShadowEditorState;
  actions: BoxShadowActions;
}

// Props for SurfaceControls — the surface/page color and border-radius fields that frame the shadow rather than belonging to any one layer.
export interface SurfaceControlsProps {
  state: BoxShadowEditorState;
  actions: BoxShadowActions;
}

// Props for PreviewPane — read-only, it only ever renders the compiled result.
export interface PreviewPaneProps {
  state: BoxShadowEditorState;
}

// Props for ExportPanel — read-only, drives the CSS/Tailwind/React code readout.
export interface ExportPanelProps {
  state: BoxShadowEditorState;
}

// Props for PresetGallery — only needs actions.applyPreset, never reads state.
export interface PresetGalleryProps {
  actions: BoxShadowActions;
}

// Props for ShareControls — read-only, encodes state into the permalink.
export interface ShareControlsProps {
  state: BoxShadowEditorState;
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
