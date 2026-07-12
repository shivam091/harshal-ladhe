import { styled } from "@linaria/react";
import Link from "next/link";
import { amberAccentCss, focusRingCss } from "@/components/common.styles";

// Inherits the button's gap so icon spacing follows each size's --button-gap.
export const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: inherit;
`;

// Spinner sits on top of the (invisible) label so the button keeps its width.
export const Spinner = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    inline-size: 1em;
    block-size: 1em;
    border-radius: 50%;
    border: 2px solid currentColor;
    border-block-start-color: transparent;
    animation: spin 0.9s ease-in-out infinite;
    will-change: transform;
  }
`;

// Collapsed line-height so icons size off the button's font-size without stretching its height.
export const IconSlot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  line-height: 0;

  &[data-spacer] {
    visibility: hidden;
    pointer-events: none;
  }
`;

/*
  Shares amberAccentCss so every boxed-icon button reads as one visual language. Sized off
  --icon-box-size so the box scales with the button's size instead of staying a fixed footprint.
*/
export const IconBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--icon-box-size, 1.75rem);
  block-size: var(--icon-box-size, 1.75rem);
  flex-shrink: 0;
  border-radius: 0.25rem;
  ${amberAccentCss}
`;

// Hidden spacer mirroring IconBox's footprint, so a centered label stays balanced against a boxed icon on the opposite side.
export const IconBoxSpacer = styled(IconBox)`
  visibility: hidden;
  background: transparent;
`;

// Layout only — hover animation belongs to the icon itself so each icon can move its own way.
export const IconWrapper = styled.span`
  display: flex;
`;

// Smaller, separate spinner because boxed buttons keep their label visible and spin inside the icon box instead.
export const BtnSpinner = styled.span`
  display: block;
  inline-size: 14px;
  block-size: 14px;
  border: 0.125rem solid currentColor;
  border-block-start-color: transparent;
  border-radius: 50%;
  animation: spin 0.9s ease-in-out infinite;
  will-change: transform;
`;

