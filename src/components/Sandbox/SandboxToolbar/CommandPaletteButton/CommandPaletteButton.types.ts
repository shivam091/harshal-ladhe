/*
  One entry in the command palette's action list — `keywords` widen fuzzy-match beyond `label`
  (e.g. matching "print margin" to the ruler toggle) without cluttering the visible label.
*/
export interface CommandPaletteAction {
  id: string;
  label: string;
  keywords?: string[];
  // Platform-variant key combos, shown as a hint alongside the label — omitted when the action has no bound shortcut.
  shortcut?: string[];
  run: () => void;
}
