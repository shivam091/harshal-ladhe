// One swatch in a generated 11-step ramp, from lightest ("50") to darkest ("950").
export interface RampStop {
  name: string;
  hex: string;
}

// "oklch" generates every step by varying lightness/chroma in OKLCH space at a fixed hue (perceptually uniform, hue-stable); "mix" is the naive approach — linearly interpolating the seed's own sRGB channels toward white/black — kept as a selectable mode specifically so the two can be compared against the same seed.
export type RampMode = "oklch" | "mix";

// The tool's entire editor state — a seed color, a foreground/background contrast pair to check it against, and which ramp algorithm to use.
export interface ColorPaletteEditorState {
  seedColor: string;
  foreground: string;
  background: string;
  rampMode: RampMode;
}

// Every field here doubles as shareable state — unlike the other goodies, nothing in this tool's state is UI-only (no selection, no scrubber position), so there's no narrower type to carve out.
export type ColorPaletteShareableState = ColorPaletteEditorState;

// One curated preset — a whole seed/contrast-pair/ramp-mode combination applied at once.
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

// Props for the paired native-swatch + typed-hex text field every color input in this tool renders through.
export interface HexColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (hex: string) => void;
  onCommit: () => void;
}

// Props for SeedControls — the swatch card book's own seed-color field.
export interface SeedControlsProps {
  state: ColorPaletteEditorState;
  actions: ColorPaletteActions;
}

// Props for ContrastControls — the foreground/background pair fields plus their swap button.
export interface ContrastControlsProps {
  state: ColorPaletteEditorState;
  actions: ColorPaletteActions;
}

// Props for ContrastResult — read-only, drives the WCAG ink-stamp grade and press-proof sample.
export interface ContrastResultProps {
  state: ColorPaletteEditorState;
}

// Props for RampDisplay — the fanned-swatch flourish, plus the "use as background" affordance each chip exposes.
export interface RampDisplayProps {
  state: ColorPaletteEditorState;
  actions: ColorPaletteActions;
}

// Props for ExportPanel — read-only, drives the CSS/Tailwind/JSON code readout.
export interface ExportPanelProps {
  state: ColorPaletteEditorState;
}

// Props for PresetGallery — write-only, applies a whole seed/contrast-pair/ramp-mode combination at once.
export interface PresetGalleryProps {
  actions: ColorPaletteActions;
}

// Props for ShareControls — read-only, drives the permalink readout.
export interface ShareControlsProps {
  state: ColorPaletteEditorState;
}
