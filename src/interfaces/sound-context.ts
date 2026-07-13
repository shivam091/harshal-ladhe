import { createContext } from "react";

// Shape of the value exposed by SoundContext — global mute flag, mount flag, and setter.
export interface SoundContextType {
  soundEnabled: boolean;
  // False on the server and before the first useEffect fires; guards hydration-sensitive renders.
  isMounted: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

// Raw context — undefined until a SoundProvider mounts above the consumer.
export const SoundContext = createContext<SoundContextType | undefined>(undefined);
