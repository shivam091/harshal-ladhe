import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";

// Format tabs as negative-sleeve tabs along the top of the tray.
export const TabRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-block-end: 0.0625rem solid var(--color-border-muted);
`;

// One sleeve tab; the selected one takes the safelight underline.
export const Tab = styled.button`
  margin-block-end: -0.0625rem;
  padding: 0.5rem 0.75rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0;
  border-block-end: 0.125rem solid transparent;
  cursor: pointer;

  &[aria-selected="true"] {
    color: var(--safelight-ink);
    border-block-end-color: var(--safelight);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus, var(--color-fg-accent));
    outline-offset: -0.125rem;
  }
`;
