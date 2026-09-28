// Side length of every swatch/result cell; big enough that partial opacity is easy to compare across rows.
export const CELL = 60;

/*
  The 5 mask-content samples, left to right. Colours are literal mask data values (what a mask reads), so they
  are keywords rather than theme tokens on purpose. `luminance` / `alpha` are the resulting visibility under each
  mask-type — luminance mode multiplies brightness by alpha, alpha mode ignores colour entirely. Mid-gray's exact
  luminance depends on the colour space the browser computes it in, hence a visual stand-in labelled "partial".
*/
export const SAMPLES = [
  { cx: 210, fill: "white", fillOpacity: 1, caption: "white", luminance: 1, luminanceLabel: "100%", alpha: 1, alphaLabel: "100%" },
  { cx: 300, fill: "gray", fillOpacity: 1, caption: "gray", luminance: 0.4, luminanceLabel: "partial", alpha: 1, alphaLabel: "100%" },
  { cx: 390, fill: "black", fillOpacity: 1, caption: "black", luminance: 0, luminanceLabel: "0%", alpha: 1, alphaLabel: "100%" },
  { cx: 480, fill: "white", fillOpacity: 0.5, caption: "white, 50% alpha", luminance: 0.5, luminanceLabel: "50%", alpha: 0.5, alphaLabel: "50%" },
  { cx: 570, fill: "none", fillOpacity: 0, caption: "transparent", luminance: 0, luminanceLabel: "0%", alpha: 0, alphaLabel: "0%" }
];

// Row tops for the mask content and its two results; 100 units apart to leave a caption line under each row.
export const ROW_Y = { content: 40, luminance: 140, alpha: 240 };
