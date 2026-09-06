// One responsive width variant next/image can generate from a single source file: the label shown
// on its generation box, the exact srcset entry it produces, and whether it's the entry a 900px-wide,
// 1x-DPR viewport would actually end up picking once the sizes attribute is resolved.
export interface SrcsetVariant {
  id: string;
  widthLabel: string;
  srcsetEntry: string;
  selected: boolean;
}

export const CANVAS_W = 640;

// The one source file every variant below is generated from.
export const SOURCE_X = 260;
export const SOURCE_Y = 14;
export const SOURCE_W = 120;
export const SOURCE_H = 36;

// The row of generated width variants, fanned out from the source — every box renders identically,
// because next/image generates all of them equally; nothing about generation itself "pre-picks" one.
export const VARIANT_Y = 96;
export const VARIANT_W = 120;
export const VARIANT_H = 36;
export const VARIANT_GAP = 20;
export const VARIANT_START_X = 50;

/*
  A representative subset of Next.js's default `deviceSizes` breakpoints (the full default array is
  [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as of the versions this diagram was verified against —
  confirm the exact list in your installed version's next.config docs before relying on it). 828w is
  marked "selected" purely as a worked example: a ~900px-wide element on a 1x-DPR screen resolves,
  through the sizes attribute, to the smallest generated width that's still >= its rendered size.
*/
export const SRCSET_VARIANTS: SrcsetVariant[] = [
  { id: "w640", widthLabel: "640w", srcsetEntry: "/_next/image?url=%2Fsource.jpg&w=640&q=75 640w", selected: false },
  { id: "w828", widthLabel: "828w", srcsetEntry: "/_next/image?url=%2Fsource.jpg&w=828&q=75 828w", selected: true },
  { id: "w1200", widthLabel: "1200w", srcsetEntry: "/_next/image?url=%2Fsource.jpg&w=1200&q=75 1200w", selected: false },
  { id: "w1920", widthLabel: "1920w", srcsetEntry: "/_next/image?url=%2Fsource.jpg&w=1920&q=75 1920w", selected: false }
];

// The "Generated Markup" readout panel showing the actual srcset/sizes string these four variants
// produce together, with the worked-example entry highlighted.
export const READOUT_X = 40;
export const READOUT_Y = 164;
export const READOUT_W = 560;
export const READOUT_H = 118;
export const READOUT_LINE_START_Y = 198;
export const READOUT_LINE_GAP = 16;
export const READOUT_SIZES_Y = 268;

// The browser box and the short arrow showing it — not the server, not next/image itself — is what
// reaches into the srcset list and picks a match, based on the element's rendered size and the
// screen's device pixel ratio.
export const BROWSER_X = 245;
export const BROWSER_Y = 316;
export const BROWSER_W = 150;
export const BROWSER_H = 44;

export const CANVAS_H = BROWSER_Y + BROWSER_H + 16;
