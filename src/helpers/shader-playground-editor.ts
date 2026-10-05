import { shaderPlaygroundPresets } from "@/data/shader-playground-presets";
import type { ShaderPlaygroundEditorState, ShaderPlaygroundShareableState, ShaderPresetMeta, ShaderUniformValue } from "@/components/ShaderPlayground/ShaderPlayground.types";

// The editor state is already all-shareable; copied anyway so callers never hand the live undo-stack object to JSON.stringify or a URL encoder by reference.
export function toShareableState(state: ShaderPlaygroundEditorState): ShaderPlaygroundShareableState {
  return { source: state.source, uniformValues: { ...state.uniformValues } };
}

// Opens on the plasma preset rather than a blank mainImage — a moving, slider-annotated shader shows off what the tool does before anyone has typed a character.
export function createDefaultEditorState(): ShaderPlaygroundEditorState {
  const preset = shaderPlaygroundPresets.find((p) => p.slug === "plasma") ?? shaderPlaygroundPresets[0];
  return { source: preset.source, uniformValues: {} };
}

// Pure source swap — compiling and annotation parsing both happen downstream of the debounced copy, never here per keystroke.
export function setSource(state: ShaderPlaygroundEditorState, source: string): ShaderPlaygroundEditorState {
  return { ...state, source };
}

// Stores the moved value under its uniform name; resolveUniformValue clamps it against the live annotation at render time, so no bounds check is needed here.
export function setUniformValue(state: ShaderPlaygroundEditorState, name: string, value: ShaderUniformValue): ShaderPlaygroundEditorState {
  return { ...state, uniformValues: { ...state.uniformValues, [name]: value } };
}

// Clearing the saved values (rather than writing every default back in) lets each control fall back to whatever its annotation currently says.
export function resetUniforms(state: ShaderPlaygroundEditorState): ShaderPlaygroundEditorState {
  return { ...state, uniformValues: {} };
}

// A preset brings its own annotations, so leftover slider values from the previous shader are dropped rather than carried over onto unrelated uniforms that happen to share a name.
export function applyPreset(preset: ShaderPresetMeta): ShaderPlaygroundEditorState {
  return { source: preset.source, uniformValues: {} };
}

// Back to the opening plasma shader — the toolbar's escape hatch after an experiment has wandered too far.
export function resetPlayground(): ShaderPlaygroundEditorState {
  return createDefaultEditorState();
}
