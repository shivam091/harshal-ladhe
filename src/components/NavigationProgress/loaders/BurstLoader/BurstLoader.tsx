import type { JSX, CSSProperties } from "react";
import type { LoaderProps } from "@/components/NavigationProgress/NavigationProgress.types";
import { buildBurstParticles } from "@/components/NavigationProgress/loaders/BurstLoader/BurstLoader.helpers";
import { Backdrop } from "@/components/NavigationProgress/NavigationProgress.styles";
import { BurstStage, CoreDot, PingRing, Particle } from "@/components/NavigationProgress/loaders/BurstLoader/BurstLoader.styles";

// Angles/colors never change — computed once rather than every render.
const PARTICLES = buildBurstParticles();

/*
 * A single breathing dot while loading. The instant navigation completes, the dot freezes and
 * the ping ring + particles mount for the first time — rather than sitting in the DOM the
 * whole time (invisible) and having their animation toggled on via a `data-state` attribute.
 * A fresh mount guarantees the one-shot animation actually starts; toggling an attribute on an
 * already-existing element risks the change landing in the same paint as the overlay's own
 * fade-out and never visibly firing.
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
