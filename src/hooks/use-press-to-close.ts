"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Same 167ms (10 frames @ 60fps) hold the header hamburger gives its X→bars closing morph before actually closing.
const CLOSE_ANIMATION_MS = 167;

/*
  Drives an IconDismiss so that pressing it behaves exactly like pressing the header's own
  hamburger toggle while the drawer is open: press-down instantly flattens the ✕ to a line,
  releasing over the button holds that flat line briefly then fires `onClose`, and dragging
  off the button before releasing springs the ✕ back without closing anything.
*/
export function usePressToClose(onClose: () => void) {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  // Flattens the ✕ instantly on press, before any click/release has happened.
  const onPointerDown = useCallback(() => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    setIsPressed(true);
  }, []);

  // Holds the flattened state for CLOSE_ANIMATION_MS after a real click, then fires onClose.
  const onClick = useCallback(() => {
    setIsPressed(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsPressed(false);
      timeoutRef.current = null;
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [onClose]);

  // Dragging off the button before releasing cancels the flatten — same as the header hamburger.
  const onPointerLeave = useCallback(() => {
    if (timeoutRef.current !== null) return;
    setIsPressed(false);
  }, []);

  return { isPressed, onPointerDown, onClick, onPointerLeave };
}