// Variants are selected by data-* attributes so props map straight to CSS without class composition.
export const ButtonRoot = styled.button`
  appearance: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--button-radius);
  padding: var(--button-padding-block) var(--button-padding-inline);
  gap: var(--button-gap);
  --button-radius: 0.5rem;
  font-family: inherit;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  outline: none;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease,
    filter 150ms ease,
    transform 150ms ease,
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

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  // Sizes only swap custom properties, so the base rules never need per-size overrides.
  &[data-size="sm"] {
    --button-padding-block: 0.25rem;
    --button-padding-inline: 0.5rem;
    --button-radius: 0.375rem;
    --button-gap: 0.5rem;
    --icon-box-size: 1.375rem;
    font-size: 0.75rem;
  }

  &[data-size="md"] {
    --button-padding-block: 0.375rem;
    --button-padding-inline: 0.75rem;
    --button-gap: 0.5em;
    --icon-box-size: 1.75rem;
    font-size: 0.875rem;
  }

  &[data-size="lg"] {
    --button-padding-block: 0.5625rem;
    --button-padding-inline: 1.125rem;
    --button-radius: 0.625rem;
    --button-gap: 0.5em;
    --icon-box-size: 2.25rem;
    font-size: 1rem;
  }

  // Shapes override the size's radius outright since shape and size are independent props.
  &[data-shape="pill"] {
    border-radius: 50rem;
  }

  // Reuses the active size's block padding so an icon-only square scales with size.
  &[data-shape="square"] {
    padding: var(--button-padding-block);
    aspect-ratio: 1 / 1;
  }

  // Lets a button fill narrow containers such as forms and mobile layouts.
  &[data-fullwidth] {
    inline-size: 100%;
  }

  // Split pins icons to the edges so stacked full-width buttons keep their icons aligned.
  &[data-icon-right-align="split"] {
    & ${Label} {
      inline-size: 100%;
      justify-content: space-between;
    }
  }

  // Label hidden, not removed, so the button keeps its width while the spinner shows.
  &[data-loading] {
    cursor: wait;
    pointer-events: none;

    & ${Label} {
      visibility: hidden;
    }
  }

  /*
    Boxed loading keeps the label visible since the spinner lives in the icon box. Resets :disabled's
    opacity dip (same specificity, declared later) so the box stays crisp instead of fading while it spins.
  */
  &[data-loading-boxed] {
    cursor: wait;
    pointer-events: none;
    opacity: 1;
  }

  /*
    Intents only set tokens that the variant rules read, so adding an intent is one
    block here and no variant rule has to change.
  */

  &[data-intent="default"] {
    --btn-emph-bg: var(--color-bg-control);
    --btn-emph-fg: var(--color-fg-control);
    --btn-emph-border: var(--color-border-control);
    --btn-muted-bg: var(--color-bg-control-hover);
    --btn-muted-border: var(--color-border-control);
    --btn-plain-fg: var(--color-fg-default);
    --btn-hover-bg: var(--color-bg-control-transparent-hover);
  }

  &[data-intent="accent"] {
    --btn-emph-bg: var(--color-bg-accent-emphasis);
    --btn-emph-fg: var(--color-fg-on-emphasis);
    --btn-emph-border: var(--color-border-accent-emphasis);
    --btn-muted-bg: var(--color-bg-accent-muted);
    --btn-muted-border: var(--color-border-accent-muted);
    --btn-plain-fg: var(--color-fg-accent);
    --btn-hover-bg: var(--color-bg-accent-muted);
  }

  &[data-intent="success"] {
    --btn-emph-bg: var(--color-bg-success-emphasis);
    --btn-emph-fg: var(--color-fg-on-emphasis);
    --btn-emph-border: var(--color-border-success-emphasis);
    --btn-muted-bg: var(--color-bg-success-muted);
    --btn-muted-border: var(--color-border-success-muted);
    --btn-plain-fg: var(--color-fg-success);
    --btn-hover-bg: var(--color-bg-success-muted);
  }

  &[data-intent="danger"] {
    --btn-emph-bg: var(--color-bg-danger-emphasis);
    --btn-emph-fg: var(--color-fg-on-emphasis);
    --btn-emph-border: var(--color-border-danger-emphasis);
    --btn-muted-bg: var(--color-bg-danger-muted);
    --btn-muted-border: var(--color-border-danger-muted);
    --btn-plain-fg: var(--color-fg-danger);
    --btn-hover-bg: var(--color-bg-danger-muted);
  }

  &[data-intent="attention"] {
    --btn-emph-bg: var(--color-bg-attention-emphasis);
    --btn-emph-fg: var(--color-fg-on-emphasis);
    --btn-emph-border: var(--color-border-attention-emphasis);
    --btn-muted-bg: var(--color-bg-attention-muted);
    --btn-muted-border: var(--color-border-attention-muted);
    --btn-plain-fg: var(--color-fg-attention);
    --btn-hover-bg: var(--color-bg-attention-muted);
  }

  // Variants read only intent tokens, so every variant works with every intent.

  // Highest emphasis, for the primary action.
  &[data-variant="filled"] {
    background-color: var(--btn-emph-bg);
    color: var(--btn-emph-fg);
    border-color: var(--btn-emph-border);

    &:hover:not(:disabled) {
      filter: brightness(1.1);
    }
  }

  // Secondary emphasis that still carries the intent colour.
  &[data-variant="outlined"] {
    background-color: transparent;
    color: var(--btn-plain-fg);
    border-color: var(--btn-emph-border);

    &:hover:not(:disabled) {
      background-color: var(--btn-muted-bg);
    }
  }

  // Lightest weight, for low-priority actions that shouldn't compete with content.
  &[data-variant="ghost"] {
    background-color: transparent;
    color: var(--btn-plain-fg);
    border-color: transparent;

    &:hover:not(:disabled) {
      background-color: var(--btn-hover-bg);
    }
  }

  // Between ghost and filled, for actions that need presence without dominating.
  &[data-variant="soft"] {
    background-color: var(--btn-muted-bg);
    color: var(--btn-plain-fg);
    border-color: var(--btn-muted-border);

    &:hover:not(:disabled) {
      filter: brightness(1.06);
    }
  }
`;

