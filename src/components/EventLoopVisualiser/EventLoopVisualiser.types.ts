// The handful of scheduling primitives the visualiser models — deliberately a closed set, so the simulator can follow the real HTML event-loop rules for each one honestly instead of guessing at arbitrary JavaScript.
export type EventLoopBlockKind = "log" | "timeout" | "microtask" | "promise" | "fetch" | "async" | "raf";

/*
  One statement in the structured program. Every kind shares the same shape so the editor, the
  source generator, and the simulator can all walk the tree with one recursive pattern: `branches`
  holds the nested callback bodies — none for a log, one for setTimeout/queueMicrotask/rAF, one per
  `.then` for a promise chain or fakeFetch, and exactly two (before and after the `await`) for an
  async function.
*/
export interface EventLoopBlock {
  id: string;
  kind: EventLoopBlockKind;
  // The logged message, the async function's name, or the fakeFetch URL — whichever single string that kind needs.
  text: string;
  // Timer delay, fetch latency, or (for an async function) how long the awaited promise takes — 0 there means `await null`.
  delayMs: number;
  branches: EventLoopBlock[][];
}

// Where a new block lands — `null` parent means the top level of the script itself.
export interface EventLoopInsertTarget {
  parentId: string | null;
  branchIndex: number;
}

// Which segment of the loop the turntable points at — the three real stops of one loop iteration, plus idle while it waits on the clock.
export type EventLoopPhase = "task" | "microtask" | "render" | "idle";

// A rail car on one of the sidings — stable ids let React keep the same car element as it moves along a queue, so its slide-in animation only plays once.
export interface EventLoopCar {
  id: string;
  label: string;
  // The block that queued it, so hovering/reading a car can be traced back to its source line.
  blockId: string | null;
}

// A pending Web API (timer or fakeFetch) — carries its due time so the lamp panel can show how long is left on the virtual clock.
export interface EventLoopWebApi extends EventLoopCar {
  kind: "timer" | "fetch";
  dueAtMs: number;
}

// One line written to the console — its own id so the platform board can animate new lines without re-animating old ones.
export interface EventLoopConsoleLine {
  id: string;
  text: string;
}

// The source line a step is executing — a block id plus which of its generated lines (call site, `.then`, `await`, closing brace) is meant.
export interface EventLoopLineRef {
  blockId: string;
  role: string;
}

/*
  A frozen picture of the whole runtime at one step — the simulator emits the full list up front so
  stepping back, scrubbing, and playing are all just an index change, never a re-run.
*/
export interface EventLoopSnapshot {
  stack: EventLoopCar[];
  webApis: EventLoopWebApi[];
  microtasks: EventLoopCar[];
  macrotasks: EventLoopCar[];
  rafCallbacks: EventLoopCar[];
  console: EventLoopConsoleLine[];
  activeLine: EventLoopLineRef | null;
  phase: EventLoopPhase;
  clockMs: number;
  explanation: string;
}

// The simulator's whole output — `truncated` flags a program large enough to hit the step cap, so the UI can say so rather than silently stop.
export interface EventLoopSimulation {
  snapshots: EventLoopSnapshot[];
  truncated: boolean;
}

// Token categories the hand-rolled source renderer colours — generated code is known in advance, so tokens are emitted directly rather than re-parsed.
export type EventLoopTokenType = "keyword" | "function" | "string" | "number" | "punctuation" | "comment" | "plain";

// One coloured run of text within a generated line.
export interface EventLoopToken {
  text: string;
  type: EventLoopTokenType;
}

// One generated source line — carries the block/role it came from so the active step can light up exactly this line.
export interface EventLoopSourceLine {
  indent: number;
  tokens: EventLoopToken[];
  ref: EventLoopLineRef | null;
}

// Full runtime editor state — only the program is undoable; playback position lives outside the undo stack so stepping never pollutes edit history.
export interface EventLoopEditorState {
  program: EventLoopBlock[];
}

