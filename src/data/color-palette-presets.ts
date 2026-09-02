import type { ColorPalettePresetMeta } from "@/interfaces/color-palette";

/*
  Curated seed/contrast-pair combinations — deliberately spanning a passing AA/AAA pair, a
  borderline pair that only just fails, and a range of seed hues across both ramp modes, since this
  tool's main value is seeing how a real seed color behaves under both the contrast checker and the
  ramp generator at once.
*/
export const colorPalettePresets: ColorPalettePresetMeta[] = [
  { slug: "indigo-oklch", name: "Indigo (OKLCH)", seedColor: "#6366f1", foreground: "#0f172a", background: "#f8fafc", rampMode: "oklch" },
  { slug: "indigo-mix", name: "Indigo (RGB mix)", seedColor: "#6366f1", foreground: "#0f172a", background: "#f8fafc", rampMode: "mix" },
  { slug: "emerald", name: "Emerald", seedColor: "#10b981", foreground: "#022c22", background: "#ecfdf5", rampMode: "oklch" },
  { slug: "rose", name: "Rose", seedColor: "#f43f5e", foreground: "#ffffff", background: "#4c0519", rampMode: "oklch" },
  {
    slug: "borderline-gray",
    name: "Borderline Gray",
    seedColor: "#94a3b8",
    // #777777 on white sits at ~4.48:1 — just under the 4.5 AA-normal threshold, a deliberate near-miss to show the checker's fail state.
    foreground: "#777777",
    background: "#ffffff",
    rampMode: "mix"
  },
  { slug: "amber-dark-ui", name: "Amber Dark UI", seedColor: "#f59e0b", foreground: "#fef3c7", background: "#1c1917", rampMode: "oklch" }
];
