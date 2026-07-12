// Visual weight is its own axis so emphasis can be chosen independently of colour.
export type ButtonVariant = "filled" | "outlined" | "ghost" | "soft";
// Colour carries meaning separately from variant so any weight can signal any intent.
export type ButtonIntent  = "default" | "accent" | "success" | "danger" | "attention";
// A fixed scale keeps buttons consistent instead of ad-hoc padding per use.
export type ButtonSize    = "sm" | "md" | "lg";
// Presets rather than free radius values so corners stay consistent site-wide.
export type ButtonShape   = "rounded" | "pill" | "square";
// Boxed icons give CTAs a stronger, shared accent treatment than inline icons.
export type ButtonIconVariant = "plain" | "boxed";

// Kept apart from element attributes so both render modes share one styling API.
export interface ButtonBaseProps {
  // Visual style. Default: `"filled"`
  variant?: ButtonVariant;
  // Semantic colour intent. Default: `"default"`
  intent?: ButtonIntent;
  // Padding/font-size scale. Default: `"md"`
  size?: ButtonSize;
  // Independent of size so corner style can change without touching padding. Default: `"rounded"`
  shape?: ButtonShape;
  // Disables interaction while pending so an action can't be fired twice.
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  // `"boxed"` gives CTAs a stronger accent and keeps the label readable while loading. Default: `"plain"`
  iconVariant?: ButtonIconVariant;
  // Only applies with `fullWidth`; `"split"` pins icons to the edges so stacked buttons align. Default: `"center"`
  iconAlign?: "center" | "split";
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/** Render as a <button> when no `href` is supplied. */
type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

/** Render as a Next.js <Link> when `href` is supplied. */
type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

// Discriminating on href lets TypeScript reject anchor-only props on buttons and vice versa.
export type ButtonProps = ButtonAsButton | ButtonAsLink;
