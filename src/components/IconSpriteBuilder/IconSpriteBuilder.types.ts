// One node of the tool's own SVG tree — a plain-object copy of the DOMParser result, so sanitising and id rewriting stay pure rather than mutating live DOM.
export type SpriteNode = SpriteElementNode | SpriteTextNode;

// Attributes stay an ordered array of pairs so the emitted symbol keeps the source author's attribute order.
export interface SpriteElementNode {
  kind: "element";
  name: string;
  attributes: Array<[string, string]>;
  children: SpriteNode[];
}

// Text inside <title>, <desc>, <text> or <tspan> — formatting whitespace between tags is dropped at parse time.
export interface SpriteTextNode {
  kind: "text";
  value: string;
}

// Outcome of parsing one icon's markup — `root` is null with `error` set on failure, so callers never need their own try/catch.
export interface SpriteParseResult {
  root: SpriteElementNode | null;
  error: string | null;
}

// One mounted icon. `key` is a stable React key that survives renaming, since the id itself is editable.
export interface SpriteIcon {
  key: string;
  id: string;
  // Where the icon came from (file name, starter name or "Pasted"), shown as the stamp's provenance line.
  origin: string;
  source: string;
}

// Album-wide switches — flat scalars so one generic setter covers them all.
export interface IconSpriteOptions {
  currentColor: boolean;
  // Path used in the external-file snippets, e.g. "/icons/sprite.svg".
  spritePath: string;
}

// Everything that defines the output; the paste draft and preview tint live in local component state instead, as they aren't part of the sprite.
export interface IconSpriteEditorState {
  icons: SpriteIcon[];
  options: IconSpriteOptions;
}

// A permalink entry: built-in starter icons travel as a short reference rather than their full markup, keeping links small.
export type ShareableIcon = { id: string; starter: string } | { id: string; origin: string; source: string };

// The persisted form drops React keys (regenerated on load) and swaps starter markup for references.
export interface IconSpriteShareableState {
  icons: ShareableIcon[];
  options: IconSpriteOptions;
}

// One "philatelist's note" about an icon — `tone` lets sanitiser removals stand out from routine tidying.
export interface SpriteNote {
  message: string;
  tone: "info" | "warning";
}

// One icon after the pipeline: the effective (slugged, de-duplicated) id, its symbol markup, and what was changed on the way.
export interface ProcessedIcon {
  key: string;
  id: string;
  origin: string;
  viewBox: string;
  symbol: string;
  sourceBytes: number;
  error: string | null;
  notes: SpriteNote[];
}

// The whole build every panel reads from one memoised call, rather than each panel re-parsing every icon.
export interface SpriteBuildResult {
  icons: ProcessedIcon[];
  sprite: string;
  spriteBytes: number;
  separateBytes: number;
  validCount: number;
}

// Settings for one build — the preview needs its own id prefix so its symbols can't clash with anything else on the page.
export interface SpriteBuildOptions {
  idPrefix: string;
}

// The three <use> snippet flavours the output tabs offer.
export type SnippetFlavour = "html" | "react" | "external";

// Output tabs on the first-day cover — the sprite itself plus one per snippet flavour.
export type CoverTab = "sprite" | SnippetFlavour;

// A built-in hand-drawn icon the starter packet offers; `slug` doubles as its permalink reference.
export interface StarterIcon {
  slug: string;
  name: string;
  source: string;
}

// One icon inside a preset set — either a starter reference or bespoke markup that demonstrates a particular pipeline step.
export type PresetIcon = { id: string; starter: string } | { id: string; origin: string; source: string };

// A curated album "set" — carries its own currentColor choice, since multi-colour sets only make sense with it off.
export interface IconSpritePresetMeta {
  slug: string;
  name: string;
  note: string;
  currentColor: boolean;
  icons: PresetIcon[];
}

// Every mutation IconSpriteBuilder exposes to its children, bundled so subcomponents never touch the undo stack directly.
export interface IconSpriteActions {
  addIcons: (entries: Array<{ origin: string; source: string; id?: string }>) => void;
  addStarter: (starter: StarterIcon) => void;
  setIconId: (key: string, id: string) => void;
  commitIconId: (key: string) => void;
  moveIcon: (key: string, delta: number) => void;
  removeIcon: (key: string) => void;
  setCurrentColor: (value: boolean) => void;
  setSpritePath: (path: string) => void;
  commitEdit: () => void;
  applyPreset: (preset: IconSpritePresetMeta) => void;
  clearAlbum: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetBuilder: () => void;
}

// The acquisitions desk only dispatches new icons, so it needs nothing but actions.
export interface AcquisitionsPanelProps {
  actions: IconSpriteActions;
}

// The album needs the raw state for the editable ids and the build result for previews and notes.
export interface AlbumPageProps {
  state: IconSpriteEditorState;
  result: SpriteBuildResult;
  actions: IconSpriteActions;
}

// One stamp mount — position and count drive the reorder buttons' disabled states and labels.
export interface StampMountProps {
  icon: SpriteIcon;
  processed: ProcessedIcon;
  index: number;
  count: number;
  previewPrefix: string;
  size: number;
  tint: string;
  actions: IconSpriteActions;
  // Routed through the album so it can announce the change and keep keyboard focus in place.
  onMove: (icon: SpriteIcon, delta: number) => void;
  onRemove: (icon: SpriteIcon) => void;
}

// The cover reads state for the external path and the result for every piece of output.
export interface FirstDayCoverProps {
  state: IconSpriteEditorState;
  result: SpriteBuildResult;
}

// A highlighted, copyable code block — its own component so each snippet can call the highlighting hook once.
export interface CodeSlipProps {
  code: string;
  language: string;
  label: string;
}

// Album-wide options need the current values and the setter.
export interface OptionsPanelProps {
  state: IconSpriteEditorState;
  actions: IconSpriteActions;
}

// Presets only ever dispatch, so actions are all the gallery needs.
export interface PresetGalleryProps {
  actions: IconSpriteActions;
}

// The permalink encodes the state, not the build, so links stay small and re-run the pipeline on load.
export interface ShareControlsProps {
  state: IconSpriteEditorState;
}

// Tallies of what the clean-up removed, so each stamp can say exactly what an untrusted paste contained.
export interface CleanCounts {
  unsafe: number;
  handlers: number;
  urls: number;
  stylesheets: number;
  dropped: number;
  editorAttributes: number;
}
