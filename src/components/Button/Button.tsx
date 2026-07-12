"use client";

import type { JSX, ReactElement } from "react";
import { cloneElement, isValidElement } from "react";
import type { ButtonProps, ButtonBaseProps } from "@/components/Button/Button.types";
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

// One component for actions and navigation so both share identical styling and hover behaviour.
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
    Boop state lives on the button so icons that react to it animate on hovering anywhere on
    the button, not just their own small hit area; icons that ignore the prop are unaffected.
  */
  const [isBooped, triggerBoop] = useBoop();

  function handlePointerEnter(e: React.PointerEvent<HTMLButtonElement | HTMLAnchorElement>) {
    triggerBoop();
    onPointerEnter?.(e as never);
  }

  // Data attributes let CSS select variants directly, avoiding class-name composition.
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

  // Injects isBooped so callers can pass plain icon elements without wiring hover themselves.
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

  // Spinner overlays the label rather than replacing it so the button doesn't change width mid-load.
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
