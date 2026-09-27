import type { PushButtonSound } from "@/components/PushButton/PushButton.types";

// localStorage key for persisting the user's sound on/off preference across sessions.
export const SOUND_KEY = "sound-enabled";

// Starting value before the mount effect reads localStorage.
export const DEFAULT_SOUND_ENABLED = true;

/*
  Shared "arcade button" sprite sheet — press/release feedback for any PushButton instance
  (pagination's Show more, etc.). down1-4/up1-4 are near-duplicate takes so PushButton can sample
  a random one each press/release instead of sounding identical every time.
*/
export const BUTTON_PRESS_SOUND: PushButtonSound = {
  src: "/sounds/button-press-sprite.mp3",
  sprite: {
    down1: [0, 180],
    up1: [200, 550],
    down2: [800, 180],
    up2: [1000, 180],
    down3: [1200, 180],
    up3: [1400, 180],
    down4: [1600, 180],
    up4: [1800, 180]
  },
  downIds: ["down1", "down2", "down3", "down4"],
  upIds: ["up1", "up2", "up3", "up4"]
};
