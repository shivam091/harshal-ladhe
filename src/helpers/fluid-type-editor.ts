import { clamp } from "@/utils/number";
import { generateId } from "@/utils/random";
import type { FluidTypeEditorState, FluidTypePresetMeta, FluidTypeShareableState, FluidTypeStep } from "@/interfaces/fluid-type";

const VIEWPORT_FLOOR = 200;
const VIEWPORT_CEILING = 2560;
// Minimum gap enforced between min/max viewport — keeps the slope calculation's denominator well away from zero.
const VIEWPORT_GAP = 40;
const STEP_SIZE_FLOOR = 8;
const STEP_SIZE_CEILING = 300;

function defaultStep(name: string, minSize: number, maxSize: number): FluidTypeStep {
  return { id: generateId(), name, minSize, maxSize };
}

export function toShareableState(state: FluidTypeEditorState): FluidTypeShareableState {
  const { minViewport, maxViewport, rootFontSize, steps, pageColor } = state;
  return { minViewport, maxViewport, rootFontSize, steps, pageColor };
}

export function createDefaultEditorState(): FluidTypeEditorState {
  const steps = [defaultStep("H1", 32, 56), defaultStep("H2", 24, 36), defaultStep("Body", 16, 18)];
  return {
    minViewport: 320,
    maxViewport: 1280,
    rootFontSize: 16,
    steps,
    selectedStepId: steps[0].id,
    previewWidth: 320,
    pageColor: "#f8fafc"
  };
}

// Keeps previewWidth inside the (possibly just-narrowed) [minViewport, maxViewport] range so the scrubber never points at a width the scale no longer spans.
function reclampPreviewWidth(state: FluidTypeEditorState, minViewport: number, maxViewport: number): number {
  return clamp(state.previewWidth, minViewport, maxViewport);
}

export function setMinViewport(state: FluidTypeEditorState, px: number): FluidTypeEditorState {
  const minViewport = clamp(px, VIEWPORT_FLOOR, state.maxViewport - VIEWPORT_GAP);
  return { ...state, minViewport, previewWidth: reclampPreviewWidth(state, minViewport, state.maxViewport) };
}

export function setMaxViewport(state: FluidTypeEditorState, px: number): FluidTypeEditorState {
  const maxViewport = clamp(px, state.minViewport + VIEWPORT_GAP, VIEWPORT_CEILING);
  return { ...state, maxViewport, previewWidth: reclampPreviewWidth(state, state.minViewport, maxViewport) };
}

export function setRootFontSize(state: FluidTypeEditorState, px: number): FluidTypeEditorState {
  return { ...state, rootFontSize: clamp(px, 10, 24) };
}

export function addStep(state: FluidTypeEditorState): FluidTypeEditorState {
  const step = defaultStep("New step", 16, 24);
  return { ...state, steps: [...state.steps, step], selectedStepId: step.id };
}

export function duplicateStep(state: FluidTypeEditorState, id: string): FluidTypeEditorState {
  const index = state.steps.findIndex((step) => step.id === id);
  if (index === -1) return state;
  const copy: FluidTypeStep = { ...state.steps[index], id: generateId() };
  const steps = [...state.steps];
  steps.splice(index + 1, 0, copy);
  return { ...state, steps, selectedStepId: copy.id };
}

// Floors at 1 step — a scale with zero steps has nothing left for the preview or export panel to show.
export function removeStep(state: FluidTypeEditorState, id: string): FluidTypeEditorState {
  if (state.steps.length <= 1) return state;
  const steps = state.steps.filter((step) => step.id !== id);
  const selectedStepId = state.selectedStepId === id ? (steps[0]?.id ?? null) : state.selectedStepId;
  return { ...state, steps, selectedStepId };
}

export function selectStep(state: FluidTypeEditorState, id: string | null): FluidTypeEditorState {
  return { ...state, selectedStepId: id };
}

export function updateStep(state: FluidTypeEditorState, id: string, patch: Partial<Omit<FluidTypeStep, "id">>): FluidTypeEditorState {
  const bounded: Partial<Omit<FluidTypeStep, "id">> = { ...patch };
  if (bounded.minSize !== undefined) bounded.minSize = clamp(bounded.minSize, STEP_SIZE_FLOOR, STEP_SIZE_CEILING);
  if (bounded.maxSize !== undefined) bounded.maxSize = clamp(bounded.maxSize, STEP_SIZE_FLOOR, STEP_SIZE_CEILING);
  return { ...state, steps: state.steps.map((step) => (step.id === id ? { ...step, ...bounded } : step)) };
}

export function setPreviewWidth(state: FluidTypeEditorState, px: number): FluidTypeEditorState {
  return { ...state, previewWidth: clamp(px, state.minViewport, state.maxViewport) };
}

export function setPageColor(state: FluidTypeEditorState, color: string): FluidTypeEditorState {
  return { ...state, pageColor: color };
}

export function applyPreset(state: FluidTypeEditorState, preset: FluidTypePresetMeta): FluidTypeEditorState {
  const steps = preset.steps.map((step) => ({ ...step, id: generateId() }));
  return {
    ...state,
    minViewport: preset.minViewport,
    maxViewport: preset.maxViewport,
    rootFontSize: preset.rootFontSize,
    steps,
    pageColor: preset.pageColor,
    selectedStepId: steps[0]?.id ?? null,
    previewWidth: preset.minViewport
  };
}

export function resetCalculator(): FluidTypeEditorState {
  return createDefaultEditorState();
}
