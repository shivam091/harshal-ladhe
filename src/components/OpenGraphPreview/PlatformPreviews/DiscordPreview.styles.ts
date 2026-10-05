import { styled } from "@linaria/react";

// Discord's embed: a tinted block with the theme-color as its left border, thumbnail top-right for summary cards.
export const DiscordEmbed = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.5rem 1rem;
  max-inline-size: 27rem;
  padding: 0.5rem 1rem 1rem 0.75rem;
  background: var(--surface-subtle);
  border-inline-start: 0.25rem solid var(--accent);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.375;
`;

// Provider name, title, description stacked in Discord's spacing.
export const DiscordText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-inline-size: 0;
  padding-block-start: 0.25rem;
`;

// Discord's small provider line above the title.
export const DiscordSite = styled.span`
  font-size: 0.75rem;
  color: var(--surface-muted);
`;

// Title as a bold link.
export const DiscordTitle = styled.span`
  font-weight: 600;
  color: var(--surface-link);
`;

// The summary thumbnail Discord puts in the embed's top-right corner.
export const DiscordThumb = styled.div`
  inline-size: 5rem;
  margin-block-start: 0.5rem;
  border-radius: 0.25rem;
  overflow: hidden;
`;

// The large image fills the embed's width under the text.
export const DiscordLargeImage = styled.div`
  grid-column: 1 / -1;
  border-radius: 0.25rem;
  overflow: hidden;
`;
