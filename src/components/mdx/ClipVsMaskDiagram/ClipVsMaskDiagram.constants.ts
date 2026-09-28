// Shared radius for all 3 circles, so the clip and mask results read as "the same shape, treated differently."
export const RADIUS = 55;

// The boundary content both results are built from — placed left so it reads as the input to both branches.
export const SOURCE = { cx: 130, cy: 170 };

/*
  The two results, stacked on the right so one input can fan out to both. `box` is the square of content
  being clipped/masked, drawn as a ghost so the removed area stays visible.
*/
export const RESULTS = {
  clip: { cx: 400, cy: 95, box: { x: 345, y: 40, size: 110 }, title: "as <clipPath>", note: "outline only, fill ignored" },
  mask: { cx: 400, cy: 250, box: { x: 345, y: 195, size: 110 }, title: "as <mask>", note: "brightness sets opacity" }
};

/*
  Mask-value legend. The swatch colours are literal mask data values (the thing a mask actually reads), so
  they stay the same keyword in both themes on purpose — a theme token here would change what they mean.
*/
export const LEGEND = [
  { x: 150, fill: "white", label: "white → fully shown" },
  { x: 290, fill: "gray", label: "gray → partly shown" },
  { x: 430, fill: "black", label: "black → hidden" }
];
