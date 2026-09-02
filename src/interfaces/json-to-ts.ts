// Which conversion is active — each direction keeps its own source text (see JsonToTsEditorState) so switching direction to peek at the other never loses an in-progress draft.
export type ConversionDirection = "json-to-ts" | "ts-to-json";

// A TS type as this tool's generator builds it — deliberately narrow (only what JSON values can ever produce): primitives, arrays, unions (for a JSON array mixing element types), and refs to a generated named interface.
export type TsType =
  | { kind: "primitive"; name: "string" | "number" | "boolean" | "null" | "unknown" }
  | { kind: "array"; element: TsType }
  | { kind: "union"; members: TsType[] }
  | { kind: "ref"; name: string };

export interface TsProperty {
  name: string;
  optional: boolean;
  type: TsType;
}

export interface GeneratedInterface {
  name: string;
  properties: TsProperty[];
}

// A `interface Name { ... }` block as parsed back out of hand-typed TS source for the ts-to-json direction — `typeText` is kept as raw, unparsed source (e.g. "string[]", "Address", "{ a: string }") and only interpreted lazily by sampleForType, since eagerly parsing every type shape into a structured tree isn't needed for sample-value generation.
export interface ParsedTsInterface {
  name: string;
  properties: Array<{ name: string; optional: boolean; typeText: string }>;
}

export interface JsonToTsEditorState {
  direction: ConversionDirection;
  jsonSource: string;
  tsSource: string;
  // Dual-purpose: the root interface/type name to GENERATE for json-to-ts, or the interface name to treat as root when ts-to-json's source defines more than one (falls back to the first parsed interface if it doesn't match any).
  rootName: string;
}

// Nothing in this tool's state is UI-only (no selection, no scrubber position) — the shareable form is the whole state.
export type JsonToTsShareableState = JsonToTsEditorState;

export interface JsonToTsPresetMeta {
  slug: string;
  name: string;
  direction: ConversionDirection;
  jsonSource: string;
  tsSource: string;
  rootName: string;
}

// A conversion attempt's outcome — `code` is empty and `error` set on failure (invalid JSON, no interfaces found) so callers can render one or the other without a try/catch of their own.
export interface ConversionResult {
  code: string;
  error: string | null;
}

// Every mutation JsonToTsGenerator exposes to its children, bundled into one object — mirrors every other goodie's own *Actions style so subcomponents never touch the reducer/undo-stack directly.
export interface JsonToTsActions {
  setDirection: (direction: ConversionDirection) => void;
  setJsonSource: (source: string) => void;
  setTsSource: (source: string) => void;
  setRootName: (name: string) => void;
  commitDrag: () => void;
  applyPreset: (preset: JsonToTsPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetConverter: () => void;
}

export interface InputPanelProps {
  state: JsonToTsEditorState;
  actions: JsonToTsActions;
}

export interface ResultPanelProps {
  state: JsonToTsEditorState;
}

export interface PresetGalleryProps {
  actions: JsonToTsActions;
}

export interface ShareControlsProps {
  state: JsonToTsEditorState;
}
