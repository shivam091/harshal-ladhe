// Start/end stops of the post's own recurring gradient, so the diagram matches the code samples around it.
export const GRADIENT_START = "#ff6a00";
export const GRADIENT_END = "#ee0979";

// Same monospace stack the other mdx diagrams use for inline CSS.
export const CODE_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// Outer edge of the element in the box-model view — everything else is inset from here. Top gap leaves room for its label.
export const BOX = { x: 24, y: 32, width: 260, height: 190, radius: 14 };

// Exaggerated border and padding widths so each band is wide enough to label.
export const BORDER_WIDTH = 20;
export const PADDING_WIDTH = 26;

// Left edge of the explanatory notes to the right of the box-model view.
export const NOTE_X = 306;

// The notes' lines — the one fact every gradient-border technique in the post builds on.
export const NOTE_LINES = [
  { text: "The background is painted", bold: false },
  { text: "across the whole border box —", bold: false },
  { text: "even underneath the border.", bold: false },
  { text: "", bold: false },
  { text: "Make the border transparent", bold: true },
  { text: "and that band becomes a", bold: true },
  { text: "window onto the background.", bold: true }
];

// Size and vertical position of each panel in the layers view.
export const LAYER_PANEL = { width: 140, height: 100, y: 46, radius: 14 };

// Exaggerated border thickness for the layers view (the post uses 5px).
export const LAYER_BORDER = 12;

/*
  Left to right: the padding-box layer (listed first, so painted on top), the border-box gradient layer beneath it,
  and the composited result — the same order they're written in the post's `background:` shorthand.
*/
export const LAYER_STEPS = [
  { key: "padding", x: 20, title: "① padding-box layer", code: ["linear-gradient(#fff, #fff)", "padding-box"] },
  { key: "border", x: 200, title: "② border-box layer", code: ["linear-gradient(45deg, …)", "border-box"] },
  { key: "result", x: 380, title: "result", code: ["① covers ② everywhere", "except the border"] }
] as const;
