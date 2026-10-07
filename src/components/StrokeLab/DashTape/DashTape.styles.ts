import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/StrokeLab/StrokeLab.styles";

/*
  A vintage cloth measuring tape — cream oilcloth with red figures and a brass end tab — laid out
  to the pattern's scale, so the dashes on it are stitches you could measure. Its own cream/red
  palette keeps it distinct from the yellow tapes elsewhere on the site.
*/
export const TapeSvg = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: auto;
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem -0.125rem color-mix(in srgb, black 40%, transparent);
`;

// The editable lengths, as a wrapping grid of small tape-cut tickets.
export const SegmentList = styled.ol`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6.25rem, 1fr));
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// One ticket — dashes get a solid thread edge, gaps a dashed one, so the role reads before the label does.
export const SegmentTicket = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem 0.5rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--haber-card-edge);
  border-inline-start: 0.25rem solid var(--haber-thread);
  border-radius: 0.25rem;

  &[data-kind="gap"] {
    border-inline-start-style: dashed;
    border-inline-start-color: var(--haber-card-edge);
  }

  & input {
    inline-size: 100%;
  }
`;

// The ticket's heading row: role label on the left, remove cross on the right.
export const TicketHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-fg-muted);
`;

// A small cross to unpick one length.
export const RemoveButton = styled.button`
  display: inline-grid;
  place-items: center;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    color: var(--haber-fail);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
  }
`;

// The written-out value, in mono, as it'll appear in the stylesheet.
export const PatternReadout = styled.p`
  margin: 0;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  overflow-wrap: anywhere;
`;
