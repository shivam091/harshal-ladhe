import type { RegexTesterEditorState, RegexTesterPresetMeta, RegexTesterShareableState } from "@/interfaces/regex-tester";

export function toShareableState(state: RegexTesterEditorState): RegexTesterShareableState {
  return state;
}

export function createDefaultEditorState(): RegexTesterEditorState {
  return {
    pattern: "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})",
    flags: "g",
    testString: "Order dates: 2024-01-15, 2024-03-02, and 2023-12-31."
  };
}

export function setPattern(state: RegexTesterEditorState, pattern: string): RegexTesterEditorState {
  return { ...state, pattern };
}

export function setTestString(state: RegexTesterEditorState, testString: string): RegexTesterEditorState {
  return { ...state, testString };
}

// Keeps a stable canonical order (matching the order JS itself lists flags in) rather than appending toggled flags in click order, so the pattern controls and every export format always render flags identically regardless of toggle history.
const FLAG_ORDER = "dgimsuy";

export function toggleFlag(state: RegexTesterEditorState, flag: string): RegexTesterEditorState {
  const next = state.flags.includes(flag) ? state.flags.replace(flag, "") : state.flags + flag;
  const flags = FLAG_ORDER.split("").filter((f) => next.includes(f)).join("");
  return { ...state, flags };
}

export function applyPreset(state: RegexTesterEditorState, preset: RegexTesterPresetMeta): RegexTesterEditorState {
  return { ...state, pattern: preset.pattern, flags: preset.flags, testString: preset.testString };
}

export function resetTester(): RegexTesterEditorState {
  return createDefaultEditorState();
}
