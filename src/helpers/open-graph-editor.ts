import { openGraphPresets } from "@/data/open-graph-presets";
import type { OpenGraphEditorState, OpenGraphFields, OpenGraphPresetMeta, OpenGraphShareableState } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Every field blank — the base that partial or older saved states are merged over, so a missing key can never surface as `undefined` in a controlled input.
export const EMPTY_FIELDS: OpenGraphFields = {
  title: "",
  description: "",
  url: "",
  siteName: "",
  imageUrl: "",
  imageAlt: "",
  twitterCard: "",
  ogType: "",
  themeColor: "",
  faviconUrl: "",
  author: "",
  twitterHandle: ""
};

/*
  Fills any missing keys and drops any blob:/data: image URL — those can only come from a local
  upload leaking in by hand, and would either be dead (blob:) or bloat the link (data:) once shared.
*/
export function normaliseFields(fields: Partial<OpenGraphFields>): OpenGraphFields {
  const merged = { ...EMPTY_FIELDS, ...fields };
  const imageUrl = /^(blob|data):/i.test(merged.imageUrl.trim()) ? "" : merged.imageUrl;
  return { ...merged, imageUrl };
}

// The state is already nothing but shareable fields (the local image lives outside it) — normalised on the way out so a stray blob: URL can't sneak into a permalink.
export function toShareableState(state: OpenGraphEditorState): OpenGraphShareableState {
  return normaliseFields(state);
}

// Starts on the blog-post preset rather than a blank form, so the first thing anyone sees is a full board of populated cards.
export function createDefaultEditorState(): OpenGraphEditorState {
  return { ...openGraphPresets[0].fields };
}

// One generic setter instead of twelve near-identical ones — the field key is type-checked against its value.
export function setField<K extends keyof OpenGraphFields>(state: OpenGraphEditorState, key: K, value: OpenGraphFields[K]): OpenGraphEditorState {
  return { ...state, [key]: value };
}

// An import replaces the whole form rather than merging, so the previews show exactly what the pasted <head> says — including what it's missing.
export function importFields(_state: OpenGraphEditorState, fields: OpenGraphFields): OpenGraphEditorState {
  return normaliseFields(fields);
}

// Presets are complete field sets, so applying one is a straight replacement.
export function applyPreset(_state: OpenGraphEditorState, preset: OpenGraphPresetMeta): OpenGraphEditorState {
  return { ...preset.fields };
}

// Back to the same starting point a first visit gets.
export function resetPreview(): OpenGraphEditorState {
  return createDefaultEditorState();
}
