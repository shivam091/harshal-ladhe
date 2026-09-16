import type { GradientConfig, GradientPresetMeta, GradientStop } from "@/interfaces/gradient";

// Builds one color stop — ids are the color+position pair itself (stable across reloads) since presets are static data, unlike StopEditor's user-created stops which need generateId's randomness to stay unique through edits.
function stop(color: string, position: number): GradientStop {
  return { id: `${color}-${position}`, color, position };
}

// A linear-gradient config at the given axis angle.
function linear(angle: number): GradientConfig {
  return { type: "linear", angle };
}

// A radial-gradient config, centered, sized to fill its box.
function radial(shape: "circle" | "ellipse" = "circle"): GradientConfig {
  return { type: "radial", shape, size: "farthest-corner", position: { x: 50, y: 50 } };
}

// A conic-gradient config at the given start angle, centered.
function conic(angle: number = 0): GradientConfig {
  return { type: "conic", angle, position: { x: 50, y: 50 } };
}

/*
  Curated starting gradients shown in the preset gallery — each is a plain {config, stops} pair, so
  a thumbnail can render it with the exact same compileGradientValue call the live canvas backdrop
  uses. Deliberately spans all three gradient types rather than only linear, since switching type is
  one of this tool's core features.
*/
export const gradientPresets: GradientPresetMeta[] = [
  { slug: "sunset", name: "Sunset", config: linear(135), stops: [stop("#ff9a56", 0), stop("#ff6b9d", 55), stop("#845ec2", 100)] },
  { slug: "ocean", name: "Ocean", config: linear(180), stops: [stop("#43cea2", 0), stop("#185a9d", 100)] },
  { slug: "candy", name: "Candy", config: radial(), stops: [stop("#fbc2eb", 0), stop("#a6c1ee", 100)] },
  { slug: "aurora", name: "Aurora", config: conic(0), stops: [stop("#4facfe", 0), stop("#00f2fe", 33), stop("#43e97b", 66), stop("#4facfe", 100)] },
  { slug: "mint", name: "Mint", config: linear(45), stops: [stop("#0ba360", 0), stop("#3cba92", 100)] },
  { slug: "fire", name: "Fire", config: radial("ellipse"), stops: [stop("#ff512f", 0), stop("#dd2476", 100)] },
  { slug: "grape", name: "Grape", config: linear(160), stops: [stop("#8e2de2", 0), stop("#4a00e0", 100)] },
  { slug: "citrus", name: "Citrus", config: conic(45), stops: [stop("#f9d423", 0), stop("#ff4e50", 50), stop("#f9d423", 100)] }
];
