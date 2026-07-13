import type { CSSProperties, JSX } from "react";
import { useSpring } from "@react-spring/web";
import { SPRINGS } from "@/constants/springs";
// Separate flags so the on/off state, hover feedback, and the toggle wiggle animate independently.
export interface IconSpeakerProps {
  // True when sound is on — waves are visible and nudge on boop; false slides the body left and hides the waves.
  soundEnabled: boolean;
  // True for a brief window right after a hover or toggle — nudges the body/waves for a little "clunk".
  isBooped: boolean;
  // Suppresses the wiggle animation on mount; set once the user has toggled sound at least once.
  hasBeenToggled: boolean;
  size?: number;
}
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { Svg, Path, Speaker, SpeakerWrapper, WaveWrapper } from "@/icons/styles/IconSpeaker.styles";

/*
  Reacts to on/off and hover separately so a toggle reads as a satisfying little "clunk" on top
  of the state change.
*/
export function IconSpeaker({ soundEnabled, isBooped, hasBeenToggled, size = 20 }: IconSpeakerProps): JSX.Element {
  // Skips every spring straight to its end value when the OS/browser requests reduced motion.
  const prefersReducedMotion = usePrefersReducedMotion();

  // Tilts the speaker body -10deg on a boop while muted; settles back to 0deg otherwise.
  const speakerSpring = useSpring({
    transform: `rotate(${isBooped && !soundEnabled ? -10 : 0}deg)`,
    immediate: prefersReducedMotion,
    config: SPRINGS.springy
  });

  // Nudges the inner wave arc outward on a boop while unmuted.
  const waveOneSpring = useSpring({
    transform: `translateX(${isBooped && soundEnabled ? 1.5 : 0}px)`,
    immediate: prefersReducedMotion,
    config: SPRINGS.springy
  });

  // Nudges the outer wave arc outward on a boop while unmuted; delayed 50ms behind waveOneSpring for a ripple feel.
  const waveTwoSpring = useSpring({
    transform: `translateX(${isBooped && soundEnabled ? 2 : 0}px)`,
    immediate: prefersReducedMotion,
    config: SPRINGS.springy,
    delay: 50
  });

  return (
    <>
      <Svg
        width={size / 16 + "rem"}
        height={size / 16 + "rem"}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <SpeakerWrapper
          style={{
            "--x": soundEnabled ? "0px" : "5px",
            transitionDelay: soundEnabled ? "0ms" : "150ms"
          } as CSSProperties}
        >
          <Speaker
            d="M12.0133 4.60757C11.9149 4.2957 11.5463 4.19331 11.2861 4.39151L5.93425 8.46914C5.84716 8.5355 5.74071 8.57143 5.63123 8.57143H1.5C1.22386 8.57143 1 8.79529 1 9.07143V14.9286C1 15.2047 1.22386 15.4286 1.5 15.4286H5.63123C5.74071 15.4286 5.84716 15.4645 5.93425 15.5309L11.2861 19.6085C11.5463 19.8067 11.9149 19.7043 12.0133 19.3924C12.3582 18.2999 13 15.7612 13 12C13 8.2388 12.3582 5.70014 12.0133 4.60757Z"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-should-wiggle={String(soundEnabled && hasBeenToggled)}
            style={speakerSpring}
          />
        </SpeakerWrapper>

        <WaveWrapper
          style={{
            opacity: soundEnabled ? 1 : 0,
            transitionDelay: soundEnabled ? "0ms" : "150ms"
          }}
        >
          <Path
            d="M 17.54 8.46002 C 18.4774 9.39766 19.004 10.6692 19.004 11.995 C 19.004 13.3208 18.4774 14.5924 17.54 15.53"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={waveOneSpring}
          />
        </WaveWrapper>
        <WaveWrapper
          style={{
            opacity: soundEnabled ? 1 : 0,
            transitionDelay: soundEnabled ? "150ms" : "0ms"
          }}
        >
          <Path
            d="M 20.0703 4.92999 C 21.945 6.80527 22.9982 9.34835 22.9982 12 C 22.9982 14.6516 21.945 17.1947 20.0703 19.07"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={waveTwoSpring}
          />
        </WaveWrapper>
      </Svg>
    </>
  );
}
