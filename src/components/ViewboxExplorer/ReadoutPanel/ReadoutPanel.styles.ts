import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";

// The enlarger timer's readout — a recessed dark window with safelight-red digits.
export const Display = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  margin: 0;
  padding: 0.625rem 0.75rem;
  background: color-mix(in srgb, black 55%, var(--room));
  border: 0.0625rem solid color-mix(in srgb, var(--safelight) 25%, black);
  border-radius: 0.375rem;
  box-shadow: inset 0 0.125rem 0.5rem color-mix(in srgb, black 50%, transparent);
`;

// One labelled value; the wide variant spans both columns for the matrix strings.
export const Reading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-inline-size: 0;

  &[data-wide="true"] {
    grid-column: 1 / -1;
  }

  & dt {
    font-family: ${MONO_FONT};
    font-size: 0.625rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--safelight) 45%, white);
    opacity: 0.75;
  }

  & dd {
    margin: 0;
    font-family: ${MONO_FONT};
    font-size: 0.875rem;
    font-weight: 700;
    color: color-mix(in srgb, var(--safelight) 55%, white);
    text-shadow: 0 0 0.375rem color-mix(in srgb, var(--safelight) 60%, transparent);
    overflow-wrap: anywhere;
  }
`;

// The plain-English account of the current combination, headed by its darkroom name.
export const Explanation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--color-fg-default);

  & h4 {
    margin: 0;
    font-size: 0.875rem;
    color: var(--safelight-ink);
  }

  & p {
    margin: 0;
  }
`;
