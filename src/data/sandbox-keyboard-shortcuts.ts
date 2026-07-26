import type { SandboxKeyboardShortcutGroup } from "@/interfaces/sandbox";

/*
  Curated reference for the Sandbox's KeyboardShortcutsButton modal. Covers every binding a
  reader would actually reach for — not every CodeMirror default (skips redundant/legacy
  combos like the Mac emacs-style keymap, plain arrow-key caret movement, etc).

  `keys` holds one chip-group per platform variant actually bound (not every entry has both —
  e.g. fold/unfold-all is the same physical combo on every OS, so it's a single-item array).
  Sourced from: @codemirror/commands' defaultKeymap/historyKeymap (bundled into
  SandpackCodeEditor itself), plus this codebase's own wiring of foldKeymap (folding.ts),
  searchKeymap (search.ts), completionKeymap (autocomplete.ts), and lintKeymap (lint.ts), plus
  this app's own sandbox-level shortcuts (use-sandbox-shortcuts.ts).
*/
export const sandboxKeyboardShortcuts: SandboxKeyboardShortcutGroup[] = [
  {
    title: "Sandbox",
    shortcuts: [
      { description: "Format code with Prettier", keys: ["Shift+Alt+F"] },
      { description: "Reset all files to original", keys: ["Ctrl+Alt+R", "⌘+Alt+R"] },
      { description: "Toggle file explorer", keys: ["Ctrl+Shift+E", "⌘+Shift+E"] },
      { description: "Toggle line numbers", keys: ["Ctrl+Alt+N", "⌘+Alt+N"] },
      { description: "Clear console", keys: ["Ctrl+Alt+K", "⌘+Alt+K"] },
      { description: "Re-run preview", keys: ["Ctrl+Alt+P", "⌘+Alt+P"] },
      { description: "Next tab", keys: ["Ctrl+Alt+.", "⌘+Alt+."] },
      { description: "Previous tab", keys: ["Ctrl+Alt+,", "⌘+Alt+,"] },
      { description: "Jump to tab", keys: ["Ctrl+Alt+1-9", "⌘+Alt+1-9"] },
      { description: "Close active tab", keys: ["Ctrl+Alt+W", "⌘+Alt+W"], note: "only when tabs are closable" },
      { description: "Switch output / console tab", keys: ["Ctrl+Alt+V", "⌘+Alt+V"] },
      { description: "Cycle split layout", keys: ["Ctrl+Alt+S", "⌘+Alt+S"], note: "auto, stacked, side-by-side" },
      { description: "Copy active file", keys: ["Ctrl+Alt+C", "⌘+Alt+C"] },
      { description: "Open in CodeSandbox", keys: ["Ctrl+Alt+O", "⌘+Alt+O"] }
    ]
  },
  {
    title: "Code folding",
    shortcuts: [
      { description: "Fold all", keys: ["Ctrl+Alt+["] },
      { description: "Unfold all", keys: ["Ctrl+Alt+]"] },
      { description: "Fold at cursor", keys: ["Ctrl+Shift+[", "⌘+Alt+["] },
      { description: "Unfold at cursor", keys: ["Ctrl+Shift+]", "⌘+Alt+]"] }
    ]
  },
  {
    title: "Search",
    shortcuts: [
      { description: "Find in file", keys: ["Ctrl+F", "⌘+F"] },
      { description: "Find next match", keys: ["F3", "Ctrl+G"] },
      { description: "Find previous match", keys: ["Shift+F3", "Ctrl+Shift+G"] },
      { description: "Go to line", keys: ["Ctrl+Alt+G", "⌘+Alt+G"] },
      { description: "Close search panel", keys: ["Esc"] }
    ]
  },
  {
    title: "Multi-cursor & selection",
    shortcuts: [
      {
        description: "Add cursor above / below",
        keys: ["Ctrl+Alt+↑/↓", "⌘+Alt+↑/↓", "Ctrl+Shift+↑/↓", "⌘+Shift+↑/↓"],
        note: "Ctrl+Alt+↑/↓ may be claimed by your OS (e.g. GNOME workspace switching)"
      },
      { description: "Add cursor at click", keys: ["Ctrl+Click", "⌘+Click"] },
      { description: "Column (box) selection", keys: ["Alt+Drag"] },
      { description: "Select next occurrence", keys: ["Ctrl+D", "⌘+D"] },
      { description: "Select all occurrences", keys: ["Ctrl+Shift+L", "⌘+Shift+L"] },
      { description: "Select all", keys: ["Ctrl+A", "⌘+A"] }
    ]
  },
  {
    title: "Editing",
    shortcuts: [
      { description: "Undo", keys: ["Ctrl+Z", "⌘+Z"] },
      { description: "Redo", keys: ["Ctrl+Shift+Z", "⌘+Shift+Z"], note: "or Ctrl+Y" },
      { description: "Toggle line comment", keys: ["Ctrl+/", "⌘+/"] },
      { description: "Delete line", keys: ["Ctrl+Shift+K", "⌘+Shift+K"] },
      { description: "Move line up / down", keys: ["Alt+↑/↓"] },
      { description: "Copy line up / down", keys: ["Shift+Alt+↑/↓"] },
      { description: "Indent / outdent selection", keys: ["Tab", "Shift+Tab"] }
    ]
  },
  {
    title: "Autocomplete",
    shortcuts: [
      { description: "Trigger suggestions", keys: ["Ctrl+Space"] },
      { description: "Accept suggestion", keys: ["Enter"] },
      { description: "Dismiss suggestions", keys: ["Esc"] }
    ]
  },
  {
    title: "Diagnostics",
    shortcuts: [
      { description: "Open problems panel", keys: ["Ctrl+Shift+M", "⌘+Shift+M"] },
      { description: "Jump to next problem", keys: ["F8"] }
    ]
  }
];
