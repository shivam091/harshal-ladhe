import { codeFolding, foldGutter, foldKeymap } from "@codemirror/language";
import { Compartment, Prec, type Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { createChevronDownIcon, createChevronRightIcon } from "@/components/Sandbox/Editor/extensions/search-icons";

/*
  Builds one fold/unfold gutter marker as a plain inline SVG (expanded = chevron-down, collapsed =
  chevron-right) — foldGutter() rebuilds markers on every scroll/doc change, and a mounted React
  root per marker would leak a fiber tree each time since foldGutter never unmounts the old one.
*/
function chevronMarkerDOM(open: boolean): HTMLElement {
  const container = document.createElement("span");
  container.className = "cm-foldMarker";
  container.append(open ? createChevronDownIcon(14) : createChevronRightIcon(14));
  return container;
}

/*
  foldGutter() renders chevronMarkerDOM's markers, clickable to fold/unfold; Prec.low keeps it to
  the right of Sandpack's own line-number gutter. Each language already tags foldable nodes, so only
  the fold state machine needs wiring up.
*/
export const sandboxFoldingCoreExtension: Extension = [
  codeFolding(),
  Prec.low(
    foldGutter({
      markerDOM: chevronMarkerDOM
    })
  ),
  keymap.of(foldKeymap)
];

// A Compartment so folding can be switched on and off at runtime.
export const foldingCompartment = new Compartment();

// Toggling off removes folding from state entirely, which also unfolds any folded regions.
export const sandboxFoldingExtensions: Extension[] = [
  foldingCompartment.of(sandboxFoldingCoreExtension)
];
