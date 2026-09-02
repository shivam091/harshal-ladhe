// One node in the explain-panel's breakdown tree — `token` is always the exact substring of the pattern this node covers (sliced from a parse cursor, never hand-reconstructed), `description` is the plain-English readout, and `children` holds a group's inner breakdown or a quantifier's wrapped atom.
export interface ExplainNode {
  id: string;
  token: string;
  description: string;
  children?: ExplainNode[];
}

export interface RegexTesterEditorState {
  pattern: string;
  flags: string;
  testString: string;
}

// Nothing in this tool's state is UI-only (no selection, no scrubber position) — the shareable form is the whole state.
export type RegexTesterShareableState = RegexTesterEditorState;

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

export interface PatternControlsProps {
  state: RegexTesterEditorState;
  actions: RegexTesterActions;
}

export interface MatchHighlightProps {
  state: RegexTesterEditorState;
  actions: RegexTesterActions;
}

export interface MatchListProps {
  state: RegexTesterEditorState;
}

export interface ExplainPanelProps {
  state: RegexTesterEditorState;
}

export interface ExportPanelProps {
  state: RegexTesterEditorState;
}

export interface PresetGalleryProps {
  actions: RegexTesterActions;
}

export interface ShareControlsProps {
  state: RegexTesterEditorState;
}
