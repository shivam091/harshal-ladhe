// One swatch in a generated 11-step ramp, from lightest ("50") to darkest ("950").
export interface RampStop {
  name: string;
  hex: string;
}

// "oklch" generates every step by varying lightness/chroma in OKLCH space at a fixed hue (perceptually uniform, hue-stable); "mix" is the naive approach — linearly interpolating the seed's own sRGB channels toward white/black — kept as a selectable mode specifically so the two can be compared against the same seed.
export type RampMode = "oklch" | "mix";

export interface ColorPaletteEditorState {
  seedColor: string;
  foreground: string;
  background: string;
  rampMode: RampMode;
}

// Every field here doubles as shareable state — unlike the other goodies, nothing in this tool's state is UI-only (no selection, no scrubber position), so there's no narrower type to carve out.
export type ColorPaletteShareableState = ColorPaletteEditorState;

export interface ColorPalettePresetMeta {
  slug: string;
  name: string;
  seedColor: string;
  foreground: string;
  background: string;
  rampMode: RampMode;
}

// Every mutation ColorPaletteGenerator exposes to its children, bundled into one object — mirrors every other goodie's own *Actions style so subcomponents never touch the reducer/undo-stack directly.
export interface ColorPaletteActions {
  setSeedColor: (hex: string) => void;
  setForeground: (hex: string) => void;
  setBackground: (hex: string) => void;
  swapContrastPair: () => void;
  setRampMode: (mode: RampMode) => void;
  // A ramp swatch's own "try this as the background" affordance — the one place the ramp and the contrast checker interact.
  useAsBackground: (hex: string) => void;
  // Checkpoints the current state onto the undo stack — call once per discrete edit (a color input's own change+blur pair counts as one gesture here, since there's no drag-frame stream the way a range slider produces).
  commitDrag: () => void;
  applyPreset: (preset: ColorPalettePresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetPalette: () => void;
}

export interface HexColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (hex: string) => void;
  onCommit: () => void;
}

export interface SeedControlsProps {
  state: ColorPaletteEditorState;
  actions: ColorPaletteActions;
}

export interface ContrastControlsProps {
  state: ColorPaletteEditorState;
  actions: ColorPaletteActions;
}

export interface ContrastResultProps {
  state: ColorPaletteEditorState;
}

export interface RampDisplayProps {
  state: ColorPaletteEditorState;
  actions: ColorPaletteActions;
}

export interface ExportPanelProps {
  state: ColorPaletteEditorState;
}

export interface PresetGalleryProps {
  actions: ColorPaletteActions;
}

export interface ShareControlsProps {
  state: ColorPaletteEditorState;
}
