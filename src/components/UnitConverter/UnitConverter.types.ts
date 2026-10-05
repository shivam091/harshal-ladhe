// Every unit the converter resolves — kept to the lengths whose px value is fully determined by a handful of context numbers, so each row can always be converted both ways.
export type CssUnit = "px" | "rem" | "em" | "vw" | "vh" | "cqi" | "%" | "pt";

/*
  The surroundings a relative unit resolves against. Only px and pt are absolute — every other unit
  is meaningless without one of these numbers, so they're editable state rather than hidden
  assumptions baked into the maths.
*/
export interface UnitContext {
  rootFontSize: number;
  parentFontSize: number;
  viewportWidth: number;
  viewportHeight: number;
  containerInlineSize: number;
  parentWidth: number;
}

/*
  Full runtime editor state. The typed value is stored in whichever unit it was typed in (`sourceUnit`)
  rather than pre-converted to px, so changing the context re-resolves the length the person actually
  asked about — 2rem stays 2rem when the root font size changes, and every other row follows it.
*/
export interface UnitConverterEditorState {
  context: UnitContext;
  value: number;
  sourceUnit: CssUnit;
  precision: number;
  batchInput: string;
  batchUnit: CssUnit;
  batchPrefix: string;
}

// Nothing in this tool's state is UI-only, so the permalink carries the whole editor state — kept as its own name so every goodie's serialize util reads the same.
export type UnitConverterShareableState = UnitConverterEditorState;

// Per-unit copy for the "where it resolves" notes and each row's basis label.
export interface UnitMeta {
  unit: CssUnit;
  name: string;
  resolvesAgainst: string;
  note: string;
}

// A curated context shown in the preset gallery — only the surroundings change, never the value being measured.
export interface UnitConverterPresetMeta {
  slug: string;
  name: string;
  summary: string;
  context: UnitContext;
}

// One tick on a ruler strip — position in true CSS px from the tape's zero, plus an optional label for major ticks.
export interface RulerTick {
  x: number;
  major: boolean;
  label: string | null;
}

/*
  Every mutation UnitConverter exposes to its children, bundled into one object — mirrors every
  other goodie's own *Actions style so subcomponents never touch the undo stack directly.
*/
export interface UnitConverterActions {
  setValue: (unit: CssUnit, value: number) => void;
  setLengthPx: (px: number) => void;
  setContext: (patch: Partial<UnitContext>) => void;
  setPrecision: (decimals: number) => void;
  setBatchInput: (text: string) => void;
  setBatchUnit: (unit: CssUnit) => void;
  setBatchPrefix: (prefix: string) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture or finished edit, never per pointermove/input frame.
  commitDrag: () => void;
  applyPreset: (preset: UnitConverterPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetConverter: () => void;
}

// Needs the whole state, not just the context, since the precision slider lives in the same card.
export interface ContextControlsProps {
  state: UnitConverterEditorState;
  actions: UnitConverterActions;
}

// Full state so the table can resolve the typed value to px once and fan it out to every row.
export interface ConversionTableProps {
  state: UnitConverterEditorState;
  actions: UnitConverterActions;
}

// A row gets its value pre-converted, so it never needs the context — only how to format and report an edit.
export interface UnitRowProps {
  meta: UnitMeta;
  value: number;
  basisPx: number;
  precision: number;
  isSource: boolean;
  actions: UnitConverterActions;
}

// The tape both reads the length and writes it back when dragged.
export interface MeasuringTapeProps {
  state: UnitConverterEditorState;
  actions: UnitConverterActions;
}

// Read-only: the notes only need to know which unit to highlight.
export interface UnitNotesProps {
  state: UnitConverterEditorState;
}

// The batch shares the converter's context, so it takes the same full state.
export interface BatchConverterProps {
  state: UnitConverterEditorState;
  actions: UnitConverterActions;
}

// Read-only — every export is derived from state, nothing in the panel edits it.
export interface ExportPanelProps {
  state: UnitConverterEditorState;
}

// Presets only ever write, so the gallery needs actions and no state.
export interface PresetGalleryProps {
  actions: UnitConverterActions;
}

// The permalink encodes the whole shareable state.
export interface ShareControlsProps {
  state: UnitConverterEditorState;
}

// `step` is optional since every context field is whole px; only finer-grained callers pass one.
export interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}
