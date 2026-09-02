import type { BoxShadowPresetMeta, ShadowLayer } from "@/interfaces/box-shadow";

function layer(id: string, offsetX: number, offsetY: number, blur: number, spread: number, color: string, opacity: number, inset: boolean = false): ShadowLayer {
  return { id, offsetX, offsetY, blur, spread, color, opacity, inset };
}

/*
  Curated starting looks shown in the preset gallery — each is a plain {layers, surfaceColor,
  pageColor, borderRadius} bundle, so a thumbnail can render it with the exact same
  compileBoxShadowValue call the main preview uses. Neumorphism's two entries are the reason
  surfaceColor/pageColor exist on the editor state at all: the soft-UI look only reads correctly
  when both are the same (or near-identical) color, so a preset has to set them alongside its layers.
*/
export const boxShadowPresets: BoxShadowPresetMeta[] = [
  {
    slug: "soft-ui-raised",
    name: "Soft UI Raised",
    surfaceColor: "#e0e5ec",
    pageColor: "#e0e5ec",
    borderRadius: 20,
    layers: [layer("soft-ui-raised-dark", 9, 9, 16, 0, "#a3b1c6", 60), layer("soft-ui-raised-light", -9, -9, 16, 0, "#ffffff", 80)]
  },
  {
    slug: "soft-ui-pressed",
    name: "Soft UI Pressed",
    surfaceColor: "#e0e5ec",
    pageColor: "#e0e5ec",
    borderRadius: 20,
    layers: [
      layer("soft-ui-pressed-dark", 6, 6, 10, 0, "#a3b1c6", 55, true),
      layer("soft-ui-pressed-light", -6, -6, 10, 0, "#ffffff", 70, true)
    ]
  },
  {
    slug: "material-card",
    name: "Material Card",
    surfaceColor: "#ffffff",
    pageColor: "#f1f5f9",
    borderRadius: 8,
    layers: [layer("material-card-1", 0, 1, 2, 0, "#000000", 24), layer("material-card-2", 0, 1, 3, 0, "#000000", 12)]
  },
  {
    slug: "smooth-depth",
    name: "Smooth Depth",
    surfaceColor: "#ffffff",
    pageColor: "#f8fafc",
    borderRadius: 12,
    // The "layered shadow" technique — many stacked layers with steadily increasing offset/blur and decreasing opacity approximate a true soft light source far better than one wide blurred layer, which is what a single-shadow generator is stuck with.
    layers: [
      layer("smooth-depth-1", 0, 1, 1, 0, "#1e293b", 12),
      layer("smooth-depth-2", 0, 2, 2, 0, "#1e293b", 10),
      layer("smooth-depth-3", 0, 4, 4, 0, "#1e293b", 8),
      layer("smooth-depth-4", 0, 8, 8, 0, "#1e293b", 6),
      layer("smooth-depth-5", 0, 16, 16, 0, "#1e293b", 4)
    ]
  },
  {
    slug: "long-shadow",
    name: "Long Shadow",
    surfaceColor: "#fde047",
    pageColor: "#fefce8",
    borderRadius: 4,
    layers: Array.from({ length: 10 }, (_, i) => layer(`long-shadow-${i}`, (i + 1) * 1.5, (i + 1) * 1.5, 0, 0, "#0f172a", 18 - i))
  },
  {
    slug: "neon-glow",
    name: "Neon Glow",
    surfaceColor: "#18181b",
    pageColor: "#09090b",
    borderRadius: 16,
    layers: [
      layer("neon-glow-1", 0, 0, 8, 0, "#22d3ee", 90),
      layer("neon-glow-2", 0, 0, 24, 4, "#22d3ee", 55),
      layer("neon-glow-3", 0, 0, 48, 8, "#d946ef", 35)
    ]
  },
  {
    slug: "sharp-retro",
    name: "Sharp Retro",
    surfaceColor: "#ffffff",
    pageColor: "#fee2e2",
    borderRadius: 4,
    layers: [layer("sharp-retro-1", 6, 6, 0, 0, "#0f172a", 100)]
  },
  {
    slug: "inset-well",
    name: "Inset Well",
    surfaceColor: "#f1f5f9",
    pageColor: "#f1f5f9",
    borderRadius: 12,
    layers: [layer("inset-well-1", 0, 2, 4, 0, "#0f172a", 20, true), layer("inset-well-2", 0, -1, 2, 0, "#ffffff", 60, true)]
  }
];
