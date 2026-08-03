"use client";

import type { JSX} from "react";
import { useState } from "react";
import { IconSpeaker } from "@/icons/IconSpeaker";
import type { SoundToggleProps } from "@/components/SoundToggle/SoundToggle.types";
import { useSoundPreference } from "@/hooks/use-sound-preference";
import { useSound } from "@/hooks/use-sound";
import { useBoop } from "@/hooks/use-boop";

/*
  The toggle always plays its own confirmation sound, even when muting, so the change isn't
  silent about happening.
*/
export default function SoundToggle({ size = 16, className }: SoundToggleProps): JSX.Element {
  // Read from context so every sound on the site follows this one switch.
  const { soundEnabled, setSoundEnabled } = useSoundPreference();
  // Lets hover and clicks nudge the icon for tactile feedback.
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
        // Read at click time, before the re-render, so the label is the state the click switches to.
        data-analytics-event="sound_toggle"
        data-analytics-label={soundEnabled ? "off" : "on"}
        data-analytics-category="preference"
        // Hover alone gives the icon a little boop, independent of the actual toggle below.
        onPointerEnter={triggerBoop}
        onClick={() => {
          setHasBeenToggled(true);
          triggerBoop();

          // Flip the preference first so the icon's next render reflects the new state immediately.
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
