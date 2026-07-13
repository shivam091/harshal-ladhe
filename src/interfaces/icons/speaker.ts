// Props for IconSpeaker — `soundEnabled` and `isBooped` independently drive the body/wave springs; `hasBeenToggled` gates the wiggle to real toggles only.
export interface IconSpeakerProps {
  // True when sound is on — waves are visible and nudge on boop; false slides the body left and hides the waves.
  soundEnabled: boolean;
  // True for a brief window right after a hover or toggle — nudges the body/waves for a little "clunk".
  isBooped: boolean;
  // Suppresses the wiggle animation on mount; set once the user has toggled sound at least once.
  hasBeenToggled: boolean;
  size?: number;
}

// Props for the SoundToggle button — delegated to the underlying <button> plus IconSpeaker sizing.
export interface SoundToggleProps {
  size?: number;
  className?: string;
}

// Options accepted by `useSound`; `volume` is clamped to the 0-1 range `HTMLAudioElement` expects.
export interface UseSoundOptions {
  volume?: number;
}

// Options accepted by the `play` trigger itself.
export interface PlayOptions {
  // Plays even while the site-wide sound preference is off — for the mute toggle's own click feedback.
  forceSoundEnabled?: boolean;
}
