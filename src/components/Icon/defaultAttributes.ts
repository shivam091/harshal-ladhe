/*
  Decorative by default (hidden from assistive tech, never focusable) because icons almost always sit
  beside visible text; an icon that must carry its own accessible name can still override both.
*/
export default {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: "none",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false
} as const;
