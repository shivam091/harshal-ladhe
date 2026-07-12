// Visual styles a Button can render in.
export type ButtonVariant = "filled" | "outlined" | "ghost" | "soft";
// Semantic colour intents a Button can convey.
export type ButtonIntent  = "default" | "accent" | "success" | "danger" | "attention";
// Padding/font-size scale options.
export type ButtonSize    = "sm" | "md" | "lg";
// Border-radius presets.
export type ButtonShape   = "rounded" | "pill" | "square";
// Icon rendering styles a Button can use.
export type ButtonIconVariant = "plain" | "boxed";

// Props shared by both render modes (plain <button> and Next.js <Link>).
export interface ButtonBaseProps {
  // Visual style. Default: `"filled"`
  variant?: ButtonVariant;
  // Semantic colour intent. Default: `"default"`
  intent?: ButtonIntent;
  // Padding/font-size scale. Default: `"md"`
  size?: ButtonSize;
  /*
    Border-radius preset.
    - `"rounded"` — 0.5rem (default)
    - `"pill"`    — fully rounded (9999px)
    - `"square"`  — equal padding, aspect-ratio 1:1; use for icon-only buttons
  */
  shape?: ButtonShape;
  // Replaces children with a spinner and disables interaction.
  loading?: boolean;
  // Leading icon node (rendered before children).
  iconLeft?: React.ReactNode;
  // Trailing icon node (rendered after children).
  iconRight?: React.ReactNode;
  /*
    Icon rendering style.
    - `"plain"` — icon renders inline, colored via currentColor. Default.
    - `"boxed"` — icon renders inside its own accent-highlighted square (black-on-white
      light / amber-on-black dark, matching the newsletter form's submit button), with a
      built-in hover boop (downward for iconLeft, rightward for iconRight) and, while
      `loading`, swaps to a spinner inside that same box instead of hiding the label.
  */
  iconVariant?: ButtonIconVariant;
  /*
    Controls icon placement when `fullWidth` is true.
    - `"center"` — icons stay beside the label (centred). Default.
    - `"split"`  — leading icon pinned to the left edge, trailing icon to the right, label centred.
  */
  iconAlign?: "center" | "split";
  // Stretches the button to 100% of its container.
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

// Discriminated union: button-shaped props when no href, link-shaped props when href is given.
export type ButtonProps = ButtonAsButton | ButtonAsLink;
