import type { ThemeOption } from "@/types/color-scheme";

// localStorage key for persisting the user's chosen theme across sessions.
export const THEME_KEY = "saved-color-theme";

// Starting value before the mount effect reads localStorage.
export const DEFAULT_THEME: ThemeOption = "system";
