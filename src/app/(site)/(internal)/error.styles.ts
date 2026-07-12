import { styled } from "@linaria/react";
export { ErrorIconCircle as IconCircle } from "@/app/error-page.styles";

// Centred flex column for the route-error (network/500) error state display.
export const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-inline: var(--space-lg);
  padding-block: 5rem;
`;

// Route-error heading — bold, danger-coloured h2.
export const Heading = styled.h2`
  font-size: var(--font-size-xl);
  line-height: calc(2 / 1.5);
  font-weight: var(--font-weight-bold);
  color: var(--color-fg-danger);
`;

// Route-error body paragraph — muted colour, constrained to a readable max-width.
export const Message = styled.p`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  margin-block-start: var(--space-md);
  max-inline-size: 28rem;
  color: var(--color-fg-muted);
`;

// Action button row for the route-error page.
export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-block-start: var(--space-lg);
`;
