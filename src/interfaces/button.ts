import type { ButtonIntent, ButtonShape, ButtonSize, ButtonVariant } from "@/types/button";

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
