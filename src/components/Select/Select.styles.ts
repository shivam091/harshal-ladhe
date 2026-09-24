import { styled } from "@linaria/react";
import { focusRingCss } from "@/components/common.styles";

// Hosts the chevron as a pseudo-element, since `appearance: none` strips the native arrow and a <select> can't hold one itself.
export const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;

  &[data-fullwidth] {
    display: block;
    inline-size: 100%;
  }

  // Decorative open-affordance — the native select already exposes its own dropdown semantics.
  &::after {
    content: "";
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: 0.75rem;
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

// Mirrors ButtonRoot's filled look and data-size scale so a select and a button read as one design language side by side.
export const SelectRoot = styled.select`
  appearance: none;
  inline-size: 100%;
  border: 1px solid var(--color-border-control);
  background-color: var(--color-bg-control);
  color: var(--color-fg-control);
  border-radius: var(--select-radius);
  padding-inline: var(--select-padding-inline) 2rem;
  --select-radius: 0.5rem;
  font-family: inherit;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  outline: none;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease,
    filter 150ms ease,
    box-shadow 150ms ease;

  /*
    Re-declared because the class-level outline: none above out-specifies the global
    focus-visible ring, which would otherwise silently suppress keyboard focus.
  */
  &:focus-visible {
    ${focusRingCss}
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
    pointer-events: none;
  }

  // Sizes only swap custom properties, so the base rules never need per-size overrides.
  &[data-size="sm"] {
    block-size: 2rem;
    --select-padding-inline: 0.5rem;
    --select-radius: 0.375rem;
    font-size: 0.75rem;
  }

  &[data-size="md"] {
    block-size: 2.5rem;
    --select-padding-inline: 0.75rem;
    font-size: 0.875rem;
  }

  &[data-size="lg"] {
    block-size: 3rem;
    --select-padding-inline: 1rem;
    --select-radius: 0.625rem;
    font-size: 1rem;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
`;
