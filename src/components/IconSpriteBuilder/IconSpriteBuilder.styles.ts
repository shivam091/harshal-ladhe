import { styled } from "@linaria/react";

// One monospace stack for markup, byte counts and viewBox "denominations" — shared so every printed figure in the album reads alike.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// A collector's pen hand for catalogue numbers — system handwriting faces only, so nothing extra is downloaded.
export const HAND_FONT = "'Segoe Print', 'Bradley Hand', 'Noteworthy', 'Chalkboard SE', 'Comic Neue', cursive";

// A bookish serif for engraved headings and the album's gilt title.
export const SERIF_FONT = "'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif";

/*
  "Philatelist's Stamp Album" shell — distinct from every other goodie's shell (Console, Circuit
  Board, Arcade Cabinet, Annotation Desk, Blueprint Grid, Ledger Sheet, Corkboard and the rest).
  An oxblood leather binding with a gilt-tooled border, opened onto cream quadrille album leaves;
  icons sit in perforated stamp mounts and the output arrives as a first-day cover. The binding
  stays dark in both themes, as real leather would, while the leaves follow the theme so every
  label stays legible. All colours are color-mixes of the theme's danger/attention/accent tokens.
*/
export const StampAlbum = styled.div`
  --album-leather: color-mix(in srgb, var(--color-fg-danger) 38%, color-mix(in srgb, var(--color-bg-default) 8%, black));
  --album-gilt: color-mix(in srgb, var(--color-fg-attention) 72%, white);
  --album-page: color-mix(in srgb, var(--color-fg-attention) 7%, var(--color-bg-default));
  --album-rule: color-mix(in srgb, var(--color-fg-muted) 13%, transparent);
  --album-ink: color-mix(in srgb, var(--color-fg-accent) 65%, var(--color-fg-default));
  --album-postmark: color-mix(in srgb, var(--color-fg-danger) 75%, var(--color-fg-default));
  --album-stamp-paper: color-mix(in srgb, var(--color-fg-attention) 4%, var(--color-bg-default));

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background:
    radial-gradient(ellipse at 30% 20%, color-mix(in srgb, white 7%, transparent), transparent 60%),
    repeating-radial-gradient(circle at 70% 80%, color-mix(in srgb, black 8%, transparent) 0 0.0625rem, transparent 0.0625rem 0.25rem),
    var(--album-leather);
  border-radius: 0.5rem 1rem 1rem 0.5rem;
  box-shadow:
    inset 0 0 0 0.5rem var(--album-leather),
    inset 0 0 0 0.5625rem color-mix(in srgb, var(--album-gilt) 70%, transparent),
    inset 0 0 0 0.75rem var(--album-leather),
    inset 0 0 0 0.78125rem color-mix(in srgb, var(--album-gilt) 45%, transparent),
    inset 1.25rem 0 1.5rem -1rem color-mix(in srgb, black 60%, transparent),
    0 0.75rem 1.5rem -0.75rem color-mix(in srgb, black 50%, transparent);
`;

// The spine label across the top: the gilt-stamped album title on one side, the toolbar on the other.
export const SpineLabel = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem 0;
`;

// Gilt-tooled lettering — decorative, so it's hidden from assistive tech at the call site.
export const GiltTitle = styled.span`
  font-family: ${SERIF_FONT};
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-variant: small-caps;
  letter-spacing: 0.12em;
  color: var(--album-gilt);
  text-shadow: 0 0.0625rem 0 color-mix(in srgb, black 60%, transparent);

  &::before,
  &::after {
    content: "❦";
    margin-inline: 0.5rem;
    font-size: 0.875em;
    opacity: 0.8;
  }
`;

// Holds the undo/redo/reset buttons together, like a row of brass corner protectors.
export const ToolbarRow = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

/*
  A gilt-edged leather button — shared by the toolbar and the cover's download so every control on
  the binding looks tooled from the same hide.
*/
export const GiltButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-inline-size: 2rem;
  block-size: 2rem;
  padding: 0 0.625rem;
  font-family: ${SERIF_FONT};
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--album-gilt);
  background: linear-gradient(to bottom, color-mix(in srgb, var(--album-leather) 80%, white), var(--album-leather));
  border: 0.0625rem solid color-mix(in srgb, var(--album-gilt) 60%, transparent);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: filter 150ms ease, translate 150ms ease;

  &:hover:not(:disabled) {
    filter: brightness(1.15);
  }

  &:active:not(:disabled) {
    translate: 0 0.0625rem;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--album-gilt);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Two leaves side by side on wide screens — acquisitions and settings on the left, the album and cover on the right — stacking on phones.
export const AlbumSpread = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 64rem) {
    grid-template-columns: 20rem minmax(0, 1fr);
    align-items: start;
  }
`;

// The left-hand leaf — acquisitions, options, sets and sharing in reading order.
export const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// The right-hand leaf — the album first, so the mounted icons are what you see first, then the cover.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

/*
  One album leaf: cream paper with the faint quadrille grid real stamp albums print to help line
  mounts up, and a soft shadow where it lifts off the binding.
*/
export const AlbumLeaf = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background:
    repeating-linear-gradient(0deg, var(--album-rule) 0 0.0625rem, transparent 0.0625rem 1rem),
    repeating-linear-gradient(90deg, var(--album-rule) 0 0.0625rem, transparent 0.0625rem 1rem),
    var(--album-page);
  border: 0.0625rem solid color-mix(in srgb, var(--album-gilt) 25%, var(--color-border-muted));
  border-radius: 0.25rem;
  box-shadow: 0 0.25rem 0.75rem -0.25rem color-mix(in srgb, black 45%, transparent);
`;

// Engraved small-caps heading; the plate number (data-plate) is written in before it in the collector's ink.
export const PanelTitle = styled.h3`
  margin: 0;
  font-family: ${SERIF_FONT};
  font-size: 0.9375rem;
  font-variant: small-caps;
  letter-spacing: 0.06em;
  color: var(--color-fg-default);

  &::before {
    content: attr(data-plate) "  ";
    font-family: ${HAND_FONT};
    font-variant: normal;
    letter-spacing: 0;
    color: var(--album-ink);
  }
`;

// Short helper copy under a heading — smaller and muted, matching the other goodies' inline hints.
export const HintText = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;

// A plain text field on the album paper — shared by the id inputs and the sprite path.
export const TextInput = styled.input`
  inline-size: 100%;
  min-inline-size: 0;
  padding: 0.375rem 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;

  &:focus-visible {
    outline: 0.125rem solid var(--color-bg-accent-emphasis);
    outline-offset: 0.0625rem;
  }
`;

/*
  A small paper-tab button for actions on the leaves themselves (add, clear, starter icons) — lighter
  than the gilt leather buttons, since these sit on the pages rather than the binding.
*/
export const PaperButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-block-size: 2rem;
  padding: 0.25rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
  background: var(--album-stamp-paper);
  border: 0.0625rem solid color-mix(in srgb, var(--album-ink) 35%, var(--color-border-default));
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--album-ink);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-bg-accent-emphasis);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
