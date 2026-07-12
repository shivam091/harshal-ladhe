import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "@/interfaces/theme-context";

// Typed ThemeContext accessor — throws if called outside a ThemeProvider.
export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
