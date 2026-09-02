// The CSS color spaces this tool lets you interpolate in — a curated subset of every space color-mix() actually accepts (skips xyz/xyz-d50/xyz-d65/srgb-linear/display-p3/a98-rgb/prophoto-rgb as niche territory outside what a teaching tool needs to cover).
export type ColorMixSpace = "srgb" | "lab" | "oklab" | "hsl" | "hwb" | "lch" | "oklch";

// Which way a polar space's hue travels between the two colors — only meaningful when `space` is one of the polar spaces (see POLAR_SPACES in helpers/color-mix-editor.ts).
export type ColorMixHueMethod = "shorter" | "longer" | "increasing" | "decreasing";

// Full runtime editor state. Unlike GradientEditorState, every field here also round-trips through the permalink/autosave — there's no separate UI-only selection to carve out.
export interface ColorMixEditorState {
  color1: string;
  color2: string;
  space: ColorMixSpace;
  hueMethod: ColorMixHueMethod;
  // Percentage of color1 in the mix (0-100); color2 implicitly takes the remainder.
  ratio: number;
}

// Nothing in ColorMixEditorState is UI-only, so the shareable state is the whole thing — same reasoning as ColorPaletteShareableState.
export type ColorMixShareableState = ColorMixEditorState;

/*
  A curated starting pair for the preset gallery. Unlike GradientPresetMeta (which deliberately
  excludes colorSpace so a preset never overrides whatever interpolation mode the user is currently
  exploring), here `space` IS the point of several presets — e.g. "Hue clash" only demonstrates
  srgb's muddy midpoint if applying it actually switches to srgb, regardless of what was selected before.
*/
export interface ColorMixPresetMeta {
  slug: string;
  name: string;
  color1: string;
  color2: string;
  space: ColorMixSpace;
  ratio: number;
}

// Every mutation ColorMixPlayground exposes to its children, bundled into one object — mirrors every other goodie's own *Actions style so subcomponents never touch the reducer/undo-stack directly.
export interface ColorMixActions {
  // Live update while a color picker is open; pair with commitDrag on blur/close.
  setColor1: (hex: string) => void;
  setColor2: (hex: string) => void;
  swapColors: () => void;
  setSpace: (space: ColorMixSpace) => void;
  setHueMethod: (hueMethod: ColorMixHueMethod) => void;
  // Live update while dragging the ratio slider — no undo entry; pair with commitDrag on release.
  setRatio: (ratio: number) => void;
  // Checkpoints the current state onto the undo stack — call once per discrete edit or completed drag, never per pointermove/keystroke.
  commitDrag: () => void;
  applyPreset: (preset: ColorMixPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetMix: () => void;
}

export interface HexColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (hex: string) => void;
  onCommit: () => void;
}

export interface ColorInputsProps {
  state: ColorMixEditorState;
  actions: ColorMixActions;
}

export interface SpaceControlsProps {
  state: ColorMixEditorState;
  actions: ColorMixActions;
}

export interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}

export interface PreviewPaneProps {
  state: ColorMixEditorState;
}

export interface ExportPanelProps {
  state: ColorMixEditorState;
}

export interface PresetGalleryProps {
  actions: ColorMixActions;
}

export interface ShareControlsProps {
  state: ColorMixEditorState;
}
