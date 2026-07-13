"use client";

import { JSX, useState } from "react";
import { IconSpeaker } from "@/icons/IconSpeaker";
import { SoundToggleProps } from "@/interfaces/icons/speaker";
import { useSoundPreference } from "@/hooks/use-sound-preference";
import { useSound } from "@/hooks/use-sound";
import { useBoop } from "@/hooks/use-boop";

/*
  Header sound on/off switch — mutes/unmutes every `useSound` call site across the site (Sparkles,
  HitCounter, this button's own future calls) via SoundContext. The toggle click itself always
  plays its confirmation sound (`forceSoundEnabled: true`) so muting isn't silent about happening.
*/
export default function SoundToggle({ size = 16, className }: SoundToggleProps): JSX.Element {
  // Site-wide mute flag (SoundContext) + its setter; this button is the sole writer.
  const { soundEnabled, setSoundEnabled } = useSoundPreference();
  // isBooped pulses true for ~150ms on hover/click, driving IconSpeaker's springs; triggerBoop re-arms it.
  const [isBooped, triggerBoop] = useBoop();

  // Don't wiggle on mount — only after the user has actually toggled sound at least once.
  const [hasBeenToggled, setHasBeenToggled] = useState(false);

  // Confirmation sounds for each direction; both bypass the mute via forceSoundEnabled so toggling stays audible.
  const [playOn] = useSound("/sounds/enable-sound.mp3", { volume: 0.4 });
  const [playOff] = useSound("/sounds/disable-sound.mp3", { volume: 0.25 });

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label={soundEnabled ? "Disable sounds" : "Enable sounds"}
        aria-pressed={soundEnabled}
        // Hover alone gives the icon a little boop, independent of the actual toggle below.
        onPointerEnter={triggerBoop}
        onClick={() => {
          setHasBeenToggled(true);
          triggerBoop();

          // Flip the preference first so IconSpeaker's next render reflects the new state immediately.
          const next = !soundEnabled;
          setSoundEnabled(next);

          if (next) {
            playOn({ forceSoundEnabled: true });
          } else {
            playOff({ forceSoundEnabled: true });
          }
        }}
      >
        <IconSpeaker
          size={size}
          soundEnabled={soundEnabled}
          isBooped={isBooped}
          hasBeenToggled={hasBeenToggled}
        />
      </button>
    </>
  );
}

SoundToggle.displayName = "SoundToggle";
