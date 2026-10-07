import { styled } from "@linaria/react";
import { HAND_FONT, MONO_FONT } from "@/components/IconSpriteBuilder/IconSpriteBuilder.styles";

/*
  One album slot. Each slot takes a frame colour from the theme's accent/danger/success/attention
  tokens in turn, so a page of mounts reads like a printed set in several values rather than one
  repeated stamp.
*/
export const MountSlot = styled.li`
  --stamp-frame: var(--color-fg-accent);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  min-inline-size: 0;

  &:nth-child(4n + 2) {
    --stamp-frame: var(--color-fg-danger);
  }

  &:nth-child(4n + 3) {
    --stamp-frame: var(--color-fg-success);
  }

  &:nth-child(4n + 4) {
    --stamp-frame: var(--color-fg-attention);
  }
`;

// The clear hinge-less mount strip behind the stamp, slightly larger than it, the way a collector protects an unhinged stamp.
export const ClearMount = styled.div`
  padding: 0.375rem;
  background: color-mix(in srgb, var(--color-bg-default) 35%, transparent);
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-muted) 22%, transparent);
  border-radius: 0.125rem;
  box-shadow: inset 0 0.5rem 0.75rem -0.5rem color-mix(in srgb, white 30%, transparent);
  filter: drop-shadow(0 0.125rem 0.125rem color-mix(in srgb, black 25%, transparent));
`;

/*
  The stamp itself, with perforated edges cut by a mask: a solid inner rectangle unioned with a
  grid of round holes centred exactly on the edges. "round" tiling stretches the hole spacing so a
  whole number of perforations fits each side, keeping every corner symmetrical.
*/
export const PerforatedStamp = styled.div`
  --perf-r: 0.25rem;
  --perf-step: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: calc(var(--perf-r) * 2.5);
  background: var(--album-stamp-paper);
  -webkit-mask:
    radial-gradient(var(--perf-r) at var(--perf-r) var(--perf-r), transparent 97%, black) calc(-1 * var(--perf-r)) calc(-1 * var(--perf-r)) / var(--perf-step) var(--perf-step) round,
    linear-gradient(black 0 0) center / calc(100% - 2 * var(--perf-r)) calc(100% - 2 * var(--perf-r)) no-repeat;
  mask:
    radial-gradient(var(--perf-r) at var(--perf-r) var(--perf-r), transparent 97%, black) calc(-1 * var(--perf-r)) calc(-1 * var(--perf-r)) / var(--perf-step) var(--perf-step) round,
    linear-gradient(black 0 0) center / calc(100% - 2 * var(--perf-r)) calc(100% - 2 * var(--perf-r)) no-repeat;

  &[data-damaged="true"] {
    background: color-mix(in srgb, var(--color-fg-danger) 10%, var(--album-stamp-paper));
  }
`;

// The printed vignette: a coloured frame line round the artwork, with a minimum size so tiny previews still look like stamps.
export const Vignette = styled.div`
  display: grid;
  place-items: center;
  min-inline-size: 4.5rem;
  min-block-size: 4.5rem;
  padding: 0.5rem;
  border: 0.125rem solid var(--stamp-frame);
  outline: 0.0625rem solid color-mix(in srgb, var(--stamp-frame) 45%, transparent);
  outline-offset: -0.375rem;
  background: color-mix(in srgb, var(--stamp-frame) 6%, transparent);

  & svg {
    display: block;
    max-inline-size: 9rem;
    block-size: auto;
  }
`;

// The viewBox printed along the stamp's foot like a denomination — tiny monospace capitals.
export const Denomination = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.5625rem;
  letter-spacing: 0.06em;
  color: var(--stamp-frame);
`;

// Shown in place of artwork when an icon fails to parse — the stamp is "damaged" rather than silently missing.
export const DamageText = styled.span`
  max-inline-size: 8.5rem;
  font-size: 0.6875rem;
  text-align: center;
  color: var(--color-fg-danger);
`;

// The handwritten catalogue number under the mount, in the collector's ink.
export const CatalogueNumber = styled.span`
  font-family: ${HAND_FONT};
  font-size: 1rem;
  line-height: 1.2;
  color: var(--album-ink);
  rotate: -1.5deg;
  overflow-wrap: anywhere;
  text-align: center;
`;

// The editable id field — narrow and handwritten-looking, so it reads as part of the catalogue entry.
export const IdInput = styled.input`
  inline-size: 100%;
  max-inline-size: 10rem;
  padding: 0.125rem 0.375rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  text-align: center;
  color: var(--color-fg-default);
  background: transparent;
  border: none;
  border-block-end: 0.0625rem dashed color-mix(in srgb, var(--album-ink) 50%, transparent);

  &:focus-visible {
    outline: 0.125rem solid var(--color-bg-accent-emphasis);
    outline-offset: 0.125rem;
    border-block-end-style: solid;
  }
`;

// Where the icon came from, in small muted type beneath the id.
export const Provenance = styled.span`
  max-inline-size: 10rem;
  font-size: 0.6875rem;
  text-align: center;
  color: var(--color-fg-muted);
  overflow-wrap: anywhere;
`;

// The expert's notes on the mount — warnings in the danger colour so a sanitised paste stands out.
export const NoteList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  max-inline-size: 10.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.6875rem;
  color: var(--color-fg-muted);

  & > li[data-tone="warning"] {
    color: var(--color-fg-danger);
  }
`;

// Earlier / later / remove — small round "tweezers" buttons in a row under each mount.
export const MountControls = styled.div`
  display: flex;
  gap: 0.25rem;
`;

// A compact icon button on the album paper, sized for comfortable touch targets despite the small glyph.
export const TweezerButton = styled.button`
  display: inline-grid;
  place-items: center;
  inline-size: 2rem;
  block-size: 2rem;
  color: var(--album-ink);
  background: var(--album-stamp-paper);
  border: 0.0625rem solid color-mix(in srgb, var(--album-ink) 30%, var(--color-border-default));
  border-radius: 50%;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--album-ink);
  }

  &[data-variant="remove"]:hover:not(:disabled) {
    color: var(--color-fg-danger);
    border-color: var(--color-fg-danger);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-bg-accent-emphasis);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;
