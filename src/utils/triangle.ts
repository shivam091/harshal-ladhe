import { toFixed } from "@/utils/number";
import type { TriangleDirection, TriangleEditorState, TriangleShape } from "@/interfaces/triangle";

/*
  The border-trick's own box model: a 0×0 box whose "side" borders are transparent and whose
  "point" border carries the fill color. `width`/`height` here always mean the shape's own rendered
  bounding box (not a border-width value directly) so a slider means the same thing regardless of
  direction or technique — half the width becomes the two transparent side borders for an up/down
  triangle (or half the height for left/right), and the full height (or width) becomes the one
  colored border.
*/
export function compileBorderTrickDeclarations(direction: TriangleDirection, width: number, height: number, color: string): Array<[string, string]> {
  const halfWidth = toFixed(width / 2, 1);
  const halfHeight = toFixed(height / 2, 1);
  const w = toFixed(width, 1);
  const h = toFixed(height, 1);

  const sides: Record<TriangleDirection, { top: string; right: string; bottom: string; left: string; colored: "top" | "right" | "bottom" | "left" }> = {
    up: { top: "0", right: `${halfWidth}px`, bottom: `${h}px`, left: `${halfWidth}px`, colored: "bottom" },
    down: { top: `${h}px`, right: `${halfWidth}px`, bottom: "0", left: `${halfWidth}px`, colored: "top" },
    left: { top: `${halfHeight}px`, right: `${w}px`, bottom: `${halfHeight}px`, left: "0", colored: "right" },
    right: { top: `${halfHeight}px`, right: "0", bottom: `${halfHeight}px`, left: `${w}px`, colored: "left" }
  };

  const s = sides[direction];
  const colorOf = (side: "top" | "right" | "bottom" | "left") => (side === s.colored ? color : "transparent");

  return [
    ["width", "0"],
    ["height", "0"],
    ["border-style", "solid"],
    ["border-width", `${s.top} ${s.right} ${s.bottom} ${s.left}`],
    ["border-color", `${colorOf("top")} ${colorOf("right")} ${colorOf("bottom")} ${colorOf("left")}`]
  ];
}

/*
  A plain triangle's clip-path is just its 3 corners; a chevron is a 6-point pointer/ribbon shape
  with a concave notch cut into the edge OPPOSITE the tip — `notch` (a percent of the shape's own
  length) controls how deep that cut goes. Both are expressed purely in percentages so the same
  polygon works at any width/height the bounding box is given.
*/
export function computeClipPathPolygon(shape: TriangleShape, direction: TriangleDirection, notch: number): string {
  if (shape === "triangle") {
    switch (direction) {
      case "up":
        return "polygon(50% 0%, 0% 100%, 100% 100%)";
      case "down":
        return "polygon(0% 0%, 100% 0%, 50% 100%)";
      case "left":
        return "polygon(100% 0%, 100% 100%, 0% 50%)";
      case "right":
        return "polygon(0% 0%, 0% 100%, 100% 50%)";
    }
  }

  const n = toFixed(notch, 1);
  const f = toFixed(100 - notch, 1);
  switch (direction) {
    case "right":
      return `polygon(0% 0%, ${f}% 0%, 100% 50%, ${f}% 100%, 0% 100%, ${n}% 50%)`;
    case "left":
      return `polygon(100% 0%, ${n}% 0%, 0% 50%, ${n}% 100%, 100% 100%, ${f}% 50%)`;
    case "down":
      return `polygon(0% 0%, 100% 0%, 100% ${f}%, 50% 100%, 0% ${f}%, 50% ${n}%)`;
    case "up":
      return `polygon(0% 100%, 100% 100%, 100% ${n}%, 50% 0%, 0% ${n}%, 50% ${f}%)`;
  }
}

// Single entry point every consumer (preview, export) reads from — decides which technique's declarations to compile so the two never have to be kept in sync by hand at each call site.
export function compileTriangleDeclarations(state: TriangleEditorState): Array<[string, string]> {
  if (state.technique === "border") return compileBorderTrickDeclarations(state.direction, state.width, state.height, state.color);

  return [
    ["width", `${toFixed(state.width, 1)}px`],
    ["height", `${toFixed(state.height, 1)}px`],
    ["background", state.color],
    ["clip-path", computeClipPathPolygon(state.shape, state.direction, state.notch)]
  ];
}
