import { styled } from "@linaria/react";
import { HAND_FONT, MONO_FONT, SERIF_FONT } from "@/components/IconSpriteBuilder/IconSpriteBuilder.styles";

/*
  The first-day cover: an airmail envelope whose striped border is mixed from the danger and accent
  tokens, with the outputs written on it as the "address". The envelope paper follows the theme so
  the code inside stays readable in either.
*/
export const Envelope = styled.section`
  position: relative;
  padding: 0.625rem;
  background: repeating-linear-gradient(
    -45deg,
    var(--color-fg-danger) 0 0.875rem,
    var(--color-bg-default) 0.875rem 1.25rem,
    var(--color-fg-accent) 1.25rem 2.125rem,
    var(--color-bg-default) 2.125rem 2.5rem
  );
  border-radius: 0.375rem;
  box-shadow: 0 0.375rem 1rem -0.375rem color-mix(in srgb, black 50%, transparent);
`;

// The envelope's face, inside the airmail stripes.
export const EnvelopeFace = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--album-page);
  border-radius: 0.125rem;
`;

// Heading row: the cachet title on the left, postmark and postage on the right, wrapping on phones.
export const CoverHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
`;

// The cachet — the printed design a first-day cover carries, here naming the issue.
export const Cachet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin-inline-end: auto;

  & > h3 {
    margin: 0;
    font-family: ${SERIF_FONT};
    font-size: 1.0625rem;
    font-variant: small-caps;
    letter-spacing: 0.06em;
    color: var(--color-fg-default);
  }
`;

// The cancellation: a double-ringed circular postmark in faded red ink, slightly askew — decorative only.
export const Postmark = styled.div`
  display: grid;
  place-items: center;
  inline-size: 4.75rem;
  block-size: 4.75rem;
  padding: 0.375rem;
  font-family: ${MONO_FONT};
  font-size: 0.5rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.08em;
  text-align: center;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--album-postmark) 75%, transparent);
  border: 0.125rem solid currentColor;
  border-radius: 50%;
  outline: 0.0625rem solid currentColor;
  outline-offset: -0.375rem;
  rotate: -12deg;
`;

/*
  The postage box doubles as the byte meter: separate files versus the single sprite, printed like
  the value on a stamp so the comparison is the first figure the eye lands on.
*/
export const Postage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.5rem 0.625rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-fg-default);
  background: var(--album-stamp-paper);
  border: 0.0625rem dashed color-mix(in srgb, var(--album-ink) 50%, transparent);

  & strong {
    font-family: ${HAND_FONT};
    font-size: 0.9375rem;
    font-weight: 400;
    color: var(--album-ink);
  }
`;

// The tab strip, written like address lines with a ruled underline beneath the active one.
export const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-block-end: 0.0625rem solid var(--album-rule);
`;

// One output tab; the selected one gets the collector's ink underline.
export const Tab = styled.button`
  padding: 0.375rem 0.75rem;
  font-family: ${SERIF_FONT};
  font-size: 0.875rem;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-block-end: 0.1875rem solid transparent;
  cursor: pointer;

  &[aria-selected="true"] {
    color: var(--color-fg-default);
    border-block-end-color: var(--album-ink);
  }

  &:hover {
    color: var(--color-fg-default);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-bg-accent-emphasis);
    outline-offset: -0.125rem;
  }
`;

// The tab panel — stacks its hint, actions and code slips.
export const TabPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-inline-size: 0;

  & > div {
    margin-block: 0;
  }
`;

// Hint and download share a line on wide screens, wrapping on phones.
export const PanelActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

// The handwritten caption above each icon's snippet.
export const SnippetCaption = styled.h4`
  margin: 0.5rem 0 0;
  font-family: ${HAND_FONT};
  font-size: 0.9375rem;
  font-weight: 400;
  color: var(--album-ink);
`;
