import { memo, JSX } from "react";
import { useSpring } from "@react-spring/web";
import type { ParticleData } from "@/interfaces/like-button";
import { Emoji } from "@/components/LikeHeart/LikeHeartParticles/Particle/Particle.styles";

/*
  Single confetti particle: springs outward from the button center along its
  pre-computed angle, spinning as it goes, then fades out. `from`/`to` start
  the spring 75% of the way out so it reads as already-in-motion on the first
  frame rather than growing from a standstill.
*/
function Particle({ angleInRads, distance, sprite, rotation, springConfig }: ParticleData): JSX.Element {
  // Starting point, 75% of the way along the travel angle so motion reads as already in progress.
  const fromX = Math.cos(angleInRads) * (distance * 0.75);
  const fromY = Math.sin(angleInRads) * (distance * 0.75);

  // Final resting point, the full precomputed distance out.
  const toX = Math.cos(angleInRads) * distance;
  const toY = Math.sin(angleInRads) * distance;

  const style = useSpring({
    from: { transform: `translate(${fromX}px, ${fromY}px) rotate(0deg)` },
    to: { transform: `translate(${toX}px, ${toY}px) rotate(${rotation}deg)` },
    config: springConfig,
  });

  return (
    <>
      <Emoji style={{ fontSize: sprite.size, ...style }} aria-hidden="true">
        {sprite.emoji}
      </Emoji>
    </>
  );
}

Particle.displayName = "Particle";

export default memo(Particle);
