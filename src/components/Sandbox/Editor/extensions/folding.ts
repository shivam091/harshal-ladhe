import { codeFolding, foldGutter, foldKeymap } from "@codemirror/language";
import { Compartment, Prec, type Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { createChevronDownIcon, createChevronRightIcon } from "@/components/Sandbox/Editor/extensions/search-icons";

/*
  Code folding — each language already tags foldable nodes via foldNodeProp, so codeFolding()
  just wires the fold/unfold state machine up to whatever the active language already marked.
  On by default (SandboxUIContext's showFolding) — FoldingToggle drops it entirely via
  foldingCompartment.reconfigure([]), which also makes any already-folded regions reappear since
  removing codeFolding() from state drops its own fold-range StateField along with it.
*/

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
  the right of Sandpack's own line-number gutter. foldKeymap adds the standard fold/unfold shortcuts.
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

// Reconfigured by FoldingToggle (via SandboxCodeEditor) to sandboxFoldingCoreExtension or [] at runtime.
export const foldingCompartment = new Compartment();

export const sandboxFoldingExtensions: Extension[] = [
  foldingCompartment.of(sandboxFoldingCoreExtension)
];