// The slice serialised into a permalink — identical to the editor state today, kept as its own type so UI-only fields can be added later without leaking into shared links.
export type EventLoopShareableState = EventLoopEditorState;

// A curated starting program for the preset gallery.
export interface EventLoopPresetMeta {
  slug: string;
  name: string;
  summary: string;
  program: EventLoopBlock[];
}

// Playback speeds offered by the lever frame — milliseconds per step, so "faster" simply means a shorter interval.
export interface EventLoopSpeed {
  label: string;
  intervalMs: number;
}

/*
  Every program mutation EventLoopVisualiser exposes to its children, bundled into one object (the
  same *Actions style every other goodie uses) so subcomponents never touch the undo stack directly.
*/
export interface EventLoopActions {
  // Live update while typing in a block's field — no undo entry; pair with commitEdit on blur.
  updateBlock: (id: string, patch: Partial<Pick<EventLoopBlock, "text" | "delayMs">>) => void;
  // Checkpoints the current program onto the undo stack — called once per finished text/number edit.
  commitEdit: () => void;
  addBlock: (target: EventLoopInsertTarget, kind: EventLoopBlockKind) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, direction: -1 | 1) => void;
  addThen: (id: string) => void;
  removeThen: (id: string) => void;
  applyPreset: (preset: EventLoopPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetProgram: () => void;
}

// Playback controls shared by the lever frame and the keyboard shortcuts — kept apart from EventLoopActions because none of it is undoable program state.
export interface EventLoopPlayback {
  stepIndex: number;
  stepCount: number;
  playing: boolean;
  speedIndex: number;
  locked: boolean;
  goTo: (index: number) => void;
  stepBy: (delta: number) => void;
  togglePlay: () => void;
  setSpeedIndex: (index: number) => void;
  restart: () => void;
}

// The top-level script body plus the shared actions — the editor never owns program state itself.
export interface BlockEditorProps {
  program: EventLoopBlock[];
  actions: EventLoopActions;
}

// Position among siblings is passed down so the move-up/down tools know when to disable themselves.
export interface BlockNodeProps {
  block: EventLoopBlock;
  index: number;
  siblingCount: number;
  depth: number;
  actions: EventLoopActions;
}

// `depth` is the depth the new block would sit at, so the control can hide itself past the nesting limit.
export interface AddBlockControlProps {
  target: EventLoopInsertTarget;
  depth: number;
  actions: EventLoopActions;
}

// The program to render plus the one line the current step should light.
export interface SourcePanelProps {
  program: EventLoopBlock[];
  activeLine: EventLoopLineRef | null;
}

// Playback state and the step's explanation — the explanation travels with the controls because it's what the aria-live region announces.
export interface LeverFrameProps {
  playback: EventLoopPlayback;
  explanation: string;
}

// `hideConsole` masks the departure board while a prediction is still being made.
export interface TrackDiagramProps {
  snapshot: EventLoopSnapshot;
  hideConsole: boolean;
}

// One queue's cars plus how to label and colour its siding.
export interface SidingProps {
  title: string;
  cars: EventLoopCar[];
  emptyLabel: string;
  tone: "stack" | "micro" | "macro" | "raf";
  // The siding the loop is currently drawing from, so its route lamp can light.
  active: boolean;
}

// The loop stage to point the bridge at, and the virtual time shown beneath it.
export interface TurntableProps {
  phase: EventLoopPhase;
  clockMs: number;
}

// Controlled from the root so the console mask and playback lock stay in step with the game's state.
export interface PredictPanelProps {
  answer: EventLoopConsoleLine[];
  enabled: boolean;
  revealed: boolean;
  guess: string[];
  onToggle: () => void;
  onPick: (lineId: string) => void;
  onUndoPick: () => void;
  onClear: () => void;
  onReveal: () => void;
}

// Only needs applyPreset, but takes the whole actions object for parity with every other goodie's gallery.
export interface PresetGalleryProps {
  actions: EventLoopActions;
}

// The full editor state — trimmed to its shareable slice inside the component.
export interface ShareControlsProps {
  state: EventLoopEditorState;
}
