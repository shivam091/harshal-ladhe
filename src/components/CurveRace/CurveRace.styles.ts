import { styled } from "@linaria/react";

// Outer spacing wrapper.
export const Wrapper = styled.div`
  margin-block: var(--space-xxl);
  margin-inline: auto;
`;

// The race track, with dashed start/finish borders.
export const Track = styled.div`
  position: relative;
  block-size: var(--size-xxl);
  border-block: var(--border-width-thin) dashed var(--color-border-muted);
  background: var(--color-bg-muted);
`;

// A single faded trail dot at a fixed point in time.
export const Ghost = styled.div`
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 50%;
  inline-size: var(--size-sm);
  block-size: var(--size-sm);
  border-radius: var(--border-radius-full);
  background: var(--color-fg-muted);
  opacity: var(--opacity-low);
  transform: translate(var(--offset, 0px), -50%);
`;

// The live race marker.
export const Marker = styled.div`
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 50%;
  inline-size: var(--size-lg);
  block-size: var(--size-lg);
  border-radius: var(--border-radius-full);
  background: var(--color-fg-accent);
  box-shadow: var(--box-shadow-sm);
  transform: translate(var(--offset, 0px), -50%);

  &[data-playing] {
    background: var(--color-bg-accent-emphasis);
  }
`;

// Row of controls: curve picker and play button.
export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-base);
  margin-block-start: var(--space-lg);
`;

// Wraps Select with a masked chevron icon.
export const SelectWrapper = styled.div`
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: var(--space-sm);
    inline-size: var(--size-md);
    block-size: var(--size-md);
    transform: translateY(-50%);
    background-color: var(--color-fg-muted);
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-size: 100%;
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5'/%3E%3C/svg%3E");
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100%;
    pointer-events: none;
  }
`;

// Curve picker dropdown.
export const Select = styled.select`
  appearance: none;
  block-size: var(--size-xxl);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--border-radius-default);
  padding-inline: var(--space-sm) var(--space-xl);
  background: var(--color-bg-control);
  color: var(--color-fg-default);
  font-size: var(--font-size-base);
`;
