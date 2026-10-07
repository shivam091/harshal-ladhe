import type { MotionPathPresetMeta } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

/*
  Ready-made layouts for the Motion Path Builder, drawn on its 480 × 300 baseboard. Each brings the
  run that shows it off best — an orbit loops for ever, a bounce wants a fixed heading and linear
  timing — but leaves anything it doesn't mention (anchor, custom glyph text) as the user had it.
  Circular arcs use the usual 0.5523 × radius handle length, so loops read as round.
*/
export const motionPathPresets: MotionPathPresetMeta[] = [
  {
    slug: "loop-de-loop",
    name: "Loop-de-loop",
    closed: false,
    vertices: [
      { type: "straight", point: { x: 30, y: 240 } },
      { type: "curve", point: { x: 240, y: 210 }, handleIn: { x: 201, y: 210 }, handleOut: { x: 279, y: 210 }, mirrored: true },
      { type: "curve", point: { x: 310, y: 140 }, handleIn: { x: 310, y: 179 }, handleOut: { x: 310, y: 101 }, mirrored: true },
      { type: "curve", point: { x: 240, y: 70 }, handleIn: { x: 279, y: 70 }, handleOut: { x: 201, y: 70 }, mirrored: true },
      { type: "curve", point: { x: 170, y: 140 }, handleIn: { x: 170, y: 101 }, handleOut: { x: 170, y: 179 }, mirrored: true },
      { type: "curve", point: { x: 250, y: 214 }, handleIn: { x: 211, y: 214 }, handleOut: { x: 289, y: 214 }, mirrored: true },
      { type: "straight", point: { x: 450, y: 240 } }
    ],
    settings: { glyph: "loco", rotateMode: "auto", easing: "ease-in-out", direction: "normal", infinite: true, duration: 4.5 }
  },
  {
    slug: "figure-eight",
    name: "Figure-eight",
    closed: true,
    vertices: [
      { type: "curve", point: { x: 240, y: 150 }, handleIn: { x: 205, y: 178 }, handleOut: { x: 275, y: 122 }, mirrored: true },
      { type: "curve", point: { x: 340, y: 70 }, handleIn: { x: 295, y: 70 }, handleOut: { x: 385, y: 70 }, mirrored: true },
      { type: "curve", point: { x: 430, y: 150 }, handleIn: { x: 430, y: 105 }, handleOut: { x: 430, y: 195 }, mirrored: true },
      { type: "curve", point: { x: 340, y: 230 }, handleIn: { x: 385, y: 230 }, handleOut: { x: 295, y: 230 }, mirrored: true },
      { type: "curve", point: { x: 240, y: 150 }, handleIn: { x: 275, y: 178 }, handleOut: { x: 205, y: 122 }, mirrored: true },
      { type: "curve", point: { x: 140, y: 70 }, handleIn: { x: 185, y: 70 }, handleOut: { x: 95, y: 70 }, mirrored: true },
      { type: "curve", point: { x: 50, y: 150 }, handleIn: { x: 50, y: 105 }, handleOut: { x: 50, y: 195 }, mirrored: true },
      { type: "curve", point: { x: 140, y: 230 }, handleIn: { x: 95, y: 230 }, handleOut: { x: 185, y: 230 }, mirrored: true }
    ],
    settings: { glyph: "car", rotateMode: "auto", easing: "linear", direction: "normal", infinite: true, duration: 6 }
  },
  {
    slug: "wave",
    name: "Wave",
    closed: false,
    vertices: [
      { type: "straight", point: { x: 30, y: 150 } },
      { type: "curve", point: { x: 110, y: 80 }, handleIn: { x: 75, y: 80 }, handleOut: { x: 145, y: 80 }, mirrored: true },
      { type: "curve", point: { x: 190, y: 220 }, handleIn: { x: 155, y: 220 }, handleOut: { x: 225, y: 220 }, mirrored: true },
      { type: "curve", point: { x: 270, y: 80 }, handleIn: { x: 235, y: 80 }, handleOut: { x: 305, y: 80 }, mirrored: true },
      { type: "curve", point: { x: 350, y: 220 }, handleIn: { x: 315, y: 220 }, handleOut: { x: 385, y: 220 }, mirrored: true },
      { type: "straight", point: { x: 450, y: 150 } }
    ],
    settings: { glyph: "loco", rotateMode: "auto", easing: "ease-in-out", direction: "alternate", infinite: true, duration: 4 }
  },
  {
    slug: "orbit",
    name: "Orbit",
    closed: true,
    vertices: [
      { type: "curve", point: { x: 410, y: 150 }, handleIn: { x: 410, y: 95 }, handleOut: { x: 410, y: 205 }, mirrored: true },
      { type: "curve", point: { x: 240, y: 250 }, handleIn: { x: 334, y: 250 }, handleOut: { x: 146, y: 250 }, mirrored: true },
      { type: "curve", point: { x: 70, y: 150 }, handleIn: { x: 70, y: 205 }, handleOut: { x: 70, y: 95 }, mirrored: true },
      { type: "curve", point: { x: 240, y: 50 }, handleIn: { x: 146, y: 50 }, handleOut: { x: 334, y: 50 }, mirrored: true }
    ],
    settings: { glyph: "plane", rotateMode: "auto", easing: "linear", direction: "normal", infinite: true, duration: 5 }
  },
  {
    slug: "bounce",
    name: "Bounce",
    closed: false,
    vertices: [
      { type: "straight", point: { x: 30, y: 50 } },
      { type: "straight", point: { x: 100, y: 260 } },
      { type: "curve", point: { x: 170, y: 120 }, handleIn: { x: 135, y: 120 }, handleOut: { x: 205, y: 120 }, mirrored: true },
      { type: "straight", point: { x: 240, y: 260 } },
      { type: "curve", point: { x: 295, y: 170 }, handleIn: { x: 268, y: 170 }, handleOut: { x: 322, y: 170 }, mirrored: true },
      { type: "straight", point: { x: 350, y: 260 } },
      { type: "curve", point: { x: 390, y: 215 }, handleIn: { x: 370, y: 215 }, handleOut: { x: 410, y: 215 }, mirrored: true },
      { type: "straight", point: { x: 430, y: 260 } },
      { type: "straight", point: { x: 460, y: 260 } }
    ],
    settings: { glyph: "dot", rotateMode: "fixed", rotateAngle: 0, easing: "linear", direction: "normal", infinite: true, duration: 3 }
  }
];
