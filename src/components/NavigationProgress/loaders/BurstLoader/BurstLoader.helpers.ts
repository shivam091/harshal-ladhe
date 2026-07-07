const PARTICLE_COUNT = 8;
const PARTICLE_COLORS = ["var(--color-fg-attention)", "var(--color-fg-success)", "var(--color-fg-accent)"];

export interface BurstParticleSpec {
  // Degrees around the circle the particle flies outward along.
  angle: number;
  // CSS color value (a `var(--color-fg-*)` reference) the particle renders in.
  color: string;
}

// Evenly spaced spoke angles around the circle, cycling through the three brand colors.
export function buildBurstParticles(): BurstParticleSpec[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    angle: (360 / PARTICLE_COUNT) * index,
    color: PARTICLE_COLORS[index % PARTICLE_COLORS.length]
  }));
}
