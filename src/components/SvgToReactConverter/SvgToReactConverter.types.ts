import type { ChangeEvent } from "react";

// One node of the tool's own SVG tree — a plain-object copy of the DOMParser result, so the transform pipeline stays pure (and testable outside a browser) rather than mutating live DOM nodes.
export type SvgNode = SvgElementNode | SvgTextNode | SvgCommentNode;

// Attributes stay an ordered array of pairs rather than a record, since output order should match the source author's order and duplicate-looking names (xlink:href vs href) must both survive until a transform decides.
export interface SvgElementNode {
  kind: "element";
  name: string;
  attributes: Array<[string, string]>;
  children: SvgNode[];
}

// Text inside <text>, <tspan>, <title> or <style> — whitespace-only runs between tags are dropped at parse time.
export interface SvgTextNode {
  kind: "text";
  value: string;
}

// Kept as its own node kind so the "strip cruft" toggle can be switched off and still emit the author's comments as JSX comments.
export interface SvgCommentNode {
  kind: "comment";
  value: string;
}

// Outcome of parsing pasted text — `root` is null with `error` set on failure, so callers can render one or the other without a try/catch of their own.
export interface SvgParseResult {
  root: SvgElementNode | null;
  error: string | null;
  // Whether the raw text opened with an <?xml …?> prolog or a DOCTYPE — DOMParser hides both, so they're sniffed from the source for the transforms log.
  hadProlog: boolean;
}

// "single" only rewrites when the whole icon uses exactly one colour (the safe default for monochrome icons); "all" flattens even multi-colour artwork into one tint.
export type CurrentColorMode = "off" | "single" | "all";

// Default suits one-icon-per-file imports; named suits barrel files that re-export a whole icon set.
export type ExportStyle = "default" | "named";

// Every pipeline step and output switch as its own field, so each maps to exactly one toggle in the options panel and one line in the transforms log.
export interface SvgToReactOptions {
  camelCaseProps: boolean;
  stripCruft: boolean;
  inlineStyles: boolean;
  removeDimensions: boolean;
  currentColor: CurrentColorMode;
  spreadProps: boolean;
  titleProp: boolean;
  sizeProp: boolean;
  forwardRef: boolean;
  memo: boolean;
  typescript: boolean;
  exportStyle: ExportStyle;
  reactNative: boolean;
}

// Everything a permalink or autosave needs to rebuild the exact same conversion.
export interface SvgToReactEditorState {
  source: string;
  // The file (or preset) the source came from — kept separately from componentName so a hand-edited name isn't clobbered by re-deriving it on every keystroke.
  fileName: string;
  componentName: string;
  options: SvgToReactOptions;
}

// Nothing in this tool's persisted state is UI-only — the preview's tint and size live in PreviewPane's own local state instead — so the shareable form is the whole state.
export type SvgToReactShareableState = SvgToReactEditorState;

// One "what changed" line — `tone` lets the log flag skipped or risky steps (a multi-colour icon left alone, a <script> removed) differently from routine ones.
export interface TransformLogEntry {
  id: string;
  message: string;
  tone: "info" | "warning";
}

// The full conversion outcome every panel reads from one memoised call, rather than each panel re-parsing and re-transforming the same source.
export interface SvgToReactResult {
  error: string | null;
  // Preview-ready trees: both sanitised and with <style> sheets inlined, so rendering either into this page can't restyle the rest of it.
  original: SvgElementNode | null;
  converted: SvgElementNode | null;
  code: string;
  log: TransformLogEntry[];
  componentName: string;
  bytesBefore: number;
  bytesAfter: number;
}

// A curated sample file — carries its own file name so applying it derives a component name exactly as an upload would.
export interface SvgToReactPresetMeta {
  slug: string;
  name: string;
  // Short provenance tag ("Inkscape", "Illustrator", …) shown under the name, since the presets exist to demonstrate each editor's particular cruft.
  origin: string;
  fileName: string;
  source: string;
}

// Every mutation SvgToReactConverter exposes to its children, bundled into one object — mirrors every other goodie's own *Actions style so subcomponents never touch the undo stack directly.
export interface SvgToReactActions {
  setSource: (source: string) => void;
  loadFile: (fileName: string, source: string) => void;
  setComponentName: (name: string) => void;
  setOption: <K extends keyof SvgToReactOptions>(key: K, value: SvgToReactOptions[K]) => void;
  commitDrag: () => void;
  applyPreset: (preset: SvgToReactPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetConverter: () => void;
}

// Needs the result as well as the state, so a parse error can sit right under the field that caused it.
export interface InputPanelProps {
  state: SvgToReactEditorState;
  result: SvgToReactResult;
  actions: SvgToReactActions;
}

// The options panel only reads state and dispatches toggles — it never needs the conversion result.
export interface OptionsPanelProps {
  state: SvgToReactEditorState;
  actions: SvgToReactActions;
}

// Both previews render from the result's already-sanitised trees, never from the raw source.
export interface PreviewPaneProps {
  result: SvgToReactResult;
}

// The log is a pure read of the result, so it takes nothing else.
export interface TransformLogProps {
  result: SvgToReactResult;
}

// State supplies the TS/JS choice for the file extension; the result supplies the code and byte counts.
export interface ExportPanelProps {
  state: SvgToReactEditorState;
  result: SvgToReactResult;
}

// Presets only ever dispatch, so actions are all the gallery needs.
export interface PresetGalleryProps {
  actions: SvgToReactActions;
}

// The permalink encodes the state, not the derived result, so links stay small and re-run the pipeline on load.
export interface ShareControlsProps {
  state: SvgToReactEditorState;
}

// A labelled checkbox row — the id ties the visible label to its input for screen readers and click targets.
export interface ToggleFieldProps {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

// The preview's size slider — no commit callback, since preview size is local UI state outside the undo stack.
export interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}

// A JSX attribute as the emitter prints it — `expression` values are printed inside braces verbatim, so dynamic wiring (size, title id, ref) and literal markup share one code path.
export type JsxAttribute = { name: string; value: string; expression: boolean } | { spread: string };

// The emitter's per-run settings — kept separate from SvgToReactOptions since the root's dynamic wiring is decided once by the caller, not per element.
export interface EmitContext {
  options: SvgToReactOptions;
  rootExtras: JsxAttribute[];
  rootPrefixChildren: string[];
  nativeComponents: Set<string>;
}

// What the component's signature needs, worked out once so the imports, the props type and the destructuring all agree.
export interface PropsPlan {
  destructured: string[];
  hasProps: boolean;
  usesTitle: boolean;
}

// Running tally of what sanitisation removed, so the log can say exactly what an untrusted paste contained.
export interface SanitiseCounts {
  elements: number;
  handlers: number;
  urls: number;
}

// Settings for one preview render — the id prefix keeps two previews of the same artwork from fighting over the same gradient/clip ids in one document.
export interface RenderSvgOptions {
  idPrefix: string;
  rootProps?: Record<string, string | number | undefined>;
}
