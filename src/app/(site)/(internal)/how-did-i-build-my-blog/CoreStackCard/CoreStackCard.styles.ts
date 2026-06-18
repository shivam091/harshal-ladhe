import { styled } from "@linaria/react";

// Clickable technology card — renders as an anchor linking to the technology's homepage.
export const Card = styled.a`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-base);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border-muted);
  background: var(--color-bg-muted);
  text-decoration: none;
  color: inherit;
  transition: border-color var(--motion-duration-medium) ease, box-shadow var(--motion-duration-medium) ease;

  &:hover {
    border-color: var(--color-border-default);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    text-decoration: none;
  }
`;

// Top row of a card — logo, name, and version badge laid out horizontally.
export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

// Fixed-size container that clips and centres the technology logo image.
export const LogoWrapper = styled.div`
  flex-shrink: 0;
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: 6px;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: contain;
  }
`;

// Technology name displayed in semi-bold next to the logo.
export const CardName = styled.span`
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--font-size-base);
  color: var(--color-fg-default);
  line-height: var(--line-height-tight);
`;

// Monospace version badge pushed to the far right of the card header.
export const CardVersion = styled.span`
  margin-inline-start: auto;
  font-size: var(--font-size-xs);
  font-family: var(--font-stack-monospace);
  color: var(--color-fg-muted);
  white-space: nowrap;
`;

// Short muted paragraph summarising what the technology does in this project.
export const CardDescription = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-fg-muted);
  line-height: var(--line-height-relaxed);
  margin: 0;
`;
