import { styled } from "@linaria/react";

// X's card is one rounded, bordered unit — the image and its text share a single outline.
export const XCard = styled.div`
  overflow: hidden;
  border: 0.0625rem solid var(--surface-border);
  border-radius: 1rem;

  &[data-layout="summary"] {
    display: grid;
    grid-template-columns: 6.5rem minmax(0, 1fr);
    align-items: center;
  }
`;

// On a large card X overlays the title in a dark chip on the image's bottom-left, rather than printing it below.
export const TitleChip = styled.span`
  position: absolute;
  inset-block-end: 0.75rem;
  inset-inline: 0.75rem auto;
  max-inline-size: calc(100% - 1.5rem);
  padding: 0.125rem 0.375rem;
  font-size: 0.8125rem;
  color: #ffffff;
  background: rgb(0 0 0 / 0.77);
  border-radius: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// The "From example.com" line under a large card — X's only text outside the image.
export const FromLine = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: var(--surface-muted);
`;

// The summary card's text column beside its square thumbnail.
export const SummaryText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-inline-size: 0;
  padding: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.3;
  border-inline-start: 0.0625rem solid var(--surface-border);
`;

// Hostname and description in X's secondary grey.
export const Muted = styled.span`
  color: var(--surface-muted);
`;
