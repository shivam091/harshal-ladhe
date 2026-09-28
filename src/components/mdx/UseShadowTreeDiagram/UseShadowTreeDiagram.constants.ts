// Shared corner radius for every box, so definition and instances read as the same kind of container.
export const BOX_RADIUS = 10;

/*
  The symbol definition on the left. Its two rows are the whole point of the diagram: one child leaves fill unset
  (so it can inherit), the other sets fill explicitly (so no use can ever override it).
*/
export const DEFINITION = {
  x: 20,
  y: 115,
  width: 220,
  height: 170,
  header: "<symbol id=\"icon\">",
  rows: [
    { y: 157, code: "<path d=\"…\" />", note: "no fill set → inherits" },
    { y: 217, code: "<circle fill=\"tomato\" />", note: "explicit fill → fixed" }
  ]
};

// Height of each two-line row inside the definition box.
export const DEFINITION_ROW_HEIGHT = 44;

/*
  The two use instances on the right, each with a different fill. Their shadow-tree rows spell out the resolved fill
  so the reader sees the same definition producing different results for the path but identical results for the circle.
*/
export const INSTANCES = [
  { y: 60, fill: "gold" },
  { y: 210, fill: "teal" }
];

// Outer bounds shared by both use boxes (x and size) — only y differs between instances.
export const INSTANCE_BOX = { x: 380, width: 260, height: 130 };

// The dashed shadow-tree box inside each use box, as offsets from that use box's top-left corner.
export const SHADOW_BOX = { dx: 16, dy: 36, width: 228, height: 84 };

// The two resolved-value pills inside each shadow tree, as offsets from the use box's top-left corner.
export const SHADOW_ROWS = { dx: 28, width: 204, height: 22, inheritedDy: 56, explicitDy: 86 };
