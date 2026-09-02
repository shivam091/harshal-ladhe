import { FILTER_FUNCTION_ORDER } from "@/interfaces/filter";
import type { DropShadowState, FilterFunctionName, FilterFunctionState, FilterPresetMeta } from "@/interfaces/filter";
import { FUNCTION_META } from "@/utils/filter";

// Starts every function at its own default (matching helpers/filter-editor.ts's own defaultFunctions), then overrides just the ones a preset actually turns on — so a preset only has to spell out what it changes, not restate all 9 functions every time.
function functions(overrides: Partial<Record<FilterFunctionName, number>>): Record<FilterFunctionName, FilterFunctionState> {
  return Object.fromEntries(
    FILTER_FUNCTION_ORDER.map((name) => [name, { enabled: name in overrides, value: overrides[name] ?? FUNCTION_META[name].default }])
  ) as Record<FilterFunctionName, FilterFunctionState>;
}

function noDropShadow(): DropShadowState {
  return { enabled: false, offsetX: 0, offsetY: 4, blur: 8, color: "#000000", opacity: 40 };
}

/*
  Curated starting looks shown in the preset gallery — each is a plain bundle so a thumbnail can
  render it with the exact same compileFilterValue call the main preview uses. Deliberately spans
  both targets (Glassmorphism/Frosted Dark/Cool Glass are backdropFilter; everything else is a plain
  filter) since switching target is one of this tool's core features.
*/
export const filterPresets: FilterPresetMeta[] = [
  {
    slug: "glassmorphism",
    name: "Glassmorphism",
    target: "backdropFilter",
    functions: functions({ blur: 12, saturate: 180 }),
    dropShadow: noDropShadow(),
    previewSubject: "gradient",
    previewImageId: "hl-standing",
    panelColor: "#ffffff",
    panelOpacity: 25
  },
  {
    slug: "frosted-dark",
    name: "Frosted Dark",
    target: "backdropFilter",
    functions: functions({ blur: 16, brightness: 70 }),
    dropShadow: noDropShadow(),
    previewSubject: "gradient",
    previewImageId: "hl-standing",
    panelColor: "#0f172a",
    panelOpacity: 45
  },
  {
    slug: "cool-glass",
    name: "Cool Glass",
    target: "backdropFilter",
    functions: functions({ blur: 20, saturate: 160, hueRotate: 10 }),
    dropShadow: noDropShadow(),
    previewSubject: "gradient",
    previewImageId: "hl-standing",
    panelColor: "#e0f2fe",
    panelOpacity: 20
  },
  {
    slug: "vintage-photo",
    name: "Vintage Photo",
    target: "filter",
    functions: functions({ sepia: 60, contrast: 110, brightness: 95, saturate: 85 }),
    dropShadow: noDropShadow(),
    previewSubject: "photo",
    previewImageId: "hl-standing",
    panelColor: "#ffffff",
    panelOpacity: 25
  },
  {
    slug: "vivid-pop",
    name: "Vivid Pop",
    target: "filter",
    functions: functions({ saturate: 200, contrast: 120 }),
    dropShadow: noDropShadow(),
    previewSubject: "gradient",
    previewImageId: "hl-standing",
    panelColor: "#ffffff",
    panelOpacity: 25
  },
  {
    slug: "grayscale",
    name: "Grayscale",
    target: "filter",
    functions: functions({ grayscale: 100 }),
    dropShadow: noDropShadow(),
    previewSubject: "photo",
    previewImageId: "hl-sitting",
    panelColor: "#ffffff",
    panelOpacity: 25
  },
  {
    slug: "dreamy-soft",
    name: "Dreamy Soft",
    target: "filter",
    functions: functions({ blur: 4, brightness: 110, saturate: 120 }),
    dropShadow: noDropShadow(),
    previewSubject: "gradient",
    previewImageId: "hl-standing",
    panelColor: "#ffffff",
    panelOpacity: 25
  },
  {
    slug: "invert-mode",
    name: "Invert Mode",
    target: "filter",
    functions: functions({ invert: 100, hueRotate: 180 }),
    dropShadow: noDropShadow(),
    previewSubject: "photo",
    previewImageId: "hl-smiling-face",
    panelColor: "#ffffff",
    panelOpacity: 25
  }
];
