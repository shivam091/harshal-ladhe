import type { FillRulePreset } from "@/components/FillRuleVisualiser/FillRuleVisualiser.types";

/*
  Curated starting windows for the Fill-Rule Visualiser, all drawn in the 400 × 400 light-table
  space. Each one isolates a single idea about winding, and each ships with a ray already placed in
  the region that idea is about, so the readout explains the preset the moment it loads. Circles are
  written as arcs (sweep-flag 1 = clockwise on screen) and converted to cubics on load.
*/
export const fillRulePresets: FillRulePreset[] = [
  {
    slug: "pentagram",
    name: "Pentagram",
    blurb: "One subpath that winds round its centre twice: nonzero fills it, evenodd doesn’t.",
    d: "M200 40 L297 338.5 L43.1 154 L356.9 154 L103 338.5 Z",
    probe: { x: 200, y: 215, angle: 0 }
  },
  {
    slug: "nested-same",
    name: "Nested squares (same)",
    blurb: "Both squares drawn clockwise, so the inner one adds +1 again and nonzero fills the hole.",
    d: "M60 60 H340 V340 H60 Z M140 140 H260 V260 H140 Z",
    probe: { x: 200, y: 200, angle: 0 }
  },
  {
    slug: "nested-opposite",
    name: "Nested squares (opposite)",
    blurb: "The inner square runs anticlockwise, cancelling the outer one, so both rules leave a hole.",
    d: "M60 60 H340 V340 H60 Z M140 140 V260 H260 V140 Z",
    probe: { x: 200, y: 200, angle: 0 }
  },
  {
    slug: "figure-eight",
    name: "Figure-eight",
    blurb: "One loop clockwise, the other anticlockwise: winding +1 and −1, and both rules fill both.",
    d: "M200 200 C260 110 360 120 360 200 C360 280 260 290 200 200 C140 110 40 120 40 200 C40 280 140 290 200 200 Z",
    probe: { x: 100, y: 215, angle: 180 }
  },
  {
    slug: "donut",
    name: "Donut",
    blurb: "A clockwise ring around an anticlockwise hole — the safe way to cut a hole for either rule.",
    d: "M50 200 A150 150 0 1 1 350 200 A150 150 0 1 1 50 200 Z M135 200 A65 65 0 1 0 265 200 A65 65 0 1 0 135 200 Z",
    probe: { x: 200, y: 185, angle: 0 }
  },
  {
    slug: "overlapping-circles",
    name: "Overlapping circles",
    blurb: "Two clockwise circles: the lens where they overlap winds twice, so evenodd hollows it.",
    d: "M45 200 A110 110 0 1 1 265 200 A110 110 0 1 1 45 200 Z M135 200 A110 110 0 1 1 355 200 A110 110 0 1 1 135 200 Z",
    probe: { x: 200, y: 170, angle: 0 }
  },
  {
    slug: "letter-o",
    name: "Letter O",
    blurb: "Drawn the way fonts draw it — counter reversed — so the hole survives under either rule.",
    d: "M75 200 A125 160 0 1 1 325 200 A125 160 0 1 1 75 200 Z M140 200 A60 100 0 1 0 260 200 A60 100 0 1 0 140 200 Z",
    probe: { x: 200, y: 200, angle: 0 }
  },
  {
    slug: "letter-b",
    name: "Letter B",
    blurb: "Both counters drawn the same way as the outline: nonzero fills them in until you reverse one.",
    d: "M110 60 H225 C285 60 300 105 290 135 C283 157 268 170 255 178 C290 188 315 215 315 255 C315 310 275 340 220 340 H110 Z M160 105 H215 C240 105 250 120 250 140 C250 160 238 172 215 172 H160 Z M160 215 H222 C250 215 265 232 265 255 C265 280 250 295 222 295 H160 Z",
    probe: { x: 200, y: 140, angle: 0 }
  }
];
