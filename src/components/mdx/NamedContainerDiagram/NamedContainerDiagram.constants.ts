/*
  The 3-level nesting from the post's own named-container example — outermost first. `@container`
  with no name always resolves against the NEAREST ancestor with a container-type (the parent), so
  reaching the grandparent instead requires naming it explicitly and querying that name.
*/
export const LEVELS = [
  { label: ".grandparent", tag: "container-name: layout-grid", x: 20, y: 30, w: 400, h: 250 },
  { label: ".parent", tag: "container-name: component-wrapper", x: 60, y: 70, w: 320, h: 170 },
  { label: ".child", tag: null, x: 170, y: 190, w: 100, h: 36 }
];

// Anchor point (top edge, centered) used to route both callout arrows out of the child box.
export const CHILD_ANCHOR = { x: 220, y: 190 };
