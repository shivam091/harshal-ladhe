import { styled } from "@linaria/react";

// Wraps the code block and its live preview into one visually connected unit.
export const SvgSnippetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-block: clamp(0.75rem, 1vw, 1rem);

  /* CodeBlock applies its own margin-block; suppressed here so the two pieces sit flush against each other. */
  > :first-child {
    margin-block: 0;
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }
`;

// Rendered SVG preview beneath the code block — centers the shape on a card flush against the code block above it.
export const SvgPreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 2vw, 2rem);
  background: var(--color-bg-default);
  border: 1px solid var(--color-border-muted);
  border-block-start: none;
  border-end-start-radius: 0.5rem;
  border-end-end-radius: 0.5rem;

  svg {
    max-inline-size: 100%;
    block-size: auto;
    /* Site-wide icon reset sets svg { pointer-events: none }; opt back in so embedded :hover styles can fire. */
    pointer-events: auto;
  }
`;
