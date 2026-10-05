import { styled } from "@linaria/react";

// Favicon in a round chip beside the site name and breadcrumb — Google's current result header.
export const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-inline-size: 0;
`;

// The circular chip the favicon sits in.
export const FaviconChip = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  border-radius: 50%;
  background: var(--surface-subtle);
  border: 0.0625rem solid var(--surface-border);
`;

// Site name over breadcrumb URL.
export const ResultSource = styled.div`
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
  line-height: 1.3;
`;

// Site name in the result's default text colour.
export const SiteName = styled.span`
  font-size: 0.875rem;
`;

// The "https://host › path" breadcrumb in muted grey.
export const Breadcrumb = styled.span`
  font-size: 0.75rem;
  color: var(--surface-muted);
`;

/*
  Blue title capped at 600px — Google's real limit is pixel width, so the CSS cap and the ~60
  character truncation together approximate it more faithfully than either alone.
*/
export const ResultTitle = styled.span`
  display: block;
  max-inline-size: 37.5rem;
  margin-block: 0.375rem 0.25rem;
  font-size: 1.25rem;
  line-height: 1.3;
  color: var(--surface-link);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// The snippet, already cut to ~158 characters; also capped at 600px wide like the title.
export const Snippet = styled.p`
  max-inline-size: 37.5rem;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.58;
  color: var(--surface-muted);

  &[data-empty="true"] {
    font-style: italic;
  }
`;
