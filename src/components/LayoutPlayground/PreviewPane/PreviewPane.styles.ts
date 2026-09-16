import { styled } from "@linaria/react";

/*
  The tool's one deliberately fixed, non-token color pairing in the whole "Blueprint Grid" theme —
  a literal cyanotype blue surface for the live drawing itself, the same explicitly-commented
  exception every other goodie's own flagship surface already takes (FilterGenerator's dark
  viewfinder HUD, TextEffectsGenerator's dark spotlight stage): the drawing has to read as "a
  blueprint" specifically, which no light/dark/soft-dark theme swap should be allowed to tint away
  from actual cyanotype blue. Every OTHER surface in this tool (Board, Panel, etc.) stays on the
  theme's own bg/fg/border tokens.
*/
export const SHEET_BLUE = "#123a5e";
// Fine hairline grid ruling on the sheet — a soft, low-contrast white so it reads as printed ruling rather than a UI border.
const SHEET_GRID_LINE = "rgba(255, 255, 255, 0.08)";
// The sheet's own "ink" — every dimension line, tick, arrowhead, and boundary rule drawn against SHEET_BLUE uses this one fixed near-white rather than a theme token, for the same reason SHEET_BLUE itself is fixed: it has to read as cyanotype ink regardless of site theme.
export const SHEET_INK = "rgba(234, 244, 255, 0.92)";

// Scrolls horizontally rather than clipping when the sheet's own width (state.containerWidth) is wider than the panel — the drawing itself should never distort to fit.
export const PreviewScroller = styled.div`
  overflow-x: auto;
  border-radius: 0.25rem;
`;

// The cyanotype drafting sheet itself — see SHEET_BLUE's own comment for why this is the theme's one fixed-color surface. The graph-paper ruling is drawn at two scales (a fine 8px grid, a bolder 40px grid) the way real graph paper prints both a minor and a major ruling.
export const DraftingSheet = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem);
  background-color: ${SHEET_BLUE};
  background-image: repeating-linear-gradient(to right, rgba(255, 255, 255, 0.16) 0, rgba(255, 255, 255, 0.16) 0.0625rem, transparent 0.0625rem, transparent 2.5rem),
    repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.16) 0, rgba(255, 255, 255, 0.16) 0.0625rem, transparent 0.0625rem, transparent 2.5rem),
    repeating-linear-gradient(to right, ${SHEET_GRID_LINE} 0, ${SHEET_GRID_LINE} 0.0625rem, transparent 0.0625rem, transparent 0.5rem),
    repeating-linear-gradient(to bottom, ${SHEET_GRID_LINE} 0, ${SHEET_GRID_LINE} 0.0625rem, transparent 0.0625rem, transparent 0.5rem);
`;

// The real, live flex/grid container — its own dashed boundary (fixed sheet ink, not a theme token, since it's drawn directly on the fixed-blue sheet) reads as the drawing's own bounding rectangle. DimensionOverlay is a positioned child of this same element so its coordinate space lines up with the items measured inside it with zero extra offset math.
export const Container = styled.div`
  position: relative;
  flex: 0 0 auto;
  min-block-size: 4rem;
  padding: 0.75rem;
  border: 0.0625rem dashed ${SHEET_INK};
  border-radius: 0.1875rem;
`;

/*
  One drafted item — the flagship material-hatching treatment: diagonal ruling in the item's own
  color (via the --part-color custom property, set inline per item) over a faint tinted fill, so
  each box still reads as visually distinct the way the same item's color swatch does everywhere
  else in this tool (ItemList, PresetGallery), while the fill pattern itself reads as a technical
  drawing's cross-hatching rather than a flat UI color. `position: relative` hosts its own four
  CornerTick marks (children, not pseudo-elements — this element already spends its own ::before/
  ::after budget on nothing else, but four independent corners need four independent elements).
*/
export const Item = styled.div`
  --part-color: currentColor;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 2.5rem;
  min-block-size: 2.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--part-color);
  background-color: color-mix(in srgb, var(--part-color) 16%, transparent);
  background-image: repeating-linear-gradient(
    135deg,
    color-mix(in srgb, var(--part-color) 55%, transparent) 0,
    color-mix(in srgb, var(--part-color) 55%, transparent) 0.0625rem,
    transparent 0.0625rem,
    transparent 0.375rem
  );
  border: 0.09375rem solid var(--part-color);
  border-radius: 0.125rem;
  cursor: pointer;

  &[data-selected="true"] {
    outline: 0.125rem solid ${SHEET_INK};
    outline-offset: 0.125rem;
  }
`;

// One L-shaped corner tick on a drafted item, in the sheet's own fixed ink color (an annotation mark, not the item's own material) — same technique as FilterGenerator's own viewfinder Bracket: two border sides sized up to form an L, positioned per `data-corner`.
export const CornerTick = styled.span`
  position: absolute;
  inline-size: 0.4375rem;
  block-size: 0.4375rem;
  border-style: solid;
  border-color: ${SHEET_INK};
  border-width: 0;
  pointer-events: none;

  &[data-corner="tl"] {
    inset-block-start: -0.03125rem;
    inset-inline-start: -0.03125rem;
    border-block-start-width: 0.09375rem;
    border-inline-start-width: 0.09375rem;
  }

  &[data-corner="tr"] {
    inset-block-start: -0.03125rem;
    inset-inline-end: -0.03125rem;
    border-block-start-width: 0.09375rem;
    border-inline-end-width: 0.09375rem;
  }

  &[data-corner="bl"] {
    inset-block-end: -0.03125rem;
    inset-inline-start: -0.03125rem;
    border-block-end-width: 0.09375rem;
    border-inline-start-width: 0.09375rem;
  }

  &[data-corner="br"] {
    inset-block-end: -0.03125rem;
    inset-inline-end: -0.03125rem;
    border-block-end-width: 0.09375rem;
    border-inline-end-width: 0.09375rem;
  }
`;

// The item's own label text, lifted above the hatch fill and corner ticks.
export const ItemLabel = styled.span`
  position: relative;
  z-index: 1;
`;

/*
  SVG overlay drawing the measured gap between each visually-adjacent pair of items as a real
  engineering dimension line — see PreviewPane.tsx's own measurement effect for how `from`/`to`/
  `cross` are derived from actual getBoundingClientRect() reads. Absolutely positioned within
  Container and `pointer-events: none` so it never intercepts clicks meant for the items themselves,
  and (being absolutely positioned) is automatically excluded from the flex/grid layout algorithm —
  it can share Container's own box without ever being mistaken for a layout participant.
*/
export const DimensionOverlay = styled.svg`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  pointer-events: none;
  overflow: visible;
`;
