// Shared panel dimensions — two side-by-side "translucent card over a busy backdrop" scenes.
export const PANEL_W = 190;
export const PANEL_H = 150;

const MARGIN = 10;
const PANEL_GAP = 50;

export const PANEL_LEFT_X = MARGIN;
export const PANEL_RIGHT_X = MARGIN + PANEL_W + PANEL_GAP;
export const PANEL_Y = 42;

export const CANVAS_W = PANEL_RIGHT_X + PANEL_W + MARGIN;
export const CANVAS_H = PANEL_Y + PANEL_H + 52;

// Card geometry — identical in both panels, in each panel's own local <g> coordinates.
export const CARD_X = 35;
export const CARD_Y = 40;
export const CARD_W = 120;
export const CARD_H = 70;
export const CARD_RADIUS = 12;

// The three "backdrop" shapes scattered behind the card, in both panels' local coordinates — fixed,
// saturated colors (not theme tokens) so they read as scene "content," not diagram chrome, in both
// light and dark mode.
export const BACKDROP_SHAPES = {
  circle: { cx: 40, cy: 112, r: 24, color: "#f97316" },
  square: { x: 132, y: 18, size: 42, color: "#14b8a6" },
  triangle: { points: "92,14 124,58 60,58", color: "#a855f7" }
};

// Translucent "glass" tint drawn over the card — a fixed rgba (not a theme token) so the glass
// material reads the same regardless of light/dark mode, the same convention the interactive
// sandbox's own GLASS_BASE_COLOR uses.
export const CARD_TINT = "rgba(255, 255, 255, 0.55)";
export const CARD_BORDER = "rgba(255, 255, 255, 0.8)";
export const CARD_TEXT_COLOR = "#1e1b4b";

// Blur strength shared by both panels' <feGaussianBlur> — deliberately the *same* blur() value on
// both sides. The point of the diagram is that WHAT gets blurred differs between the two
// properties, not how strong the blur is.
export const BLUR_STD_DEVIATION = 3;
