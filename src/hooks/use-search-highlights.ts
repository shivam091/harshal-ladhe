import { useLayoutEffect, type RefObject } from "react";

// Name of the highlight painting near-exact title and excerpt matches, styled by ::highlight() in SearchResult.styles.ts.
export const SEARCH_HIT_HIGHLIGHT = "search-hit";

// Name of the highlight painting article-text matches, which always read as highlighted.
export const SEARCH_BODY_HIT_HIGHLIGHT = "search-body-hit";

// A text-bearing element plus the inclusive character ranges within it to paint.
export interface HighlightTarget {
  ref: RefObject<HTMLElement | null>;
  ranges: [number, number][];
  highlightName: string;
}

// Rows share one highlight per name because the registry is global, so each row adds and removes only its own ranges.
function getSharedHighlight(name: string): Highlight {
  let highlight = CSS.highlights.get(name);
  if (!highlight) {
    highlight = new Highlight();
    CSS.highlights.set(name, highlight);
  }
  return highlight;
}

/*
  Paints match ranges over a row's text without wrapping it in <mark>, so the text stays one plain
  text node. Does nothing where the Custom Highlight API is missing: the text simply isn't marked.
*/
export function useSearchHighlights(targets: HighlightTarget[], dependencyKey: unknown): void {
  useLayoutEffect(() => {
    if (typeof CSS === "undefined" || !("highlights" in CSS)) return;

    const added: { highlight: Highlight; range: StaticRange }[] = [];

    for (const { ref, ranges, highlightName } of targets) {
      const textNode = ref.current?.firstChild;
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) continue;

      const highlight = getSharedHighlight(highlightName);

      for (const [start, end] of ranges) {
        const range = new StaticRange({
          startContainer: textNode,
          startOffset: start,
          endContainer: textNode,
          endOffset: end + 1
        });
        highlight.add(range);
        added.push({ highlight, range });
      }
    }

    return () => {
      for (const { highlight, range } of added) highlight.delete(range);
    };
    // `targets` is rebuilt every render; the hit it derives from is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependencyKey]);
}
