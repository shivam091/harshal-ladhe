import type { JSX } from "react";
import type { ButtonProps } from "@/types/button";
import type { ButtonBaseProps } from "@/interfaces/button";
import {
  ButtonRoot,
  ButtonLink,
  Label,
  Spinner,
  IconSlot
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
    fullWidth = false,
    children,
    className,
    href,
    disabled,
    ...rest
  } = merged;

  // Data attributes drive all visual variants — no class composition needed.
  const dataAttrs = {
    "data-size":     size,
    "data-variant":  variant,
    "data-intent":   intent,
    "data-shape":    shape !== "rounded" ? shape : undefined,
    "data-fullwidth":        fullWidth || undefined,
    "data-icon-right-align": fullWidth && iconAlign === "split" ? "split" : undefined,
    "data-loading":          loading || undefined
  };

  const isSplit = fullWidth && iconAlign === "split";

  // Hidden spacers mirror each icon's size so the label text stays truly centred.
  const leftSpacer  = isSplit && iconRight ? <IconSlot aria-hidden="true" data-spacer>{iconRight}</IconSlot>  : null;
  const rightSpacer = isSplit && iconLeft  ? <IconSlot aria-hidden="true" data-spacer>{iconLeft}</IconSlot>   : null;

  // Inner content — spinner overlays the hidden label to preserve button width.
  const inner = (
    <>
      {loading && (
        <Spinner
          aria-hidden="true"
          role="presentation"
        />
      )}
      <Label>
        {iconLeft  ? <IconSlot>{iconLeft}</IconSlot>  : leftSpacer}
        {children}
        {iconRight ? <IconSlot>{iconRight}</IconSlot> : rightSpacer}
      </Label>
    </>
  );

  if (href !== undefined) {
    return (
      <>
        <ButtonLink
          href={href}
          className={className}
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
        {...dataAttrs}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </ButtonRoot>
    </>
  );
}

Button.displayName = "Button";
