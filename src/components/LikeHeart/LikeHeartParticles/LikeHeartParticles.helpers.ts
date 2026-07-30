import { sample, random, generateId } from "@/utils/random";
import { range, normalize } from "@/utils/math";
import { LIKE_PARTICLE_SPRITES } from "@/components/LikeHeart/sprites";
import type { ParticleData } from "@/interfaces/like-button";

/*
  How long a particle's spring animation + fade needs to fully finish, so garbage collection never
  cuts one off mid-flight.
*/
export const PARTICLE_LIFESPAN_MS = 1500;
/*
  How often stale particles are swept out — coarser than their lifespan since this is just
  cleanup, not visible timing.
*/
export const GC_INTERVAL_MS = 5000;

/*
  Generates `num` particles radiating roughly evenly around 360°, each with its own randomized
  distance/rotation/spring feel.
*/
export function generateParticles(num: number, size: number): ParticleData[] {
  const createdAt = Date.now();

  return range(1, num).map((i) => {
    const [sprite] = sample(LIKE_PARTICLE_SPRITES);

    /*
      Distribute particles into their own angular slice so `num` of them ring the button roughly evenly
      instead of clumping.
    */
    const angleMin = (i / num) * 360;
    const angleMax = ((i + 1) / num) * 360;
    const angle = random(angleMin, angleMax, { rounded: false });
    const angleInRads = (angle * Math.PI) / 180;

    /*
      How far this particle travels from center before stopping.
    */
    let distance = random(size * 0.5, size * 1.5, { rounded: false });
    /*
      Particles flying mostly downward (45°–135°) travel a shorter distance so they don't visually crash
      into the count below.
    */
    if (angle > 45 && angle < 135) {
      distance *= 0.5;
    }

    // Total spin (degrees) this particle rotates through over its flight.
    const rotation = random(0, 180, { rounded: false });

    /*
      Farther-traveling particles spring stiffer/tighter so they arrive in roughly the same time as
      closer ones.
    */
    const tension = normalize(distance, size * 0.5, size, 150, 300);
    const friction = normalize(distance, size * 0.5, size, 22, 26);
    // Bigger sprites feel heavier (more inertia/overshoot) than smaller ones.
    const mass = normalize(sprite.size, 12, 50, 0.75, 1.5);

    return {
      id: generateId(8),
      createdAt,
      sprite,
      angleInRads,
      distance,
      rotation,
      springConfig: { tension, friction, mass }
    };
  });
}
