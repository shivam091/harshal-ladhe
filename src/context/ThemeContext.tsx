"use client";

import type { JSX } from "react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import type { ThemeOption } from "@/constants/color-scheme";
import { DEFAULT_THEME, THEME_KEY } from "@/constants/color-scheme";
import { trackEvent } from "@/lib/analytics";
import { mixpanelRegister } from "@/lib/mixpanel";

// Keeps the user's choice (possibly "system") rather than the resolved theme so the UI can show what they picked.
export interface ThemeContextType {
  theme: ThemeOption;
  // Lets consumers defer theme-dependent UI until after hydration, since the server can't know the saved theme.
  isMounted: boolean;
  setTheme: (theme: ThemeOption, animate?: boolean) => void;
}

// Undefined default so a missing provider fails loudly instead of silently using a fake theme.
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// data-theme needs a concrete theme, so "system" must be resolved against the OS preference.
function resolveSystem(): Exclude<ThemeOption, "system"> {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/*
  Restores the saved theme only after mount to avoid a hydration mismatch, and keeps
  "system" live so an OS scheme change mid-session is reflected without a reload.
*/
export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [theme, setThemeState] = useState<ThemeOption>(DEFAULT_THEME);
  const [isMounted, setIsMounted] = useState(false);
  // A ref lets the OS-change handler read the current choice without re-reading localStorage, which can throw in private mode.
  const themeRef = useRef<ThemeOption>(DEFAULT_THEME);

  /*
    Touches <html> directly because the theme CSS keys off an element React doesn't render. Swaps inside
    a view transition so the whole page cross-fades once (see _view-transitions.scss); unsupported
    browsers and reduced-motion readers get an instant swap.
  */
  const setTheme = useCallback((next: ThemeOption, animate = true) => {
    // Only a reader's own switch: a restore doesn't animate, and an OS change re-applies "system" to itself.
    if (animate && next !== themeRef.current) {
      trackEvent("theme_change", { theme: next, previous_theme: themeRef.current });
      mixpanelRegister({ theme: next });
    }
    themeRef.current = next;
    const resolved = next === "system" ? resolveSystem() : next;
    const root = document.documentElement;
    const apply = () => root.setAttribute("data-theme", resolved);

    if (!animate || !document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
    } else {
      root.setAttribute("data-theme-swap", "");
      document.startViewTransition(apply).finished.finally(() => root.removeAttribute("data-theme-swap"));
    }
    try { localStorage.setItem(THEME_KEY, next); } catch { /* private browsing */ }
    setThemeState(next);
  }, []);

  useEffect(() => {
    let saved: ThemeOption;
    try {
      saved = (localStorage.getItem(THEME_KEY) as ThemeOption) ?? DEFAULT_THEME;
    } catch {
      // localStorage.getItem throws SecurityError in iOS Safari private browsing.
      saved = DEFAULT_THEME;
    }
    // No fade on restore, or every load would cross-fade from the server's light theme.
    setTheme(saved, false);
    setIsMounted(true);

    // Keeps "system" in sync with OS changes — via themeRef so private-browsing tabs still respond.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (themeRef.current === "system") setTheme("system");
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [setTheme]);

  return (
    <>
      <ThemeContext.Provider value={{ theme, isMounted, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </>
  );
}

ThemeProvider.displayName = "ThemeProvider";
