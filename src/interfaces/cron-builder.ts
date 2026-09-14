// The 5 standard cron fields, each stored as its own raw cron field STRING (e.g. "*", "*/15", "1-5", "9-17/2", "1,15,30") — the single source of truth every other piece (builder UI, description, next-run computation, export) reads from, rather than a separately-tracked structured mode that could drift out of sync with it.
export interface CronFields {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export type CronFieldKey = keyof CronFields;

// The builder UI's per-field mode — "custom" is the graceful fallback for any field string that isn't one of the other five simple shapes (e.g. a compound "1-5,10,20-25/5"), so the tool never rejects a valid cron string it can't fully decompose into a structured widget.
export type CronFieldMode = "every" | "every-n" | "specific" | "range" | "range-step" | "custom";

// What a field string decomposes into for the builder widgets — only the properties relevant to `mode` are populated.
export interface CronFieldModeInfo {
  mode: CronFieldMode;
  step?: number;
  values?: number[];
  rangeStart?: number;
  rangeEnd?: number;
  raw?: string;
}

export type CronEditorState = CronFields;

// Nothing in this tool's state is UI-only (no selection, no scrubber position) — the shareable form is the whole state.
export type CronShareableState = CronEditorState;

export interface CronPresetMeta {
  slug: string;
  name: string;
  fields: CronFields;
}

// Every mutation CronBuilder exposes to its children, bundled into one object — mirrors every other goodie's own *Actions style so subcomponents never touch the reducer/undo-stack directly.
export interface CronActions {
  setField: (key: CronFieldKey, raw: string) => void;
  commitDrag: () => void;
  applyPreset: (preset: CronPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetBuilder: () => void;
}

export interface FieldBuilderProps {
  fieldKey: CronFieldKey;
  label: string;
  min: number;
  max: number;
  // This field's accent color (a full hsl() string) — see components/CronBuilder/cron-field-colors.ts.
  accent: string;
  state: CronEditorState;
  actions: CronActions;
}

export interface FieldGridProps {
  state: CronEditorState;
  actions: CronActions;
}

export interface DescriptionPanelProps {
  state: CronEditorState;
}

export interface NextRunsPanelProps {
  state: CronEditorState;
}

export interface ExportPanelProps {
  state: CronEditorState;
}

export interface PresetGalleryProps {
  actions: CronActions;
}

export interface ShareControlsProps {
  state: CronEditorState;
}
