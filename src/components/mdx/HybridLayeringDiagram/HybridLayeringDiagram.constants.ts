// Shared width/height of each square "layer card" in the stack.
export const LAYER_SIZE = 130;

/*
  The two layers real chart/visualization libraries stack via absolute positioning, front-to-back in the order
  they're listed here (① renders on top of ②, same z-order convention as GradientLayeringDiagram): a sparse
  SVG/HTML overlay carrying the few interactive/accessible elements, on top of a dense Canvas layer redrawing
  everything else every frame.
*/
export const LAYERS = [
  { badge: "①", x: 55, y: 48, label: "SVG/HTML — sparse interactive overlay" },
  { badge: "②", x: 18, y: 84, label: "Canvas — dense visual layer, redrawn every frame" }
];

// Position/size of the composited "what you actually see" result panel.
export const RESULT = { x: 300, y: 62, size: 130 };

/*
  Fixed (not Math.random) scatter of small dots standing in for thousands of densely packed Canvas-drawn
  points — a golden-angle spiral gives an organic, non-grid look while staying perfectly deterministic between
  server and client renders.
*/
export const DENSE_DOTS = Array.from({ length: 34 }, (_, i) => {
  const angle = i * 2.399963;
  const radius = 3.4 * Math.sqrt(i + 1);
  const cx = LAYER_SIZE / 2 + radius * Math.cos(angle);
  const cy = LAYER_SIZE / 2 + radius * Math.sin(angle);
  return { cx, cy };
}).filter((point) => point.cx > 8 && point.cx < LAYER_SIZE - 8 && point.cy > 8 && point.cy < LAYER_SIZE - 8);

// The handful of real overlay elements sitting on top of the dense Canvas layer — a couple of hoverable points and one tooltip.
export const OVERLAY_POINTS = [
  { cx: 34, cy: 40 },
  { cx: 92, cy: 78 }
];

/*
  Tooltip callout anchored just above the second overlay point, showing the kind of thing only a real DOM
  node can render natively. Coordinates are local to a layer's own box; it's allowed to overflow the box's
  right edge slightly (real tooltips routinely render outside their anchor's own bounding box).
*/
export const OVERLAY_TOOLTIP = { x: 88, y: 48, width: 54, height: 20, label: "$42.10" };
