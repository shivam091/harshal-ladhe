import { createContext } from "react";

// A plain context, read conditionally below via use(ThemeContext) instead of the always-unconditional useContext(ThemeContext).
export const ThemeContext = createContext("dark");
