import { styled } from "@linaria/react";

// An anchor so each card is a real, keyboard-reachable link to the technology's homepage.
export const Card = styled.a`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border-muted);
  background: var(--color-bg-muted);
  text-decoration: none;
  color: inherit;
  transition: border-color 300ms ease, box-shadow 300ms ease;

  &:hover {
    border-color: var(--color-border-default);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    text-decoration: none;
  }
`;

// Keeps identity details on one line so cards scan quickly in the grid.
export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Fixed footprint so logos of different aspect ratios align; overflow stays visible so the boop isn't clipped.
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

// Weight gives the name priority over the version and description.
export const CardName = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-fg-default);
  line-height: 1.25;
`;

// Pinned to the far edge so versions line up across cards regardless of name length.
export const CardVersion = styled.span`
  margin-inline-start: auto;
  font-size: 0.75rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  color: var(--color-fg-muted);
  white-space: nowrap;
`;

// Muted so the project-specific note stays secondary to the technology name.
export const CardDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-fg-muted);
  line-height: 1.625;
  margin: 0;
`;
