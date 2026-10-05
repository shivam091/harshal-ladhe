// A slider-driven float or a colour-picker-driven vec3 (stored as its #rrggbb hex so the picker and the permalink share one representation).
export type ShaderUniformValue = number | string;

// Which kind of control an annotated uniform declaration asks for — only the two pairings that map cleanly onto a native input (float ↔ range, vec3 ↔ colour).
export type ShaderUniformControlKind = "slider" | "color";

/*
  One `uniform float uFoo; // @slider 0 1 0.5` (or `uniform vec3 uTint; // @color #ff8800`) line,
  parsed out of the source. Carries its own default so a freshly pasted shader renders sensibly
  before anyone touches a control, and an untouched slider never needs an entry in the saved state.
*/
export type ShaderUniformControl =
  | { kind: "slider"; name: string; min: number; max: number; defaultValue: number; step: number }
  | { kind: "color"; name: string; defaultValue: string };

/*
  Full runtime editor state. Deliberately tiny — playback settings (paused, time scale, resolution)
  live inside ShaderCanvas instead, since stepping back through undo history should rewind what
  you wrote, not whether the clock was running at the time.
*/
export interface ShaderPlaygroundEditorState {
  source: string;
  // Only the uniforms someone has actually moved off their annotated default — keyed by uniform name.
  uniformValues: Record<string, ShaderUniformValue>;
}

// The whole editor state is shareable as-is; aliased anyway so a future UI-only field has an obvious place to be excluded, same as every other goodie's own *ShareableState.
export type ShaderPlaygroundShareableState = ShaderPlaygroundEditorState;

// A curated starting shader in the preset gallery — swatch colours give each card a hint of what it renders without spinning up a WebGL context per thumbnail.
export interface ShaderPresetMeta {
  slug: string;
  name: string;
  swatch: [string, string];
  source: string;
}

// One compiler complaint, with `line` already rebased onto the user's own source (null when it points into the generated header/footer or carries no line at all).
export interface ShaderCompileError {
  line: number | null;
  message: string;
}

// What a compile attempt hands back — `ok` is false whenever there's at least one error, so the renderer knows to keep drawing the previous good program.
export interface ShaderCompileResult {
  ok: boolean;
  errors: ShaderCompileError[];
}

// Per-frame Shadertoy-style built-ins, recomputed every tick by ShaderCanvas and pushed to whichever program is currently live.
export interface ShaderFrameUniforms {
  time: number;
  timeDelta: number;
  frame: number;
  // Shadertoy's iMouse convention: xy = last pressed position, zw = click origin (negated once the button is released).
  mouse: [number, number, number, number];
}

/*
  The thin imperative wrapper around one WebGL context — kept as a plain object of closures rather
  than a class so the component never has to care whether it ended up on WebGL2 or the WebGL1
  fallback, and so disposal is one call that drops every GL handle it ever created.
*/
export interface ShaderRenderer {
  isWebGL2: boolean;
  compile: (userSource: string) => ShaderCompileResult;
  render: (frame: ShaderFrameUniforms, controls: ShaderUniformControl[], values: Record<string, ShaderUniformValue>) => void;
  dispose: () => void;
}

/*
  Every mutation ShaderPlayground exposes to its children, bundled into one object (mirrors every
  other goodie's *Actions style) so subcomponents never touch the undo stack directly.
*/
export interface ShaderPlaygroundActions {
  // Live update per keystroke — no undo entry; the editor's blur checkpoints the run of typing via commitEdit.
  setSource: (source: string) => void;
  // Live update while a slider drags or a colour picker scrubs — pair with commitEdit on release.
  setUniformValue: (name: string, value: ShaderUniformValue) => void;
  resetUniforms: () => void;
  // Checkpoints the current state onto the undo stack — once per typing run or drag gesture, never per frame.
  commitEdit: () => void;
  applyPreset: (preset: ShaderPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetPlayground: () => void;
}

export interface SourceEditorProps {
  state: ShaderPlaygroundEditorState;
  actions: ShaderPlaygroundActions;
  errors: ShaderCompileError[];
}

export interface ShaderCanvasProps {
  // The debounced source — compiling every keystroke would thrash the driver and flash errors mid-word.
  source: string;
  controls: ShaderUniformControl[];
  uniformValues: Record<string, ShaderUniformValue>;
  onCompile: (result: ShaderCompileResult) => void;
}

export interface UniformControlsProps {
  controls: ShaderUniformControl[];
  state: ShaderPlaygroundEditorState;
  actions: ShaderPlaygroundActions;
}

export interface PresetGalleryProps {
  actions: ShaderPlaygroundActions;
}

export interface ShareControlsProps {
  state: ShaderPlaygroundEditorState;
}

export interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  // Decimal places in the bubble and edge labels — shader parameters are mostly fractional, unlike the whole-number sliders elsewhere.
  decimals?: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}