// Button CSS on Link so navigation gets client-side routing with identical styling.
export const ButtonLink = styled(Link)`
  appearance: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--button-radius);
  padding: var(--button-padding-block) var(--button-padding-inline);
  gap: var(--button-gap);
  --button-radius: 0.5rem;
  font-family: inherit;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  outline: none;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease,
    filter 150ms ease,
    transform 150ms ease,
    box-shadow 150ms ease;

  /*
    Re-declared because the class-level outline: none above out-specifies the global
    focus-visible ring, which would otherwise silently suppress keyboard focus.
  */
  &:focus-visible {
    ${focusRingCss}
  }

  &:hover {
    text-decoration: none;
  }

  &:active {
    transform: scale(0.96);
  }

  &[data-size="sm"] {
    --button-padding-block: 0.25rem;
    --button-padding-inline: 0.5rem;
    --button-radius: 0.375rem;
    --button-gap: 0.375em;
    --icon-box-size: 1.375rem;
    font-size: 0.75rem;
  }

  &[data-size="md"] {
    --button-padding-block: 0.375rem;
    --button-padding-inline: 0.75rem;
    --button-gap: 0.5em;
    --icon-box-size: 1.75rem;
    font-size: 0.875rem;
  }

  &[data-size="lg"] {
    --button-padding-block: 0.5625rem;
    --button-padding-inline: 1.125rem;
    --button-radius: 0.625rem;
    --button-gap: 0.5em;
    --icon-box-size: 2.25rem;
    font-size: 1rem;
  }

  &[data-shape="pill"] {
    border-radius: 50rem;
  }

  &[data-shape="square"] {
    padding: var(--button-padding-block);
    aspect-ratio: 1 / 1;
  }

  &[data-fullwidth] {
    inline-size: 100%;
  }

  // Split pins icons to the edges so stacked full-width buttons keep their icons aligned.
  &[data-icon-right-align="split"] {
    & ${Label} {
      inline-size: 100%;
      justify-content: space-between;
    }
  }

  &[data-loading] {
    cursor: wait;
    pointer-events: none;

    & ${Label} {
      visibility: hidden;
    }
  }

  &[data-intent="default"] {
    --btn-emph-bg: var(--color-bg-control);
    --btn-emph-fg: var(--color-fg-control);
    --btn-emph-border: var(--color-border-control);
    --btn-muted-bg: var(--color-bg-control-hover);
    --btn-muted-border: var(--color-border-control);
    --btn-plain-fg: var(--color-fg-default);
    --btn-hover-bg: var(--color-bg-control-transparent-hover);
  }

  &[data-intent="accent"] {
    --btn-emph-bg: var(--color-bg-accent-emphasis);
    --btn-emph-fg: var(--color-fg-on-emphasis);
    --btn-emph-border: var(--color-border-accent-emphasis);
    --btn-muted-bg: var(--color-bg-accent-muted);
    --btn-muted-border: var(--color-border-accent-muted);
    --btn-plain-fg: var(--color-fg-accent);
    --btn-hover-bg: var(--color-bg-accent-muted);
  }

  &[data-intent="success"] {
    --btn-emph-bg: var(--color-bg-success-emphasis);
    --btn-emph-fg: var(--color-fg-on-emphasis);
    --btn-emph-border: var(--color-border-success-emphasis);
    --btn-muted-bg: var(--color-bg-success-muted);
    --btn-muted-border: var(--color-border-success-muted);
    --btn-plain-fg: var(--color-fg-success);
    --btn-hover-bg: var(--color-bg-success-muted);
  }

  &[data-intent="danger"] {
    --btn-emph-bg: var(--color-bg-danger-emphasis);
    --btn-emph-fg: var(--color-fg-on-emphasis);
    --btn-emph-border: var(--color-border-danger-emphasis);
    --btn-muted-bg: var(--color-bg-danger-muted);
    --btn-muted-border: var(--color-border-danger-muted);
    --btn-plain-fg: var(--color-fg-danger);
    --btn-hover-bg: var(--color-bg-danger-muted);
  }

  &[data-intent="attention"] {
    --btn-emph-bg: var(--color-bg-attention-emphasis);
    --btn-emph-fg: var(--color-fg-on-emphasis);
    --btn-emph-border: var(--color-border-attention-emphasis);
    --btn-muted-bg: var(--color-bg-attention-muted);
    --btn-muted-border: var(--color-border-attention-muted);
    --btn-plain-fg: var(--color-fg-attention);
    --btn-hover-bg: var(--color-bg-attention-muted);
  }

  &[data-variant="filled"] {
    background-color: var(--btn-emph-bg);
    color: var(--btn-emph-fg);
    border-color: var(--btn-emph-border);

    &:hover {
      filter: brightness(1.1);
    }
  }

  &[data-variant="outlined"] {
    background-color: transparent;
    color: var(--btn-plain-fg);
    border-color: var(--btn-emph-border);

    &:hover {
      background-color: var(--btn-muted-bg);
    }
  }

  &[data-variant="ghost"] {
    background-color: transparent;
    color: var(--btn-plain-fg);
    border-color: transparent;

    &:hover {
      background-color: var(--btn-hover-bg);
    }
  }

  &[data-variant="soft"] {
    background-color: var(--btn-muted-bg);
    color: var(--btn-plain-fg);
    border-color: var(--btn-muted-border);

    &:hover {
      filter: brightness(1.06);
    }
  }
`;
