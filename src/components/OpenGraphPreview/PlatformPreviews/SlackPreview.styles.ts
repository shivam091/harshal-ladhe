import { styled } from "@linaria/react";

/*
  Slack's unfurl hangs off a coloured bar on its left edge — the page's theme-color when set — and
  places a summary thumbnail to the right of the text, or a large image beneath it.
*/
export const SlackUnfurl = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.25rem 0.75rem;
  padding-inline-start: 0.75rem;
  border-inline-start: 0.25rem solid var(--accent);
  border-radius: 0.125rem;
  font-size: 0.875rem;
  line-height: 1.4;
`;

// The text column — site row, title, description.
export const SlackText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-inline-size: 0;
`;

// Favicon and bold site name on one line, Slack's attribution header.
export const SlackSite = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 700;
  min-inline-size: 0;
`;

// The title is a bold link in Slack's link blue.
export const SlackTitle = styled.span`
  font-weight: 700;
  color: var(--surface-link);
`;

// Summary thumbnail — Slack's small square to the right of the text.
export const SlackThumb = styled.div`
  inline-size: 4.5rem;
  border-radius: 0.375rem;
  overflow: hidden;
`;

// The large image spans below the text, capped in width the way Slack caps unfurled images.
export const SlackLargeImage = styled.div`
  grid-column: 1 / -1;
  max-inline-size: 22rem;
  margin-block-start: 0.375rem;
  border-radius: 0.5rem;
  overflow: hidden;
`;
