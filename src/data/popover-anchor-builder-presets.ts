import type { PopoverAnchorPresetMeta } from "@/interfaces/popover-anchor-builder";

/*
  Four real-world pairings, deliberately spanning every anchor side but "left" (the compass grid
  covers that one directly) and every content variant, so clicking through the gallery doubles as a
  tour of what auto/manual, backdrop, and entrance-animation are each actually for — not just four
  cosmetic variations on the same tooltip.
*/
export const popoverAnchorBuilderPresets: PopoverAnchorPresetMeta[] = [
  { slug: "tooltip", name: "Tooltip", anchorSide: "top", offset: 8, mode: "auto", backdrop: false, entranceAnimation: true, fallback: true, content: "text" },
  { slug: "dropdown-menu", name: "Dropdown Menu", anchorSide: "bottom", offset: 6, mode: "auto", backdrop: false, entranceAnimation: true, fallback: true, content: "menu" },
  { slug: "context-menu", name: "Context Menu", anchorSide: "right", offset: 10, mode: "auto", backdrop: false, entranceAnimation: false, fallback: true, content: "menu" },
  { slug: "confirmation-dialog", name: "Confirmation Dialog", anchorSide: "center", offset: 0, mode: "manual", backdrop: true, entranceAnimation: true, fallback: false, content: "dialog" }
];
