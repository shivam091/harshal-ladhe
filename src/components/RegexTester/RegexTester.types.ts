// One matching job sent to the worker — `id` lets a reply from an abandoned job be ignored.
export interface RegexMatchRequest {
  id: number;
  pattern: string;
  flags: string;
  testString: string;
}

// The worker's reply for one job.
export interface RegexMatchResponse {
  id: number;
  result: RegexResult;
}

// One node in the explain-panel's breakdown tree — `token` is always the exact substring of the pattern this node covers (sliced from a parse cursor, never hand-reconstructed), `description` is the plain-English readout, and `children` holds a group's inner breakdown or a quantifier's wrapped atom.
export interface ExplainNode {
  id: string;
  token: string;
  description: string;
  children?: ExplainNode[];
}

// The tool's entire editable state — a pattern, its flags, and the text it's tested against. Mirrors CronEditorState in spirit: one flat object every subcomponent reads from, so there's a single source of truth every panel agrees on.
export interface RegexTesterEditorState {
  pattern: string;
  flags: string;
  testString: string;
}

// One curated pattern/flags/test-string trio offered in the preset gallery.
export interface RegexTesterPresetMeta {
  slug: string;
  name: string;
  pattern: string;
  flags: string;
  testString: string;
}

// Every mutation RegexTester exposes to its children, bundled into one object — mirrors every other goodie's own *Actions style so subcomponents never touch the state directly.
export interface RegexTesterActions {
  setPattern: (pattern: string) => void;
  setTestString: (value: string) => void;
  toggleFlag: (flag: string) => void;
  applyPreset: (preset: RegexTesterPresetMeta) => void;
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
  // Matched once by the root (in a worker) and shared, rather than each panel re-running the pattern.
  result: RegexResult;
  pending: boolean;
}

// Props for MatchList — the sticky-note capture-group breakdown; read-only, so it needs no actions.
export interface MatchListProps {
  result: RegexResult;
}

// Props for ExplainPanel — the plain-English pattern breakdown; read-only.
export interface ExplainPanelProps {
  state: RegexTesterEditorState;
}

// Props for ExportPanel — the JS/Ruby/Python/Java code-export tabs; read-only.
export interface ExportPanelProps {
  state: RegexTesterEditorState;
}

// Props for PresetGallery — only needs actions since it never reads the current state.
export interface PresetGalleryProps {
  actions: RegexTesterActions;
}


// One regex match's full text plus every capture group — numbered groups by their fixed left-to-right position (undefined if that group didn't participate), named groups as name/value pairs (a named group is also one of the numbered ones, kept separately so callers can render either view).
export interface RegexMatch {
  index: number;
  match: string;
  numberedGroups: Array<string | undefined>;
  namedGroups: Array<{ name: string; value: string | undefined }>;
}

// Outcome of running a pattern against a test string — `valid`/`error` cover a pattern the RegExp constructor itself rejected, distinct from a valid pattern that simply found zero matches. `timedOut` marks a run abandoned for catastrophic backtracking.
export interface RegexResult {
  valid: boolean;
  error: string | null;
  matches: RegexMatch[];
  truncated: boolean;
  timedOut?: boolean;
}

// One run of the test string — either inside a match or not — as consumed by the highlighted preview. `matchIndex` ties a matched run back to its RegexMatch, so zero-length matches can't shift the colours of later ones.
export interface HighlightSegment {
  text: string;
  matched: boolean;
  matchIndex?: number;
}
