import { styled } from "@linaria/react";

// One field's dial — a color-accented card rather than a bare label+select pair, so the 5 fields read as 5 distinct dials rather than one plain form.
export const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.625rem;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:focus-within,
  &:hover {
    border-color: color-mix(in srgb, var(--field-accent) 55%, var(--color-border-muted));
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--field-accent) 15%, transparent);
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4375rem;
`;

export const Dot = styled.span`
  flex: 0 0 auto;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: var(--field-accent);
`;

export const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-default);
`;

/*
  Custom select — same theme-aware chevron trick as the site's shared DemoControlField (a mask-image
  so it can pick up currentColor), but its own copy so this field's own accent color can tint the
  border/focus ring instead of the site-wide accent every other control uses.
*/
export const SelectWrapper = styled.div`
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: 0.625rem;
    inline-size: 0.75rem;
    block-size: 0.75rem;
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

export const Select = styled.select`
  appearance: none;
  inline-size: 100%;
  padding: 0.375rem 1.75rem 0.375rem 0.5rem;
  font-family: inherit;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--field-accent);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--field-accent) 25%, transparent);
  }
`;

export const InlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const InlineLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

export const NumberInput = styled.input`
  inline-size: 3.75rem;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;

  &:focus {
    outline: none;
    border-color: var(--field-accent);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--field-accent) 25%, transparent);
  }
`;

export const TextInput = styled.input`
  inline-size: 100%;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;

  &:focus {
    outline: none;
    border-color: var(--field-accent);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--field-accent) 25%, transparent);
  }
`;
