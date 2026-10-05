import { styled } from "@linaria/react";

// Facebook's link card: square-cornered image over a grey text band, all inside one hairline border.
export const FacebookCard = styled.div`
  overflow: hidden;
  border: 0.0625rem solid var(--surface-border);
`;

// The grey band under the image, holding domain, title and a one-line description.
export const FacebookText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.625rem 0.75rem;
  background: var(--surface-subtle);
  line-height: 1.3;
`;

// Facebook prints the domain in small caps-style uppercase above the title.
export const FacebookHost = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--surface-muted);
`;

// Bold title, clamped to two lines.
export const FacebookTitle = styled.strong`
  font-size: 1rem;
  font-weight: 600;
`;

// The description, if shown at all, gets a single muted line.
export const FacebookDescription = styled.span`
  font-size: 0.875rem;
  color: var(--surface-muted);
`;
