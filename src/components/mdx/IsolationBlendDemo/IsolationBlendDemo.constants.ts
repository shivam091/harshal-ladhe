import type { SvgDemoControl } from "@/data/svg-demos";

/*
  Fixed brand-free colours rather than theme tokens: blend results depend on the exact input colours, and the demo
  has to look the same in light and dark mode for the explanation to hold.
*/
export const CIRCLE_COLORS = ["#ff4d6d", "#3ec1d3", "#ffd23f"];

// Starts unisolated, so readers first see the circles picking up the stripes and then fix it themselves.
export const CONTROLS: SvgDemoControl[] = [
  { id: "groupIsolation", label: "Group isolation", type: "select", options: ["auto", "isolate"], defaultValue: "auto" },
  { id: "blendMode", label: "Circles' mix-blend-mode", type: "select", options: ["multiply", "screen", "difference"], defaultValue: "multiply" }
];
