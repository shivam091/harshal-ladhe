import { createContext } from "react";
import type { ThemeOption } from "@/types/color-scheme";

// Shape of the value exposed by ThemeContext — current key, mount flag, and setter.
export interface ThemeContextType {
  theme: ThemeOption;
  // False on the server and before the first useEffect fires; guards hydration-sensitive renders.
  isMounted: boolean;
  setTheme: (theme: ThemeOption) => void;
}

// Raw context — undefined until a ThemeProvider mounts above the consumer.
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
