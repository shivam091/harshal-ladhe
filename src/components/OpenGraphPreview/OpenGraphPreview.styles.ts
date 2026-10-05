import { styled } from "@linaria/react";

// Cork's base tone — the theme's attention (amber) token pulled well towards the muted background, so it reads as tan in light mode and as a dim, oiled cork in dark mode without any raw hex.
const CORK_BASE = "color-mix(in srgb, var(--color-fg-attention) 30%, var(--color-bg-muted))";

// The darker granules pressed into the cork — the same amber driven towards black.
const CORK_GRAIN = "color-mix(in srgb, var(--color-fg-attention) 45%, black)";

/*
  "Corkboard" shell — a pinboard, distinct from every other goodie's shell (Console, Annotation
  Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench, Clay Studio, Blueprint Grid,
  Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light Table, Oscilloscope, Mixing Bench, Type
  Specimen, Drafting Compass, Chalkboard, Terminal Split). Share previews are things people pin up
  and compare, so the cards hang off push-pins on a cork surface while the form sits on ruled index
  cards. The texture is three layered gradients — two offset dot grids of grain at different sizes
  plus a soft vignette — so it never tiles visibly, and a wooden frame comes from an inset shadow
  rather than an extra element.
*/
export const Corkboard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background-color: ${CORK_BASE};
  background-image:
    radial-gradient(circle at 30% 40%, color-mix(in srgb, ${CORK_GRAIN} 35%, transparent) 0.0625rem, transparent 0.09375rem),
    radial-gradient(circle at 70% 80%, color-mix(in srgb, ${CORK_GRAIN} 25%, transparent) 0.09375rem, transparent 0.125rem),
    radial-gradient(circle at 50% 10%, color-mix(in srgb, var(--color-bg-default) 30%, transparent) 0.0625rem, transparent 0.09375rem),
    radial-gradient(ellipse at center, transparent 55%, color-mix(in srgb, black 18%, transparent) 100%);
  background-size: 0.4375rem 0.4375rem, 0.6875rem 0.6875rem, 0.5625rem 0.5625rem, 100% 100%;
  border: 0.5rem solid color-mix(in srgb, var(--color-fg-attention) 35%, var(--color-fg-default) 40%);
  border-radius: 0.5rem;
  box-shadow:
    inset 0 0 0 0.0625rem color-mix(in srgb, black 25%, transparent),
    inset 0 0.25rem 1rem color-mix(in srgb, black 22%, transparent);
`;

// Wraps on narrow screens so the undo/redo/reset tabs never push the board wider than the phone.
export const ToolbarRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

// Toolbar buttons as small paper tabs tacked to the board — a cream face with a drop shadow, so they read as objects on the cork rather than flat UI chrome.
export const ToolbarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-attention) 25%, var(--color-border-default));
  border-radius: 0.25rem;
  background: color-mix(in srgb, var(--color-fg-attention) 6%, var(--color-bg-default));
  color: var(--color-fg-muted);
  box-shadow: 0 0.125rem 0.25rem color-mix(in srgb, black 20%, transparent);
  cursor: pointer;
  transition: color 150ms ease, translate 150ms ease, box-shadow 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
    translate: 0 -0.0625rem;
    box-shadow: 0 0.25rem 0.5rem color-mix(in srgb, black 25%, transparent);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover:not(:disabled) {
      translate: none;
    }
  }
`;

// Form beside the board on wide screens; one stacked column below 60rem, where side-by-side cards would be unreadably narrow.
export const GeneratorGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;

  @media (min-width: 60rem) {
    grid-template-columns: 20rem minmax(0, 1fr);
    align-items: start;
  }
`;

// min-inline-size: 0 lets long URLs in the inputs shrink rather than blow out the grid track.
export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;
`;

// Same shrink guard as SidePanel, for the preview board and export code blocks.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;
`;

/*
  An index card: faint horizontal rules every 1.5rem and a single red margin line, the classic
  ruled-card look, drawn with two gradients so the card stays a single element. The extra top
  padding leaves room for the washi-tape title that overlaps its upper edge.
*/
export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 0.875rem 0.875rem;
  background-color: color-mix(in srgb, var(--color-fg-attention) 4%, var(--color-bg-default));
  background-image:
    linear-gradient(to right, transparent 1.75rem, color-mix(in srgb, var(--color-fg-danger) 35%, transparent) 1.75rem, color-mix(in srgb, var(--color-fg-danger) 35%, transparent) 1.8125rem, transparent 1.8125rem),
    repeating-linear-gradient(to bottom, transparent 0, transparent 1.4375rem, color-mix(in srgb, var(--color-fg-accent) 12%, transparent) 1.4375rem, color-mix(in srgb, var(--color-fg-accent) 12%, transparent) 1.5rem);
  border-radius: 0.125rem;
  box-shadow:
    0 0.0625rem 0.125rem color-mix(in srgb, black 18%, transparent),
    0 0.5rem 1rem -0.25rem color-mix(in srgb, black 28%, transparent);
`;

/*
  Washi tape for each card's title — translucent so the card's rules show through it, with
  zig-zag torn ends cut by clip-path and a slight tilt, positioned to straddle the card's top edge
  the way real tape holds a card to the board.
*/
export const PanelTitle = styled.h3`
  position: absolute;
  inset-block-start: -0.625rem;
  inset-inline-start: 0.75rem;
  margin: 0;
  padding: 0.25rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-fg-default);
  background:
    repeating-linear-gradient(45deg, transparent 0 0.375rem, color-mix(in srgb, var(--color-bg-default) 25%, transparent) 0.375rem 0.75rem),
    color-mix(in srgb, var(--color-fg-heading) 30%, transparent);
  rotate: -1.5deg;
  clip-path: polygon(0 10%, 4% 0, 8% 10%, 92% 10%, 96% 0, 100% 10%, 97% 50%, 100% 90%, 96% 100%, 92% 90%, 8% 90%, 4% 100%, 0 90%, 3% 50%);
`;

// Small explanatory copy inside a card — muted so it never competes with the controls themselves.
export const HelpText = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-fg-muted);
`;
