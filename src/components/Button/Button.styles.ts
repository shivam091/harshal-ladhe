import { styled } from "@linaria/react";
import Link from "next/link";
import { amberAccentCss, focusRingCss } from "@/components/common.styles";

// Flex row wrapping icon slots and text, inheriting gap from the parent button.
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

// Zero-size wrapper so icon sizing is driven by the parent font-size (1em).
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
  Accent-highlighted square housing a "boxed" icon — shares its themed amber surface with
  the newsletter form's submit button (SubmitButton.styles.ts's SubmitBtn) via amberAccentCss,
  so every boxed-icon button (show more, send, ...) reads as one language. Sized off
  --icon-box-size, which ButtonRoot/ButtonLink redefine per [data-size], so the box scales
  with the button's size prop instead of staying a fixed footprint at every size.
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

// Plain flex wrapper around an icon — layout only; any hover animation is the icon's own (see IconArrowDown/IconArrowRight).
export const IconWrapper = styled.span`
  display: flex;
`;

// Pure-CSS spinner shown inside IconBox while a boxed-icon button is loading — reuses the shared "spin" keyframe.
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

/*
  Base button styled component — all size, shape, variant, intent, and state
  variants are driven by data-* attributes so no class composition is needed.
*/
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
    The unconditional outline: none above is a class selector, which always
    out-specifies the global :focus-visible rule in _a11y.scss (a bare
    pseudo-class). Re-declare it here, scoped to :focus-visible, so keyboard
    focus is never silently suppressed.
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

  // Sizes — redefine the --button-* custom properties consumed by the base above.
  &[data-size="sm"] {
    --button-padding-block: 0.3125rem;
    --button-padding-inline: 0.625rem;
    --button-radius: 0.375rem;
    --button-gap: 0.5rem;
    --icon-box-size: 1.375rem;
    font-size: 0.75rem;
  }

  &[data-size="md"] {
    --button-padding-block: 0.5rem;
    --button-padding-inline: 1rem;
    --button-gap: 0.5em;
    --icon-box-size: 1.75rem;
    font-size: 0.875rem;
  }

  &[data-size="lg"] {
    --button-padding-block: 0.75rem;
    --button-padding-inline: 1.5rem;
    --button-radius: 0.625rem;
    --button-gap: 0.5em;
    --icon-box-size: 2.25rem;
    font-size: 1rem;
  }

  // Shape modifiers
  &[data-shape="pill"] {
    border-radius: 50rem;
  }

  /*
   * Square: equal padding on all sides — intended for icon-only buttons.
   * Reuses whichever size's --button-padding-block is active.
   */
  &[data-shape="square"] {
    padding: var(--button-padding-block);
    aspect-ratio: 1 / 1;
  }

  // Full-width
  &[data-fullwidth] {
    inline-size: 100%;
  }

  // Split layout — label text centred, trailing icon pushed to the far-right edge.
  &[data-icon-right-align="split"] {
    & ${Label} {
      inline-size: 100%;
      justify-content: space-between;
    }
  }

  // Loading state — hides label while preserving button width via the Spinner overlay.
  &[data-loading] {
    cursor: wait;
    pointer-events: none;

    & ${Label} {
      visibility: hidden;
    }
  }

  /*
    Loading state for a boxed icon — the icon box swaps in its own spinner (see Button.tsx), so the
    label stays visible. Overrides :disabled's opacity dip (same specificity, declared later) so the
    icon box stays crisp instead of fading while it spins.
  */
  &[data-loading-boxed] {
    cursor: wait;
    pointer-events: none;
    opacity: 1;
  }

  /*
    Intent tokens — each sets seven CSS variables that variant rules consume.
    Adding a new intent = adding one block here; no variant rules change.

      --btn-emph-bg      filled background
      --btn-emph-fg      filled foreground (on-emphasis text)
      --btn-emph-border  filled + outlined border
      --btn-muted-bg     soft background / outlined hover
      --btn-muted-border soft border
      --btn-plain-fg     outlined + ghost + soft text
      --btn-hover-bg     ghost hover background
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

  // Variant styles — consume the intent token variables set above.

  // Filled — solid background, high contrast
  &[data-variant="filled"] {
    background-color: var(--btn-emph-bg);
    color: var(--btn-emph-fg);
    border-color: var(--btn-emph-border);

    &:hover:not(:disabled) {
      filter: brightness(1.1);
    }
  }

  // Outlined — transparent bg, colored border + text
  &[data-variant="outlined"] {
    background-color: transparent;
    color: var(--btn-plain-fg);
    border-color: var(--btn-emph-border);

    &:hover:not(:disabled) {
      background-color: var(--btn-muted-bg);
    }
  }

  // Ghost — no border, no bg; lightest visual weight
  &[data-variant="ghost"] {
    background-color: transparent;
    color: var(--btn-plain-fg);
    border-color: transparent;

    &:hover:not(:disabled) {
      background-color: var(--btn-hover-bg);
    }
  }

  // Soft — tinted muted background; between ghost and filled
  &[data-variant="soft"] {
    background-color: var(--btn-muted-bg);
    color: var(--btn-plain-fg);
    border-color: var(--btn-muted-border);

    &:hover:not(:disabled) {
      filter: brightness(1.06);
    }
  }
`;

// Same full button CSS on a Next.js Link — used when href is supplied.
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
    The unconditional outline: none above is a class selector, which always
    out-specifies the global :focus-visible rule in _a11y.scss (a bare
    pseudo-class). Re-declare it here, scoped to :focus-visible, so keyboard
    focus is never silently suppressed.
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
    --button-padding-block: 0.3125rem;
    --button-padding-inline: 0.625rem;
    --button-radius: 0.375rem;
    --button-gap: 0.375em;
    --icon-box-size: 1.375rem;
    font-size: 0.75rem;
  }

  &[data-size="md"] {
    --button-padding-block: 0.5rem;
    --button-padding-inline: 1rem;
    --button-gap: 0.5em;
    --icon-box-size: 1.75rem;
    font-size: 0.875rem;
  }

  &[data-size="lg"] {
    --button-padding-block: 0.75rem;
    --button-padding-inline: 1.5rem;
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

  // Split layout — label text centred, trailing icon pushed to the far-left edge.
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
