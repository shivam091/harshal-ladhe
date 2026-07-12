// Union of every valid theme key — "system" delegates to the OS preference.
export type ThemeOption = "system" | "light" | "dark" | "soft-dark";

// localStorage key for persisting the user's chosen theme across sessions.
export const THEME_KEY = "saved-color-theme";

// Starting value before the mount effect reads localStorage.
export const DEFAULT_THEME: ThemeOption = "system";
