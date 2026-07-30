import type { JSX} from "react";
import { useEffect, useRef, useState } from "react";
import { useInterval } from "@/hooks/use-interval";
import { PARTICLE_LIFESPAN_MS, GC_INTERVAL_MS, generateParticles } from "@/components/LikeHeart/LikeHeartParticles/LikeHeartParticles.helpers";
import Particle from "@/components/LikeHeart/LikeHeartParticles/Particle";
import type { LikeHeartParticlesProps as Props, ParticleData } from "@/interfaces/like-button";
import { Wrapper } from "@/components/LikeHeart/LikeHeartParticles/LikeHeartParticles.styles";

/*
  Confetti burst layered over the heart, fired once per successful like (see `trigger`) and
  self-garbage-collected afterward.
*/
export default function LikeHeartParticles({ trigger, size }: Props): JSX.Element {
  // Currently in-flight particles, appended to on each new trigger and pruned once stale.
  const [particles, setParticles] = useState<ParticleData[]>([]);
  // Last-seen trigger value, so a burst only fires on an actual change.
  const prevTrigger = useRef(trigger);

  // Fires a fresh 9-particle burst whenever `trigger` changes.
  useEffect(() => {
    if (trigger !== prevTrigger.current) {
      setParticles((current) => [...current, ...generateParticles(9, size)]);
      prevTrigger.current = trigger;
    }
  }, [trigger, size]);

  /*
    Periodically sweeps out particles past their lifespan so the list doesn't grow
    unbounded. Paused (delay: null) while nothing is in flight, which is most of a
    heart's lifetime, so an idle heart doesn't keep a timer ticking forever.
  */
  useInterval(() => {
    const now = Date.now();
    const freshParticles = particles.filter((particle) => now - particle.createdAt < PARTICLE_LIFESPAN_MS);

    if (freshParticles.length < particles.length) {
      setParticles(freshParticles);
    }
  }, particles.length > 0 ? GC_INTERVAL_MS : null);

  return (
    <>
      <Wrapper style={{ width: size, height: size }} aria-hidden="true">
        {particles.map((particle) => (
          <Particle key={particle.id} {...particle} />
        ))}
      </Wrapper>
    </>
  );
}

LikeHeartParticles.displayName = "LikeHeartParticles";
