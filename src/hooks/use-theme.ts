import { useContext } from "react";
import type { ThemeContextType } from "@/context/ThemeContext";
import { ThemeContext } from "@/context/ThemeContext";

// Throws outside a provider so a misplaced consumer fails in development instead of rendering the wrong theme.
export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
