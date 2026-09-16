import type { GradientFillConfig, TextEffectsPresetMeta, TextShadowLayer } from "@/interfaces/text-effects";

// Terse positional constructor so the preset table below reads as one line per layer instead of an object literal per field — mirrors box-shadow-presets.ts's own `layer()` helper.
function layer(id: string, offsetX: number, offsetY: number, blur: number, color: string, opacity: number = 100): TextShadowLayer {
  return { id, offsetX, offsetY, blur, color, opacity };
}

// A disabled gradient fill with a sensible pair of stops already queued up, so a preset that ships shadow-only still leaves GradientFillControls in a ready-to-enable state rather than an empty one.
function noFill(): GradientFillConfig {
  return { enabled: false, type: "linear", angle: 90, stops: [{ id: "nofill-1", color: "#6366f1", position: 0 }, { id: "nofill-2", color: "#ec4899", position: 100 }] };
}

// Terse constructor for an enabled gradient fill — `stops` as positional [id, color, position] tuples so a preset's whole gradient reads as one compact literal.
function fill(type: GradientFillConfig["type"], angle: number, stops: Array<[string, string, number]>): GradientFillConfig {
  return { enabled: true, type, angle, stops: stops.map(([id, color, position]) => ({ id, color, position })) };
}

/*
  Curated starting looks shown in the preset gallery — deliberately spans shadow-only,
  gradient-fill-only, and combined presets (Fire Text, Retro Chrome) since layering both effects
  on the same text at once is this tool's core distinguishing feature over a plain text-shadow-only
  or gradient-only generator.
*/
export const textEffectsPresets: TextEffectsPresetMeta[] = [
  {
    slug: "neon-glow",
    name: "Neon Glow",
    fontSize: 64,
    fontWeight: 800,
    textColor: "#ffffff",
    pageColor: "#0f172a",
    gradientFill: noFill(),
    shadowLayers: [
      layer("neon-1", 0, 0, 4, "#67e8f9", 90),
      layer("neon-2", 0, 0, 12, "#22d3ee", 80),
      layer("neon-3", 0, 0, 28, "#06b6d4", 65),
      layer("neon-4", 0, 0, 48, "#0891b2", 45)
    ]
  },
  {
    slug: "3d-text",
    name: "3D Text",
    fontSize: 64,
    fontWeight: 800,
    textColor: "#1e293b",
    pageColor: "#f8fafc",
    gradientFill: noFill(),
    shadowLayers: Array.from({ length: 8 }, (_, i) => layer(`3d-${i}`, i + 1, i + 1, 0, "#94a3b8", 100))
  },
  {
    slug: "fire-text",
    name: "Fire Text",
    fontSize: 64,
    fontWeight: 800,
    textColor: "#f97316",
    pageColor: "#1c1917",
    gradientFill: fill("linear", 0, [
      ["fire-1", "#fde047", 0],
      ["fire-2", "#f97316", 50],
      ["fire-3", "#dc2626", 100]
    ]),
    shadowLayers: [layer("fire-glow", 0, 0, 24, "#f97316", 70)]
  },
  {
    slug: "glitch",
    name: "Glitch",
    fontSize: 64,
    fontWeight: 800,
    textColor: "#ffffff",
    pageColor: "#0a0a0a",
    gradientFill: noFill(),
    shadowLayers: [layer("glitch-red", -3, 0, 0, "#ef4444", 85), layer("glitch-cyan", 3, 0, 0, "#22d3ee", 85)]
  },
  {
    slug: "emboss",
    name: "Emboss",
    fontSize: 64,
    fontWeight: 700,
    // Matches pageColor deliberately — a true emboss/engrave effect reads through the light+dark shadow pair alone; a text color that differed from the surface would just look like ordinary flat text with a drop shadow.
    textColor: "#cbd5e1",
    pageColor: "#cbd5e1",
    gradientFill: noFill(),
    shadowLayers: [layer("emboss-light", -1, -1, 0, "#ffffff", 90), layer("emboss-dark", 1, 1, 0, "#334155", 70)]
  },
  {
    slug: "retro-chrome",
    name: "Retro Chrome",
    fontSize: 64,
    fontWeight: 800,
    textColor: "#94a3b8",
    pageColor: "#18181b",
    gradientFill: fill("linear", 180, [
      ["chrome-1", "#f1f5f9", 0],
      ["chrome-2", "#94a3b8", 45],
      ["chrome-3", "#f1f5f9", 55],
      ["chrome-4", "#475569", 100]
    ]),
    shadowLayers: [layer("chrome-shadow", 0, 3, 2, "#000000", 60)]
  },
  {
    slug: "sunset-gradient",
    name: "Sunset Gradient",
    fontSize: 64,
    fontWeight: 800,
    textColor: "#f97316",
    pageColor: "#fff7ed",
    gradientFill: fill("linear", 135, [
      ["sunset-1", "#f97316", 0],
      ["sunset-2", "#ec4899", 50],
      ["sunset-3", "#8b5cf6", 100]
    ]),
    shadowLayers: []
  },
  {
    slug: "outline-glow",
    name: "Outline Glow",
    fontSize: 64,
    fontWeight: 800,
    // Matches pageColor deliberately — the four small same-color offset shadows approximate a stroke around the glyphs; a differently-colored fill would just look like solid text with a white halo instead of a true outline.
    textColor: "#1e1b4b",
    pageColor: "#1e1b4b",
    gradientFill: noFill(),
    shadowLayers: [
      layer("outline-up", 0, -1.5, 0, "#ffffff", 100),
      layer("outline-down", 0, 1.5, 0, "#ffffff", 100),
      layer("outline-left", -1.5, 0, 0, "#ffffff", 100),
      layer("outline-right", 1.5, 0, 0, "#ffffff", 100),
      layer("outline-glow", 0, 0, 20, "#a855f7", 70)
    ]
  }
];
