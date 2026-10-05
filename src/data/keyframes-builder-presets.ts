import type { KeyframesPresetMeta } from "@/components/KeyframesBuilder/KeyframesBuilder.types";

/*
  Curated starting animations for the preset gallery — the classic set every animation library ships
  (several match Tailwind's own `animate-bounce`/`animate-pulse`/`animate-spin` frames), each paired
  with the settings that make it read correctly. Bounce leans on per-stop timing functions the way
  the keyframes guide demonstrates: a fall curve on the way down, a rise curve on the way back up.
  Every timing function here must be one of TIMING_FUNCTIONS' whitelisted values.
*/
export const keyframesPresets: KeyframesPresetMeta[] = [
  {
    slug: "bounce",
    name: "Bounce",
    settings: { name: "bounce", durationMs: 1000, delayMs: 0, iterationCount: "infinite", direction: "normal", fillMode: "none", timingFunction: "ease" },
    stops: [
      { offset: 0, values: { translateY: -48 }, timingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
      { offset: 50, values: { translateY: 0 }, timingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
      { offset: 100, values: { translateY: -48 }, timingFunction: "cubic-bezier(0.8, 0, 1, 1)" }
    ]
  },
  {
    slug: "pulse",
    name: "Pulse",
    settings: { name: "pulse", durationMs: 2000, delayMs: 0, iterationCount: "infinite", direction: "normal", fillMode: "none", timingFunction: "cubic-bezier(0.4, 0, 0.6, 1)" },
    stops: [
      { offset: 0, values: { opacity: 1 } },
      { offset: 50, values: { opacity: 0.5 } },
      { offset: 100, values: { opacity: 1 } }
    ]
  },
  {
    slug: "shake",
    name: "Shake",
    settings: { name: "shake", durationMs: 800, delayMs: 0, iterationCount: "infinite", direction: "normal", fillMode: "none", timingFunction: "ease-in-out" },
    stops: [
      { offset: 0, values: { translateX: 0 } },
      { offset: 10, values: { translateX: -12 } },
      { offset: 20, values: { translateX: 12 } },
      { offset: 30, values: { translateX: -12 } },
      { offset: 40, values: { translateX: 12 } },
      { offset: 50, values: { translateX: -12 } },
      { offset: 60, values: { translateX: 12 } },
      { offset: 70, values: { translateX: -12 } },
      { offset: 80, values: { translateX: 12 } },
      { offset: 90, values: { translateX: -12 } },
      { offset: 100, values: { translateX: 0 } }
    ]
  },
  {
    slug: "fade-slide-in",
    name: "Fade Slide In",
    settings: { name: "fade-slide-in", durationMs: 600, delayMs: 0, iterationCount: 1, direction: "normal", fillMode: "both", timingFunction: "ease-out" },
    stops: [
      { offset: 0, values: { translateY: 32, opacity: 0 } },
      { offset: 100, values: { translateY: 0, opacity: 1 } }
    ]
  },
  {
    slug: "spin",
    name: "Spin",
    settings: { name: "spin", durationMs: 1000, delayMs: 0, iterationCount: "infinite", direction: "normal", fillMode: "none", timingFunction: "linear" },
    stops: [
      { offset: 0, values: { rotate: 0 } },
      { offset: 100, values: { rotate: 360 } }
    ]
  },
  {
    slug: "wobble",
    name: "Wobble",
    settings: { name: "wobble", durationMs: 1000, delayMs: 0, iterationCount: "infinite", direction: "normal", fillMode: "none", timingFunction: "ease-in-out" },
    stops: [
      { offset: 0, values: { translateX: 0, rotate: 0 } },
      { offset: 15, values: { translateX: -40, rotate: -5 } },
      { offset: 30, values: { translateX: 32, rotate: 3 } },
      { offset: 45, values: { translateX: -24, rotate: -3 } },
      { offset: 60, values: { translateX: 16, rotate: 2 } },
      { offset: 75, values: { translateX: -8, rotate: -1 } },
      { offset: 100, values: { translateX: 0, rotate: 0 } }
    ]
  },
  {
    slug: "heartbeat",
    name: "Heartbeat",
    settings: { name: "heartbeat", durationMs: 1300, delayMs: 0, iterationCount: "infinite", direction: "normal", fillMode: "none", timingFunction: "ease-in-out" },
    stops: [
      { offset: 0, values: { scale: 1 } },
      { offset: 14, values: { scale: 1.3 } },
      { offset: 28, values: { scale: 1 } },
      { offset: 42, values: { scale: 1.3 } },
      { offset: 70, values: { scale: 1 } }
    ]
  },
  {
    slug: "morph",
    name: "Morph",
    settings: { name: "morph", durationMs: 3000, delayMs: 0, iterationCount: "infinite", direction: "alternate", fillMode: "none", timingFunction: "ease-in-out" },
    stops: [
      { offset: 0, values: { rotate: 0, borderRadius: 4, backgroundColor: "#e8b931" } },
      { offset: 50, values: { rotate: 90, scale: 1.2, borderRadius: 32 } },
      { offset: 100, values: { rotate: 180, borderRadius: 4, backgroundColor: "#d1495b" } }
    ]
  }
];
