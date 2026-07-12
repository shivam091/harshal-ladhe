/*
  Shared SVG defaults applied to every Icon — individual icons override these via svgProps in the registry.
  aria-hidden/focusable default every icon to decorative; callers that need an icon to carry its own
  accessible name (rare — none currently do) can override both via props, which are spread last in Icon.tsx.
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
