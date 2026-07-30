"use client";

import { useCallback, useEffect, useState } from "react";

/*
  Tracks an element's live viewport bounding box. Returns a callback ref
  (not a plain RefObject) so we're notified exactly when the DOM node
  attaches — a plain ref's `.current` mutating doesn't trigger a re-render or
  re-run any effect, so an effect keyed off a RefObject would never notice an
  element that mounts *after* the first render (e.g. once async data finishes
  loading and the element it's attached to conditionally appears).

  Recalculates on resize and on scroll (capture phase, so scrolling within an
  ancestor container like a sticky sidebar's inner list is caught too, not
  just window-level scroll).
*/
export function useBoundingBox<T extends Element>(): [(node: T | null) => void, DOMRect | null] {
  const [element, setElement] = useState<T | null>(null);
  const [boundingBox, setBoundingBox] = useState<DOMRect | null>(null);

  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const updateBoundingBox = () => setBoundingBox(element.getBoundingClientRect());
    updateBoundingBox();

    window.addEventListener("resize", updateBoundingBox);
    window.addEventListener("scroll", updateBoundingBox, true);
    return () => {
      window.removeEventListener("resize", updateBoundingBox);
      window.removeEventListener("scroll", updateBoundingBox, true);
    };
  }, [element]);

  return [ref, boundingBox];
}
