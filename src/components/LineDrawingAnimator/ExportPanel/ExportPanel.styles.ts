import { styled } from "@linaria/react";
import { DESK_FONT } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";

// The format tabs and download fitting on one line, wrapping on phones.
export const HeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
`;

// Index tabs along the top of a letter file.
export const TabRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-block-end: 0.125rem solid var(--ld-brass);
`;

// One index tab; the selected one is brass-faced and sits flush with the rule below, like the front card in a file.
export const Tab = styled.button`
  padding: 0.375rem 0.75rem;
  margin-block-end: -0.125rem;
  font-family: ${DESK_FONT};
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-fg-muted);
  background: color-mix(in srgb, var(--ld-brass) 10%, var(--color-bg-default));
  border: 0.0625rem solid color-mix(in srgb, var(--ld-brass) 45%, transparent);
  border-block-end: none;
  border-radius: 0.375rem 0.375rem 0 0;
  cursor: pointer;

  &[aria-selected="true"] {
    color: color-mix(in srgb, var(--ld-brass) 20%, black);
    background: linear-gradient(to bottom, var(--ld-brass-light), var(--ld-brass));
    border-color: var(--ld-brass-dark);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;

// Keeps long generated code from stretching the desk — the block scrolls inside its own frame.
export const CodeFrame = styled.div`
  max-block-size: 26rem;
  overflow: auto;
  border-radius: 0.25rem;
`;
