import { styled } from "@linaria/react";

export const Stage = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  inline-size: 100%;
  block-size: 6rem;
  max-inline-size: 40rem;
  margin-inline: auto;
  padding-inline: 1.5rem;
  overflow: hidden;
  background-image:
    linear-gradient(45deg, var(--color-bg-neutral-muted) 25%, transparent 25%),
    linear-gradient(-45deg, var(--color-bg-neutral-muted) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--color-bg-neutral-muted) 75%),
    linear-gradient(-45deg, transparent 75%, var(--color-bg-neutral-muted) 75%);
  background-size: 1.25rem 1.25rem;
  background-position: 0 0, 0 0.625rem, 0.625rem -0.625rem, -0.625rem 0;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

export const Track = styled.div`
  position: relative;
  inline-size: 100%;
  block-size: 100%;
`;

export const Box = styled.div`
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 50%;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  background: var(--color-bg-accent-emphasis);
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.5rem color-mix(in srgb, var(--color-fg-default) 20%, transparent);
`;

export const PlayRow = styled.div`
  display: flex;
  justify-content: center;
`;

export const PlayButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-on-emphasis);
  background: var(--color-bg-accent-emphasis);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
