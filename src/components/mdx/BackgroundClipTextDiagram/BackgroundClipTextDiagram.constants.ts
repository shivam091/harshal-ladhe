// Same monospace stack the other mdx diagrams use for inline CSS, so code captions read as code.
export const CODE_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// Start/end stops of the post's own recurring gradient, so the diagram matches the code samples around it.
export const GRADIENT_START = "#ff6a00";
export const GRADIENT_END = "#ee0979";

// Size of each step's panel — the "element box" the background is painted into.
export const PANEL = { width: 150, height: 120, y: 44 };

// Sample glyphs drawn in every panel — mixed case so both a cap and a round lowercase shape get clipped.
export const GLYPHS = "Aa";

// Glyph size and baseline inside a panel, tuned so the letters fill most of it without touching the edges.
export const GLYPH_SIZE = 80;
export const GLYPH_BASELINE = 90;

/*
  The three steps from the post's "What Each Line Does" list, left to right — each one adds exactly one
  declaration, so the reader can see what that single line changes.
*/
export const STEPS = [
  { x: 20, title: "① gradient background", code: ["background:", "linear-gradient(…)"] },
  { x: 195, title: "② background-clip: text", code: ["gradient kept only under", "glyphs — fill still covers it"] },
  { x: 370, title: "③ fill made transparent", code: ["-webkit-text-fill-color:", "transparent"] }
];
