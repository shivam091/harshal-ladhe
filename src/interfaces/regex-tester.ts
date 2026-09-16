// One node in the explain-panel's breakdown tree — `token` is always the exact substring of the pattern this node covers (sliced from a parse cursor, never hand-reconstructed), `description` is the plain-English readout, and `children` holds a group's inner breakdown or a quantifier's wrapped atom.
export interface ExplainNode {
  id: string;
  token: string;
  description: string;
  children?: ExplainNode[];
}

// The tool's entire editable state — a pattern, its flags, and the text it's tested against. Mirrors CronEditorState in spirit: one flat object every subcomponent reads from, so there's a single source of truth for undo/redo, permalinks, and autosave to all agree on.
export interface RegexTesterEditorState {
  pattern: string;
  flags: string;
  testString: string;
}

// Nothing in this tool's state is UI-only (no selection, no scrubber position) — the shareable form is the whole state.
export type RegexTesterShareableState = RegexTesterEditorState;

// One curated pattern/flags/test-string trio offered in the preset gallery.
export interface RegexTesterPresetMeta {
  slug: string;
  name: string;
  pattern: string;
  flags: string;
  testString: string;
}

// Every mutation RegexTester exposes to its children, bundled into one object — mirrors every other goodie's own *Actions style so subcomponents never touch the reducer/undo-stack directly.
export interface RegexTesterActions {
  setPattern: (pattern: string) => void;
  setTestString: (value: string) => void;
  toggleFlag: (flag: string) => void;
  // Checkpoints the current state onto the undo stack — call once per discrete edit (a text field's own change+blur pair, or a flag toggle).
  commitDrag: () => void;
  applyPreset: (preset: RegexTesterPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetTester: () => void;
}

// Props for PatternControls — the pattern/flags half of the tool's input.
export interface PatternControlsProps {
  state: RegexTesterEditorState;
  actions: RegexTesterActions;
}

// Props for MatchHighlight — the test-string editor plus its highlighter-tape annotated readout.
export interface MatchHighlightProps {
  state: RegexTesterEditorState;
  actions: RegexTesterActions;
}

// Props for MatchList — the sticky-note capture-group breakdown; read-only, so it needs no actions.
export interface MatchListProps {
  state: RegexTesterEditorState;
}

// Props for ExplainPanel — the plain-English pattern breakdown; read-only.
export interface ExplainPanelProps {
  state: RegexTesterEditorState;
}

// Props for ExportPanel — the JS/Python/Java code-export tabs; read-only.
export interface ExportPanelProps {
  state: RegexTesterEditorState;
}

// Props for PresetGallery — only needs actions since it never reads the current state.
export interface PresetGalleryProps {
  actions: RegexTesterActions;
}

// Props for ShareControls — the permalink readout; read-only.
export interface ShareControlsProps {
  state: RegexTesterEditorState;
}
