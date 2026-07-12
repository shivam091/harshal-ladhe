import type { ButtonBaseProps } from "@/interfaces/button";

// Visual styles a Button can render in.
export type ButtonVariant = "filled" | "outlined" | "ghost" | "soft";
// Semantic colour intents a Button can convey.
export type ButtonIntent  = "default" | "accent" | "success" | "danger" | "attention";
// Padding/font-size scale options.
export type ButtonSize    = "sm" | "md" | "lg";
// Border-radius presets.
export type ButtonShape   = "rounded" | "pill" | "square";

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
