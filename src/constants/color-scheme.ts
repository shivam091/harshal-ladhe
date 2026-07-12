// Union of every valid theme key — "system" delegates to the OS preference.
export type ThemeOption = "system" | "light" | "dark" | "soft-dark";

// Persisted so a returning visitor's explicit choice wins over the default.
export const THEME_KEY = "saved-color-theme";

// Follows the OS until the visitor picks otherwise, so first visits already match their preference.
export const DEFAULT_THEME: ThemeOption = "system";
