/*
  Two identical card containers, differing only in the value of a --theme custom property set on
  each — the thing @container style(--theme: dark) actually queries. Exists to make one point
  concrete: a style query matches on a COMPUTED VALUE, not on size, so these two boxes can be the
  same dimensions and still resolve the query differently.
*/
export const PANELS = [
  { x: 30, theme: "light", themeValue: "--theme: light", matches: false },
  { x: 250, theme: "dark", themeValue: "--theme: dark", matches: true }
];

export const PANEL_W = 160;
export const PANEL_H = 130;
