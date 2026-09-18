import { clamp } from "@/utils/number";
import type { AnchorSide, PopoverAnchorEditorState } from "@/interfaces/popover-anchor-builder";

// Custom ident shared by the trigger's `anchor-name` and the popover's `position-anchor` — fixed rather than derived from a generated React id, since exactly one live preview instance exists per page and a stable, readable name reads better in exported code than a `useId()`-shaped string.
export const ANCHOR_NAME = "--pab-anchor";

// Attribute selectors (not classes) so the exported CSS is copy-paste-safe into a stylesheet that already has its own class naming scheme — the consumer only needs to keep these two data attributes on their own markup.
export const TRIGGER_SELECTOR = "[data-pab-trigger]";
export const POPOVER_SELECTOR = "[data-pab-popover]";

// id the trigger's `popovertarget`/`popoverTarget` points at and the popover element itself carries — required by both the native Popover API and by any in-popover "close" control's `popovertargetaction="hide"`.
export const POPOVER_ID = "pab-popover";

export const TRIGGER_LABEL = "Open popover";

/*
  The two `anchor()` calls (plus a `translate` nudge) that tether the popover to one side of its
  trigger. `inset: auto` first resets all four UA-stylesheet-supplied inset values (browsers ship
  `[popover] { inset: 0; margin: auto; }` by default, which would otherwise fight the two sides this
  function actually sets) before declaring just the two edges each placement needs — same reasoning
  `margin: 0` overrides the UA's auto-centering margin.
*/
export function compilePopoverPositionDeclarations(anchorSide: AnchorSide, offset: number): Array<[string, string]> {
  const gap = clamp(offset, 0, 64);
  const base: Array<[string, string]> = [
    ["position", "fixed"],
    ["position-anchor", ANCHOR_NAME],
    ["margin", "0"],
    ["inset", "auto"]
  ];

  switch (anchorSide) {
    case "top":
      return [...base, ["bottom", "anchor(top)"], ["left", "anchor(center)"], ["translate", `-50% -${gap}px`]];
    case "bottom":
      return [...base, ["top", "anchor(bottom)"], ["left", "anchor(center)"], ["translate", `-50% ${gap}px`]];
    case "left":
      return [...base, ["right", "anchor(left)"], ["top", "anchor(center)"], ["translate", `-${gap}px -50%`]];
    case "right":
      return [...base, ["left", "anchor(right)"], ["top", "anchor(center)"], ["translate", `${gap}px -50%`]];
    case "center":
      return [...base, ["top", "anchor(center)"], ["left", "anchor(center)"], ["translate", "-50% -50%"]];
  }
}

/*
  Plain, non-anchor-positioned equivalent used only by PreviewPane's unsupported-browser fallback —
  placements are expressed as percentages of the preview stage itself (which centers the trigger),
  not of the trigger's own box, since computing that without `anchor()` would need a JS layout
  measurement. Close enough to demonstrate placement/behavior; the UI labels it as an approximation.
*/
export function compileFallbackPositionDeclarations(anchorSide: AnchorSide, offset: number): Array<[string, string]> {
  const gap = clamp(offset, 0, 64);
  const base: Array<[string, string]> = [["position", "absolute"], ["margin", "0"]];

  switch (anchorSide) {
    case "top":
      return [...base, ["top", "0"], ["left", "50%"], ["translate", `-50% calc(-100% - ${gap}px)`]];
    case "bottom":
      return [...base, ["top", "100%"], ["left", "50%"], ["translate", `-50% ${gap}px`]];
    case "left":
      return [...base, ["top", "50%"], ["left", "0"], ["translate", `calc(-100% - ${gap}px) -50%`]];
    case "right":
      return [...base, ["top", "50%"], ["left", "100%"], ["translate", `${gap}px -50%`]];
    case "center":
      return [...base, ["top", "50%"], ["left", "50%"], ["translate", "-50% -50%"]];
  }
}

// `position-try-fallbacks`' value depends on which axis the primary placement sits on — flip-block undoes a vertical placement (top/bottom), flip-inline undoes a horizontal one (left/right). "center" has no opposite side to try instead, so it has no fallback value at all.
export function fallbackValueFor(anchorSide: AnchorSide): string | null {
  if (anchorSide === "top" || anchorSide === "bottom") return "flip-block";
  if (anchorSide === "left" || anchorSide === "right") return "flip-inline";
  return null;
}

