import type { ConversionDirection, JsonToTsEditorState, JsonToTsPresetMeta } from "@/interfaces/json-to-ts";

export function toShareableState(state: JsonToTsEditorState): JsonToTsEditorState {
  return state;
}

const DEFAULT_JSON = `{
  "id": 1,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "isActive": true,
  "roles": ["admin", "editor"],
  "address": {
    "city": "London",
    "postcode": "E1 6AN"
  }
}`;

const DEFAULT_TS = `interface Address {
  city: string;
  postcode: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  roles: string[];
  address: Address;
}`;

export function createDefaultEditorState(): JsonToTsEditorState {
  return { direction: "json-to-ts", jsonSource: DEFAULT_JSON, tsSource: DEFAULT_TS, rootName: "User" };
}

export function setDirection(state: JsonToTsEditorState, direction: ConversionDirection): JsonToTsEditorState {
  return { ...state, direction };
}

export function setJsonSource(state: JsonToTsEditorState, source: string): JsonToTsEditorState {
  return { ...state, jsonSource: source };
}

export function setTsSource(state: JsonToTsEditorState, source: string): JsonToTsEditorState {
  return { ...state, tsSource: source };
}

export function setRootName(state: JsonToTsEditorState, name: string): JsonToTsEditorState {
  return { ...state, rootName: name };
}

// Only overwrites the source field for the preset's OWN direction — a json-to-ts preset leaves whatever's currently in the ts-to-json draft untouched (and vice versa), so applying a preset never silently wipes an in-progress edit in the pane you're not looking at.
export function applyPreset(state: JsonToTsEditorState, preset: JsonToTsPresetMeta): JsonToTsEditorState {
  if (preset.direction === "json-to-ts") return { ...state, direction: preset.direction, jsonSource: preset.jsonSource, rootName: preset.rootName };
  return { ...state, direction: preset.direction, tsSource: preset.tsSource, rootName: preset.rootName };
}

export function resetConverter(): JsonToTsEditorState {
  return createDefaultEditorState();
}
