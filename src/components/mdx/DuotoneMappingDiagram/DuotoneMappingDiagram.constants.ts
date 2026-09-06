// Two stacked horizontal bars: the top bar is a plain 0%-100% grayscale luminance ramp (as if from
// `filter: grayscale(1)`), and the bottom bar is that exact same ramp re-mapped through a two-color
// gradient running from a dark "shadow" color to a light "highlight" color — the core idea every
// duotone technique runs on, whether it's built with a CSS approximation or a real SVG filter.
export const BAR_W = 320;
export const BAR_H = 34;
export const BAR_X = 30;
export const GRAY_BAR_Y = 50;
export const DUOTONE_BAR_Y = 150;

export const CANVAS_W = BAR_X * 2 + BAR_W;
export const CANVAS_H = DUOTONE_BAR_Y + BAR_H + 46;

// Fixed duotone endpoint colors — a dark indigo shadow and a warm cream highlight, picked for clear
// contrast against both bars regardless of site theme. Fixed demo "content," not theme tokens.
export const SHADOW_COLOR = "#1e1b4b";
export const HIGHLIGHT_COLOR = "#fde68a";

// 5 evenly-spaced sample luminance stops connecting the two bars with dashed guide lines — enough to
// make the one-to-one mapping obvious without cluttering the diagram with every possible value.
export const SAMPLE_STOPS = [0, 25, 50, 75, 100];
