import type { ChangeEvent } from "react";

// Every optimisation the tool can run, as one id per toggle — the order of PASS_ORDER in the utils is the order they run in.
export type PassId =
  | "stripProlog"
  | "stripComments"
  | "stripMetadata"
  | "removeEmptyAttrs"
  | "removeUnusedIds"
  | "removeEmptyContainers"
  | "collapseGroups"
  | "roundNumbers"
  | "shortenColours"
  | "removeDefaults"
  | "shapesToPaths"
  | "minifyPaths"
  | "removeDimensions"
  | "sortAttrs"
  | "collapseWhitespace";

// One switch per pass, so a permalink can record exactly which ones were on.
export type PassToggles = Record<PassId, boolean>;

// The tool's whole persisted state — the source, where it came from, and how hard to optimise it.
export interface SvgOptimiserEditorState {
  source: string;
  // Kept so the download can be named after the dropped file rather than a generic "optimised.svg".
  fileName: string;
  passes: PassToggles;
  // Decimal places numbers are rounded to — SVGO's floatPrecision, under a friendlier name.
  precision: number;
}

// Nothing here is UI-only, so the shareable form is the whole state.
export type SvgOptimiserShareableState = SvgOptimiserEditorState;

// An attribute kept with its namespace, since editor cruft is recognised by namespace URI rather than by whatever prefix the editor happened to pick.
export interface OptAttribute {
  name: string;
  value: string;
  ns: string | null;
}

// One node of the tool's own tree — a plain-object copy of the DOMParser result, so passes can rewrite it freely without touching a live document.
export type OptNode = OptElement | OptText | OptComment | OptCdata;

// Element nodes keep their qualified name (prefix included) so serialisation round-trips the source author's own prefixes.
export interface OptElement {
  kind: "element";
  name: string;
  ns: string | null;
  attributes: OptAttribute[];
  children: OptNode[];
}

// Raw text, including the formatting whitespace between tags — kept so that the whitespace pass gets credit for removing it.
export interface OptText {
  kind: "text";
  value: string;
}

// Comments are nodes in their own right so the comment pass can count what it removes.
export interface OptComment {
  kind: "comment";
  value: string;
}

// CDATA is re-emitted verbatim, since escaping a <style> sheet's selectors would only make it longer.
export interface OptCdata {
  kind: "cdata";
  value: string;
}

// Things that sit outside the root <svg> — the prolog pass removes doctypes and processing instructions; comments belong to the comment pass.
export interface OptOuterNode {
  kind: "doctype" | "instruction" | "comment";
  value: string;
}

// A parsed file: the root element plus everything around it, so serialising an untouched document gives back (nearly) the original bytes.
export interface OptDocument {
  declaration: string | null;
  before: OptOuterNode[];
  root: OptElement;
  after: OptOuterNode[];
  // What sits between top-level nodes — a line break until the whitespace pass empties it.
  separator: string;
}

// Outcome of parsing pasted text — `doc` is null with `error` set on failure, so callers can render one or the other without a try/catch.
export interface ParseResult {
  doc: OptDocument | null;
  error: string | null;
}

// Settings every pass sees — passes take one shared object so adding a setting doesn't change every signature.
export interface PassContext {
  precision: number;
}

// Each pass rewrites the document in place — the optimiser hands every pass its own working copy.
export type PassFunction = (doc: OptDocument, context: PassContext) => void;

// One row of the postage sheet: how many bytes a pass removed (or would remove, if it's switched off).
export interface PassReport {
  id: PassId;
  enabled: boolean;
  // Bytes removed in sequence when enabled; an estimate on the final output when disabled.
  saved: number;
}

// Running tally of what the preview sanitiser removed, so the preview can say what an untrusted paste contained.
export interface SanitiseCounts {
  elements: number;
  handlers: number;
  urls: number;
}

// The whole optimisation outcome, computed once per state change and read by every panel.
export interface OptimiseResult {
  error: string | null;
  output: string;
  bytesBefore: number;
  bytesAfter: number;
  // The difference between the raw paste and a straight re-serialisation (quote style, entities) — shown so the pass totals add up honestly.
  roundTrip: number;
  reports: PassReport[];
  // Sanitised markup for the two <img> previews — never the raw source.
  previewBefore: string;
  previewAfter: string;
  sanitised: SanitiseCounts;
  // One element per line versions of both documents, so the diff compares structure rather than one enormous minified line.
  prettyBefore: string;
  prettyAfter: string;
}

// A diff line as the code view renders it — `same` lines give context, the other two are what changed.
export interface DiffLine {
  kind: "same" | "added" | "removed";
  text: string;
}

// A row as the diff view draws it — real lines, or a fold standing in for a long unchanged run.
export type DiffRow = DiffLine | { kind: "fold"; count: number };

// The code view's two ways of showing the output.
export type CodeViewMode = "output" | "diff";

// A sample file carrying its own file name, so applying it names the download exactly as an upload would.
export interface SvgOptimiserPresetMeta {
  slug: string;
  name: string;
  // Short provenance tag shown under the name, since each sample shows off one editor's particular cruft.
  origin: string;
  fileName: string;
  source: string;
}

// Static description of a pass — label and blurb for the stamp, plus the default, so the toggle list and the defaults can't drift apart.
export interface PassMeta {
  id: PassId;
  label: string;
  hint: string;
  defaultOn: boolean;
}

// One parsed path command, with every argument as a number — arc flags included, since they're only ever 0 or 1.
export interface PathSegment {
  command: string;
  args: number[];
}

// Every mutation the root exposes, bundled into one object so subcomponents never touch the undo stack directly.
export interface SvgOptimiserActions {
  setSource: (source: string) => void;
  loadFile: (fileName: string, source: string) => void;
  togglePass: (id: PassId, enabled: boolean) => void;
  setAllPasses: (enabled: boolean) => void;
  setPrecision: (precision: number) => void;
  commitEdit: () => void;
  applyPreset: (preset: SvgOptimiserPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetOptimiser: () => void;
}

// Needs the result as well as the state, so a parse error sits right under the field that caused it.
export interface ParcelInputProps {
  state: SvgOptimiserEditorState;
  result: OptimiseResult;
  actions: SvgOptimiserActions;
}

// The postage sheet reads the per-pass savings from the result and dispatches toggles.
export interface PostageStampsProps {
  state: SvgOptimiserEditorState;
  result: OptimiseResult;
  actions: SvgOptimiserActions;
}

// The scale weighs both parcels — the raw source as well as the result, since the gzip estimate needs the original text too.
export interface WeighingScaleProps {
  source: string;
  result: OptimiseResult;
}

// Both gzip weights, null until measured or where CompressionStream is missing.
export interface GzipWeights {
  before: number | null;
  after: number | null;
}

// Both parcels render from the result's sanitised markup, never from the raw source.
export interface ParcelPreviewProps {
  result: OptimiseResult;
}

// State supplies the file name for the download; the result supplies the markup and the diff text.
export interface CodeViewProps {
  state: SvgOptimiserEditorState;
  result: OptimiseResult;
}

// Presets only ever dispatch, so actions are all the gallery needs.
export interface PresetGalleryProps {
  actions: SvgOptimiserActions;
}

// The permalink encodes the state, not the derived result, so links stay small and re-run the passes on load.
export interface ShareControlsProps {
  state: SvgOptimiserEditorState;
}

// The precision slider — live updates while dragging, one undo step on release.
export interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}

// A single stamp's toggle — the id ties the visible label to its checkbox.
export interface StampToggleProps {
  meta: PassMeta;
  report: PassReport | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
