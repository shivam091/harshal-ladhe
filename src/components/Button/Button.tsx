"use client";

import type { JSX, ReactElement } from "react";
import { cloneElement, isValidElement } from "react";
import type { ButtonProps } from "@/types/button";
import type { ButtonBaseProps } from "@/interfaces/button";
import { useBoop } from "@/hooks/use-boop";
import {
  ButtonRoot,
  ButtonLink,
  Label,
  Spinner,
  IconSlot,
  IconBox,
  IconBoxSpacer,
  IconWrapper,
  BtnSpinner
} from "@/components/Button/Button.styles";

// Polymorphic button — renders a <button> by default, or a Next.js <Link> when href is supplied.
export default function Button(props: ButtonProps): JSX.Element {
  const merged = props as ButtonBaseProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>;

  const {
    variant  = "filled",
    intent   = "default",
    size     = "md",
    shape    = "rounded",
    loading  = false,
    iconLeft,
    iconRight,
    iconAlign = "center",
    iconVariant = "plain",
    fullWidth = false,
    children,
    className,
    href,
    disabled,
    onPointerEnter,
    ...rest
  } = merged;

  const isBoxed = iconVariant === "boxed";
  const isBoxedLoading = isBoxed && loading;

  /*
    isBooped is passed into whichever icon is given (see renderIcon) so icons that morph their
    own path in response to it (IconArrowDown, IconArrowRight) animate on hovering anywhere on
    the button, not just their own small hit area. Generic icons (createIcon.ts) accept and
    discard the prop harmlessly.
  */
  const [isBooped, triggerBoop] = useBoop();

  function handlePointerEnter(e: React.PointerEvent<HTMLButtonElement | HTMLAnchorElement>) {
    triggerBoop();
    onPointerEnter?.(e as never);
  }

  // Data attributes drive all visual variants — no class composition needed.
  const dataAttrs = {
    "data-size":     size,
    "data-variant":  variant,
    "data-intent":   intent,
    "data-shape":    shape !== "rounded" ? shape : undefined,
    "data-fullwidth":        fullWidth || undefined,
    "data-icon-right-align": fullWidth && iconAlign === "split" ? "split" : undefined,
    "data-loading":          (loading && !isBoxed) || undefined,
    "data-loading-boxed":    isBoxedLoading || undefined
  };

  const isSplit = fullWidth && iconAlign === "split";

  /*
    Renders an icon, passing Button's isBooped through to it; boxed additionally wraps it in the
    accent square and, while loading, swaps it for a spinner inside that same square.
  */
  function renderIcon(icon: React.ReactNode) {
    const controlledIcon = isValidElement(icon)
      ? cloneElement(icon as ReactElement<{ isBooped?: boolean }>, { isBooped })
      : icon;
    const wrappedIcon = <IconWrapper>{controlledIcon}</IconWrapper>;

    if (!isBoxed) return <IconSlot>{wrappedIcon}</IconSlot>;

    return (
      <IconBox>
        {isBoxedLoading ? <BtnSpinner aria-hidden="true" /> : wrappedIcon}
      </IconBox>
    );
  }

  // Hidden spacers mirror each icon's (or icon box's) footprint so the label text stays truly centred.
  const leftSpacer  = isSplit && iconRight
    ? (isBoxed ? <IconBoxSpacer aria-hidden="true" /> : <IconSlot aria-hidden="true" data-spacer>{iconRight}</IconSlot>)
    : null;
  const rightSpacer = isSplit && iconLeft
    ? (isBoxed ? <IconBoxSpacer aria-hidden="true" /> : <IconSlot aria-hidden="true" data-spacer>{iconLeft}</IconSlot>)
    : null;

  /*
    Inner content — spinner overlays the hidden label to preserve button width (plain icons only;
    boxed icons swap their own spinner in place, see renderIcon).
  */
  const inner = (
    <>
      {loading && !isBoxed && (
        <Spinner
          aria-hidden="true"
          role="presentation"
        />
      )}
      <Label>
        {iconLeft  ? renderIcon(iconLeft)  : leftSpacer}
        {children}
        {iconRight ? renderIcon(iconRight) : rightSpacer}
      </Label>
    </>
  );

  if (href !== undefined) {
    return (
      <>
        <ButtonLink
          href={href}
          className={className}
          onPointerEnter={handlePointerEnter}
          {...dataAttrs}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {inner}
        </ButtonLink>
      </>
    );
  }

  return (
    <>
      <ButtonRoot
        type="button"
        className={className}
        disabled={loading || disabled}
        aria-busy={loading || undefined}
        onPointerEnter={handlePointerEnter}
        {...dataAttrs}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </ButtonRoot>
    </>
  );
}

Button.displayName = "Button";
