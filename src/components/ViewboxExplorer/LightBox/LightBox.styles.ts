import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";

/*
  A strip of film laid on the light box: sprocket holes punched along the top and bottom rebates,
  and a bright, faintly warm surface glowing up through the negative. The glow is mixed from the
  page background towards white so it stays the brightest thing in the room in every theme.
*/
export const FilmStrip = styled.div`
  --lightbox: color-mix(in srgb, var(--color-bg-default) 70%, white);

  position: relative;
  padding-block: 1.125rem;
  padding-inline: 0.5rem;
  background:
    radial-gradient(circle, var(--room) 0 0.2rem, transparent 0.22rem) 0.5rem 0.3rem / 1.25rem 0.6rem repeat-x,
    radial-gradient(circle, var(--room) 0 0.2rem, transparent 0.22rem) 0.5rem calc(100% - 0.3rem) / 1.25rem 0.6rem repeat-x,
    color-mix(in srgb, var(--color-fg-attention) 22%, color-mix(in srgb, var(--color-bg-muted) 40%, black));
  border-radius: 0.375rem;
  box-shadow: 0 0 1.75rem color-mix(in srgb, var(--lightbox) 30%, transparent);
`;

/*
  The light box surface itself — the drag surface for the easel. Opts back in to pointer events and
  clipping, both of which the site-wide svg reset turns off for decorative icons.
*/
export const LightBoxSvg = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: auto;
  max-block-size: 30rem;
  background: var(--lightbox);
  overflow: hidden;
  pointer-events: auto;
  touch-action: none;
  user-select: none;

  & text {
    font-family: ${MONO_FONT};
  }
`;

// Faint user-space grid lines; non-scaling so they stay hairlines however large the drawing's units are.
export const GridLine = styled.line`
  stroke: color-mix(in srgb, var(--color-fg-muted) 30%, transparent);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;

  &[data-axis="true"] {
    stroke: color-mix(in srgb, var(--color-fg-muted) 75%, transparent);
    stroke-width: 1.5;
  }
`;

// Grid and corner labels, haloed in the light-box colour so they stay legible over the drawing.
export const GridLabel = styled.text`
  fill: var(--color-fg-muted);
  paint-order: stroke;
  stroke: var(--lightbox);
  stroke-width: 3;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
`;

// The drawing's own authored viewBox, dashed — the frame the artist drew inside, before any easel moved.
export const AuthoredFrame = styled.rect`
  fill: none;
  stroke: var(--color-fg-muted);
  stroke-width: 1;
  stroke-dasharray: 4 3;
  vector-effect: non-scaling-stroke;
`;

// Everything that never reaches the print, dimmed as if under the easel's blades.
export const MaskShade = styled.path`
  fill: color-mix(in srgb, var(--room) 62%, transparent);
  fill-rule: evenodd;
  pointer-events: none;
`;

// Hatched band between the easel and what actually prints — bleed into the borders (meet) or cropped away (slice).
export const BandShade = styled.path`
  fill-rule: evenodd;
  pointer-events: none;
`;

// What the print really shows, traced on the negative in safelight red.
export const VisibleOutline = styled.rect`
  fill: none;
  stroke: var(--safelight);
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
`;

// The easel's open frame — the viewBox itself; dragging inside it moves the whole easel.
export const EaselBody = styled.rect`
  fill: transparent;
  stroke: var(--safelight);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
  cursor: move;
  outline: none;

  &:focus-visible,
  &[data-active="true"] {
    fill: color-mix(in srgb, var(--safelight) 10%, transparent);
    stroke-width: 3;
  }
`;

/*
  One masking blade — a wide invisible hit stroke under a thick visible bar. Focus and drag both
  thicken the bar so keyboard users can see which blade the arrow keys will move.
*/
export const Blade = styled.g`
  outline: none;

  & line[data-hit] {
    stroke: transparent;
    stroke-linecap: square;
  }

  & line[data-bar] {
    stroke: color-mix(in srgb, var(--safelight) 75%, var(--color-fg-default));
    stroke-width: 4;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
    pointer-events: none;
  }

  &:focus-visible line[data-bar],
  &[data-active="true"] line[data-bar] {
    stroke: var(--safelight);
    stroke-width: 7;
  }
`;

// A corner knob that resizes two blades at once — square, like the easel's own adjuster screws.
export const CornerKnob = styled.rect`
  fill: var(--lightbox);
  stroke: var(--safelight);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
  outline: none;

  &:focus-visible,
  &[data-active="true"] {
    fill: var(--safelight);
    stroke-width: 3;
  }
`;

// The easel's own coordinates, pinned to its corners just as the post's diagram labels (0,0) and (100,100).
export const CornerLabel = styled(GridLabel)`
  fill: var(--safelight-ink);
  font-weight: 700;
`;

// Caption row under the strip: the drawing's name and the live viewBox, in the room's monospace.
export const Caption = styled.p`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.25rem 1rem;
  margin: 0;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  color: var(--color-fg-muted);

  & strong {
    color: var(--safelight-ink);
  }
`;
