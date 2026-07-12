import { styled } from "@linaria/react";
export { ErrorIconCircle as IconCircle } from "@/app/error-page.styles";

// A div, not <main> — this boundary renders inside the layout's existing main landmark.
export const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-inline: 1.5rem;
  padding-block: 5rem;
`;

// h2 because the still-mounted PageHeading owns the page's h1.
export const Heading = styled.h2`
  font-size: 1.5rem;
  line-height: calc(2 / 1.5);
  font-weight: 700;
  color: var(--color-fg-danger);
`;

// Width capped to keep the explanation at a comfortable line length.
export const Message = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin-block-start: 0.75rem;
  max-inline-size: 28rem;
  color: var(--color-fg-muted);
`;

// Keeps retry and escape side by side as equal recovery choices.
export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-block-start: 1.5rem;
`;
