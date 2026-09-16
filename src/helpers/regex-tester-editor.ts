import type { RegexTesterEditorState, RegexTesterPresetMeta, RegexTesterShareableState } from "@/interfaces/regex-tester";

// Nothing in this tool's state is UI-only, so the shareable form is just the state itself — mirrors CronBuilder's own toShareableState.
export function toShareableState(state: RegexTesterEditorState): RegexTesterShareableState {
  return state;
}

// A named-group date pattern against a handful of real dates — immediately shows off capture groups (numbered AND named) and the explain panel, rather than an inert "*" -style placeholder.
export function createDefaultEditorState(): RegexTesterEditorState {
  return {
    pattern: "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})",
    flags: "g",
    testString: "Order dates: 2024-01-15, 2024-03-02, and 2023-12-31."
  };
}

// Replaces just the pattern, leaving flags/testString untouched.
export function setPattern(state: RegexTesterEditorState, pattern: string): RegexTesterEditorState {
  return { ...state, pattern };
}

// Replaces just the test string, leaving pattern/flags untouched.
export function setTestString(state: RegexTesterEditorState, testString: string): RegexTesterEditorState {
  return { ...state, testString };
}

// Keeps a stable canonical order (matching the order JS itself lists flags in) rather than appending toggled flags in click order, so the pattern controls and every export format always render flags identically regardless of toggle history.
const FLAG_ORDER = "dgimsuy";

// Adds or removes one flag letter, then re-sorts the whole flag string back into FLAG_ORDER.
export function toggleFlag(state: RegexTesterEditorState, flag: string): RegexTesterEditorState {
  const next = state.flags.includes(flag) ? state.flags.replace(flag, "") : state.flags + flag;
  const flags = FLAG_ORDER.split("").filter((f) => next.includes(f)).join("");
  return { ...state, flags };
}

// Overwrites pattern/flags/testString from a preset in one shot, so a preset always fully replaces the previous scenario rather than merging with it.
export function applyPreset(state: RegexTesterEditorState, preset: RegexTesterPresetMeta): RegexTesterEditorState {
  return { ...state, pattern: preset.pattern, flags: preset.flags, testString: preset.testString };
}

// Back to the tool's fresh starting scenario — used by the toolbar's Reset button.
export function resetTester(): RegexTesterEditorState {
  return createDefaultEditorState();
}
