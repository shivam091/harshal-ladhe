import type { JSX, CSSProperties } from "react";
import type { LoaderProps } from "@/components/NavigationProgress/NavigationProgress.types";
import { buildBurstParticles } from "@/components/NavigationProgress/loaders/BurstLoader/BurstLoader.helpers";
import { Backdrop } from "@/components/NavigationProgress/NavigationProgress.styles";
import { BurstStage, CoreDot, PingRing, Particle } from "@/components/NavigationProgress/loaders/BurstLoader/BurstLoader.styles";

// Angles/colours never change — computed once rather than every render.
const PARTICLES = buildBurstParticles();

/*
 * The burst mounts only on completion because a fresh mount guarantees the one-shot animation
 * starts, whereas toggling an attribute can land in the same paint as the overlay's fade-out.
 */
export default function BurstLoader({ state, backdrop }: LoaderProps): JSX.Element {
  const done = state === "done";

  return (
    <>
      {backdrop && <Backdrop />}
      <BurstStage>
        <CoreDot data-state={done ? "done" : undefined} />
        {done && <PingRing />}
        {done &&
          PARTICLES.map(({ angle, color }, index) => (
            <Particle key={index} style={{ "--angle": `${angle}deg`, "--particle-color": color } as CSSProperties} />
          ))}
      </BurstStage>
    </>
  );
}

BurstLoader.displayName = "BurstLoader";
