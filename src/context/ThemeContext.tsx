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
import type { ThemeOption } from "@/types/color-scheme";
import { DEFAULT_THEME, THEME_KEY } from "@/constants/color-scheme";
import { ThemeContext } from "@/interfaces/theme-context";

// Reads the OS colour-scheme preference and returns the matching concrete theme.
function resolveSystem(): Exclude<ThemeOption, "system"> {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/*
  Provides theme state to the tree — reads localStorage on mount, writes on change,
  and re-applies when the OS colour scheme changes while "system" is selected.
*/
export function ThemeProvider({ children }: { children: React.ReactNode; }): JSX.Element {
  const [theme, setThemeState] = useState<ThemeOption>(DEFAULT_THEME);
  const [isMounted, setIsMounted] = useState(false);
  /*
    Tracks current theme in a ref so the OS-change handler can read it
    without re-reading localStorage (which throws in iOS Safari private mode).
  */
  const themeRef = useRef<ThemeOption>(DEFAULT_THEME);

  // Resolves "system", writes data-theme on <html>, persists to localStorage.
  const setTheme = useCallback((next: ThemeOption) => {
    themeRef.current = next;
    const resolved = next === "system" ? resolveSystem() : next;
    document.documentElement.setAttribute("data-theme", resolved);
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
    setTheme(saved);
    setIsMounted(true);

    /*
      Re-apply when the OS colour scheme changes and user has chosen "system".
      Read themeRef instead of localStorage so private-browsing tabs still respond.
    */
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
