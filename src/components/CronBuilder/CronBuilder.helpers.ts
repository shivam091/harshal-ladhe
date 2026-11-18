import type { CronEditorState, CronFieldKey, CronPresetMeta } from "@/components/CronBuilder/CronBuilder.types";

// "Weekdays at 9am" — a friendlier, more immediately-readable starting point than the all-"*" default every field would otherwise share.
export function createDefaultEditorState(): CronEditorState {
  return { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" };
}

export function setField(state: CronEditorState, key: CronFieldKey, raw: string): CronEditorState {
  return { ...state, [key]: raw };
}

export function applyPreset(state: CronEditorState, preset: CronPresetMeta): CronEditorState {
  return { ...state, ...preset.fields };
}

