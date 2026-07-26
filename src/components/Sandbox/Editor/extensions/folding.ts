import { codeFolding, foldGutter, foldKeymap } from "@codemirror/language";
import { Prec, type Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { ChevronDownIcon, ChevronRightIcon } from "@/components/Icon";

/*
  Code folding — each language already tags foldable nodes via foldNodeProp, so codeFolding()
  just wires the fold/unfold state machine up to whatever the active language already marked.
*/

/*
  Builds one fold/unfold gutter marker by mounting ChevronDownIcon (expanded, click to collapse) or
  ChevronRightIcon (collapsed, click to expand) directly — mirrors the open/closed convention
  foldGutter's own FoldMarker passes in.
*/
function chevronMarkerDOM(open: boolean): HTMLElement {
  const container = document.createElement("span");
  container.className = "cm-foldMarker";
  createRoot(container).render(
    createElement(open ? ChevronDownIcon : ChevronRightIcon, { size: 14 })
  );
  return container;
}

/*
  foldGutter() renders chevronMarkerDOM's markers, clickable to fold/unfold; Prec.low keeps it to
  the right of Sandpack's own line-number gutter. foldKeymap adds the standard fold/unfold shortcuts.
*/
export const sandboxFoldingExtensions: Extension[] = [
  codeFolding(),
  Prec.low(
    foldGutter({
      markerDOM: chevronMarkerDOM
    })
  ),
  keymap.of(foldKeymap)
];
