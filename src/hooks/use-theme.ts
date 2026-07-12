import { useContext } from "react";
import type { ThemeContextType } from "@/context/ThemeContext";
import { ThemeContext } from "@/context/ThemeContext";

// Typed ThemeContext accessor — throws if called outside a ThemeProvider.
export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
