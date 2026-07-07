// Enough spokes to read as a burst without crowding a 4rem stage.
const PARTICLE_COUNT = 8;
// The progress bar's three gradient colours, so the burst feels part of the same system.
const PARTICLE_COLORS = ["var(--color-fg-attention)", "var(--color-fg-success)", "var(--color-fg-accent)"];

// Per-particle values fed in as custom properties so one keyframe serves every spoke.
export interface BurstParticleSpec {
  // Degrees around the circle the particle flies outward along.
  angle: number;
  // CSS colour value (a `var(--color-fg-*)` reference) the particle renders in.
  color: string;
}

// Evenly spaced spoke angles around the circle, cycling through the three brand colours.
export function buildBurstParticles(): BurstParticleSpec[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    angle: (360 / PARTICLE_COUNT) * index,
    color: PARTICLE_COLORS[index % PARTICLE_COLORS.length]
  }));
}
