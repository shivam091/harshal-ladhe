import type { LinearEasingPreset } from "@/interfaces/linear-easing";

/*
  Curated linear() stop lists offered by the playground's preset picker in "An Interactive
  Guide to the CSS linear() Easing Function" — shapes a single cubic-bezier() curve structurally
  cannot express (multiple overshoots, a wind-up dip, a flattened middle), each handed to
  LinearEasingPlayground as a starting point rather than hand-typed by the reader.
*/
export const LINEAR_EASING_PRESETS: Record<string, LinearEasingPreset> = {
  bounce: {
    label: "Bounce",
    stops: [
      { id: "bounce-0", value: 0, position: null },
      { id: "bounce-1", value: 0.63, position: 25 },
      { id: "bounce-2", value: 0.9, position: 45 },
      { id: "bounce-3", value: 1.04, position: 65 },
      { id: "bounce-4", value: 1, position: null },
    ],
  },
  spring: {
    label: "Spring",
    stops: [
      { id: "spring-0", value: 0, position: null },
      { id: "spring-1", value: 0.5, position: null },
      { id: "spring-2", value: 1.09, position: null },
      { id: "spring-3", value: 0.97, position: null },
      { id: "spring-4", value: 1.01, position: null },
      { id: "spring-5", value: 1, position: null },
    ],
  },
  anticipate: {
    label: "Anticipate",
    stops: [
      { id: "anticipate-0", value: 0, position: null },
      { id: "anticipate-1", value: -0.2, position: 15 },
      { id: "anticipate-2", value: 1, position: null },
    ],
  },
  smoothStep: {
    label: "Smooth Step",
    stops: [
      { id: "smooth-0", value: 0, position: null },
      { id: "smooth-1", value: 0.2, position: null },
      { id: "smooth-2", value: 0.8, position: null },
      { id: "smooth-3", value: 1, position: null },
    ],
  },
};
