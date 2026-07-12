/*
  Theme-independent design tokens.

  Every value here is serialised to a CSS custom property on `:root` by `app/layout.tsx`
  via `TOKENS_CSS`. These are the single source of truth; all SCSS consumers now use `var(--...)`.

  Font stacks are included here as custom properties because the linter confirmed they
  can be safely registered as CSS variables (quoted string values, no comma ambiguity at
  the custom-property level).

  To add a token: add an entry to `tokens`, then use `var(--your-token)` in SCSS or
  Linaria styles. No other file needs changing.
*/

const tokens: Record<string, string> = {
  // Spacing
  "--space-none":  "0",
  "--space-xxxs":  "0.125rem",
  "--space-xxs":   "0.1875rem",
  "--space-xs":    "0.25rem",
  "--space-sm":    "0.5rem",
  "--space-md":    "0.75rem",
  "--space-base":  "1rem",
  "--space-lg":    "1.5rem",
  "--space-xl":    "2rem",
  "--space-xxl":   "3rem",
  "--space-xxxl":  "4rem",

  "--fluid-space-xxxs": "clamp(0.125rem, 0.2vw, 0.25rem)",
  "--fluid-space-xxs":  "clamp(0.1875rem, 0.3vw, 0.375rem)",
  "--fluid-space-xs":   "clamp(0.25rem, 0.4vw, 0.5rem)",
  "--fluid-space-sm":   "clamp(0.5rem, 0.8vw, 0.75rem)",
  "--fluid-space-md":   "clamp(0.75rem, 1vw, 1rem)",
  "--fluid-space-base": "clamp(1rem, 1.25vw, 1.5rem)",
  "--fluid-space-lg":   "clamp(1.5rem, 2vw, 2rem)",
  "--fluid-space-xl":   "clamp(2rem, 3vw, 3rem)",
  "--fluid-space-xxl":  "clamp(3rem, 4vw, 4rem)",
  "--fluid-space-xxxl": "clamp(4rem, 6vw, 6rem)",

  "--space-xxxxl": "5rem",

  // Typography — font weights
  "--font-weight-thin":       "100",
  "--font-weight-extralight": "200",
  "--font-weight-light":      "300",
  "--font-weight-base":       "400",
  "--font-weight-medium":     "500",
  "--font-weight-semi-bold":  "600",
  "--font-weight-bold":       "700",

  // Typography — line heights
  "--line-height-none":      "1",
  "--line-height-display":   "1.05",
  "--line-height-title":     "1.1",
  "--line-height-tight":     "1.25",
  "--line-height-snug":      "1.375",
  "--line-height-math":      "1.4",
  "--line-height-base":      "1.5",
  "--line-height-code":      "1.6",
  "--line-height-relaxed":   "1.625",
  "--line-height-paragraph": "1.75",
  "--line-height-loose":     "2",

  // Typography — letter spacing
  "--letter-spacing-base":   "0.01em",
  "--letter-spacing-wide":   "0.5px",
  "--letter-spacing-wider":  "2px",

  // Typography — font sizes
  "--font-size-xs":   "0.75rem",
  "--font-size-sm":   "0.875rem",
  "--font-size-base": "1rem",
  "--font-size-md":   "1.125rem",
  "--font-size-lg":   "1.25rem",
  "--font-size-xl":   "1.5rem",
  "--font-size-xxl":  "2rem",
  "--font-size-xxxl": "3rem",

  // Typography — fluid font sizes
  "--fluid-font-size-xs":   "clamp(0.6875rem, 1.2vw, 0.75rem)",
  "--fluid-font-size-sm":   "clamp(0.8125rem, 1.4vw, 0.875rem)",
  "--fluid-font-size-base": "clamp(0.9375rem, 1.8vw, 1rem)",
  "--fluid-font-size-md":   "clamp(1rem, 2vw, 1.125rem)",
  "--fluid-font-size-lg":   "clamp(1.125rem, 2.4vw, 1.25rem)",
  "--fluid-font-size-xl":   "clamp(1.25rem, 3vw, 1.5rem)",
  "--fluid-font-size-xxl":  "clamp(1.5rem, 4vw, 2rem)",
  "--fluid-font-size-xxxl": "clamp(2rem, 5.5vw, 3rem)",

  // Typography — heading scales
  "--h1-size":           "clamp(1.75rem, 3.5vw, 2.25rem)",
  "--h1-weight":         "700",
  "--h1-wrap":           "pretty",
  "--h1-line-height":    "1.1",
  "--h1-letter-spacing": "-0.03em",

  "--h2-size":           "clamp(1.5rem, 3.2vw, 2rem)",
  "--h2-weight":         "600",
  "--h2-wrap":           "balance",
  "--h2-line-height":    "1.15",
  "--h2-letter-spacing": "-0.025em",

  "--h3-size":           "clamp(1.25rem, 2.6vw, 1.75rem)",
  "--h3-weight":         "500",
  "--h3-wrap":           "balance",
  "--h3-line-height":    "1.2",
  "--h3-letter-spacing": "-0.02em",

  "--h4-size":           "clamp(1.125rem, 2.2vw, 1.5rem)",
  "--h4-weight":         "500",
  "--h4-wrap":           "balance",
  "--h4-line-height":    "1.25",
  "--h4-letter-spacing": "-0.015em",

  "--h5-size":           "clamp(1.0625rem, 1.8vw, 1.375rem)",
  "--h5-weight":         "400",
  "--h5-wrap":           "balance",
  "--h5-line-height":    "1.3",
  "--h5-letter-spacing": "-0.01em",

  "--h6-size":           "clamp(1rem, 1.6vw, 1.25rem)",
  "--h6-weight":         "400",
  "--h6-wrap":           "balance",
  "--h6-line-height":    "1.35",
  "--h6-letter-spacing": "normal",

  // Motion — durations
  "--motion-duration-ultra-fast": "75ms",
  "--motion-duration-fast":       "150ms",
  "--motion-duration-medium":     "300ms",
  "--motion-duration-slow":       "500ms",
  "--motion-duration-extra-slow": "700ms",
  "--motion-duration-ultra-slow": "1000ms",

  // Motion — easing curves
  "--motion-easing-linear":    "cubic-bezier(0, 0, 1, 1)",
  "--motion-easing-ease":      "cubic-bezier(0.25, 0.1, 0.25, 1)",
  "--motion-easing-in":        "cubic-bezier(0.7, 0.1, 0.75, 0.9)",
  "--motion-easing-out":       "cubic-bezier(0.3, 0.8, 0.6, 1)",
  "--motion-easing-in-out":    "cubic-bezier(0.6, 0, 0.2, 1)",
  "--motion-easing-entrance":  "cubic-bezier(0.16, 1, 0.3, 1)",
  "--motion-easing-exit":      "cubic-bezier(0.7, 0, 0.84, 0)",
  "--motion-easing-bounce":    "cubic-bezier(0.34, 1.56, 0.64, 1)",
  "--motion-easing-elastic":   "cubic-bezier(0.5, -0.5, 0.5, 1.5)",
  "--motion-easing-overshoot": "cubic-bezier(0.27, 0.22, 0.44, 1.03)",

  // Motion — delays
  "--motion-delay-none":       "0ms",
  "--motion-delay-short":      "75ms",
  "--motion-delay-medium":     "150ms",
  "--motion-delay-long":       "300ms",
  "--motion-delay-extra-long": "500ms",
  "--motion-delay-ultra-long": "1000ms",

  // Motion — color-swap (theme transition)
  "--color-swap-duration":         "350ms",
  "--color-swap-timing-function":  "cubic-bezier(0.41, 0.1, 0.13, 1)",

  // Motion — sky/swoop transition durations
  "--sky-duration":          "calc(350ms + 300ms)",
  "--sky-from-duration":     "calc(350ms + 500ms)",
  "--sky-to-duration":       "calc(350ms + 350ms)",
  "--swoop-duration":        "calc(350ms + 200ms)",
  "--first-swoop-duration":  "calc(350ms + 120ms)",
  "--second-swoop-duration": "calc(350ms + 240ms)",
  "--third-swoop-duration":  "calc(350ms + 360ms)",

  // Outlines
  "--outline-focus-offset": "0.125rem",
  "--outline-focus-width":  "0.125rem",

  // Border radius
  "--border-radius-none":    "0",
  "--border-radius-xs":      "0.125rem",
  "--border-radius-sm":      "0.1875rem",
  "--border-radius-md":      "0.375rem",
  "--border-radius-lg":      "0.75rem",
  "--border-radius-xl":      "1rem",
  "--border-radius-xxl":     "1.5rem",
  "--border-radius-pill":    "50rem",
  "--border-radius-full":    "624.9375rem",
  "--border-radius-default": "0.375rem",
  "--border-radius-4":       "0.25rem",
  "--border-radius-8":       "0.5rem",

  // Border widths
  "--border-width-none":        "0",
  "--border-width-hairline":    "0.03125rem",
  "--border-width-thin":        "0.0625rem",
  "--border-width-medium":      "0.125rem",
  "--border-width-thick":       "0.25rem",
  "--border-width-extra-thick": "0.5rem",
  "--border-width-default":     "0.0625rem",

  // Opacity
  "--opacity-full":     "1",
  "--opacity-semi":     "0.8",
  "--opacity-medium":   "0.5",
  "--opacity-low":      "0.3",
  "--opacity-very-low": "0.1",
  "--opacity-none":     "0",

  // Sizes
  "--size-xxxs": "0.125rem",
  "--size-xxs":  "0.25rem",
  "--size-xs":   "0.375rem",
  "--size-sm":   "0.5rem",
  "--size-md":   "0.75rem",
  "--size-base": "1rem",
  "--size-lg":   "1.5rem",
  "--size-xl":   "2rem",
  "--size-xxl":  "2.5rem",
  "--size-xxxl": "3rem",
  "--size-huge": "4rem",
  "--size-giga": "5rem",
  "--size-tera": "6rem",
  "--size-peta": "7rem",
  "--size-exa":  "8rem",
  "--size-narrow": "28rem",

  // Misc
  "--header-height": "5rem",

  // Font stacks
  "--font-stack-system": "'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  "--font-stack-monospace": "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
};

export const TOKENS_CSS = Object.entries(tokens)
  .map(([key, value]) => `  ${key}: ${value};`)
  .join("\n");