// `::backdrop` only exists while a top-layer element is open — a soft dim plus a touch of blur so it reads as "everything behind this is inert" without going fully opaque.
export function compileBackdropDeclarations(): Array<[string, string]> {
  return [
    ["background", "rgb(15 23 42 / 45%)"],
    ["backdrop-filter", "blur(2px)"]
  ];
}

// The popover's resting (closed/opening) visual state — paired with compileEntranceOpenDeclarations and an identical @starting-style block by compileStylesheet. `display`/`overlay` are included in the transition list purely so `allow-discrete` has something to apply to; see the popover-api-native-overlays snippet this mirrors.
export function compileEntranceBaseDeclarations(): Array<[string, string]> {
  return [
    ["opacity", "0"],
    ["scale", "0.94"],
    ["transition", "opacity 0.18s ease, scale 0.18s ease, display 0.18s allow-discrete, overlay 0.18s allow-discrete"]
  ];
}

// The popover's `:popover-open` visual state — transitioning TO this from compileEntranceBaseDeclarations (and, via @starting-style, animating FROM it) is what produces the fade/scale-in.
export function compileEntranceOpenDeclarations(): Array<[string, string]> {
  return [
    ["opacity", "1"],
    ["scale", "1"]
  ];
}

// Renders one flat declaration list as a CSS rule body; returns "" for an empty list so callers can filter it back out rather than emitting an empty `{ }` block.
function ruleBlock(selector: string, declarations: Array<[string, string]>): string {
  if (declarations.length === 0) return "";
  const body = declarations.map(([property, value]) => `  ${property}: ${value};`).join("\n");
  return `${selector} {\n${body}\n}`;
}

// Re-indents every line of a rendered block two spaces deeper, for nesting a rule inside @starting-style.
function indent(block: string): string {
  return block
    .split("\n")
    .map((line) => (line ? `  ${line}` : line))
    .join("\n");
}

export interface StylesheetOptions {
  // "anchor" (the default) compiles the real `anchor()`-based placement every export format uses; "static" swaps in compileFallbackPositionDeclarations for PreviewPane's unsupported-browser notice, so the preview never shows visibly broken positioning in a browser that can't run the real thing.
  positionMode?: "anchor" | "static";
}

/*
  Single entry point every consumer (live preview, CSS/HTML/React export) compiles its stylesheet
  from, so the anchor math, fallback behavior, backdrop, and entrance animation are never assembled
  by hand at more than this one call site — mirrors compileTriangleDeclarations' role exactly.
*/
export function compileStylesheet(state: PopoverAnchorEditorState, options: StylesheetOptions = {}): string {
  const positionMode = options.positionMode ?? "anchor";
  const blocks: string[] = [];

  if (positionMode === "anchor") {
    blocks.push(ruleBlock(TRIGGER_SELECTOR, [["anchor-name", ANCHOR_NAME]]));
  }

  const positionDeclarations =
    positionMode === "anchor"
      ? compilePopoverPositionDeclarations(state.anchorSide, state.offset)
      : compileFallbackPositionDeclarations(state.anchorSide, state.offset);

  const fallbackValue = positionMode === "anchor" && state.fallback ? fallbackValueFor(state.anchorSide) : null;
  const popoverDeclarations: Array<[string, string]> = [
    ...positionDeclarations,
    ...(fallbackValue ? ([["position-try-fallbacks", fallbackValue]] as Array<[string, string]>) : []),
    ...(state.entranceAnimation ? compileEntranceBaseDeclarations() : [])
  ];
  blocks.push(ruleBlock(POPOVER_SELECTOR, popoverDeclarations));

  if (state.entranceAnimation) {
    blocks.push(ruleBlock(`${POPOVER_SELECTOR}:popover-open`, compileEntranceOpenDeclarations()));
    blocks.push(`@starting-style {\n${indent(ruleBlock(`${POPOVER_SELECTOR}:popover-open`, compileEntranceBaseDeclarations().filter(([property]) => property !== "transition")))}\n}`);
  }

  if (state.backdrop) {
    blocks.push(ruleBlock(`${POPOVER_SELECTOR}::backdrop`, compileBackdropDeclarations()));
  }

  return blocks.filter(Boolean).join("\n\n");
}
