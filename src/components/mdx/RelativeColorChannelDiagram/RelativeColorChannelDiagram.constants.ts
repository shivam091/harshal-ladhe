// Source swatch: the running `--brand-color` example used throughout the post's relative-color-syntax section.
export const SOURCE_HEX = "#3b5fd6"; // ~ oklch(58% 0.19 262)
export const SOURCE_BOX = { x: 20, y: 76, size: 84 };

// Derived swatch: same C and H, L scaled down via `calc(l * 0.6)` — a darker shade of the exact same hue.
export const DERIVED_HEX = "#1c2f6d"; // ~ oklch(35% 0.19 262)
export const DERIVED_BOX = { x: 456, y: 76, size: 84 };

/*
  The 3 oklch() channels, in the order `from` re-emits them. `changes: true` on L is the one fact this
  diagram exists to teach: relative color syntax lets you reach in and adjust ONE channel — here, L via
  `calc(l * 0.6)` — while C and H pass through completely untouched, carried over verbatim from the source
  color into the derived one.
*/
export const CHANNELS = [
  { key: "l", label: "L — lightness", sourceValue: "0.58", derivedValue: "0.35", formula: "calc(l * 0.6)", changes: true },
  { key: "c", label: "C — chroma", sourceValue: "0.19", derivedValue: "0.19", formula: "c", changes: false },
  { key: "h", label: "H — hue", sourceValue: "262", derivedValue: "262", formula: "h", changes: false }
];

// Vertical layout of the 3 channel rows, centered between the source and derived swatches.
export const CHANNEL_ROW_X = 168;
export const CHANNEL_ROW_WIDTH = 224;
export const CHANNEL_ROW_Y = [70, 118, 166];
export const CHANNEL_ROW_HEIGHT = 40;
