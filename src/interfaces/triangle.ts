// The two CSS techniques this tool compares — a classic 0×0 box whose borders form the shape, vs a rectangular box cut down with clip-path. Kept as a mode toggle (not two separate tools) specifically so switching between them at the same width/height/color shows what each technique can and can't do.
export type TriangleTechnique = "border" | "clip-path";

export type TriangleDirection = "up" | "down" | "left" | "right";

// "chevron" (a concave-backed pointer/ribbon shape) is only reachable in clip-path mode — the border trick has no way to cut a concave notch into a straight border edge, which is the whole point of offering both techniques rather than just one.
export type TriangleShape = "triangle" | "chevron";

export interface TriangleEditorState {
  technique: TriangleTechnique;
  direction: TriangleDirection;
  shape: TriangleShape;
  width: number;
  height: number;
  // How deep the chevron's concave back edge cuts toward the tip, as a percent of the shape's own length — meaningless for a plain triangle, only read when shape is "chevron".
  notch: number;
  color: string;
  pageColor: string;
}

// Nothing in this tool's state is UI-only (no selection, no scrubber position) — the shareable form is the whole state.
export type TriangleShareableState = TriangleEditorState;

export interface TrianglePresetMeta {
  slug: string;
  name: string;
  technique: TriangleTechnique;
  direction: TriangleDirection;
  shape: TriangleShape;
  width: number;
  height: number;
  notch: number;
  color: string;
  pageColor: string;
}

// Every mutation TriangleGenerator exposes to its children, bundled into one object — mirrors every other goodie's own *Actions style so subcomponents never touch the reducer/undo-stack directly.
export interface TriangleActions {
  setTechnique: (technique: TriangleTechnique) => void;
  setDirection: (direction: TriangleDirection) => void;
  setShape: (shape: TriangleShape) => void;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setNotch: (notch: number) => void;
  setColor: (color: string) => void;
  setPageColor: (color: string) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture or discrete edit, never per pointermove/input frame.
  commitDrag: () => void;
  applyPreset: (preset: TrianglePresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetShape: () => void;
}

export interface TechniqueControlsProps {
  state: TriangleEditorState;
  actions: TriangleActions;
}

export interface SizeControlsProps {
  state: TriangleEditorState;
  actions: TriangleActions;
}

export interface PreviewPaneProps {
  state: TriangleEditorState;
}

export interface ExportPanelProps {
  state: TriangleEditorState;
}

export interface PresetGalleryProps {
  actions: TriangleActions;
}

export interface ShareControlsProps {
  state: TriangleEditorState;
}

export interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}
